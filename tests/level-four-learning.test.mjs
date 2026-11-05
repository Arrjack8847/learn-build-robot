import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const modules = new Map();

// Execute the actual data modules while resolving Vite asset imports to their
// on-disk paths. This checks the registered runtime data, not generated copies.
function loadDataModule(relativePath) {
  const path = resolve(root, relativePath);
  if (modules.has(path)) return modules.get(path).exports;
  const module = { exports: {} };
  modules.set(path, module);
  const { outputText } = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const require = (specifier) => {
    if (specifier.endsWith("?url")) {
      return { __esModule: true, default: resolve(dirname(path), specifier.slice(0, -4)) };
    }
    if (specifier.startsWith(".")) {
      return loadDataModule(resolve(dirname(path), specifier + ".ts"));
    }
    throw new Error("Unexpected data module import: " + specifier);
  };
  // Vite compiles import.meta.env.* in the browser; this CommonJS-only test sandbox
  // must replace those compile-time flags before loading shared Level 5/6 data modules.
  const sandboxText = outputText
    .replace(/\bimport\.meta\.env\.DEV\b/g, "false")
    .replace(/\bimport\.meta\.env\.[A-Za-z_$][\w$]*/g, "undefined");
  vm.runInNewContext(sandboxText, { module, exports: module.exports, require }, { filename: path });
  return module.exports;
}

const { getAdvancedLevel, syllabusSlug } = loadDataModule("src/data/advancedSyllabus.ts");
const { levelFourLearningLessons } = loadDataModule("src/data/levelFourLearning.ts");
const { levelFourWixPdfUrls } = loadDataModule("src/data/levelFourWixPdfUrls.ts");
const { pdfActivityManuals, isPdfActivityProject } = loadDataModule(
  "src/data/pdfActivityManuals.ts",
);
const { practicalProjects, getProject } = loadDataModule("src/data/practical.ts");
const categories = getAdvancedLevel(4);
const key = (category, title) => category + ":" + syllabusSlug(title);

test("All 56 Level 4 activities match their exact official names and 20 categories", () => {
  assert.equal(categories.length, 20);
  assert.equal(levelFourLearningLessons.length, 56);
  const expected = Array.from(categories).flatMap((category) =>
    Array.from(category.entries, (entry) => key(category.id, entry.name)),
  );
  const actual = Array.from(levelFourLearningLessons, (lesson) =>
    key(lesson.categoryId, lesson.title),
  );
  assert.equal(new Set(actual).size, 56);
  assert.deepEqual(actual.sort(), expected.sort());
  for (const lesson of levelFourLearningLessons) {
    const category = categories.find((item) => item.id === lesson.categoryId);
    assert.equal(lesson.categoryName, category.name);
    assert.ok(category.entries.some((entry) => entry.name === lesson.title));
    assert.equal(lesson.pdfFile.split("/")[1], category.name);
  }
});

test("Every Level 4 project opens Learning with its own presentation and progress key", () => {
  assert.equal(practicalProjects.filter((project) => project.level === 4).length, 56);
  assert.equal(
    new Set(Array.from(practicalProjects, (project) => project.id)).size,
    practicalProjects.length,
  );
  for (const lesson of levelFourLearningLessons) {
    const project = getProject(lesson.id);
    assert.equal(project.level, 4);
    assert.equal(project.title, lesson.title);
    assert.equal(project.categoryId, lesson.categoryId);
    assert.ok(isPdfActivityProject(project.id));
    const manual = pdfActivityManuals[project.id];
    assert.equal(manual.sourceKind, "powerpoint");
    assert.equal(manual.url, lesson.url);
    assert.equal(manual.title, project.title);
    assert.equal(manual.originalPowerPointFile, lesson.originalPowerPointFile);
    assert.equal(manual.completionStepId, `${project.id}-slides-complete`);
    assert.equal(project.steps[0].id, manual.completionStepId);
    assert.equal(project.steps[0].title, "Finish PowerPoint slides");
  }
});

test("Every uploaded Level 4 PDF parses in the website renderer with its source slide count", async () => {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const expectedFiles = new Set();
  let totalPages = 0;
  for (const lesson of levelFourLearningLessons) {
    const file = resolve(root, "public", lesson.pdfFile);
    expectedFiles.add(file);
    assert.equal(lesson.url, levelFourWixPdfUrls[lesson.pdfFile]);
    const bytes = readFileSync(file);
    assert.equal(bytes.subarray(0, 5).toString("ascii"), "%PDF-", lesson.pdfFile);
    const task = getDocument({ data: new Uint8Array(bytes) });
    try {
      const pdf = await task.promise;
      assert.equal(pdf.numPages, lesson.pageCount, lesson.pdfFile);
      assert.ok(pdf.numPages > 0);
      totalPages += pdf.numPages;
    } finally {
      await task.destroy();
    }
  }
  const files = readdirSync(resolve(root, "public", "Level 4"), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && extname(entry.name).toLowerCase() === ".pdf" && !resolve(entry.parentPath, entry.name).split(sep).includes("Building"))
    .map((entry) => resolve(entry.parentPath, entry.name));
  assert.equal(files.length, 56);
  assert.deepEqual(new Set(files), expectedFiles);
  assert.equal(totalPages, 1346);
});

test("Level 4 presentations use the existing Project to Learning flow and slide viewer", () => {
  const overview = readFileSync(resolve(root, "src/routes/projects.$projectId.tsx"), "utf8");
  const viewer = readFileSync(
    resolve(root, "src/components/practical/PdfActivityViewer.tsx"),
    "utf8",
  );
  assert.ok(overview.includes('pdfActivityManuals[project.id]?.sourceKind === "powerpoint"'));
  assert.ok(overview.includes("const hasLearning = Boolean(lecture) || isPresentation"));
  assert.ok(overview.includes("const hasBuilding = level === 4"));
  assert.ok(overview.includes("level === 1 ? getLevelOneLecture(project.id) :"));
  assert.ok(overview.includes("Start Learning"));
  assert.ok(viewer.includes('"Next Slide"'));
  assert.ok(viewer.includes('"Finish Slides"'));
});
