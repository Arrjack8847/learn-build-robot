import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJson = async path => JSON.parse(await readFile(new URL(path, root), "utf8"));
const camel = id => id.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());

test("all 19 indexed Phase 2 drafts have real source mappings and remain unpublished", async () => {
  const status = await readJson("scripts/level1-quiz-status.json");
  const manifest = await readJson("scripts/quiz-learning-source-manifest.json");
  assert.equal(status.pendingWithIndexedLearningPdf.length, 19);
  for (const item of status.pendingWithIndexedLearningPdf) {
    const source = manifest.sources.find(entry => entry.level === 1 && entry.projectId === item.projectId);
    assert.ok(source, item.projectId + ": source mapping missing");
    assert.equal(source.sourcePath, item.sourcePdfPath);
    const file = await readFile(new URL("src/data/quizBanks/" + camel(item.projectId) + ".ts", root), "utf8");
    assert.ok(file.includes(JSON.stringify(item.projectId)), item.projectId + ": missing exact project ID");
    assert.ok(file.includes(JSON.stringify(item.sourcePdfPath)), item.projectId + ": source path mismatch");
    assert.ok(file.includes("sourcePageCount: 0"), item.projectId + ": unverified PDF must be a draft");
    assert.equal((file.match(/learningSlide: 0/g) ?? []).length, 10, item.projectId + ": wrong draft question count");
    assert.equal((file.match(/correctIndex: -1/g) ?? []).length, 10, item.projectId + ": draft answers must remain invalid");
    assert.equal((file.match(/TODO: write a question/g) ?? []).length, 10, item.projectId + ": draft questions missing");
    for (let objective = 1; objective <= 5; objective++) {
      assert.equal((file.match(new RegExp('topic: "objective-' + objective + '"', "g")) ?? []).length, 2, item.projectId + ": objective distribution mismatch");
    }
  }
});
