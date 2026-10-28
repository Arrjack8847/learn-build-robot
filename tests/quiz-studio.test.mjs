import test from "node:test";
import assert from "node:assert/strict";
import {
  blankQuizState, getQuizBank, QUIZ_PASS_COUNT, QUIZ_QUESTION_COUNT,
  readQuizSavedState, selectQuizQuestions, writeQuizSavedState,
} from "../src/data/quizStudio.ts";

const bank = getQuizBank("acceleration-car");

test("pilot has ten age-appropriate four-choice questions across five objectives", () => {
  assert.ok(bank);
  assert.equal(bank.questions.length, 10);
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
