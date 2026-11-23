import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const refs = JSON.parse(read("src/data/finalBuild/level-2-references.json"));
const checks = JSON.parse(read("src/data/finalBuild/level-2-checklists.json"));
const ownerFallbacks = JSON.parse(read("src/data/finalBuild/level-2-owner-approved-pdf-fallbacks.json"));
const images = JSON.parse(read("src/data/finalBuild/level-2-wix-image-urls.json"));
const upload = JSON.parse(read("reports/final-build-level-2-wix-upload-20261123.json"));
const cdn = JSON.parse(read("reports/final-build-level-2-wix-cdn-sha256-20261123.json"));
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
  assert.match(levelTwoAdapter, /previousBlocks\.has\(variant\.id\)/);
  assert.match(levelTwoAdapter, /reference\.sourceUrl !== variant\.url/);
  assert.match(levelTwoAdapter, /checklist\.questions\.length !== 5/);
  assert.match(levelTwoAdapter, /getLevelTwoEvidence/);
  assert.match(levelTwoAdapter, /registered-pdf-fallback/);
  assert.match(levelTwoAdapter, /source\.url !== variant\.url/);
  assert.match(exam, /Open original PDF reference/);
  assert.match(exam, /showLevelTwoPdfFallback/);
  assert.match(exam, /model\.status === "error"/);
  assert.match(exam, /getVerifiedFinalBuildPool\(level\)/);
  assert.match(exam, /const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(exam, /prev\.checks\.filter\(Boolean\)\.length >= 4/);
});


test("30 independently downloaded Wix CDN bodies match source SHA-256, exact bytes and WebP dimensions", () => {
  assert.equal(cdn.testVectorSha256, "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(cdn.count, 30);
  assert.equal(cdn.passed, 30);
  assert.equal(cdn.failed, 0);
  assert.equal(cdn.results.length, 30);

  const unique = new Set();
  for (const result of cdn.results) {
    const reference = refs.references.find(item => item.variantId === result.id);
    assert.ok(reference, "CDN audit includes an unknown variant: " + result.id);
    assert.ok(!unique.has(result.id), "CDN audit contains duplicate variant: " + result.id);
    unique.add(result.id);
    assert.equal(result.url, images.urls[result.id]);
    assert.equal(result.httpStatus, 200);
    assert.equal(result.passed, true);
    assert.deepEqual(result.checks, {
      http200: true,
      webpRiff: true,
      sha256Matches: true,
      sizeMatches: true,
      dimensionsMatch: true,
    });
    assert.equal(result.expectedSha256, reference.imageSha256);
    assert.equal(result.actualSha256, reference.imageSha256);
    assert.equal(result.actualBytes, reference.imageBytes);
    assert.equal(result.actualWidth, reference.imageWidth);
    assert.equal(result.actualHeight, reference.imageHeight);
  }

  assert.equal(unique.size, 30);
  for (const blockedId of refs.blockedVariantIds) assert.ok(!unique.has(blockedId));
});

test("owner inclusion is distinct from independent Building-manual/image approval", () => {
  assert.equal(ownerFallbacks.level, 2);
  assert.equal(ownerFallbacks.registeredVariants, 60);
  assert.equal(ownerFallbacks.verifiedSourceWebpsPreserved, 30);
  assert.equal(ownerFallbacks.registeredPdfFallbackVariants, 30);
  assert.equal(ownerFallbacks.standaloneNewWebpsHosted, 0);
  assert.equal(ownerFallbacks.records.length, 30);
  const ids = new Set();
  const sourceUrls = new Set(refs.references.map(x => x.sourceUrl));
  const approvedIds = new Set(refs.references.map(x => x.variantId));
  for (const r of ownerFallbacks.records) {
    assert.ok(!ids.has(r.variantId), "duplicate fallback variant");
    assert.ok(!approvedIds.has(r.variantId), "already approved variant must not become fallback");
    ids.add(r.variantId);
    assert.equal(r.ownerAuthorized, true);
    assert.equal(r.independentlySourceApproved, false);
    assert.equal(r.studentInclusionMode, "registered-pdf-fallback");
    assert.equal(r.reference.mode, "original-registered-pdf");
    assert.equal(r.reference.sourceKindIndependentlyConfirmed, false);
    assert.equal(r.reference.sourcePdfBytesPreviouslyHashed, true);
    assert.equal(r.reference.sourcePdfRevalidatedThisChange, false);
    assert.match(r.reference.url, /^https:\/\/[^/]+\.usrfiles\.com\/.+\.pdf$/);
    assert.match(r.reference.sha256, /^[0-9a-f]{64}$/);
    assert.ok(r.reference.pageCount > 0);
    assert.ok(!sourceUrls.has(r.reference.url), "duplicate canonical source URL");
    sourceUrls.add(r.reference.url);
    assert.equal(r.image.approvedWebp, false);
    assert.equal(r.image.webpUrl, null);
    assert.equal(images.urls[r.variantId], undefined);
    assert.equal(r.assessment.provenance, "general-observable-not-pdf-page-verified");
    assert.equal(r.assessment.independentlyPdfVerified, false);
    assert.equal(r.assessment.questions.length, 5);
    for (const question of r.assessment.questions) {
      assert.ok(question.text.includes(r.officialName));
      assert.ok(question.text.trim().length > 25);
      assert.equal(question.evidenceType, "general-observable-not-pdf-verified");
      assert.equal(question.pdfPage, null);
    }
  }
  assert.equal(ids.size, 30);
  assert.deepEqual(ids, new Set(refs.blockedVariantIds));
  assert.deepEqual(ids, new Set(checks.blockedVariantIds));
  assert.equal(sourceUrls.size, 60);
  assert.equal(new Set([...approvedIds, ...ids]).size, 60);
  assert.equal(new Set([...refs.references.map(x => x.projectId), ...ownerFallbacks.records.map(x => x.projectId)]).size, 59);
  assert.equal(30 * 5 + ownerFallbacks.records.reduce((n, r) => n + r.assessment.questions.length, 0), 300);
});

test("fallback scanner/UI retains five checks, 4-of-5 pass, 15 minute timer and 4.2s scanner", () => {
  assert.match(exam, /const SCAN_MS = 4200/);
  assert.match(exam, /const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(exam, /prev\.checks\.filter\(Boolean\)\.length >= 4/);
  assert.match(exam, /showLevelTwoPdfFallback/);
  assert.match(exam, /approval\.sourceUrl === variant\.url/);
  assert.match(exam, /pictureReady \|\| showLevelTwoPdfFallback/);
  assert.match(exam, /target="_blank" rel="noopener noreferrer"/);
  assert.match(exam, /general observable checks, not independently verified/);
  assert.match(exam, /Retry Same Robot/);
  assert.match(exam, /Discover Another Robot/);
  assert.match(helper, /getVerifiedFinalBuildPool/);
  assert.match(levelTwoAdapter, /assessment\.questions\.length !== 5/);
});
