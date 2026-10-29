import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = path => readFileSync(resolve(root, path), "utf8");
const mappingSource = read("src/data/levelOneToThreeWixPdfUrls.ts");
const wixUrls = JSON.parse(mappingSource.match(/export const levelOneToThreeWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/)[1]);
const sourcePathByUrl = new Map(Object.entries(wixUrls).map(([path, url]) => [url, path]));
const modules = new Map();

function loadDataModule(path) {
  const absolute = resolve(root, path);
  if (modules.has(absolute)) return modules.get(absolute).exports;
  const module = { exports: {} };
  modules.set(absolute, module);
  const { outputText } = ts.transpileModule(readFileSync(absolute, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const require = specifier => {
    assert.ok(specifier.startsWith("."), "Unexpected module import: " + specifier);
    return loadDataModule(resolve(dirname(absolute), specifier + ".ts"));
  };
  runInNewContext(outputText, { module, exports: module.exports, require }, { filename: absolute });
  return module.exports;
}

function allPdfs(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => {
    const absolute = join(path, entry.name);
    return entry.isDirectory() ? allPdfs(absolute) :
      entry.isFile() && entry.name.toLowerCase().endsWith(".pdf") ? [absolute] : [];
  });
}

const {
  LEVEL_THREE_UPLOADED_LECTURE_COUNT,
  LEVEL_THREE_BUILDING_PDF_LEARNING_FALLBACK_IDS,
  levelThreeLectures,
  getLevelThreeLecture,
  getLevelThreeBuildingReferenceManual,
} = loadDataModule("src/data/levelThreeLectures.ts");
const { pdfActivityManuals } = loadDataModule("src/data/pdfActivityManuals.ts");
const { getAdvancedLevel } = loadDataModule("src/data/advancedSyllabus.ts");
const { practicalProjects } = loadDataModule("src/data/practical.ts");
const levelThreeProjects = practicalProjects.filter(project => project.level === 3);

test("all 43 uploaded Level 3 lecture PDFs are mapped and unchanged", () => {
  const pdfs = allPdfs(resolve(root, "public/Level 3/Learning"));
  assert.equal(pdfs.length, 43);
  assert.equal(LEVEL_THREE_UPLOADED_LECTURE_COUNT, 43);
  const uploadedEntries = Object.values(levelThreeLectures).filter(x => sourcePathByUrl.get(x.url)?.startsWith("Level 3/Learning/"));
  assert.equal(uploadedEntries.length, 46); // Cycle Sport (2), Race Walking (3)
  const distinct = new Set();
  for (const lecture of uploadedEntries) {
    const file = resolve(root, "public", sourcePathByUrl.get(lecture.url));
    assert.ok(pdfs.includes(file), "Uploaded PDF missing: " + file);
    assert.equal(readFileSync(file).subarray(0, 5).toString("ascii"), "%PDF-");
    distinct.add(file);
  }
  assert.equal(distinct.size, 43);
});

test("the five missing lectures reuse their exact existing Building PDF URLs", () => {
  const files = new Map([
    ["level-3-lifting-maintenance-vehicle", "Lifting Maintenance Vehicle.pdf"],
    ["level-3-biting-monster", "Biting Monster.pdf"],
    ["level-3-electric-gyro-launcher", "Electric Gyro Launcher.pdf"],
    ["level-3-responder", "Responder.pdf"],
    ["level-3-lunar-rover", "Lunar Rover.pdf"],
  ]);
  assert.equal(LEVEL_THREE_BUILDING_PDF_LEARNING_FALLBACK_IDS.length, 5);
  assert.equal(new Set(LEVEL_THREE_BUILDING_PDF_LEARNING_FALLBACK_IDS).size, 5);
  for (const id of LEVEL_THREE_BUILDING_PDF_LEARNING_FALLBACK_IDS) {
    const learning = getLevelThreeLecture(id);
    const building = pdfActivityManuals[id];
    assert.ok(learning && building, "Learning or Building PDF missing for " + id);
    assert.equal(learning.url, building.url);
    assert.equal(learning.url, wixUrls[files.get(id)]);
    assert.equal(learning.learningOnly, false);
    const path = resolve(root, "public", files.get(id));
    assert.equal(readFileSync(path).subarray(0, 5).toString("ascii"), "%PDF-");
  }
});

test("all 48 Level 3 projects have Learning and presentation-only projects gain Building references", () => {
  const syllabus = getAdvancedLevel(3);
  assert.equal(syllabus.length, 20);
  assert.equal(syllabus.reduce((n, cat) => n + cat.entries.length, 0), 48);
  assert.equal(levelThreeProjects.length, 51); // Multiple Building versions
  assert.equal(Object.keys(levelThreeLectures).length, 51);
  for (const project of levelThreeProjects) {
    const learning = getLevelThreeLecture(project.id);
    const manual = pdfActivityManuals[project.id];
    assert.ok(learning, "No Learning for " + project.id);
    assert.ok(manual, "Existing Building manual mapping missing for " + project.id);
    assert.equal(learning.learningOnly, false);
    const reference = getLevelThreeBuildingReferenceManual(project.id);
    if (manual.sourceKind === "powerpoint") {
      assert.ok(reference, "Missing Building reference for " + project.id);
      assert.equal(reference.url, learning.url);
      assert.equal(reference.learningFallback, true);
      assert.notEqual(reference.completionStepId, manual.completionStepId);
    } else {
      assert.equal(reference, undefined);
    }
  }
  for (const id of ["level-3-cycle-sport-basic", "level-3-cycle-sport-optimized"]) {
    assert.equal(getLevelThreeLecture(id).url, getLevelThreeLecture("level-3-cycle-sport-basic").url);
  }
  for (const id of ["level-3-race-walking-basic", "level-3-race-walking-optimized", "level-3-race-walking-optimized-ratchet"]) {
    assert.equal(getLevelThreeLecture(id).url, getLevelThreeLecture("level-3-race-walking-basic").url);
  }
  assert.notEqual(getLevelThreeLecture("level-3-bumper-car-foundational-robots").url,
    getLevelThreeLecture("level-3-bumper-car-interactive-mechanisms").url);
});

test("Learning uses the established slides viewer and retains existing Building routing", () => {
  const overview = read("src/routes/projects.$projectId.tsx");
  const route = read("src/routes/practical/$projectId.tsx");
  const studio = read("src/components/practical/LevelOneLearningStudio.tsx");
  assert.ok(overview.includes("getLevelThreeLecture(project.id)"));
  assert.ok(route.includes("getLevelThreeLecture(project.id)"));
  assert.ok(route.includes("level={project.level === 5 || project.level === 6 ? project.level :"));
  assert.ok(overview.includes('search={{ mode: "learning" }}'));
  assert.ok(overview.includes('search={{ mode: "building" }}'));
  assert.ok(route.includes("<PdfActivityViewer key={project.id} manual={pdfManual} />"));
  assert.ok(studio.includes("<PdfManualPage"));
  assert.ok(studio.includes("level?: 1 | 2 | 3"));
  assert.ok(!studio.includes("BuildingFloatingDock") && !studio.includes("toggleStepCompleted"));
});
