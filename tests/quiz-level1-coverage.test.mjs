import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { getQuizBank, selectQuizQuestions, validateQuizBank, QUIZ_PASS_COUNT, QUIZ_QUESTION_COUNT } from "../src/data/quizStudio.ts";

// Avoid importing browser-oriented syllabus/project registry modules directly in
// Node's test runner: they use extensionless TS imports resolved by Vite.
// Instead verify the exact registered source and fallback records they consume.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const index = JSON.parse(await readFile(resolve(root, "scripts/quiz-learning-source-manifest.json"), "utf8"));
const fallbacks = JSON.parse(await readFile(resolve(root, "scripts/level1-quiz-phase3-building-sources.json"), "utf8"));
const lecturesSource = await readFile(resolve(root, "src/data/levelOneLectures.ts"), "utf8");
const indexedSources = index.sources.filter(entry => entry.level === 1);
const srcById = new Map(indexedSources.map(source => [source.projectId, source]));
const buildingOnlyIds = new Set(fallbacks.sources.map(entry => entry.projectId));

test("60 unique Level 1 IDs are recorded across indexed Learning PDFs and official fallbacks", () => {
  assert.equal(indexedSources.length, 46);
  assert.equal(srcById.size, 46);
  assert.equal(fallbacks.sources.length, 14);
  assert.equal(buildingOnlyIds.size, 14);
  assert.equal(indexedSources.length + buildingOnlyIds.size, 60);
  for (const id of buildingOnlyIds) {
    assert.ok(!srcById.has(id), id + ": cannot be both lecture and fallback");
  }
  const declared = lecturesSource.match(/export const LEVEL_ONE_BUILDING_PDF_LEARNING_FALLBACK_IDS = \[([\s\S]*?)\] as const;/)?.[1];
  assert.ok(declared, "fallback registry missing");
  const declaredIds = [...declared.matchAll(/"([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(new Set(declaredIds), buildingOnlyIds);
});

test("all 46 indexed Learning sources have valid 10-question banks matching their exact PDFs", () => {
  for (const source of indexedSources) {
    const bank = getQuizBank(source.projectId);
    assert.ok(bank, source.projectId + ": missing published QuizBank");
    assert.deepEqual(validateQuizBank(bank), [], source.projectId);
    assert.equal(bank.projectId, source.projectId);
    assert.equal(bank.sourcePdfPath, source.sourcePath, source.projectId);
    assert.equal(bank.questions.length, 10, source.projectId);
    assert.ok(bank.sourcePageCount > 0);
    assert.ok(typeof source.url === "string" && source.url.startsWith("https://"));
    const relative = source.sourcePath.replace(/^public\/Level 1\/Learning\//, "");
    assert.ok(lecturesSource.includes(JSON.stringify(relative)),
      source.projectId + ": Learning Studio URL mapping missing source path " + relative);
  }
});

test("Building-only sources remain gated as unverified teaching materials", () => {
  for (const { projectId, sourcePath, sourceKind } of fallbacks.sources) {
    assert.equal(sourceKind, "official-building-manual-learning-fallback");
    assert.ok(sourcePath.startsWith("public/") && sourcePath.endsWith(".pdf"));
    assert.equal(getQuizBank(projectId), undefined, projectId + " must remain unavailable");
  }
  const studio = fileURLToPath(new URL("../src/components/practical/LevelOneLearningStudio.tsx", import.meta.url));
  assert.ok(studio);
});

test("all 46 playable banks reuse Acceleration Car's random selection and retry rule", () => {
  for (const source of indexedSources) {
    const bank = getQuizBank(source.projectId);
    assert.ok(bank);
    const first = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
    assert.equal(first.length, 5, source.projectId);
    assert.equal(retry.length, 5, source.projectId);
    assert.equal(new Set(first.map(q => q.topic)).size, 5, source.projectId);
    assert.equal(new Set(retry.map(q => q.topic)).size, 5, source.projectId);
    assert.equal(first.filter(q => retry.some(p => p.id === q.id)).length, 0, source.projectId);
    for (const question of bank.questions) {
      assert.ok(question.learningSlide >= 1 && question.learningSlide <= bank.sourcePageCount);
      assert.ok(question.hint.trim() && question.explanation.trim());
    }
  }
  assert.equal(QUIZ_PASS_COUNT, 4);
  assert.equal(QUIZ_QUESTION_COUNT, 5);
});

test("all 46 indexed official PDFs open and match their recorded 1-based page bounds", async () => {
  const pageCounts = new Map();
  for (const source of indexedSources) {
    const bank = getQuizBank(source.projectId);
    const path = resolve(root, bank.sourcePdfPath);
    let data;
    try {
      data = await readFile(path);
    } catch (error) {
      assert.fail(source.projectId + ": PDF missing at " + bank.sourcePdfPath + " " + error);
    }
    assert.equal(data.subarray(0, 4).toString("ascii"), "%PDF", source.projectId);
    if (!pageCounts.has(bank.sourcePdfPath)) {
      const document = await getDocument({
        data: new Uint8Array(data), useSystemFonts: false, disableFontFace: true,
      }).promise;
      try {
        pageCounts.set(bank.sourcePdfPath, document.numPages);
      } finally {
        await document.destroy();
      }
    }
    assert.equal(pageCounts.get(bank.sourcePdfPath), bank.sourcePageCount,
      source.projectId + ": recorded page count differs from actual PDF");
  }
});

test("existing Quiz route retains hint, navigation, saved progress and slide-review deep links", async () => {
  const route = await readFile(resolve(root, "src/routes/quiz.$projectId.tsx"), "utf8");
  for (const phrase of ["Need a Hint?", "Previous", "Next", "Try Again", "Review Learning Slide"]) {
    assert.ok(route.includes(phrase), "missing quiz control " + phrase);
  }
  assert.ok(route.includes('search={{mode:"learning", slide: question.learningSlide}}'));
  assert.ok(route.includes("readQuizSavedState"));
  assert.ok(route.includes("writeQuizSavedState"));
  const studio = await readFile(resolve(root, "src/components/practical/LevelOneLearningStudio.tsx"), "utf8");
  assert.ok(studio.includes("Construction Manual"));
  assert.ok(studio.includes("Official teaching slides are not available"));
});

test("Building-only projects have a distinct blocked state and cannot be described as lectures", async () => {
  const syllabus = await readFile(resolve(root, "src/data/quizSyllabus.ts"), "utf8");
  const projectPage = await readFile(resolve(root, "src/routes/projects.$projectId.tsx"), "utf8");
  assert.ok(syllabus.includes('"building-manual-only"'), "missing fallback status");
  assert.ok(syllabus.includes("buildingManualOnlyLevelOneIds.has(projectId)"),
    "fallback gate must check source kind per project");
  assert.ok(projectPage.includes('quizEntry.status === "building-manual-only"'));
  assert.ok(projectPage.includes("Only a Building manual was supplied"));
  for (const id of buildingOnlyIds) {
    assert.equal(getQuizBank(id), undefined, id + ": fallback is not a published quiz");
  }
});
