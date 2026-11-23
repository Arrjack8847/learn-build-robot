import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const text = path => readFileSync(resolve(root, path), "utf8");
const data = path => JSON.parse(text(path));
const refs = data("src/data/finalBuild/level-4-references.json");
const lists = data("src/data/finalBuild/level-4-checklists.json");
const audit = data("src/data/finalBuild/level-4-audit.json");
const building = text("src/data/levelFourBuilding.ts");
const wixSrc = text("src/data/levelFourWixPdfUrls.ts");
const syllabusSrc = text("src/data/advancedSyllabus.ts");
const registry = text("src/data/finalBuildRegistry.ts");
const exam = text("src/components/practical/FinalBuildExam.tsx");
const approval = data("src/data/finalBuildApprovals.json");

function registrations() {
  return [...building.matchAll(/\["(level-4-[^"]+)", "([^"]+\.pdf)", "(basic|optimized)"\]/g)]
    .map(([, id, relative, variant]) => ({ projectId:id,relative,variant,
      variantId:id+(variant==="optimized"?":optimized":"") }));
}
const wixMatch = wixSrc.match(/export const levelFourWixPdfUrls:[\s\S]*?= (\{[\s\S]*?\});/);
assert.ok(wixMatch);
const urls = JSON.parse(wixMatch[1]);
const syllabusMatch = syllabusSrc.match(/export const ADVANCED_SYLLABUS = (\{[\s\S]*?\}) as const;/);
assert.ok(syllabusMatch);
const syllabus = JSON.parse(syllabusMatch[1])["4"].flatMap(([category, ...projects]) =>
  projects.map(original => {
    const name=original.replace(/\.(pdf|pptx)$/i,"");
    return { id:"level-4-"+name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),
      name,category };
  }));
const sourceRegs = registrations();
const byId = new Map(refs.records.map(r=>[r.variantId,r]));
const questionSets = new Map(lists.records.map(r=>[r.variantId,r]));

function dimensions(bytes) {
  assert.equal(bytes.toString("ascii",0,4),"RIFF");
  assert.equal(bytes.toString("ascii",8,12),"WEBP");
  let cursor=12;
  while (cursor+8<=bytes.length) {
    const fourcc=bytes.toString("ascii",cursor,cursor+4);
    const chunkLen=bytes.readUInt32LE(cursor+4);
    const dataStart=cursor+8;
    if (fourcc==="VP8 ") {
      assert.equal(bytes[dataStart+3],0x9d,"valid VP8 frame signature");
      assert.equal(bytes[dataStart+4],0x01);
      assert.equal(bytes[dataStart+5],0x2a);
      return {width:bytes.readUInt16LE(dataStart+6)&0x3fff,
        height:bytes.readUInt16LE(dataStart+8)&0x3fff};
    }
    if (fourcc==="VP8X") {
      return {width:1+bytes.readUIntLE(dataStart+4,3),
        height:1+bytes.readUIntLE(dataStart+7,3)};
    }
    if (fourcc==="VP8L") {
      const q=dataStart+1;
      return {width:1+(((bytes[q+1]&0x3f)<<8)|bytes[q]),
        height:1+((((bytes[q+3]&0x0f)<<10)|(bytes[q+2]<<2)|(bytes[q+1]>>6)))};
    }
    cursor+=8+chunkLen+(chunkLen%2);
  }
  assert.fail("No VP8/VP8X/VP8L dimensions found in WebP");
}

test("exact Level 4 registry counts and complete eight-source exclusion", () => {
  assert.equal(syllabus.length,56);
  assert.equal(new Set(syllabus.map(x=>x.id)).size,56);
  assert.equal(sourceRegs.length,50);
  assert.equal(new Set(sourceRegs.map(r=>r.projectId)).size,48);
  assert.equal(sourceRegs.filter(r=>r.variant==="optimized").length,2);
  const absent=syllabus.filter(x=>!sourceRegs.some(r=>r.projectId===x.id)).map(x=>x.id).sort();
  assert.deepEqual(absent,audit.fallbackProjects.map(x=>x.projectId).sort());
  assert.equal(absent.length,8);
  const fromResolver=[...building.match(/LEVEL_FOUR_LEARNING_AS_BUILDING_IDS = \[([\s\S]*?)\] as const;/)[1]
    .matchAll(/"(level-4-[^"]+)"/g)].map(x=>x[1]).sort();
  assert.deepEqual(absent,fromResolver);
  assert.ok(audit.fallbackProjects.every(x=>x.status==="blocked-no-separate-building-source"));
});

