import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = p => JSON.parse(readFileSync(new URL("../" + p, import.meta.url), "utf8"));
const fallbacks = read("src/data/finalBuild/level-4-source-limited-fallbacks.json");
const reference = read("src/data/finalBuild/level-4-references.json");
const checklists = read("src/data/finalBuild/level-4-checklists.json");
const wix = read("src/data/finalBuild/level-4-wix-image-urls.json");
test("48 existing approved WebPs and 240 independent checks remain untouched", () => {
  assert.equal(reference.records.filter(r => r.approval.status === "approved").length, 48);
  assert.equal(checklists.records.filter(r => r.status === "approved").length, 48);
  assert.equal(wix.records.length, 48);
  assert.equal(new Set(wix.records.map(r => r.url)).size, 48);
});
test("the two source-limited official PDF fallback experiences are identified honestly", () => {
  assert.deepEqual(fallbacks.entries.map(r => r.variantId).sort(), ["level-4-dangerous-assassin","level-4-horizontal-bar"]);
  for (const fallback of fallbacks.entries) {
    const source = reference.records.find(r => r.variantId === fallback.variantId);
    assert.ok(source);
    assert.equal(source.source.hostedPdfIdentityVerified, true);
    assert.equal(fallback.sourceUrl, source.source.wixUrl);
    assert.equal(fallback.sourcePdfSha256, source.source.hostedPdfSha256);
    assert.equal(fallback.sourcePage, source.reference.sourcePage);
    assert.equal(fallback.referenceMode, "official-pdf-construction-stage");
    assert.equal(fallback.verifiedFinishedModel, false);
    assert.equal(fallback.imageUrl, null);
    assert.equal(fallback.questions.length, 5);
    assert.equal(new Set(fallback.questions.map(q => q.id)).size, 5);
    assert.ok(fallback.questions.every(q => q.sourcePdfSha256 === fallback.sourcePdfSha256 && q.independentlyReviewed === false));
    assert.ok(!wix.urls[fallback.variantId]);
  }
});
test("all 50 official variants have 250 distinct assessment question records", () => {
  const questions = checklists.records.flatMap(r => r.status === "approved" ? r.questions : fallbacks.entries.find(f => f.variantId === r.variantId)?.questions ?? []);
  assert.equal(reference.records.length, 50);
  assert.equal(questions.length, 250);
  assert.equal(new Set(questions.map(q => q.id)).size, 250);
});
