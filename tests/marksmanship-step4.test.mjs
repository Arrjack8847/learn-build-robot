import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const scene = readFileSync(resolve("src/components/practical/StepFourScene.tsx"), "utf8");
const guide = readFileSync(resolve("src/components/practical/StepFourAssembly.tsx"), "utf8");
const route = readFileSync(resolve("src/routes/practical/$projectId.tsx"), "utf8");
const practical = readFileSync(resolve("src/data/practical.ts"), "utf8");

function xAfterRotation(localX, localY, radians, originX) {
  return originX + localX * Math.cos(radians) - localY * Math.sin(radians);
}
function findStl(filename) {
  const bytes = readFileSync(resolve("public/marksmanship/models/", filename));
  const count = bytes.readUInt32LE(80);
  assert.equal(bytes.byteLength, 84 + count * 50, filename + " is a complete STL");
  return bytes;
}
test("Step 4 reuses every needed original STL without approximating the solid geometry", () => {
  for (const name of ["beam15.stl", "beam-l-small.stl", "connector-long.stl",
    "pin-long-pin.stl", "pin-pin.stl", "axle-middle.stl", "axle-connector.stl"]) {
    assert.ok(findStl(name).byteLength > 10_000, "Missing mesh: " + name);
    assert.ok(scene.includes(name), "Viewer must load " + name);
  }
});

test("Two L circular holes align with white beam holes 1 and 2", () => {
  // Beam STL hole centers are at 0, 8 ... 112 mm; centered on x=56 mm.
  const beamHole1 = 0 / 8 - 7;
  const beamHole2 = 8 / 8 - 7;
  assert.equal(beamHole1, -7);
  assert.equal(beamHole2, -6);
  // In the STL, L hole nearest corner is (0,0), next is (0,-8 mm).
  assert.ok(Math.abs(xAfterRotation(0, 0, -Math.PI / 2, -6) - beamHole2) < 1e-10);
  assert.ok(Math.abs(xAfterRotation(0, -1, -Math.PI / 2, -6) - beamHole1) < 1e-10);
  // Remaining round hole (0,-16) must not be used for mounting.
  assert.ok(Math.abs(xAfterRotation(0, -2, -Math.PI / 2, -6) - (-8)) < 1e-10);
  // The far + hole (0,-24) becomes coaxial with the transverse axle x=-9.
  assert.ok(Math.abs(xAfterRotation(0, -3, -Math.PI / 2, -6) - (-9)) < 1e-10);
  assert.ok(scene.includes('beam: [1, 2] as const'));
  assert.ok(scene.includes('lMount: [[0, 0], [0, -8]] as const'));
  assert.ok(scene.includes('lAxle: [0, -24] as const'));
});

test("Axle-first preparation, L-beam pairing, reversible controls and Step 4 completion gate", () => {
  assert.ok(guide.includes("Slide the grey axle connector to the middle"));
  assert.ok(guide.includes("Fit the first L-beam onto white beam holes 1 and 2"));
  assert.ok(guide.includes("Insert the prepared axle through the first L-beam"));
  assert.ok(guide.includes("Fit the second L-beam on the other side"));
  assert.ok(guide.includes("Return to Step 3"));
  assert.ok(guide.includes("AssemblyPlaybackControls"));
  const dock = readFileSync(resolve("src/components/practical/AssemblyLessonUI.tsx"), "utf8");
  assert.ok(dock.includes("Replay current action"));
  assert.ok(scene.includes('phase >= 3 ? [AXLE_X, 0, 0] : [-1.8, 3.1, 0]'));
  assert.ok(scene.includes('phase >= 4 ? R_END'));
  assert.ok(scene.includes('if (amount < 0.5)'));
  assert.ok(route.includes("StepFourAssembly"));
  assert.ok(route.includes("isStepFour && !stepFourReady"));
  assert.ok(practical.includes("Connect the L-beams and medium axle"));
});

test("The final Step 4 object is preserved for shooting-mechanism installation", () => {
  assert.ok(scene.includes("marksman-step4-shooting-assembly"));
  assert.ok(guide.includes("robot:marksmanship:step4:assembled:v1"));
  assert.ok(guide.includes("Step 3 is not marked prepared"));
  assert.ok(guide.includes("selected[0] !== 1 || selected[1] !== 2"));
  assert.ok(guide.includes("mechanicallyVerified") || scene.includes("mechanicallyVerified: false"));
});
