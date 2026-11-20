import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = p => readFileSync(new URL(p, import.meta.url), "utf8");
const source = read("../src/data/levelFiveSixContent.ts");
const urlSource = read("../src/data/levelFiveWixPdfUrls.ts");
const registryMatch = source.match(/export const levelFiveSixLessons: readonly AdvancedLessonAsset\[\] = (\[[\s\S]*?\]);/);
const urlMatch = urlSource.match(/export const levelFiveWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/);
assert.ok(registryMatch);
assert.ok(urlMatch);
const lessons = JSON.parse(registryMatch[1]);
const links = JSON.parse(urlMatch[1]);
test("All 96 Level 5 PDFs have precisely one Wix URL mapping", () => {
  const expected = lessons.filter(x => x.level === 5)
    .flatMap(x => [x.learningPdf, x.buildingBasic, x.buildingOptimized].filter(Boolean));
  assert.equal(expected.length, 96);
  assert.deepEqual(Object.keys(links).sort(), expected.sort());
  assert.equal(new Set(Object.values(links)).size, 96);
  for (const url of Object.values(links)) {
    assert.match(url, /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf$/);
  }
});
test("Level 5 and Level 6 Wix URLs are routed before local fallback", () => {
  assert.match(source, /const wixUrl = levelFiveWixPdfUrls\[path\] \?\? levelSixWixPdfUrls\[path\];/);
});

const fingerprint = entries => {
  const sorted = entries.slice().sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  const text = sorted.map(([path, url]) => path + "\0" + url).join("\n");
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
};

test("Level 5 Learning PDF routes use all 51 approved cleaned Wix files", () => {
  const learning = Object.entries(links).filter(([path]) => path.startsWith("Level 5/Learning/"));
  assert.equal(learning.length, 51);
  assert.equal(new Set(learning.map(([, url]) => url)).size, 51);
  for (const [path, url] of learning) {
    assert.match(path, /^Level 5\/Learning\/.+\.pdf$/i);
    assert.match(url, /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/78042f_[a-z0-9]+\.pdf$/);
  }
  assert.equal(fingerprint(learning), "89e26ddd");
});

test("Level 5 Building PDF links retain the pre-migration Wix URLs", () => {
  const building = Object.entries(links).filter(([path]) => path.startsWith("Level 5/Building/"));
  assert.equal(building.length, 45);
  assert.equal(fingerprint(building), "124907ac");
});

test("postbuild prune is limited to Wix-backed Learning copies and audited Building paths", () => {
  const prune = read("../scripts/pdf/prune-wix-building-from-output.mjs");
  assert.match(prune, /levelFiveLearningPaths\.length !== 51/);
  assert.match(prune, /paths\.push\(\.\.\.levelFiveLearningPaths\)/);
  assert.match(prune, /const outputFolders = \[/);
});
