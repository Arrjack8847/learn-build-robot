import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const text = (path) => readFileSync(new URL(path, root), "utf8");
const json = (path) => JSON.parse(text(path));
const audit = json("src/data/finalBuild/level-6-audit.json");
const refs = json("src/data/finalBuild/level-6-references.json");
const checklists = json("src/data/finalBuild/level-6-checklists.json");
const lessonSrc = text("src/data/levelFiveSixContent.ts");
const wixSrc = text("src/data/levelSixWixPdfUrls.ts");
const syllabusSrc = text("src/data/advancedSyllabus.ts");
const lessons = JSON.parse(lessonSrc.match(/export const levelFiveSixLessons: readonly AdvancedLessonAsset\[\] = (\[[\s\S]*?\]);/)[1]);
const urls = JSON.parse(wixSrc.match(/export const levelSixWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/)[1]);
const syllabus = JSON.parse(syllabusSrc.match(/export const ADVANCED_SYLLABUS = (\{[\s\S]*?\}) as const;/)[1]);
const cover = json("reports/level6-building-cover-audit-20261119.json");
const historical = json("reports/level5-6-building-independent-verification-20261120.json");
const pathAudit = json("reports/level6-building-link-only-paths-20261120.json");
const globalApprovals = json("src/data/finalBuildApprovals.json");
const id = (r) => r.projectId + "|" + r.variantId;
const byId = (arr) => new Map(arr.map(r => [id(r), r]));
const sameSet = (a,b) => assert.deepEqual([...a].sort(),[...b].sort());
const hash64 = (s) => typeof s === "string" && /^[0-9a-f]{64}$/.test(s);
const hash40 = (s) => typeof s === "string" && /^[0-9a-f]{40}$/.test(s);

test("canonical syllabus: 43 projects; 39 registered Building sources; 41 variants", () => {
  assert.equal(syllabus["6"].reduce((n,c) => n+c.length-1,0),43);
  const six = lessons.filter(l=>l.level===6);
  assert.equal(six.length,43);
  const registered=six.filter(l=>Boolean(l.buildingBasic||l.buildingOptimized));
  assert.equal(registered.length,39);
  assert.equal(registered.reduce((n,l)=>n+Number(Boolean(l.buildingBasic))+Number(Boolean(l.buildingOptimized)),0),41);
  assert.equal(audit.variants.length,41);
  assert.equal(audit.counts.officialSyllabusProjects,43);
  assert.equal(audit.counts.registeredBuildingVariants,41);
  assert.equal(new Set(audit.variants.map(r=>r.projectId)).size,39);
});

test("all four unregistered Building activities stay excluded; never use Learning as substitute",()=>{
  const six=lessons.filter(l=>l.level===6);
  const missing=six.filter(l=>!l.buildingBasic&&!l.buildingOptimized);
  assert.deepEqual(missing.map(l=>l.title).sort(),[
    "Ball Tracking","Dancing Robot","Finger-guessing Robot","Matador"
  ].sort());
  assert.deepEqual(audit.missingActivities.map(r=>r.projectId).sort(),missing.map(l=>l.id).sort());
  assert.ok(audit.missingActivities.every(r=>r.excludedFromStudentDraw&&r.buildingSource===null));
});

test("41 records exactly follow canonical ID, variant grouping and current Wix URLs",()=>{
  const expected=lessons.filter(l=>l.level===6).flatMap(l=>[
    l.buildingBasic&&{projectId:l.id,variantId:l.id,path:"public/"+l.buildingBasic},
    l.buildingOptimized&&{projectId:l.id,variantId:l.id+":optimized",path:"public/"+l.buildingOptimized}
  ].filter(Boolean));
  assert.equal(expected.length,41);
  assert.equal(new Set(audit.variants.map(id)).size,41);
  const seen=byId(audit.variants);
  for(const v of expected) {
    const got=seen.get(id(v));
    assert.ok(got,id(v)+" missing");
    assert.equal(got.sourcePath,v.path);
    assert.equal(got.currentWixUrl,urls[v.path.slice(7)]);
    assert.equal(got.projectId,v.projectId);
    assert.match(got.currentWixUrl,/^https:\/\/[^/]+\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf$/i);
  }
  assert.equal(Object.keys(urls).filter(p=>p.startsWith("Level 6/Building/")).length,41);
  sameSet(new Set(audit.variants.map(v=>v.sourcePath)),new Set(pathAudit.paths));
  for(const title of ["Super Scorpion","Gibbon"]) {
    const variants=audit.variants.filter(r=>r.projectTitle===title);
    assert.deepEqual(variants.map(r=>r.variantKey).sort(),["basic","optimized"]);
    assert.notEqual(variants[0].currentWixUrl,variants[1].currentWixUrl);
  }
});

