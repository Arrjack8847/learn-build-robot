import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const names = [
  ["src/data/levelOneToThreeWixPdfUrls.ts", "levelOneToThreeWixPdfUrls", 304],
  ["src/data/levelFourWixPdfUrls.ts", "levelFourWixPdfUrls", 106],
  ["src/data/levelFiveWixPdfUrls.ts", "levelFiveWixPdfUrls", 96],
  ["src/data/levelSixWixPdfUrls.ts", "levelSixWixPdfUrls", 84],
];

function parseRegistry(path, name) {
  const pattern = new RegExp("export const " + name +
    ": Readonly<Record<string, string>> = (\\{[\\s\\S]*?\\});");
  const match = read(path).match(pattern);
  assert.ok(match, "Cannot parse " + path);
  return JSON.parse(match[1]);
}
const registries = names.map(([path, name]) => parseRegistry(path, name));
const combined = Object.assign({}, ...registries);
const wixPdf = /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf$/i;

test("all 590 registered PDFs have Wix-only URLs", () => {
  for (let i = 0; i < names.length; i++) {
    assert.equal(Object.keys(registries[i]).length, names[i][2]);
  }
  assert.equal(Object.keys(combined).length, 590);
  assert.equal(new Set(Object.values(combined)).size, 590);
  for (const [path, url] of Object.entries(combined)) {
    assert.match(path, /\.pdf$/i);
    assert.match(url, wixPdf, "Unexpected local/non-Wix PDF: " + path);
  }
});

test("all Level 5 and 6 Learning/Building lessons use registered Wix PDFs", () => {
  const src = read("src/data/levelFiveSixContent.ts");
  const found = src.match(
    /export const levelFiveSixLessons: readonly AdvancedLessonAsset\[\] = (\[[\s\S]*?\]);/,
  );
  assert.ok(found);
  const lessons = JSON.parse(found[1]);
  const expected = lessons.flatMap(lesson =>
    [lesson.learningPdf, lesson.buildingBasic, lesson.buildingOptimized].filter(Boolean));
  assert.equal(lessons.length, 94);
  assert.equal(expected.length, 180);
  for (const path of expected) assert.match(combined[path] || "", wixPdf, path);
});

test("Level 4 Learning and Building source paths all resolve to Wix", () => {
  const learning = read("src/data/levelFourLearning.ts");
  const building = read("src/data/levelFourBuilding.ts");
  const learningPaths = [...learning.matchAll(/url:\s*publicPdfUrl\("([^"]+\.pdf)"\)/g)]
    .map(match => match[1]);
  const buildingPaths = [...building.matchAll(
    /\["level-4-[^"]+",\s*"([^"]+\.pdf)",\s*"(?:basic|optimized)"\]/g,
  )].map(match => "Level 4/Building/" + match[1]);
  assert.equal(learningPaths.length, 56);
  assert.equal(buildingPaths.length, 50);
  for (const path of [...learningPaths, ...buildingPaths]) {
    assert.match(combined[path] || "", wixPdf, path);
  }
});

test("Level 1–3 Wix registries include all legacy and Learning PDF paths", () => {
  const paths = Object.keys(registries[0]);
  assert.equal(paths.filter(path => !path.includes("/")).length, 172);
  assert.equal(paths.filter(path => path.startsWith("Level 1/Learning/")).length, 45);
  assert.equal(paths.filter(path => path.startsWith("Level 2/Learning/")).length, 44);
  assert.equal(paths.filter(path => path.startsWith("Level 3/Learning/")).length, 43);
  const source = read("src/data/pdfActivityManuals.ts");
  const referred = [...source.matchAll(/staticPdfUrl\("([^"]+\.pdf)"\)/g)].map(match => match[1]);
  assert.ok(referred.length > 100);
  for (const filename of referred) assert.match(combined[filename] || "", wixPdf, filename);
});

test("Wix-only lookup rejects missing or local PDF URLs", () => {
  const code = ts.transpileModule(read("src/data/requireWixPdfUrl.ts"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  runInNewContext(code, { module, exports: module.exports }, { filename: "requireWixPdfUrl.ts" });
  const requireWixPdfUrl = module.exports.requireWixPdfUrl;
  const good = registries[0]["01.Hello World-Building Manual.pdf"];
  assert.equal(requireWixPdfUrl("01.Hello World-Building Manual.pdf", good), good);
  assert.throws(() => requireWixPdfUrl("missing.pdf", undefined), /Missing or invalid Steam Wix/);
  assert.throws(() => requireWixPdfUrl("bad.pdf", "/local.pdf"), /Missing or invalid Steam Wix/);
  assert.throws(() => requireWixPdfUrl("bad.pdf", "https://example.com/manual.pdf"),
    /Missing or invalid Steam Wix/);
});

test("all course PDF resolvers fail closed instead of returning local PDF paths", () => {
  for (const path of [
    "src/data/staticPdfUrl.ts",
    "src/data/levelFourLearning.ts",
    "src/data/levelFourBuilding.ts",
    "src/data/levelFiveSixContent.ts",
  ]) {
    assert.match(read(path), /requireWixPdfUrl\(/, path);
  }
  const content = read("src/data/levelFiveSixContent.ts");
  assert.match(content, /if \(path\.toLowerCase\(\)\.endsWith\("\.pdf"\)\) return requireWixPdfUrl/);
  assert.doesNotMatch(read("src/data/staticPdfUrl.ts"), /\?\?\s*"\/"\s*\+\s*encodeURIComponent/);
});

test("PDFs are ignored for new commits and excluded from built output", () => {
  assert.match(read(".gitignore"), /^\*\.\[Pp\]\[Dd\]\[Ff\]$/m);
  const pkg = JSON.parse(read("package.json"));
  assert.match(pkg.scripts.postbuild, /remove-all-output-pdfs\.mjs/);
  assert.match(pkg.scripts["build:wix"], /test:pdf:wix-only/);
  assert.match(pkg.scripts["dev:wix"], /test:pdf:wix-only/);
  const sweep = read("scripts/pdf/remove-all-output-pdfs.mjs");
  assert.match(sweep, /"\.output\/public"/);
  assert.match(sweep, /unlinkSync\(entry\)/);
  assert.doesNotMatch(sweep, /unlinkSync\((?:file|source)\)/);
});
