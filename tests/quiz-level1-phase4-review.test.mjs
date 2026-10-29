import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getQuizBank } from "../src/data/quizStudio.ts";

const root = new URL("../", import.meta.url);
const json = async filename => JSON.parse(await readFile(new URL(filename, root), "utf8"));
const camel = id => id.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());

test("Phase 4 requires unique hints and complete metadata for all 330 draft questions", async () => {
  const status = await json("scripts/level1-quiz-status.json");
  const phase3 = await json("scripts/level1-quiz-phase3-building-sources.json");
  const phase2Pages = await json("scripts/level1-quiz-phase2-page-counts.json");
  const phase3Pages = await json("scripts/level1-quiz-phase3-page-counts.json");
  const entries = [
    ...status.pendingWithIndexedLearningPdf,
    ...status.pendingWithoutIndexedLearningPdf,
  ];
  assert.equal(entries.length, 33);
  assert.equal(new Set(entries.map(x => x.projectId)).size, 33);
  let questions = 0;
  for (const entry of entries) {
    const path = "src/data/quizBanks/" + camel(entry.projectId) + ".ts";
    const contents = await readFile(new URL(path, root), "utf8");
    const match = contents.match(/export const \w+: QuizBank = (\{[\s\S]*\});\s*$/);
    assert.ok(match, entry.projectId + ": invalid static bank format");
    const bank = JSON.parse(match[1]);
    const pageEntry = [...phase2Pages.sources, ...phase3Pages.sources]
      .find(x => x.projectId === entry.projectId);
    assert.ok(pageEntry, entry.projectId + ": missing source evidence");
    assert.equal(bank.sourcePageCount, pageEntry.pageCount);
    assert.equal(bank.questions.length, 10);
    assert.equal(getQuizBank(entry.projectId), undefined, entry.projectId + ": must remain unpublished");
    const hints = new Set(bank.questions.map(q => q.hint.trim().toLowerCase()));
    assert.equal(hints.size, 10, entry.projectId + ": repeated generic hint");
    assert.ok(bank.questions.every(q => q.hint.length >= 20), entry.projectId + ": short hint");
    assert.ok(bank.questions.every(q => q.learningSlide >= 1 &&
      q.learningSlide <= bank.sourcePageCount), entry.projectId + ": bad page range");
    if (phase3.sources.some(x => x.projectId === entry.projectId)) {
      const source = phase3.sources.find(x => x.projectId === entry.projectId);
      assert.equal(bank.sourcePdfPath, source.sourcePath);
    }
    questions += bank.questions.length;
  }
  assert.equal(questions, 330);
});

test("Phase 4 preview is an offline reviewer, not a publication mechanism", async () => {
  const contents = await readFile(new URL("scripts/generate-level1-phase4-review.mjs", root), "utf8");
  assert.ok(contents.includes("level1-phase4-review.html"));
  assert.ok(contents.includes("level1-phase4-audit.json"));
  assert.ok(contents.includes("releaseApproved:false"));
  assert.ok(!contents.includes("updateQuizRegistry"));
});
