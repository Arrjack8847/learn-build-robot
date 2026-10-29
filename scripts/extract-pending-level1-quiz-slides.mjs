#!/usr/bin/env node
/**
 * One-command extraction of the 19 indexed, pending Level 1 Learning PDFs.
 * This produces local, UNREVIEWED page-text research; it never publishes quizzes.
 * Usage:
 *   npm run quiz:extract-level1
 *   node scripts/extract-pending-level1-quiz-slides.mjs --allow-hosted
 */
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const status = JSON.parse(await readFile(join(root, "scripts", "level1-quiz-status.json"), "utf8"));
const manifest = JSON.parse(await readFile(join(root, "scripts", "quiz-learning-source-manifest.json"), "utf8"));
const allowHosted = process.argv.slice(2).includes("--allow-hosted");
const projects = status.pendingWithIndexedLearningPdf;
if (!Array.isArray(projects) || !Array.isArray(manifest.sources) || projects.length !== 19) {
  throw new Error("Pending Level 1 indexed-PDF queue has changed; re-audit before extraction.");
}
const unique = new Set(projects.map(item => item.projectId));
if (unique.size !== projects.length) throw new Error("Duplicate project in Level 1 pending queue.");
for (const item of projects) {
  const sources = manifest.sources.filter(source => source.level === 1 && source.projectId === item.projectId);
  if (sources.length !== 1 || sources[0].sourcePath !== item.sourcePdfPath) {
    throw new Error("Indexed Learning PDF mismatch for " + item.projectId);
  }
}

let succeeded = 0;
const failed = [];
for (const [index, item] of projects.entries()) {
  console.log("\n[" + (index + 1) + "/" + projects.length + "] Extracting " + item.projectId);
  const command = [
    join(root, "scripts", "extract-quiz-slides.mjs"),
    "--project", item.projectId,
    ...(!allowHosted ? ["--local-only"] : []),
  ];
  const exitCode = await new Promise((resolveCode, reject) => {
    const child = spawn(process.execPath, command, { cwd: root, stdio: "inherit" });
    child.once("error", reject);
    child.once("close", code => resolveCode(code ?? 1));
  });
  if (exitCode === 0) succeeded++;
  else failed.push(item.projectId);
}
console.log("\nLevel 1 indexed Learning PDFs extracted:", succeeded, "/", projects.length);
if (failed.length) {
  console.error("Unextracted source PDFs:", failed.join(", "));
  process.exitCode = 1;
} else {
  console.log("Research saved in quiz-research/<projectId>.json. Human PDF and diagram review is still required.");
}
