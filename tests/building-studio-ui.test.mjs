import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const file = path => readFileSync(path, "utf8");
const studio = file("src/components/practical/BuildingStudio.tsx");
const route = file("src/routes/practical/$projectId.tsx");
const pdf = file("src/components/practical/AccelerationCarPdfViewer.tsx");
const manual = file("src/data/accelerationCarManual.ts");

test("universal building screen uses project-supplied step counts", () => {
  assert.match(studio, /export function BuildingStudioHeader/);
  assert.match(studio, /export function BuildingStepDrawer/);
  assert.match(studio, /export function BuildingFloatingDock/);
  assert.match(route, /total={project.steps.length}/);
  assert.match(route, /items={project.steps.map/);
  assert.doesNotMatch(studio, /14 categories|6 levels|Step 5 of 18/);
});

test("both PDF and 3D lessons share navigation and compact expandable docks", () => {
  assert.match(route, /<BuildingStudioHeader/);
  assert.match(route, /<BuildingStepDrawer/);
  assert.match(pdf, /<BuildingStudioHeader/);
  assert.match(pdf, /<BuildingStepDrawer/);
  assert.match(pdf, /<BuildingFloatingDock/);
  assert.match(file("src/components/practical/AssemblyLessonUI.tsx"), /data-dock-expanded={expanded}/);
  assert.match(studio, /aria-expanded={expanded}/);
  assert.match(studio, /min-h-12/);
});

test("official PDF is the only Acceleration Car building-instruction source", () => {
  assert.match(manual, /Acceleration car_Building\.pdf\?url/);
  assert.match(pdf, /<PdfManualPage/);
  assert.match(pdf, /ACCELERATION_ILLUSTRATION_NOTE/);
  assert.doesNotMatch(pdf, /battery holder|Insert the axles|Attach the long blue beam/i);
  assert.doesNotMatch(pdf, /<aside/);
  assert.match(pdf, /toggleStepCompleted/);
});
