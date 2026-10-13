
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const scene = readFileSync(resolve("src/components/practical/StepFiveAssembly.tsx"), "utf8");
const route = readFileSync(resolve("src/routes/practical/$projectId.tsx"), "utf8");
const data = readFileSync(resolve("src/data/practical.ts"), "utf8");

function verifyStl(filename, expectedBytes) {
  const bytes = readFileSync(resolve("public/marksmanship/models/", filename));
  const triangles = bytes.readUInt32LE(80);
  assert.equal(bytes.length, triangles * 50 + 84);
  assert.equal(bytes.length, expectedBytes);
}

test("Step 5 uses exactly the source STL beam and honest candidate pins", () => {
  verifyStl("beam11.stl",449884);
  verifyStl("pin-long-step5.stl",311684);
  verifyStl("pin-short-step5.stl",255584);
  assert.ok(scene.includes("Array.from({length:11}"));
  assert.ok(scene.includes("copy.scale(0.125") || scene.includes("result.scale(0.125"));
});

test("Step 5 avoids fabricating unavailable bridge/elbow geometry", () => {
  assert.ok(scene.includes("Missing original STL bodies"));
  assert.ok(scene.includes("No connector insertions are simulated"));
  assert.ok(scene.includes("full3DMeshesAvailable:false"));
  assert.ok(scene.includes("mechanicallyVerified:false"));
  assert.ok(scene.includes("beamUnattached:true"));
  assert.ok(scene.includes('robot:marksmanship:step4:assembled:v1'));
  assert.ok(scene.includes('robot:marksmanship:step5:prepared:v1'));
});

test("Step 5 integrates into the tutorial and requires honest manual confirmation", () => {
  assert.ok(route.includes("StepFiveAssembly"));
  assert.ok(route.includes("isStepFive && !stepFiveReady"));
  assert.ok(scene.includes("real physical pieces and manual"));
  assert.ok(scene.includes("steps/5.png"));
  assert.ok(scene.includes("steps/6.png"));
  assert.ok(data.includes("11-hole beam"));
});
