import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  getQuizBank, selectQuizQuestions, validateQuizBank,
  QUIZ_PASS_COUNT, QUIZ_QUESTION_COUNT,
} from "../src/data/quizStudio.ts";

const repoRoot = resolve(import.meta.dirname, "..");
const audit = JSON.parse(await readFile(new URL("../src/data/quizBanks/level2/source-audit.json", import.meta.url), "utf8"));
const manifest = JSON.parse(await readFile(new URL("../scripts/quiz-learning-source-manifest.json", import.meta.url), "utf8"));
const levelTwoProjects = audit.projects;
// A new bank becomes expected-playable when its reviewed source audit is updated.
const verifiedBankIds = new Set(levelTwoProjects
  .filter(project => project.bankStatus === "already-published-in-shared-registry"
    || project.bankStatus === "integrated-in-quiz-studio")
  .map(project => project.projectId));

test("Level 2 source audit covers 60 unique registered projects", () => {
  assert.equal(levelTwoProjects.length, 60);
  assert.equal(new Set(levelTwoProjects.map(project => project.projectId)).size, 60);
  assert.ok(levelTwoProjects.every(project => project.projectId.startsWith("level-2-")));
  assert.equal(levelTwoProjects.filter(project => project.sourceType === "learning-pdf").length, 45);
  assert.equal(levelTwoProjects.filter(project => project.sourceType === "building-pdf-learning-fallback").length, 15);
  assert.equal(new Set(levelTwoProjects.map(project => project.sourcePdfPath)).size, 59);
  assert.deepEqual([QUIZ_QUESTION_COUNT, QUIZ_PASS_COUNT], [5, 4]);
  const beetle = levelTwoProjects.find(project => project.projectId === "level-2-dung-beetle");
  const parking = levelTwoProjects.find(project => project.projectId === "level-2-reverse-parking");
  assert.equal(beetle?.sourcePdfPath, "public/Reverse Parking.pdf", "Legacy PDF internals contain Dung Beetle teaching content");
  assert.equal(parking?.sourcePdfPath, "public/Dung Beetle.pdf", "Legacy PDF internals contain Reverse Parking teaching content");
});

test("all 60 registered Level 2 projects have a local source file", async () => {
  await Promise.all(levelTwoProjects.map(async project => {
    assert.ok(project.sourcePdfPath.startsWith("public/"), project.projectId);
    assert.ok(project.sourcePdfPath.toLowerCase().endsWith(".pdf"), project.projectId);
    await access(resolve(repoRoot, project.sourcePdfPath));
    if (project.sourceType === "learning-pdf") {
      const source = manifest.sources.find(item => item.projectId === project.projectId && item.level === 2);
      assert.ok(source, project.projectId + ": missing manifest mapping");
      assert.equal(source.sourcePath, project.sourcePdfPath);
    }
  }));
});

test("all 60 Level 2 projects have integrated playable banks", () => {
  assert.equal(verifiedBankIds.size, 60, "Every Level 2 source needs a registered question bank");
  for (const project of levelTwoProjects) {
    const bank = getQuizBank(project.projectId);
    if (!verifiedBankIds.has(project.projectId)) {
      assert.equal(bank, undefined, project.projectId + ": must remain unverified");
      continue;
    }
    assert.ok(bank, project.projectId + ": missing playable bank");
    assert.equal(bank.projectId, project.projectId);
    assert.equal(bank.sourcePdfPath, project.sourcePdfPath);
    assert.equal(bank.questions.length, 10);
    assert.deepEqual(validateQuizBank(bank), [], project.projectId);
    assert.equal(new Set(bank.questions.map(question => question.id)).size, 10);
    const ids = new Set(bank.questions.map(question => question.id));
    const topics = new Set(bank.questions.map(question => question.topic));
    assert.equal(topics.size, QUIZ_QUESTION_COUNT);
    for (const question of bank.questions) {
      assert.equal(question.choices.length, 4);
      assert.ok(ids.has(question.id));
      assert.ok(Number.isInteger(question.learningSlide));
      assert.ok(question.learningSlide >= 1 && question.learningSlide <= bank.sourcePageCount);
      assert.ok(question.hint.length >= 12);
      assert.ok(question.explanation.length >= 12);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
    }
    const first = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, first.map(question => question.id), () => 0);
    assert.equal(first.length, 5);
    assert.equal(retry.length, 5);
    assert.equal(new Set(first.map(question => question.topic)).size, 5);
    assert.equal(first.filter(question => retry.some(other => other.id === question.id)).length, 0);
  }
});

test("all integrated Level 2 banks reference actual PDF page counts", async () => {
  for (const project of levelTwoProjects.filter(item => verifiedBankIds.has(item.projectId))) {
    const bank = getQuizBank(project.projectId);
    assert.ok(bank);
    const pdfBytes = await readFile(resolve(repoRoot, bank.sourcePdfPath));
    const task = getDocument({ data: new Uint8Array(pdfBytes), useSystemFonts: true, disableFontFace: true });
    const pdf = await task.promise;
    try {
      assert.equal(pdf.numPages, bank.sourcePageCount, project.projectId + ": PDF count mismatch");
    } finally {
      await pdf.destroy();
    }
  }
});
