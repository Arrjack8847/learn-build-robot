import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const spec = readFileSync(new URL("../src/components/practical/AccelerationCarSteps6to10.ts", import.meta.url), "utf8");
const registry = readFileSync(new URL("../src/components/practical/AccelerationCarActionSpec.ts", import.meta.url), "utf8");
const scene = readFileSync(new URL("../src/components/practical/AccelerationCarScene.tsx", import.meta.url), "utf8");
const lesson = readFileSync(new URL("../src/components/practical/AccelerationCarAssembly.tsx", import.meta.url), "utf8");
const data = readFileSync(new URL("../src/data/practical.ts", import.meta.url), "utf8");
const route = readFileSync(new URL("../src/routes/practical/$projectId.tsx", import.meta.url), "utf8");

test("original Steps 6–10 expose all 24 actions in correct group sizes", () => {
  const actions = spec.split("export const ACCELERATION_STEP6_TO_10_ACTIONS:")[1].split("export const ACCELERATION_STEP6_TO_10_UNVERIFIED_JOINTS")[0];
  const counts = actions.split(/\n  \],\n/).slice(0, 5).map(section => (section.match(/\baction\("/g) ?? []).length);
  assert.deepEqual(counts, [4, 7, 5, 4, 4]);
  assert.equal(counts.reduce((sum, count) => sum + count), 24);
  assert.match(registry, /\.\.\.ACCELERATION_STEP6_TO_10_ACTIONS/);
  assert.match(registry, /\.\.\.ACCELERATION_STEP6_TO_10_TITLES/);
});

test("new joints are not falsely reported as verified", () => {
  assert.match(spec, /geometryVerified: false/);
  assert.match(spec, /proposed R1/);
  assert.match(spec, /candidate U3/);
  assert.match(spec, /unverified/i);
  assert.match(lesson, /not mechanically verified/);
  assert.match(registry, /\.\.\.ACCELERATION_STEP6_TO_10_UNVERIFIED_JOINTS/);
});

test("assembled parts remain visible when moving past Step 5", () => {
  assert.match(scene, /step >= 6 &&\s*<group position=\{shaftDock\}>/);
  assert.match(scene, /model="yellowGear"/);
  assert.match(scene, /part\.step < step/);
  assert.match(scene, /function StepSixJoint/);
  assert.match(scene, /phase === 3 && support\.current/);
  assert.match(scene, /greySupportPrepare, greySupportDock/);
  assert.match(scene, /greyPinPrepareLocal, greyPinDockLocal/);
  assert.match(scene, /id: "white-5-a", step: 7, action: 5/);
  assert.match(scene, /id: "white-7-a", step: 7, action: 6/);
  assert.match(scene, /id: "white-5-b", step: 8, action: 2/);
  assert.match(scene, /id: "white-7-b", step: 8, action: 3/);
  assert.match(scene, /id: "red-upright-a", step: 9, action: 1/);
  assert.match(scene, /id: "red-upright-b", step: 10, action: 1/);
});

test("available white-beam meshes are reused, not invented at runtime", () => {
  assert.match(scene, /32316_beam_5\.stl\?url/);
  assert.match(scene, /32524_beam_7\.stl\?url/);
  assert.match(scene, /No.*verified ZMROBO/i);
});

test("all five new manual steps use the interactive route", () => {
  for (let step = 6; step <= 10; step++) {
    assert.match(data, new RegExp('id: "acceleration-car-s' + step + '"'));
    assert.match(data, new RegExp("originalManualStepNumbers: \\[" + step + "\\]"));
  }
  assert.match(route, /isInteractiveAcceleration[\s\S]*currentStep\.number <= 10/);
  assert.match(lesson, /Guided review 1–10/);
});
