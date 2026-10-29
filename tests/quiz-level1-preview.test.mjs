import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getQuizBank, readQuizSavedState, writeQuizSavedState, blankQuizState } from "../src/data/quizStudio.ts";
const root = new URL("../", import.meta.url);
const file = path => readFile(new URL(path, root), "utf8");

test("33 pending Level 1 banks remain unpublished and preview is dev-only", async () => {
  const status = JSON.parse(await file("scripts/level1-quiz-status.json"));
  const pending = [...status.pendingWithIndexedLearningPdf, ...status.pendingWithoutIndexedLearningPdf];
  assert.equal(pending.length, 33);
  for (const item of pending) assert.equal(getQuizBank(item.projectId), undefined, item.projectId);
  const loader = await file("src/data/quizPreviewBanks.ts");
  const route = await file("src/routes/quiz.$projectId.tsx");
  assert.ok(loader.includes("import.meta.env.DEV"));
  assert.ok(loader.includes("import.meta.glob"));
  assert.ok(route.includes('new URLSearchParams(window.location.search).get("preview") === "1"'));
  assert.ok(route.includes('void import("@/data/quizPreviewBanks")'));
  assert.ok(route.includes("Scores are saved separately from student results"));
  assert.ok(!((await file("src/data/quizStudio.ts")).includes('import { ferociousSnakeBank }')));
});

test("preview quiz progress cannot overwrite published student quiz results", () => {
  const official = getQuizBank("acceleration-car");
  assert.ok(official);
  const preview = { ...official, projectId: "local-preview-stub" };
  const oldWindow = globalThis.window;
  const oldCustomEvent = globalThis.CustomEvent;
  const store = new Map();
  globalThis.window = { localStorage: {
    getItem: key => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
  }, dispatchEvent: () => true };
  globalThis.CustomEvent = class CustomEvent { constructor(type, options) { this.type = type; this.detail = options?.detail; } };
  try {
    const value = { bestScore: 4, lastQuestionIds: [], draft: null };
    assert.deepEqual(readQuizSavedState(preview.projectId, preview), blankQuizState());
    assert.equal(writeQuizSavedState(preview.projectId, value, preview), true);
    assert.equal(store.has("bsr.quiz-preview.v1:" + preview.projectId), true);
    assert.equal(store.has("bsr.quiz-studio.v1:" + preview.projectId), false);
    assert.deepEqual(readQuizSavedState(preview.projectId, preview), value);
    assert.deepEqual(readQuizSavedState(preview.projectId), blankQuizState());
    assert.equal(writeQuizSavedState(official.projectId, value), true);
    assert.equal(store.has("bsr.quiz-studio.v1:" + official.projectId), true);
  } finally {
    if (oldWindow === undefined) delete globalThis.window; else globalThis.window = oldWindow;
    if (oldCustomEvent === undefined) delete globalThis.CustomEvent; else globalThis.CustomEvent = oldCustomEvent;
  }
});
