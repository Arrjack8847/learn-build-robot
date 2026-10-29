import test from "node:test";
import assert from "node:assert/strict";
import { resolveQuizExtractionLimit } from "../scripts/quiz-extraction-limit.mjs";

test("single-project PDF extraction defaults to a valid finite limit of one", () => {
  assert.equal(
    resolveQuizExtractionLimit({ projectId: "ferocious-snake", level: null, all: false, limitArg: undefined }),
    1,
  );
});

test("level and all extraction keep the existing cautious default of five", () => {
  assert.equal(resolveQuizExtractionLimit({ projectId: null, level: 1, all: false }), 5);
  assert.equal(resolveQuizExtractionLimit({ projectId: null, level: null, all: true }), 5);
});

test("explicit positive limits are accepted and invalid values are rejected", () => {
  assert.equal(resolveQuizExtractionLimit({ projectId: "ferocious-snake", limitArg: "19" }), 19);
  for (const invalid of ["", "0", "-1", "Infinity", "NaN", "1.25", "abc"]) {
    assert.throws(
      () => resolveQuizExtractionLimit({ projectId: "ferocious-snake", limitArg: invalid }),
      /--limit must be a positive integer/,
      "unexpectedly accepted " + JSON.stringify(invalid),
    );
  }
});
