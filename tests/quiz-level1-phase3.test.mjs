import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { getQuizBank, validateQuizBank } from "../src/data/quizStudio.ts";
const root = new URL("../", import.meta.url);
const readJson = async p => JSON.parse(await readFile(new URL(p, root), "utf8"));
const camel = id => id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

test("Phase 3 indexes all fourteen official Building PDF fallback sources", async () => {
  const data = await readJson("scripts/level1-quiz-phase3-building-sources.json");
  const status = await readJson("scripts/level1-quiz-status.json");
  const queue = status.pendingWithoutIndexedLearningPdf;
  assert.equal(data.sources.length, 14);
  assert.equal(queue.length, 14);
  assert.deepEqual(new Set(data.sources.map(x => x.projectId)), new Set(queue.map(x => x.projectId)));
  for (const source of data.sources) {
    assert.equal(source.level, 1);
    assert.equal(source.sourceKind, "official-building-manual-learning-fallback");
    assert.ok(source.url.startsWith("https://"));
    assert.ok(source.sourcePath.startsWith("public/") && source.sourcePath.endsWith(".pdf"));
    await access(new URL(source.sourcePath, root));
  }
});
test("Phase 3 draft banks cannot be published as verified questions", async () => {
  const data = await readJson("scripts/level1-quiz-phase3-building-sources.json");
  for (const source of data.sources) {
    const path = "src/data/quizBanks/" + camel(source.projectId) + ".ts";
    const module = await import(new URL(path, root));
    const bank = module[camel(source.projectId) + "Bank"];
    assert.ok(bank, "Missing bank draft: " + source.projectId);
    assert.equal(bank.projectId, source.projectId);
    assert.equal(bank.sourcePdfPath, source.sourcePath);
    assert.equal(bank.sourcePageCount, 0);
    assert.equal(bank.questions.length, 10);
    assert.ok(bank.questions.every(q => q.correctIndex === -1 && q.learningSlide === 0));
    assert.ok(validateQuizBank(bank).length > 0);
    assert.equal(getQuizBank(source.projectId), undefined);
  }
});