test("all 50 canonical variants map one-to-one to current Wix Building PDFs", () => {
  assert.equal(refs.records.length,50);
  assert.equal(byId.size,50);
  assert.equal(new Set(refs.records.map(r=>r.source.wixUrl)).size,50);
  const syllabusMap=new Map(syllabus.map(x=>[x.id,x]));
  for(const reg of sourceRegs){
    const rec=byId.get(reg.variantId);
    assert.ok(rec,reg.variantId);
    assert.equal(rec.projectId,reg.projectId);
    assert.equal(rec.variant,reg.variant);
    assert.equal(rec.projectName,syllabusMap.get(reg.projectId)?.name);
    assert.equal(rec.category,syllabusMap.get(reg.projectId)?.category);
    assert.equal(rec.source.wixUrl,urls["Level 4/Building/"+reg.relative]);
    assert.equal(rec.source.repositoryPath,"public/Level 4/Building/"+reg.relative);
    assert.match(rec.source.wixUrl,/^https:\/\/[^/]+\.usrfiles\.com\/ugd\/[^/]+\.pdf$/);
  }
  for(const project of ["level-4-dangerous-assassin","level-4-warrior-with-claws"]){
    const base=byId.get(project), opt=byId.get(project+":optimized");
    assert.ok(base && opt);
    assert.equal(base.variantLabel,"Basic");
    assert.equal(opt.variantLabel,"Optimized");
    assert.notEqual(base.source.wixUrl,opt.source.wixUrl);
    assert.notEqual(base.reference.webpSha256,opt.reference.webpSha256);
  }
});

test("all 50 actual hosted PDF SHA-256 and page counts are recorded without confusing Git SHA-1", () => {
  assert.equal(audit.counts.hostedPdfSha256Verified,50);
  assert.equal(audit.counts.hostedPdfGitBlobMatches,50);
  assert.equal(audit.counts.hostedPdfPageMatches,50);
  assert.equal(refs.records.reduce((sum,r)=>sum+r.source.hostedPdfPageCount,0),1029);
  for(const r of refs.records){
    const s=r.source;
    assert.match(s.hostedPdfSha256,/^[0-9a-f]{64}$/);
    assert.ok(s.hostedPdfBytes>10000);
    assert.ok(Number.isInteger(s.hostedPdfPageCount)&&s.hostedPdfPageCount>0);
    assert.equal(s.hostedPdfIdentityVerified,true);
    assert.equal(s.hostedPdfPageCount,(s.priorRepairedEnglishWix??s.priorRepositoryOriginal).pageCount);
    assert.match(s.priorRepositoryOriginal.gitBlobSha1,/^[a-f0-9]{40}$/);
    assert.equal(s.hostedPdfVerification.gitBlobMatchesCanonical,true);
    assert.equal(s.hostedPdfVerification.pageCountMatchesCanonical,true);
    assert.equal(s.hostedPdfVerification.extractableChineseCharacters,0);
    // Text scanning does not establish all bitmap annotations are English.
    assert.equal(s.hostedPdfEnglishVerified,false);
  }
  assert.equal(refs.records.filter(r=>r.source.priorRepairedEnglishWix).length,4);
});

test("all 50 source-derived candidate WebP files exist with identical hashes, dimensions and crop provenance",()=>{
  assert.equal(refs.records.length,50);
  let bytesTotal=0;
  for(const r of refs.records){
    const c=r.reference;
    assert.equal(c.status,r.approval.status==="approved"?"approved":"candidate");
    assert.ok(c.path.startsWith("public/final-build/level-4/"));
    assert.ok(c.path.endsWith(".webp"));
    assert.ok(c.sourcePage>=1 && c.sourcePage<=r.source.hostedPdfPageCount);
    assert.ok(/no synthesis|no reconstruction/.test(c.method), "pure source artwork only");
    assert.equal(c.individuallyDecoded,true);
    const crop=c.cropNormalized;
    assert.ok(crop && [crop.x,crop.y,crop.width,crop.height].every(Number.isFinite));
    assert.ok(crop.x>=0 && crop.y>=0 && crop.width>0 && crop.height>0 &&
      crop.x+crop.width<=1.000002 && crop.y+crop.height<=1.000002);
    assert.match(c.webpSha256,/^[a-f0-9]{64}$/);
    const path=resolve(root,c.path);
    assert.ok(existsSync(path),path);
    const image=readFileSync(path);
    bytesTotal+=image.length;
    assert.equal(image.length,c.byteLength,r.variantId+" byte count");
    assert.equal(createHash("sha256").update(image).digest("hex"),c.webpSha256,r.variantId+" image hash");
    assert.deepEqual(dimensions(image),{width:c.width,height:c.height},r.variantId+" pixel size");
  }
  assert.ok(bytesTotal>100000 && bytesTotal<5000000);
  assert.equal(audit.counts.candidateWebp,49);
  assert.equal(audit.counts.approvedWebp,1);
});

