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

// All 172 legacy root PDF files represent the shared Level 1-3 Building
// manuals. Their Wix URLs are the app's source of truth.
const rootBuilding = [...rootRegistry.entries()]
  .filter(([key]) => !key.includes("/") && key.toLowerCase().endsWith(".pdf"));

// Level 4 includes separately hosted Learning files; keep those local.
const level4Building = [...level4Registry.entries()]
  .filter(([key]) => key.startsWith("Level 4/Building/") && key.toLowerCase().endsWith(".pdf"));

if (rootBuilding.length !== 172 || level4Building.length !== 50) {
  throw new Error(
    "Wix Building registry coverage changed; refusing asset pruning: " +
    rootBuilding.length + " root, " + level4Building.length + " Level 4",
  );
}

const paths = [...rootBuilding, ...level4Building].map(([path, url]) => {
  if (!url.startsWith(wixHost) || !url.endsWith(".pdf") || path.includes("..")) {
    throw new Error("Missing or invalid Wix Building PDF mapping: " + path);
  }
  return path;
});

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
