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

test("Hole 1 blue pins insert upward and remain visible on both white faces", () => {
  const halfWhite = g.STEP_TEN_BEAM_HALF_DEPTH;
  const halfBlue = g.STEP_TEN_BLUE_PIN_HALF_LENGTH;
  for (const [unit, installedPhase] of [["A", 2], ["B", 9]]) {
    const seated = g.stepTenPoses(installedPhase);
    const before = g.stepTenPoses(installedPhase - 1);
    const blue = seated["BLUE_" + unit + "_1"];
    const white = seated["WHITE_" + unit];
    assert.ok(before["BLUE_" + unit + "_1"].position[2] < white.position[2],
      "the blue connector must BEGIN below the beam");
    assert.equal(blue.position[2], white.position[2], "blue Hole 1 must be centered");
    assert.ok(blue.position[2] - halfBlue < white.position[2] - halfWhite);
    assert.ok(blue.position[2] + halfBlue > white.position[2] + halfWhite);
    assert.equal(g.stepTenHighlight(installedPhase).face, -1);
  }
  assert.ok(scene.includes('part === "BLUE_A_1" || part === "BLUE_B_1"'));
  assert.match(g.STEP_TEN_ACTIONS[2].instruction, /BELOW to ABOVE/);
  assert.match(g.STEP_TEN_ACTIONS[9].instruction, /BELOW to ABOVE/);
  assert.ok(lesson.includes('blueHole1VisibleOnBothWhiteFaces: true'));
});

test("blue Holes 6 and 12 insert downward, stop FLUSH under white and extend ABOVE gray", () => {
  const halfWhite = g.STEP_TEN_BEAM_HALF_DEPTH;
  const halfBlue = g.STEP_TEN_BLUE_PIN_HALF_LENGTH;
  const expectedBottom = -halfWhite;
  for (const [unit, phase] of [["A", 7], ["B", 14]]) {
    const finished = g.stepTenPoses(phase);
    const white = finished["WHITE_" + unit];
    const gray = finished["GRAY_" + unit];
    for (const [holeWhite, holeGray] of [[6, 3], [12, 9]]) {
      const id = "BLUE_" + unit + "_" + holeWhite;
      const blue = finished[id];
      const before = g.stepTenPoses(unit === "A" ? holeWhite === 6 ? 2 : 3
        : holeWhite === 6 ? 9 : 10)[id];
      assert.ok(before.position[2] > white.position[2],
        "the blue pin starts above white, never underneath");
      assert.equal(blue.position[0], g.whiteHoleX(holeWhite));
      assert.equal(blue.position[0], g.grayHoleX(holeGray));
      assert.ok(Math.abs((blue.position[2] - halfBlue) -
        (white.position[2] + expectedBottom)) < 1e-10,
        "lower pin face must be flush with white underside (no protrusion)");
      assert.ok(blue.position[2] + halfBlue > gray.position[2] + halfWhite,
        "upper blue tip must protrude above the mounted gray beam");
    }
  }
  for(const phase of [3, 4, 10, 11])
    assert.match(g.STEP_TEN_ACTIONS[phase].instruction, /ABOVE to BELOW/);
  assert.ok(lesson.includes('blueHoles6And12WhiteUnderside: "flush-no-protrusion"'));
  assert.ok(lesson.includes("bluePinsVisibleOnBothOuterFaces: false"));
});

