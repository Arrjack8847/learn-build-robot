import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const spec = readFileSync(new URL("../src/components/practical/AccelerationCarActionSpec.ts", import.meta.url), "utf8");
const scene = readFileSync(new URL("../src/components/practical/AccelerationCarScene.tsx", import.meta.url), "utf8");
const assembly = readFileSync(new URL("../src/components/practical/AccelerationCarAssembly.tsx", import.meta.url), "utf8");

test("manual steps 1–5 declare 6, 3, 5, 4, 4 guided actions", () => {
  const text = spec.split("export const ACCELERATION_ACTIONS:")[1].split("export const ACCELERATION_ACTION_COUNT")[0];
  const actionCounts = text.split(/\n  \],\n/).slice(0, 5).map(group => (group.match(/\baction\("/g) || []).length);
  assert.deepEqual(actionCounts, [6, 3, 5, 4, 4]);
  assert.equal(actionCounts.reduce((a, b) => a + b, 0), 22);
});

test("unsupported physical accuracy is explicitly marked unverified", () => {
  assert.match(spec, /geometryVerified: false/);
  assert.match(spec, /proposed R4/i);
  assert.match(spec, /proposed R1/i);
  assert.match(spec, /BG1 stays occupied/);
  assert.match(assembly, /seating depth remain unverified/);
});

test("guided visual phases match the new action positions", () => {
  assert.match(scene, /step: 2, action: 2, model: "upperGear"/);
  assert.match(scene, /step: 3, action: 4, model: "shortAxle"/);
  assert.match(scene, /step: 4, action: 3, model: "largeL"/);
  assert.match(scene, /phase === 3 && group\.current/);
  assert.match(scene, /InspectionAction/);
});

test("a yellow gear placeholder is shown, not a yellow bushing", () => {
  assert.match(scene, /Lego 8 teeth\.stl\?url/);
  assert.match(scene, /model="yellowGear" color="#e4be37"/);
  assert.doesNotMatch(scene, /model="bush" color="#e4be37"/);
});
