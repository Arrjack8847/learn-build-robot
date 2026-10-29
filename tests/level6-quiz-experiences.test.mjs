import test from "node:test";
import assert from "node:assert/strict";
import { readFile, open, stat, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  getQuizBank, selectQuizQuestions, validateQuizBank,
  QUIZ_QUESTION_COUNT, QUIZ_PASS_COUNT,
  readQuizSavedState, writeQuizSavedState, blankQuizState,
} from "../src/data/quizStudio.ts";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceIndexPath = join(repositoryRoot, "scripts/quiz-learning-source-manifest.json");
const allSources = JSON.parse(await readFile(sourceIndexPath, "utf8")).sources;
const levelSix = allSources.filter(source => source.level === 6);
const byProject = new Map(levelSix.map(source => [source.projectId, source]));

test("Level 6 has 43 unique registered real Learning-PDF paths", async () => {
  assert.equal(levelSix.length, 43, "Update this count only after reviewing curriculum changes");
  assert.equal(byProject.size, 43, "Duplicate Level 6 project ID");
  for (const source of levelSix) {
    assert.ok(source.projectId.startsWith("level-6-"), source.projectId);
    assert.ok(source.sourcePath.startsWith("public/Level 6/Learning/"), source.sourcePath);
    assert.ok(source.sourcePath.endsWith(".pdf"), source.sourcePath);
    assert.ok(!source.sourcePath.includes(".."), source.sourcePath);
    assert.ok(source.url.startsWith("https://"), source.projectId);
    const filePath = resolve(repositoryRoot, source.sourcePath);
    const details = await stat(filePath);
    assert.ok(details.size > 100, source.projectId + " has empty source PDF");
    const handle = await open(filePath, "r");
    try {
      const magic = Buffer.alloc(5);
      await handle.read(magic, 0, 5, 0);
      assert.equal(magic.toString("ascii"), "%PDF-", source.projectId + " is not a PDF");
    } finally {
      await handle.close();
    }
  }
});

test("only complete, valid, source-linked Level 6 banks are playable", () => {
  const published = levelSix.filter(source => getQuizBank(source.projectId));
  assert.equal(published.length, 43, "Every registered Level 6 project must have a bank");
  const questionIds = new Set();
  for (const preserved of ["level-6-altimeter", "level-6-ball-tracking"]) {
    assert.ok(getQuizBank(preserved), "Previously published bank lost: " + preserved);
  }
  for (const source of published) {
    const bank = getQuizBank(source.projectId);
    assert.ok(bank);
    assert.deepEqual(validateQuizBank(bank), [], source.projectId);
    assert.equal(bank.projectId, source.projectId);
    assert.equal(bank.sourcePdfPath, source.sourcePath);
    assert.equal(bank.questions.length, 10);
    for (const question of bank.questions) {
      assert.ok(!questionIds.has(question.id), source.projectId + ": duplicate question id " + question.id);
      questionIds.add(question.id);
    }
    assert.ok(Number.isInteger(bank.sourcePageCount) && bank.sourcePageCount > 0);
    for (const question of bank.questions) {
      assert.ok(question.learningSlide >= 1 && question.learningSlide <= bank.sourcePageCount);
      assert.equal(question.choices.length, 4);
      assert.equal(new Set(question.choices.map(v => v.trim().toLowerCase())).size, 4);
      assert.ok(question.hint.trim().length > 0);
      assert.ok(question.explanation.trim().length > 0);
      assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4);
    }
  }
  assert.equal(questionIds.size, 430, "Expected 430 unique question IDs across 43 banks");
});

test("published Level 6 banks use the actual PDF's page count", async () => {
  for (const source of levelSix) {
    const bank = getQuizBank(source.projectId);
    assert.ok(bank, source.projectId + ": quiz bank must exist");
    const data = await readFile(resolve(repositoryRoot, source.sourcePath));
    const pdf = await getDocument({
      data: new Uint8Array(data),
      useSystemFonts: true,
      disableFontFace: true,
    }).promise;
    try {
      assert.equal(bank.sourcePageCount, pdf.numPages,
        source.projectId + " sourcePageCount disagrees with actual source PDF");
      assert.ok(bank.questions.every(q => q.learningSlide <= pdf.numPages), source.projectId);
    } finally {
      await pdf.destroy();
    }
  }
});

test("Level 6 attempts use one question per objective, new questions on immediate retry and 4/5 to pass", () => {
  assert.equal(QUIZ_QUESTION_COUNT, 5);
  assert.equal(QUIZ_PASS_COUNT, 4);
  for (const source of levelSix) {
    const bank = getQuizBank(source.projectId);
    assert.ok(bank, source.projectId + ": quiz bank must exist");
    const first = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
    assert.equal(first.length, 5, source.projectId);
    assert.equal(retry.length, 5, source.projectId);
    assert.equal(new Set(first.map(q => q.topic)).size, 5, source.projectId);
    assert.equal(new Set(retry.map(q => q.topic)).size, 5, source.projectId);
    assert.equal(first.filter(q => retry.some(other => other.id === q.id)).length, 0, source.projectId);
    assert.ok(first.every(q => bank.questions.includes(q)));
  }
});

