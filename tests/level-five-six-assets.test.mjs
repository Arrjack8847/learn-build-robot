import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const source = readFileSync(new URL("../src/data/levelFiveSixContent.ts", import.meta.url), "utf8");
const manifest = source.match(/export const levelFiveSixLessons: readonly AdvancedLessonAsset\[\] = (\[[\s\S]*?\]);/);
assert.ok(manifest, "Level 5–6 asset registry should be statically auditable");
const lessons = JSON.parse(manifest[1]);

test("Level 5–6 syllabus has exactly 94 unique project records", () => {
  assert.equal(lessons.length, 94);
  assert.equal(lessons.filter(lesson => lesson.level === 5).length, 51);
  assert.equal(lessons.filter(lesson => lesson.level === 6).length, 43);
  assert.equal(new Set(lessons.map(lesson => lesson.id)).size, 94);
  assert.ok(lessons.every(lesson => lesson.id.startsWith("level-" + lesson.level + "-")));
});

test("original curriculum resources are represented without inventing manuals", () => {
  const buildingFiles = lessons.flatMap(lesson => [lesson.buildingBasic, lesson.buildingOptimized].filter(Boolean));
  assert.equal(buildingFiles.length, 86);
  assert.equal(lessons.filter(lesson => !lesson.buildingBasic && !lesson.buildingOptimized).length, 12);
  assert.equal(lessons.filter(lesson => Boolean(lesson.buildingOptimized)).length, 4);
  assert.equal(lessons.flatMap(lesson => lesson.programs).length, 115);
  assert.equal(lessons.flatMap(lesson => lesson.videos).length, 76);
});

test("every registered asset is tracked in the repository", () => {
  const listed = new Set(execFileSync("git", ["-c", "core.quotePath=false", "ls-tree", "-r", "--name-only", "HEAD"], { encoding: "utf8" }).trim().split(/\r?\n/));
  for (const lesson of lessons) {
    for (const pdf of [lesson.learningPdf, lesson.buildingBasic, lesson.buildingOptimized].filter(Boolean)) {
      assert.ok(listed.has("public/" + pdf), "Missing public PDF: " + pdf);
    }
    for (const path of [...lesson.programs, ...lesson.videos]) {
      assert.ok(listed.has("curriculum-source/" + path), "Missing source resource: " + path);
    }
  }
});

test("interactive UI is connected to the Level 5–6 registry", () => {
  const practical = readFileSync(new URL("../src/data/practical.ts", import.meta.url), "utf8");
  const projectRoute = readFileSync(new URL("../src/routes/practical/$projectId.tsx", import.meta.url), "utf8");
  const studio = readFileSync(new URL("../src/components/practical/LevelOneLearningStudio.tsx", import.meta.url), "utf8");
  const building = readFileSync(new URL("../src/components/practical/PdfActivityViewer.tsx", import.meta.url), "utf8");
  assert.match(practical, /levelFiveSixLessons\.map/);
  assert.match(projectRoute, /getLevelFiveSixBuildingManual/);
  assert.match(projectRoute, /levelFiveSixLearningLectures/);
  assert.match(studio, /getLevelFiveSixProgrammingFiles/);
  assert.match(building, /DemoVideoOverlay/);
  assert.match(building, /showsSlides \? "presentation" : "building"/);
});
