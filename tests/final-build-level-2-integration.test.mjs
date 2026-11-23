import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const refs = JSON.parse(read("src/data/finalBuild/level-2-references.json"));
const checks = JSON.parse(read("src/data/finalBuild/level-2-checklists.json"));
const images = JSON.parse(read("src/data/finalBuild/level-2-wix-image-urls.json"));
const upload = JSON.parse(read("reports/final-build-level-2-wix-upload-20261123.json"));
const helper = read("src/data/finalBuildVerified.ts");
const levelTwoAdapter = read("src/data/finalBuildLevel2Verified.ts");
const exam = read("src/components/practical/FinalBuildExam.tsx");

test("Level 2 only admits its 30 doubly-approved source-backed variants", () => {
  assert.equal(refs.references.length, 30);
  assert.equal(checks.checklists.length, 30);
  assert.equal(refs.blockedVariantIds.length, 30);
  assert.equal(checks.blockedVariantIds.length, 30);
  const blocked = new Set(refs.blockedVariantIds);
  assert.equal(blocked.size, 30);
  assert.deepEqual(new Set(checks.blockedVariantIds), blocked);
  const seen = new Set();
  let questions = 0;
  for (const ref of refs.references) {
    assert.ok(!seen.has(ref.variantId), "No duplicate approved variant IDs");
    seen.add(ref.variantId);
    assert.ok(!blocked.has(ref.variantId), "Blocked variant cannot be approved");
    assert.equal(ref.approved, true);
    assert.ok(ref.verifiedPasses >= 2);
    assert.equal(ref.projectId.startsWith("level-2-"), true);
    assert.match(ref.sourceSha256, /^[0-9a-f]{64}$/i);
    assert.match(ref.imageSha256, /^[0-9a-f]{64}$/i);
    assert.equal(ref.imageFilename, ref.variantId + ".webp");
    assert.equal(ref.imagePath, "/final-build/level-2/" + ref.imageFilename);
    assert.ok(ref.imageWidth > 0 && ref.imageHeight > 0 && ref.imageBytes > 0);
    assert.ok(ref.pdfPage > 0);
    const checklist = checks.checklists.find(item => item.variantId === ref.variantId);
    assert.ok(checklist && checklist.approved);
    assert.ok(checklist.approvalPasses >= 2);
    assert.equal(checklist.sourcePdfSha256, ref.sourceSha256);
    assert.equal(checklist.imageSha256, ref.imageSha256);
    assert.equal(checklist.questions.length, 5);
    for (const q of checklist.questions) {
      assert.ok(q.text.trim() && q.evidenceNote.trim());
      assert.ok(Number.isInteger(q.pdfPage) && q.pdfPage > 0);
      questions++;
    }
  }
  assert.equal(seen.size, 30);
  assert.equal(questions, 150);
});

test("30 Wix READY URLs match exact source filenames, hashes, metadata, and variant IDs", () => {
  assert.equal(images.wixSite, "Steam");
  assert.equal(images.wixSiteId, "fe3fa828-9f74-45e8-97f7-8d00cbb7fba0");
  assert.equal(images.approvedMapped, 30);
  assert.equal(images.blockedExcluded, 30);
  assert.equal(upload.uploads.length, 30);
  assert.equal(upload.summary.uploadedReady, 30);
  assert.equal(upload.summary.metadataChecksPassed, 390);
  assert.equal(upload.summary.metadataChecksExpected, 390);
  assert.equal(upload.summary.cdnhostedSha256Verified, false);
  assert.equal(Object.keys(images.urls).length, 30);
  const usedUrls = new Set();
  const usedMediaIds = new Set();
  for (const ref of refs.references) {
    const record = upload.uploads.find(item => item.variantId === ref.variantId);
    assert.ok(record, "Missing upload record: " + ref.variantId);
    assert.equal(record.sourceWebpSha256, ref.imageSha256);
    assert.equal(record.sourcePdfSha256, ref.sourceSha256);
    assert.equal(record.sourceWebpUrl,
      "https://raw.githubusercontent.com/Arrjack8847/learn-build-robot/" +
      "feat/final-build-level-2/public/final-build/level-2/" + ref.imageFilename);
    assert.deepEqual(record.expectedDimensions, [ref.imageWidth, ref.imageHeight]);
    assert.equal(record.expectedBytes, ref.imageBytes);
    assert.equal(record.uploadStatus, "READY");
    assert.equal(record.imageMetadataVerified, true);
    assert.ok(Object.values(record.checks).every(Boolean));
    assert.equal(record.wixUrl, images.urls[ref.variantId]);
    assert.equal(record.wixUrl, "https://static.wixstatic.com/media/" + record.wixMediaId);
    assert.ok(!usedUrls.has(record.wixUrl) && !usedMediaIds.has(record.wixMediaId));
    usedUrls.add(record.wixUrl);
    usedMediaIds.add(record.wixMediaId);
    const media = record.wixMetadata;
    assert.equal(media.displayName, ref.imageFilename);
    assert.equal(media.filename, ref.imageFilename);
    assert.equal(media.sourceUrl, record.sourceWebpUrl);
    assert.equal(media.mimeType, "image/webp");
    assert.equal(media.mediaType, "IMAGE");
    assert.equal(media.status, "READY");
    assert.equal(media.state, "OK");
    assert.equal(media.private, false);
    assert.equal(media.sizeInBytes, ref.imageBytes);
    assert.equal(media.width, ref.imageWidth);
    assert.equal(media.height, ref.imageHeight);
  }
  assert.equal(usedUrls.size, 30);
  for (const blockedId of refs.blockedVariantIds) {
    assert.equal(images.urls[blockedId], undefined);
  }
});

test("shared scanner uses Level 2 fail-closed adapter without replacing Level 5", () => {
  assert.match(helper, /import \{ getLevelTwoEvidence \} from/);
  assert.match(helper, /if \(level === 2\) return getLevelTwoEvidence\(projectId, variant\)/);
  assert.match(helper, /level !== 5 \|\| !variant\.hostedOnWix/);
  assert.match(levelTwoAdapter, /blocked\.has\(variant\.id\)/);
  assert.match(levelTwoAdapter, /reference\.sourceUrl !== variant\.url/);
  assert.match(levelTwoAdapter, /checklist\.questions\.length !== 5/);
  assert.match(levelTwoAdapter, /if \(!imageUrl \|\| !validWixWebpUrl\(imageUrl\)\) return null/);
  assert.match(exam, /getVerifiedFinalBuildPool\(level\)/);
  assert.match(exam, /const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(exam, /prev\.checks\.filter\(Boolean\)\.length >= 4/);
});
