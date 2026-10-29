#!/usr/bin/env node
/**
 * Extract source text from the fourteen official Building PDFs reused in Level 1 Learning.
 * The pages may be mostly diagrams. Never invent quiz content from empty extraction.
 *
 * Run:
 *   npm run quiz:extract-level1-phase3
 * Optional, only when local PDFs are missing:
 *   node scripts/extract-phase3-level1-building-slides.mjs --allow-hosted
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const root = resolve(import.meta.dirname, "..");
const data = JSON.parse(await readFile(join(root, "scripts", "level1-quiz-phase3-building-sources.json"), "utf8"));
const allowed = new Set(["--allow-hosted"]);
const args = process.argv.slice(2);
if (args.some(a => !allowed.has(a))) throw new Error("Unknown option. Supported: --allow-hosted");
const allowHosted = args.includes("--allow-hosted");
if (!Array.isArray(data.sources) || data.sources.length !== 14 ||
    new Set(data.sources.map(x => x.projectId)).size !== 14) {
  throw new Error("Expected fourteen unique, official Level 1 fallback-PDF sources");
}
const target = join(root, "quiz-research", "phase3");
await mkdir(target, { recursive: true });
const summary = [];
for (const [index, source] of data.sources.entries()) {
  console.log("\n[" + (index + 1) + "/14] " + source.projectId);
  let pdf;
  try {
    if (source.level !== 1 || source.sourceKind !== "official-building-manual-learning-fallback" ||
        !source.sourcePath.startsWith("public/") || !source.sourcePath.endsWith(".pdf")) {
      throw new Error("Invalid source record: " + source.projectId);
    }
    let bytes;
    const path = join(root, source.sourcePath);
    try {
      bytes = await readFile(path);
      console.log("  Local official Building PDF: " + source.sourcePath);
    } catch (error) {
      if (!allowHosted) throw new Error("Missing local PDF: " + path + " (pass --allow-hosted to try the registered URL)");
      if (!source.url.startsWith("https://")) throw new Error("No trusted hosted PDF URL");
      const response = await fetch(source.url, { signal: AbortSignal.timeout(120000) });
      if (!response.ok) throw new Error("Hosted source returned HTTP " + response.status);
      bytes = new Uint8Array(await response.arrayBuffer());
    }
    if (bytes.byteLength < 5 || bytes.byteLength > 50 * 1024 * 1024 ||
        String.fromCharCode(...bytes.subarray(0, 4)) !== "%PDF") {
      throw new Error("Missing, oversized, or invalid PDF bytes: " + source.projectId);
    }
    pdf = await getDocument({ data: new Uint8Array(bytes), useSystemFonts: true, disableFontFace: true }).promise;
    const slides = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const text = (await page.getTextContent()).items
        .map(item => "str" in item ? String(item.str) : "")
        .filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
      slides.push({ slide: n, text, needsVisualReview: text.length < 70 });
      page.cleanup();
    }
    const needsVisualReview = slides.filter(x => x.needsVisualReview).length;
    const textCharacters = slides.reduce((n, s) => n + s.text.length, 0);
    const report = {
      projectId: source.projectId,
      level: 1,
      sourcePath: source.sourcePath,
      sourceUrl: source.url,
      sourceKind: source.sourceKind,
      pageCount: pdf.numPages,
      textCharacters,
      slides,
      reviewed: false,
      note: "Building-manual images and assembly steps must be visually reviewed. Text extraction alone may not support five different teaching objectives. Do NOT invent questions or slide references.",
    };
    await writeFile(join(target, source.projectId + ".json"), JSON.stringify(report, null, 2) + "\n");
    console.log("  Extracted " + pdf.numPages + " pages, " + textCharacters +
      " text characters; " + needsVisualReview + " pages require visual review");
    summary.push({ projectId: source.projectId, status: "extracted",
      pageCount: pdf.numPages, textCharacters, needsVisualReview });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("  FAILED: " + message);
    summary.push({ projectId: source.projectId, status: "error", error: message });
  } finally {
    if (pdf) await pdf.destroy();
  }
}
await writeFile(join(target, "phase3-extraction-summary.json"), JSON.stringify(summary, null, 2) + "\n");
const successes = summary.filter(item => item.status === "extracted").length;
console.log("\nLevel 1 Phase 3 Building PDFs extracted: " + successes + " / 14");
console.log("Research: quiz-research/phase3/<projectId>.json");
if (successes !== 14) process.exitCode = 1;
