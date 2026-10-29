#!/usr/bin/env node
/**
 * Create NON-PUBLISHED Level 1 quiz-bank drafts from the registered syllabus.
 * Question content and slide numbers must be authored from the actual PDF.
 *
 * Usage:
 *   node scripts/scaffold-level1-quiz.mjs --project ferocious-snake
 *   node scripts/scaffold-level1-quiz.mjs --all-indexed
 *
 * Never edits an existing bank, source PDF, or quiz registry.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const requestedId = args.length === 2 && args[0] === "--project" ? args[1] : null;
const allIndexed = args.length === 1 && args[0] === "--all-indexed";

if (args.length === 1 && args[0] === "--help") {
  console.log("Usage: node scripts/scaffold-level1-quiz.mjs --project <project-id> | --all-indexed");
  process.exit(0);
}
if ((!requestedId && !allIndexed) || (requestedId && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(requestedId))) {
  console.error("Usage: node scripts/scaffold-level1-quiz.mjs --project <project-id> | --all-indexed");
  process.exit(2);
}

const status = JSON.parse(await readFile(join(root, "scripts", "level1-quiz-status.json"), "utf8"));
const manifest = JSON.parse(await readFile(join(root, "scripts", "quiz-learning-source-manifest.json"), "utf8"));
const pendingIndexed = status.pendingWithIndexedLearningPdf;
const pendingUnindexed = status.pendingWithoutIndexedLearningPdf;

if (!Array.isArray(pendingIndexed) || !Array.isArray(pendingUnindexed) || !Array.isArray(manifest.sources)) {
  throw new Error("Missing or malformed Level 1 status/source manifest.");
}

if (requestedId && status.completed.some(item => item.projectId === requestedId)) {
  throw new Error(requestedId + " already has an authored quiz. Do not overwrite it.");
}
if (requestedId && pendingUnindexed.some(item => item.projectId === requestedId)) {
  throw new Error(requestedId + " has no indexed Learning PDF. Inspect the official Building/Learning source before scaffolding.");
}

const candidates = allIndexed ? pendingIndexed : pendingIndexed.filter(item => item.projectId === requestedId);
if (!candidates.length) {
  throw new Error("Unknown or non-pending indexed Level 1 project: " + requestedId);
}

function toCamelCase(id) {
  return id.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function generateDraft(item, source) {
  const symbol = toCamelCase(item.projectId) + "Bank";
  const questions = Array.from({ length: 10 }, (_, index) => {
    const indexLabel = String(index + 1).padStart(2, "0");
    const objective = Math.floor(index / 2) + 1;
    return [
      "    {",
      "      id: " + JSON.stringify(item.projectId + "-" + indexLabel) + ",",
      "      topic: " + JSON.stringify("objective-" + objective) + ",",
      '      prompt: "TODO: write a question supported by the verified slide",',
      '      choices: ["TODO choice A", "TODO choice B", "TODO choice C", "TODO choice D"],',
      "      correctIndex: -1, // TODO: choose 0, 1, 2, or 3 from source evidence",
      "      learningSlide: 0, // TODO: verified 1-based Learning PDF page",
      '      explanation: "TODO: explain why the answer is correct",',
      '      hint: "TODO: provide a clue without revealing the answer",',
      "    },",
    ].join("\n");
  }).join("\n");

  return [
    "/**",
    " * UNREVIEWED DRAFT — do not import into quizStudio.ts or publish.",
    " * Read the actual PDF, including diagrams, before filling any answers.",
    " * A valid bank has 5 objectives, 2 questions per objective (10 total).",
    " */",
    'import type { QuizBank } from "../quizStudio";',
    "",
    "export const " + symbol + ": QuizBank = {",
    "  projectId: " + JSON.stringify(item.projectId) + ",",
    "  title: " + JSON.stringify(item.title) + ",",
    "  sourcePdfPath: " + JSON.stringify(source.sourcePath) + ",",
    "  sourcePageCount: 0, // TODO: open the PDF and verify actual page count",
    "  questions: [",
    questions,
    "  ],",
    "};",
    "",
  ].join("\n");
}

for (const item of candidates) {
  const matches = manifest.sources.filter(source => source.level === 1 && source.projectId === item.projectId);
  if (matches.length !== 1 || matches[0].sourcePath !== item.sourcePdfPath) {
    throw new Error("Missing/ambiguous source manifest mapping for " + item.projectId);
  }
  const outputPath = join(root, "src", "data", "quizBanks", toCamelCase(item.projectId) + ".ts");
  try {
    await writeFile(outputPath, generateDraft(item, matches[0]), { flag: "wx" });
    console.log("Created UNPUBLISHED quiz draft:", outputPath);
  } catch (error) {
    if (error?.code === "EEXIST") {
      throw new Error("Refusing to overwrite existing quiz file: " + outputPath);
    }
    throw error;
  }
}
console.log("Drafts only: verify all PDF pages, replace every TODO, run npm run test:quiz, then register reviewed banks manually.");
