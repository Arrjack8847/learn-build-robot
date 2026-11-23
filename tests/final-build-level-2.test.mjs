import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
const load = path => JSON.parse(read(path));
const audit = load("src/data/finalBuild/level-2-audit.json");
const refs = load("src/data/finalBuild/level-2-references.json");
const checks = load("src/data/finalBuild/level-2-checklists.json");
const provenance = load("src/data/finalBuild/level-2-image-provenance.json");
const syllabus = read("src/data/advancedSyllabus.ts");
const projects = read("src/data/practical.ts");
const manualSource = read("src/data/pdfActivityManuals.ts");
const wixSource = read("src/data/levelOneToThreeWixPdfUrls.ts");
const history = load("reports/building-english-levels1-4-wix-links-20261119.json");
const wixMatch = wixSource.match(/export const levelOneToThreeWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/);
assert.ok(wixMatch, "Wix registry must be parseable");
const wix = JSON.parse(wixMatch[1]);
const variants = audit.variants;
const ownerFallbacks = load("src/data/finalBuild/level-2-owner-approved-pdf-fallbacks.json");

test("59 official Level 2 syllabus projects reconcile with 60 registered variants", () => {
  const m = syllabus.match(/export const ADVANCED_SYLLABUS = (\{[\s\S]*?\}) as const;/);
  assert.ok(m);
  const official = JSON.parse(m[1])["2"];
  assert.equal(official.reduce((s, category) => s + category.length - 1, 0), 59);
  assert.equal(audit.counts.syllabusProjects, 59);
  assert.equal(audit.counts.registeredBuildingProjects, 59);
  assert.equal(audit.counts.registeredManualVariants, 60);
  assert.equal(variants.length, 60);
  assert.equal(new Set(variants.map(v => v.projectId)).size, 59);
  assert.equal(new Set(variants.map(v => v.variantId)).size, 60);
  assert.equal(new Set(variants.map(v => v.source.url)).size, 60);
  assert.deepEqual(variants.filter(v => v.officialName === "See Saw").map(v => v.variantLabel).sort(), ["Version 1", "Version 2"]);
});

