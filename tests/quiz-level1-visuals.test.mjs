import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getQuizBank, selectQuizQuestions, validateQuizBank } from "../src/data/quizStudio.ts";

const root = new URL("../", import.meta.url);
const read = p => readFile(new URL(p, root), "utf8");
const camel = id => id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

test("every pending Level 1 bank has one illustrated objective, ensuring one visual per attempt", async () => {
  const status = JSON.parse(await read("scripts/level1-quiz-status.json"));
  const pending = [
    ...status.pendingWithIndexedLearningPdf,
    ...status.pendingWithoutIndexedLearningPdf,
  ];
  assert.equal(pending.length, 33);
  const imagePaths = new Set();
  for (const item of pending) {
    const module = await import(new URL(
      "src/data/quizBanks/" + camel(item.projectId) + ".ts", root));
    const bank = module[camel(item.projectId) + "Bank"];
    assert.ok(bank, item.projectId + ": no quiz bank");
    assert.deepEqual(validateQuizBank(bank), [], item.projectId + ": bank validation failed");
    assert.equal(getQuizBank(item.projectId), undefined,
      item.projectId + ": not approved for students yet");
    const visuals = bank.questions.filter(q => q.image);
    assert.equal(visuals.length, 2, item.projectId + ": expected 2 visual alternatives");
    assert.equal(visuals[0].topic, visuals[1].topic,
      item.projectId + ": visual alternatives must belong to one objective");
    assert.equal(visuals[0].image.src, visuals[1].image.src,
      item.projectId + ": visual alternatives should share their concept sketch");
    assert.ok(visuals.every(q => q.image.alt.length >= 15 &&
      q.image.src === "/quiz-visuals/level1/" + item.projectId + ".svg"));
    const asset = await read("public" + visuals[0].image.src);
    assert.match(asset, /<svg\s[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.ok(asset.includes("</svg>"));
    assert.ok(!/<script\b|<foreignObject\b|https?:\/\//i.test(
      asset.replace("http://www.w3.org/2000/svg", "")), item.projectId + ": unexpected external/script content");
    imagePaths.add(visuals[0].image.src);
    const first = selectQuizQuestions(bank, [], () => 0);
    const second = selectQuizQuestions(bank, first.map(q => q.id), () => 0);
    assert.equal(first.filter(q => q.image).length, 1, item.projectId + ": first attempt has no visual");
    assert.equal(second.filter(q => q.image).length, 1, item.projectId + ": retry has no visual");
  }
  assert.equal(imagePaths.size, 33);
});

test("quiz image rendering remains optional and supports mobile dimensions", async () => {
  const route = await read("src/routes/quiz.$projectId.tsx");
  const engine = await read("src/data/quizStudio.ts");
  assert.ok(route.includes("currentQuestion.image ? ("));
  assert.ok(route.includes("alt={currentQuestion.image.alt}"));
  assert.ok(route.includes('loading="lazy"'));
  assert.ok(route.includes("max-h-[27dvh]"));
  assert.ok(engine.includes("image?: { src: string; alt: string };"));
  assert.ok(engine.includes("invalid local visual source or descriptive alt text"));
});
