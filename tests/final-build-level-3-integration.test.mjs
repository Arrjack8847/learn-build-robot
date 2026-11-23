import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const manifest = JSON.parse(read("src/data/finalBuild/level-3-owner-authorized.json"));
const shared = read("src/data/finalBuildVerified.ts");
const adapter = read("src/data/finalBuildLevel3Verified.ts");
const exam = read("src/components/practical/FinalBuildExam.tsx");
const prototype = read("src/components/practical/FinalBuildPrototype.tsx");
const registry = read("src/data/finalBuildRegistry.ts");

test("Level 3 uses the same shared scanner with an isolated owner-authorized adapter", () => {
  assert.match(shared, /getLevelThreeEvidence/);
  assert.match(shared, /if \(level === 3\) return getLevelThreeEvidence\(projectId, variant\)/);
  assert.match(shared, /withLevelThreeOwnerAuthorizedVariants\(pool\)/);
  assert.match(shared, /project\.variants\.filter\(variant => getEvidence\(/);
  assert.match(exam, /getVerifiedFinalBuildPool\(level\)/);
  assert.match(exam, /getVerifiedFinalBuildReference\(level, project\.id, variant\)/);
  assert.match(exam, /getVerifiedFinalBuildQuestions\(level, project\.id, variant\)/);
  assert.match(registry, /getAdvancedLevel\(level\)/);
  assert.match(adapter, /new Set\(rows\.map\(row => row\.variantId\)\)\.size === 42/);
  assert.match(adapter, /new Set\(rows\.map\(row => row\.projectId\)\)\.size === 39/);
  assert.equal(manifest.records.length, 42);
  assert.equal(manifest.records.filter(x=>x.projectId === "level-3-cycle-sport-basic").length, 2);
  assert.equal(manifest.records.filter(x=>x.projectId === "level-3-race-walking-basic").length, 3);
});

test("No independent approval is fabricated by Level 3's explicitly separate owner policy", () => {
  assert.match(adapter, /row\.independentImageApproval !== false/);
  assert.match(adapter, /row\.independentQuestionApproval !== false/);
  assert.match(adapter, /completedAssemblyIndependentlyConfirmed !== false/);
  assert.match(adapter, /owner-authorized-candidate-not-independently-validated/);
  assert.match(adapter, /m\.hostedHttpStatus !== 200/);
  assert.match(adapter, /m\.mimeType !== "image\/webp"/);
  assert.match(adapter, /m\.operationStatus !== "READY"/);
  assert.match(adapter, /new Set\(row\.questions\.map\(q => q\.text\)\)\.size !== 5/);
  assert.match(exam, /Owner-authorized self-assessment/);
  assert.match(exam, /sourceLimited=\{level === 3\}/);
  assert.match(prototype, /Owner-authorized original Building-manual illustration/);
});

test("Original PDF is offered if a Level 3 CDN image becomes unavailable", () => {
  assert.match(exam, /\(level === 2 \|\| level === 3\) && approval\.referenceMode === "hosted-webp"/);
  assert.match(exam, /Open original PDF reference/);
  assert.match(exam, /approval\.sourceUrl/);
  assert.match(adapter, /referenceMode: "hosted-webp"/);
});

test("Level 3 uses existing unchanged 15 minute and 4-of-5 self-reported assessment", () => {
  assert.match(exam, /const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(exam, /const SCAN_MS = 4200/);
  assert.match(exam, /prev\.checks\.filter\(Boolean\)\.length >= 4/);
  assert.match(exam, /"be-stem-ready-final-build-level-" \+ level/);
  assert.match(exam, /Retry Same Robot/);
  assert.match(exam, /Discover Another Robot/);
  assert.equal(manifest.records.reduce((sum,x)=>sum+x.questions.length,0),210);
});
