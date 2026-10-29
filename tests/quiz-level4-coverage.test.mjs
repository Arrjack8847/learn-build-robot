import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getQuizBank, quizBanks, selectQuizQuestions, validateQuizBank,
  QUIZ_PASS_COUNT, QUIZ_QUESTION_COUNT,
} from "../src/data/quizStudio.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifest = JSON.parse(await readFile(resolve(root, "scripts/quiz-learning-source-manifest.json"), "utf8"));
const level4 = manifest.sources.filter(entry => entry.level === 4);
const readyIds = [
  "level-4-a-timid-mouse",
  "level-4-acoustic-control-lamp",
  "level-4-architectural-design",
  "level-4-biped-robot",
  "level-4-card-machine",
  "level-4-card-reader",
  "level-4-counting-system",
  "level-4-drop-proof-robot",
  "level-4-energy-detector",
  "level-4-guide-dogs",
  "level-4-induction-desk-lamp",
  "level-4-keeping-distance",
  "level-4-laser-rangefinder",
  "level-4-magnetically-controlled-door",
  "level-4-nocturnal-beetle",
  "level-4-obstacle-avoidance-in-snow",
  "level-4-obstacle-avoidance-robot-2",
  "level-4-password-box",
  "level-4-personal-bodyguard",
  "level-4-probe-vehicle",
  "level-4-radar-vehicle",
  "level-4-ranging-robot",
  "level-4-remote-control-car",
  "level-4-safe-box",
  "level-4-scorpion",
  "level-4-smart-curtain",
  "level-4-smart-luggage",
  "level-4-spinning-cups",
  "level-4-super-trajectory-robot-2",
  "level-4-swimming-plesiosaur",
  "level-4-tag-recognition",
  "level-4-telegraph-machine",
  "level-4-tumbler",
  "level-4-turbo-drop",
  "level-4-voice-control",
];
const expected = new Set(readyIds);

test("Level 4 syllabus has 56 entries and exactly 35 registered, validated quiz banks", () => {
  assert.equal(level4.length, 56);
  assert.equal(new Set(level4.map(x => x.projectId)).size, 56);
  assert.equal(readyIds.length, 35);
  for (const entry of level4) {
    const bank = getQuizBank(entry.projectId);
    assert.equal(Boolean(bank), expected.has(entry.projectId), entry.projectId);
  }
  assert.equal(level4.filter(entry => !getQuizBank(entry.projectId)).length, 21);
  assert.equal(level4.filter(entry => getQuizBank(entry.projectId)).length, 35);
  assert.equal(QUIZ_QUESTION_COUNT, 5);
  assert.equal(QUIZ_PASS_COUNT, 4);
});

test("Each playable Level 4 bank has ten unique questions across five objectives with exact source mapping", () => {
  const ids = new Set();
  for (const projectId of readyIds) {
    const source = level4.find(entry => entry.projectId === projectId);
    const bank = getQuizBank(projectId);
    assert.ok(source, projectId + " is missing source manifest entry");
    assert.ok(bank, projectId + " must be playable");
    assert.equal(bank.projectId, projectId);
    assert.equal(bank.sourcePdfPath, source.sourcePath);
    assert.deepEqual(validateQuizBank(bank), [], projectId);
    assert.equal(bank.questions.length, 10);
    const counts = new Map();
    for (const question of bank.questions) {
      assert.ok(!ids.has(question.id), question.id + " must be unique across Level 4");
      ids.add(question.id);
      counts.set(question.topic, (counts.get(question.topic) || 0) + 1);
      assert.ok(question.hint.trim().length >= 5);
      assert.ok(question.explanation.trim().length >= 5);
    }
    assert.equal(counts.size, 5, projectId);
    assert.ok([...counts.values()].every(count => count === 2), projectId);
    const first = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
    assert.equal(first.length, 5);
    assert.equal(retry.length, 5);
    assert.equal(new Set(first.map(q => q.topic)).size, 5);
    assert.equal(first.filter(q => retry.some(next => next.id === q.id)).length, 0, projectId);
  }
  assert.equal(ids.size, 350);
  assert.equal(readyIds.filter(id => Boolean(quizBanks[id])).length, 35);
});

test("Every published Level 4 bank references a real PDF, using its actual page count", async () => {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  for (const projectId of readyIds) {
    const bank = getQuizBank(projectId);
    const pdfPath = resolve(root, bank.sourcePdfPath);
    const info = await stat(pdfPath);
    assert.ok(info.size > 100, bank.sourcePdfPath);
    const bytes = await readFile(pdfPath);
    assert.equal(bytes.subarray(0, 5).toString("ascii"), "%PDF-", bank.sourcePdfPath);
    const loadingTask = getDocument({ data: new Uint8Array(bytes) });
    try {
      const pdf = await loadingTask.promise;
      assert.equal(pdf.numPages, bank.sourcePageCount, projectId);
      for (const question of bank.questions) {
        assert.ok(question.learningSlide >= 1 && question.learningSlide <= pdf.numPages,
          projectId + ": invalid referenced slide for " + question.id);
      }
    } finally {
      await loadingTask.destroy();
    }
  }
});

// This asserts real route gating, not browser click-through or factual answer verification.
test("Existing project picker and Quiz Studio use the shared bank availability", async () => {
  const chooser = await readFile(resolve(root, "src/data/quizSyllabus.ts"), "utf8");
  const projectRoute = await readFile(resolve(root, "src/routes/projects.$projectId.tsx"), "utf8");
  const quizRoute = await readFile(resolve(root, "src/routes/quiz.$projectId.tsx"), "utf8");
  assert.match(chooser, /status: QuizSyllabusStatus = getQuizBank\(projectId\)/);
  assert.match(projectRoute, /quizReady = quizEntry\?\.status === "ready"/);
  assert.match(quizRoute, /getQuizBank\(projectId\)/);
  assert.match(quizRoute, /selectQuizQuestions\(/);
});
