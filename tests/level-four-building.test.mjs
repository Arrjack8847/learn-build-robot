import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = file => readFileSync(resolve(root, file), "utf8");
const modules = new Map();
function loadDataModule(path) {
  const file = resolve(root, path);
  if (modules.has(file)) return modules.get(file).exports;
  const module = { exports: {} };
  modules.set(file, module);
  const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const require = specifier => {
    assert.ok(specifier.startsWith("."), "External import not expected: " + specifier);
    return loadDataModule(resolve(dirname(file), specifier + ".ts"));
  };
  runInNewContext(outputText, { module, exports: module.exports, require }, { filename: file });
  return module.exports;
}
function collectPdfs(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const p = join(dir, entry.name);
    return entry.isDirectory() ? collectPdfs(p) : entry.isFile() && entry.name.endsWith(".pdf") ? [p] : [];
  });
}

const {
  levelFourBuildingManuals,
  LEVEL_FOUR_UPLOADED_BUILDING_PDF_COUNT,
  LEVEL_FOUR_LEARNING_AS_BUILDING_IDS,
  getLevelFourBuildingManual,
  hasLevelFourOptimizedManual,
  isLevelFourBuildingFallback,
} = loadDataModule("src/data/levelFourBuilding.ts");
const { levelFourLearningLessons, levelFourLearningManuals } =
  loadDataModule("src/data/levelFourLearning.ts");
const { getAdvancedLevel } = loadDataModule("src/data/advancedSyllabus.ts");
const { levelFourWixPdfUrls } = loadDataModule("src/data/levelFourWixPdfUrls.ts");
const buildingPathsByUrl = new Map(
  Object.entries(levelFourWixPdfUrls)
    .filter(([path]) => path.startsWith("Level 4/Building/"))
    .map(([path, url]) => [url, path]),
);

test("50 uploaded Level 4 Building PDFs cover 48 syllabus projects", () => {
  assert.equal(collectPdfs(resolve(root, "public/Level 4/Building")).length, 50);
  assert.equal(LEVEL_FOUR_UPLOADED_BUILDING_PDF_COUNT, 50);
  const sourceFiles = new Set();
  const fallbacks = new Set(Array.from(LEVEL_FOUR_LEARNING_AS_BUILDING_IDS));
  assert.equal(fallbacks.size, 8);
  for (const lesson of levelFourLearningLessons) {
    const building = getLevelFourBuildingManual(lesson.id);
    assert.ok(building, "No Building source for " + lesson.id);
    assert.equal(building.title, lesson.title);
    assert.equal(building.id, lesson.id);
    assert.notEqual(building.completionStepId, levelFourLearningManuals[lesson.id].completionStepId);
    if (fallbacks.has(lesson.id)) {
      assert.equal(building.url, lesson.url);
      assert.equal(building.learningFallback, true);
      assert.equal(isLevelFourBuildingFallback(lesson.id), true);
    } else {
      assert.match(building.url, /^https:\/\//, "Official Building manual should remain on Wix");
      assert.equal(building.learningFallback, undefined);
      const relative = buildingPathsByUrl.get(building.url);
      assert.ok(relative, "Unmapped Building Wix URL: " + building.url);
      const file = resolve(root, "public", relative);
      assert.equal(readFileSync(file).subarray(0, 5).toString("ascii"), "%PDF-");
      sourceFiles.add(file);
    }
  }
  assert.equal(sourceFiles.size, 48);
  assert.equal(Object.keys(levelFourBuildingManuals).length, 56);
  assert.equal(getAdvancedLevel(4).reduce((n,cat) => n + cat.entries.length, 0), 56);
});

test("optimized versions are accessible and have independent completion keys", () => {
  for (const id of ["level-4-warrior-with-claws","level-4-dangerous-assassin"]) {
    assert.equal(hasLevelFourOptimizedManual(id), true);
    const base = getLevelFourBuildingManual(id);
    const optimized = getLevelFourBuildingManual(id, "optimized");
    assert.notEqual(base.url, optimized.url);
    assert.notEqual(base.completionStepId, optimized.completionStepId);
    assert.match(optimized.url, /^https:\/\//, "Optimized Building manual should remain on Wix");
    const relative = buildingPathsByUrl.get(optimized.url);
    assert.ok(relative, "Unmapped optimized Building Wix URL: " + optimized.url);
    const path = resolve(root, "public", relative);
    assert.equal(readFileSync(path).subarray(0, 5).toString("ascii"), "%PDF-");
  }
  assert.equal(hasLevelFourOptimizedManual("level-4-personal-bodyguard"), false);
});

test("Learning and Building are separate with transparent fallbacks", () => {
  const overview = read("src/routes/projects.$projectId.tsx");
  const route = read("src/routes/practical/$projectId.tsx");
  const viewer = read("src/components/practical/PdfActivityViewer.tsx");
  assert.ok(route.includes('project.level === 4 && mode === "building"'));
  assert.ok(route.includes("getLevelFourBuildingManual(project.id, variant)"));
  assert.ok(route.includes("manual={buildingManual}"));
  assert.ok(overview.includes("hasOptimizedBuilding"));
  assert.ok(overview.includes('variant: "optimized"'));
  assert.ok(overview.includes("No separate Building manual was supplied"));
  assert.ok(viewer.includes("Building reference: no separate Building manual is available."));
  assert.ok(viewer.includes('isLearningFallback ? "Finish Review"'));
  for (const lesson of levelFourLearningLessons) {
    assert.equal(levelFourLearningManuals[lesson.id].sourceKind, "powerpoint");
    assert.equal(levelFourLearningManuals[lesson.id].url, lesson.url);
  }
});
