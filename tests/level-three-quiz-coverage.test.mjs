import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  getQuizBank,
  QUIZ_PASS_COUNT,
  QUIZ_QUESTION_COUNT,
  selectQuizQuestions,
  validateQuizBank,
} from "../src/data/quizStudio.ts";

const manifest = JSON.parse(
  await readFile(new URL("../scripts/quiz-learning-source-manifest.json", import.meta.url), "utf8"),
);
const fallback = JSON.parse(
  await readFile(new URL("../scripts/quiz-level3-building-fallbacks.json", import.meta.url), "utf8"),
);
const learningSources = manifest.sources.filter(source => source.level === 3);
const allSources = [...learningSources, ...fallback.sources];
const sourceById = new Map(allSources.map(source => [source.projectId, source]));
const originalBankIds = new Set(["level-3-clip-robot", "level-3-following-robot"]);
const pdfPageCount = {
  "level-3-anti-fall-robot": 33,
  "level-3-automated-guided-vehicle": 36,
  "level-3-automatic-door": 34,
  "level-3-automatic-seesaw": 21,
  "level-3-blood-bank-centrifuge": 28,
  "level-3-bumper-car-foundational-robots": 12,
  "level-3-bumper-car-interactive-mechanisms": 18,
  "level-3-clip-robot": 17,
  "level-3-cycle-sport-basic": 28,
  "level-3-cycle-sport-optimized": 28,
  "level-3-disinfection-lamp": 30,
  "level-3-drawbridge": 21,
  "level-3-electric-bulldozer": 34,
  "level-3-electric-fan-characters-structures": 31,
  "level-3-electric-fan-mechanisms-and-concepts": 14,
  "level-3-electric-guitar": 21,
  "level-3-electronic-scale": 27,
  "level-3-f1-racing-car": 20,
  "level-3-fire-ladder": 25,
  "level-3-flashlight-sensor": 29,
  "level-3-following-robot": 22,
  "level-3-gyro-transmitter": 21,
  "level-3-juicer-machine": 29,
  "level-3-light-sensitive-curtains": 38,
  "level-3-line-patrol-car": 12,
  "level-3-long-lived-turtle": 24,
  "level-3-money-detector": 17,
  "level-3-music-box": 34,
  "level-3-music-doorbell": 26,
  "level-3-obstacle-avoidance-robot-1": 19,
  "level-3-parking-gate": 16,
  "level-3-race-walking-basic": 29,
  "level-3-race-walking-optimized": 29,
  "level-3-race-walking-optimized-ratchet": 29,
  "level-3-safe": 33,
  "level-3-security-door": 20,
  "level-3-sign": 20,
  "level-3-smart-audio": 21,
  "level-3-smart-door": 22,
  "level-3-smart-trash-bin": 31,
  "level-3-sonometer": 23,
  "level-3-sound-level-meter": 34,
  "level-3-stag-beetle": 24,
  "level-3-sunflower": 19,
  "level-3-super-trajectory-robot-1": 19,
  "level-3-washing-machine": 30,
  "level-3-lifting-maintenance-vehicle": 22,
  "level-3-biting-monster": 24,
  "level-3-electric-gyro-launcher": 12,
  "level-3-responder": 12,
  "level-3-lunar-rover": 24
};

