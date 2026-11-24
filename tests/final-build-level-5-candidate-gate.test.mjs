import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const read = p => readFileSync(resolve(root,p),"utf8");
const json = p => JSON.parse(read(p));
const adapter = read("src/data/finalBuildVerified.ts");
const media = json("src/data/finalBuild/level-5-wix-candidates.json");
const urls = json("src/data/finalBuild/level-5-wix-image-urls.json");
const refs = json("src/data/finalBuild/level-5-references.json");
const questions = json("src/data/finalBuild/level-5-checklists.json");
const baseline = json("reports/final-build-level-5-wix-upload-plan-20261123.json");
const approvedExtra = new Set(["level-5-remote-control-car","level-5-voice-control-snail","level-5-voice-control-vehicle"]);
test("keep all historical 39 reference URLs exactly while adding only three reviewed variants", () => {
  assert.equal(baseline.uploads.length,39);
  for(const old of baseline.uploads) assert.equal(urls.urls[old.variantId],old.wixUrl);
  assert.equal(Object.keys(urls.urls).length,42);
  assert.equal(new Set(Object.values(urls.urls)).size,42);
  const added=Object.keys(urls.urls).filter(id=>!baseline.uploads.some(old=>old.variantId===id));
  assert.deepEqual(new Set(added),approvedExtra);
});
test("newly approved images have 5 independently verified source questions and exact matching Wix provenance", () => {
  for(const candidate of media.candidates) {
    const canPlay=approvedExtra.has(candidate.variantId);
    assert.equal(candidate.assessment.selectable,canPlay);
    assert.equal(candidate.assessment.studentApproved,canPlay);
    assert.equal(candidate.assessment.independentlyApprovedQuestions,canPlay?5:0);
    const ref=refs.items.find(x=>x.variantId===candidate.variantId);
    const check=questions.items.find(x=>x.variantId===candidate.variantId);
    assert.equal(ref?.approved,canPlay);
    assert.equal(check?.approved,canPlay);
    if(canPlay){
      assert.equal(check.questions.length,5);
      assert.equal(candidate.wix.operationStatus,"READY");
      assert.equal(candidate.wix.mediaState,"OK");
      assert.equal(candidate.wix.mimeType,"image/webp");
      assert.equal(candidate.wix.publicVisibilityVerified,true);
      assert.equal(candidate.wix.cdnByteForByteSha256Verified,true);
      assert.equal(candidate.wix.cdnHttpStatus,200);
      assert.equal(candidate.wix.hostedUrl,urls.urls[candidate.variantId]);
      assert.equal(candidate.wix.siteId,media.wixSite.id);
      assert.equal(ref.imageSha256,candidate.image.sha256);
      assert.equal(ref.sourceUrl,candidate.officialBuildingPdfUrl);
      assert.equal(ref.pdfSha256,candidate.historicalPdfSha256);
      assert.deepEqual(candidate.wix.dimensions,candidate.image.dimensions);
      for(const q of check.questions){
        assert.equal(q.sourcePdfSha256,ref.pdfSha256);
        assert.equal(q.evidencePage,ref.page);
      }
    } else {
      assert.equal(candidate.wix.operationStatus,"NOT_UPLOADED");
      assert.ok(!(candidate.variantId in urls.urls));
    }
  }
});
test("shared runtime must fail closed on a stale or inconsistent new candidate, without touching the original 39", () => {
  assert.match(adapter,/levelFiveWixCandidates/);
  assert.match(adapter,/candidateRows.length > 1/);
  assert.match(adapter,/approved.independentlyApprovedQuestions !== 5/);
  assert.match(adapter,/candidate.image.sha256 !== reference.imageSha256/);
  assert.match(adapter,/candidate.officialBuildingPdfUrl !== variant.url/);
  assert.match(adapter,/media.operationStatus !== "READY"/);
  assert.match(adapter,/media.cdnByteForByteSha256Verified/);
  assert.match(adapter,/media.hostedUrl !== candidateUrl/);
  assert.match(adapter,/candidate.requiredFileName/);
});
