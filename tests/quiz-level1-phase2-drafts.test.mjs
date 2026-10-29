import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { getQuizBank, selectQuizQuestions, validateQuizBank } from "../src/data/quizStudio.ts";

const root = new URL("../", import.meta.url);
const readJson = async path => JSON.parse(await readFile(new URL(path, root), "utf8"));
const camel = id => id.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());

test("19 PDF-indexed Level 1 banks have ten sourced questions but are not yet published", async () => {
  const status = await readJson("scripts/level1-quiz-status.json");
  const manifest = await readJson("scripts/quiz-learning-source-manifest.json");
  const sourcePages = await readJson("scripts/level1-quiz-phase2-page-counts.json");
  assert.equal(status.pendingWithIndexedLearningPdf.length, 19);
  assert.equal(status.registered, 60);
  assert.equal(status.ready, 27);
  assert.equal(status.pending, 33);
  assert.equal(sourcePages.sources.length, 19);
  for (const item of status.pendingWithIndexedLearningPdf) {
    const source = manifest.sources.find(entry => entry.level === 1 && entry.projectId === item.projectId);
    const pages = sourcePages.sources.find(entry => entry.projectId === item.projectId);
    assert.ok(source && pages, item.projectId + ": source record missing");
    assert.equal(source.sourcePath, item.sourcePdfPath);
    assert.ok(Number.isSafeInteger(pages.pageCount) && pages.pageCount > 0);
    await access(new URL(item.sourcePdfPath, root));
    const module = await import(new URL("src/data/quizBanks/" + camel(item.projectId) + ".ts", root));
    const bank = module[camel(item.projectId) + "Bank"];
    assert.ok(bank, item.projectId + ": missing bank export");
    assert.equal(bank.projectId, item.projectId);
    assert.equal(bank.sourcePdfPath, item.sourcePdfPath);
    assert.equal(bank.sourcePageCount, pages.pageCount);
    assert.deepEqual(validateQuizBank(bank), [], item.projectId + ": structural issues");
    assert.equal(bank.questions.length, 10);
    assert.equal(getQuizBank(item.projectId), undefined, item.projectId + ": published before review");
    assert.ok(!/\bTODO\b|\bTBD\b/i.test(JSON.stringify(bank)), item.projectId + ": contains placeholders");
    const positions = [0,0,0,0];
    for (const q of bank.questions) {
      positions[q.correctIndex]++;
      assert.ok(q.hint.length >= 20 && q.explanation.length >= 20);
    }
    assert.ok(positions.every(n => n >= 2 && n <= 3), item.projectId + ": answer positions not balanced");
    const attempt = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, attempt.map(q => q.id), () => 0);
    assert.equal(new Set(attempt.map(q => q.topic)).size, 5);
    assert.equal(new Set(retry.map(q => q.topic)).size, 5);
    assert.ok(retry.every(q => !attempt.some(previous => previous.id === q.id)), item.projectId + ": retry repeated a question");
  }
});
