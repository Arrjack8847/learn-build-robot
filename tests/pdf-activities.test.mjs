import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (file) => readFileSync(new URL("../" + file, import.meta.url), "utf8");
const sources = read("src/data/pdfActivityManuals.ts");
const practical = read("src/data/practical.ts");
const route = read("src/routes/practical/$projectId.tsx");
const catalog = read("src/routes/practical/index.tsx");
const viewer = read("src/components/practical/PdfActivityViewer.tsx");
const originalViewer = read("src/components/practical/AccelerationCarPdfViewer.tsx");
const syllabus = read("src/data/levelOneProjects.ts");

const manuals = [
  ["caged-bird", "Caged Bird.pdf"],
  ["funny-cat", "FUNNY CAT.pdf"],
  ["ferocious-snake", "Ferocious snake.pdf"],
  ["shy-penguin", "Shy penguin.pdf"],
  ["sled-dog", "Sled dog.pdf"],
  ["big-head-robot", "Big head robot_Building.pdf"],
  ["bird", "Bird.pdf"],
  ["first-robot-model", "First Robot Model.pdf"],
  ["house", "House_Building.pdf"],
  ["rex-robot", "REX robot_Building.pdf"],
  ["sled", "Sled_Building.pdf"],
  ["spider", "Spider.pdf"],
  ["spongebob", "SpongeBob_Building.pdf"],
  ["wali-robot", "Wali robot.pdf"],
  ["clock", "Clock_Building.pdf"],
  ["drawing-board", "Drawing board_Building.pdf"],
  ["hello-world", "01.Hello World-Building Manual.pdf"],
  ["mechanical-masks", "Mechanical masks.pdf"],
  ["primitive-robot", "Primitive robot_Building.pdf"],
];

test("the nineteen original uploaded PDFs exist and can be loaded", async () => {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  for (const [id, filename] of manuals) {
    const bytes = readFileSync(new URL("../" + filename, import.meta.url));
    assert.equal(bytes.subarray(0, 5).toString("ascii"), "%PDF-", filename);
    assert.ok(sources.includes('"' + id + '":'), "Missing PDF source: " + id);
    const task = getDocument({ data: new Uint8Array(bytes) });
    const document = await task.promise;
    try {
      assert.ok(document.numPages > 0, "Empty PDF: " + filename);
    } finally {
      await task.destroy();
    }
  }
});

test("every uploaded PDF is registered and receives isolated completion progress", () => {
  for (const [id] of manuals) {
    assert.ok(practical.includes('pdfManualProject("' + id + '"'));
    assert.ok(sources.includes('completionStepId: "' + id + '-manual-complete"'));
  }
  assert.match(syllabus, /"biomimicry"/);
  assert.match(syllabus, /"characters-structures"/);
  assert.match(syllabus, /"display-movement"/);
  for (const [id] of manuals) {
    assert.ok(syllabus.includes('"' + id + '"'), "Missing Level 1 project link: " + id);
  }
  assert.match(route, /<AccelerationCarPdfViewer \/>/);
  assert.match(route, /<PdfActivityViewer key=\{project.id\} manual=\{pdfManual\} \/>/);
  assert.match(catalog, /isPdfActivityProject\(project.id\)/);
});

test("original PDFs use dynamic page navigation rather than fabricated steps", () => {
  assert.match(viewer, /pdfDocument\?\.numPages/);
  assert.match(viewer, /Page /);
  assert.match(viewer, /toggleStepCompleted\(manual.completionStepId, true\)/);
  assert.match(viewer, /<PdfManualPage/);
  assert.doesNotMatch(viewer, /ACCELERATION_EXPECTED_PAGES|ACCELERATION_STEP_COUNT|stepForPage|pageForStep/);
  assert.match(originalViewer, /ACCELERATION_EXPECTED_PAGES/);
  assert.match(originalViewer, /ACCELERATION_STEP_COUNT/);
});
