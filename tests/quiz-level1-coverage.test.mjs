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

test("all 14 source-supported manual-based quizzes are playable", () => {
  for (const { projectId, sourcePath, sourceKind } of fallbacks.sources) {
    assert.equal(sourceKind, "official-building-manual-learning-fallback");
    assert.ok(sourcePath.startsWith("public/") && sourcePath.endsWith(".pdf"));
    const bank = getQuizBank(projectId);
    assert.ok(bank, projectId + ": source-grounded manual question bank must be loadable");
    assert.deepEqual(validateQuizBank(bank), [], projectId);
    assert.equal(bank.sourcePdfPath, sourcePath, projectId);
    assert.equal(bank.questions.length, 10, projectId);
    const first = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
    assert.equal(first.length, 5, projectId);
    assert.equal(new Set(first.map(q => q.topic)).size, 5, projectId);
    assert.equal(first.filter(q => retry.some(p => p.id === q.id)).length, 0, projectId);
  }
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
  const pdfViewer = await readFile(resolve(root, "src/components/practical/PdfActivityViewer.tsx"), "utf8");
  const practicalRoute = await readFile(resolve(root, "src/routes/practical/$projectId.tsx"), "utf8");
  assert.ok(studio.includes('get("slide")'), "Learning Studio must open the requested review slide");
  assert.ok(pdfViewer.includes('get("slide")'), "manual-backed reviews must open their requested page");
  assert.ok(practicalRoute.includes("const pdfManual = pdfActivityManuals[project.id]"),
    "manual-only projects must retain their real construction PDF");
});

test("Building-only quiz sources are identified honestly and remain playable", async () => {
  const syllabus = await readFile(resolve(root, "src/data/quizSyllabus.ts"), "utf8");
  const projectPage = await readFile(resolve(root, "src/routes/projects.$projectId.tsx"), "utf8");
  assert.ok(syllabus.includes('"building-manual-only"'), "missing fallback status");
  assert.ok(syllabus.includes("buildingManualOnlyLevelOneIds.has(projectId)"),
    "fallback gate must check source kind per project");
  assert.ok(projectPage.includes("getQuizBank(project.id) &&"),
    "all verified manual-backed quiz banks must remain selectable");
  assert.ok(projectPage.includes("Project-specific learning materials have not been added yet."),
    "manual-only projects must not advertise nonexistent teaching slides");
  assert.ok(getQuizBank("pocket-pistol"), "safety-and-elasticity quiz must be available");
  assert.ok(syllabus.includes("usesBuildingManual:"), "source kind must reach the project UI");
  const quiz = await readFile(resolve(root, "src/routes/quiz.$projectId.tsx"), "utf8");
  assert.ok(quiz.includes("Review Construction Manual Page"), "manual page links must be accurately labeled");
});

test("manual-based banks reference the exact number of pages in their official source PDFs", async () => {
  for (const source of fallbacks.sources) {

    const bank = getQuizBank(source.projectId);
    assert.ok(bank);
    const bytes = await readFile(resolve(root, source.sourcePath));
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "%PDF", source.projectId);
    const pdf = await getDocument({
      data: new Uint8Array(bytes), useSystemFonts: false, disableFontFace: true,
    }).promise;
    try {
      assert.equal(pdf.numPages, bank.sourcePageCount, source.projectId + ": manual page-count mismatch");
      for (const question of bank.questions) {
        assert.ok(question.learningSlide >= 1 && question.learningSlide <= pdf.numPages,
          question.id + ": manual page out of range");
      }
    } finally {
      await pdf.destroy();
    }
  }
});

test("Pocket Pistol quiz assesses safety and elasticity, not weapon operation", () => {
  const bank = getQuizBank("pocket-pistol");
  assert.ok(bank, "safe question bank must be registered");
  assert.equal(bank.sourcePdfPath, "public/Pocket Pistol.pdf");
  assert.equal(bank.sourcePageCount, 14);
  assert.deepEqual(validateQuizBank(bank), []);
  assert.deepEqual(new Set(bank.questions.map(q => q.topic)), new Set([
    "weapon-hazards", "peaceful-problem-solving", "elasticity", "tension", "safe-inquiry",
  ]));
  const content = bank.questions.flatMap(q => [q.prompt, ...q.choices, q.hint, q.explanation]).join(" ");
  assert.doesNotMatch(content, /\b(?:how to|steps? to|instructions? for)\s+(?:build|assemble|fire|launch|shoot|aim)\b/i);
  for (const q of bank.questions) {
    assert.ok([3, 4, 5].includes(q.learningSlide), q.id + ": unreviewed diagram page");
  }
  const first = selectQuizQuestions(bank, [], () => 0);
  const next = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
  assert.equal(first.length, 5);
  assert.equal(next.length, 5);
  assert.equal(first.filter(q => next.some(item => item.id === q.id)).length, 0);
});
