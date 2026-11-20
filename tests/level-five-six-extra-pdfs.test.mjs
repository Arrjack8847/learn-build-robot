import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const source = read("../src/data/levelFiveSixExtraPdfs.ts");
const match = source.match(/export const levelFiveSixExtraPdfFiles: readonly SupplementaryPdfAsset\[\] = (\[[\s\S]*?\]);/);
assert.ok(match, "Extra PDF registry must be statically auditable");
const files = JSON.parse(match[1]);
test("All eight additional PDFs are present in GitHub and have distinct Wix links", () => {
  const gitPaths = execFileSync("git", ["-c", "core.quotePath=false", "ls-tree", "-r", "--name-only", "HEAD"], {encoding:"utf8"}).trim().split(/\r?\n/);
  const pdfs = gitPaths.filter(path => /\.pdf$/i.test(path));
  assert.equal(pdfs.length, 598);
  assert.equal(files.length, 8);
  assert.equal(files.filter(f => f.kind === "project").length, 4);
  assert.equal(files.filter(f => f.kind === "exam").length, 2);
  assert.equal(files.filter(f => f.kind === "copyright").length, 2);
  assert.equal(new Set(files.map(f=>f.path)).size, 8);
  assert.equal(new Set(files.map(f=>f.url)).size, 8);
  for (const file of files) {
    assert.ok(gitPaths.includes(file.path), "Missing extra source PDF: "+file.path);
    assert.match(file.url, /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf$/);
  }
});
test("Supplementary documents do not replace Learning or Building studio manuals", () => {
  const content = read("../src/data/levelFiveSixContent.ts");
  assert.doesNotMatch(content, /levelFiveSixExtraPdfFiles/);
  const project = read("../src/routes/projects.$projectId.tsx");
  assert.match(project, /getProjectSupplementaryPdfs/);
  assert.match(project, /Additional source document/);
  assert.match(project, /getLevelFiveSixBuildingManual/);
  const practical = read("../src/routes/practical/$projectId.tsx");
  assert.match(practical, /getLevelFiveSixBuildingManual/);
  assert.match(practical, /levelFiveSixLearningLectures/);
  assert.doesNotMatch(practical, /getProjectSupplementaryPdfs/,
    "supplementary PDFs must stay on overview cards rather than replacing studios");
});
