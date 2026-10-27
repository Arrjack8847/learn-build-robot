import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const registry = read("src/data/legacyProgrammingFiles.ts");
const match = registry.match(/export const legacyProgrammingSources: readonly OriginalProgram\[\] = (\[[\s\S]*?\]);/);
assert.ok(match, "Legacy Scratch registry must remain machine-auditable.");
const programs = JSON.parse(match[1]);

const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").replace(/-(basic|optimized|ratchet)$/, "");
const practical = read("src/data/practical.ts");
const four = read("src/data/levelFourLearning.ts");
const projectMatches = Array.from(practical.matchAll(/pdfManualProject\(\s*"([^"]+)",\s*"([^"]+)",\s*\d+,\s*"([^"]+)"(?:,\s*(\d+))?/g));
const known = projectMatches.map(m => ({
  level: m[4] ? Number(m[4]) : 1,
  title: m[2], categoryId: m[3],
}));
for (const m of four.matchAll(/id: "([^"]+)",\s*\n\s*title: "([^"]+)",\s*\n\s*categoryId: "([^"]+)"/g)) {
  known.push({ level: 4, title: m[2], categoryId: m[3] });
}
const key = p => p.level + ":" + p.categoryId + ":" + slug(p.title ?? p.projectKey);
const knownKeys = new Set(known.map(key));

test("102 original Scratch files belong to syllabus projects, not miscellaneous units", () => {
  assert.equal(programs.length, 102);
  assert.equal(programs.filter(p => p.level === 1).length, 6);
  assert.equal(programs.filter(p => p.level === 3).length, 36);
  assert.equal(programs.filter(p => p.level === 4).length, 60);
  assert.equal(new Set(programs.map(p => p.path)).size, programs.length);
  for (const program of programs) {
    assert.ok(knownKeys.has(key(program)), "Unmatched syllabus project: " + program.path);
    assert.ok(program.path.startsWith("Level " + program.level + "/Programming/"), program.path);
    assert.match(program.path, /\.sb[23]$/i);
    assert.ok(!/unit \d/i.test(program.path), "Unassigned unit file must not be linked: " + program.path);
  }
});

test("Level 4 Learning uses Learning Studio, and original programs are shown across Levels 1–4", () => {
  const studio = read("src/components/practical/LevelOneLearningStudio.tsx");
  const route = read("src/routes/practical/$projectId.tsx");
  assert.match(studio, /getLegacyProgrammingFiles\(\{ level, categoryId, title \}\)/);
  assert.match(studio, /getLevelTwoProgrammingFiles/);
  assert.match(studio, /getLevelFiveSixProgrammingFiles/);
  assert.match(route, /levelFourLearningManuals\[project\.id\]/);
  assert.match(route, /categoryId=\{project\.categoryId\}/);
  assert.match(route, /project\.level === 4 \? 4/);
});

test("strict upload audit: original Scratch files are tracked by Git", () => {
  if (process.env.CHECK_LEGACY_ASSETS !== "1") {
    // The user's separate 116-file push may not have completed yet.
    // Only enforce once GitHub main contains the files.
    return;
  }
  const paths = execFileSync("git", ["ls-tree", "-r", "--name-only", "HEAD"], { encoding: "utf8" })
    .split(/\r?\n/);
  const tracked = new Set(paths);
  const missing = programs.filter(p => !tracked.has("public/" + p.path)).map(p => p.path);
  assert.deepEqual(missing, [], "Project-specific program uploads still missing from this branch");
  for (const [level, expected] of [[1, 6], [2, 10], [3, 47], [4, 63]]) {
    const count = paths.filter(path =>
      path.startsWith("public/Level " + level + "/Programming/") && /\.sb[23]$/i.test(path),
    ).length;
    assert.equal(count, expected, "Git-tracked Scratch count differs for Level " + level);
  }
});
