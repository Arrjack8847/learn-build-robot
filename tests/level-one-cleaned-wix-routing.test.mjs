import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = name => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const registry = read("src/data/levelOneToThreeWixPdfUrls.ts");
const parsed = registry.match(/export const levelOneToThreeWixPdfUrls: Readonly<Record<string, string>> = (\\{[\\s\\S]*?\\});/);
assert.ok(parsed, "Wix URL registry missing");
const urls = JSON.parse(parsed[1]);
const prefix = "Level 1/Learning/";
const levelOne = Object.entries(urls).filter(([key]) => key.startsWith(prefix));
const lessonData = read("src/data/levelOneLectures.ts");
const resolver = read("src/data/staticPdfUrl.ts");
const pruner = read("scripts/pdf/prune-wix-building-from-output.mjs");

test("All 45 Level 1 Learning original sources remain tracked and each maps to Wix", () => {
  const files = execFileSync("git", ["ls-tree", "-r", "--name-only", "HEAD", "public/Level 1/Learning"], {encoding:"utf8"})
    .trim().split(/\\r?\\n/).filter(x => x.toLowerCase().endsWith(".pdf"))
    .map(x => x.slice("public/".length));
  assert.equal(levelOne.length, 45);
  assert.equal(files.length, 45);
  assert.deepEqual(levelOne.map(([key]) => key).sort(), files.sort());
});

test("Every Level 1 lecture uses a distinct cleaned public Wix PDF URL", () => {
  const values = levelOne.map(([,value]) => value);
  assert.equal(new Set(values).size, 45);
  for (const url of values) {
    assert.match(url, /^https:\\/\\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\\.usrfiles\\.com\\/ugd\\/78042f_[a-z0-9]+\\.pdf$/);
  }
  const relativePaths = [...lessonData.matchAll(/\\["[^"]+", "([^"]+\\.pdf)"\\]/g)].map(m => prefix + m[1]);
  assert.equal(relativePaths.length, 46, "Crawl Slowly Basic and Optimized share one lecture");
  assert.deepEqual(new Set(relativePaths), new Set(levelOne.map(([key])=>key)));
});

test("Learning is Wix-first while Building fallback navigation stays unchanged", () => {
  assert.doesNotMatch(resolver, /if \\(level === 1\\) return localUrl/);
  assert.match(resolver, /return levelOneToThreeWixPdfUrls\\[path\\] \\?\\? localUrl/);
  assert.match(resolver, /return levelOneToThreeWixPdfUrls\\[filename\\] \\?\\? "\\/" \\+ encodeURIComponent\\(filename\\)/);
  assert.match(lessonData, /url: buildingManual\\.url/);
  assert.match(lessonData, /LEVEL_ONE_BUILDING_PDF_LEARNING_FALLBACK_IDS/);
});

test("Postbuild excludes exactly Wix-backed Level 1 Learning copies, not source PDFs", () => {
  assert.match(pruner, /levelOneLearningPaths\\.length !== 45/);
  assert.match(pruner, /paths\\.push\\(\\.\\.\\.levelOneLearningPaths\\)/);
  assert.match(pruner, /"\\.output\\/public"/);
  assert.match(pruner, /"\\.vercel\\/output\\/static"/);
  assert.match(pruner, /Never modifies public\\/ source files/);
});
