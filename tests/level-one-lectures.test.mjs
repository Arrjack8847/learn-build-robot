import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = file => readFileSync(resolve(root, file), "utf8");
const manifest = read("src/data/levelOneLectures.ts");
const transpiled = ts.transpileModule(manifest, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const module = { exports: {} };
runInNewContext(transpiled, { module, exports: module.exports });
const { LEVEL_ONE_LECTURE_COUNT, levelOneLectures, getLevelOneLecture } = module.exports;

function allPdfs(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? allPdfs(path) : entry.isFile() && entry.name.endsWith(".pdf") ? [path] : [];
  });
}

test("every original Level 1 PowerPoint has a distinct converted PDF in public assets", () => {
  const files = allPdfs(resolve(root, "public/Level 1/Learning"));
  assert.equal(files.length, 45);
  assert.equal(LEVEL_ONE_LECTURE_COUNT, 45);
  assert.equal(Object.keys(levelOneLectures).length, 46);
  const found = new Set();
  for (const lecture of Object.values(levelOneLectures)) {
    assert.equal(lecture.projectId.length > 0, true);
    assert.ok(lecture.url.startsWith("/Level%201/Learning/"));
    const relative = decodeURIComponent(lecture.url).replace(/^\//, "");
    const absolute = resolve(root, "public", relative);
    assert.ok(files.includes(absolute), "Missing PDF: " + relative);
    assert.equal(readFileSync(absolute).subarray(0, 5).toString("ascii"), "%PDF-");
    found.add(absolute);
  }
  assert.equal(found.size, 45);
});

test("Crawl Slowly variants share slides but keep separate building manuals", () => {
  const basic = getLevelOneLecture("crawl-slowly-basic");
  const optimized = getLevelOneLecture("crawl-slowly-optimized");
  assert.ok(basic);
  assert.equal(basic.url, optimized.url);
  assert.equal(basic.learningOnly, false);
  assert.equal(optimized.learningOnly, false);
});

test("Lecture-only projects do not offer a false building manual", () => {
  assert.equal(Object.values(levelOneLectures).filter(lecture => lecture.learningOnly).length, 15);
  for (const id of ["ferocious-snake", "funny-cat", "athlete", "sailboat", "car"]) {
    assert.equal(getLevelOneLecture(id).learningOnly, true);
  }
  assert.equal(getLevelOneLecture("acceleration-car").learningOnly, false);
  assert.equal(getLevelOneLecture("not-a-level-one-project"), undefined);
});

test("Learning and Building remain distinct with explicit project routes", () => {
  const overview = read("src/routes/projects.$projectId.tsx");
  const route = read("src/routes/practical/$projectId.tsx");
  const studio = read("src/components/practical/LevelOneLearningStudio.tsx");
  assert.match(overview, /search=\{\{ mode: "learning" \}\}/);
  assert.match(overview, /search=\{\{ mode: "building" \}\}/);
  assert.match(route, /mode === "learning"/);
  assert.match(route, /<AccelerationCarPdfViewer \/>/);
  assert.match(route, /<PdfActivityViewer key=\{project.id\} manual=\{pdfManual\} \/>/);
  assert.match(studio, /<PdfManualPage/);
  assert.match(studio, /ArrowRight|PageDown/);
  assert.doesNotMatch(studio, /BuildingFloatingDock/);
});
