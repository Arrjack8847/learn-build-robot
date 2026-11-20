import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const source = read("src/data/advancedSyllabus.ts");
const payload = source.match(/export const ADVANCED_SYLLABUS = ([\s\S]*?) as const;/)?.[1];
assert.ok(payload, "An explicit source-data catalog is required");
const levels = JSON.parse(payload);
const expected = [
  [2, 18, 59], [3, 20, 48], [4, 20, 56], [5, 16, 51], [6, 15, 43],
];

test("Levels 2–6 preserve each level's exact category and entry counts", () => {
  for (const [level, categoryCount, entryCount] of expected) {
    const categories = levels[level];
    assert.equal(categories.length, categoryCount, `Level ${level}: categories`);
    assert.equal(categories.reduce((sum, category) => sum + category.length - 1, 0), entryCount,
      `Level ${level}: projects and lessons`);
    assert.equal(new Set(categories.map(category => category[0])).size, categoryCount,
      `Level ${level}: category names are unique`);
  }
  assert.equal(expected.reduce((sum, entry) => sum + entry[2], 59), 316);
});

test("All level catalogs use grounded names from the sorted syllabus", () => {
  assert.deepEqual(levels["2"].find(category => category[0] === "Action-Oriented").slice(1, 4),
    ["Axe robot", "Batting robot", "Fan robot"]);
  assert.ok(levels["3"].find(category => category[0] === "Automation & Security").includes("Security door"));
  assert.ok(levels["4"].find(category => category[0] === "Autonomous Navigation & Ranging").includes("Radar vehicle"));
  assert.ok(levels["5"].find(category => category[0] === "Vehicles & Complex Movers").includes("Hexapod Robot"));
  assert.ok(levels["6"].find(category => category[0] === "Sensor-Focused Robots").includes("Smart Camera"));
  assert.ok(!source.includes('["unit 4programming program"'));
  assert.ok(!source.includes('["unit 5 programming program"'));
  assert.ok(!source.includes('["unit 6 programming"'));
});

test("All six levels have accessible navigation and category/detail routes", () => {
  const home = read("src/routes/index.tsx");
  const index = read("src/routes/practical/levels.index.tsx");
  const parent = read("src/routes/practical/levels.tsx");
  const levelParent = read("src/routes/practical/levels.$levelNumber.tsx");
  const categoryIndex = read("src/routes/practical/levels.$levelNumber.index.tsx");
  const detail = read("src/routes/practical/levels.$levelNumber.$categoryId.tsx");
  const sharedCategories = read("src/components/practical/ResponsiveCategories.tsx");
  assert.match(home, /to="\/practical\/levels"/);
  const artwork = [...index.matchAll(/\{\s*number:\\s*([1-6]),\\s*art:\\s*"([^"]+)"/g)];
  assert.deepEqual(artwork.map(match => Number(match[1])), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(artwork.map(match => match[2]), [
    "level-1.webp", "level-2.webp", "level-3.webp",
    "level-4.webp", "level-5.webp", "level-6.webp",
  ]);
  for (const [, , file] of artwork) {
    const bytes = readFileSync(new URL("../public/assets/level-artwork/" + file, import.meta.url));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF", file + " is not genuine WebP");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP", file + " is not genuine WebP");
  }
  for (const asset of ["header-wave.webp", "landscape.webp"]) {
    const bytes = readFileSync(new URL("../public/assets/level-artwork/" + asset, import.meta.url));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  }
  assert.match(index, /header-wave\.webp/);
  assert.match(index, /landscape\.webp/);
  assert.doesNotMatch(index, /getImageData|level-3-rocket\.png|level-landscape-background\.png/);
  assert.match(index, /to="\/practical\/level-1"/);
  assert.match(index, /to="\/practical\/levels\/\$levelNumber"/);
  assert.match(parent, /<Outlet\s*\/>/);
  assert.match(levelParent, /<Outlet\s*\/>/);
  assert.match(sharedCategories, /type="search"/);
  assert.match(categoryIndex, /to="\/practical\/levels\/\$levelNumber\/\$categoryId"/);
  assert.match(detail, /getAdvancedLevel\(level\)/);
  assert.match(detail, /Lesson not added yet/);
  assert.match(detail, /project\.level === level && project\.categoryId === category\.id/);
  assert.match(detail, /liveProject \?/);
  assert.match(detail, /to="\/projects\/\$projectId"/);
});

test("Existing Level 1 and older robot build screens remain available", () => {
  const practical = read("src/data/practical.ts");
  const levelOne = read("src/data/levelOneProjects.ts");
  assert.match(practical, /id: "marksmanship"/);
  assert.match(practical, /id: "acceleration-car",[\s\S]*?level: 1/);
  assert.match(levelOne, /availableProjectId = "acceleration-car"/);
  assert.match(read("src/routes/practical/$projectId.tsx"), /BuildingStudioHeader/);
});
