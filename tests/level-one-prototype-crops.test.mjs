import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const readJson = path => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const map = readJson("../src/data/levelOnePrototypeCrops.json");
const audit = readJson("../audits/level1-prototype-page-candidates-20261119.json");

test("all 60 Level 1 source manuals have one matching candidate crop", () => {
  assert.equal(map.references.length, 60);
  assert.equal(audit.candidatePages.length, 60);
  const byFile = new Map(map.references.map(x => [x.filename, x]));
  assert.equal(byFile.size, 60);
  for (const source of audit.candidatePages) {
    const entry = byFile.get(source.filename);
    assert.ok(entry, `Missing prototype for ${source.filename}`);
    assert.equal(entry.page, source.page);
    assert.equal(entry.kind, source.kind);
    assert.equal(entry.approved, false, "No student reference should be approved without final visual review");
    const { x, y, width, height } = entry.crop;
    for (const v of [x, y, width, height]) assert.ok(Number.isFinite(v));
    assert.ok(x >= 0 && y >= 0 && width > 0 && height > 0, entry.filename);
    assert.ok(x + width <= 1 && y + height <= 1, entry.filename);
  }
});

test("Crawl Slowly retains two independent official PDF candidate references", () => {
  const filenames = map.references.filter(x => /Crawl Slowly/.test(x.filename)).map(x => x.filename);
  assert.deepEqual(filenames.sort(), [
    "9. Crawl Slowly - Basic Building Manual.pdf",
    "9. Crawl Slowly - Optimized Building Manual.pdf",
  ]);
});

test("PDF reference viewer displays a crop only and never offers step navigation", () => {
  const component = readFileSync(new URL("../src/components/practical/FinalBuildPrototype.tsx", import.meta.url), "utf8");
  assert.match(component, /document\.getPage\(pageNumber\)/);
  assert.match(component, /viewport\.width \* crop\.x/);
  assert.match(component, /viewport\.height \* crop\.y/);
  assert.doesNotMatch(component, /<iframe|<object|<embed|window\.open|download=/);
});

test("student Start button is gated on approved reference and successful PDF render", () => {
  const route = readFileSync(new URL("../src/routes/practical/level-1.final-build.tsx", import.meta.url), "utf8");
  assert.match(route, /const canStart = Boolean\(candidate\?\.approved && modelReady\)/);
  assert.match(route, /disabled=\{!canStart\}/);
  assert.match(route, /reviewMode && candidate && !candidate\.approved && modelReady/);
});
