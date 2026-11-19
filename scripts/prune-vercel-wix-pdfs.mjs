#!/usr/bin/env node
/**
 * Keep Wix-hosted curriculum PDFs out of Vercel deployment output without
 * deleting or changing tracked source files. The .vercelignore file prevents
 * uploading the redundant PDFs; this provides a second defense when builds
 * start from a full Git checkout.
 *
 * Two exceptions remain local intentionally:
 * - Level 1/Learning: cleaned lessons may differ from older Wix copies.
 * - Level 4 (excluding Building): cleaned Learning slides are served locally.
 */
import { existsSync, readFileSync, readdirSync, statSync, rmSync } from "node:fs";
import { resolve, relative, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const mapFiles = [
  "src/data/levelOneToThreeWixPdfUrls.ts",
  "src/data/levelFourWixPdfUrls.ts",
  "src/data/levelFiveWixPdfUrls.ts",
  "src/data/levelSixWixPdfUrls.ts",
];

export function wixPdfLinks(repoRoot = root) {
  const result = new Map();
  for (const filename of mapFiles) {
    const input = readFileSync(join(repoRoot, filename), "utf8");
    const entries = input.matchAll(/^\s*"([^"\n]+\.pdf)"\s*:\s*"(https:\/\/[^"\n]+\.pdf)"\s*,?/gm);
    for (const [, pdfPath, url] of entries) {
      if (result.has(pdfPath) && result.get(pdfPath) !== url) {
        throw new Error("Conflicting Wix links for " + pdfPath);
      }
      result.set(pdfPath, url);
    }
  }
  return result;
}

export function isProtectedCleanedLearningPdf(pdfPath) {
  return pdfPath.startsWith("Level 1/Learning/") ||
    (pdfPath.startsWith("Level 4/") && !pdfPath.startsWith("Level 4/Building/"));
}

export function shouldExcludeWixPdf(pdfPath, links) {
  return pdfPath.toLowerCase().endsWith(".pdf") &&
    links.has(pdfPath) && !isProtectedCleanedLearningPdf(pdfPath);
}

function shouldHaveWixLink(pdfPath) {
  return pdfPath.toLowerCase().endsWith(".pdf") &&
    (pdfPath.indexOf("/") < 0 ||
      pdfPath.startsWith("Level 2/") ||
      pdfPath.startsWith("Level 3/") ||
      pdfPath.startsWith("Level 4/Building/") ||
      pdfPath.startsWith("Level 5/") ||
      pdfPath.startsWith("Level 6/"));
}

function walkPdfFiles(directory) {
  if (!existsSync(directory)) return [];
  const files = [];
  const queue = [directory];
  while (queue.length) {
    const next = queue.pop();
    for (const entry of readdirSync(next, { withFileTypes: true })) {
      const full = join(next, entry.name);
      if (entry.isDirectory()) queue.push(full);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) files.push(full);
    }
  }
  return files;
}

function pdfPathFromRoot(outputRoot, file) {
  return relative(outputRoot, file).split(sep).join("/");
}

function audit(links) {
  const publicDir = join(root, "public");
  const files = walkPdfFiles(publicDir);
  let excludedBytes = 0, protectedBytes = 0, excludedCount = 0, protectedCount = 0;
  for (const file of files) {
    const path = pdfPathFromRoot(publicDir, file);
    if (shouldHaveWixLink(path) && !links.has(path)) {
      throw new Error("Refusing to exclude a PDF without a verified Wix map entry: " + path);
    }
    if (shouldExcludeWixPdf(path, links)) {
      excludedCount++; excludedBytes += statSync(file).size;
    } else {
      protectedCount++; protectedBytes += statSync(file).size;
    }
  }
  if (links.size < 590) throw new Error("Expected at least 590 exact Wix PDF links; found " + links.size);
  console.log("[pdf-deploy] Source audit: " + links.size + " Wix links; " +
    excludedCount + " externally hosted PDFs (" + (excludedBytes / 1e6).toFixed(1) +
    " MB) can be excluded; " + protectedCount + " PDF files (" +
    (protectedBytes / 1e6).toFixed(1) + " MB) remain.");
}

function prune(links) {
  const roots = [
    ".vercel/output/static",
    ".output/public",
    "dist/client",
    "dist",
    "build/client",
  ];
  let removedCount = 0, removedBytes = 0, inspectedCount = 0;
  const seen = new Set();
  let foundOutput = false;
  for (const relRoot of roots) {
    const dir = join(root, relRoot);
    if (!existsSync(dir)) continue;
    foundOutput = true;
    for (const file of walkPdfFiles(dir)) {
      if (seen.has(file)) continue;
      seen.add(file);
      inspectedCount++;
      const path = pdfPathFromRoot(dir, file);
      if (shouldExcludeWixPdf(path, links)) {
        removedBytes += statSync(file).size;
        rmSync(file);
        removedCount++;
      }
    }
  }
  if (!foundOutput) {
    throw new Error("No supported build output directory found; refusing to claim that PDFs were excluded.");
  }
  console.log("[pdf-deploy] Build output: inspected " + inspectedCount + " PDFs; removed " +
    removedCount + " Wix-served PDF copies (" + (removedBytes / 1e6).toFixed(1) + " MB).");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const links = wixPdfLinks();
  if (process.argv.includes("--verify")) audit(links);
  else if (process.argv.includes("--prune")) prune(links);
  else {
    console.error("Use --verify or --prune");
    process.exitCode = 2;
  }
}
