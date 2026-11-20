import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const manifest = JSON.parse(read("../reports/level6-building-link-only-paths-20261120.json"));
const registrySource = read("../src/data/levelSixWixPdfUrls.ts");
const lessonSource = read("../src/data/levelFiveSixContent.ts");
const pruneSource = read("../scripts/pdf/prune-wix-building-from-output.mjs");

const registryMatch = registrySource.match(/export const levelSixWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/);
const lessonsMatch = lessonSource.match(/export const levelFiveSixLessons: readonly AdvancedLessonAsset\[\] = (\[[\s\S]*?\]);/);
assert.ok(registryMatch);
assert.ok(lessonsMatch);
const registry = JSON.parse(registryMatch[1]);
const lessons = JSON.parse(lessonsMatch[1]);

test("41 Level 6 Building manifest paths exactly match Wix registry and syllabus", () => {
  const paths = manifest.paths;
  assert.equal(manifest.uniqueBuildingPdfCount, 41);
  assert.equal(paths.length, 41);
  assert.equal(new Set(paths).size, 41);
  assert.ok(paths.every(path => /^public\/Level 6\/Building\/.+\.pdf$/i.test(path)));
  const registryPaths = Object.keys(registry)
    .filter(path => path.startsWith("Level 6/Building/"))
    .map(path => "public/" + path);
  const lessonPaths = lessons.filter(lesson => lesson.level === 6)
    .flatMap(lesson => [lesson.buildingBasic, lesson.buildingOptimized].filter(Boolean))
    .map(path => "public/" + path);
  assert.deepEqual(paths.slice().sort(), registryPaths.sort());
  assert.deepEqual(paths.slice().sort(), lessonPaths.sort());
  for (const path of paths) {
    const url = registry[path.slice("public/".length)];
    assert.match(url, /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf$/);
  }
});

test("Level 6 Building PDF cleanup is restricted to generated output copies", () => {
  assert.match(pruneSource, /level6-building-link-only-paths-20261120\.json/);
  assert.match(pruneSource, /level6Manifest\.uniqueBuildingPdfCount !== 41/);
  assert.match(pruneSource, /\.\.\.level6Manifest\.paths/);
  assert.match(pruneSource, /allBuildingPaths\.length !== 295/);
  assert.match(pruneSource, /relativePath\.startsWith\("Level 6\/Building\/"\)/);
  assert.match(pruneSource, /new Set\(paths\)\.size !== paths\.length/);
  assert.match(pruneSource, /const outputFolders = \[/);
  assert.match(pruneSource, /if \(!filename\.startsWith\(dir \+ sep\)\)/);
  assert.match(pruneSource, /rmSync\(filename\)/);
  assert.doesNotMatch(pruneSource, /rmSync\(join\(repoRoot, "public"/);
});
