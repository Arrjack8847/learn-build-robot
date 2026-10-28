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
