import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import ts from "typescript";

function stlSize(path) {
  const bytes = readFileSync(resolve(path));
  const n = bytes.readUInt32LE(80);
  assert.equal(bytes.length, 84 + n * 50, path + " must be a complete original binary STL");
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < n; i++) {
    const start = 84 + i * 50 + 12;
    for (let vertex = 0; vertex < 3; vertex++)
      for (let axis = 0; axis < 3; axis++) {
        const v = bytes.readFloatLE(start + vertex * 12 + axis * 4);
        min[axis] = Math.min(min[axis], v);
        max[axis] = Math.max(max[axis], v);
      }
  }
  return max.map((m, i) => m - min[i]);
}
const almost = (x, y, tolerance = 0.3) =>
  assert.ok(Math.abs(x - y) <= tolerance, "expected " + x + " near " + y);

const modulePath = "src/components/practical/marksmanFrameGeometry.ts";
const src = readFileSync(resolve(modulePath), "utf8");
const compiled = ts.transpileModule(src, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const g = await import("data:text/javascript;base64," + Buffer.from(compiled).toString("base64"));

test("all eleven tutorial parts are independently identified without duplicated meshes", () => {
  assert.equal(g.PART_IDS.length, 11);
  assert.equal(new Set(g.PART_IDS).size, 11);
  const poses = g.framePoses(10, g.DEFAULT_FRAME_CONFIG);
  assert.deepEqual(Object.keys(poses).sort(), [...g.PART_IDS].sort());
});

test("the exact original source STL models are dimensionally compatible", () => {
  const root = "3D for marksman/";
  almost(stlSize(root + "beams/5.stl")[0], 39.3);
  almost(stlSize(root + "beams/7.stl")[0], 55.3);
  almost(stlSize(root + "beams/15 beams.stl")[0], 119.3);
  for (const file of ["beams/5.stl", "beams/7.stl", "beams/15 beams.stl"])
    almost(stlSize(root + file)[2], 7.8);
  almost(stlSize(root + "connector/long connector.stl")[2], 24);
  almost(stlSize(root + "connector/pin_long_pin.stl")[2], 24);
  almost(stlSize(root + "connector/pin_pin.stl")[2], 16);
});

test("crossbeam endpoint holes and rail holes share 4 coaxial pin anchors", () => {
  for (const near of [0, 1]) {
    const cfg = { ...g.DEFAULT_FRAME_CONFIG, firstMount: near };
    for (const side of ["A", "B"]) for (const row of [0, 1]) {
      const rail = g.railHole(side, row === 0 ? near : 4, cfg);
      const cross = g.crossbeamHole(side, row, cfg);
      const pin = g.longPinAnchor(side, row, cfg);
      almost(cross[0], rail[0], 0.00001);
      almost(cross[1], rail[1], 0.00001);
      almost(pin[0], rail[0], 0.00001);
      almost(pin[1], rail[1], 0.00001);
      almost(cross[2] - rail[2], (7.8 + 1.5) / 8, 0.00001);
    }
    // Even after both crossbeams are mounted, the 7-hole rail extends 2 pitches.
    almost(g.railHole("A", 6, cfg)[1] - g.crossbeamHole("A", 1, cfg)[1], 2, 0.00001);
  }
});

test("each animation state keeps a stable part set, frame is U then rectangular", () => {
  const cfg = g.DEFAULT_FRAME_CONFIG;
  for (let phase = 0; phase <= 10; phase++) {
    const s = g.framePoses(phase, cfg);
    assert.equal(Object.keys(s).length, 11);
    for (const id of g.PART_IDS)
      assert.ok(s[id].position.every(Number.isFinite), id + " phase " + phase);
  }
  assert.deepEqual(g.framePoses(5, cfg).FRAME_BEAM_5_A.position, [0, 0, g.BEAM_LEVEL_Z]);
  assert.notDeepEqual(g.framePoses(6, cfg).FRAME_BEAM_5_B.position,
    g.framePoses(7, cfg).FRAME_BEAM_5_B.position);
  assert.deepEqual(g.framePoses(7, cfg).FRAME_BEAM_5_B.position, [0, 4, g.BEAM_LEVEL_Z]);
  // Beam15 is never part of the frame; it does not translate into the rectangle.
  for (let phase = 0; phase <= 10; phase++)
    assert.deepEqual(g.framePoses(phase, cfg).FRAME_BEAM_15.position, [7.5, 1.5, 0]);
});

test("historic frame source remains available while the revised frame is routed only to Step 8", () => {
  const data = readFileSync(resolve("src/data/practical.ts"), "utf8");
  const list=data.slice(data.indexOf("const marksmanshipSteps:"),data.indexOf("export const practicalProjects:"));
  assert.equal([...list.matchAll(/^    number: (\\d+),/gm)].length, 32);
  assert.equal([...list.matchAll(/id: "marksmanship-s\\d+"/g)].length, 29);
  assert.ok(list.includes('originalManualStepNumbers: [7, 8]'));
  for(let step=9;step<=31;step++)
    assert.ok(list.includes("originalManualStepNumbers: ["+step+"]"));
  const route = readFileSync(resolve("src/routes/practical/$projectId.tsx"), "utf8");
  assert.ok(route.includes('<StepSevenRailsAssembly onCompleteStep={finishCurrentStep} />'));
  assert.ok(route.includes('<StepEightAssembly onReadyChange={() => {}}'));
  assert.ok(!route.includes('<MarksmanFramePreparation onCompleteStep={finishCurrentStep} />'),
    "old pre-migration frame viewer must not remain mounted as interactive Step 7");
  assert.ok(!route.includes("showFrameTutorial"), "must not be globally mounted");
  for(const old of ["StepThreeAssembly","StepFourAssembly","Marksman3DPreview"])
    assert.ok(route.includes(old),old+" integration must remain");
  const scene=readFileSync(resolve("src/components/practical/StepEightScene.tsx"),"utf8");
  for(const file of ["7.stl?url","5.stl?url","15 beams.stl?url",
    "long connector.stl?url","pin_pin.stl?url"])
    assert.ok(scene.includes(file),file+" original mesh must remain loaded");
});

test("unresolved photo-specific mounting details remain explicitly not verified", () => {
  assert.equal(g.VERIFICATION.mechanicallyVerified, false);
  assert.equal(g.DEFAULT_FRAME_CONFIG.firstMount, 0);
  assert.deepEqual(g.DEFAULT_FRAME_CONFIG.beam15Holes, [4, 7]);
  const guide = readFileSync(resolve("src/components/practical/MarksmanFramePreparation.tsx"), "utf8");
  assert.ok(guide.includes("not physically verified"));
  assert.ok(guide.includes("Official Step 9"));
  assert.ok(guide.includes("reducedMotion"));
  assert.ok(guide.includes("AssemblyStage"),"Floating-dock 3D stage must be used");
  assert.ok(guide.includes("Original STL meshes"),"Mechanical disclaimer must stay visible");
  assert.ok(!guide.includes("Calibration choices (unverified)"),"Calibration selectors are not student controls");
  const shared = readFileSync(resolve("src/components/practical/AssemblyLessonUI.tsx"), "utf8");
  for (const control of ["Previous", "Next Action", "Replay", "Pause", "Reset view"])
    assert.ok(shared.includes(control), "missing shared 3D control: " + control);
  assert.ok(guide.includes("AssemblyPlaybackControls"));
  assert.ok(guide.includes("AssemblyUtilityControls"));
});
