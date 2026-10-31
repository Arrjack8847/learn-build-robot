import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { quizBanks, getQuizBank, validateQuizBank, selectQuizQuestions } from "../src/data/quizStudio.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const json = async path => JSON.parse(await readFile(join(root, path), "utf8"));
const manifest = (await json("scripts/quiz-learning-source-manifest.json")).sources;
const level1Fallback = (await json("scripts/level1-quiz-phase3-building-sources.json")).sources;
const level2Audit = (await json("src/data/quizBanks/level2/source-audit.json")).projects;
const level2Fallback = level2Audit.filter(x => x.sourceType === "building-pdf-learning-fallback");
const level3Fallback = (await json("scripts/quiz-level3-building-fallbacks.json")).sources;

const sources = [
  ...manifest,
  ...level1Fallback.map(x => ({ projectId: x.projectId, level: 1, sourcePath: x.sourcePath })),
  ...level2Fallback.map(x => ({ projectId: x.projectId, level: 2, sourcePath: x.sourcePdfPath })),
  ...level3Fallback.map(x => ({ projectId: x.projectId, level: 3, sourcePath: x.sourcePath }))
];

test("all 321 syllabus entries cover dedicated Learning PDFs and approved fallbacks", () => {
  assert.equal(manifest.length, 287, "Expected 287 indexed Learning-PDF entries");
  assert.deepEqual([level1Fallback.length, level2Fallback.length, level3Fallback.length], [14, 15, 5]);
  assert.equal(sources.length, 321);
  assert.equal(new Set(sources.map(s => s.projectId)).size, 321, "Duplicate syllabus ID");
  const counts = new Map();
  for (const source of sources) counts.set(source.level, (counts.get(source.level) || 0) + 1);
  assert.deepEqual([...counts.entries()].sort((a,b) => a[0] - b[0]), [[1,60],[2,60],[3,51],[4,56],[5,51],[6,43]]);
  assert.equal(Object.keys(quizBanks).length, 321, "Expected 321 distinct registered QuizBank IDs");
  for (const source of sources) {
    const bank = getQuizBank(source.projectId);
    assert.ok(bank, "Missing bank: " + source.projectId);
    assert.equal(bank.projectId, source.projectId);
    assert.equal(bank.sourcePdfPath, source.sourcePath, source.projectId + ": wrong reference PDF");
    assert.deepEqual(validateQuizBank(bank), [], source.projectId);
    assert.equal(bank.questions.length, 10, source.projectId + ": expected 10 questions");
    const topics = new Map();
    for (const q of bank.questions) {
      assert.ok(q.learningSlide >= 1 && q.learningSlide <= bank.sourcePageCount, source.projectId + ":" + q.id);
      topics.set(q.topic, (topics.get(q.topic) || 0) + 1);
    }
    assert.equal(topics.size, 5, source.projectId + ": expected five lesson objectives");
    assert.ok([...topics.values()].every(n => n === 2), source.projectId + ": expected paired questions");
  }
  for (const id of Object.keys(quizBanks))
    assert.ok(sources.some(s => s.projectId === id), "QuizBank is not in syllabus: " + id);
});

test("all 321 banks support distinct objective-balanced questions and retries", () => {
  for (const source of sources) {
    const bank = getQuizBank(source.projectId);
    const attempt = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, attempt.map(q => q.id), () => 0);
    assert.equal(attempt.length, 5, source.projectId);
    assert.equal(retry.length, 5, source.projectId);
    assert.equal(new Set(attempt.map(q => q.topic)).size, 5, source.projectId);
    assert.equal(new Set(retry.map(q => q.topic)).size, 5, source.projectId);
    assert.equal(attempt.filter(q => retry.some(r => r.id === q.id)).length, 0, source.projectId);
  }
});
