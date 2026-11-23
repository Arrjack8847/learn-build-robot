import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const json = (path) => JSON.parse(read(path));
const audit = json("src/data/finalBuild/level-6-audit.json");
const refs = json("src/data/finalBuild/level-6-references.json");
const checklists = json("src/data/finalBuild/level-6-checklists.json");
const original = json("reports/level6-building-cover-audit-20261119.json");
const previous = json("reports/level5-6-building-independent-verification-20261120.json");
const linkOnly = json("reports/level6-building-link-only-paths-20261120.json");
const globalApprovals = json("src/data/finalBuildApprovals.json");
const lessonSrc = read("src/data/levelFiveSixContent.ts");
const wixSrc = read("src/data/levelSixWixPdfUrls.ts");
const syllabusSrc = read("src/data/advancedSyllabus.ts");
const lessons = JSON.parse(lessonSrc.match(/export const levelFiveSixLessons: readonly AdvancedLessonAsset\[\] = (\[[\s\S]*?\]);/)[1]);
const wix = JSON.parse(wixSrc.match(/export const levelSixWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/)[1]);
const syllabus = JSON.parse(syllabusSrc.match(/export const ADVANCED_SYLLABUS = (\{[\s\S]*?\}) as const;/)[1]);
const isSha256 = (s) => typeof s === "string" && /^[0-9a-f]{64}$/.test(s);
const isBlobSha = (s) => typeof s === "string" && /^[0-9a-f]{40}$/.test(s);
const vid = (o) => o.projectId + "|" + o.variantId;
const index = (arr) => new Map(arr.map(x => [vid(x),x]));
const byRef = index(refs.entries), byChecklist = index(checklists.entries);
const approved = audit.variants.filter(x => x.approved && x.studentSelectable);
const blocked = audit.variants.filter(x => !x.approved || !x.studentSelectable);
const repaired = ["Red Light Warning Device", "Pay by card", "Product Search", "Rock-paper-scissors Robot"];

function webpDimensions(bytes) {
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  const sig = bytes.indexOf(Buffer.from([0x9d,0x01,0x2a]), 20);
  assert.ok(sig >= 0, "VP8 lossy frame signature missing");
  return [(bytes.readUInt16LE(sig+3)&0x3fff),(bytes.readUInt16LE(sig+5)&0x3fff)];
}

test("43 official Level 6 syllabus projects, 39 Building-source projects, 41 variants", () => {
  assert.equal(syllabus["6"].reduce((n,c) => n + c.length - 1,0),43);
  const six = lessons.filter(l => l.level===6);
  assert.equal(six.length,43);
  assert.equal(six.filter(l=>l.buildingBasic||l.buildingOptimized).length,39);
  assert.equal(six.reduce((n,l)=>n+Number(Boolean(l.buildingBasic))+Number(Boolean(l.buildingOptimized)),0),41);
  assert.equal(audit.variants.length,41);
  assert.equal(new Set(audit.variants.map(v=>v.projectId)).size,39);
  assert.equal(refs.entries.length,41);
  assert.equal(checklists.entries.length,41);
});

test("four presentation-only projects cannot silently use a Learning PDF as a Building source",()=>{
  const missing = lessons.filter(l=>l.level===6&&!l.buildingBasic&&!l.buildingOptimized);
  assert.deepEqual(missing.map(l=>l.title).sort(), ["Ball Tracking","Dancing Robot","Finger-guessing Robot","Matador"].sort());
  assert.deepEqual(audit.missingActivities.map(x=>x.projectId).sort(),missing.map(x=>x.id).sort());
  assert.ok(audit.missingActivities.every(x=>x.excludedFromStudentDraw&&x.buildingSource===null));
});

test("every canonical manual ID and Basic/Optimized variant maps to the unchanged live Wix URL",()=>{
  const expected=lessons.filter(l=>l.level===6).flatMap(l=>[
    l.buildingBasic&&{projectId:l.id,variantId:l.id,sourcePath:"public/"+l.buildingBasic},
    l.buildingOptimized&&{projectId:l.id,variantId:l.id+":optimized",sourcePath:"public/"+l.buildingOptimized}
  ].filter(Boolean));
  const found=index(audit.variants);
  assert.equal(found.size,41);
  assert.deepEqual(expected.map(vid).sort(),[...found.keys()].sort());
  assert.deepEqual(linkOnly.paths.slice().sort(),expected.map(x=>x.sourcePath).sort());
  for(const x of expected){
    const a=found.get(vid(x));
    assert.equal(a.sourcePath,x.sourcePath);
    assert.equal(a.currentWixUrl,wix[x.sourcePath.slice(7)]);
    assert.match(a.currentWixUrl,/^https:\/\/[^/]+\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf$/i);
  }
  for(const p of ["Super Scorpion","Gibbon"]){
    const v=audit.variants.filter(x=>x.projectTitle===p);
    assert.deepEqual(v.map(x=>x.variantKey).sort(),["basic","optimized"]);
    assert.notEqual(v[0].currentWixUrl,v[1].currentWixUrl);
  }
});