test("each of the 50 checklist sets has exactly five distinct robot-specific, evidence-linked drafts",()=>{
  assert.equal(lists.records.length,50);
  assert.equal(questionSets.size,50);
  let total=0;
  for(const r of refs.records){
    const c=questionSets.get(r.variantId);
    assert.ok(c,r.variantId);
    assert.equal(c.projectId,r.projectId);
    assert.equal(c.variant,r.variant);
    assert.equal(c.status,r.approval.status==="approved"?"approved":"blocked");
    assert.equal(c.questions.length,5);
    assert.equal(new Set(c.questions.map(x=>x.text)).size,5);
    for(const q of c.questions){
      assert.ok(q.text.startsWith("Does ") || q.text.startsWith("Are ") ||
        q.text.startsWith("Is ") || q.text.startsWith("Can ") || q.text.startsWith("When ") ||
        q.text.startsWith("With ") || q.text.startsWith("After ") || q.text.startsWith("Do "));
      assert.ok(q.text.length>=65);
      assert.ok(q.evidencePages.includes(r.reference.sourcePage));
      assert.equal(q.sourcePdfSha256,r.source.hostedPdfSha256);
      assert.ok(q.verificationNotes.length>=40);
      assert.equal(q.approved,r.approval.status==="approved");
      assert.equal(q.verificationStatus,r.approval.status==="approved"?"independently-reviewed-visual-assembly":"candidate-unverified");
      total++;
    }
  }
  assert.equal(total,250);
  assert.equal(lists.summary.draftedQuestions,250);
  assert.equal(lists.summary.approvedChecklists,1);
});

test("student approvals fail closed and shared-engine integration blockers are documented",()=>{
  assert.equal(approval.status,"all-unreviewed");
  assert.deepEqual(approval.references,[]);
  assert.equal(refs.records.filter(r=>r.approval.status==="approved").length,1);
  assert.equal(audit.counts.approvedVariants,1);
  assert.equal(audit.counts.blockedVariants,49);
  assert.equal(audit.blockedVariants.length,49);
  assert.match(registry,/getFinalBuildPool/);
  assert.match(registry,/variants\.length > 0/);
  assert.match(exam,/checkDescriptions\(name/);
  assert.match(exam,/approvalData from "@\/data\/finalBuildApprovals.json"/);
  assert.ok(audit.integrationFindings.some(x=>x.id==="LEVEL_4_SHARED_POOL_PREAPPROVAL"));
  assert.ok(audit.integrationFindings.some(x=>x.id==="LEVEL_4_GENERIC_CHECKLIST"));
  assert.ok(audit.integrationFindings.some(x=>x.id==="LEVEL_4_WEBP_RENDERER"));
});

test("locked Level 1-style timer/scanner contracts unchanged by this worker",()=>{
  assert.match(exam,/const SCAN_MS = 4200/);
  assert.match(exam,/const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(exam,/deadline: startedAt \+ LIMIT_MS/);
  assert.match(exam,/localStorage\.setItem/);
  assert.match(exam,/secureRandomIndex\(pool\.length\)/);
  assert.match(exam,/prev\.checks\.filter\(Boolean\)\.length >= 4/);
  assert.match(exam,/Date\.now\(\) <= \(prev\.deadline/);
  assert.match(registry,/crypto\.getRandomValues\(array\)/);
  assert.match(registry,/value >= limit/);
});


test("Level 4 repair provenance, 250 triaged drafts, and one verified Wix mapping", () => {const triage=data("reports/final-build-level-4-semantic-triage-20261123.json");const wix=data("src/data/finalBuild/level-4-wix-image-urls.json");assert.equal(triage.repairs.length,5);assert.equal(triage.questionSets.length,50);assert.equal(triage.questionSets.reduce((n,r)=>n+r.questions.length,0),250);assert.equal(Object.keys(wix.urls).length,1);assert.equal(wix.approvedVariants,1);assert.match(wix.urls["level-4-a-timid-mouse"],/static\.wixstatic\.com\/media\//);for(const x of triage.repairs){const r=byId.get(x.variantId);assert.equal(r.reference.webpSha256,x.webpSha256);assert.equal(r.approval.status,"blocked");assert.equal(r.reference.sourcePage,x.pdfPage);}});


test("A Timid Mouse has five manual-supported questions and a byte-verified READY Wix record",()=>{const ww=data("src/data/finalBuild/level-4-wix-image-urls.json");const rr=byId.get("level-4-a-timid-mouse");const q=questionSets.get(rr.variantId);assert.equal(rr.approval.status,"approved");assert.equal(q.status,"approved");assert.equal(q.questions.length,5);assert.equal(q.questions.filter(z=>z.approved).length,5);assert.equal(ww.records.length,1);assert.equal(ww.records[0].status,"READY");assert.equal(ww.records[0].webpSha256,rr.reference.webpSha256);assert.equal(ww.records[0].hostedSha256,rr.reference.webpSha256);assert.deepEqual(ww.records[0].approvedQuestionIds,q.questions.map(z=>z.id));});
