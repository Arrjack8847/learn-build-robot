import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const exam = read("src/components/practical/FinalBuildExam.tsx");
const registry = read("src/data/finalBuildRegistry.ts");
const scanner = read("src/components/practical/FinalBuildScanner.tsx");
const prototype = read("src/components/practical/FinalBuildPrototype.tsx");
const levelOne = read("src/routes/practical/level-1.final-build.tsx");
const approval = JSON.parse(read("src/data/finalBuildApprovals.json"));
const oneApproval = JSON.parse(read("src/data/levelOnePrototypeCrops.json"));

test("all six level-specific final-build route modules are registered", () => {
  assert.match(levelOne, /createFileRoute\("\/practical\/level-1\/final-build"\)/);
  for (let level=2; level<=6; level++) {
    const route = read("src/routes/practical/level-" + level + ".final-build.tsx");
    assert.ok(route.includes('createFileRoute("/practical/level-'+level+'/final-build")'));
    assert.ok(route.includes("FinalBuildExam level={"+level+"}"));
  }
  assert.match(read("src/components/practical/ResponsiveCategories.tsx"), /Robot Discovery Scanner<\/a>/);
});

test("registries use actual syllabus and registered Building manuals instead of Learning slides", () => {
  assert.match(registry, /getAdvancedLevel\(level\)/);
  assert.match(registry, /practicalProjects\.filter/);
  assert.match(registry, /getLevelFourBuildingManual/);
  assert.match(registry, /getLevelFiveSixBuildingManual/);
  assert.match(registry, /learningFallback/);
  assert.match(registry, /sourceKind !== "powerpoint"/);
  assert.ok(registry.includes("usrfiles"));
  assert.match(registry, /getFinalBuildPool/);
  assert.match(registry, /variants\.length > 0/);
  assert.match(registry, /new Map\(result\.map\(v => \[v\.url, v\]\)\)/);
});

test("fair scan uses cryptographically drawn unbiased index, independent of animation", () => {
  assert.match(registry, /crypto\.getRandomValues\(array\)/);
  assert.match(registry, /value >= limit/);
  assert.match(exam, /secureRandomIndex\(pool\.length\)/);
  assert.match(levelOne, /secureRandomIndex\(PROJECTS\.length\)/);
  assert.match(exam, /scanUntil: Date\.now\(\) \+ SCAN_MS/);
  assert.match(scanner, /projectCount\?: number/);
  assert.match(scanner, /prefers-reduced-motion: reduce/);
  assert.match(exam, /Skip animation/);
});

test("unapproved or missing crops cannot enable student exams", () => {
  assert.equal(approval.status, "all-unreviewed");
  assert.deepEqual(approval.references, []);
  assert.ok(oneApproval.references.length > 0);
  assert.ok(oneApproval.references.every(ref => ref.approved === false));
  assert.match(exam, /a\.approved === true/);
  assert.match(exam, /Boolean\(a\.reviewer\)/);
  assert.match(exam, /a\.url === variant\.url/);
  assert.match(exam, /Boolean\(approval && pictureReady && variant\?\.hostedOnWix\)/);
  assert.match(exam, /disabled=\{!startAllowed\}/);
  assert.match(levelOne, /candidate\?\.approved && modelReady/);
  assert.match(prototype, /renderTask\?\.cancel\(\)/);
  assert.ok(!exam.includes("BuildingStudio"));
});

test("15-minute timer is deadline-based, persistent and level-isolated", () => {
  assert.match(exam, /const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(exam, /deadline: startedAt \+ LIMIT_MS/);
  assert.match(exam, /"be-stem-ready-final-build-level-" \+ level/);
  assert.match(exam, /window\.localStorage\.setItem/);
  assert.match(exam, /Math\.max\(0, session\.deadline - now\)/);
  assert.match(exam, /Date\.now\(\) <= \(prev\.deadline/);
});

test("assessment stays within Final Build and is clearly self-reported", () => {
  assert.match(exam, /"assessment"/);
  assert.match(exam, /prev\.checks\.filter\(Boolean\)\.length >= 4/);
  assert.match(exam, /I Finished My Robot!/);
  assert.match(exam, /Self-reported practical completion/);
  assert.match(exam, /Retry Same Robot/);
  assert.match(exam, /Discover Another Robot/);
  assert.ok(!exam.includes('window.open('));
});

test("audited level syllabus sizes are unchanged", () => {
  const source = read("src/data/advancedSyllabus.ts");
  const match = source.match(/export const ADVANCED_SYLLABUS = (\{[\s\S]*?\}) as const;/);
  assert.ok(match, "official syllabus data must remain parseable");
  const levels = JSON.parse(match[1]);
  const expected = {2:59, 3:48, 4:56, 5:51, 6:43};
  for (const [number,count] of Object.entries(expected)) {
    assert.equal(levels[number].reduce((sum, category) => sum+category.length-1, 0), count);
  }
});
