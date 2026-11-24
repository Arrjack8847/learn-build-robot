import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const load = path => readFileSync(new URL(path, import.meta.url), "utf8");
const registrySource = load("../src/data/levelFiveSixContent.ts");
const urlsSource = load("../src/data/levelSixWixPdfUrls.ts");
const lessonsMatch = registrySource.match(/export const levelFiveSixLessons: readonly AdvancedLessonAsset\[\] = (\[[\s\S]*?\]);/);
const urlsMatch = urlsSource.match(/export const levelSixWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/);
assert.ok(lessonsMatch, "Level 5–6 lesson registry should remain parseable");
assert.ok(urlsMatch, "Level 6 Wix URL map should remain parseable");
const lessons = JSON.parse(lessonsMatch[1]);
const wixUrls = JSON.parse(urlsMatch[1]);

test("Level 6 Wix PDF URLs match each registered Learning and Building variant exactly", () => {
  const expected = lessons.filter(lesson => lesson.level === 6)
    .flatMap(lesson => [lesson.learningPdf, lesson.buildingBasic, lesson.buildingOptimized].filter(Boolean));
  assert.equal(expected.length, 84);
  assert.equal(Object.keys(wixUrls).length, 84);
  assert.deepEqual(Object.keys(wixUrls).sort(), expected.sort());
  assert.equal(new Set(Object.values(wixUrls)).size, 84);
  for (const [path, url] of Object.entries(wixUrls)) {
    assert.match(path, /^Level 6\/(Learning|Building)\//);
    assert.match(url, /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf$/);
  }
});

test("Level 6 Wix lookup is connected to the shared PDF resolver", () => {
  assert.match(registrySource, /import \{ levelSixWixPdfUrls \} from "\.\/levelSixWixPdfUrls";/);
  assert.match(registrySource, /const wixUrl = levelFiveWixPdfUrls\[path\] \?\? levelSixWixPdfUrls\[path\];/);
  assert.match(registrySource, /if \(path\.toLowerCase\(\)\.endsWith\("\.pdf"\)\) return requireWixPdfUrl\(path, wixUrl\);/);
  assert.match(registrySource, /if \(wixUrl\) return wixUrl;/);
  assert.match(registrySource, /return base \? base \+ "\/" \+ encodePath\("public\/" \+ path\) : "\/" \+ encodePath\(path\);/);
});

test("All 43 Level 6 Learning PDFs point to distinct cleaned Wix uploads", () => {
  const learning = Object.entries(wixUrls).filter(([path]) => path.startsWith("Level 6/Learning/"));
  assert.equal(learning.length, 43);
  assert.equal(new Set(learning.map(([, url]) => url)).size, 43);
  for (const [path, url] of learning) {
    assert.match(path, /\.pdf$/i);
    assert.match(url, /\/ugd\/78042f_[a-z0-9]+\.pdf$/);
  }
});
