import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const data = JSON.parse(read("src/data/finalBuild/level-3-owner-authorized.json"));
const sha = /^[0-9a-f]{64}$/;
const site = "fe3fa828-9f74-45e8-97f7-8d00cbb7fba0";

test("Level 3 owner approval is distinct from independent completed-model approval", () => {
  assert.equal(data.level, 3);
  assert.equal(data.wixSiteId, site);
  assert.equal(data.records.length, 42);
  assert.equal(data.counts.ownerAuthorizedWebpUrls, 42);
  assert.equal(data.counts.independentlyApprovedImages, 0);
  assert.equal(data.counts.independentlyApprovedQuestions, 0);
  assert.equal(new Set(data.records.map(x => x.variantId)).size, 42);
  assert.equal(new Set(data.records.map(x => x.projectId)).size, 39);
  assert.equal(new Set(data.records.map(x => x.source.mediaId)).size, 40);
  assert.ok(data.records.every(x => x.ownerAuthorized && !x.independentImageApproval &&
    !x.independentQuestionApproval));
});

test("42 Wix-hosted WebP records have exact source, source-match page, media and public CDN provenance", () => {
  const hosted = new Set();
  for (const x of data.records) {
    assert.match(x.variantId, /^level-3-/);
    assert.match(x.source.pdfSha256, sha);
    assert.match(x.source.url, /^https:\/\/.+\.usrfiles\.com\/.+\.pdf$/);
    assert.equal(x.source.completedAssemblyIndependentlyConfirmed, false);
    assert.ok(Number.isInteger(x.source.pageCount) && x.source.pageCount >= x.source.sourcePage);
    assert.ok(x.source.sourcePage >= 1);
    const c = x.source.cropNormalized;
    assert.ok([c.x,c.y,c.width,c.height].every(Number.isFinite));
    assert.ok(c.x >= 0 && c.y >= 0 && c.width > 0 && c.height > 0);
    assert.ok(c.x + c.width <= 1.000001 && c.y + c.height <= 1.000001);
    const m = x.image;
    assert.equal(m.operationStatus, "READY");
    assert.equal(m.mediaState, "OK");
    assert.equal(m.mimeType, "image/webp");
    assert.equal(m.publicVisibility, true);
    assert.equal(m.siteId, site);
    assert.equal(m.hostedHttpStatus, 200);
    assert.equal(m.sourceFromOfficialPdfPage, true);
    assert.equal(m.completedAssemblyIndependentlyConfirmed, false);
    assert.match(m.hostedSha256, sha);
    assert.ok(m.hostedBytes > 0 && m.width >= 160 && m.height >= 160);
    assert.equal(m.hostedUrl, "https://static.wixstatic.com/media/" + m.mediaId);
    assert.equal(m.sourceGitUrl,
      "https://raw.githubusercontent.com/Arrjack8847/learn-build-robot/" +
      data.sourceWorkerHead + "/assets/final-build/level-3/unapproved-source-crops/" +
      x.variantId + "-source-proposal.webp");
    assert.ok(!hosted.has(m.hostedUrl), "duplicate hosted image URL: " + x.variantId);
    hosted.add(m.hostedUrl);
  }
  assert.equal(hosted.size, 42);
});

test("210 exact-variant owner-authorized checklist questions have full PDF hash/page provenance", () => {
  const all = [];
  for (const x of data.records) {
    assert.equal(x.questions.length, 5, x.variantId);
    for (const q of x.questions) {
      assert.ok(q.text.trim().length > 20);
      assert.equal(q.sourcePdfSha256, x.source.pdfSha256);
      assert.ok(Number.isInteger(q.evidencePage) && q.evidencePage >= 1 &&
        q.evidencePage <= x.source.pageCount);
      assert.equal(q.reviewStatus, "owner-authorized-candidate-not-independently-validated");
      all.push(q.text);
    }
  }
  assert.equal(all.length, 210);
  assert.equal(new Set(all).size, 210);
});