test("black 3-hole crossbeam is on SAME grey side; brown stopper under it faces INWARD", () => {
  const half = g.STEP_TEN_BEAM_HALF_DEPTH;
  const completed = g.stepTenPoses(20);
  const bridge = completed.BRIDGE_3;
  const innerBridgeFace = bridge.position[2] - half;
  const outerBridgeFace = bridge.position[2] + half;
  assert.deepEqual(g.stepTenValidate(), []);
  assert.ok(g.STEP_TEN_GRAY_CENTER_Z > half, "grey rails stay on +Z white face");
  assert.ok(bridge.position[2] > half, "black 3-hole crossbeam must be on SAME +Z face");
  assert.ok(bridge.position[2] - half >= half, "bridge must not cross below the white beam");
  assert.ok(bridge.position[2] - half > 0, "black bridge and grey rails both on +Z");
  assert.ok(Math.abs(bridge.position[2] - g.STEP_TEN_GRAY_CENTER_Z) <= 0.1,
    "grey and black beams stay on the same mounting face");

  for(const [unit, installPin, installGrey] of [["A", 6, 7], ["B", 13, 14]]) {
    const before = g.stepTenPoses(installPin - 1);
    const withPin = g.stepTenPoses(installPin);
    const white = withPin["WHITE_" + unit];
    const grey = g.stepTenPoses(installGrey)["GRAY_" + unit];
    const black3 = withPin["BLACK_" + unit + "_3"];
    const black15 = withPin["BLACK_" + unit + "_15"];
    assert.ok(grey.position[2] > white.position[2]);
    assert.ok(bridge.position[2] > white.position[2]);
    assert.ok(before["BLACK_" + unit + "_15"].position[2] > white.position[2],
      "Hole 15 pin starts ABOVE the white beam, on grey side");
    assert.ok(black15.position[2] > white.position[2],
      "Hole 15 black pin remains on SAME face as grey beams");
    assert.ok(black3.position[2] < white.position[2],
      "Hole 3 black pin alone stays OPPOSITE grey face for Step 11");
    assert.equal(black15.position[0], g.whiteHoleX(15));
    assert.equal(black15.position[1], unit === "A" ? -1 : 1);
    assert.ok(black15.position[2] + 1 <= outerBridgeFace,
      "outer tip of Hole 15 black connector cannot protrude above black bridge");
    assert.ok(black15.position[2] + 1 > innerBridgeFace,
      "Hole 15 black connector engages the black 3-hole bridge");
    assert.ok(black15.position[2] - 1 < white.position[2] + half,
      "Hole 15 black connector overlaps white-beam Hole 15");
  }
  const staged = g.stepTenPoses(16).BRIDGE_3;
  assert.ok(staged.position[2] > bridge.position[2],
    "the black 3-hole bridge descends FROM ABOVE onto both Hole 15 pins");
  assert.deepEqual(bridge.rotation, [0, 0, Math.PI / 2]);
  assert.equal(bridge.position[0], g.whiteHoleX(15));

  const prepared = g.stepTenPoses(18);
  const stopper = completed.BROWN_SPACER;
  const centerPin = completed.CENTER_BLACK;
  assert.ok(stopper.position[2] < bridge.position[2],
    "brown stopper belongs UNDER the black bridge, pointing INWARD (-Z)");
  assert.ok(centerPin.position[2] > stopper.position[2],
    "the center pin extends UPWARD from the inward stopper");
  assert.ok(prepared.BROWN_SPACER.position[2] < bridge.position[2],
    "the stopper starts UNDER/INWARD from the bridge");
  assert.ok(prepared.CENTER_BLACK.position[2] > prepared.BROWN_SPACER.position[2],
    "prepared black pin points upward");
  assert.ok(Math.abs((stopper.position[2] + 0.45) - innerBridgeFace) < 1e-10,
    "stopper seats against the inward/underside bridge face");
  assert.ok(centerPin.position[2] + 1 <= outerBridgeFace,
    "center pin must not project outward above the bridge");
  assert.ok(centerPin.position[2] + 1 > innerBridgeFace,
    "center pin enters bridge middle Hole 2");
  assert.equal(centerPin.position[0], bridge.position[0]);
  assert.equal(stopper.position[1], bridge.position[1]);
  assert.match(g.STEP_TEN_ACTIONS[6].instruction, /FROM ABOVE/);
  assert.match(g.STEP_TEN_ACTIONS[13].instruction, /FROM ABOVE/);
  assert.match(g.STEP_TEN_ACTIONS[16].instruction, /SAME SIDE/);
  assert.match(g.STEP_TEN_ACTIONS[17].instruction, /FROM ABOVE/);
  assert.match(g.STEP_TEN_ACTIONS[19].instruction, /FROM BELOW/);
  assert.match(g.STEP_TEN_ACTIONS[20].instruction, /INWARD/);
  assert.equal(g.stepTenHighlight(6).face, 1);
  assert.equal(g.stepTenHighlight(13).face, 1);
  assert.ok(lesson.includes('blackHole15Face: "same-as-gray"'));
  assert.ok(lesson.includes('threeHoleBridgeFace: "same-as-gray"'));
  assert.ok(lesson.includes('side: "inward-below-three-hole-bridge"'));
  assert.ok(lesson.includes('insertion: "bottom-to-top"'));
  assert.ok(lesson.includes("noConnectorProtrusionAboveBridge: true"));
  assert.ok(scene.includes('part === "BLACK_A_3" || part === "BLACK_B_3"'));
  assert.ok(scene.includes('(phase === 19 && (part === "CENTER_BLACK" || part === "BROWN_SPACER"))'));
  assert.ok(scene.includes("STEP_TEN_BLACK_BRIDGE_CENTER_Z - STEP_TEN_BEAM_HALF_DEPTH - 0.06"));
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
  assert.match(route, /currentStep.number <= (?:11|12|13|14)/);
  assert.ok(route.includes("<StepTenAssembly onCompleteStep={finishCurrentStep} />"));
  assert.ok(data.includes('id: "marksmanship-photo-step10-v1"'));
  assert.ok(data.includes('assemblyOutputId: "marksman-step10-twin-rail-end-bridge-v1"'));
  assert.ok(data.includes('id: "marksmanship-inspect-assemblies-v1"'));
  assert.ok(data.includes('id: "marksmanship-rectangular-frame-v1"'));
});