test("all current Wix PDFs have recorded real SHA-256, page counts and version evidence",()=>{
  let pages=0, bytes=0, changed=0;
  for(const a of audit.variants){
    const old=original.files.find(x=>x.path===a.sourcePath);
    assert.ok(old);
    assert.equal(a.historicalOriginalGitBlobSha1,old.original_blob_sha);
    assert.ok(isBlobSha(a.currentWixGitBlobSha1));
    assert.ok(isSha256(a.currentWixPdfSha256));
    assert.equal(a.currentWixBytesVerifiedThisRun,true);
    assert.ok(Number.isInteger(a.currentWixPdfPageCountVerifiedThisRun)&&a.currentWixPdfPageCountVerifiedThisRun>0);
    assert.equal(a.currentWixPdfPageCountVerifiedThisRun,a.reportedOriginalPageCount);
    assert.ok(Number.isInteger(a.currentWixPdfByteCount)&&a.currentWixPdfByteCount>10000);
    assert.equal(a.sourceVersionEvidence.currentDownloadedPdfSha256,a.currentWixPdfSha256);
    const differs = a.currentWixGitBlobSha1!==a.historicalOriginalGitBlobSha1;
    assert.equal(differs,repaired.includes(a.projectTitle),a.projectTitle+" correct source replacement identification");
    if(differs)changed++;
    pages+=a.currentWixPdfPageCountVerifiedThisRun;
    bytes+=a.currentWixPdfByteCount;
    assert.equal(a.chineseReview.allPagesEnglishOnlyVisuallyCertified,false,
      "Never claim a human English-only certification not performed");
  }
  assert.equal(changed,4);
  assert.equal(pages,1007);
  assert.equal(bytes,507053975);
  assert.equal(audit.sourceCertifications.currentPdfHashesSha256Computed,41);
  assert.equal(previous.automatedContentQA.fullIndependentHumanPageByPageVisualCertification,false);
});

test("the four repaired Wix PDF URLs are retained exactly",()=>{
  const names={
    "Red Light Warning Device":"78042f_613e0c239ba64e96ba94d3088dff2c3d.pdf",
    "Pay by card":"78042f_4509b73b391142b3866b767bdb5bbc6e.pdf",
    "Product Search":"78042f_6ece41989cab43b3a0a3a58f5586a493.pdf",
    "Rock-paper-scissors Robot":"78042f_ee943e948c6f4141b53d9d3e90481801.pdf"
  };
  for(const [title,file] of Object.entries(names)){
    const a=audit.variants.find(x=>x.projectTitle===title);
    assert.ok(a);
    assert.ok(a.currentWixUrl.endsWith("/"+file));
    assert.ok(isSha256(a.currentWixPdfSha256));
    assert.equal(a.sourceVersionEvidence.changedRepairPreserved,true);
  }
  const fixed=previous.verifiedNewCorrections.find(x=>x.level===6&&x.name==="Red Light Warning Device");
  assert.equal(audit.variants.find(x=>x.projectTitle===fixed.name).currentWixUrl,fixed.newWixUrl);
  assert.equal(audit.variants.find(x=>x.projectTitle===fixed.name).currentWixGitBlobSha1,fixed.approvedNewBlob);
});

test("every one of 41 genuine candidate WebPs exists, decodes structurally and matches recorded SHA-256/dimensions",()=>{
  for(const a of audit.variants){
    const r=byRef.get(vid(a));
    assert.ok(r);
    assert.equal(r.sourceUrl,a.currentWixUrl);
    assert.equal(r.sourcePdfSha256,a.currentWixPdfSha256);
    assert.ok(Number.isInteger(r.sourcePage) && r.sourcePage>0 && r.sourcePage<=a.currentWixPdfPageCountVerifiedThisRun);
    assert.deepEqual(r.crop,a.finishedModel.cropNormalized);
    const clip=r.crop;
    assert.ok(Object.values(clip).every(Number.isFinite));
    assert.ok(clip.x>=0&&clip.y>=0&&clip.width>0&&clip.height>0);
    assert.ok(clip.x+clip.width<=1.000001&&clip.y+clip.height<=1.000001);
    assert.match(r.imageWebp,/^public\/final-build\/level-6\/[a-z0-9-]+\.webp$/);
    assert.ok(existsSync(new URL(r.imageWebp,root)));
    const bytes=readFileSync(new URL(r.imageWebp,root));
    assert.ok(bytes.length>3000 && bytes.length<100000);
    assert.equal(createHash("sha256").update(bytes).digest("hex"),r.imageWebpSha256);
    assert.ok(isSha256(r.imageWebpSha256));
    assert.deepEqual(webpDimensions(bytes),[r.imageWidth,r.imageHeight]);
    assert.ok(r.imageWidth>=250 && r.imageHeight>=200);
    assert.equal(a.webp.path,r.imageWebp);
    assert.equal(a.webp.sha256,r.imageWebpSha256);
    assert.equal(a.webp.inspectedAfterConversion,true);
    assert.ok(a.webp.artifactSourceCorrelation>.94);
  }
});

