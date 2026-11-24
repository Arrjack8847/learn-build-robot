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
const home = read("src/routes/index.tsx");
const picker = read("src/routes/practical/index.tsx");
const sharedCategories = read("src/components/practical/ResponsiveCategories.tsx");

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
  assert.match(sharedCategories, /type="search"/);
  assert.match(sharedCategories, /categories\.filter/);
  assert.match(index, /aria-label=\{\x60Explore/);
  assert.match(sharedCategories, /grid-cols-2 grid-rows-\[repeat\(3,minmax\(min-content,1fr\)\)\]/);
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
  assert.match(home, /to="\/practical\/levels"/);
  assert.match(picker, /redirect\(\{ to: "\/practical\/levels" \}\)/);
  assert.match(sharedCategories, /to="\/practical\/levels"/);
  assert.match(detail, /getLevelOneProjects\(category\.id\)/);
  assert.match(detail, /getProject\(entry\.availableProjectId\)/);
  assert.match(detail, /liveProject \?/);
  assert.match(detail, /Lesson not added yet/);
  assert.match(detail, /to="\/projects\/\$projectId"/);
  assert.doesNotMatch(detail, /href=\{entry\.sourceEntry\}/);
});

test("Shared category cards protect full labels and counts on short mobile screens", () => {
  const card = sharedCategories.split("export function CategoryCard")[1];
  assert.ok(card);
  assert.doesNotMatch(card, /line-clamp-|truncate/);
  assert.match(card, /w-full shrink-0 break-words/);
  assert.match(card, /shrink-0 text-\[clamp\(10px/);
  assert.match(sharedCategories, /min-h-\[100dvh\]/);
  assert.match(sharedCategories, /useState\(6\)/);
  assert.match(card, /min-h-\[104px\]/);
  assert.match(sharedCategories, /minmax\(min-content,1fr\)/);
  assert.match(sharedCategories, /Final Build Challenge<\/span>/);
  assert.match(sharedCategories, /Discover · Build · Complete/);
  assert.match(sharedCategories, /aria-label="Category pagination"/);
  assert.ok(sharedCategories.indexOf('aria-label="Category pagination"') < sharedCategories.indexOf('href={"/practical/level-"'));
  assert.match(sharedCategories, /Math.abs\(dx\)>Math.abs\(dy\)\*1.5/);
});
