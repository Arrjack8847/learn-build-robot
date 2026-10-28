import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  blankQuizState, getQuizBank, QUIZ_PASS_COUNT, QUIZ_QUESTION_COUNT,
  readQuizSavedState, selectQuizQuestions, writeQuizSavedState, validateQuizBank,
} from "../src/data/quizStudio.ts";

const bank = getQuizBank("acceleration-car");

test("pilot has ten age-appropriate four-choice questions across five objectives", () => {
  assert.ok(bank);
  assert.equal(bank.questions.length, 10);
  assert.deepEqual(validateQuizBank(bank), []);
  assert.equal(bank.sourcePageCount, 17);
  assert.equal(new Set(bank.questions.map(q => q.id)).size, 10);
  const groups = new Map();
  for (const question of bank.questions) {
    assert.equal(question.choices.length, 4);
    assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3);
    assert.ok(question.hint.length > 10);
    assert.ok(question.explanation.length > 10);
    groups.set(question.topic, (groups.get(question.topic) ?? 0) + 1);
  }
  assert.deepEqual([...groups.values()].sort(), [2, 2, 2, 2, 2]);
  assert.equal(QUIZ_PASS_COUNT, 4);
  assert.equal(QUIZ_QUESTION_COUNT, 5);
});

test("every Acceleration Car question references a verified Learning PDF page", () => {
  assert.ok(bank);
  const sourcePage = {
    "ac-01": 7,
    "ac-02": 9,
    "ac-03": 6,
    "ac-04": 11,
    "ac-05": 11,
    "ac-06": 6,
    "ac-07": 10,
    "ac-08": 11,
    "ac-09": 13,
    "ac-10": 16,
  };
  for (const question of bank.questions) {
    assert.equal(question.learningSlide, sourcePage[question.id], `Source slide missing for ${question.id}`);
    assert.ok(Number.isInteger(question.learningSlide));
    assert.ok(question.learningSlide >= 1 && question.learningSlide <= 17);
  }
});

test("all six levels have a Learning PDF source extraction queue", async () => {
  const raw = await readFile(new URL("../scripts/quiz-learning-source-manifest.json", import.meta.url), "utf8");
  const manifest = JSON.parse(raw);
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.sources.length, 287);
  assert.deepEqual([...new Set(manifest.sources.map(item => item.level))].sort(), [1, 2, 3, 4, 5, 6]);
  assert.equal(new Set(manifest.sources.map(item => item.projectId)).size, manifest.sources.length);
  assert.ok(manifest.sources.every(item => item.sourcePath.startsWith("public/") && item.url.startsWith("https://")));
  assert.ok(manifest.sources.every(item => item.reviewed === false));
  const accelerationSource = manifest.sources.find(item => item.projectId === "acceleration-car");
  assert.ok(accelerationSource);
  assert.equal(accelerationSource.sourcePath, bank.sourcePdfPath);
});

test("published quiz banks cover the syllabus PDFs in every level", async () => {
  const expected = [
    ["acceleration-car", 1, 17],
    ["big-head-robot", 1, 16],
    ["level-2-axe-robot", 2, 19],
    ["level-3-clip-robot", 3, 17],
    ["level-4-acoustic-control-lamp", 4, 20],
    ["level-5-barometric-sensor", 5, 26],
    ["level-6-altimeter", 6, 22],
    ["clock", 1, 16],
    ["level-2-fan-robot", 2, 19],
    ["level-3-following-robot", 3, 22],
    ["level-4-a-timid-mouse", 4, 27],
    ["level-5-autonomous-driving", 5, 20],
    ["level-6-ball-tracking", 6, 20],
    ["funny-cat", 1, 21],
    ["sled-dog", 1, 17],
    ["bird", 1, 16],
    ["house", 1, 16],
    ["spongebob", 1, 20],
    ["wali-robot", 1, 14],
    ["blinking-robot", 1, 19],
  ];
  const manifest = JSON.parse(await readFile(new URL("../scripts/quiz-learning-source-manifest.json", import.meta.url), "utf8"));
  const scores = new Set();
  for (const [id, level, pages] of expected) {
    const source = manifest.sources.find(item => item.projectId === id);
    assert.ok(source, id + ": missing source registry entry");
    assert.equal(source.level, level);
    const published = getQuizBank(id);
    assert.ok(published, id + ": not published");
    assert.equal(published.projectId, id);
    assert.equal(published.sourcePageCount, pages);
    assert.equal(published.sourcePdfPath, source.sourcePath);
    assert.equal(published.questions.length, 10);
    assert.deepEqual(validateQuizBank(published), [], id);
    const first = selectQuizQuestions(published, [], () => 0);
    const retry = selectQuizQuestions(published, first.map(q => q.id), () => 0);
    assert.equal(first.length, 5, id);
    assert.equal(retry.length, 5, id);
    assert.equal(new Set(first.map(q => q.topic)).size, 5, id);
    assert.equal(first.filter(q => retry.some(p => p.id === q.id)).length, 0, id);
    for (const q of published.questions) {
      assert.ok(q.learningSlide >= 1 && q.learningSlide <= pages, id + " bad slide " + q.id);
    }
    scores.add(level);
  }
  assert.equal(expected.length, 20);
  const perLevel = [1,2,3,4,5,6].map(level => expected.filter(row => row[1] === level).length);
  assert.deepEqual(perLevel, [10,2,2,2,2,2]);
  assert.deepEqual([...scores].sort(), [1,2,3,4,5,6]);
});

test("a bank with broken references is rejected before publication", () => {
  assert.ok(bank);
  assert.ok(validateQuizBank({ ...bank, sourcePageCount: 3 }).some(message => message.includes("slide")));
  assert.ok(validateQuizBank({ ...bank, questions: bank.questions.slice(0, 5) }).length > 0);
});

test("each attempt covers all five objectives and the immediate retry avoids repeats", () => {
  assert.ok(bank);
  const first = selectQuizQuestions(bank, [], () => 0);
  const second = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
  assert.equal(first.length, 5);
  assert.equal(new Set(first.map(q => q.topic)).size, 5);
  assert.equal(second.length, 5);
  assert.equal(new Set(second.map(q => q.topic)).size, 5);
  assert.equal(second.filter(q => first.some(previous => previous.id === q.id)).length, 0);
});

test("storage retains draft, best result and safely ignores invalid browser records", () => {
  assert.ok(bank);
  const values = new Map();
  const prior = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
    dispatchEvent: () => true,
  };
  try {
    const empty = readQuizSavedState(bank.projectId);
    assert.deepEqual(empty, blankQuizState());
    const ids = selectQuizQuestions(bank, [], () => 0).map(q => q.id);
    const next = { bestScore: 4, lastQuestionIds: ids, draft: { questionIds: ids, answers: { [ids[0]]: 2 }, currentIndex: 2 } };
    assert.equal(writeQuizSavedState(bank.projectId, next), true);
    assert.deepEqual(readQuizSavedState(bank.projectId), next);
    values.set("bsr.quiz-studio.v1:" + bank.projectId, '{"draft":{"questionIds":["unknown"],"answers":{},"currentIndex":99},"bestScore":100}');
    const invalid = readQuizSavedState(bank.projectId);
    assert.equal(invalid.bestScore, null);
    assert.equal(invalid.draft, null);
  } finally {
    if (prior === undefined) delete globalThis.window;
    else globalThis.window = prior;
  }
});