test("51 Level 3 project IDs map to existing Learning or Building-fallback PDFs", async () => {
  assert.equal(learningSources.length, 46);
  assert.equal(fallback.sources.length, 5);
  assert.equal(allSources.length, 51);
  assert.equal(sourceById.size, 51, "Duplicate Level 3 project source");
  assert.equal(Object.keys(pdfPageCount).length, 51);
  const lectureRegistry = await readFile(
    new URL("../src/data/levelThreeLectures.ts", import.meta.url), "utf8",
  );
  const uploaded = lectureRegistry.match(/\["level-3-[^"]+",\s*"[^"]+\.pdf"\]/g) ?? [];
  assert.equal(uploaded.length, 46);
  for (const source of allSources) {
    assert.ok(source.projectId.startsWith("level-3-"), source.projectId);
    assert.equal(source.level, 3);
    assert.match(source.sourcePath, /^public\/.*\.pdf$/);
    assert.match(source.url, /^https:\/\//);
    assert.ok(lectureRegistry.includes('"' + source.projectId + '"'),
      "Level 3 lecture missing from runtime registry: " + source.projectId);
  }
});

test("all 51 projects are playable with valid ten-question objective-paired banks", () => {
  assert.equal(QUIZ_QUESTION_COUNT, 5);
  assert.equal(QUIZ_PASS_COUNT, 4);
  for (const source of allSources) {
    const bank = getQuizBank(source.projectId);
    assert.ok(bank, "Not playable: " + source.projectId);
    assert.equal(bank.projectId, source.projectId);
    assert.equal(bank.sourcePdfPath, source.sourcePath);
    assert.equal(bank.sourcePageCount, pdfPageCount[source.projectId]);
    assert.equal(bank.questions.length, 10);
    assert.deepEqual(validateQuizBank(bank), [], source.projectId);
    assert.equal(new Set(bank.questions.map(q => q.id)).size, 10);
    const countByTopic = new Map();
    for (const question of bank.questions) {
      countByTopic.set(question.topic, (countByTopic.get(question.topic) ?? 0) + 1);
      assert.equal(question.choices.length, 4);
      assert.equal(new Set(question.choices.map(s => s.trim().toLowerCase())).size, 4);
      assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3);
      assert.ok(question.hint.trim() && question.explanation.trim());
      assert.ok(question.learningSlide >= 1 && question.learningSlide <= bank.sourcePageCount);
    }
    assert.deepEqual([...countByTopic.values()].sort(), [2, 2, 2, 2, 2]);
    if (!originalBankIds.has(source.projectId)) {
      assert.equal(new Set(bank.questions.map(q => q.correctIndex)).size, 4,
        source.projectId + ": answer positions should cover A, B, C, D");
    }
  }
});

test("official PDFs exist and all 51 verified source-page counts agree with PDF.js", async () => {
  // Read each unique PDF only once when syllabus variants share the same slides.
  const examined = new Map();
  for (const source of allSources) {
    const bank = getQuizBank(source.projectId);
    if (!examined.has(source.sourcePath)) {
      const bytes = await readFile(new URL("../" + source.sourcePath, import.meta.url));
      assert.equal(String.fromCharCode(...bytes.subarray(0, 5)), "%PDF-", source.projectId);
      const document = await getDocument({
        data: new Uint8Array(bytes),
        useSystemFonts: true,
        disableFontFace: true,
      }).promise;
      examined.set(source.sourcePath, document.numPages);
      await document.destroy();
    }
    const pages = examined.get(source.sourcePath);
    assert.equal(bank.sourcePageCount, pages, source.projectId + ": PDF page count changed");
    for (const question of bank.questions) {
      assert.ok(question.learningSlide <= pages, source.projectId + ": wrong slide " + question.id);
    }
  }
  assert.equal(examined.size, 48);
});

test("each attempt tests all five objectives and immediate retry avoids repeated questions", () => {
  for (const source of allSources) {
    const bank = getQuizBank(source.projectId);
    const first = selectQuizQuestions(bank, [], () => 0);
    const retry = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
    assert.equal(first.length, 5, source.projectId);
    assert.equal(new Set(first.map(q => q.topic)).size, 5, source.projectId);
    assert.equal(retry.length, 5, source.projectId);
    assert.equal(first.filter(q => retry.some(p => p.id === q.id)).length, 0, source.projectId);
  }
});

test("Level 3 uses the existing Acceleration Car Quiz and Learning Studio routes", async () => {
  const projectRoute = await readFile(
    new URL("../src/routes/projects.$projectId.tsx", import.meta.url), "utf8",
  );
  const quizRoute = await readFile(
    new URL("../src/routes/quiz.$projectId.tsx", import.meta.url), "utf8",
  );
  const learningRoute = await readFile(
    new URL("../src/routes/practical/$projectId.tsx", import.meta.url), "utf8",
  );
  assert.match(projectRoute, /getQuizSyllabusEntry\(project\.id\)/);
  assert.match(projectRoute, /to="\/quiz\/\$projectId"/);
  assert.match(quizRoute, /Review Learning Slide/);
  assert.match(quizRoute, /slide:\s*question\.learningSlide/);
  assert.match(learningRoute, /getLevelThreeLecture\(project\.id\)/);
  assert.match(learningRoute, /initialSlide=\{slide\}/);
});
