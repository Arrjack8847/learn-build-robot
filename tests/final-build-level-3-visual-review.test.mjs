import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const load = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const review = load("reports/final-build-level-3-visual-candidate-review-20261123.json");
const references = load("src/data/finalBuild/level-3-references.json");
const checklists = load("src/data/finalBuild/level-3-checklists.json");
const byId = new Map(references.references.map((r) => [r.variantId, r]));
const byChecklist = new Map(checklists.entries.map((r) => [r.variantId, r]));

test("live Wix PDF descriptor result is separately recorded from PDF content provenance", () => {
  const w = review.wixPdfMediaManager;
  assert.equal(w.site, "Steam");
  assert.equal(w.distinctRegisteredPdfIds, 40);
  assert.equal(w.descriptorsFound, 40);
  assert.equal(w.ready, 40);
  assert.equal(w.document, 40);
  assert.equal(w.public, 40);
  assert.equal(w.sha256Verified, 0);
  assert.equal(w.pdfPageContentsVerified, 0);
});

test("all 42 candidate images have a one-to-one variant review record and valid registered PDF identity", () => {
  assert.equal(review.records.length, 42);
  assert.equal(byId.size, 42);
  assert.equal(byChecklist.size, 42);
  const ids = new Set();
  for (const a of review.records) {
    assert.ok(!ids.has(a.variantId), "duplicate candidate " + a.variantId);
    ids.add(a.variantId);
    const ref = byId.get(a.variantId);
    assert.ok(ref, "missing official registry: " + a.variantId);
    assert.equal(a.registeredSourcePdfId, ref.source.wixMediaId);
    assert.equal(a.registeredSourcePdfUrl, ref.source.wixUrl);
    assert.equal(a.candidatePath, "public/final-build/level-3/" + a.variantId + ".webp");
    assert.ok(existsSync(resolve(root, a.candidatePath)), "missing candidate file: " + a.candidatePath);
    assert.equal(a.candidateRenderedAndVisuallyInspected, true);
    assert.ok(Array.isArray(a.observedIssues));
    assert.equal(a.exactPdfPageMatch, "not-verified");
    assert.equal(a.finishedModelSourcePage, null);
    assert.equal(a.technicalByteHashSha256, null);
    assert.equal(a.studentVisible, false);
    assert.equal(a.artworkApproval, "blocked");
    assert.equal(a.checklistApproval, "blocked");
    assert.equal(ref.approved, false);
    assert.equal(ref.image.status, "blocked");
    const checklist = byChecklist.get(a.variantId);
    assert.equal(checklist.status, "blocked");
    assert.deepEqual(checklist.questions, []);
  }
  assert.equal(ids.size, 42);
  assert.equal(new Set(review.records.map((r) => r.registeredSourcePdfId)).size, 40);
});

test("visual concerns are not confused with approval, nor is an unflagged candidate approved", () => {
  assert.equal(review.counts.candidatesInspected, 42);
  assert.equal(review.counts.visuallyFlagged, 25);
  assert.equal(review.counts.unflaggedPendingPdfProof, 17);
  assert.equal(review.records.filter((r) => r.observedIssues.length > 0).length, 25);
  assert.equal(review.counts.approved, 0);
  assert.equal(review.counts.blocked, 42);
  assert.equal(review.counts.approvedChecklists, 0);
  assert.equal(review.counts.uploadedApprovedWebps, 0);
  assert.equal(references.references.filter((r) => r.approved).length, 0);
});
