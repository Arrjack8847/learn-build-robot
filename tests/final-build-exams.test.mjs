import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const exam = read("src/components/practical/FinalBuildExam.tsx");
const registry = read("src/data/finalBuildRegistry.ts");
const scanner = read("src/components/practical/FinalBuildScanner.tsx");
const prototype = read("src/components/practical/FinalBuildPrototype.tsx");
const verified = read("src/data/finalBuildVerified.ts");
const levelFiveReferences = JSON.parse(read("src/data/finalBuild/level-5-references.json"));
const levelFiveChecklists = JSON.parse(read("src/data/finalBuild/level-5-checklists.json"));
const wixImageUrls = JSON.parse(read("src/data/finalBuild/level-5-wix-image-urls.json"));
const levelFiveWixUpload = JSON.parse(read("reports/final-build-level-5-wix-upload-plan-20261123.json"));
const levelFiveRecovery = JSON.parse(read("src/data/finalBuild/level-5-wix-candidates.json"));
const levelOne = read("src/routes/practical/level-1.final-build.tsx");
const approval = JSON.parse(read("src/data/finalBuildApprovals.json"));
const oneApproval = JSON.parse(read("src/data/levelOnePrototypeCrops.json"));

test("all six level-specific final-build route modules are registered", () => {
  assert.match(levelOne, /createFileRoute\("\/practical\/level-1\/final-build"\)/);
  for (let level=2; level<=6; level++) {
    const route = read("src/routes/practical/level-" + level + ".final-build.tsx");
    assert.ok(route.includes('createFileRoute("/practical/level-'+level+'/final-build")'));
    assert.ok(route.includes("FinalBuildExam level={"+level+"}"));
  }
  assert.match(read("src/components/practical/ResponsiveCategories.tsx"), /Robot Discovery Scanner<\/a>/);
});

test("registries use actual syllabus and registered Building manuals instead of Learning slides", () => {
  assert.match(registry, /getAdvancedLevel\(level\)/);
  assert.match(registry, /practicalProjects\.filter/);
  assert.match(registry, /getLevelFourBuildingManual/);
  assert.match(registry, /getLevelFiveSixBuildingManual/);
  assert.match(registry, /learningFallback/);
  assert.match(registry, /sourceKind !== "powerpoint"/);
  assert.ok(registry.includes("usrfiles"));
  assert.match(registry, /getFinalBuildPool/);
  assert.match(registry, /variants\.length > 0/);
  assert.match(registry, /new Map\(result\.map\(v => \[v\.url, v\]\)\)/);
});

test("fair scan uses cryptographically drawn unbiased index, independent of animation", () => {
  assert.match(registry, /crypto\.getRandomValues\(array\)/);
  assert.match(registry, /value >= limit/);
  assert.match(exam, /secureRandomIndex\(pool\.length\)/);
  assert.match(levelOne, /secureRandomIndex\(PROJECTS\.length\)/);
  assert.match(exam, /scanUntil: Date\.now\(\) \+ SCAN_MS/);
  assert.match(scanner, /projectCount\?: number/);
  assert.match(scanner, /prefers-reduced-motion: reduce/);
  assert.match(exam, /Skip animation/);
});

