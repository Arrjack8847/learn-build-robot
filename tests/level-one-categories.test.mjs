import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (name) => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const data = read("src/data/levelOneCategories.ts");
const syllabus = read("src/data/levelOneProjects.ts");
const practical = read("src/data/practical.ts");
const index = read("src/routes/practical/level-1.index.tsx");
const layout = read("src/routes/practical/level-1.tsx");
const detail = read("src/routes/practical/level-1.$categoryId.tsx");
const choice = read("src/routes/choose.tsx");
const picker = read("src/routes/practical/index.tsx");

const names = [
  "Autonomous Navigation & Ranging",
  "Biomimicry",
  "Characters & Structures",
  "Display & Movement",
  "Foundational Robots",
  "Illumination & Signals",
  "Interactive Systems",
  "Machines & Mechanisms",
  "Manipulators",
  "Mechanisms & Simulators",
  "Mechanisms and Concepts",
  "Sensor-Focused Robots",
  "Vehicles & Complex Movers",
  "Vehicles & Motion",
];

test("Level 1 has exactly the 14 official folder categories in order", () => {
  const found = [...data.matchAll(/\{ id: "[^"]+", name: "([^"]+)", icon: "[^"]+", tone: "[^"]+" \}/g)].map(match => match[1]);
  assert.deepEqual(found, names);
});

test("Level 1 route is nested correctly, searchable, mobile-friendly and accessible", () => {
  assert.match(layout, /<Outlet\s*\/>/);
  assert.match(index, /createFileRoute\("\/practical\/level-1\/"\)/);
  assert.match(detail, /createFileRoute\("\/practical\/level-1\/\$categoryId"\)/);
  assert.match(index, /type="search"/);
  assert.match(index, /LEVEL_ONE_CATEGORIES\.filter/);
  assert.match(index, /aria-label=\{\x60Explore/);
  assert.match(index, /grid-cols-1/);
  assert.match(index, /focus-visible:/);
});

test("All 59 Level 1 syllabus entries have exact category placement", () => {
  const categories = [...syllabus.matchAll(/^  "([^"]+)": \[([\s\S]*?)\]/gm)];
  assert.equal(categories.length, 14);
  const counts = [1, 5, 9, 5, 6, 7, 2, 4, 6, 3, 1, 1, 2, 7];
  const actualCounts = categories.map(([, , contents]) => [...contents.matchAll(/"([^"]+)"/g)].length);
  assert.deepEqual(actualCounts, counts);
  assert.equal(actualCounts.reduce((sum, current) => sum + current, 0), 59);
  assert.match(syllabus, /"biomimicry": \[[\s\S]*?"Funny cat\.pptx"/);
  assert.match(syllabus, /"autonomous-navigation-ranging": \[[\s\S]*?"Acceleration car"/);
  assert.match(syllabus, /availableProjectId = "acceleration-car"/);
  assert.match(practical, /id: "acceleration-car",[\s\S]*?level: 1,[\s\S]*?categoryId: "autonomous-navigation-ranging"/);
});

test("Existing robot lessons remain accessible; missing lessons are not clickable builds", () => {
  assert.match(choice, /label="Build a Robot"[\s\S]*?to="\/practical\/level-1"/);
  assert.match(picker, /to="\/practical\/level-1"/);
  assert.match(index, /to="\/practical"/);
  assert.match(detail, /getLevelOneProjects\(category\.id\)/);
  assert.match(detail, /getProject\(entry\.availableProjectId\)/);
  assert.match(detail, /liveProject \?/);
  assert.match(detail, /Lesson not added yet/);
  assert.match(detail, /to="\/practical\/\$projectId"/);
  assert.doesNotMatch(detail, /href=\{entry\.sourceEntry\}/);
});
