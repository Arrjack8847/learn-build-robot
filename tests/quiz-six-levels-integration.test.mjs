import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getQuizBank, validateQuizBank, selectQuizQuestions } from "../src/data/quizStudio.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(join(root, "scripts/quiz-learning-source-manifest.json"), "utf8"));
const sources = manifest.sources;

test("all 321 syllabus projects have an integrated Quiz Studio bank", () => {
  assert.equal(sources.length, 321, "Check the latest official syllabus before changing the count");
  assert.equal(new Set(sources.map(s => s.projectId)).size, 321, "Duplicate syllabus project ID");
  const counts = new Map();
  for (const source of sources) counts.set(source.level, (counts.get(source.level) || 0) + 1);
  assert.deepEqual([...counts.entries()].sort((a,b) => a[0]-b[0]), [[1,60],[2,60],[3,51],[4,56],[5,51],[6,43]]);
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
});

test("all 321 banks can select distinct objective-balanced questions and a retry", () => {
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
