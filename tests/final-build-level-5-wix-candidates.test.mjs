import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const file = (p) => readFileSync(resolve(root, p));
const json = (p) => JSON.parse(file(p).toString("utf8"));
const c = json("src/data/finalBuild/level-5-wix-candidates.json");
const a = json("src/data/finalBuild/level-5-wix-image-urls.json");
const audit = json("src/data/finalBuild/level-5-audit.json");
const ids = new Set(c.candidates.map(x => x.variantId));

test("existing 39 approved Wix references are byte-for-byte untouched", () => {
  const bytes = file("src/data/finalBuild/level-5-wix-image-urls.json");
  const gitBlobSha = createHash("sha1")
    .update(Buffer.concat([Buffer.from("blob " + bytes.length + "\0"), bytes]))
    .digest("hex");
  assert.equal(gitBlobSha, "a91003d468226e4bf29f05ebf6342cb0bc9c04f1");
  assert.equal(a.approvedMapped, 39);
  assert.equal(Object.keys(a.urls).length, 39);
  assert.equal(c.immutableApprovedMapping.blobShaAtPreparation, gitBlobSha);
  assert.ok([...ids].every(id => !(id in a.urls)));
});

test("all six recovery candidates remain excluded from student selection", () => {
  assert.equal(c.candidates.length, 6);
  assert.equal(ids.size, 6);
  assert.equal(c.studentApproved, 0);
  const approvedIds = new Set(audit.studentScannerSelectableVariantIds);
  assert.ok([...ids].every(id => !approvedIds.has(id)));
  const knownIds = new Set(audit.variants.map(v => v.variantId));
  for (const item of c.candidates) {
    assert.ok(knownIds.has(item.variantId));
    assert.equal(item.currentRunPdfHashVerified, true);
    assert.equal(item.assessment.studentApproved, false);
    assert.equal(item.assessment.selectable, false);
    assert.equal(item.assessment.independentlyApprovedQuestions, 0);
    assert.match(item.officialBuildingPdfUrl, /^https:\/\/.+\.pdf$/);
    assert.match(item.historicalPdfSha256, /^[0-9a-f]{64}$/);
  }
});

test("ready media candidates have valid independent source evidence and remain candidate-only", () => {
  let ready = 0;
  let created = 0;
  for (const item of c.candidates) {
    if (item.image.webpCreated) created++;
    if (item.wix.operationStatus !== "READY") {
      assert.equal(item.wix.operationStatus, "NOT_UPLOADED");
      assert.equal(item.image.webpCreated, false);
      assert.equal(item.wix.hostedUrl, null);
      continue;
    }
    ready++;
    assert.equal(item.image.webpCreated, true);
    assert.equal(item.image.decoded, true);
    assert.match(item.image.sha256, /^[0-9a-f]{64}$/);
    assert.equal(item.image.filename, item.requiredFileName);
    assert.ok(item.image.sourceRasterMeanAbsoluteError < 24);
    assert.deepEqual(item.image.dimensions, item.wix.dimensions);
    assert.ok(item.image.dimensions[0] > 0 && item.image.dimensions[1] > 0);
    const bb = item.completedModelCrop.normalizedCoordinates;
    assert.equal(bb.length, 4);
    assert.ok(bb.every(n => typeof n === "number" && n >= 0 && n <= 1));
    assert.ok(bb[0] < bb[2] && bb[1] < bb[3]);
    assert.equal(item.completedModelCrop.pdfPage, item.image.sourcePage);
    assert.equal(item.wix.mediaState, "OK");
    assert.equal(item.wix.mimeType, "image/webp");
    assert.equal(item.wix.publicVisibilityVerified, true);
    assert.equal(item.wix.cdnHttpStatus, 200);
    assert.equal(item.wix.cdnByteForByteSha256Verified, true);
    assert.equal(item.wix.siteId, c.wixSite.id);
    assert.equal(item.wix.hostedUrl, "https://static.wixstatic.com/media/" + item.wix.mediaId);
    assert.ok(item.wix.sourceUrl.endsWith("/" + item.image.filename));
  }
  assert.equal(ready, c.wixReady);
  assert.equal(created, c.imageReady);
  assert.ok(ready <= 6);
  assert.equal(c.candidates.length - ready, 6 - c.wixReady);
});