test("Level 6 saves drafts and best results, and rejects corrupt resume records", () => {
  const bank = getQuizBank("level-6-altimeter");
  assert.ok(bank);
  const store = new Map();
  const priorWindow = globalThis.window;
  const priorCustomEvent = globalThis.CustomEvent;
  globalThis.window = {
    localStorage: {
      getItem: key => store.get(key) ?? null,
      setItem: (key, value) => store.set(key, value),
    },
    dispatchEvent: () => true,
  };
  if (typeof globalThis.CustomEvent !== "function") {
    globalThis.CustomEvent = class {
      constructor(type, options) { this.type = type; this.detail = options?.detail; }
    };
  }
  try {
    assert.deepEqual(readQuizSavedState(bank.projectId), blankQuizState());
    const questionIds = selectQuizQuestions(bank, [], () => 0).map(q => q.id);
    const state = {
      bestScore: 4,
      lastQuestionIds: questionIds,
      draft: { questionIds, answers: { [questionIds[0]]: 0 }, currentIndex: 1 },
    };
    assert.equal(writeQuizSavedState(bank.projectId, state), true);
    assert.deepEqual(readQuizSavedState(bank.projectId), state);
    store.set("bsr.quiz-studio.v1:" + bank.projectId, '{"bestScore":900,"draft":{"questionIds":["wrong"],"answers":{},"currentIndex":22}}');
    assert.equal(readQuizSavedState(bank.projectId).bestScore, null);
    assert.equal(readQuizSavedState(bank.projectId).draft, null);
  } finally {
    if (priorWindow === undefined) delete globalThis.window;
    else globalThis.window = priorWindow;
    if (priorCustomEvent === undefined) delete globalThis.CustomEvent;
    else globalThis.CustomEvent = priorCustomEvent;
  }
});


test("all 43 Level 6 projects remain registered and replayable", () => {
  assert.equal(levelSix.length, 43);
  for (const source of levelSix) {
    const bank = getQuizBank(source.projectId);
    assert.ok(bank, source.projectId + ": quiz must be registered");
    assert.deepEqual(validateQuizBank(bank), [], source.projectId);
    const first = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
    assert.equal(first.length, 5, source.projectId);
    assert.equal(retry.length, 5, source.projectId);
    assert.equal(first.filter(q => retry.some(x => x.id === q.id)).length, 0, source.projectId);
  }
});

// Text extracts prove page numbering, not that PDF diagrams received independent visual review.
// Two original banks and Remote Control Lift do not have .extracted.json evidence committed.
test("all 40 Level 6 slide-evidence files agree with the quiz registry", async () => {
  const evidenceDirectory = join(repositoryRoot, "src/data/quizBanks/level6/evidence");
  const evidenceFiles = (await readdir(evidenceDirectory))
    .filter(name => /^level-6-.*\.extracted\.json$/.test(name)).sort();
  assert.equal(evidenceFiles.length, 40, "Level 6 evidence inventory differs from the committed 40");
  const evidenceIds = new Set();
  for (const name of evidenceFiles) {
    const evidence = JSON.parse(await readFile(join(evidenceDirectory, name), "utf8"));
    const id = evidence.projectId;
    assert.equal(name, id + ".extracted.json", id + ": evidence filename mismatch");
    assert.ok(byProject.has(id), id + ": evidence does not match syllabus");
    assert.ok(!evidenceIds.has(id), id + ": duplicate evidence");
    evidenceIds.add(id);
    const bank = getQuizBank(id);
    assert.ok(bank, id + ": quiz missing");
    assert.equal(evidence.sourcePath, bank.sourcePdfPath, id + ": source PDF mismatch");
    assert.equal(evidence.pageCount, bank.sourcePageCount, id + ": page count mismatch");
    assert.ok(Number.isInteger(evidence.sourceBytes) && evidence.sourceBytes > 100,
      id + ": original PDF byte size not recorded");
    const slides = new Set((evidence.pages || []).map(page => page.slide));
    assert.equal(slides.size, bank.sourcePageCount, id + ": missing or duplicate slide");
    for (let slide = 1; slide <= bank.sourcePageCount; slide++)
      assert.ok(slides.has(slide), id + ": slide " + slide + " is missing");
    for (const question of bank.questions)
      assert.ok(slides.has(question.learningSlide), id + ": " + question.id + " cites an absent slide");
  }
  const expectedWithoutExtract = [
    "level-6-altimeter", "level-6-ball-tracking", "level-6-remote-control-lift"
  ];
  const withoutExtract = levelSix.map(source => source.projectId)
    .filter(id => !evidenceIds.has(id)).sort();
  assert.deepEqual(withoutExtract, expectedWithoutExtract,
    "Evidence coverage changed; review missing or newly supplied extracts");
});