test("all source URLs, manual filenames and canonical IDs match exact registries", () => {
  const variables = Object.fromEntries([...manualSource.matchAll(/const (\w+) = staticPdfUrl\("([^"]+)"\)/g)].map(m => [m[1], m[2]]));
  const manualNames = new Map([...manualSource.matchAll(/"(level-2-[^"]+)": \{\s*id: "[^"]+", title: "[^"]+", url: (\w+)/g)].map(m => [m[1], variables[m[2]]]));
  for (const v of variants) {
    assert.equal(v.level, 2);
    assert.match(v.projectId, /^level-2-/);
    assert.ok(projects.includes('pdfManualProject("'+v.variantId+'",'), "Unregistered "+v.variantId);
    assert.equal(manualNames.get(v.variantId), v.source.registryFilename);
    assert.equal(wix[v.source.registryFilename], v.source.url);
    assert.match(v.source.url, /^https:\/\/[^/]+\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf$/);
    assert.equal(v.source.type, "registered-building-manual");
    assert.ok(v.officialName && v.category && v.categoryId);
  }
});

test("36 repaired Wix mapping histories are SHA-1 evidence, not fabricated SHA-256", () => {
  const restored = new Map(history.urls.filter(x => x.level === 2).map(x => [x.path.slice(7), x]));
  assert.equal(restored.size, 36);
  for (const v of variants) {
    const recorded = restored.get(v.source.registryFilename);
    if (recorded) {
      assert.equal(v.source.priorEvidence.gitBlobSha1, recorded.approvedGitBlob);
      assert.equal(v.source.url, recorded.updatedUrl);
      assert.match(v.source.priorEvidence.gitBlobSha1, /^[a-f0-9]{40}$/);
    } else {
      assert.equal(v.source.priorEvidence, null);
    }
    if (v.source.sha256 === null) assert.equal(v.status, "blocked");
  }
});

test("blocked records have explicit reasons and never appear in approval lists", () => {
  const approved = variants.filter(v => v.status === "approved");
  const blocked = variants.filter(v => v.status === "blocked");
  assert.equal(audit.counts.approved, approved.length);
  assert.equal(approved.length, 30);
  assert.equal(provenance.variants.length, 30);
  assert.equal(audit.counts.blocked, blocked.length);
  assert.equal(blocked.length, 30);
  assert.equal(audit.counts.unresolved, variants.length-approved.length-blocked.length);
  const refIds = new Set(refs.references.map(x=>x.variantId));
  const checklistIds = new Set(checks.checklists.map(x=>x.variantId));
  for (const v of blocked) {
    assert.ok(v.blockedReason.length > 25);
    assert.ok(!refIds.has(v.variantId));
    assert.ok(!checklistIds.has(v.variantId));
    assert.equal(v.validation.pass1, false);
    assert.equal(v.validation.pass2, false);
  }
});

function webpDimensions(buffer) {
  assert.equal(buffer.toString("ascii",0,4),"RIFF");
  assert.equal(buffer.toString("ascii",8,12),"WEBP");
  const kind=buffer.toString("ascii",12,16);
  if(kind==="VP8X") return [buffer.readUIntLE(24,3)+1,buffer.readUIntLE(27,3)+1];
  if(kind==="VP8L") return [1 + (((buffer[22]&0x3f)<<8)|buffer[21]),1+(((buffer[24]&15)<<10)|(buffer[23]<<2)|((buffer[22]&0xc0)>>6))];
  if(kind==="VP8 ") return [buffer.readUInt16LE(26)&0x3fff,buffer.readUInt16LE(28)&0x3fff];
  throw Error("Unsupported WebP: "+kind);
}

test("every future approval requires image bytes, dimensions, SHA-256, two passes and five cited questions", () => {
  const byRef = new Map(refs.references.map(x=>[x.variantId,x]));
  const byCheck = new Map(checks.checklists.map(x=>[x.variantId,x]));
  for (const v of variants.filter(x=>x.status==="approved")) {
    assert.match(v.source.sha256,/^[0-9a-f]{64}$/);
    assert.ok(Number.isInteger(v.source.pageCount)&&v.source.pageCount>0);
    assert.equal(v.validation.pass1,true);
    assert.equal(v.validation.pass2,true);
    assert.equal(v.validation.actualPdfByteInspection,true);
    assert.equal(v.validation.pdfPageVisualInspection,true);
    assert.equal(v.validation.webpReopened,true);
    assert.equal(v.source.englishCleanedConfirmed,true);
    const ref=byRef.get(v.variantId);
    assert.ok(ref&&ref.approved===true);
    assert.equal(ref.sourceSha256,v.source.sha256);
    const path="public/final-build/level-2/"+v.image.filename;
    assert.ok(existsSync(new URL(path,root)),"Missing "+path);
    const imageBytes=readFileSync(new URL(path,root));
    const webpSha256=createHash("sha256").update(imageBytes).digest("hex");
    assert.equal(webpSha256,v.image.sha256);
    assert.equal(webpSha256,ref.imageSha256);
    assert.equal(v.image.path,ref.imagePath);
    assert.equal(ref.imagePath,"/final-build/level-2/"+v.image.filename);
    const prov=provenance.variants.find(x=>x.id===v.variantId);
    assert.ok(prov);
    assert.equal(prov.sha256,webpSha256);
    assert.equal(prov.pageCount,undefined);
    assert.equal(prov.page,v.image.pdfPage);
    const [width,height]=webpDimensions(imageBytes);
    assert.equal(width,v.image.width);
    assert.equal(height,v.image.height);
    assert.ok(width>=320&&height>=200);
    const items=byCheck.get(v.variantId)?.questions;
    assert.equal(items?.length,5);
    assert.equal(new Set(items.map(q=>q.text)).size,5);
    for(const q of items) {
      assert.ok(q.text.length>12&&q.evidenceNote.length>15);
      assert.ok(q.text.endsWith("?"));
      assert.ok(q.evidenceNote.includes("page "+q.pdfPage));
      assert.ok(Number.isInteger(q.pdfPage)&&q.pdfPage>=1&&q.pdfPage<=v.source.pageCount);
    }
  }
});

test("Level 2 reuses shared exam source; static 4.2-second/15-minute constants survive", () => {
  const route=read("src/routes/practical/level-2.final-build.tsx");
  const exam=read("src/components/practical/FinalBuildExam.tsx");
  assert.match(route,/FinalBuildExam level=\{2\}/);
  assert.match(exam,/const SCAN_MS = 4200/);
  assert.match(exam,/const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(exam,/prev\.checks\.filter\(Boolean\)\.length >= 4/);
  assert.match(exam,/window\.localStorage/);
  assert.match(exam,/Retry Same Robot/);
});

test("provenance and source SHA-256 linkage stay one-to-one for all 30 approvals", () => {
  const approved=variants.filter(v=>v.status==="approved");
  const entries=new Map(provenance.variants.map(v=>[v.id,v]));
  assert.equal(entries.size,30);
  for(const v of approved){
    const p=entries.get(v.variantId);
    assert.ok(p);
    assert.equal(v.source.sha256,refs.references.find(r=>r.variantId===v.variantId).sourceSha256);
    assert.equal(v.image.sha256,p.sha256);
    assert.equal(v.image.width,p.width);
    assert.equal(v.image.height,p.height);
    assert.equal(v.image.pdfPage,p.page);
    assert.equal(checks.checklists.find(c=>c.variantId===v.variantId).questions.length,5);
  }
});
test.todo("INTEGRATION: scanner discovery must draw only approved projects, not merely registered Building PDFs");
test.todo("INTEGRATION: replace generic title-heuristic checklist and dynamic PDF crop with verified variant checklist and WebP");
test("recorded headless Chromium mobile scanner QA covers all four viewports", () => {
  // This asserts the independently captured browser execution report; it does
  // not pretend that node:test itself launches Chromium on each invocation.
  const report=load("reports/final-build-level-2-responsive-qa-20261123.json");
  assert.equal(report.pass,true);
  assert.deepEqual(report.results.map(r=>r.width),[320,375,390,430]);
  for(const r of report.results){
    assert.equal(r.http,200);
    assert.ok(r.initialOverflow<=1&&r.postScanOverflow<=1);
    assert.ok(r.scannerDurationMs>=3900&&r.scannerDurationMs<=6000);
    assert.equal(r.disabled,true);
    assert.equal(r.hasReference,true);
    assert.equal(r.hasBlockedWarning,true);
    assert.deepEqual(r.errors,[]);
  }
});


test("cdn-hosted source image integrity evidence covers 30 approved Level 2 WebPs", () => {
  const report = load("reports/final-build-level-2-wix-cdn-sha256-20261123.json");
  const urls = load("src/data/finalBuild/level-2-wix-image-urls.json").urls;
  assert.equal(report.testVectorSha256, "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(report.count, 30);
  assert.equal(report.passed, 30);
  assert.equal(report.failed, 0);
  const seen = new Set();
  for (const row of report.results) {
    const reference = refs.references.find(item => item.variantId === row.id);
    assert.ok(reference);
    assert.ok(!seen.has(row.id));
    seen.add(row.id);
    assert.equal(row.url, urls[row.id]);
    assert.equal(row.httpStatus, 200);
    assert.equal(row.passed, true);
    assert.ok(Object.values(row.checks).every(Boolean));
    assert.equal(row.expectedSha256, reference.imageSha256);
    assert.equal(row.actualSha256, reference.imageSha256);
    assert.equal(row.actualBytes, reference.imageBytes);
    assert.equal(row.actualWidth, reference.imageWidth);
    assert.equal(row.actualHeight, reference.imageHeight);
  }
  assert.equal(seen.size, 30);
  for (const blockedId of refs.blockedVariantIds) assert.ok(!seen.has(blockedId));
});

test("owner-approved 60-variant inclusion preserves provenance and 30 source-backed WebPs", () => {
  assert.equal(ownerFallbacks.level, 2);
  assert.equal(ownerFallbacks.records.length, 30);
  assert.equal(refs.references.length, 30);
  assert.equal(checks.checklists.length, 30);
  assert.equal(ownerFallbacks.verifiedSourceWebpsPreserved, 30);
  const legacyBlocks = new Set(variants.filter(v=>v.status==="blocked").map(v=>v.variantId));
  assert.deepEqual(new Set(ownerFallbacks.records.map(v=>v.variantId)), legacyBlocks);
  const approvedIds = new Set(refs.references.map(v=>v.variantId));
  const variantIds = new Set(approvedIds);
  let generalCount = 0;
  for (const fallback of ownerFallbacks.records) {
    const original = variants.find(v=>v.variantId===fallback.variantId);
    assert.ok(original);
    assert.ok(!variantIds.has(fallback.variantId));
    variantIds.add(fallback.variantId);
    assert.equal(fallback.ownerAuthorized, true);
    assert.equal(fallback.independentlySourceApproved, false);
    assert.equal(fallback.reference.url, original.source.url);
    assert.equal(fallback.reference.sha256, original.source.sha256);
    assert.equal(fallback.reference.pageCount, original.source.pageCount);
    assert.equal(fallback.reference.sourceKindIndependentlyConfirmed, false);
    assert.equal(fallback.image.approvedWebp, false);
    assert.equal(fallback.image.webpUrl, null);
    assert.equal(fallback.assessment.independentlyPdfVerified, false);
    assert.equal(fallback.assessment.questions.length, 5);
    for (const question of fallback.assessment.questions) {
      assert.ok(question.text.includes(original.officialName));
      assert.equal(question.evidenceType, "general-observable-not-pdf-verified");
      assert.equal(question.pdfPage, null);
      generalCount++;
    }
  }
  assert.equal(variantIds.size, 60);
  assert.equal(generalCount, 150);
  assert.equal(checks.checklists.reduce((count, row)=>count+row.questions.length, 0)+generalCount, 300);
});
