import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const read = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const audit = read("src/data/finalBuild/level-5-audit.json");
const references = read("src/data/finalBuild/level-5-references.json");
const checklists = read("src/data/finalBuild/level-5-checklists.json");
const recovery = read("src/data/finalBuild/level-5-recovery-candidates.json");
const historical = read("src/data/finalBuild/level-5-wix-candidates.json");
const evidence = read("reports/final-build-level-5-six-webp-recovery-evidence-20261123.json");

const originallyBlocked = new Set(recovery.candidates.map(v => v.variantId));
const newlyApproved = new Set(["level-5-voice-control-snail", "level-5-voice-control-vehicle"]);

test("historical six-candidate intake remains immutable; current approval is 41 not 39", () => {
  assert.equal(historical.candidates.length, 6);
  assert.equal(historical.existingApprovedImageCountUnaffected, 39);
  assert.equal(historical.newWebpCandidatesCreated, 0);
  assert.equal(historical.newWixUploads, 0);
  assert.equal(historical.newArtworkApprovals, 0);
  assert.equal(historical.newChecklistApprovals, 0);
  assert.deepEqual(new Set(historical.candidates.map(v => v.variantId)), originallyBlocked);

  assert.equal(audit.counts.approvedVariants, 41);
  assert.equal(audit.counts.blockedVariants, 4);
  assert.equal(audit.studentScannerSelectableVariantIds.length, 41);
  assert.equal(references.renderableApprovedReferences.length, 41);
  assert.equal(checklists.approvedChecklists.length, 41);
  assert.deepEqual(
    new Set(audit.variants.filter(v => !v.release.approved).map(v => v.variantId)),
    new Set([...originallyBlocked].filter(id => !newlyApproved.has(id)))
  );

  const evidenceById = new Map(evidence.outputs.map(v => [v.variantId, v]));
  for (const candidate of historical.candidates) {
    const current = audit.variants.find(v => v.variantId === candidate.variantId);
    const previous = recovery.candidates.find(v => v.variantId === candidate.variantId);
    const image = references.items.find(v => v.variantId === candidate.variantId);
    const checklist = checklists.items.find(v => v.variantId === candidate.variantId);
    assert.ok(current && previous && image && checklist);
    assert.equal(candidate.registeredOfficialBuildingPdfUrl, current.wixBuildingPdfUrl);
    assert.equal(candidate.previouslyRecordedPdfSha256, current.hostedPdfVerification.sha256);
    assert.equal(candidate.previousPdfPageCount, current.hostedPdfVerification.pageCount);
    assert.equal(candidate.previousCandidatePageHint, previous.previousCandidatePage);
    assert.match(candidate.requiredFilename, /^level-5-.*\.webp$/);

    const sourceEvidence = evidenceById.get(candidate.variantId);
    assert.ok(sourceEvidence);
    if (newlyApproved.has(candidate.variantId)) {
      assert.equal(current.release.approved, true);
      assert.equal(image.approved, true);
      assert.equal(checklist.approved, true);
      assert.equal(checklist.questions.length, 5);
      assert.equal(image.imageSha256, sourceEvidence.image.sha256);
      assert.equal(image.imagePath, sourceEvidence.image.gitPath);
      assert.equal(image.pdfSha256, sourceEvidence.source.pdfSHA256);
      assert.equal(sourceEvidence.wix.operationStatus, "READY");
    } else {
      assert.equal(current.release.approved, false);
      assert.equal(image.approved, false);
      assert.equal(checklist.approved, false);
      assert.equal(image.imagePath, null);
      assert.deepEqual(checklist.questions, []);
    }
  }
});
