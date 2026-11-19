import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { wixPdfLinks, isProtectedCleanedLearningPdf, shouldExcludeWixPdf } from "../scripts/prune-vercel-wix-pdfs.mjs";

const links = wixPdfLinks();
const getText = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("all 590 original public PDF paths have an exact Wix link", () => {
  assert.equal(links.size, 590);
  for (const [filename, url] of links) {
    assert.ok(filename.endsWith(".pdf"), filename);
    assert.match(url, /^https:\/\/.+\.pdf$/, filename);
  }
});

test("Wix-hosted Building PDFs do not need copying into Vercel static output", () => {
  for (const file of [
    "Clock_Building.pdf",
    "Level 2/Learning/Action-Oriented/Axe robot/Axe robot_Powerpoint.pdf",
    "Level 3/Learning/Action-Oriented/Clip robot/Clip robot_Powerpoint.pdf",
    "Level 4/Building/Action-Oriented/Warrior With Claws/13. Warrior With Claws - Basic Building Manual.pdf",
    "Level 5/Building/Action-Oriented/Curling Game/2. Curling Game-Basic Building Manual.pdf",
    "Level 6/Building/Action-Oriented/Gorilla/04.Gorilla-Building Manual.pdf",
  ]) assert.equal(shouldExcludeWixPdf(file, links), true, file);
});

test("cleaned Learning PDFs are not silently replaced by old Wix versions", () => {
  const levelOne = "Level 1/Learning/Autonomous Navigation & Ranging/Acceleration car/Acceleration car_Powerpoint.pdf";
  const levelFour = "Level 4/Action-Oriented/Warrior With Claws/13. Warrior With Claws - Slides.pdf";
  assert.equal(links.has(levelOne), true);
  assert.equal(links.has(levelFour), true);
  assert.equal(isProtectedCleanedLearningPdf(levelOne), true);
  assert.equal(isProtectedCleanedLearningPdf(levelFour), true);
  assert.equal(shouldExcludeWixPdf(levelOne, links), false);
  assert.equal(shouldExcludeWixPdf(levelFour, links), false);
  assert.match(getText("src/data/staticPdfUrl.ts"), /if \(level === 1\) return localUrl/);
  assert.match(getText("src/data/levelFourLearning.ts"), /cleaned Learning PDFs must load from local static assets/);
});

test("Vercel ignore rules cover Wix PDFs but preserve cleaned local lessons", () => {
  const rules = getText(".vercelignore");
  for (const glob of [
    "public/*.pdf", "public/Level 2/**/*.pdf", "public/Level 3/**/*.pdf",
    "public/Level 4/Building/**/*.pdf", "public/Level 5/**/*.pdf",
    "public/Level 6/**/*.pdf"
  ]) assert.ok(rules.includes(glob), glob);
  assert.ok(!rules.includes("public/Level 1/**/*.pdf"));
  assert.ok(!rules.includes("public/Level 4/**/*.pdf"));
});

test("the build checks Wix mappings and prunes redundant build artifacts", () => {
  const pkg = JSON.parse(getText("package.json"));
  assert.match(pkg.scripts.build, /prune-vercel-wix-pdfs\.mjs --verify/);
  assert.match(pkg.scripts.build, /prune-vercel-wix-pdfs\.mjs --prune/);
});
