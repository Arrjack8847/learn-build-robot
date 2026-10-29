import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = file => readFileSync(resolve(root, file), "utf8");
const mappingSource = read("src/data/levelOneToThreeWixPdfUrls.ts");
const wixUrls = JSON.parse(mappingSource.match(/export const levelOneToThreeWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/)[1]);
const sourcePathByUrl = new Map(Object.entries(wixUrls).map(([path, url]) => [url, path]));

/** Execute the real data modules, including existing Building PDF registrations. */
const modules = new Map();
function loadDataModule(relativePath) {
  const absolute = resolve(root, relativePath);
  if (modules.has(absolute)) return modules.get(absolute).exports;
  const module = { exports: {} };
  modules.set(absolute, module);
  const compiled = ts.transpileModule(readFileSync(absolute, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const require = specifier => {
    assert.ok(specifier.startsWith("."), "Unexpected external import: " + specifier);
    return loadDataModule(resolve(dirname(absolute), specifier + ".ts"));
  };
  runInNewContext(compiled, { module, exports: module.exports, require }, { filename: absolute });
  return module.exports;
}

const {
  LEVEL_ONE_LECTURE_COUNT,
  LEVEL_ONE_BUILDING_PDF_LEARNING_FALLBACK_IDS,
  levelOneLectures,
  getLevelOneLecture,
} = loadDataModule("src/data/levelOneLectures.ts");
const { pdfActivityManuals } = loadDataModule("src/data/pdfActivityManuals.ts");

function allPdfs(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? allPdfs(path) : entry.isFile() && entry.name.endsWith(".pdf") ? [path] : [];
  });
}

test("the existing 45 lecture files and their project routes are unchanged", () => {
  const files = allPdfs(resolve(root, "public/Level 1/Learning"));
  assert.equal(files.length, 45);
  assert.equal(LEVEL_ONE_LECTURE_COUNT, 45);
  const originalLectures = Object.values(levelOneLectures).filter(item => sourcePathByUrl.get(item.url)?.startsWith("Level 1/Learning/"));
  assert.equal(originalLectures.length, 46); // Crawl Slowly has two variants.
  const seen = new Set();
  for (const lecture of originalLectures) {
    const relative = sourcePathByUrl.get(lecture.url);
    assert.ok(relative, "Learning PDF must resolve to Wix");
    const absolute = resolve(root, "public", relative);
    assert.ok(files.includes(absolute), "Missing converted PDF: " + relative);
    assert.equal(readFileSync(absolute).subarray(0, 5).toString("ascii"), "%PDF-");
    seen.add(absolute);
  }
  assert.equal(seen.size, 45);
});

test("exactly 14 missing lecture projects reuse the already-registered Building PDF", () => {
  const filenames = new Map([
    ["caged-bird", "Caged Bird.pdf"],
    ["propeller-aircraft", "Propeller Aircraft.pdf"],
    ["balanced-bird", "Balanced Bird.pdf"],
    ["dancing-music-box", "Dancing Music Box.pdf"],
    ["hand-cranking-fan", "Hand-cranking Fan.pdf"],
    ["old-fashioned-telephone", "Old-fashioned Telephone.pdf"],
    ["wiper", "Wiper.pdf"],
    ["hand-cranking-giant-stride", "Hand-cranking Giant Stride.pdf"],
    ["hermit-crab", "Hermit Crab.pdf"],
    ["little-owl", "Little Owl.pdf"],
    ["oscillating-fan", "Oscillating Fan.pdf"],
    ["pocket-pistol", "Pocket Pistol.pdf"],
    ["pullback-bicycle", "Pullback Bicycle.pdf"],
    ["rotating-coffee-cup", "Rotating Coffee Cup.pdf"],
  ]);
  assert.equal(LEVEL_ONE_BUILDING_PDF_LEARNING_FALLBACK_IDS.length, 14);
  assert.equal(new Set(LEVEL_ONE_BUILDING_PDF_LEARNING_FALLBACK_IDS).size, 14);
  for (const projectId of LEVEL_ONE_BUILDING_PDF_LEARNING_FALLBACK_IDS) {
    const learning = getLevelOneLecture(projectId);
    const building = pdfActivityManuals[projectId];
    assert.ok(building, "Missing existing Building PDF for " + projectId);
    assert.ok(learning, "Missing Learning PDF for " + projectId);
    assert.equal(learning.url, building.url);
    assert.equal(learning.url, wixUrls[filenames.get(projectId)]);
    assert.equal(learning.learningOnly, false);
    const file = resolve(root, "public", filenames.get(projectId));
    assert.equal(readFileSync(file).subarray(0, 5).toString("ascii"), "%PDF-");
  }
  assert.equal(Object.keys(levelOneLectures).length, 60); // 59 projects + Crawl Slowly variant.
});

test("all 59 Level 1 syllabus projects now offer a Learning source", () => {
  const { getLevelOneProjects } = loadDataModule("src/data/levelOneProjects.ts");
  const { LEVEL_ONE_CATEGORIES } = loadDataModule("src/data/levelOneCategories.ts");
  const syllabus = LEVEL_ONE_CATEGORIES.flatMap(cat => getLevelOneProjects(cat.id));
  assert.equal(syllabus.length, 59);
  for (const project of syllabus) {
    const ids = project.availableProjectId ? [project.availableProjectId] :
      project.availableProjectVariants?.map(variant => variant.projectId) ?? [];
    assert.ok(ids.length > 0, "No linked Level 1 project: " + project.name);
    for (const id of ids) {
      assert.ok(getLevelOneLecture(id), "Missing Learning source: " + id);
    }
  }
});

test("Crawl Slowly variants share slides but keep distinct Building manuals", () => {
  const basic = getLevelOneLecture("crawl-slowly-basic");
  const optimized = getLevelOneLecture("crawl-slowly-optimized");
  assert.equal(basic.url, optimized.url);
  assert.notEqual(pdfActivityManuals["crawl-slowly-basic"].url, pdfActivityManuals["crawl-slowly-optimized"].url);
  assert.equal(basic.learningOnly, false);
  assert.equal(optimized.learningOnly, false);
});

test("all Level 1 projects can use their separately registered Building PDFs", () => {
  assert.equal(Object.values(levelOneLectures).filter(lecture => lecture.learningOnly).length, 0);
  for (const id of ["ferocious-snake", "funny-cat", "athlete", "sailboat", "car"]) {
    assert.equal(getLevelOneLecture(id).learningOnly, false);
    assert.ok(pdfActivityManuals[id]);
    assert.notEqual(getLevelOneLecture(id).url, pdfActivityManuals[id].url);
  }
  assert.equal(getLevelOneLecture("acceleration-car").learningOnly, false);
  assert.equal(getLevelOneLecture("not-a-level-one-project"), undefined);
});

test("Learning reuses the same viewer and keeps Building actions independent", () => {
  const overview = read("src/routes/projects.$projectId.tsx");
  const route = read("src/routes/practical/$projectId.tsx");
  const studio = read("src/components/practical/LevelOneLearningStudio.tsx");
  assert.match(overview, /search=\{\{ mode: "learning" \}\}/);
  assert.match(overview, /search=\{\{ mode: "building" \}\}/);
  assert.match(route, /mode === "learning"/);
  assert.match(route, /<AccelerationCarPdfViewer \/>/);
  assert.match(route, /<PdfActivityViewer key=\{project.id\} manual=\{pdfManual\} \/>/);
  assert.match(studio, /<PdfManualPage/);
  assert.match(studio, /PageDown/);
  assert.doesNotMatch(studio, /BuildingFloatingDock|toggleStepCompleted/);
});
