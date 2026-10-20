import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const manual = read("src/data/accelerationCarManual.ts");
const practical = read("src/data/practical.ts");
const route = read("src/routes/practical/$projectId.tsx");
const viewer = read("src/components/practical/AccelerationCarPdfViewer.tsx");
const renderer = read("src/components/practical/PdfManualPage.tsx");

test("source document is exactly the GitHub PDF, not a substitute illustration", () => {
  const buffer = readFileSync(new URL("../Acceleration car_Building.pdf", import.meta.url));
  assert.equal(buffer.subarray(0, 5).toString("ascii"), "%PDF-");
  assert.match(manual, /Acceleration car_Building\.pdf\?url/);
  assert.match(manual, /ACCELERATION_EXPECTED_PAGES = 19/);
  assert.match(manual, /ACCELERATION_STEP_COUNT = 18/);
});

test("the official scanned PDF contains 19 pages and no selectable instruction text", async () => {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const file = new Uint8Array(readFileSync(new URL("../Acceleration car_Building.pdf", import.meta.url)));
  const loading = getDocument({ data: file });
  const document = await loading.promise;
  try {
    assert.equal(document.numPages, 19);
    for (let pageNumber = 2; pageNumber <= document.numPages; pageNumber++) {
      const page = await document.getPage(pageNumber);
      const text = await page.getTextContent();
      assert.equal(text.items.length, 0, `Unexpected extractable text on page ${pageNumber}`);
    }
  } finally {
    await loading.destroy();
  }
});

test("Project 2 is registered as exactly 18 neutral illustration-only steps", () => {
  assert.match(practical, /id: "acceleration-car"/);
  assert.match(practical, /number: 2,/);
  assert.match(practical, /Array\.from\(\{ length: 18 \}/);
  assert.match(practical, /originalManualStepNumbers: \[index \+ 1\]/);
  assert.match(practical, /Follow the assembly illustration shown in the manual\./);
  assert.doesNotMatch(practical, /const accelerationPreviewSteps/);
});

test("isolated Acceleration viewer preserves Marksman session behavior", () => {
  assert.match(route, /if \(project\.id === "acceleration-car"\)/);
  assert.match(route, /return <AccelerationCarPdfViewer \/>/);
  assert.match(route, /return <BuildSession key=\{project\.id\} project=\{project\} \/>/);
  assert.doesNotMatch(route, /AccelerationCarScene/);
});

test("viewer implements official-PDF navigation with minimal shared controls", () => {
  assert.match(viewer, /pageForStep\(firstNotFinished\)/);
  assert.match(viewer, /stepForPage\(page\)/);
  assert.match(viewer, /BuildingStudioHeader/);
  assert.match(viewer, /BuildingStepDrawer/);
  assert.match(viewer, /BuildingFloatingDock/);
  assert.match(viewer, /onPointerMove/);
  assert.match(viewer, /aria-label="Zoom in"/);
  assert.match(viewer, /aria-label="Zoom out"/);
  assert.match(viewer, /Fit whole manual page/);
  assert.match(viewer, /loaded\.numPages/);
  assert.match(viewer, /toggleStepCompleted/);
  assert.doesNotMatch(viewer + manual, /Hole [0-9]+|connector-first|3D assembly/i);
});

test("original PDF is rendered with rasterization, not reauthored step art", () => {
  assert.match(renderer, /\.render\(\{/);
  assert.match(renderer, /drawImage\(scratch, 0, 0\)/);
  assert.match(renderer, /task\?\.cancel\(\)/);
  assert.match(renderer, /pixelBudget = 8_000_000/);
  assert.doesNotMatch(viewer + renderer, /\.stl|three|glb|Canvas from "@react-three/);
});
