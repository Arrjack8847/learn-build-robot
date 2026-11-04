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
test("Level 5 Learning PDFs resolve locally while Building PDFs retain Wix", () => {
  const match = source.match(/function publicUrl\(path: string\): string \{([\s\S]*?)\n\}\nfunction curriculumUrl/);
  assert.ok(match, "Shared resolver body is present");
  const resolve = new Function("path", "levelFiveWixPdfUrls", "levelSixWixPdfUrls", "assetBase", "encodePath", match[1]);
  const levelSixSource = read("../src/data/levelSixWixPdfUrls.ts");
  const levelSixMatch = levelSixSource.match(/export const levelSixWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/);
  assert.ok(levelSixMatch);
  const levelSixLinks = JSON.parse(levelSixMatch[1]);
  const encoded = path => path.split("/").map(encodeURIComponent).join("/");
  const urlFor = (path, base = null) => resolve(path, links, levelSixLinks, () => base, encoded);
  const learning = lessons.filter(x => x.level === 5);
  assert.equal(learning.length, 51);
  for (const lesson of learning) {
    assert.equal(urlFor(lesson.learningPdf), "/" + encoded(lesson.learningPdf).replace(/%26/gi, "&"), lesson.id + " should use cleaned local Learning PDF");
    assert.equal(urlFor(lesson.learningPdf, "https://assets.example.test"), "/" + encoded(lesson.learningPdf).replace(/%26/gi, "&"), lesson.id + " must never fall back to old Wix");
    for (const manual of [lesson.buildingBasic, lesson.buildingOptimized].filter(Boolean)) {
      assert.equal(urlFor(manual), links[manual], lesson.id + " Building manual must remain on Wix");
    }
  }
  const ampersandPath = learning.find(lesson => lesson.learningPdf.includes("&"));
  assert.ok(ampersandPath, "At least one category contains an ampersand");
  assert.match(urlFor(ampersandPath.learningPdf), /&/, "Literal ampersands avoid Vite static-file 404s");
  assert.doesNotMatch(urlFor(ampersandPath.learningPdf), /%26/i);
  for (const lesson of lessons.filter(x => x.level === 6)) {
    for (const pdf of [lesson.learningPdf, lesson.buildingBasic, lesson.buildingOptimized].filter(Boolean)) {
      assert.equal(urlFor(pdf), levelSixLinks[pdf], lesson.id + " Level 6 PDF must remain on Wix");
    }
  }
  assert.equal(urlFor("Level 5/NonPDF/example.sb3"), "/Level%205/NonPDF/example.sb3", "Non-PDF assets retain fallback behavior");
  assert.equal(urlFor("Level 5/NonPDF/example.sb3", "https://assets.example.test"), "https://assets.example.test/public/Level%205/NonPDF/example.sb3");
  assert.match(source, /const wixUrl = levelSixWixPdfUrls\[path\];/);
  assert.match(source, /const levelFiveWixUrl = levelFiveWixPdfUrls\[path\];/);
});
