/**
 * Remove Wix-hosted Building and cleaned Level 1 + Level 3 Learning PDF duplicates from built deployment assets.
 *
 * Never modifies public/ source files. Every removed file must have a verified
 * Wix URL and an exact audited path in the registries.
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
const level5Registry = wixEntries("src/data/levelFiveWixPdfUrls.ts");

// Prune ONLY the audited 209 Level 1–4 + 45 Level 5 Building paths.
// Wix registries also contain Learning and supplementary PDFs; retain those.
const manifest = JSON.parse(
  readFileSync(
    join(repoRoot, "reports/level1-4-building-link-only-paths-20261119.json"),
    "utf8",
  ),
);
const level5Manifest = JSON.parse(
  readFileSync(
    join(repoRoot, "reports/level5-building-link-only-paths-20261119.json"),
    "utf8",
  ),
);
if (manifest.auditedCounts?.distinctPaths !== 209 ||
    !Array.isArray(manifest.paths) || manifest.paths.length !== 209 ||
    level5Manifest.uniqueBuildingPdfCount !== 45 ||
    !Array.isArray(level5Manifest.paths) || level5Manifest.paths.length !== 45) {
  throw new Error("Expected exactly 209 Level 1–4 and 45 Level 5 Building PDF paths.");
}
const allBuildingPaths = [...manifest.paths, ...level5Manifest.paths];
if (allBuildingPaths.length !== 254) {
  throw new Error("Expected 254 Wix-hosted Building PDF paths.");
}
const paths = allBuildingPaths.map((repositoryPath) => {
  const segments = repositoryPath.split("/");
  if (!repositoryPath.startsWith("public/") ||
      !repositoryPath.toLowerCase().endsWith(".pdf") ||
      segments.some((part) => part === "." || part === "..") ||
      segments.includes("Learning")) {
    throw new Error("Unsafe Building PDF inventory path: " + repositoryPath);
  }
  const relativePath = segments.slice(1).join("/");
  const registry = relativePath.startsWith("Level 5/Building/")
    ? level5Registry
    : relativePath.startsWith("Level 4/Building/")
      ? level4Registry
      : rootRegistry;
  const url = registry.get(relativePath);
  if (typeof url !== "string" || !url.startsWith(wixHost) ||
      !url.endsWith(".pdf")) {
    throw new Error("Missing Wix link for Building PDF: " + repositoryPath);
  }
  return relativePath;
});
// All 45 cleaned Level 1 Learning uploads are public, READY and exact URL-matched
// against Wix Media Manager; prune their COPIES from deployment output only.
const levelOneLearningPaths = [...rootRegistry.entries()]
  .filter(([key]) => key.startsWith("Level 1/Learning/"))
  .map(([key, url]) => {
    if (!/^Level 1\/Learning\/.+\.pdf$/i.test(key) ||
        key.split("/").some(part => part === "." || part === "..") ||
        typeof url !== "string" ||
        !url.startsWith(wixHost + "78042f_") ||
        !url.endsWith(".pdf")) {
      throw new Error("Invalid Level 1 cleaned Wix PDF mapping: " + key);
    }
    return key;
  });
if (levelOneLearningPaths.length !== 45 ||
    new Set(levelOneLearningPaths).size !== 45) {
  throw new Error("Expected exactly 45 cleaned Level 1 Learning Wix PDF paths.");
}
paths.push(...levelOneLearningPaths);

// Exactly 43 Wix-confirmed, READY Level 3 cleaned Learning PDFs; preserve
// source binaries in Git while excluding copied deployment assets.
const levelThreeLearningPaths = [...rootRegistry.entries()]
  .filter(([key]) => key.startsWith("Level 3/Learning/"))
  .map(([key, url]) => {
    if (!/^Level 3\/Learning\/.+\.pdf$/i.test(key) ||
        key.split("/").some(part => part === "." || part === "..") ||
        typeof url !== "string" ||
        !url.startsWith(wixHost + "78042f_") ||
        !/^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/78042f_[0-9a-f]{32}\.pdf$/.test(url)) {
      throw new Error("Invalid cleaned Level 3 Learning Wix PDF: " + key);
    }
    return key;
  });
if (levelThreeLearningPaths.length !== 43 ||
    new Set(levelThreeLearningPaths).size !== 43 ||
    new Set(levelThreeLearningPaths.map(key => rootRegistry.get(key))).size !== 43) {
  throw new Error("Expected 43 distinct cleaned Level 3 Learning Wix PDFs.");
}
paths.push(...levelThreeLearningPaths);

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
  " Wix-backed Building and cleaned Level 1 + Level 3 Learning PDF paths checked; " +
  deleted + " copied PDFs excluded from build output. Repository source PDFs preserved.",
);
