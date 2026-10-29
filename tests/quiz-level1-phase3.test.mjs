import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { getQuizBank, selectQuizQuestions, validateQuizBank } from "../src/data/quizStudio.ts";

const root = new URL("../", import.meta.url);
const readJson = async path => JSON.parse(await readFile(new URL(path, root), "utf8"));
const camel = id => id.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());

test("Phase 3 indexes all fourteen official Building-manual Learning fallback sources", async () => {
  const data = await readJson("scripts/level1-quiz-phase3-building-sources.json");
  const status = await readJson("scripts/level1-quiz-status.json");
  const evidence = await readJson("scripts/level1-quiz-phase3-page-counts.json");
  assert.equal(data.sources.length, 14);
  assert.equal(status.pendingWithoutIndexedLearningPdf.length, 14);
  assert.equal(evidence.sources.length, 14);
  assert.deepEqual(new Set(data.sources.map(x => x.projectId)),
    new Set(status.pendingWithoutIndexedLearningPdf.map(x => x.projectId)));
  assert.deepEqual(new Set(evidence.sources.map(x => x.projectId)),
    new Set(data.sources.map(x => x.projectId)));
  assert.equal(evidence.sources.reduce((sum,x) => sum+x.pageCount,0),208);
  assert.equal(evidence.sources.reduce((sum,x) => sum+x.needsVisualReview,0),159);
  for (const source of data.sources) {
    assert.equal(source.level, 1);
    assert.equal(source.sourceKind, "official-building-manual-learning-fallback");
    assert.ok(source.url.startsWith("https://"));
    assert.ok(source.sourcePath.startsWith("public/") && source.sourcePath.endsWith(".pdf"));
    await access(new URL(source.sourcePath, root));
  }
});

test("Phase 3 authoring provides 140 structurally valid but unpublished questions", async () => {
  const data = await readJson("scripts/level1-quiz-phase3-building-sources.json");
  const evidence = await readJson("scripts/level1-quiz-phase3-page-counts.json");
  for (const source of data.sources) {
    const path = "src/data/quizBanks/" + camel(source.projectId) + ".ts";
    const module = await import(new URL(path, root));
    const bank = module[camel(source.projectId) + "Bank"];
    const pages = evidence.sources.find(entry => entry.projectId === source.projectId);
    assert.ok(bank, "Missing question bank: " + source.projectId);
    assert.ok(pages, "Missing page evidence: " + source.projectId);
    assert.equal(bank.projectId, source.projectId);
    assert.equal(bank.sourcePdfPath, source.sourcePath);
    assert.equal(bank.sourcePageCount, pages.pageCount);
    assert.equal(bank.questions.length, 10);
    assert.deepEqual(validateQuizBank(bank), [], source.projectId + ": invalid quiz structure");
    assert.equal(getQuizBank(source.projectId), undefined,
      source.projectId + ": not approved for publication yet");
    const positions = [0, 0, 0, 0];
    for (const q of bank.questions) {
      positions[q.correctIndex]++;
      assert.ok(q.learningSlide >= 1 && q.learningSlide <= pages.pageCount, q.id + ": invalid page");
      assert.ok(q.hint.length >= 20, q.id + ": hint too short");
      assert.ok(q.explanation.length >= 20, q.id + ": explanation too short");
      assert.ok(!/TODO|TBD/i.test(q.prompt + q.explanation + q.hint), q.id + ": unfinished text");
      assert.equal(new Set(q.choices.map(x => x.toLowerCase())).size, 4, q.id + ": duplicate choices");
    }
    assert.ok(positions.every(n => n >= 2 && n <= 3), source.projectId + ": unbalanced answer key");
    const first = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
    assert.equal(first.length, 5);
    assert.equal(new Set(first.map(q => q.topic)).size, 5);
    assert.equal(retry.length, 5);
    assert.equal(new Set(retry.map(q => q.topic)).size, 5);
    assert.ok(retry.every(q => !first.some(prev => prev.id === q.id)),
      source.projectId + ": immediate retry repeated questions");
  }
});
