#!/usr/bin/env node
/**
 * Read-only Level 6 coverage audit sourced from the actual Quiz Studio registry.
 * With --write, emits a generated queue for the slide-evidence renderer.
 * No unverified quiz is created or activated by this utility.
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getQuizBank } from "../src/data/quizStudio.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(join(root, "scripts/quiz-learning-source-manifest.json"), "utf8"));
const level6 = manifest.sources.filter(item => item.level === 6);
if (level6.length !== 43 || new Set(level6.map(item => item.projectId)).size !== level6.length) {
  throw new Error("Unexpected or duplicate Level 6 syllabus entries; inspect the curriculum manifest.");
}

const publishedProjects = [];
const pendingProjects = [];
for (const source of level6) {
  const bank = getQuizBank(source.projectId);
  if (bank) {
    if (bank.sourcePdfPath !== source.sourcePath) {
      throw new Error(source.projectId + ": published bank source PDF disagrees with manifest.");
    }
    publishedProjects.push(source.projectId);
  } else {
    pendingProjects.push(source.projectId);
  }
}

const result = {
  level: 6,
  registered: level6.length,
  published: publishedProjects.length,
  remainingUnpublished: pendingProjects.length,
  publishedProjects,
  pendingProjects,
  note: "Registry/structural coverage only. Published does not mean PDF images, educational answers, build, or browser QA were independently verified."
};
if (process.argv.includes("--write")) {
  const path = join(root, "quiz-research/level6-coverage.json");
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(result, null, 2) + "\n", "utf8");
}
process.stdout.write(JSON.stringify(result, null, 2) + "\n");
