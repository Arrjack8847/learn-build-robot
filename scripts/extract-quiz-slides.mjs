#!/usr/bin/env node
/**
 * Extract real Learning-slide text for the six-level Quiz Studio authoring queue.
 * This script NEVER generates or publishes questions, guesses slide references,
 * or modifies curriculum PDFs. Pages that have little text require visual review.
 *
 * Usage:
 *   node scripts/extract-quiz-slides.mjs --project level-2-axe-robot
 *   node scripts/extract-quiz-slides.mjs --level 3 --limit 5
 *   node scripts/extract-quiz-slides.mjs --all --limit 20
 *   node scripts/extract-quiz-slides.mjs --project acceleration-car --local-only
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const root = resolve(import.meta.dirname, "..");
const manifestFile = join(root, "scripts", "quiz-learning-source-manifest.json");
const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
const args = process.argv.slice(2);
const valueAfter = flag => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};

const projectId = valueAfter("--project");
const levelArg = valueAfter("--level");
const limitArg = valueAfter("--limit");
const all = args.includes("--all");
const localOnly = args.includes("--local-only");
if (!projectId && !levelArg && !all) {
  console.error("Select --project <id>, --level <1-6>, or --all. Try --limit 5 for a sample.");
  process.exit(2);
}

const level = levelArg === undefined ? null : Number(levelArg);
if (levelArg !== undefined && (!Number.isInteger(level) || level < 1 || level > 6)) {
  throw new Error("--level must be between 1 and 6");
}
const limit = limitArg === undefined ? (all || level !== null ? 5 : Infinity) : Number(limitArg);
if (Number.isNaN(limit) || limit < 1 || !Number.isInteger(limit)) throw new Error("--limit must be a positive integer");

let entries = manifest.sources;
if (projectId) entries = entries.filter(entry => entry.projectId === projectId);
if (level !== null) entries = entries.filter(entry => entry.level === level);
if (!entries.length) throw new Error("No source registered for the selected project or level");
entries = entries.slice(0, limit);

const target = resolve(root, "quiz-research");
await mkdir(target, { recursive: true });
const results = [];

for (const entry of entries) {
  console.log("Reviewing source:", "Level " + entry.level, entry.projectId);
  let pdf = null;
  try {
    let bytes;
    const path = join(root, entry.sourcePath);
    try {
      bytes = await readFile(path);
      console.log("  Reading local curriculum file");
    } catch (cause) {
      if (localOnly) throw new Error("Local PDF missing: " + path);
      if (!entry.url || !entry.url.startsWith("https://")) throw new Error("No trusted HTTPS source URL registered");
      const response = await fetch(entry.url, { signal: AbortSignal.timeout(120000) });
      if (!response.ok) throw new Error("Remote PDF returned HTTP " + response.status);
      const contentLength = Number(response.headers.get("content-length") ?? "0");
      if (contentLength > 50 * 1024 * 1024) throw new Error("PDF exceeds 50 MiB size limit");
      bytes = new Uint8Array(await response.arrayBuffer());
      console.log("  Reading registered hosted PDF; bytes:", bytes.byteLength);
    }
    if (bytes.byteLength > 50 * 1024 * 1024) throw new Error("PDF exceeds 50 MiB size limit");

    const load = getDocument({ data: new Uint8Array(bytes), useSystemFonts: true, disableFontFace: true });
    pdf = await load.promise;
    const pages = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const data = await page.getTextContent();
      const text = data.items
        .map(item => "str" in item ? String(item.str) : "")
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      pages.push({ slide: n, text, needsVisualReview: text.length < 70 });
      page.cleanup();
    }
    const report = {
      projectId: entry.projectId,
      level: entry.level,
      sourcePath: entry.sourcePath,
      sourceUrl: entry.url,
      pageCount: pdf.numPages,
      slides: pages,
      reviewed: false,
      note: "Extracted text is evidence for authoring, not proof that a quiz item is correct. Inspect images, diagrams and ambiguous translated text before publication.",
    };
    const dest = join(target, entry.projectId + ".json");
    await writeFile(dest, JSON.stringify(report, null, 2) + "\n", "utf8");
    const warningCount = pages.filter(page => page.needsVisualReview).length;
    console.log("  Wrote:", dest, "(" + pages.length + " slides,", warningCount + " pages needing visual review)");
    results.push({ id: entry.projectId, status: "extracted", pageCount: pages.length, needsVisualReview: warningCount });
  } catch (error) {
    console.error("  FAILED:", error instanceof Error ? error.message : String(error));
    results.push({ id: entry.projectId, status: "error", error: String(error) });
  } finally {
    if (pdf) await pdf.destroy();
  }
}

await writeFile(join(target, "latest-extraction-summary.json"), JSON.stringify(results, null, 2) + "\n", "utf8");
console.log("\nExtracted:", results.filter(item => item.status === "extracted").length, "/", results.length);
if (results.some(item => item.status === "error")) process.exitCode = 1;
