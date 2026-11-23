import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const readJSON = (p) => JSON.parse(readFileSync(resolve(root, p), "utf8"));
const draft = readJSON("src/data/finalBuild/level-5-six-question-candidates.json");
const audit = readJSON("src/data/finalBuild/level-5-audit.json");
const approved = readJSON("src/data/finalBuild/level-5-checklists.json");
const recovery = readJSON("src/data/finalBuild/level-5-recovery-candidates.json");
const byAudit = new Map(audit.variants.map((v) => [v.variantId, v]));
const blocked = new Set(recovery.candidates.map((v) => v.variantId));

test("exactly six unique Level 5 candidates and five prompts each", () => {
  assert.equal(draft.entries.length, 6);
  assert.equal(draft.counts.variants, 6);
  assert.equal(draft.counts.draftQuestions, 30);
  const ids = draft.entries.map((v) => v.variantId);
  assert.equal(new Set(ids).size, 6);
  assert.deepEqual(new Set(ids), blocked);
  const questions = draft.entries.flatMap((v) => v.questions);
  assert.equal(questions.length, 30);
  assert.equal(new Set(questions.map((q) => q.id)).size, 30);
  assert.equal(new Set(questions.map((q) => q.text)).size, 30);
  assert.ok(draft.entries.every((v) => v.questions.length === 5));
});

test("all source pages and PDF SHA-256 values match registered exact variants", () => {
  for (const entry of draft.entries) {
    const source = byAudit.get(entry.variantId);
    assert.ok(source, entry.variantId);
    assert.equal(entry.officialBuildingPdfUrl, source.wixBuildingPdfUrl);
    assert.equal(entry.sourcePdfSha256, source.hostedPdfVerification.sha256);
    assert.ok(entry.sourcePage > 0 && entry.sourcePage <= source.hostedPdfVerification.pageCount);
    assert.match(entry.sourcePdfSha256, /^[a-f0-9]{64}$/);
    assert.ok(entry.questions.every((q) => q.sourcePdfSha256 === entry.sourcePdfSha256));
    assert.ok(entry.questions.every((q) => q.evidencePage === entry.sourcePage));
  }
});

test("question evidence distinguishes complete-model crops from incomplete manual steps", () => {
  const completed = draft.entries.filter((v) => v.evidenceQuality === "completed-model-view");
  const instructional = draft.entries.filter((v) => v.evidenceQuality === "instructional-stage-only");
  assert.equal(completed.length, 3);
  assert.equal(instructional.length, 3);
  assert.equal(draft.counts.questionsWithCompletedModelVisualEvidence, 15);
  assert.equal(draft.counts.questionsOnInstructionalIncompleteModels, 15);
  assert.ok(draft.entries.every((v) => v.questions.every((q) => q.evidenceKind === v.evidenceQuality)));
  assert.ok(draft.entries.every((v) => v.questions.every((q) => q.text.endsWith("?") && q.text.length > 55)));
});

test("three completed-model checklists passed independent source-page verification; three remain blocked", () => {
  assert.equal(draft.counts.independentlyApprovedQuestions, 15);
  assert.equal(draft.counts.studentApprovedVariants, 3);
  const releasedIds = new Set(approved.approvedChecklists.map(c => c.variantId));
  const selectable = new Set(audit.studentScannerSelectableVariantIds);
  assert.equal(releasedIds.size, 42);
  assert.deepEqual(releasedIds, selectable);
  const newlyApproved = new Set(["level-5-remote-control-car", "level-5-voice-control-snail", "level-5-voice-control-vehicle"]);
  for(const entry of draft.entries) {
    if(newlyApproved.has(entry.variantId)) {
      assert.equal(entry.studentApproved, true);
      assert.equal(entry.independentQuestionReview, "PASSED_SOURCE_VISUAL_SECOND_PASS");
      assert.ok(releasedIds.has(entry.variantId));
      assert.ok(selectable.has(entry.variantId));
      const live = approved.items.find(v => v.variantId === entry.variantId);
      assert.ok(live?.approved);
      assert.equal(live.questions.length, 5);
      for(let i=0;i<5;i++) {
        const question=entry.questions[i], finalQuestion=live.questions[i];
        assert.equal(question.reviewStatus,"APPROVED_WITH_SOURCE_PAGE_EVIDENCE");
        assert.equal(finalQuestion.text, question.text);
        assert.equal(finalQuestion.evidencePage, question.evidencePage);
        assert.equal(finalQuestion.sourcePdfSha256, question.sourcePdfSha256);
      }
    } else {
      assert.equal(entry.studentApproved, false);
      assert.equal(entry.independentQuestionReview, "PENDING");
      assert.ok(!releasedIds.has(entry.variantId));
      assert.ok(!selectable.has(entry.variantId));
      for(const question of entry.questions) {
        assert.equal(question.reviewStatus, "DRAFT_REQUIRES_INDEPENDENT_VISUAL_CONFIRMATION");
      }
    }
  }
});
