import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const policySource = read("src/data/levelOneFinalBuildStartPolicy.ts");
const routeSource = read("src/routes/practical/level-1.final-build.tsx");
const cropManifest = JSON.parse(read("src/data/levelOnePrototypeCrops.json"));
const mappings = read("src/data/levelOneToThreeWixPdfUrls.ts");
const wixMatch = mappings.match(
  /export const levelOneToThreeWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/,
);
assert.ok(wixMatch, "Wix PDF registry must exist");
const wixPdfUrls = JSON.parse(wixMatch[1]);
const module = { exports: {} };
const { outputText } = ts.transpileModule(policySource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
runInNewContext(outputText, { module, exports: module.exports }, {
  filename: "levelOneFinalBuildStartPolicy.ts",
});
const { canStartLevelOneBuild } = module.exports;

test("owner-approved Level 1 candidates start when their Wix crop renders", () => {
  assert.equal(cropManifest.references.length, 60);
  assert.ok(cropManifest.references.every(record => record.approved === false));
  for (const reference of cropManifest.references) {
    const pdf = wixPdfUrls[reference.filename];
    assert.match(pdf || "", /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/.+\.pdf$/i,
      "Missing owner-authorized Wix source for " + reference.filename);
    assert.equal(canStartLevelOneBuild(reference, true, pdf), true, reference.filename);
  }
});

test("image loading failures and missing references still prevent unsafe starts", () => {
  const reference = cropManifest.references[0];
  const pdf = wixPdfUrls[reference.filename];
  assert.equal(canStartLevelOneBuild(reference, false, pdf), false);
  assert.equal(canStartLevelOneBuild(undefined, true, pdf), false);
  assert.equal(canStartLevelOneBuild(reference, true, undefined), false);
  assert.equal(canStartLevelOneBuild(reference, true, "/Level%201/manual.pdf"), false);
  assert.equal(canStartLevelOneBuild(reference, true, "https://example.org/manual.pdf"), false);
  assert.equal(canStartLevelOneBuild(reference, true, "https://example.org/manual.webp"), false);
});

test("Level 1 route uses owner-approved loading gate, not independent-review flag", () => {
  assert.match(routeSource, /canStartLevelOneBuild\(candidate, modelReady, manualUrl\)/);
  assert.match(routeSource, /modelStatus\.status === "ready"/);
  assert.match(routeSource, /disabled=\{!canStart\}/);
  assert.match(routeSource, /onClick=\{\(\) => update\(\{ stage: "building", deadline: Date\.now\(\) \+ LIMIT_MS/);
  assert.doesNotMatch(routeSource, /candidate\?\.approved && modelReady && manualUrl/);
  assert.doesNotMatch(routeSource, /needs visual approval before the student challenge can begin/);
  assert.match(routeSource, /Owner-authorized reference/);
  assert.match(routeSource, /independently certified/);
});

test("scanner, timer, retry and Wix PDF source remain unchanged in Level 1", () => {
  assert.match(routeSource, /const LIMIT_MS = 15 \* 60 \* 1000;/);
  assert.match(routeSource, /const SPIN_DURATION_MS = 4200;/);
  assert.match(routeSource, /secureRandomIndex\(PROJECTS\.length\)/);
  assert.match(routeSource, /LEVEL_ONE_CLEANED_BUILDING_WIX_URLS/);
  assert.match(routeSource, /<FinalBuildPrototype/);
  assert.match(routeSource, /onStatusChange=\{onModelStatus\}/);
  assert.match(routeSource, /onClick=\{\(\) => retry\(true\)\}/);
  assert.match(routeSource, /onClick=\{\(\) => retry\(false\)\}/);
});
