/**
 * Remove Wix-hosted Level 1-4 Building PDF duplicates from built deployment assets.
 *
 * Never modifies public/ source files or Learning PDF assets. Every removed file
 * must have a verified Wix URL in the exact path registries.
 *
 * Runs after vite build via package.json postbuild. No downloads are performed.
 */
import { existsSync, readFileSync, rmSync, statSync } from "node:fs";
import { resolve, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("../../", import.meta.url)));
const wixHost = "https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/";

function wixEntries(relativeFile) {
  const source = readFileSync(join(repoRoot, relativeFile), "utf8");
  const result = new Map();
  const entry = /^\s*("(?:\\.|[^"\\])*"):\s*("(?:\\.|[^"\\])*")\s*,?\s*$/gm;
  for (const match of source.matchAll(entry)) {
    const key = JSON.parse(match[1]);
    const url = JSON.parse(match[2]);
    result.set(key, url);
  }
  return result;
}

const rootRegistry = wixEntries("src/data/levelOneToThreeWixPdfUrls.ts");
const level4Registry = wixEntries("src/data/levelFourWixPdfUrls.ts");

// Prune ONLY the 209 audited Level 1–4 Building paths. The Wix URL registries
// also contain Learning and supplementary PDFs that must not be excluded.
const manifest = JSON.parse(
  readFileSync(
    join(repoRoot, "reports/level1-4-building-link-only-paths-20261119.json"),
    "utf8",
  ),
);
if (manifest.auditedCounts?.distinctPaths !== 209 ||
    !Array.isArray(manifest.paths) || manifest.paths.length !== 209) {
  throw new Error("Expected exactly 209 audited Building PDF paths.");
}
const paths = manifest.paths.map((repositoryPath) => {
  const segments = repositoryPath.split("/");
  if (!repositoryPath.startsWith("public/") ||
      !repositoryPath.toLowerCase().endsWith(".pdf") ||
      segments.some((part) => part === "." || part === "..") ||
      segments.includes("Learning")) {
    throw new Error("Unsafe Building PDF inventory path: " + repositoryPath);
  }
  const relativePath = segments.slice(1).join("/");
  const registry = relativePath.startsWith("Level 4/Building/")
    ? level4Registry
    : rootRegistry;
  const url = registry.get(relativePath);
  if (typeof url !== "string" || !url.startsWith(wixHost) ||
      !url.endsWith(".pdf")) {
    throw new Error("Missing Wix link for Building PDF: " + repositoryPath);
  }
  return relativePath;
});
if (new Set(paths).size !== paths.length) {
  throw new Error("Duplicate path in audited Building PDF manifest.");
}

// Vite/TanStack Start/Nitro can emit assets into different folders.
// Prune only exact path matches in generated output directories, never public/.
const outputFolders = [
  ".output/public",
  ".output/server/public",
  "dist",
  "dist/client",
  "dist/server",
  "build/client",
  ".vercel/output/static",
];
let deleted = 0;
for (const relativeFolder of outputFolders) {
  const dir = resolve(repoRoot, relativeFolder);
  if (!existsSync(dir)) continue;
  for (const relativePath of paths) {
    const filename = resolve(dir, ...relativePath.split("/"));
    if (!filename.startsWith(dir + sep)) {
      throw new Error("Unsafe output file path: " + filename);
    }
    if (existsSync(filename) && statSync(filename).isFile()) {
      rmSync(filename);
      deleted++;
    }
  }
}

console.log(
  "[PDF link-only deployment] " + paths.length +
  " Wix-backed Level 1-4 Building PDF paths checked; " +
  deleted + " copied PDFs excluded from build output. Learning PDFs preserved.",
);
