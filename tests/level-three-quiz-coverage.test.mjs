import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  getQuizBank, QUIZ_PASS_COUNT, QUIZ_QUESTION_COUNT,
  selectQuizQuestions, validateQuizBank,
} from "../src/data/quizStudio.ts";

const sourceManifest = JSON.parse(await readFile(new URL("../scripts/quiz-learning-source-manifest.json", import.meta.url), "utf8"));
const level3Sources = sourceManifest.sources.filter(item => item.level === 3);
const fallbackIds = [
  "level-3-lifting-maintenance-vehicle",
  "level-3-biting-monster",
  "level-3-electric-gyro-launcher",
  "level-3-responder",
  "level-3-lunar-rover",
];
const readyIds = [
  "level-3-clip-robot",
  "level-3-following-robot",
  "level-3-automatic-seesaw",
  "level-3-bumper-car-interactive-mechanisms",
  "level-3-electric-guitar",
  "level-3-f1-racing-car",
  "level-3-line-patrol-car",
  "level-3-obstacle-avoidance-robot-1",
  "level-3-parking-gate",
  "level-3-security-door",
  "level-3-smart-audio",
  "level-3-smart-door",
  "level-3-sonometer",
  "level-3-sunflower",
  "level-3-super-trajectory-robot-1",
];

test("Level 3 registered inventory has 46 Learning-PDF entries and 5 fallback lessons", async () => {
  assert.equal(level3Sources.length, 46);
  const manifestIds = level3Sources.map(item => item.projectId);
  assert.equal(new Set(manifestIds).size, 46, "Duplicate Level 3 source IDs");
  assert.equal(new Set([...manifestIds, ...fallbackIds]).size, 51);
  assert.ok(readyIds.every(id => manifestIds.includes(id)), "Published quiz has no Learning-PDF mapping");
  const registry = await readFile(new URL("../src/data/levelThreeLectures.ts", import.meta.url), "utf8");
  const matches = registry.match(/\["level-3-[^"]+",\s*"[^"]+\.pdf"\]/g) ?? [];
  assert.equal(matches.length, 46, "Level Three Learning registry no longer matches source manifest");
  for (const id of [...manifestIds, ...fallbackIds]) {
    assert.ok(registry.includes('"' + id + '"'), "Unregistered Level 3 project: " + id);
  }
});

test("Level 3 Building-manual Learning fallbacks are all independently registered and on disk", async () => {
  const raw = await readFile(new URL("../scripts/quiz-level3-building-fallbacks.json", import.meta.url), "utf8");
  const fallback = JSON.parse(raw);
  assert.equal(fallback.schemaVersion, 1);
  assert.equal(fallback.sources.length, 5);
  const ids = fallback.sources.map(source => source.projectId);
  assert.deepEqual(new Set(ids), new Set(fallbackIds));
  for (const source of fallback.sources) {
    assert.equal(source.level, 3);
    assert.ok(source.sourcePath.startsWith("public/") && source.sourcePath.endsWith(".pdf"));
    assert.ok(source.url.startsWith("https://"), source.projectId);
    const pdfBytes = await readFile(new URL("../" + source.sourcePath, import.meta.url));
    assert.equal(String.fromCharCode(...pdfBytes.subarray(0, 5)), "%PDF-", source.projectId);
  }
});

test("all and only the 15 reviewed Level 3 banks are playable", () => {
  assert.equal(readyIds.length, 15);
  assert.equal(QUIZ_QUESTION_COUNT, 5);
  assert.equal(QUIZ_PASS_COUNT, 4);
  for (const id of readyIds) {
    const bank = getQuizBank(id);
    assert.ok(bank, "Missing playable quiz for " + id);
    assert.equal(bank.projectId, id);
    assert.equal(bank.questions.length, 10);
    assert.deepEqual(validateQuizBank(bank), [], id);
  }
  const pending = level3Sources.filter(entry => !readyIds.includes(entry.projectId));
  assert.equal(pending.length, 31);
  for (const entry of pending) assert.equal(getQuizBank(entry.projectId), undefined, "Unreviewed quiz published: " + entry.projectId);
  for (const id of fallbackIds) assert.equal(getQuizBank(id), undefined, "Building-only fallback published without review: " + id);
});

test("each published bank matches its official registered PDF and actual page count", async (t) => {
  for (const id of readyIds) {
    await t.test(id, async () => {
      const source = level3Sources.find(item => item.projectId === id);
      assert.ok(source, id + ": missing manifest PDF");
      const bank = getQuizBank(id);
      assert.equal(bank.sourcePdfPath, source.sourcePath, id + ": wrong Learning PDF");
      const bytes = await readFile(new URL("../" + source.sourcePath, import.meta.url));
      const pdf = await getDocument({
        data: new Uint8Array(bytes),
        useSystemFonts: true,
        disableFontFace: true,
      }).promise;
      try {
        assert.equal(bank.sourcePageCount, pdf.numPages, id + ": wrong official PDF page count");
        for (const q of bank.questions) {
          assert.ok(Number.isInteger(q.learningSlide) && q.learningSlide >= 1 && q.learningSlide <= pdf.numPages, id + ": invalid Learning slide " + q.id);
        }
      } finally {
        await pdf.destroy();
      }
    });
  }
});

test("every Level 3 bank selects five different objectives and a distinct immediate retry", () => {
  for (const id of readyIds) {
    const bank = getQuizBank(id);
    const first = selectQuizQuestions(bank, [], () => 0);
    const second = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
    assert.equal(first.length, 5, id);
    assert.equal(new Set(first.map(q => q.topic)).size, 5, id);
    assert.equal(second.length, 5, id);
    assert.equal(second.filter(q => first.some(prev => prev.id === q.id)).length, 0, id);
    for (const question of bank.questions) {
      assert.equal(question.choices.length, 4, id);
      assert.equal(new Set(question.choices.map(x => x.trim().toLowerCase())).size, 4, id);
      assert.ok(question.hint.length > 10 && question.explanation.length > 10, id + ": missing learning support");
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4, id);
    }
  }
});

test("Level 3 Quiz tiles and wrong-answer slide returns use the shared Acceleration Car routes", async () => {
  const projectRoute = await readFile(new URL("../src/routes/projects.$projectId.tsx", import.meta.url), "utf8");
  const quizRoute = await readFile(new URL("../src/routes/quiz.$projectId.tsx", import.meta.url), "utf8");
  const learningRoute = await readFile(new URL("../src/routes/practical/$projectId.tsx", import.meta.url), "utf8");
  assert.match(projectRoute, /getQuizSyllabusEntry\(project\.id\)/);
  assert.match(projectRoute, /to="\/quiz\/\$projectId"/);
  assert.match(quizRoute, /Review Learning Slide/);
  assert.match(quizRoute, /slide:\s*question\.learningSlide/);
  assert.match(learningRoute, /getLevelThreeLecture\(project\.id\)/);
  assert.match(learningRoute, /initialSlide=\{slide\}/);
});
