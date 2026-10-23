import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const registry = read("src/data/levelTwoProgrammingFiles.ts");
const learning = read("src/components/practical/LevelOneLearningStudio.tsx");

const expected = [
  "level-2-axe-robot",
  "level-2-batting-robot",
  "level-2-fan-robot",
  "level-2-push-ups",
  "level-2-throwing-robot",
  "level-2-spinning-bike",
  "level-2-swing",
  "level-2-treadmill",
  "level-2-battery-robot",
  "level-2-helicopter",
];

test("Level 2 has exactly ten official Scratch file mappings", () => {
  const matches = [...registry.matchAll(/\["(level-2-[^"]+)", "([^"]+\.sb2)"\]/g)];
  assert.deepEqual(matches.map(([, id]) => id), expected);
  assert.equal(new Set(matches.map(([, , path]) => path)).size, 10);
  assert.match(registry, /\/Level%202\/Programming\//);
  assert.match(registry, /encodeURIComponent/);
});

test("Only matching Level 2 lectures display program downloads", () => {
  assert.match(learning, /level === 2 \? getLevelTwoProgrammingFiles\(projectId\) : \[\]/);
  assert.match(learning, /programmingFiles\.length > 0/);
  assert.match(learning, /download=\{file\.fileName\}/);
  assert.match(learning, /Download Program/);
});
