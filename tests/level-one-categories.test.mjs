import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (name) => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const data = read("src/data/levelOneCategories.ts");
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

test("Original robot lessons remain available without fabricated category assignments", () => {
  assert.match(choice, /label="Build a Robot"[\s\S]*?to="\/practical\/level-1"/);
  assert.match(picker, /to="\/practical\/level-1"/);
  assert.match(index, /to="\/practical"/);
  assert.match(detail, /project\.level === 1 && project\.categoryId === category\.id/);
  assert.match(detail, /no robot lessons have been assigned to it yet/i);
  assert.match(detail, /to="\/practical\/\$projectId"/);
});
