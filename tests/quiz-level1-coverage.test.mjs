import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { getQuizBank, selectQuizQuestions, validateQuizBank, QUIZ_PASS_COUNT, QUIZ_QUESTION_COUNT } from "../src/data/quizStudio.ts";
import { getQuizSyllabusInventory, getQuizLearningUrl } from "../src/data/quizSyllabus.ts";
import { LEVEL_ONE_BUILDING_PDF_LEARNING_FALLBACK_IDS } from "../src/data/levelOneLectures.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const inventory = getQuizSyllabusInventory().filter(item => item.level === 1);
const buildingOnlyIds = new Set(LEVEL_ONE_BUILDING_PDF_LEARNING_FALLBACK_IDS);
const indexed = JSON.parse(await readFile(resolve(root, "scripts/quiz-learning-source-manifest.json"), "utf8"));
const sourceById = new Map(indexed.sources.filter(entry => entry.level === 1).map(entry => [entry.projectId, entry]));

test("Level 1 inventory is complete and registered project IDs are unique", () => {
  assert.equal(inventory.length, 60);
  assert.equal(new Set(inventory.map(x => x.projectId)).size, 60);
  assert.equal(buildingOnlyIds.size, 14);
  assert.equal(sourceById.size, 46);
});

test("all 46 projects with distinct Learning source registration are playable", () => {
  const ready = inventory.filter(item => !buildingOnlyIds.has(item.projectId));
  assert.equal(ready.length, 46);
  for (const project of ready) {
    const bank = getQuizBank(project.projectId);
    assert.ok(bank, project.projectId + " must have a working QuizBank");
    assert.equal(project.status, "ready", project.projectId);
    assert.equal(bank.projectId, project.projectId);
    assert.deepEqual(validateQuizBank(bank), [], project.projectId);
    assert.equal(bank.questions.length, 10, project.projectId);
    const source = sourceById.get(project.projectId);
    assert.ok(source, project.projectId + ": no registered Learning source");
    assert.equal(bank.sourcePdfPath, source.sourcePath, project.projectId);
    assert.equal(getQuizLearningUrl(project.projectId), source.url, project.projectId);
    assert.ok(bank.sourcePageCount > 0, project.projectId);
  }
});

test("Building-PDF-only projects remain visibly pending instead of masquerading as lectures", () => {
  const pending = inventory.filter(item => buildingOnlyIds.has(item.projectId));
  assert.equal(pending.length, 14);
  for (const project of pending) {
    assert.equal(getQuizBank(project.projectId), undefined, project.projectId);
    assert.notEqual(project.status, "ready", project.projectId);
  }
});

test("every published Level 1 quiz offers varied five-question attempts and nonrepeating retries", () => {
  for (const project of inventory.filter(x => !buildingOnlyIds.has(x.projectId))) {
    const bank = getQuizBank(project.projectId);
    assert.ok(bank, project.projectId);
    const first = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
    assert.equal(first.length, 5, project.projectId);
    assert.equal(retry.length, 5, project.projectId);
    assert.equal(new Set(first.map(q => q.topic)).size, 5, project.projectId);
    assert.equal(new Set(retry.map(q => q.topic)).size, 5, project.projectId);
    assert.equal(first.filter(q => retry.some(other => other.id === q.id)).length, 0, project.projectId);
    for (const question of bank.questions) {
      assert.ok(question.learningSlide >= 1 && question.learningSlide <= bank.sourcePageCount);
      assert.ok(question.hint.trim().length > 0 && question.explanation.trim().length > 0);
    }
  }
  assert.equal(QUIZ_PASS_COUNT, 4);
  assert.equal(QUIZ_QUESTION_COUNT, 5);
});

test("all 46 Learning PDFs exist, open successfully, and have exactly the recorded number of pages", async () => {
  // Check the local, exact syllabus PDFs: an indexed URL alone is not proof the
  // student's Learning Studio will have a valid source PDF.
  const counted = new Map();
  for (const project of inventory.filter(x => !buildingOnlyIds.has(x.projectId))) {
    const bank = getQuizBank(project.projectId);
    const path = resolve(root, bank.sourcePdfPath);
    let data;
    try {
      data = await readFile(path);
    } catch (error) {
      assert.fail(project.projectId + ": PDF not found at " + bank.sourcePdfPath + " (" + error + ")");
    }
    assert.equal(Buffer.from(data).subarray(0, 4).toString("ascii"), "%PDF", project.projectId);
    if (!counted.has(bank.sourcePdfPath)) {
      const pdf = await getDocument({ data: new Uint8Array(data), useSystemFonts: false, disableFontFace: true }).promise;
      try {
        counted.set(bank.sourcePdfPath, pdf.numPages);
      } finally {
        await pdf.destroy();
      }
    }
    assert.equal(counted.get(bank.sourcePdfPath), bank.sourcePageCount, project.projectId + ": PDF page count mismatch");
  }
});

test("existing Quiz route keeps Acceleration Car's navigation and slide-review contract", async () => {
  const route = await readFile(resolve(root, "src/routes/quiz.$projectId.tsx"), "utf8");
  for (const phrase of ["Need a Hint?", "Previous", "Next", "Try Again", "Review Learning Slide"]) {
    assert.ok(route.includes(phrase), "missing quiz control: " + phrase);
  }
  assert.ok(route.includes('search={{mode:"learning", slide: question.learningSlide}}'));
  assert.ok(route.includes("readQuizSavedState"));
  assert.ok(route.includes("writeQuizSavedState"));
});
