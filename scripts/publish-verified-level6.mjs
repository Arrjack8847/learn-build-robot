#!/usr/bin/env node
/**
 * Evidence-gated Level 6 Quiz Studio integration.
 * Audits candidate bank files by default; --write registers only approved banks.
 * Never create fictitious review evidence to make a quiz publishable.
 */
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { validateQuizBank, getQuizBank } from "../src/data/quizStudio.ts";

const root = resolve(import.meta.dirname, "..");
const dir = join(root, "src/data/quizBanks/level6");
const manifest = JSON.parse(await readFile(join(root, "scripts/quiz-learning-source-manifest.json"), "utf8"));
const sources = new Map(manifest.sources.filter(s => s.level === 6).map(s => [s.projectId, s]));
const published = [...sources.keys()].filter(id => getQuizBank(id));
const approved = [];
const blocked = [];
let badApproval = false;

for (const file of (await readdir(dir)).filter(n => n.endsWith(".ts") && n !== "index.ts").sort()) {
  const entries = Object.entries(await import(pathToFileURL(join(dir, file)).href))
    .filter(([, bank]) => bank && typeof bank === "object" && typeof bank.projectId === "string" && Array.isArray(bank.questions));
  if (entries.length !== 1) { blocked.push({ file, reason: "Expected one exported QuizBank" }); continue; }
  const [exportName, bank] = entries[0];
  if (published.includes(bank.projectId)) continue;
  const source = sources.get(bank.projectId);
  if (!source) { blocked.push({ file, reason: "Unregistered Level 6 project" }); continue; }
  const errors = validateQuizBank(bank);
  if (bank.sourcePdfPath !== source.sourcePath) errors.push("Source path does not match curriculum manifest");
  let review = null, extraction = null;
  try { review = JSON.parse(await readFile(join(dir, "evidence", bank.projectId + ".approved.json"), "utf8")); }
  catch { errors.push("No question-by-question approved evidence"); }
  try { extraction = JSON.parse(await readFile(join(root, "quiz-research", bank.projectId + ".json"), "utf8")); }
  catch { errors.push("No original page-by-page Learning PDF extraction"); }
  if (review && extraction) {
    if (review.reviewVersion !== 1 || review.projectId !== bank.projectId ||
        review.sourcePdfPath !== source.sourcePath || extraction.sourcePath !== source.sourcePath ||
        review.sourcePageCount !== bank.sourcePageCount || extraction.pageCount !== bank.sourcePageCount) {
      errors.push("Source review and original extraction disagree");
    }
    const citations = Array.isArray(review.questionEvidence) ? review.questionEvidence : [];
    const evidence = new Map(citations.map(item => [item.id, item]));
    if (evidence.size !== 10 || citations.length !== 10) errors.push("Review must cover exactly ten distinct question IDs");
    for (const question of bank.questions) {
      const item = evidence.get(question.id);
      const page = extraction.slides?.find(p => p.slide === question.learningSlide);
      if (!item || item.slide !== question.learningSlide ||
          typeof item.rationale !== "string" || item.rationale.trim().length < 30) {
        errors.push(question.id + ": no detailed answer-and-slide verification");
      }
      if (!page) errors.push(question.id + ": page missing from PDF extraction");
      if (page?.needsVisualReview &&
          (typeof item?.visualEvidence !== "string" || item.visualEvidence.trim().length < 30)) {
        errors.push(question.id + ": image-heavy slide has no visual inspection record");
      }
    }
  }
  if (review && errors.length === 0) {
    try {
      const bytes = await readFile(join(root, source.sourcePath));
      if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") errors.push("Source file is not PDF");
      if (createHash("sha256").update(bytes).digest("hex") !== review.sourceSha256) errors.push("Original PDF SHA-256 mismatch");
      if (errors.length === 0) {
        const pdf = await getDocument({ data: new Uint8Array(bytes), useSystemFonts: true, disableFontFace: true }).promise;
        try { if (pdf.numPages !== bank.sourcePageCount) errors.push("Actual Learning PDF page total mismatch"); }
        finally { await pdf.destroy(); }
      }
    } catch (error) { errors.push("PDF read failed: " + String(error)); }
  }
  if (errors.length) {
    if (review) badApproval = true;
    blocked.push({ file, projectId: bank.projectId, errors });
  } else approved.push({ file, exportName, projectId: bank.projectId });
}
console.log(JSON.stringify({
  registered: sources.size,
  previouslyPlayable: published.length,
  newlyApproved: approved.length,
  remainingUnpublished: sources.size - published.length - approved.length,
  approved: approved.map(x => x.projectId),
  blocked,
}, null, 2));

if (process.argv.includes("--write") && approved.length) {
  const target = join(root, "src/data/quizStudio.ts");
  let text = await readFile(target, "utf8");
  const mergeBlock = (body, startTag, endTag, additions, anchor) => {
    if (body.includes(startTag)) {
      const begin = body.indexOf(startTag);
      const finish = body.indexOf(endTag, begin);
      if (finish === -1) throw new Error("Unclosed generated block: " + startTag);
      const old = body.slice(begin + startTag.length, finish).split("\n").map(v => v.trim()).filter(Boolean);
      const merged = [...new Set([...old, ...additions])];
      return body.slice(0, begin) + startTag + "\n" + merged.join("\n") + "\n" + endTag +
        body.slice(finish + endTag.length);
    }
    if (!body.includes(anchor)) throw new Error("Missing Quiz Studio insertion anchor");
    return body.replace(anchor, startTag + "\n" + additions.join("\n") + "\n" + endTag + "\n\n" + anchor);
  };
  const imports = approved.map(b => 'import { ' + b.exportName + ' } from "./quizBanks/level6/' + b.file + '";');
  const mappings = approved.map(b => "  [" + b.exportName + ".projectId]: " + b.exportName + ",");
  text = mergeBlock(text, "// BEGIN VERIFIED LEVEL 6 BANK IMPORTS (generated)",
    "// END VERIFIED LEVEL 6 BANK IMPORTS", imports, "export type GearDiagram");
  text = mergeBlock(text, "  // BEGIN VERIFIED LEVEL 6 BANKS (generated)",
    "  // END VERIFIED LEVEL 6 BANKS", mappings, "  [bigHeadRobotBank.projectId]: bigHeadRobotBank,");
  await writeFile(target, text, "utf8");
  console.log("New verified Level 6 banks integrated: " + approved.length);
} else if (process.argv.includes("--write")) {
  console.log("No source-approved banks; shared Quiz Studio unchanged.");
}
if (badApproval) process.exitCode = 1;
