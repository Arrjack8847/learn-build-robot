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
const candidates = read("src/data/finalBuild/level-5-wix-candidates.json");

test("Six pending Wix candidates preserve the 39 approvals and fail closed", () => {
  const blocked = audit.variants.filter(v => !v.release.approved);
  assert.equal(blocked.length, 6);
  assert.equal(audit.counts.approvedVariants, 39);
  assert.equal(candidates.existingApprovedImageCountUnaffected, 39);
  assert.equal(candidates.newWebpCandidatesCreated, 0);
  assert.equal(candidates.newWixUploads, 0);
  assert.equal(candidates.newArtworkApprovals, 0);
  assert.equal(candidates.newChecklistApprovals, 0);
  assert.equal(candidates.candidates.length, 6);
  assert.deepEqual(
    candidates.candidates.map(v => v.variantId).sort(),
    blocked.map(v => v.variantId).sort()
  );
  assert.equal(new Set(candidates.candidates.map(v => v.requiredFilename)).size, 6);
  for (const candidate of candidates.candidates) {
    const source = blocked.find(v => v.variantId === candidate.variantId);
    const previous = recovery.candidates.find(v => v.variantId === candidate.variantId);
    const image = references.items.find(v => v.variantId === candidate.variantId);
    const checklist = checklists.items.find(v => v.variantId === candidate.variantId);
    assert.ok(source && previous && image && checklist);
    assert.equal(candidate.registeredOfficialBuildingPdfUrl, source.wixBuildingPdfUrl);
    assert.equal(candidate.previouslyRecordedPdfSha256, source.hostedPdfVerification.sha256);
    assert.equal(candidate.previousPdfPageCount, source.hostedPdfVerification.pageCount);
    assert.equal(candidate.previousCandidatePageHint, previous.previousCandidatePage);
    assert.match(candidate.requiredFilename, /^level-5-.*\.webp$/);
    assert.equal(candidate.currentRecovery.currentPdfSha256Verified, false);
    assert.equal(candidate.currentRecovery.allPagesInspected, false);
    assert.equal(candidate.currentRecovery.finishedModelProven, false);
    assert.equal(candidate.currentRecovery.webpSha256, null);
    assert.equal(candidate.wix.uploaded, false);
    assert.equal(candidate.wix.mediaId, null);
    assert.equal(candidate.wix.url, null);
    assert.equal(candidate.wix.readyStatus, "NOT_UPLOADED");
    assert.equal(candidate.approval.artwork, false);
    assert.equal(candidate.approval.checklist, false);
    assert.equal(candidate.approval.studentSelectable, false);
    assert.deepEqual(candidate.checklist.questions, []);
    assert.equal(image.approved, false);
    assert.equal(checklist.approved, false);
    assert.deepEqual(checklist.questions, []);
  }
});
