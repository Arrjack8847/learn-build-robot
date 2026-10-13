import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

function meshBounds(filename) {
  const bytes = readFileSync(resolve("public/marksmanship/models", filename));
  const count = bytes.readUInt32LE(80);
  assert.equal(bytes.length, 84 + count * 50, filename + " must be a complete binary STL");
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let triangle = 0; triangle < count; triangle++) {
    const base = 84 + triangle * 50 + 12;
    for (let vertex = 0; vertex < 3; vertex++) {
      for (let axis = 0; axis < 3; axis++) {
        const value = bytes.readFloatLE(base + vertex * 12 + axis * 4);
        min[axis] = Math.min(min[axis], value);
        max[axis] = Math.max(max[axis], value);
      }
    }
  }
  return max.map((value, axis) => value - min[axis]);
}

function approximately(actual, expected, tolerance = 0.3) {
  assert.ok(Math.abs(actual - expected) < tolerance,
    "Expected " + actual + " mm to be within " + tolerance + " mm of " + expected + " mm");
}

test("Step 3 STL models are real, dimensionally consistent originals", () => {
  const beam = meshBounds("beam15.stl");
  approximately(beam[0], 119.3);
  approximately(beam[2], 7.8);
  const lBeam = meshBounds("beam-l-small.stl");
  approximately(lBeam[0], 15);
  approximately(lBeam[1], 31);
  approximately(lBeam[2], 8);
  approximately(meshBounds("connector-long.stl")[2], 24);
  approximately(meshBounds("pin-long-pin.stl")[2], 24);
  approximately(meshBounds("pin-pin.stl")[2], 16);
  approximately(meshBounds("axle-middle.stl")[0], 64);
  approximately(meshBounds("axle-connector.stl")[2], 8);
});

test("Step 3 logic keeps L beams and axle independent", () => {
  const source = readFileSync(resolve("src/components/practical/StepThreeScene.tsx"), "utf8");
  for (const part of ["leftL", "rightL", "mediumAxle", "axleConnector"]) {
    assert.ok(source.includes(part + ":"), "Missing independent pose: " + part);
  }
  assert.ok(source.includes("step4Applied: false"), "Step 4 must remain unimplemented");
  assert.ok(source.includes("mechanicallyVerified: false"), "Unverified choices must be explicit");
});

test("Step 3 L connectors use only the 8 mm short-arm end hole", () => {
  const scene = readFileSync(resolve("src/components/practical/StepThreeScene.tsx"), "utf8");
  const guide = readFileSync(resolve("src/components/practical/StepThreeAssembly.tsx"), "utf8");
  assert.ok(scene.includes("const local = new Vector3(1, 0, 0);"), "L-pin position must target short-arm tip (8 mm, 0 mm)");
  assert.ok(scene.includes("const lp = lPinAt(LEFT_L, LEFT_ANGLE);"));
  assert.ok(scene.includes("const rp = lPinAt(RIGHT_L, RIGHT_ANGLE);"));
  assert.ok(scene.includes("const lSpotL = lPinAt(LEFT_L, LEFT_ANGLE);"), "Highlight must target corrected hole");
  assert.ok(scene.includes("if (phase === 3) return lPinAt(LEFT_L, LEFT_ANGLE);"), "Camera focus must target corrected hole");
  assert.ok(scene.includes('l: "short arm free-end hole (x=8 mm, y=0 mm)"'));
  assert.ok(!scene.includes("config.lHole"), "Removed incorrect mounting-hole configuration");
  assert.ok(!guide.includes("Choose L-beam connector hole"), "Removed invalid hole selector");
  assert.ok(guide.includes("free-end hole of the short arm"), "Instructions should match the physical assembly");
  assert.ok(scene.includes("const LEFT_ANGLE = 0;"));
  assert.ok(scene.includes("const RIGHT_ANGLE = 0;"), "Existing L-beam orientations must remain untouched");
});
