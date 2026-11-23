import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const json = path => JSON.parse(read(path));
const data = json("src/data/finalBuild/level-5-owner-authorized-pdf-fallbacks.json");
const refs = json("src/data/finalBuild/level-5-references.json");
const checks = json("src/data/finalBuild/level-5-checklists.json");
const images = json("src/data/finalBuild/level-5-wix-image-urls.json");
const historical = json("reports/final-build-level-5-wix-upload-plan-20261123.json");
const adapter = read("src/data/finalBuildVerified.ts");
const exam = read("src/components/practical/FinalBuildExam.tsx");
const candidates = json("src/data/finalBuild/level-5-wix-candidates.json");
const expectedIds = [
  "level-5-crack-shot:optimized",
  "level-5-machine-gun",
  "level-5-facial-recognition-time-clock",
];
test("all 45 registered variants are covered without turning incomplete sources into approved finished WebPs", () => {
  assert.equal(refs.items.length, 45);
  assert.equal(checks.items.length, 45);
  assert.equal(refs.renderableApprovedReferences.length, 42);
  assert.equal(checks.approvedChecklists.length, 42);
  assert.deepEqual(data.items.map(v => v.variantId), expectedIds);
  assert.equal(new Set(data.items.map(v => v.variantId)).size, 3);
  assert.equal(Object.keys(images.urls).length, 42);
  assert.equal(new Set(Object.values(images.urls)).size, 42);
  const imageIds = new Set(Object.keys(images.urls));
  assert.ok(expectedIds.every(id => !imageIds.has(id)));
  assert.equal(new Set([...imageIds, ...expectedIds]).size, 45);
  assert.deepEqual(new Set([...imageIds, ...expectedIds]), new Set(refs.items.map(v => v.variantId)));
  assert.equal(historical.uploads.length, 39);
  for (const row of historical.uploads) assert.equal(images.urls[row.variantId], row.wixUrl);
});
test("the three official PDFs use exact registered identities, page counts, and marked incomplete-view status", () => {
  const counts = new Map([
    ["level-5-crack-shot:optimized", 4],
    ["level-5-machine-gun", 29],
    ["level-5-facial-recognition-time-clock", 7],
  ]);
  for (const item of data.items) {
    const source = refs.items.find(v => v.variantId === item.variantId);
    const oldChecklist = checks.items.find(v => v.variantId === item.variantId);
    const oldCandidate = candidates.candidates.find(v => v.variantId === item.variantId);
    assert.ok(source && oldChecklist && oldCandidate);
    assert.equal(source.projectId, item.projectId);
    assert.equal(source.sourceUrl, item.sourceUrl);
    assert.equal(source.pdfSha256, item.pdfSha256);
    assert.match(item.pdfSha256, /^[0-9a-f]{64}$/);
    assert.equal(item.sourcePage, counts.get(item.variantId));
    assert.equal(item.sourcePageCount, counts.get(item.variantId));
    assert.deepEqual(item.crop, [0,0,1,1]);
    assert.equal(item.status, "owner-authorized-pdf-fallback");
    assert.equal(item.referenceKind, "pdf-instructional");
    assert.equal(item.ownerApprovedForStudentSelection, true);
    assert.equal(item.independentlyVerifiedCompletedImage, false);
    assert.ok(item.limitation.length > 20);
    assert.equal(source.approved, false, "incomplete artwork must remain unverified");
    assert.equal(oldChecklist.approved, false, "do not falsify independent question approval");
    assert.deepEqual(oldChecklist.questions, []);
    assert.equal(oldCandidate.image.webpCreated, false);
    assert.equal(oldCandidate.wix.operationStatus, "NOT_UPLOADED");
  }
});
test("225 total student-facing self-checks, with the last 15 explicitly owner-authorized and general", () => {
  const originalCount = checks.approvedChecklists.reduce((sum, row) => sum + row.questions.length, 0);
  assert.equal(originalCount, 210);
  const allIds = new Set(checks.approvedChecklists.flatMap(row => row.questions.map(q => q.id)));
  let additions = 0;
  for (const item of data.items) {
    assert.equal(item.questions.length, 5);
    for (const q of item.questions) {
      assert.ok(q.text.length >= 30);
      assert.equal(q.evidenceKind, "general-construction-self-assessment");
      assert.equal(q.independentlyVerified, false);
      assert.ok(!allIds.has(q.id));
      allIds.add(q.id);
      additions++;
    }
  }
  assert.equal(additions, 15);
  assert.equal(originalCount + additions, 225);
});
test("shared adapter requires identity/source evidence and exposes PDF-only reference mode", () => {
  assert.match(adapter, /levelFiveOwnerPdfFallbacks/);
  assert.match(adapter, /getOwnerAuthorizedPdfEvidence/);
  assert.match(adapter, /item\.sourceUrl !== variant\.url/);
  assert.match(adapter, /item\.pdfSha256 !== reference\.pdfSha256/);
  assert.match(adapter, /wixImages\[variant\.id\] != null/);
  assert.match(adapter, /referenceMode: "registered-pdf-fallback"/);
  assert.match(adapter, /getEvidence\(level, project\.id, variant\)/);
});
test("shared scanner retains four-point-two second scan, fifteen minute timer, four-of-five pass, retry and PDF disclosure", () => {
  assert.match(exam, /const SCAN_MS = 4200/);
  assert.match(exam, /const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(exam, /prev\.checks\.filter\(Boolean\)\.length >= 4/);
  assert.match(exam, /Retry Same Robot/);
  assert.match(exam, /Discover Another Robot/);
  assert.match(exam, /showRegisteredPdfFallback/);
  assert.match(exam, /level === 5/);
  assert.match(exam, /unfinished assembly step/);
  assert.match(exam, /Open original PDF reference/);
  assert.match(exam, /Self-reported practical completion/);
});