test("repaired Wix links are preserved byte-for-byte as URL mappings",()=>{
  const repaired={
    "Rock-paper-scissors Robot":"78042f_ee943e948c6f4141b53d9d3e90481801.pdf",
    "Pay by card":"78042f_4509b73b391142b3866b767bdb5bbc6e.pdf",
    "Product Search":"78042f_6ece41989cab43b3a0a3a58f5586a493.pdf",
    "Red Light Warning Device":"78042f_613e0c239ba64e96ba94d3088dff2c3d.pdf"
  };
  for(const [title,filename] of Object.entries(repaired)){
    const record=audit.variants.find(v=>v.projectTitle===title);
    assert.ok(record);
    assert.ok(record.currentWixUrl.endsWith("/"+filename),title);
    assert.ok(record.sourceVersionEvidence.repairNote,title+" repair provenance");
    assert.ok(record.currentWixPdfSha256===null,"URL is not a verified SHA-256");
  }
  const fix=historical.verifiedNewCorrections.find(r=>r.level===6&&r.name==="Red Light Warning Device");
  assert.ok(fix);
  assert.equal(audit.variants.find(r=>r.projectTitle===fix.name).currentWixUrl,fix.newWixUrl);
});

test("reported original source blobs and 1007 pages agree with historical audit, not current hash certification",()=>{
  assert.equal(cover.files.length,41);
  assert.equal(cover.summary.total_original_pages,1007);
  assert.equal(audit.variants.reduce((s,r)=>s+r.reportedOriginalPageCount,0),1007);
  for(const r of audit.variants) {
    const old=cover.files.find(f=>f.path===r.sourcePath);
    assert.ok(old);
    assert.ok(hash40(r.historicalOriginalGitBlobSha1));
    assert.equal(r.historicalOriginalGitBlobSha1,old.original_blob_sha);
    assert.equal(r.reportedOriginalPageCount,old.original_page_count);
    assert.equal(r.currentWixPdfSha256,null,"legacy blob SHA-1 must not be copied into current SHA-256 field");
    assert.equal(r.currentWixBytesVerifiedThisRun,false);
    assert.equal(r.currentWixPdfPageCountVerifiedThisRun,null);
    assert.equal(r.chineseReview.allPagesEnglishOnlyVisuallyCertified,false);
  }
  assert.equal(historical.automatedContentQA.fullIndependentHumanPageByPageVisualCertification,false);
});

test("reference and checklist manifests have same 41 canonical variant IDs",()=>{
  assert.equal(refs.entries.length,41);
  assert.equal(checklists.entries.length,41);
  sameSet(new Set(refs.entries.map(id)),new Set(audit.variants.map(id)));
  sameSet(new Set(checklists.entries.map(id)),new Set(audit.variants.map(id)));
  const lookup=byId(audit.variants);
  for(const r of refs.entries) {
    const a=lookup.get(id(r));
    assert.equal(r.sourceUrl,a.currentWixUrl);
    assert.equal(r.sourcePath,a.sourcePath);
  }
});

test("unverified references and questions are never promoted or silently completed",()=>{
  const refMap=byId(refs.entries), questionMap=byId(checklists.entries);
  for(const a of audit.variants) {
    const r=refMap.get(id(a)),q=questionMap.get(id(a));
    assert.ok(r&&q);
    assert.equal(a.status,"blocked");
    assert.equal(a.approved,false);
    assert.equal(a.studentSelectable,false);
    assert.equal(r.status,"blocked");
    assert.equal(r.approved,false);
    assert.equal(r.sourcePdfSha256,null);
    assert.equal(r.sourcePage,null);
    assert.equal(r.crop,null);
    assert.equal(r.imageWebp,null);
    assert.equal(r.imageWebpSha256,null);
    assert.equal(q.status,"blocked");
    assert.equal(q.approved,false);
    assert.deepEqual(q.questions,[]);
    assert.equal(a.finishedModel.visualIdentityVerified,false);
    assert.equal(a.independentSecondPass.status,"not_performed");
  }
  assert.equal(audit.counts.approvedVariants,0);
  assert.equal(audit.counts.blockedVariants,41);
  assert.equal(refs.approvedCount,0);
  assert.equal(checklists.approvedCount,0);
  assert.equal(audit.releaseGate.approved,false);
});

