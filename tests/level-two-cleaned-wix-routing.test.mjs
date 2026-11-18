import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Level 2-only release routing checks. Run locally with:
// node --test tests/level-two-cleaned-wix-routing.test.mjs
// Never relies on GitHub Actions.
const root = fileURLToPath(new URL("../", import.meta.url));
const read = path => readFileSync(resolve(root, path), "utf8");
const source = read("src/data/levelOneToThreeWixPdfUrls.ts");
const matched = source.match(/export const levelOneToThreeWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/);
assert.ok(matched, "PDF URL registry must be parseable");
const urls = JSON.parse(matched[1]);

const prefix = "Level 2/Learning/";
const buildingFallback = prefix +
  "Mechanisms & Simulators/Double Beam Crane/Double beam crane_Building_Powerpoint.pdf";
const levelTwoKeys = Object.keys(urls).filter(path => path.startsWith(prefix));
const cleanedKeys = levelTwoKeys.filter(path => path !== buildingFallback);

function allPdfPaths(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? allPdfPaths(path) :
      entry.isFile() && entry.name.toLowerCase().endsWith(".pdf") ? [path] : [];
  });
}

test("Level 2 registry contains 43 cleaned Learning PDFs and one untouched Building fallback", () => {
  const sourceRoot = resolve(root, "public/Level 2/Learning");
  const diskKeys = allPdfPaths(sourceRoot).map(path =>
    prefix + relative(sourceRoot, path).replaceAll("\\", "/"));
  assert.equal(levelTwoKeys.length, 44);
  assert.equal(cleanedKeys.length, 43);
  assert.deepEqual(new Set(levelTwoKeys), new Set(diskKeys));
  assert.match(urls[buildingFallback], /\/ugd\/7fc4ca_[a-z0-9]+\.pdf$/);
});

test("Every eligible Level 2 Learning PDF routes to a distinct cleaned Wix upload", () => {
  const cleanedUrls = cleanedKeys.map(path => urls[path]);
  assert.equal(new Set(cleanedUrls).size, 43);
  for (const url of cleanedUrls) {
    assert.match(url,
      /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/78042f_[a-z0-9]+\.pdf$/);
  }
});

test("Level 2 uses shared Learning resolver; Building manual mappings remain separate", () => {
  const resolver = read("src/data/staticPdfUrl.ts");
  const levelTwo = read("src/data/levelTwoLectures.ts");
  assert.match(resolver, /return levelOneToThreeWixPdfUrls\[path\] \?\? localUrl/);
  assert.match(levelTwo, /levelOneToThreeLearningPdfUrl\(2, relativePath\)/);
  assert.match(levelTwo, /url: manual\.url/);
  assert.match(levelTwo, /LEVEL_TWO_BUILDING_PDF_LEARNING_FALLBACK_IDS/);
});
