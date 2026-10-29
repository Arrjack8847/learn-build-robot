import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getQuizBank, quizBanks, selectQuizQuestions, validateQuizBank } from "../src/data/quizStudio.ts";

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));

test("Level 1 quiz status is a non-overlapping, complete authoring queue", async () => {
  const status = await readJson("../scripts/level1-quiz-status.json");
  const manifest = await readJson("../scripts/quiz-learning-source-manifest.json");
  const done = status.completed.map(item => item.projectId);
  const pendingIndexed = status.pendingWithIndexedLearningPdf.map(item => item.projectId);
  const pendingUnindexed = status.pendingWithoutIndexedLearningPdf.map(item => item.projectId);
  const all = [...done, ...pendingIndexed, ...pendingUnindexed];

  assert.equal(new Set(all).size, all.length, "Duplicate Level 1 project IDs across status groups");
  assert.equal(status.registered, all.length);
  assert.equal(status.ready, done.length);
  assert.equal(status.pending, pendingIndexed.length + pendingUnindexed.length);
  assert.equal(status.registered, status.ready + status.pending);

  const sources = manifest.sources.filter(item => item.level === 1);
  const byProject = new Map(sources.map(item => [item.projectId, item]));
  assert.equal(byProject.size, sources.length, "Duplicate Level 1 Learning source IDs");

  for (const item of status.completed) {
    const bank = getQuizBank(item.projectId);
    assert.ok(bank, item.projectId + " is marked ready but no valid bank is registered");
    assert.equal(bank.sourcePdfPath, item.sourcePdfPath);
    assert.equal(byProject.get(item.projectId)?.sourcePath, item.sourcePdfPath);
  }
  for (const item of status.pendingWithIndexedLearningPdf) {
    assert.equal(getQuizBank(item.projectId), undefined, item.projectId + " is pending but published");
    assert.equal(byProject.get(item.projectId)?.sourcePath, item.sourcePdfPath);
  }
  for (const item of status.pendingWithoutIndexedLearningPdf) {
    assert.equal(getQuizBank(item.projectId), undefined, item.projectId + " is pending but published");
  }
});

test("every registered quiz bank follows the shared ten-question teaching format", () => {
  for (const [projectId, bank] of Object.entries(quizBanks)) {
    assert.equal(bank.projectId, projectId, "Bank key and project ID do not match");
    assert.deepEqual(validateQuizBank(bank), [], projectId + " failed structural validation");
    assert.ok(bank.title.trim(), projectId + " missing title");
    assert.ok(!/\\bTODO\\b|\\bTBD\\b|\\[VERIFY\\]/i.test(JSON.stringify(bank)), projectId + " has draft placeholders");

    const objectives = new Map();
    for (const question of bank.questions) {
      objectives.set(question.topic, (objectives.get(question.topic) ?? 0) + 1);
      assert.ok(question.prompt.trim(), projectId + " has a blank question");
      assert.ok(question.explanation.trim(), projectId + " has a blank explanation");
      assert.ok(question.hint.trim(), projectId + " has a blank hint");
    }
    assert.equal(objectives.size, 5, projectId + " must cover five objectives");
    assert.ok([...objectives.values()].every(count => count === 2), projectId + " needs two questions per objective");

    const first = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, first.map(item => item.id), () => 0);
    assert.equal(first.length, 5, projectId);
    assert.equal(new Set(first.map(item => item.topic)).size, 5, projectId);
    assert.equal(retry.length, 5, projectId);
    assert.ok(retry.every(item => !first.some(previous => previous.id === item.id)), projectId + " retry repeated a question");
  }
});
