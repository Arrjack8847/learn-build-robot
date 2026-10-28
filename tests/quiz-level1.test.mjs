import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getQuizBank, validateQuizBank, selectQuizQuestions } from "../src/data/quizStudio.ts";

const levelOneBanks = [
  [
    "acceleration-car",
    17
  ],
  [
    "big-head-robot",
    16
  ],
  [
    "clock",
    16
  ],
  [
    "funny-cat",
    21
  ],
  [
    "bird",
    16
  ],
  [
    "traffic-light-signal",
    16
  ],
  [
    "lighthouse",
    16
  ],
  [
    "the-lawn-mower",
    19
  ],
  [
    "house",
    16
  ],
  [
    "blinking-robot",
    19
  ],
  [
    "responder",
    16
  ],
  [
    "car",
    14
  ],
  [
    "crawl-slowly-basic",
    28
  ],
  [
    "crawl-slowly-optimized",
    28
  ],
  [
    "dart",
    14
  ],
  [
    "gyro-transmitter",
    17
  ],
  [
    "help-light",
    15
  ],
  [
    "little-stars",
    17
  ],
  [
    "primitive-robot",
    17
  ],
  [
    "pull-back-car",
    16
  ],
  [
    "rotating-flying-chair",
    17
  ],
  [
    "shock-absorber",
    18
  ],
  [
    "skating",
    11
  ],
  [
    "sled",
    15
  ],
  [
    "sled-dog",
    17
  ],
  [
    "spongebob",
    20
  ],
  [
    "wali-robot",
    14
  ]
];

test("all 27 Level 1 authored banks are connected and source-anchored", async () => {
  const manifest = JSON.parse(await readFile(new URL("../scripts/quiz-learning-source-manifest.json", import.meta.url), "utf8"));
  assert.equal(levelOneBanks.length, 27);
  for (const [projectId, numberOfPages] of levelOneBanks) {
    const bank = getQuizBank(projectId);
    assert.ok(bank, projectId + " should have a published bank");
    assert.equal(bank.projectId, projectId);
    assert.equal(bank.questions.length, 10);
    assert.equal(bank.sourcePageCount, numberOfPages);
    const source = manifest.sources.find(s => s.level === 1 && s.projectId === projectId);
    assert.ok(source, projectId + " must have a registered Learning PDF");
    assert.equal(bank.sourcePdfPath, source.sourcePath);
    assert.deepEqual(validateQuizBank(bank), [], projectId + " did not pass structural validation");
    const first = selectQuizQuestions(bank, [], () => 0);
    const second = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
    assert.equal(first.length, 5);
    assert.equal(second.length, 5);
    assert.equal(new Set(first.map(q => q.topic)).size, 5);
    assert.equal(second.filter(q => first.some(old => old.id === q.id)).length, 0);
    assert.equal(new Set(bank.questions.map(q => q.id)).size, 10);
    for (const q of bank.questions) {
      assert.ok(q.learningSlide >= 1 && q.learningSlide <= numberOfPages, projectId + " " + q.id + " invalid slide");
      assert.ok(q.hint.length > 12);
      assert.ok(q.explanation.length > 16);
      assert.equal(q.choices.length, 4);
      assert.ok(q.choices.every(c => c.trim().length > 0));
    }
  }
});

test("Level 1 still has unavailable projects requiring source or content review", async () => {
  const status = JSON.parse(await readFile(new URL("../scripts/level1-quiz-status.json", import.meta.url), "utf8"));
  assert.equal(status.registered, 60);
  assert.equal(status.ready, 27);
  assert.equal(status.pending, 33);
  assert.equal(status.pendingWithIndexedLearningPdf.length, 19);
  assert.equal(status.pendingWithoutIndexedLearningPdf.length, 14);
});
