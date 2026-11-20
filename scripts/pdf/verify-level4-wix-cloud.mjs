/**
 * Cloud-only Level 4 hosted PDF delivery audit.
 * Runs on an isolated Vercel preview build, never on production or GitHub Actions.
 * Does not mutate source files or Wix.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const urlsSource = readFileSync(resolve(root, "src/data/levelFourWixPdfUrls.ts"), "utf8");
const lessonsSource = readFileSync(resolve(root, "src/data/levelFourLearning.ts"), "utf8");
const match = urlsSource.match(/export const levelFourWixPdfUrls:[\s\S]*?=\s*(\{[\s\S]*?\});/);
assert.ok(match, "Wix URL map must be parseable");
const urls = JSON.parse(match[1]);
const lessons = [...lessonsSource.matchAll(/pageCount:\s*(\d+),\s*url:\s*publicPdfUrl\("([^"]+)"\)/g)]
  .map((found) => ({ pages: Number(found[1]), path: found[2], url: urls[found[2]] }));
const learningPaths = Object.keys(urls).filter((key) => !key.startsWith("Level 4/Building/"));
assert.equal(lessons.length, 56);
assert.equal(learningPaths.length, 56);
assert.equal(new Set(lessons.map((lesson) => lesson.path)).size, 56);
assert.equal(new Set(lessons.map((lesson) => lesson.url)).size, 56);
assert.equal(lessons.reduce((sum, lesson) => sum + lesson.pages, 0), 1346);
for (const lesson of lessons) {
  assert.ok(learningPaths.includes(lesson.path), lesson.path);
  assert.match(lesson.url, /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/78042f_[a-f0-9]{32}\.pdf$/);
}
const origin = "https://learn-build-robot.vercel.app";
async function verifyOne(lesson) {
  let lastError = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    let task;
    try {
      const response = await fetch(lesson.url, {
        headers: { Origin: origin },
        signal: AbortSignal.timeout(20000),
        redirect: "follow",
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const allowedOrigin = response.headers.get("access-control-allow-origin") ?? "";
      const cors = allowedOrigin === "*" || allowedOrigin === origin;
      const bytes = new Uint8Array(await response.arrayBuffer());
      const magic = new TextDecoder("ascii").decode(bytes.slice(0, 5));
      if (magic !== "%PDF-") throw new Error("Unexpected PDF magic " + magic);
      if (!cors) throw new Error("CORS did not allow " + origin + " (got " + allowedOrigin + ")");
      task = getDocument({ data: bytes, verbosity: 0, disableFontFace: true });
      const pdf = await task.promise;
      if (pdf.numPages !== lesson.pages) {
        throw new Error("PDF.js pages " + pdf.numPages + " != expected " + lesson.pages);
      }
      await task.destroy();
      return { path: lesson.path, ok: true, status: response.status, pages: pdf.numPages };
    } catch (error) {
      lastError = String(error?.message || error);
      try { await task?.destroy(); } catch {}
    }
  }
  return { path: lesson.path, ok: false, error: lastError };
}
const results = [];
for (let i = 0; i < lessons.length; i += 5) {
  results.push(...await Promise.all(lessons.slice(i, i + 5).map(verifyOne)));
}
const passed = results.filter((item) => item.ok);
const failed = results.filter((item) => !item.ok);
console.log("[Level4 Wix cloud QA] " + passed.length + "/56 PDF GET + CORS + PDF.js page count verified; expected 1346 pages.");
if (failed.length) {
  for (const f of failed) console.error("[Level4 Wix cloud QA FAIL] " + f.path + ": " + f.error);
  throw new Error("Level 4 hosted PDF smoke verification failed for " + failed.length + "/56 lessons");
}
console.log("[Level4 Wix cloud QA] ALL 56 HOSTED PDFS VERIFIED. No source PDF changes.");
