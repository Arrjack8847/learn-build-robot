#!/usr/bin/env node
/**
 * Final safety net: never ship PDF binaries in generated web build output.
 *
 * The app resolves all course PDFs through Wix. This script only removes copies
 * inside generated build folders, never PDFs in public/ or elsewhere in source.
 * It also refuses to follow symlinks while walking output directories.
 */
import { existsSync, lstatSync, readdirSync, unlinkSync } from "node:fs";
import { basename, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../../", import.meta.url)));
const outputDirs = [
  ".output/public",
  ".output/server/public",
  "dist",
  "build/client",
  ".vercel/output/static",
];
const removed = [];

function visit(entry) {
  const stat = lstatSync(entry);
  if (stat.isSymbolicLink()) return; // Never traverse links outside the build.
  if (stat.isDirectory()) {
    for (const child of readdirSync(entry)) {
      visit(resolve(entry, child));
    }
    return;
  }
  if (stat.isFile() && /\.pdf$/i.test(basename(entry))) {
    unlinkSync(entry);
    removed.push(relative(root, entry));
  }
}

for (const dir of outputDirs) {
  const absolute = resolve(root, dir);
  if (!absolute.startsWith(root + sep)) {
    throw new Error("Unsafe PDF output directory: " + dir);
  }
  if (existsSync(absolute)) visit(absolute);
}

// Detect any accidentally retained PDF after pruning, without touching source.
function countPdfs(entry) {
  const stat = lstatSync(entry);
  if (stat.isSymbolicLink()) return 0;
  if (stat.isDirectory()) {
    return readdirSync(entry).reduce(
      (total, child) => total + countPdfs(resolve(entry, child)), 0,
    );
  }
  return stat.isFile() && /\.pdf$/i.test(basename(entry)) ? 1 : 0;
}
const remaining = outputDirs.reduce((total, dir) => {
  const absolute = resolve(root, dir);
  return total + (existsSync(absolute) ? countPdfs(absolute) : 0);
}, 0);
if (remaining !== 0) {
  throw new Error("PDF-free build verification failed: " + remaining + " PDF files remain");
}
console.log(
  "[Wix-only PDF build] Removed " + removed.length +
  " copied PDF files; zero PDFs remain in generated web output.",
);
