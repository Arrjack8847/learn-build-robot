import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = path => readFileSync(resolve(root, path), "utf8");
const modules = new Map();

function loadDataModule(path) {
  const absolute = resolve(root, path);
  if (modules.has(absolute)) return modules.get(absolute).exports;
  const module = { exports: {} };
  modules.set(absolute, module);
  const compiled = ts.transpileModule(readFileSync(absolute, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const require = specifier => {
    assert.ok(specifier.startsWith("."), "Unexpected external module " + specifier);
    return loadDataModule(resolve(dirname(absolute), specifier + ".ts"));
  };
  // Vite supplies import.meta.env in the browser; VM/CommonJS needs a test-only substitute.
  const testOutput = compiled.replaceAll("import.meta.env", "({ DEV: false })");
  runInNewContext(testOutput, { module, exports: module.exports, require }, { filename: absolute });
  return module.exports;
}

const level1 = loadDataModule("src/data/levelOneLectures.ts");
const level3 = loadDataModule("src/data/levelThreeLectures.ts");
const { pdfActivityManuals } = loadDataModule("src/data/pdfActivityManuals.ts");

const levelOneIds = [
  "ferocious-snake", "funny-cat", "shy-penguin", "sled-dog",
  "athlete", "basic-programming", "drummer-robot", "sailboat",
  "the-lawn-mower", "car", "dynamic-screen", "pendulum-ride",
  "rotating-flying-chair", "skating", "the-windmill-kingdom",
];
const levelThreeIds = [
  "level-3-super-trajectory-robot-1", "level-3-stag-beetle",
  "level-3-line-patrol-car", "level-3-money-detector",
  "level-3-parking-gate", "level-3-blood-bank-centrifuge",
  "level-3-fire-ladder", "level-3-sign", "level-3-drawbridge",
];

test("15 Level 1 projects have distinct existing Learning and Building PDFs", () => {
  assert.equal(new Set(levelOneIds).size, 15);
  for (const id of levelOneIds) {
    const lecture = level1.getLevelOneLecture(id);
    const manual = pdfActivityManuals[id];
    assert.ok(lecture && manual, "Missing Level 1 PDF registration: " + id);
    assert.equal(lecture.learningOnly, false, id);
    assert.notEqual(lecture.url, manual.url, "Building should preserve its original root PDF: " + id);
    assert.match(lecture.url, /^https:\/\//);
    assert.match(manual.url, /^https:\/\//);
    assert.notEqual(manual.sourceKind, "powerpoint");
  }
});

test("nine Level 3 presentation-only projects reuse Learning PDF in Building with independent progress", () => {
  assert.equal(new Set(levelThreeIds).size, 9);
  const uniqueCompletionKeys = new Set();
  for (const id of levelThreeIds) {
    const lecture = level3.getLevelThreeLecture(id);
    const existing = pdfActivityManuals[id];
    const building = level3.getLevelThreeBuildingReferenceManual(id);
    assert.ok(lecture && existing && building, "Missing Level 3 PDF reference: " + id);
    assert.equal(existing.sourceKind, "powerpoint");
    assert.equal(lecture.learningOnly, false);
    assert.equal(building.url, lecture.url, "Building must use the actual Learning PDF: " + id);
    assert.equal(building.learningFallback, true);
    assert.notEqual(building.completionStepId, existing.completionStepId);
    assert.ok(!uniqueCompletionKeys.has(building.completionStepId));
    uniqueCompletionKeys.add(building.completionStepId);
  }
  assert.equal(level3.getLevelThreeBuildingReferenceManual("level-3-clip-robot"), undefined);
  assert.equal(level3.getLevelThreeBuildingReferenceManual("not-a-project"), undefined);
});

test("Project selection and Building Studio route the references without altering Level 4–6 modes", () => {
  const overview = read("src/routes/projects.$projectId.tsx");
  const route = read("src/routes/practical/$projectId.tsx");
  assert.match(overview, /Boolean\(levelThreeBuildingReference\)/);
  assert.match(overview, /usingLearningForBuilding = Boolean\(levelThreeBuildingReference\)/);
  assert.match(route, /if \(lecture && mode === "learning"\)/);
  assert.match(route, /project\.level === 3 && mode === "building"/);
  assert.match(route, /getLevelThreeBuildingReferenceManual\(project\.id\)/);
  assert.match(route, /<PdfActivityViewer key=\{project\.id \+ "-building-reference"\} manual=\{reference\} \/>/);
  assert.match(route, /getLevelFourBuildingManual\(project\.id, variant\)/);
  assert.match(route, /getLevelFiveSixBuildingManual\(project\.id, variant\)/);
});
