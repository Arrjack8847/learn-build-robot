import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const mapping = read("../src/data/levelOneToThreeWixPdfUrls.ts");
const match = mapping.match(/export const levelOneToThreeWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/);
assert.ok(match, "Wix Level 1–3 registry should be parseable");
const urls = JSON.parse(match[1]);

test("All 304 Level 1–3 PDFs (172 legacy root + 132 Learning) are mapped", () => {
  const tracked = execFileSync("git", ["ls-tree", "-r", "--name-only", "HEAD", "public"], {encoding: "utf8"})
    .trim().split(/\r?\n/).filter(path =>
      /^(?:public\/Level [123]\/|public\/[^/]+\.pdf$)/i.test(path) && path.toLowerCase().endsWith(".pdf"))
    .map(path => path.slice("public/".length));
  assert.equal(tracked.length, 304);
  assert.equal(tracked.filter(p=>!p.includes("/")).length, 172);
  assert.equal(tracked.filter(p=>p.startsWith("Level 1/")).length, 45);
  assert.equal(tracked.filter(p=>p.startsWith("Level 2/")).length, 44);
  assert.equal(tracked.filter(p=>p.startsWith("Level 3/")).length, 43);
  assert.deepEqual(Object.keys(urls).sort(), tracked.sort());
  assert.equal(new Set(Object.values(urls)).size, 304);
  for (const url of Object.values(urls))
    assert.match(url, /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf$/);
});
test("All Levels 1–3 Learning resolve to cleaned Wix PDFs while Building retains original URLs", () => {
  const resolver=read("../src/data/staticPdfUrl.ts");
  assert.match(resolver, /levelOneToThreeWixPdfUrls\[filename\] \?\? "\/" \+ encodeURIComponent\(filename\)/);
  assert.match(resolver, /const localUrl = "\/" \+ path.split/);
  assert.doesNotMatch(resolver, /if \(level === 1\) return localUrl/);
  assert.match(resolver, /return levelOneToThreeWixPdfUrls\[path\] \?\? localUrl/);
  for (const [level, file] of [[1,"levelOneLectures.ts"],[2,"levelTwoLectures.ts"],[3,"levelThreeLectures.ts"]]) {
    const content=read("../src/data/"+file);
    assert.ok(content.includes("levelOneToThreeLearningPdfUrl("+level+", relativePath)"));
    assert.match(content, /url: (?:buildingManual|manual)\.url/);
  }
});
test("Recovered Wix failed-manifest entries have exact hosted URL records", () => {
  for (const file of ["13.Super Trajectory Robot 1-update.pdf","Balance_v2.pdf","Fare Gate.pdf","Fire ladder.pdf","Gyro transmitter_Building.pdf"])
    assert.ok(urls[file],file);
});