test("approved-only scanner and source-backed Level 5 questions are mandatory", () => {
  assert.equal(approval.status, "all-unreviewed");
  assert.deepEqual(approval.references, []);
  assert.ok(oneApproval.references.length > 0);
  assert.ok(oneApproval.references.every(ref => ref.approved === false));
  assert.match(exam, /getVerifiedFinalBuildPool\(level\)/);
  assert.match(exam, /getVerifiedFinalBuildReference\(level, project\.id, variant\)/);
  assert.match(exam, /getVerifiedFinalBuildQuestions\(level, project\.id, variant\)/);
  assert.match(exam, /const startAllowed = Boolean\(approval && variant\?\.hostedOnWix &&/);
  assert.match(exam, /pictureReady \|\| showRegisteredPdfFallback/);
  assert.match(exam, /approval\.referenceMode === "registered-pdf-fallback"/);
  assert.match(exam, /disabled=\{!startAllowed\}/);
  assert.match(verified, /reference\.sourceUrl !== variant\.url/);
  assert.match(verified, /checklist\.questions\.length !== 5/);
  assert.match(verified, /project\.variants\.filter\(variant => getEvidence\(/);
  assert.match(prototype, /imageUrl \? \(/);
  assert.match(prototype, /renderTask\?\.cancel\(\)/);
  assert.match(exam, /import\.meta\.env\.DEV && query\.get\("review"\)/);
  assert.ok(!exam.includes("checkDescriptions("));
  assert.ok(!exam.includes("BuildingStudio"));
});

test("Level 5 has 42 source-verified models, 210 checks and three fail-closed sources", () => {
  assert.equal(levelFiveReferences.items.length, 45);
  assert.equal(levelFiveChecklists.items.length, 45);
  assert.equal(levelFiveReferences.renderableApprovedReferences.length, 42);
  assert.equal(levelFiveChecklists.approvedChecklists.length, 42);
  const wixUrls = Object.entries(wixImageUrls.urls);
  assert.equal(wixUrls.length, 42);
  assert.equal(new Set(wixUrls.map(([, url]) => url)).size, 42, "Wix URLs must be unique");
  assert.equal(wixImageUrls.wixSite, "Steam");
  assert.equal(wixImageUrls.wixSiteId, "fe3fa828-9f74-45e8-97f7-8d00cbb7fba0");
  // Original first 39 uploads remain unchanged; new 3 are separately checked in candidate evidence.
  assert.equal(levelFiveWixUpload.uploads.length, 39);
  assert.equal(levelFiveWixUpload.summary.uploadedReady, 39);
  assert.equal(levelFiveRecovery.studentApproved, 3);
  const approvedIds = new Set(levelFiveReferences.renderableApprovedReferences.map(item => item.variantId));
  const uploadByVariant = new Map(levelFiveWixUpload.uploads.map(x => [x.variantId, x]));
  const recovered = new Map(levelFiveRecovery.candidates.map(x => [x.variantId, x]));
  for (const [variantId, url] of wixUrls) {
    assert.ok(approvedIds.has(variantId), "Blocked/unknown variant cannot receive a hosted image");
    const ref = levelFiveReferences.items.find(r => r.variantId === variantId);
    const historicUpload = uploadByVariant.get(variantId);
    if (historicUpload) {
      assert.equal(historicUpload.uploadStatus, "READY");
      assert.equal(historicUpload.wixUrl, url);
      assert.ok(historicUpload.sourceWebpUrl.includes("/feat/final-build-level-5/public/final-build/level-5/"));
      assert.equal(historicUpload.sourceWebpSha256, ref.imageSha256);
    } else {
      const candidate = recovered.get(variantId);
      assert.ok(candidate && candidate.assessment.studentApproved);
      assert.equal(candidate.assessment.independentlyApprovedQuestions, 5);
      assert.equal(candidate.image.sha256, ref.imageSha256);
      assert.equal(candidate.wix.operationStatus, "READY");
      assert.equal(candidate.wix.cdnByteForByteSha256Verified, true);
      assert.equal(candidate.wix.hostedUrl, url);
    }
    const parsed = new URL(url);
    assert.equal(parsed.protocol, "https:");
    assert.equal(parsed.hostname, "static.wixstatic.com");
    assert.ok(parsed.pathname.startsWith("/media/") && parsed.pathname.toLowerCase().endsWith(".webp"));
  }
  const checksByVariant = new Map(levelFiveChecklists.items.map(item => [item.variantId, item]));
  const seen = new Set();
  let approved = 0, blocked = 0;
  for (const reference of levelFiveReferences.items) {
    assert.ok(!seen.has(reference.variantId), "Duplicate variant ID");
    seen.add(reference.variantId);
    const checklist = checksByVariant.get(reference.variantId);
    assert.ok(checklist, "Every source candidate has a checklist status");
    assert.equal(reference.approved, checklist.approved);
    if (reference.approved) {
      approved++;
      assert.equal(reference.status, "approved");
      assert.equal(reference.pdfSha256.length, 64);
      assert.equal(reference.imageSha256.length, 64);
      assert.ok(Array.isArray(reference.normalizedCrop) && reference.normalizedCrop.length === 4);
      assert.ok(Number.isInteger(reference.page) && reference.page > 0);
      assert.ok(reference.reviewer && reference.independentValidator);
      assert.equal(checklist.questions.length, 5);
      for (const question of checklist.questions) {
        assert.ok(question.text.trim().length > 0);
        assert.ok(Number.isInteger(question.evidencePage) && question.evidencePage > 0);
        assert.equal(question.sourcePdfSha256, reference.pdfSha256);
      }
    } else {
      blocked++;
      assert.equal(reference.status, "blocked");
      assert.deepEqual(checklist.questions, []);
      assert.equal(wixImageUrls.urls[reference.variantId], undefined);
    }
  }
  assert.equal(approved, 42);
  assert.equal(blocked, 3);
  assert.equal(approved * 5, 210);
});

test("15-minute timer is deadline-based, persistent and level-isolated", () => {
  assert.match(exam, /const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(exam, /deadline: startedAt \+ LIMIT_MS/);
  assert.match(exam, /"be-stem-ready-final-build-level-" \+ level/);
  assert.match(exam, /window\.localStorage\.setItem/);
  assert.match(exam, /Math\.max\(0, session\.deadline - now\)/);
  assert.match(exam, /completedAt <= \(prev\.deadline/);
});

test("assessment stays within Final Build and is clearly self-reported", () => {
  assert.match(exam, /"assessment"/);
  assert.match(exam, /prev\.checks\.filter\(Boolean\)\.length >= 4/);
  assert.match(exam, /I Finished My Robot!/);
  assert.match(exam, /Self-reported practical completion/);
  assert.match(exam, /Retry Same Robot/);
  assert.match(exam, /Discover Another Robot/);
  assert.ok(!exam.includes('window.open('));
});

test("audited level syllabus sizes are unchanged", () => {
  const source = read("src/data/advancedSyllabus.ts");
  const match = source.match(/export const ADVANCED_SYLLABUS = (\{[\s\S]*?\}) as const;/);
  assert.ok(match, "official syllabus data must remain parseable");
  const levels = JSON.parse(match[1]);
  const expected = {2:59, 3:48, 4:56, 5:51, 6:43};
  for (const [number,count] of Object.entries(expected)) {
    assert.equal(levels[number].reduce((sum, category) => sum+category.length-1, 0), count);
  }
});
