#!/usr/bin/env node
/**
 * Extract the fifteen Level 2 Building PDFs reused by Learning Studio.
 * Keep this independent of the shared quiz manifest and project registry.
 * This is source RESEARCH, not automated question publication.
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const root = resolve(import.meta.dirname, "../../../..");
const audit = JSON.parse(await readFile(join(import.meta.dirname, "source-audit.json"), "utf8"));
const projects = audit.projects.filter(p => p.sourceType === "building-pdf-learning-fallback");
if (projects.length !== 15) throw new Error("Expected 15 Level 2 Building-only Learning sources");
const dest = join(root, "quiz-research");
await mkdir(dest, { recursive: true });
let failures = 0;
for (const project of projects) {
  let pdf;
  try {
    const bytes = await readFile(join(root, project.sourcePdfPath));
    pdf = await getDocument({ data: new Uint8Array(bytes), useSystemFonts: true, disableFontFace: true }).promise;
    const slides = [];
    for (let slide = 1; slide <= pdf.numPages; slide++) {
      const page = await pdf.getPage(slide);
      const extracted = await page.getTextContent();
      const text = extracted.items.map(item => "str" in item ? String(item.str) : "").filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
      slides.push({ slide, text, needsVisualReview: text.length < 70 });
      page.cleanup();
    }
    await writeFile(join(dest, project.projectId + ".json"), JSON.stringify({
      projectId: project.projectId,
      level: 2,
      sourcePath: project.sourcePdfPath,
      sourceKind: "Building PDF reused in Learning Studio",
      pageCount: pdf.numPages,
      slides,
      reviewed: false,
      note: "The Building-only source may contain assembly diagrams instead of five teachable objectives. Visual inspection and objective sufficiency are required before authoring a quiz.",
    }, null, 2) + "\n");
    console.log(project.projectId, pdf.numPages, "pages,", slides.filter(x => x.needsVisualReview).length, "visual-review flags");
  } catch (error) {
    failures++;
    console.error(project.projectId, error instanceof Error ? error.message : String(error));
  } finally {
    if (pdf) await pdf.destroy();
  }
}
console.log("Building-fallback extraction:", projects.length - failures, "/", projects.length);
if (failures) process.exitCode = 1;
