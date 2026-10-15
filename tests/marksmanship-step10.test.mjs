import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import ts from "typescript";

const read = path => readFileSync(resolve(path), "utf8");
const source = read("src/components/practical/stepTenGeometry.ts");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const g = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const scene = read("src/components/practical/StepTenScene.tsx");
const lesson = read("src/components/practical/StepTenAssembly.tsx");
const route = read("src/routes/practical/$projectId.tsx");
const data = read("src/data/practical.ts");

test("step 10 uses the exact five white-hole positions corrected by the user", () => {
  assert.deepEqual(g.STEP_TEN_WHITE_HOLES, {
    endBlue: 1, blackFree: 3, grayBlueFirst: 6, grayBlueSecond: 12, blackBridge: 15,
  });
  assert.equal(g.STEP_TEN_GRAY_HOLES.first, 3);
  assert.equal(g.STEP_TEN_GRAY_HOLES.second, 9);
  assert.deepEqual(g.stepTenHolePairs(), [{ white: 6, gray: 3 }, { white: 12, gray: 9 }]);
  assert.equal(g.stepTenValidate().length, 0);
  assert.equal(g.whiteHoleX(6), g.grayHoleX(3));
  assert.equal(g.whiteHoleX(12), g.grayHoleX(9));
  assert.throws(() => g.whiteHoleX(16));
});

test("photo-based step 10 includes two full units and all remaining connector parts", () => {
  assert.deepEqual(g.STEP_TEN_COMPONENT_COUNTS, {
    white15: 2, gray9: 2, bluePins: 6, blackPins: 5, blackBeam3: 1, brownSpacer: 1,
  });
  assert.equal(g.STEP_TEN_PARTS.length, 17);
  assert.equal(g.STEP_TEN_ACTIONS.length, 21);
  assert.equal(g.STEP_TEN_ACTIONS[0].number, "0");
  assert.match(g.STEP_TEN_ACTIONS[12].instruction, /Hole 3/);
  assert.match(g.STEP_TEN_ACTIONS[12].instruction, /never Hole 2/);
  assert.match(g.STEP_TEN_ACTIONS[19].instruction, /Bridge Hole 2/);
});

test("all poses are deterministic, finite and physically hole-aligned", () => {
  const ids = new Set(g.STEP_TEN_PARTS);
  for (let phase = 0; phase <= g.STEP_TEN_FINAL_PHASE; phase++) {
    const a = g.stepTenPoses(phase);
    const b = g.stepTenPoses(phase);
    assert.deepEqual(a, b);
    assert.deepEqual(new Set(Object.keys(a)), ids);
    for (const item of Object.values(a))
      assert.ok([...item.position, ...item.rotation].every(Number.isFinite));
  }
  const first = g.stepTenPoses(7);
  assert.equal(first.GRAY_A.position[0], first.WHITE_A.position[0]);
  assert.equal(first.GRAY_A.position[1], first.WHITE_A.position[1]);
  const second = g.stepTenPoses(14);
  assert.equal(second.GRAY_B.position[1], second.WHITE_B.position[1]);
  const paired = g.stepTenPoses(15);
  assert.deepEqual([paired.WHITE_A.position[1], paired.WHITE_B.position[1]], [-1, 1]);
  const joined = g.stepTenPoses(17);
  assert.equal(joined.BRIDGE_3.position[0], g.whiteHoleX(15));
  assert.equal(joined.BRIDGE_3.rotation[2], Math.PI / 2);
  assert.equal(joined.BRIDGE_3.position[1] - 1, joined.WHITE_A.position[1]);
  assert.equal(joined.BRIDGE_3.position[1] + 1, joined.WHITE_B.position[1]);
  const completed = g.stepTenPoses(20);
  assert.deepEqual(completed.BROWN_SPACER.position.slice(0, 2), completed.BRIDGE_3.position.slice(0, 2));
  assert.deepEqual(completed.CENTER_BLACK.position.slice(0, 2), completed.BRIDGE_3.position.slice(0, 2));
  assert.deepEqual(g.stepTenPoses(20), g.stepTenPoses(19));
});


