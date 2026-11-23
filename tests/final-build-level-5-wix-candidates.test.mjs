import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const json = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const audit = json("src/data/finalBuild/level-5-audit.json");
const refs = json("src/data/finalBuild/level-5-references.json");
const checklists = json("src/data/finalBuild/level-5-checklists.json");
const wix = json("src/data/finalBuild/level-5-wix-image-urls.json");
const candidates = json("src/data/finalBuild/level-5-wix-candidates.json");
const approvedIds = new Set(audit.studentScannerSelectableVariantIds);
const restored = new Set([
  "level-5-remote-control-car",
  "level-5-voice-control-snail",
  "level-5-voice-control-vehicle",
]);
const incomplete = new Set([
  "level-5-crack-shot:optimized",
  "level-5-machine-gun",
  "level-5-facial-recognition-time-clock",
]);

test("all original 39 URLs are preserved exactly; three additional Wix URLs are distinct", () => {
  const snapshot = candidates.immutableApprovedMapping;
  assert.equal(snapshot.blobShaAtPreparation, "a91003d468226e4bf29f05ebf6342cb0bc9c04f1");
  assert.equal(snapshot.approvedCount, 39);
  assert.equal(snapshot.original39EntriesPreserved, true);
  assert.equal(Object.keys(snapshot.original39Urls).length, 39);
  for (const [id, url] of Object.entries(snapshot.original39Urls)) {
    assert.equal(wix.urls[id], url, id);
    assert.ok(!restored.has(id), id);
  }
  assert.equal(wix.approvedMapped, 42);
  assert.equal(wix.blockedExcluded, 3);
  assert.equal(Object.keys(wix.urls).length, 42);
  assert.equal(new Set(Object.values(wix.urls)).size, 42);
  assert.ok(Object.values(wix.urls).every(url =>
    /^https:\/\/static\.wixstatic\.com\/media\/.+\.webp$/i.test(url)));
});

test("exact 42 Level 5 source references and 210 observable checks, three blocked", () => {
  assert.equal(audit.variants.length, 45);
  assert.equal(audit.counts.approvedVariants, 42);
  assert.equal(audit.counts.blockedVariants, 3);
  assert.equal(refs.renderableApprovedReferences.length, 42);
  assert.equal(checklists.approvedChecklists.length, 42);
  assert.equal(checklists.items.reduce((n, v) => n + v.questions.length, 0), 210);
  assert.equal(approvedIds.size, 42);
  assert.deepEqual(approvedIds, new Set(refs.items.filter(v => v.approved).map(v => v.variantId)));
  assert.deepEqual(approvedIds, new Set(checklists.items.filter(v => v.approved).map(v => v.variantId)));
  assert.deepEqual(new Set(audit.variants.filter(v => !v.release.approved).map(v => v.variantId)), incomplete);
  for (const blocked of incomplete) {
    assert.ok(!approvedIds.has(blocked) && !(blocked in wix.urls), blocked);
    assert.equal(checklists.items.find(v => v.variantId === blocked)?.questions.length, 0);
    assert.equal(refs.items.find(v => v.variantId === blocked)?.imagePath, null);
  }
});

test("three new Steam Wix model images use exact official PDFs and 15 verified questions", () => {
  assert.equal(candidates.candidates.length, 6);
  assert.equal(candidates.imageReady, 3);
  assert.equal(candidates.wixReady, 3);
  assert.equal(candidates.studentApproved, 3);
  assert.equal(candidates.questionCandidateHandoff.independentlyApprovedQuestionCount, 15);
  for (const item of candidates.candidates) {
    const source = audit.variants.find(v => v.variantId === item.variantId);
    const reference = refs.items.find(v => v.variantId === item.variantId);
    const checklist = checklists.items.find(v => v.variantId === item.variantId);
    assert.ok(source && reference && checklist);
    assert.equal(item.currentRunPdfHashVerified, true);
    assert.equal(item.officialBuildingPdfUrl, source.wixBuildingPdfUrl);
    assert.equal(item.historicalPdfSha256, source.hostedPdfVerification.sha256);
    if (!restored.has(item.variantId)) {
      assert.equal(item.image.webpCreated, false);
      assert.equal(item.wix.operationStatus, "NOT_UPLOADED");
      assert.equal(item.assessment.studentApproved, false);
      assert.equal(item.assessment.selectable, false);
      continue;
    }
    assert.equal(item.assessment.studentApproved, true);
    assert.equal(item.assessment.selectable, true);
    assert.equal(item.assessment.independentlyApprovedQuestions, 5);
    assert.ok(approvedIds.has(item.variantId));
    assert.equal(checklist.questions.length, 5);
    assert.equal(item.image.webpCreated, true);
    assert.equal(item.image.decoded, true);
    assert.match(item.image.sha256, /^[0-9a-f]{64}$/);
    assert.equal(reference.imageSha256, item.image.sha256);
    assert.equal(reference.pdfSha256, source.hostedPdfVerification.sha256);
    assert.equal(reference.imagePath, "public/final-build/level-5/" + item.requiredFileName);
    assert.equal(item.image.filename, item.requiredFileName);
    assert.ok(item.image.sourceRasterMeanAbsoluteError < 24);
    assert.deepEqual(reference.dimensions, item.image.dimensions);
    assert.deepEqual(item.wix.dimensions, item.image.dimensions);
    assert.equal(item.wix.mediaState, "OK");
    assert.equal(item.wix.operationStatus, "READY");
    assert.equal(item.wix.mimeType, "image/webp");
    assert.equal(item.wix.cdnHttpStatus, 200);
    assert.equal(item.wix.cdnByteForByteSha256Verified, true);
    assert.equal(item.wix.hostedUrl, wix.urls[item.variantId]);
    assert.equal(item.wix.hostedUrl, "https://static.wixstatic.com/media/" + item.wix.mediaId);
    assert.equal(item.wix.siteId, candidates.wixSite.id);
    const bb = item.completedModelCrop.normalizedCoordinates;
    assert.ok(bb.length === 4 && bb[0] < bb[2] && bb[1] < bb[3]);
    assert.equal(item.completedModelCrop.pdfPage, reference.page);
    for (const q of checklist.questions) {
      assert.equal(q.evidencePage, reference.page);
      assert.equal(q.sourcePdfSha256, reference.pdfSha256);
      assert.ok(q.observable && q.text.trim().length > 35);
    }
  }
});

test("distinct optimized Crack Shot may never inherit basic Crack Shot image", () => {
  const basic = audit.variants.find(v => v.variantId === "level-5-crack-shot");
  const optimized = audit.variants.find(v => v.variantId === "level-5-crack-shot:optimized");
  assert.ok(basic?.release.approved);
  assert.equal(optimized?.release.approved, false);
  assert.notEqual(basic.wixBuildingPdfUrl, optimized.wixBuildingPdfUrl);
  assert.ok(!(optimized.variantId in wix.urls));
});