test("approval schema requires authentic inspected WebP, proper SHA-256, source pages and five cited questions",()=>{
  const questions=byId(checklists.entries),source=byId(audit.variants);
  for(const r of refs.entries.filter(x=>x.approved)) {
    const a=source.get(id(r)), q=questions.get(id(r));
    assert.ok(a&&q);
    assert.equal(a.status,"approved");
    assert.equal(a.independentSecondPass.status,"approved");
    assert.ok(a.independentSecondPass.reviewer);
    assert.ok(hash64(r.sourcePdfSha256));
    assert.ok(hash64(r.imageWebpSha256));
    assert.ok(Number.isInteger(r.sourcePage)&&r.sourcePage>0);
    assert.ok(r.crop);
    for(const k of ["x","y","width","height"]) assert.ok(Number.isFinite(r.crop[k]));
    assert.ok(r.crop.x>=0&&r.crop.y>=0&&r.crop.width>0&&r.crop.height>0);
    assert.ok(r.crop.x+r.crop.width<=1&&r.crop.y+r.crop.height<=1);
    assert.match(r.imageWebp,/^public\/final-build\/level-6\/[a-z0-9-]+\.webp$/);
    assert.ok(existsSync(new URL(r.imageWebp,root)));
    const buf=readFileSync(new URL(r.imageWebp,root));
    assert.equal(buf.toString("ascii",0,4),"RIFF");
    assert.equal(buf.toString("ascii",8,12),"WEBP");
    assert.equal(createHash("sha256").update(buf).digest("hex"),r.imageWebpSha256);
    assert.ok(Number.isSafeInteger(r.imageWidth)&&r.imageWidth>0);
    assert.ok(Number.isSafeInteger(r.imageHeight)&&r.imageHeight>0);
    assert.equal(q.questions.length,5);
    for(const c of q.questions) {
      assert.ok(typeof c.text==="string"&&c.text.trim().length>=12);
      assert.ok(Array.isArray(c.evidencePages)&&c.evidencePages.length>0);
      assert.ok(c.evidencePages.every(p=>Number.isSafeInteger(p)&&p>0&&p<=a.reportedOriginalPageCount));
      assert.ok(c.verified===true);
    }
  }
});

test("only actual approved Level 6 variants are eligible for student draw",()=>{
  const certified=new Set(refs.entries.filter(r=>r.approved).map(id));
  const auditApproved=new Set(audit.variants.filter(r=>r.studentSelectable && r.approved).map(id));
  sameSet(certified,auditApproved);
  assert.equal(certified.size,0);
  assert.equal(globalApprovals.references.filter(r=>r.level===6&&r.approved).length,0);
  const engine=text("src/components/practical/FinalBuildExam.tsx");
  assert.match(engine,/a\.approved === true/);
  assert.match(engine,/Boolean\(approval && pictureReady && variant\?\.hostedOnWix\)/);
  assert.match(engine,/disabled=\{!startAllowed\}/);
});

test("Level 1 shared scanner timing and 15-minute strict deadline remain unchanged",()=>{
  const engine=text("src/components/practical/FinalBuildExam.tsx");
  const registry=text("src/data/finalBuildRegistry.ts");
  assert.match(engine,/const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(engine,/const SCAN_MS = 4200/);
  assert.match(engine,/deadline: startedAt \+ LIMIT_MS/);
  assert.match(engine,/window\.localStorage\.setItem/);
  assert.match(engine,/Math\.max\(0, session\.deadline - now\)/);
  assert.match(engine,/prev\.completedAt <= prev\.deadline/);
  assert.match(engine,/prev\.checks\.filter\(Boolean\)\.length >= 4/);
  assert.match(engine,/Retry Same Robot/);
  assert.match(engine,/Discover Another Robot/);
  assert.match(registry,/crypto\.getRandomValues\(array\)/);
  assert.match(registry,/value >= limit/);
  assert.ok(engine.includes("FinalBuildScanner"));
});
