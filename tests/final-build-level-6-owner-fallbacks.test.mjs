import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const data = (path) => JSON.parse(read(path));
const owner = data("src/data/finalBuild/level-6-owner-authorized-pdf-fallbacks.json");
const refs = data("src/data/finalBuild/level-6-references.json");
const checks = data("src/data/finalBuild/level-6-checklists.json");
const hosted = data("src/data/finalBuild/level-6-wix-image-urls.json");
const approved = refs.entries.filter(x => x.approved === true && x.status === "approved");

test("Level 6 offers exactly 39 unchanged Wix WebPs and 2 distinct owner-authorized PDF references", () => {
  assert.equal(owner.ownerAuthorized, true);
  assert.equal(owner.level, 6);
  assert.equal(owner.wixSiteId, "fe3fa828-9f74-45e8-97f7-8d00cbb7fba0");
  assert.equal(owner.entries.length, 2);
  assert.equal(hosted.approvedMapped, 39);
  assert.equal(hosted.blockedExcluded, 2);
  assert.equal(Object.keys(hosted.urls).length, 39);
  assert.equal(approved.length, 39);
  assert.equal(refs.entries.length, 41);
  assert.equal(checks.entries.length, 41);
  assert.equal(new Set([...Object.keys(hosted.urls), ...owner.entries.map(x => x.variantId)]).size, 41);
  assert.deepEqual(owner.entries.map(x => x.variantId).sort(), [
    "level-6-super-scorpion:optimized", "level-6-rock-paper-scissors-robot",
  ].sort());
});

test("fallback IDs are exact authentic Building PDF sources, not misleading WebP approvals", () => {
  for (const item of owner.entries) {
    const r = refs.entries.find(x => x.projectId === item.projectId && x.variantId === item.variantId);
    const q = checks.entries.find(x => x.projectId === item.projectId && x.variantId === item.variantId);
    assert.ok(r && q, "missing reference or checklist: " + item.variantId);
    assert.equal(r.approved, false);
    assert.equal(r.status, "blocked");
    assert.equal(q.approved, false);
    assert.equal(q.status, "blocked");
    assert.ok(q.questions.every(x => x.verified === false));
    assert.equal(item.sourceUrl, r.sourceUrl);
    assert.equal(item.sourcePdfSha256, r.sourcePdfSha256);
    assert.equal(item.sourcePdfSha256, q.sourcePdfSha256);
    assert.match(item.sourcePdfSha256, /^[a-f0-9]{64}$/);
    assert.match(item.sourceUrl, /^https:\/\/[^/]+\.usrfiles\.com\/ugd\/.+\.pdf$/);
    assert.equal(item.status, "owner-authorized-source-limited-fallback");
    assert.equal(item.referenceKind, "official-pdf-construction");
    assert.deepEqual(item.crop, { x: 0, y: 0, width: 1, height: 1 });
    assert.ok(item.notice.includes("not"));
    assert.ok(Number.isInteger(item.sourcePageCount) && item.sourcePageCount >= item.page);
    assert.ok(item.page >= 1);
    assert.equal(hosted.urls[item.variantId], undefined);
  }
});

test("205 offered assessment prompts are honestly classified; only original 195 carry source verification", () => {
  assert.equal(approved.length * 5, 195);
  assert.equal(owner.entries.reduce((n, x) => n + x.questions.length, 0), 10);
  assert.equal(195 + 10, 205);
  for (const item of owner.entries) {
    assert.equal(item.questions.length, 5);
    assert.equal(new Set(item.questions.map(q => q.text)).size, 5);
    for (const q of item.questions) {
      assert.ok(q.text.trim().endsWith("?"));
      assert.ok(q.text.length > 35);
      assert.ok(["official-page-observation", "general-construction-self-assessment"].includes(q.classification));
      assert.ok(q.evidencePages.every(p => Number.isInteger(p) && p >= 1 && p <= item.sourcePageCount));
      if (q.classification === "general-construction-self-assessment") assert.deepEqual(q.evidencePages, []);
      else assert.ok(q.evidencePages.length > 0);
    }
  }
});

test("shared integration uses original scanner and explicit PDF fallback without publishing blocked WebPs", () => {
  const adapterPath = "src/data/finalBuildLevel6Verified.ts";
  if (!existsSync(new URL("../" + adapterPath, import.meta.url))) return;
  const adapter = read(adapterPath);
  const exam = read("src/components/practical/FinalBuildExam.tsx");
  assert.match(adapter, /level-6-owner-authorized-pdf-fallbacks/);
  assert.match(adapter, /ownerAuthorized !== true/);
  assert.match(adapter, /reference\.approved !== false/);
  assert.match(adapter, /referenceMode: "registered-pdf-fallback"/);
  assert.match(adapter, /fallback\.questions\.length !== 5/);
  assert.match(exam, /level === 6/);
  assert.match(exam, /showRegisteredPdfFallback/);
  assert.match(exam, /const SCAN_MS = 4200/);
  assert.match(exam, /const LIMIT_MS = 15 \* 60 \* 1000/);
  assert.match(exam, /prev\.checks\.filter\(Boolean\)\.length >= 4/);
});
