import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const urlsSource = read("../src/data/levelFourWixPdfUrls.ts");
const learning = read("../src/data/levelFourLearning.ts");
const building = read("../src/data/levelFourBuilding.ts");
const json = urlsSource.match(/export const levelFourWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/);
assert.ok(json, "Level 4 Wix URL registry should be statically parseable");
const urls = JSON.parse(json[1]);
const missing = "Level 4/Building/Autonomous Navigation & Ranging/Guide Dogs/10. Guide Dogs - Basic Building Manual.pdf";

test("All 106 Level 4 PDFs have exact Wix URLs", () => {
  const paths = execFileSync("git", ["ls-tree", "-r", "--name-only", "HEAD", "public/Level 4"], { encoding: "utf8" })
    .trim().split(/\r?\n/).filter(path => path.toLowerCase().endsWith(".pdf"))
    .map(path => path.slice("public/".length));
  assert.equal(paths.length, 106);
  assert.equal(Object.keys(urls).length, 106);
  assert.deepEqual(Object.keys(urls).sort(), paths.sort());
  assert.equal(urls[missing], "https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/78042f_2b25803a2615468990aa682ff5e60e40.pdf");
  assert.equal(new Set(Object.values(urls)).size, 106);
  for (const value of Object.values(urls)) {
    assert.match(value, /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf$/);
  }
});

test("Level 4 Learning and Building studio PDFs use Wix if available, local otherwise", () => {
  assert.match(learning, /return levelFourWixPdfUrls\[path\] \?\? "\/" \+ path\.split/);
  assert.match(building, /return levelFourWixPdfUrls\[originalPath\] \?\? "\/Level%204\/Building\/"/);
  assert.match(learning, /originalPowerPointFile: lesson\.originalPowerPointFile/);
  assert.match(building, /hasLevelFourOptimizedManual/);
});
