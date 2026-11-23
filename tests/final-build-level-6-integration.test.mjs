import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const references = JSON.parse(read("src/data/finalBuild/level-6-references.json"));
const checklists = JSON.parse(read("src/data/finalBuild/level-6-checklists.json"));
const wix = JSON.parse(read("src/data/finalBuild/level-6-wix-image-urls.json"));
const upload = JSON.parse(read("reports/final-build-level-6-wix-upload-20261123.json"));
const verified = read("src/data/finalBuildLevel6Verified.ts");
const router = read("src/data/finalBuildVerified.ts");
const exam = read("src/components/practical/FinalBuildExam.tsx");

test("Level 6 contains 39 approved reference/assessment pairs and two blocked variants", () => {
  assert.equal(references.entries.length, 41);
  assert.equal(checklists.entries.length, 41);
  const refs = references.entries.filter(x => x.approved && x.status === "approved");
  const blocked = references.entries.filter(x => !x.approved || x.status !== "approved");
  assert.equal(refs.length, 39);
  assert.equal(blocked.length, 2);
  assert.deepEqual(blocked.map(x => x.variantId).sort(),
    ["level-6-super-scorpion:optimized", "level-6-rock-paper-scissors-robot"].sort());
  assert.equal(checklists.entries.filter(x => x.approved && x.status === "approved").length, 39);
});

test("only approved Level 6 variants have unique READY, public, source-correlated Wix WebPs", () => {
  const approved = references.entries.filter(x => x.approved && x.status === "approved");
  const urls = Object.entries(wix.urls);
  assert.equal(urls.length, 39);
  assert.equal(new Set(urls.map(([, url]) => url)).size, 39);
  assert.equal(wix.wixSite, "Steam");
  assert.equal(wix.approvedMapped, 39);
  assert.equal(wix.blockedExcluded, 2);
  assert.equal(upload.files.length, 39);
  assert.equal(upload.uploadsReady, 39);
  assert.equal(upload.uploadFailures, 0);
  assert.equal(upload.metadataChecksPassed, 312);
  assert.equal(upload.metadataChecksFailed, 0);
  const byId = new Map(upload.files.map(x => [x.variantId, x]));
  for (const [id, url] of urls) {
    const reference = approved.find(x => x.variantId === id);
    assert.ok(reference, "Unapproved variant in Level 6 Wix URL map: " + id);
    const record = byId.get(id);
    assert.ok(record, "Missing media upload record: " + id);
    assert.equal(record.wixUrl, url);
    assert.equal(record.wixOperationStatus, "READY");
    assert.equal(record.sourceWebpSha256, reference.imageWebpSha256);
    assert.equal(record.sourcePdfSha256, reference.sourcePdfSha256);
    assert.equal(record.width, reference.imageWidth);
    assert.equal(record.height, reference.imageHeight);
    assert.equal(record.sourcePath, reference.imageWebp);
    assert.ok(record.sourceGitHubUrl.includes("/" + wix.workerSourceCommit + "/" + reference.imageWebp));
    assert.ok(Object.values(record.metadataChecks).every(Boolean));
    const parsed = new URL(url);
    assert.equal(parsed.protocol, "https:");
    assert.equal(parsed.hostname, "static.wixstatic.com");
    assert.match(parsed.pathname, /^\/media\/.+\.webp$/i);
  }
  assert.ok(!wix.urls["level-6-super-scorpion:optimized"]);
  assert.ok(!wix.urls["level-6-rock-paper-scissors-robot"]);
});

test("every approved Level 6 robot has exactly five independently verified official-PDF checks", () => {
  let verifiedQuestions = 0;
  const byId = new Map(checklists.entries.map(x => [x.variantId, x]));
  for (const reference of references.entries) {
    const checklist = byId.get(reference.variantId);
    assert.ok(checklist, "Missing checklist " + reference.variantId);
    assert.equal(checklist.sourcePdfSha256, reference.sourcePdfSha256);
    assert.equal(checklist.questions.length, 5);
    if (reference.approved) {
      assert.equal(checklist.approved, true);
      assert.match(reference.imageWebpSha256, /^[a-f0-9]{64}$/);
      assert.match(reference.sourcePdfSha256, /^[a-f0-9]{64}$/);
      assert.ok(reference.independentReviewer);
      assert.ok(reference.sourcePage >= 1);
      assert.ok(reference.imageWidth > 0 && reference.imageHeight > 0);
      for (const q of checklist.questions) {
        assert.equal(q.verified, true);
        assert.ok(q.text.trim().length > 0);
        assert.ok(q.evidencePages.every(p => Number.isInteger(p) && p > 0));
        verifiedQuestions++;
      }
    } else {
      assert.equal(checklist.approved, false);
      assert.ok(checklist.questions.every(q => q.verified === false));
    }
  }
  assert.equal(verifiedQuestions, 195);
});

test("Level 6 uses existing verified-only scanner, WebP renderer, and unchanged 15-minute rule", () => {
  assert.match(router, /getLevelSixEvidence\(projectId, variant\)/);
  assert.match(router, /getVerifiedFinalBuildPool/);
  assert.match(verified, /reference\.sourceUrl !== variant\.url/);
  assert.match(verified, /checklist\.questions\.length !== 5/);
  assert.match(verified, /question\.verified === true/);
  assert.match(verified, /!imageUrl \|\| !validHostedWebp\(imageUrl\)/);
  assert.match(exam, /getVerifiedFinalBuildPool\(level\)/);
  assert.match(exam, /const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(exam, /const SCAN_MS = 4200/);
  assert.match(exam, /prev\.checks\.filter\(Boolean\)\.length >= 4/);
  assert.match(exam, /overflow-y-auto/);
});
