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

test("Hole 15 black pins and three-hole joining bridge remain on the gray-side TOP", () => {
  const halfWhite = g.STEP_TEN_BEAM_HALF_DEPTH;
  for (const [unit, installed, finished] of [["A", 6, 7], ["B", 13, 14]]) {
    const before = g.stepTenPoses(installed - 1);
    const seated = g.stepTenPoses(installed);
    const joined = g.stepTenPoses(17);
    const white = seated["WHITE_" + unit];
    const gray = g.stepTenPoses(finished)["GRAY_" + unit];
    const black3 = seated["BLACK_" + unit + "_3"];
    const black15 = seated["BLACK_" + unit + "_15"];
    assert.ok(before["BLACK_" + unit + "_15"].position[2] > white.position[2],
      "the black pin begins ABOVE the white beam");
    assert.ok(black15.position[2] > white.position[2]);
    assert.ok(gray.position[2] > white.position[2]);
    assert.ok(black3.position[2] < white.position[2],
      "Hole 3 must remain on the OPPOSITE lower face");
    assert.equal(black15.position[0], g.whiteHoleX(15));
    assert.ok(joined.BRIDGE_3.position[2] > joined["WHITE_" + unit].position[2]);
    assert.ok(joined.BRIDGE_3.position[2] > black15.position[2]);
  }
  const aligned = g.stepTenPoses(16);
  const joined = g.stepTenPoses(17);
  assert.ok(aligned.BRIDGE_3.position[2] > joined.BRIDGE_3.position[2],
    "3-hole bridge approaches its two pins FROM ABOVE");
  assert.ok(joined.BRIDGE_3.position[2] - halfWhite >= halfWhite,
    "3-hole bridge cannot protrude underneath the white beam");
  const spacer = g.stepTenPoses(19);
  assert.ok(spacer.BROWN_SPACER.position[2] < joined.BRIDGE_3.position[2],
    "brown stopper must be BELOW the short black joining beam");
  assert.ok(spacer.CENTER_BLACK.position[2] < joined.BRIDGE_3.position[2],
    "center connector must enter bridge Hole 2 from the UNDERSIDE");
  for (const phase of [6, 13, 16, 17])
    assert.match(g.STEP_TEN_ACTIONS[phase].instruction, /ABOVE|above|SAME SIDE/);
  assert.match(g.STEP_TEN_ACTIONS[19].instruction, /UPWARD FROM BELOW/);
  assert.ok(lesson.includes('blackHole15Face: "same-as-gray"'));
  assert.ok(lesson.includes('threeHoleBridgeFace: "same-as-gray"'));
  assert.ok(scene.includes('part === "BLACK_A_3" || part === "BLACK_B_3"'),
    "underside black Hole 3 pins still use bottom-up guided insertion");
  assert.ok(scene.includes('const offset = part === "CENTER_BLACK" && phase === 18 ? -0.80'),
    "stopper guide uses its own bottom-up clearance path");
});

test("under-bridge stopper with center pin rises into Hole 2 and leaves side joints untouched", () => {
  const pre = g.stepTenPoses(17);
  const prepared = g.stepTenPoses(18);
  const installed = g.stepTenPoses(19);
  const inspected = g.stepTenPoses(20);
  const halfBeam = g.STEP_TEN_BEAM_HALF_DEPTH;
  const halfPin = 16 / (2 * g.STEP_TEN_PITCH_MM);
  const bridgeZ = installed.BRIDGE_3.position[2];
  const stopperZ = installed.BROWN_SPACER.position[2];
  const blackZ = installed.CENTER_BLACK.position[2];

  // The bridge remains on the upper side; ONLY the brown stopper
  // and fifth black pin move to the underside of its center hole.
  assert.ok(bridgeZ > installed.WHITE_A.position[2]);
  assert.equal(installed.BROWN_SPACER.position[0], installed.BRIDGE_3.position[0]);
  assert.equal(installed.BROWN_SPACER.position[1], installed.BRIDGE_3.position[1]);
  assert.equal(installed.CENTER_BLACK.position[0], installed.BRIDGE_3.position[0]);
  assert.equal(installed.CENTER_BLACK.position[1], installed.BRIDGE_3.position[1]);
  assert.ok(Math.abs((stopperZ + 0.45) - (bridgeZ - halfBeam)) < 1e-10,
    "top of stopper touches bottom of bridge with no collision");
  assert.ok(blackZ < bridgeZ,
    "most of center pin stays below bridge center");
  assert.ok(blackZ + halfPin > bridgeZ - halfBeam,
    "upper pin end engages underside of center bridge hole");
  assert.ok(blackZ + halfPin <= bridgeZ + halfBeam,
    "black pin does not protrude above the top of the 3-hole beam");
  assert.ok(pre.BROWN_SPACER.position[2] < bridgeZ,
    "loose stopper begins beneath the bridge");
  assert.ok(pre.CENTER_BLACK.position[2] < bridgeZ);
  assert.ok(prepared.CENTER_BLACK.position[2] > prepared.BROWN_SPACER.position[2],
    "prepared black connector protrudes UPWARD from the brown stopper");
  for (const id of g.STEP_TEN_PARTS) {
    if (id === "CENTER_BLACK" || id === "BROWN_SPACER") continue;
    assert.deepEqual(installed[id], pre[id],
      "never change earlier built parts while seating the underside stopper: " + id);
  }
  assert.deepEqual(inspected, installed);
  assert.match(g.STEP_TEN_ACTIONS[18].instruction, /UPWARD from beneath/);
  assert.match(g.STEP_TEN_ACTIONS[19].instruction, /UPWARD FROM BELOW/);
  assert.match(g.STEP_TEN_ACTIONS[20].instruction, /UNDER the bridge/);
  assert.ok(scene.includes('part === "BROWN_SPACER" || part === "CENTER_BLACK"'));
  assert.ok(scene.includes("phase === 18 || phase === 19 || phase === 20"));
  assert.ok(lesson.includes('mountFace: "under-3-hole-bridge"'));
  assert.ok(lesson.includes('insertionDirection: "bottom-to-top"'));
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
  assert.ok(route.includes("currentStep.number <= 11"));
  assert.ok(route.includes("<StepTenAssembly onCompleteStep={finishCurrentStep} />"));
  assert.ok(data.includes('id: "marksmanship-photo-step10-v1"'));
  assert.ok(data.includes('assemblyOutputId: "marksman-step10-twin-rail-end-bridge-v1"'));
  assert.ok(data.includes('id: "marksmanship-inspect-assemblies-v1"'));
  assert.ok(data.includes('id: "marksmanship-rectangular-frame-v1"'));
});
