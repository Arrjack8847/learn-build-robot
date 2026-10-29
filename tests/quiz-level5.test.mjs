import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { getQuizBank, QUIZ_PASS_COUNT, QUIZ_QUESTION_COUNT, selectQuizQuestions, validateQuizBank } from "../src/data/quizStudio.ts";

/** All 51 registered Level 5 banks from the actual source PDF slide reviews. */
const published = new Map([
  [
    "level-5-autonomous-driving",
    20
  ],
  [
    "level-5-barometric-sensor",
    26
  ],
  [
    "level-5-big-pendulum",
    20
  ],
  [
    "level-5-car-speed-detector",
    23
  ],
  [
    "level-5-clothes-dryer",
    22
  ],
  [
    "level-5-face-tracking",
    22
  ],
  [
    "level-5-facial-recognition-time-clock",
    22
  ],
  [
    "level-5-goalkeeper",
    20
  ],
  [
    "level-5-hexapod-robot",
    21
  ],
  [
    "level-5-lucky-prize-wheel",
    21
  ],
  [
    "level-5-magnetic-anti-theft-cabinet",
    22
  ],
  [
    "level-5-magnetic-object-finder",
    23
  ],
  [
    "level-5-music-box",
    20
  ],
  [
    "level-5-passenger-counter",
    20
  ],
  [
    "level-5-revolving-door",
    22
  ],
  [
    "level-5-smart-turnstile",
    20
  ],
  [
    "level-5-super-patrol-car",
    13
  ],
  [
    "level-5-super-trajectory-robot-3",
    18
  ],
  [
    "level-5-super-trajectory-robot-4",
    15
  ],
  [
    "level-5-swing-with-rhythm",
    23
  ],
  [
    "level-5-the-warrior",
    21
  ],
  [
    "level-5-tracking-car",
    19
  ],
  [
    "level-5-traffic-signs",
    20
  ],
  [
    "level-5-voice-control-snail",
    18
  ],
  [
    "level-5-voice-control-vehicle",
    21
  ],
  [
    "level-5-welcome-sign",
    25
  ],
  [
    "level-5-car-lights",
    25
  ],
  [
    "level-5-chairoplane",
    25
  ],
  [
    "level-5-crack-shot",
    26
  ],
  [
    "level-5-curling-game",
    31
  ],
  [
    "level-5-direction-indicator",
    26
  ],
  [
    "level-5-drawing-machine",
    25
  ],
  [
    "level-5-firefly",
    38
  ],
  [
    "level-5-kiddie-ride",
    25
  ],
  [
    "level-5-light-chasing-car",
    31
  ],
  [
    "level-5-machine-gun",
    35
  ],
  [
    "level-5-oil-pumping-unit",
    32
  ],
  [
    "level-5-please-scan-to-ride",
    22
  ],
  [
    "level-5-remote-control-car",
    34
  ],
  [
    "level-5-remote-control-fan",
    25
  ],
  [
    "level-5-rescue-robot",
    28
  ],
  [
    "level-5-runner",
    38
  ],
  [
    "level-5-shopping-guide-robot",
    28
  ],
  [
    "level-5-smart-cash-register",
    25
  ],
  [
    "level-5-smart-guiding-car",
    23
  ],
  [
    "level-5-spanish-bullfight",
    34
  ],
  [
    "level-5-swinging-shark",
    24
  ],
  [
    "level-5-top-scorer",
    26
  ],
  [
    "level-5-traffic-robot",
    25
  ],
  [
    "level-5-voice-controlled-frog",
    30
  ],
  [
    "level-5-wind-up-car",
    33
  ]
]);
const manuscript = JSON.parse(await readFile(new URL("../scripts/quiz-learning-source-manifest.json", import.meta.url), "utf8"));
const levelFive = manuscript.sources.filter(source => source.level === 5);

test("Level 5 syllabus contains exactly 51 registered Learning sources", () => {
  assert.equal(levelFive.length, 51);
  assert.equal(new Set(levelFive.map(item => item.projectId)).size, 51);
  for (const source of levelFive) {
    assert.equal(typeof source.url, "string");
    assert.ok(source.sourcePath.startsWith("public/Level 5/Learning/"));
  }
});

test("all 51 registered Level 5 banks are integrated", () => {
  assert.equal(published.size, 51);
  assert.equal(QUIZ_QUESTION_COUNT, 5);
  assert.equal(QUIZ_PASS_COUNT, 4);
  const manifestIds = new Set(levelFive.map(item => item.projectId));
  for (const id of published.keys()) assert.ok(manifestIds.has(id), id);
  for (const source of levelFive) {
    const bank = getQuizBank(source.projectId);
    if (!published.has(source.projectId)) {
      assert.equal(bank, undefined, source.projectId + " should remain pending");
    } else {
      assert.ok(bank, source.projectId + " is missing from Quiz Studio registry");
    }
  }
});

test("published Level 5 banks satisfy question, source, uniqueness and retry rules", () => {
  const usedIds = new Set();
  const sources = new Map(levelFive.map(item => [item.projectId, item]));
  for (const [id, pageCount] of published) {
    const bank = getQuizBank(id);
    assert.ok(bank, id);
    assert.equal(bank.projectId, id);
    assert.equal(bank.sourcePdfPath, sources.get(id)?.sourcePath, id);
    assert.equal(bank.sourcePageCount, pageCount, id);
    assert.deepEqual(validateQuizBank(bank), [], id);
    assert.equal(bank.questions.length, 10, id);
    if (id !== "level-5-autonomous-driving" && id !== "level-5-barometric-sensor") {
      const answerPositions = Array.from({ length: 4 }, (_, correctIndex) =>
        bank.questions.filter(question => question.correctIndex === correctIndex).length);
      assert.deepEqual(answerPositions, [3, 3, 2, 2], id + " should balance answer positions");
    }
    const prompts = new Set();
    for (const question of bank.questions) {
      assert.ok(!usedIds.has(question.id), "duplicated question ID: " + question.id);
      usedIds.add(question.id);
      assert.ok(!prompts.has(question.prompt.toLowerCase()), "repeated prompt in " + id);
      prompts.add(question.prompt.toLowerCase());
      assert.equal(question.choices.length, 4);
      assert.equal(new Set(question.choices.map(choice => choice.trim().toLowerCase())).size, 4);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
      assert.ok(question.hint.trim().length > 5);
      assert.ok(question.explanation.trim().length > 10);
      assert.ok(question.learningSlide >= 1 && question.learningSlide <= pageCount);
    }
    const first = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
    assert.equal(first.length, 5);
    assert.equal(new Set(first.map(q => q.topic)).size, 5);
    assert.equal(retry.length, 5);
    assert.equal(retry.filter(q => first.some(previous => previous.id === q.id)).length, 0);
  }
  assert.equal(usedIds.size, 510);
});

test("verified source PDF files exist and declared page counts match the PDF", async () => {
  for (const [id, pageCount] of published) {
    const bank = getQuizBank(id);
    const fullPath = new URL("../" + bank.sourcePdfPath, import.meta.url);
    const fileInfo = await stat(fullPath);
    assert.ok(fileInfo.size > 100, id + " has no source bytes");
    const bytes = new Uint8Array(await readFile(fullPath));
    const pdf = await getDocument({ data: bytes, disableFontFace: true, useSystemFonts: true }).promise;
    try { assert.equal(pdf.numPages, pageCount, id); }
    finally { await pdf.destroy(); }
  }
});
