import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const modules = new Map();
const read = file => readFileSync(resolve(root, file), "utf8");

/** Load the actual TypeScript data modules without mocking registered PDFs. */
function loadDataModule(path) {
  const absolute = resolve(root, path);
  if (modules.has(absolute)) return modules.get(absolute).exports;
  const module = { exports: {} };
  modules.set(absolute, module);
  const { outputText } = ts.transpileModule(readFileSync(absolute, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const require = specifier => {
    assert.ok(specifier.startsWith("."), "Unexpected import " + specifier);
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
  LEVEL_TWO_UPLOADED_LECTURE_COUNT,
  LEVEL_TWO_BUILDING_PDF_LEARNING_FALLBACK_IDS,
  levelTwoLectures,
  getLevelTwoLecture,
} = loadDataModule("src/data/levelTwoLectures.ts");
const { pdfActivityManuals } = loadDataModule("src/data/pdfActivityManuals.ts");
const { getAdvancedLevel } = loadDataModule("src/data/advancedSyllabus.ts");
const { practicalProjects } = loadDataModule("src/data/practical.ts");
const levelTwoProjects = practicalProjects.filter(p => p.level === 2);

test("all 44 uploaded lecture PDFs are linked to the correct Level 2 projects", () => {
  const pdfs = allPdfs(resolve(root, "public/Level 2/Learning"));
  assert.equal(pdfs.length, 44);
  assert.equal(LEVEL_TWO_UPLOADED_LECTURE_COUNT, 44);
  const lectureEntries = Object.values(levelTwoLectures).filter(x => x.url.startsWith("/Level%202/Learning/"));
  assert.equal(lectureEntries.length, 45); // Two See Saw building versions share one lecture.
  const unique = new Set();
  for (const lecture of lectureEntries) {
    const relative = decodeURIComponent(lecture.url).replace(/^\//, "");
    const file = resolve(root, "public", relative);
    assert.ok(pdfs.includes(file), "Unregistered Level 2 lecture asset: " + relative);
    assert.equal(readFileSync(file).subarray(0, 5).toString("ascii"), "%PDF-");
    unique.add(file);
    assert.equal(lecture.learningOnly, false);
  }
  assert.equal(unique.size, 44);
});

test("exactly 15 missing Level 2 lectures use their official Building PDF URL", () => {
  const filenames = new Map([
    ["level-2-crane", "Crane.pdf"],
    ["level-2-fare-gate", "Fare Gate.pdf"],
    ["level-2-forklift", "Forklift.pdf"],
    ["level-2-dung-beetle", "Dung Beetle.pdf"],
    ["level-2-mobile-shot", "Mobile Shot.pdf"],
    ["level-2-rolling-shutter", "Rolling Shutter.pdf"],
    ["level-2-track-rickshaw", "Track Rickshaw.pdf"],
    ["level-2-led-scrolling-screen", "LED Scrolling Screen.pdf"],
    ["level-2-led-signboard", "LED Signboard.pdf"],
    ["level-2-four-wheel-drive", "Four-wheel Drive.pdf"],
    ["level-2-pedal-waterwheel", "Pedal Waterwheel.pdf"],
    ["level-2-tank", "Tank.pdf"],
    ["level-2-reverse-parking", "Reverse Parking.pdf"],
    ["level-2-smart-window", "Smart Window.pdf"],
    ["level-2-spirograph", "Spirograph.pdf"],
  ]);
  assert.equal(LEVEL_TWO_BUILDING_PDF_LEARNING_FALLBACK_IDS.length, 15);
  assert.equal(new Set(LEVEL_TWO_BUILDING_PDF_LEARNING_FALLBACK_IDS).size, 15);
  for (const projectId of LEVEL_TWO_BUILDING_PDF_LEARNING_FALLBACK_IDS) {
    const manual = pdfActivityManuals[projectId];
    const learning = getLevelTwoLecture(projectId);
    assert.ok(manual, "Building PDF not registered for " + projectId);
    assert.ok(learning, "No Level 2 Learning source for " + projectId);
    assert.equal(learning.url, manual.url);
    assert.equal(learning.url, "/" + encodeURIComponent(filenames.get(projectId)));
    assert.equal(learning.learningOnly, false);
    const file = resolve(root, "public", filenames.get(projectId));
    assert.equal(readFileSync(file).subarray(0, 5).toString("ascii"), "%PDF-");
  }
});

test("every Level 2 syllabus project has Learning while existing Building stays separate", () => {
  assert.equal(levelTwoProjects.length, 60); // 59 syllabus entries, See Saw has 2 versions.
  assert.equal(Object.keys(levelTwoLectures).length, 60);
  const syllabus = getAdvancedLevel(2);
  assert.equal(syllabus.length, 18);
  assert.equal(syllabus.reduce((total, category) => total + category.entries.length, 0), 59);
  for (const project of levelTwoProjects) {
    assert.ok(getLevelTwoLecture(project.id), "No Learning source for " + project.id);
    assert.ok(pdfActivityManuals[project.id], "No Building source for " + project.id);
  }
  assert.equal(getLevelTwoLecture("level-2-see-saw-v1").url, getLevelTwoLecture("level-2-see-saw-v2").url);
  assert.notEqual(pdfActivityManuals["level-2-see-saw-v1"].url, pdfActivityManuals["level-2-see-saw-v2"].url);
  assert.notEqual(getLevelTwoLecture("level-2-crane").url, getLevelTwoLecture("level-2-mechanisms-simulators-crane").url);
  assert.notEqual(getLevelTwoLecture("level-2-the-treadmill").url, getLevelTwoLecture("level-2-treadmill").url);
});

test("Level 2 uses the established slide-by-slide Learning Studio without touching Building", () => {
  const overview = read("src/routes/projects.$projectId.tsx");
  const route = read("src/routes/practical/$projectId.tsx");
  const studio = read("src/components/practical/LevelOneLearningStudio.tsx");
  assert.match(overview, /getLevelTwoLecture\(project.id\)/);
  assert.match(route, /getLevelTwoLecture\(project.id\)/);
  assert.match(route, /level=\{project.level === 2 \? 2 : 1\}/);
  assert.match(overview, /search=\{\{ mode: "learning" \}\}/);
  assert.match(overview, /search=\{\{ mode: "building" \}\}/);
  assert.match(route, /<PdfActivityViewer key=\{project.id\} manual=\{pdfManual\} \/>/);
  assert.match(studio, /<PdfManualPage/);
  assert.match(studio, /Level \{level\} · Learning Studio/);
  assert.doesNotMatch(studio, /BuildingFloatingDock|toggleStepCompleted/);
});
