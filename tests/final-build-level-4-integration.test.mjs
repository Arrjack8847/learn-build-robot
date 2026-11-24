import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const json = path => JSON.parse(read(path));
const references = json("src/data/finalBuild/level-4-references.json");
const checklists = json("src/data/finalBuild/level-4-checklists.json");
const wix = json("src/data/finalBuild/level-4-wix-image-urls.json");
const fallback = json("src/data/finalBuild/level-4-source-limited-fallbacks.json");
const adapter = read("src/data/finalBuildLevel4Verified.ts");
const shared = read("src/data/finalBuildVerified.ts");
const exam = read("src/components/practical/FinalBuildExam.tsx");
const prototype = read("src/components/practical/FinalBuildPrototype.tsx");

test("Level 4 has 50 registered variants and 250 variant-bound unique questions", () => {
  assert.equal(references.records.length, 50);
  assert.equal(checklists.records.length, 50);
  assert.equal(fallback.entries.length, 2);
  const fallbackById = new Map(fallback.entries.map(row => [row.variantId, row]));
  let count = 0, approved = 0, incomplete = 0;
  const seen = new Set(), qids = new Set();
  for (const record of references.records) {
    assert.ok(!seen.has(record.variantId)); seen.add(record.variantId);
    const checklist = checklists.records.find(row => row.variantId === record.variantId);
    assert.ok(checklist, "Every registered source needs checklist record");
    let questions;
    if (record.approval.status === "approved") {
      approved++;
      assert.equal(record.reference.status, "approved");
      assert.equal(checklist.status, "approved");
      assert.equal(wix.urls[record.variantId], record.reference.wixUrl);
      assert.ok(checklist.questions.every(question => question.approved === true));
      questions = checklist.questions;
    } else {
      incomplete++;
      assert.equal(record.approval.status, "blocked", "Independent approval remains honest");
      assert.equal(checklist.status, "blocked");
      assert.equal(wix.urls[record.variantId], undefined);
      const candidate = fallbackById.get(record.variantId);
      assert.ok(candidate, "Only explicit owner authorization unlocks source-limited PDF");
      assert.equal(candidate.ownerAuthorizedForStudentInclusion, true);
      assert.equal(candidate.verifiedFinishedModel, false);
      assert.equal(candidate.referenceMode, "official-pdf-construction-stage");
      assert.equal(candidate.sourceUrl, record.source.wixUrl);
      assert.equal(candidate.sourcePdfSha256, record.source.hostedPdfSha256);
      assert.equal(candidate.sourcePage, record.reference.sourcePage);
      assert.ok(candidate.limitation.length > 40);
      questions = candidate.questions;
      assert.ok(questions.every(question => question.independentlyReviewed === false));
    }
    assert.equal(questions.length, 5);
    for (const question of questions) {
      assert.equal(question.sourcePdfSha256, record.source.hostedPdfSha256);
      assert.ok(!qids.has(question.id)); qids.add(question.id); count++;
    }
  }
  assert.equal(approved, 48);
  assert.equal(incomplete, 2);
  assert.equal(count, 250);
  assert.equal(qids.size, 250);
});

test("original 48 hosted Wix WebPs remain uniquely mapped, not replaced by new images", () => {
  assert.equal(wix.records.length, 48);
  assert.equal(Object.keys(wix.urls).length, 48);
  assert.equal(new Set(Object.values(wix.urls)).size, 48);
  for (const record of wix.records) {
    const r = references.records.find(row => row.variantId === record.variantId);
    assert.ok(r);
    assert.equal(record.operationStatus, "READY");
    assert.equal(record.mimeType, "image/webp");
    assert.equal(record.private, false);
    assert.equal(record.webpSha256, r.reference.webpSha256);
    assert.equal(record.hostedSha256, r.reference.webpSha256);
    assert.equal(record.url, r.reference.wixUrl);
  }
});

test("all 50 are dispatched through the shared scanner with strict evidence gates", () => {
  assert.match(shared, /getLevelFourEvidence/);
  assert.match(shared, /level === 4\) return getLevelFourEvidence/);
  assert.match(shared, /level === 2\) return getLevelTwoEvidence/);
  assert.match(shared, /level === 6\) return getLevelSixEvidence/);
  assert.match(adapter, /getApprovedLevel4FinalBuildContent/);
  assert.match(adapter, /fallback\.sourcePdfSha256 !== original\.source\.hostedPdfSha256/);
  assert.match(adapter, /fallback\.verifiedFinishedModel !== false/);
  assert.match(adapter, /fallback\.questions\.length !== 5/);
  assert.match(shared, /variants\.filter\(variant => getEvidence/);
});

test("students see an authentic PDF page, construction-stage disclaimer and retry options", () => {
  assert.deepEqual(fallback.entries.map(row => row.variantId).sort(),
    ["level-4-dangerous-assassin", "level-4-horizontal-bar"]);
  assert.match(exam, /level === 4 \|\| level === 6/);
  assert.match(exam, /Official PDF assembly reference · incomplete model view/);
  assert.match(exam, /approval\.referenceNotice/);
  assert.match(prototype, /pdfjs\.getDocument/);
  assert.match(prototype, /sourceLimited/);
  assert.match(exam, /const SCAN_MS = 4200/);
  assert.match(exam, /const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(exam, /prev\.checks\.filter\(Boolean\)\.length >= 4/);
  assert.match(exam, /Retry Same Robot/);
  assert.match(exam, /Discover Another Robot/);
});