test("each Hole 3 black connector sits on the opposite face from the gray beam", () => {
  for (const [unit, beforePhase, installedPhase] of [["A", 4, 5], ["B", 11, 12]]) {
    const before = g.stepTenPoses(beforePhase);
    const mounted = g.stepTenPoses(installedPhase);
    // The gray beam is still loose during black-pin insertion; compare
    // against its seated position at the end of that unit's build.
    const seated = g.stepTenPoses(unit === "A" ? 7 : 14);
    const gray = seated["GRAY_" + unit];
    const white = mounted["WHITE_" + unit];
    const black = mounted["BLACK_" + unit + "_3"];
    assert.ok(gray.position[2] > white.position[2], unit + " gray is on +Z when seated");
    assert.ok(black.position[2] < white.position[2], unit + " Hole 3 black is on -Z");
    assert.equal(black.position[0], g.whiteHoleX(3));
    assert.equal(black.position[1], white.position[1]);
    assert.ok(before["BLACK_" + unit + "_3"].position[2] < white.position[2],
      unit + " loose pin starts on the correct face before insertion");
    assert.deepEqual(g.stepTenHighlight(installedPhase).holes, [3]);
    assert.equal(g.stepTenHighlight(installedPhase).face, -1);
  }
  assert.match(g.STEP_TEN_ACTIONS[5].instruction, /OPPOSITE face/);
  assert.match(g.STEP_TEN_ACTIONS[12].instruction, /OPPOSITE face/);
  assert.ok(scene.includes('part === "BLACK_A_3" || part === "BLACK_B_3"'));
  assert.ok(scene.includes("phase === 5 || phase === 12"));
  assert.ok(lesson.includes('blackHole3Face: "opposite-gray"'));
});

test("three blue pins on each white beam remain visible from both outer faces", () => {
  const pitch = g.STEP_TEN_PITCH_MM;
  const halfWhiteBeam = (7.8 / pitch) / 2;
  const halfGrayBeam = (7.8 / pitch) / 2;
  const halfBluePin = (24 / pitch) / 2;
  for (const [unit, phase] of [["A", 7], ["B", 14]]) {
    const positions = g.stepTenPoses(phase);
    const white = positions["WHITE_" + unit];
    const gray = positions["GRAY_" + unit];
    const firstBlue = positions["BLUE_" + unit + "_1"];
    assert.equal(firstBlue.position[2], white.position[2]);
    assert.ok(firstBlue.position[2] - halfBluePin < white.position[2] - halfWhiteBeam);
    assert.ok(firstBlue.position[2] + halfBluePin > white.position[2] + halfWhiteBeam);
    for (const [whiteHole, grayHole] of [[6, 3], [12, 9]]) {
      const blue = positions["BLUE_" + unit + "_" + whiteHole];
      assert.equal(blue.position[0], g.whiteHoleX(whiteHole));
      assert.equal(g.whiteHoleX(whiteHole), g.grayHoleX(grayHole));
      const whiteOutside = white.position[2] - halfWhiteBeam;
      const grayOutside = gray.position[2] + halfGrayBeam;
      const protrudeWhite = whiteOutside - (blue.position[2] - halfBluePin);
      const protrudeGray = (blue.position[2] + halfBluePin) - grayOutside;
      assert.ok(protrudeWhite > 0, unit + " pin must protrude from white side");
      assert.ok(protrudeGray > 0, unit + " pin must protrude from gray side");
      assert.ok(Math.abs(protrudeWhite - protrudeGray) < 1e-10,
        unit + " both ends should protrude equally");
    }
    assert.equal(positions["BLACK_" + unit + "_15"].position[2], -0.66);
  }
  assert.ok(lesson.includes("bluePinsVisibleOnBothOuterFaces: true"));
});

test("Step 10 renders original 3D STL beams and pins with guided motion controls", () => {
  for (const model of ["15 beams.stl?url", "9.stl?url", "3.stl?url", "long connector.stl?url", "pin_pin.stl?url"])
    assert.ok(scene.includes(model), model);
  assert.ok(scene.includes('from "./marksmanLessonMotion"'));
  assert.ok(scene.includes("motionGuidedPose"));
  assert.ok(scene.includes("STEP_TEN_PARTS.map"));
  assert.ok(scene.includes("stepTenHighlight"));
  assert.ok(lesson.includes("AssemblyPlaybackControls"));
  assert.ok(lesson.includes("onMotionComplete"));
  assert.ok(lesson.includes("physicallySelfConfirmed: true"));
  assert.ok(lesson.includes("spacerMeshIsApproximation: true"));
  assert.ok(lesson.includes("stepTenHolePairs()"));
});

test("photo-based Step 10 is wired as the tenth interactive step without touching Steps 1–9", () => {
  assert.ok(route.includes('import { StepTenAssembly }'));
  assert.ok(route.includes('const isStepTen = project.id === "marksmanship" && currentStep.number === 10'));
  assert.ok(route.includes("currentStep.number <= 10"));
  assert.ok(route.includes("<StepTenAssembly onCompleteStep={finishCurrentStep} />"));
  assert.ok(data.includes('id: "marksmanship-photo-step10-v1"'));
  assert.ok(data.includes('assemblyOutputId: "marksman-step10-twin-rail-end-bridge-v1"'));
  assert.ok(data.includes('id: "marksmanship-inspect-assemblies-v1"'));
  assert.ok(data.includes('id: "marksmanship-rectangular-frame-v1"'));
});