test("approval/blocked separation: 39 independently inspected variants, two unverified remain blocked",()=>{
  assert.equal(approved.length,39);
  assert.equal(blocked.length,2);
  assert.equal(audit.counts.approvedVariants,39);
  assert.equal(audit.counts.blockedVariants,2);
  assert.equal(audit.counts.publishedWebps,41);
  assert.equal(refs.approvedCount,39);
  assert.equal(refs.blockedCount,2);
  assert.equal(checklists.approvedCount,39);
  assert.equal(checklists.blockedCount,2);
  assert.deepEqual(blocked.map(x=>x.variantId).sort(),[
    "level-6-super-scorpion:optimized","level-6-rock-paper-scissors-robot"
  ].sort());
  for(const a of audit.variants){
    const r=byRef.get(vid(a)),q=byChecklist.get(vid(a));
    assert.ok(r&&q);
    assert.equal(a.approved,r.approved);
    assert.equal(a.approved,q.approved);
    assert.equal(a.studentSelectable,a.approved);
    if(a.approved){
      assert.equal(a.status,"approved");
      assert.equal(a.independentSecondPass.status,"approved");
      assert.ok(a.independentSecondPass.reviewer);
      assert.equal(a.finishedModel.visualIdentityVerified,true);
      assert.equal(a.finishedModel.variantIdentityVerified,true);
      assert.equal(a.finishedModel.studentImageFreeOfInstructionsVerified,true);
      assert.ok(a.webp.maxEdgeNonwhiteFraction<=.06);
    }else{
      assert.equal(r.status,"blocked");
      assert.equal(q.status,"blocked");
      assert.ok(a.blockers.length>=1);
      assert.equal(a.independentSecondPass.status,"blocked");
    }
  }
});

test("all 41 manuals have exactly five specific questions, but only 195 approved questions are student-eligible",()=>{
  assert.equal(checklists.entries.reduce((n,q)=>n+q.questions.length,0),205);
  assert.equal(audit.counts.verifiedChecklistQuestions,195);
  for(const a of audit.variants){
    const q=byChecklist.get(vid(a));
    assert.equal(q.questions.length,5);
    assert.equal(q.sourcePdfSha256,a.currentWixPdfSha256);
    assert.deepEqual(q.questions.map(x=>x.id).sort(),[1,2,3,4,5].map(i=>a.variantId+"-q"+i).sort());
    assert.equal(new Set(q.questions.map(x=>x.text)).size,5);
    for(const c of q.questions){
      assert.equal(typeof c.text,"string");
      assert.ok(c.text.trim().length>=28);
      assert.ok(c.text.trim().endsWith("?"));
      assert.deepEqual(c.evidencePages,[q.sourceEvidencePage]);
      assert.ok(c.evidencePages.every(p=>p>0&&p<=a.currentWixPdfPageCountVerifiedThisRun));
      assert.equal(c.verified,a.approved);
      assert.ok(typeof c.verificationNotes==="string"&&c.verificationNotes.length>10);
    }
  }
});

test("global approval/engine ownership still held by integration worker: no premature student release",()=>{
  const cert=new Set(refs.entries.filter(r=>r.approved).map(vid));
  const auditCert=new Set(audit.variants.filter(r=>r.approved&&r.studentSelectable).map(vid));
  assert.deepEqual([...cert].sort(),[...auditCert].sort());
  assert.equal(cert.size,39);
  assert.equal(globalApprovals.references.filter(r=>r.level===6&&r.approved).length,0);
  assert.equal(audit.releaseGate.approved,false);
  const engine=read("src/components/practical/FinalBuildExam.tsx");
  assert.match(engine,/a\.approved === true/);
  assert.match(engine,/Boolean\(approval && pictureReady && variant\?\.hostedOnWix\)/);
  assert.match(engine,/disabled=\{!startAllowed\}/);
});

test("shared Level 1 4.2-second scanner, strict 15-minute clock, persistence and retry unchanged",()=>{
  const engine=read("src/components/practical/FinalBuildExam.tsx");
  const registry=read("src/data/finalBuildRegistry.ts");
  assert.match(engine,/const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(engine,/const SCAN_MS = 4200/);
  assert.match(engine,/deadline: startedAt \+ LIMIT_MS/);
  assert.match(engine,/window\.localStorage\.setItem/);
  assert.match(engine,/prev\.completedAt <= prev\.deadline/);
  assert.match(engine,/prev\.checks\.filter\(Boolean\)\.length >= 4/);
  assert.match(engine,/Retry Same Robot/);
  assert.match(engine,/Discover Another Robot/);
  assert.match(registry,/crypto\.getRandomValues\(array\)/);
  assert.match(registry,/value >= limit/);
  assert.ok(engine.includes("FinalBuildScanner"));
});
