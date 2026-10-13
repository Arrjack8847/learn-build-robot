/**
 * Geometry smoke test for original, unmodified Marksman assets.
 * Invoked by GitHub Actions; does not need WebGL or external services.
 */
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const base = new URL("../3D for marksman/", import.meta.url);
function stl(relativePath) {
  const data = readFileSync(new URL(relativePath, base));
  assert.ok(data.length >= 84, relativePath + " is too short to be a binary STL");
  const triangleCount = data.readUInt32LE(80);
  assert.equal(84 + triangleCount * 50, data.length, relativePath + " has invalid triangle payload");
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < triangleCount; i++) {
    const offset = 84 + i * 50;
    for (let j = 0; j < 3; j++) {
      for (let axis = 0; axis < 3; axis++) {
        const value = data.readFloatLE(offset + 12 + j * 12 + axis * 4);
        assert.ok(Number.isFinite(value), relativePath + " has invalid coordinate");
        min[axis] = Math.min(min[axis], value);
        max[axis] = Math.max(max[axis], value);
      }
    }
  }
  const extent = max.map((v, i) => v - min[i]);
  console.log(relativePath, "triangles", triangleCount, "extents (mm)", extent.map(v => v.toFixed(3)).join(" x "));
  return { extent, min, max, data, triangleCount };
}
function near(actual, expected, label, tolerance = 0.12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, label + ": expected " + expected + ", received " + actual);
}

const axle = stl("axles/short.stl");
const disc = stl("beams/ROUND DISC.stl");
const beam = stl("beams/5.stl");
const pin = stl("connector/pin_pin.stl");
near(axle.extent[0], 24, "axle length");
near(disc.extent[0], 23.845, "disc diameter", 0.2);
near(disc.extent[2], 4, "disc thickness");
near(beam.extent[0], 39.3, "beam length");
near(pin.extent[2], 16, "connector length");

// The connector's central flange occupies approx. z=7.2533..8.7467 mm.
// Its total thickness is ~1.4934 mm, not a zero-thickness ring.
const cx = (pin.min[0] + pin.max[0]) / 2;
const cy = (pin.min[1] + pin.max[1]) / 2;
let flangeMin = Infinity, flangeMax = -Infinity;
for (let i = 0; i < pin.triangleCount; i++) {
  const start = 84 + i * 50 + 12;
  for (let j = 0; j < 3; j++) {
    const at = start + j * 12;
    const x = pin.data.readFloatLE(at) - cx;
    const y = pin.data.readFloatLE(at + 4) - cy;
    const z = pin.data.readFloatLE(at + 8);
    if (Math.hypot(x, y) > 2.55) {
      flangeMin = Math.min(flangeMin, z);
      flangeMax = Math.max(flangeMax, z);
    }
  }
}
near(flangeMax - flangeMin, 1.4934, "pin connector middle collar", 0.15);

// Confirm the motor is still real GLB geometry with a cable assembly.
const glb = readFileSync(new URL("mortor.glb", base));
assert.equal(glb.toString("ascii", 0, 4), "glTF");
assert.equal(glb.readUInt32LE(4), 2);
assert.equal(glb.readUInt32LE(8), glb.length);
assert.equal(glb.toString("ascii", 16, 20), "JSON");
const jsonLength = glb.readUInt32LE(12);
const model = JSON.parse(glb.toString("utf8", 20, 20 + jsonLength));
const names = (model.nodes ?? []).map(node => node.name).filter(Boolean);
assert.ok(names.some(name => name.includes("10091.dat")), "motor output hub not found");
assert.ok(names.some(name => name.includes("u9190")), "motor cable geometry not found");
console.log("Motor GLB verified; nodes", names.length, "size", glb.length, "bytes");
console.log("Geometry checks passed. Physical motor socket depth and connector identity are NOT verified.");
