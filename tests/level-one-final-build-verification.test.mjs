import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const queue = JSON.parse(read("src/data/finalBuild/level-1-review-queue.json"));
const legacy = JSON.parse(read("src/data/levelOnePrototypeCrops.json"));
const verified = JSON.parse(read("src/data/finalBuild/level-1-verified-references.json"));
const wix = JSON.parse(read("src/data/finalBuild/level-1-wix-image-urls.json"));
const route = read("src/routes/practical/level-1.final-build.tsx");
const gate = read("src/data/levelOneReferenceGate.ts");
const scanner = read("src/components/practical/FinalBuildScanner.tsx");
const renderer = read("src/components/practical/LevelOneVerifiedWebp.tsx");

test("all 60 provisional variants remain individually traceable to registered Wix PDFs", () => {
  assert.equal(queue.projectCount, 59);
  assert.equal(queue.variantCount, 60);
  assert.equal(queue.records.length, 60);
  assert.equal(legacy.references.length, 60);
  assert.equal(new Set(queue.records.map(v => v.filename)).size, 60);
  assert.equal(new Set(queue.records.map(v => v.projectId)).size, 59);
  for (const row of queue.records) {
    const candidate = legacy.references.find(c => c.filename === row.filename);
    assert.ok(candidate, row.filename);
    assert.equal(row.proposedSourcePage, candidate.page);
    assert.deepEqual(row.proposedCrop, candidate.crop);
    assert.equal(row.registeredRepositoryPath, "public/" + row.filename);
    assert.match(row.officialPdfUrl, /^https:\/\/[^/]+\.usrfiles\.com\/.+\.pdf$/i);
    assert.equal(row.pdfSha256, null, "source bytes have not been independently verified");
    assert.equal(row.approvedSourcePage, null);
    assert.equal(row.independentValidationStatus, "not-reviewed");
    assert.equal(row.approvalDecision, "blocked");
    assert.deepEqual(row.assessmentQuestions, []);
  }
});

test("no provisional image, generic question set, or unverified Wix upload can unlock student selection", () => {
  assert.equal(verified.references.length, 0);
  assert.equal(Object.keys(wix.images).length, 0);
  assert.ok(legacy.references.every(c => c.approved === false));
  assert.match(gate, /candidate\.approved !== true/);
  assert.match(gate, /item\.pdfSha256/);
  assert.match(gate, /independentValidationStatus/);
  assert.match(gate, /validQuestions\(item\.assessmentQuestions\)/);
  assert.match(gate, /wixImages\.images/);
  assert.match(route, /APPROVED_PROJECT_INDEXES\[secureRandomIndex\(APPROVED_PROJECT_INDEXES\.length\)\]/);
  assert.match(route, /\(reviewMode \|\| approvedRef\) && candidate/);
  assert.match(route, /candidate\?\.approved && modelReady && approvedRef/);
  assert.match(route, /import\.meta\.env\.DEV && typeof window/);
  assert.match(route, /isApprovedSelection\(data\.projectIndex, data\.variantIndex\)/);
});

test("original Level 1 timing, score threshold, scanner motion and retries remain in source", () => {
  assert.match(route, /const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(route, /const SPIN_DURATION_MS = 4200/);
  assert.match(route, /const STORAGE_KEY = "be-stem-ready-level1-final-build-v1"/);
  assert.match(route, /deadline: Date\.now\(\) \+ LIMIT_MS/);
  assert.match(route, /const pass = session\.completed && score >= 4/);
  assert.match(route, /function retry\(same: boolean\)/);
  assert.match(route, /const remaining = session\.deadline \? Math\.max\(0, session\.deadline - now\)/);
  assert.match(scanner, /bsr-scan-line/);
  assert.match(scanner, /prefers-reduced-motion: reduce/);
  assert.match(renderer, /naturalWidth !== expectedWidth/);
  assert.match(renderer, /<FinalBuildPrototype/);
});

test("every proposed crop stays inside normalized page coordinates", () => {
  for (const record of queue.records) {
    const { x, y, width, height } = record.proposedCrop;
    assert.ok([x, y, width, height].every(Number.isFinite), record.filename);
    assert.ok(x >= 0 && y >= 0 && width > 0 && height > 0, record.filename);
    assert.ok(x + width <= 1 && y + height <= 1, record.filename);
  }
});
