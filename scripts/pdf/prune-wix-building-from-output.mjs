/**
 * Remove Wix-hosted Building and cleaned Level 1 + Level 3 + Level 4 + Level 5 + Level 6 Learning PDF duplicates from built deployment assets.
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
const level6Registry = wixEntries("src/data/levelSixWixPdfUrls.ts");

// Prune ONLY the audited 209 Level 1–4 + 45 Level 5 + 41 Level 6 Building paths.
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
const level6Manifest = JSON.parse(
  readFileSync(
    join(repoRoot, "reports/level6-building-link-only-paths-20261120.json"),
    "utf8",
  ),
);
if (manifest.auditedCounts?.distinctPaths !== 209 ||
    !Array.isArray(manifest.paths) || manifest.paths.length !== 209 ||
    level5Manifest.uniqueBuildingPdfCount !== 45 ||
    !Array.isArray(level5Manifest.paths) || level5Manifest.paths.length !== 45 ||
    level6Manifest.uniqueBuildingPdfCount !== 41 ||
    !Array.isArray(level6Manifest.paths) || level6Manifest.paths.length !== 41) {
  throw new Error("Expected 209 Level 1–4, 45 Level 5 and 41 Level 6 Building PDF paths.");
}
const allBuildingPaths = [...manifest.paths, ...level5Manifest.paths, ...level6Manifest.paths];
if (allBuildingPaths.length !== 295 || new Set(allBuildingPaths).size !== 295) {
  throw new Error("Expected 295 unique Wix-hosted Building PDF paths.");
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
  const registry = relativePath.startsWith("Level 6/Building/")
    ? level6Registry
    : relativePath.startsWith("Level 5/Building/")
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

// All 51 Level 5 Learning PDFs now have reviewed cleaned Wix URL mappings.
// Remove only their copied deployment assets, retaining GitHub public/ source.
const levelFiveLearningPaths = [...level5Registry.entries()]
  .filter(([key]) => key.startsWith("Level 5/Learning/"))
  .map(([key, url]) => {
    if (!/^Level 5\/Learning\/.+\.pdf$/i.test(key) ||
        key.split("/").some(part => part === "." || part === "..") ||
        typeof url !== "string" ||
        !url.startsWith(wixHost + "78042f_") ||
        !url.endsWith(".pdf")) {
      throw new Error("Invalid Level 5 cleaned Wix PDF mapping: " + key);
    }
    return key;
  });
if (levelFiveLearningPaths.length !== 51 ||
    new Set(levelFiveLearningPaths).size !== 51) {
  throw new Error("Expected exactly 51 cleaned Level 5 Learning Wix PDF paths.");
}
paths.push(...levelFiveLearningPaths);

// Level 4: exclude exactly the 56 Wix-verified Learning PDF copies from build output.
// Match the authoritative lesson list to the URL registry before deleting copied assets.
// Source PDF files under public/ are never modified or deleted.
const levelFourLearningSource = readFileSync(
  join(repoRoot, "src/data/levelFourLearning.ts"),
  "utf8",
);
const levelFourLearningPaths = [...levelFourLearningSource.matchAll(
  /url:\s*publicPdfUrl\("([^"]+)"\)/g,
)].map((match) => match[1]);
const levelFourRegistryPaths = [...level4Registry.keys()]
  .filter((key) => !key.startsWith("Level 4/Building/"));
const uniqueLevelFourPaths = new Set(levelFourLearningPaths);
if (levelFourLearningPaths.length !== 56 ||
    uniqueLevelFourPaths.size !== 56 ||
    levelFourRegistryPaths.length !== 56 ||
    levelFourRegistryPaths.some((key) => !uniqueLevelFourPaths.has(key))) {
  throw new Error("Expected exactly 56 matching Level 4 Learning lessons and Wix URLs.");
}
const uniqueLevelFourUrls = new Set();
for (const key of levelFourLearningPaths) {
  const url = level4Registry.get(key);
  if (!key.startsWith("Level 4/") ||
      key.split("/").some((part) => part === "." || part === ".." || part === "Building") ||
      !key.toLowerCase().endsWith(".pdf") ||
      typeof url !== "string" ||
      !url.startsWith(wixHost + "78042f_") ||
      !/^[a-f0-9]{32}\.pdf$/.test(url.slice((wixHost + "78042f_").length))) {
    throw new Error("Unverified or unsafe Level 4 Learning PDF: " + key);
  }
  uniqueLevelFourUrls.add(url);
}
if (uniqueLevelFourUrls.size !== 56) {
  throw new Error("Expected 56 unique cleaned Level 4 Wix Learning PDF URLs.");
}
paths.push(...levelFourLearningPaths);

// Level 6: 43 Learning PDFs were byte-for-byte verified against cleaned source
// and loaded with PDF.js from Wix. Prune only build-output copies, never source.
const levelSixLearningSource = readFileSync(
  join(repoRoot, "src/data/levelFiveSixContent.ts"),
  "utf8",
);
const levelSixLessonsMatch = levelSixLearningSource.match(
  /export const levelFiveSixLessons: readonly AdvancedLessonAsset\[\] = (\[[\s\S]*?\]);/,
);
if (!levelSixLessonsMatch) {
  throw new Error("Cannot parse authoritative Level 5–6 lesson catalog.");
}
const levelSixLearningPaths = JSON.parse(levelSixLessonsMatch[1])
  .filter((lesson) => lesson.level === 6)
  .map((lesson) => lesson.learningPdf);
const levelSixRegistryLearningPaths = [...level6Registry.keys()]
  .filter((key) => key.startsWith("Level 6/Learning/"));
const validLevelSixPaths = new Set(levelSixLearningPaths);
if (levelSixLearningPaths.length !== 43 ||
    validLevelSixPaths.size !== 43 ||
    levelSixRegistryLearningPaths.length !== 43 ||
    levelSixRegistryLearningPaths.some((key) => !validLevelSixPaths.has(key))) {
  throw new Error("Level 6 expected exactly 43 matching Learning PDF paths.");
}
const levelSixCleanUrls = new Set();
for (const key of levelSixLearningPaths) {
  const url = level6Registry.get(key);
  if (!key.startsWith("Level 6/Learning/") ||
      !key.toLowerCase().endsWith(".pdf") ||
      key.split("/").some((part) => part === "." || part === ".." || part === "Building") ||
      typeof url !== "string" ||
      !/^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/78042f_[0-9a-f]{32}\.pdf$/.test(url)) {
    throw new Error("Unverified Level 6 cleaned Wix Learning URL: " + key);
  }
  levelSixCleanUrls.add(url);
}
if (levelSixCleanUrls.size !== 43) {
  throw new Error("Expected 43 distinct cleaned Wix Level 6 Learning URLs.");
}
paths.push(...levelSixLearningPaths);

if (new Set(paths).size !== paths.length) {
  throw new Error("Duplicate path in audited Wix PDF manifest.");
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
  " Wix-backed Building and cleaned Level 1 + Level 3 + Level 4 + Level 5 + Level 6 Learning PDF paths checked; " +
  deleted + " copied PDFs excluded from build output. Repository source PDFs preserved.",
);
