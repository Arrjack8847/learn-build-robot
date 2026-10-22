import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const manifest = JSON.parse(read(".github/level-three-presentations.json"));
const pdfRegistry = read("src/data/pdfActivityManuals.ts");
const practical = read("src/data/practical.ts");
const route = read("src/routes/practical/levels.$levelNumber.$categoryId.tsx");
const viewer = read("src/components/practical/PdfActivityViewer.tsx");
const workflow = read(".github/workflows/convert-level-three-powerpoints.yml");
const converter = read(".github/scripts/convert-level-three-presentations.mjs");
const syllabusMatch = read("src/data/advancedSyllabus.ts").match(/export const ADVANCED_SYLLABUS = ([\s\S]*?) as const;/);
assert.ok(syllabusMatch, "Required official syllabus missing");
const level3 = JSON.parse(syllabusMatch[1])["3"];
const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

test("Exactly eight original Level 3 PowerPoints are mapped, without pretending to be building manuals", () => {
  assert.equal(manifest.level, 3);
  assert.equal(manifest.presentations.length, 8);
  const ids = new Set(), pairs = new Set(), pdfs = new Set();
  for (const item of manifest.presentations) {
    assert.ok(!ids.has(item.id), "Duplicate project ID: " + item.id);
    ids.add(item.id);
    assert.ok(!pdfs.has(item.pdf), "Duplicate output PDF: " + item.pdf);
    pdfs.add(item.pdf);
    const row = level3.find(row => slug(row[0]) === item.category);
    assert.ok(row?.slice(1).some(entry => slug(entry.replace(/\.(pptx|pdf)$/i, "")) === slug(item.title)),
      "PowerPoint placement not in syllabus: " + item.id);
    pairs.add(item.category + ":" + slug(item.title));
    const uploaded = readFileSync(new URL("../" + item.pptx, import.meta.url));
    assert.ok(uploaded.length > 10000 && uploaded[0] === 0x50 && uploaded[1] === 0x4b,
      "Original PPTX file is missing or invalid: " + item.pptx);
    assert.ok(pdfRegistry.includes('"'+item.id+'": {'), "Missing slide registry: " + item.id);
    assert.ok(pdfRegistry.includes('originalPowerPointFile: "'+item.pptx+'"'));
    assert.ok(pdfRegistry.includes('url: "/learning-slides/level-3/' + encodeURIComponent(item.pdf) + '"'));
    assert.ok(pdfRegistry.includes('completionStepId: "' + item.id + '-slides-complete"'));
    assert.ok(practical.includes('pdfManualProject("' + item.id + '", "' + item.title + '",'),
      "Missing Level 3 presentation route: " + item.id);
    assert.ok(practical.includes('"' + item.category + '", 3, "powerpoint")'),
      "Presentation must produce -slides-complete progress: " + item.id);
  }
  assert.equal(pairs.size, 8);
});

test("PDF helper uses separate presentation progress keys and labels", () => {
  assert.ok(practical.includes('sourceKind: "pdf" | "powerpoint" = "pdf"'));
  assert.ok(practical.includes('id: id + (isPresentation ? "-slides-complete" : "-manual-complete")'));
  assert.equal((practical.match(/, 3, "powerpoint"\),/g) ?? []).length, 8);
});

test("Slide viewer navigates existing PDF renderer without treating presentations as builds", () => {
  assert.ok(viewer.includes('manual.sourceKind === "powerpoint"'));
  assert.ok(viewer.includes('"Next Slide"'));
  assert.ok(viewer.includes('"Finish Slides"'));
  assert.ok(viewer.includes('mode={isPresentation ? "presentation" : "building"}'));
  assert.ok(route.includes('isPresentation ? "View slides" : "Open Building Studio"'));
  assert.ok(route.includes('"View PowerPoint slides"'));
});

test("GitHub Actions converts the verified PowerPoints and commits their derived PDF slides", () => {
  assert.ok(workflow.includes('workflow_dispatch:'));
  assert.ok(workflow.includes('sudo apt-get install'));
  assert.ok(workflow.includes('libreoffice-impress'));
  assert.ok(workflow.includes('contents: write'));
  assert.ok(workflow.includes('git push origin HEAD:main'));
  assert.ok(converter.includes('manifest.presentations'));
  assert.ok(converter.includes('pdfinfo'));
  assert.ok(!pdfRegistry.includes("../../Drawbridge.pdf?url"));
});

test("Unverified sources stay unavailable", () => {
  const noMatch = ["Flashlight Sensor", "Drawbridge", "Lunar Rover"];
  for (const name of noMatch) {
    assert.ok(!manifest.presentations.some(item => slug(item.title) === slug(name)), name);
  }
});
