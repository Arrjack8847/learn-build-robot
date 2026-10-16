import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const read = path => readFileSync(path, "utf8");
const geometry = read("src/components/practical/stepThirteenGeometry.ts");
const scene = read("src/components/practical/StepThirteenScene.tsx");
const lesson = read("src/components/practical/StepThirteenAssembly.tsx");
const previousScene = read("src/components/practical/StepElevenScene.tsx");
const previousL = read("src/components/practical/stepTwelveGeometry.ts");
const route = read("src/routes/practical/$projectId.tsx");
const practical = read("src/data/practical.ts");

// Model two already fitted original gray bridges and their real saved child
// connector positions. The same transform math runs as production geometry.
const fixtures = {
  STEP5_LONG_PIN_01: { parent: "STEP5_BRIDGE_A", position: [-1, 0, 0] },
  STEP5_LONG_PIN_02: { parent: "STEP5_BRIDGE_A", position: [1, 0, 0] },
  STEP5_LONG_PIN_03: { parent: "STEP5_BRIDGE_B", position: [-1, 0, 0] },
  STEP5_LONG_PIN_04: { parent: "STEP5_BRIDGE_B", position: [1, 0, 0] },
};
const stub = [
  "const STEP_NINE_STEP_SEVEN_YAW = Math.PI;",
  "const seatedPose = (id, config, beamY) => ({",
  '  position: id === "STEP5_BRIDGE_A" ? [-3,beamY,2] : [3,beamY,-2],',
  '  rotation: [0, config[id === "STEP5_BRIDGE_A" ? "bridgeASide" : "bridgeBSide"] === "front" ? 0 : Math.PI, 0],',
  "});",
].join("\n");
const compiled = ts.transpileModule(geometry, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const runtime = stub + "\n" + compiled.replace(/^import\s+[^;]+;\s*/gm, "");
const g = await import("data:text/javascript;base64," + Buffer.from(runtime).toString("base64"));
const config = { bridgeASide: "front", bridgeBSide: "back" };
const anchors = g.stepThirteenAnchors(config, fixtures, 4.1);

test("TWO existing blue pin pairs belong to original gray connector bridges", () => {
  assert.deepEqual(g.STEP_THIRTEEN_MOUNTS, {
    A: ["STEP5_LONG_PIN_01", "STEP5_LONG_PIN_02"],
    B: ["STEP5_LONG_PIN_03", "STEP5_LONG_PIN_04"],
  });
  assert.deepEqual(g.STEP_THIRTEEN_RECEIVER,
    { first: 1, empty: 2, third: 3, preparedBlackPin: 4 });
  assert.equal(g.STEP_THIRTEEN_ACTIONS.length, 7);
  assert.equal(g.STEP_THIRTEEN_FINAL_PHASE, 6);
  assert.equal(new Set([...anchors.A.pinIds, ...anchors.B.pinIds]).size, 4);
  assert.match(geometry, /stepSixConfig|sixConfig/);
  assert.match(geometry, /seatedPose\(bridgeId/);
  assert.doesNotMatch(geometry, /STEP_THIRTEEN_MOUNTS\s*=\s*\[/);
});

test("BOTH short-arm receiving holes in each L are exactly two pitches apart", () => {
  for (const id of ["A", "B"]) {
    const { pins, seated, clearance, outward, rotationY } = anchors[id];
    assert.ok(Math.abs(Math.abs(pins[1][0] - pins[0][0]) - 2) < 0.001);
    assert.ok(Math.abs(pins[1][1] - pins[0][1]) < 0.001);
    assert.ok(Math.abs(pins[1][2] - pins[0][2]) < 0.001);
    assert.ok(Math.abs(seated[0] - pins[0][0]) < 0.001);
    assert.ok(Math.abs(seated[1] - pins[0][1]) < 0.001);
    assert.ok((clearance[2] - seated[2]) * outward > 0);
    assert.equal(rotationY, outward === 1 ? 0 : Math.PI);
    // After Y(rotationY)*X(180°), local +Z (the brown stopper) must
    // point INWARD toward the robot's center, opposite the bridge normal;
    // local +X (Hole 1 -> 3) still spans the same two blue-pin positions.
    assert.ok(Math.abs(Math.cos(rotationY) - outward) < 0.001);
    assert.ok(Math.abs(-Math.cos(rotationY) - (-outward)) < 0.001);
    assert.ok(Math.abs(Math.sign(pins[1][0] - pins[0][0]) - outward) < 0.001);
  }
  assert.equal(anchors.A.outward, -anchors.B.outward);
  assert.deepEqual(g.stepThirteenWarnings(anchors).filter(x => !x.includes("real-kit")), []);
  // Different bridges require the L normals to face opposite directions.
  assert.equal(anchors.A.outward, -1);
  assert.equal(anchors.B.outward, 1);
  assert.equal(anchors.A.rotationY, Math.PI);
  assert.equal(anchors.B.rotationY, 0);
  // Opposite-side brown stoppers point toward one another.
  assert.ok(-Math.cos(anchors.A.rotationY) > 0, "A stopper points +Z inward");
  assert.ok(-Math.cos(anchors.B.rotationY) < 0, "B stopper points -Z inward");
});

test("Two prebuilt L units approach, insert and reverse independently", () => {
  assert.deepEqual(g.stepThirteenUnitPosition(0, "A", anchors), anchors.A.loose);
  assert.deepEqual(g.stepThirteenUnitPosition(0, "B", anchors), anchors.B.loose);
  assert.deepEqual(g.stepThirteenUnitPosition(2, "A", anchors), anchors.A.clearance);
  assert.deepEqual(g.stepThirteenUnitPosition(2, "B", anchors), anchors.B.loose);
  assert.deepEqual(g.stepThirteenUnitPosition(3, "A", anchors), anchors.A.seated);
  assert.deepEqual(g.stepThirteenUnitPosition(4, "B", anchors), anchors.B.clearance);
  assert.deepEqual(g.stepThirteenUnitPosition(5, "B", anchors), anchors.B.seated);
  assert.deepEqual(g.stepThirteenUnitPosition(6, "A", anchors), anchors.A.seated);
  assert.deepEqual(g.stepThirteenUnitPosition(6, "B", anchors), anchors.B.seated);
  assert.equal(g.stepThirteenUnitTwist(0, "A"), -Math.PI / 2);
  assert.equal(g.stepThirteenUnitTwist(1, "B"), Math.PI / 2);
  assert.equal(g.stepThirteenUnitTwist(2, "A"), 0);
  assert.equal(g.stepThirteenUnitTwist(3, "B"), Math.PI / 2);
  assert.equal(g.stepThirteenUnitTwist(4, "B"), 0);
  assert.equal(g.stepThirteenUnitTwist(5, "B"), 0);
  assert.throws(() => g.stepThirteenUnitTwist(7, "A"));
  assert.throws(() => g.stepThirteenUnitPosition(7, "A", anchors));
  assert.throws(() => g.stepThirteenAnchors(config, {}, 4.1), /Missing original/);
});

test("The unchanged Step 11 chassis contains all four connectors, Step 13 moves rigid L units only", () => {
  assert.match(previousScene, /STEP5_BRIDGE_A:/);
  assert.match(previousScene, /STEP5_BRIDGE_B:/);
  assert.match(previousScene, /CHILD_PINS\[id\]\.map\(preparedPin\)/);
  assert.match(previousScene, /\{extraScene\}/);
  assert.match(scene, /<StepElevenScene phase={4}/);
  assert.match(scene, /skipEntryAnimation/);
  assert.match(scene, /stepThirteenAnchors\(props.stepSixConfig, props.prepared, beamY\)/);
  assert.match(scene, /stepTwelvePoses\(STEP_TWELVE_FINAL_PHASE\)/);
  assert.match(scene, /BEAM L_\.stl\?url/);
  assert.match(scene, /pin_pin\.stl\?url/);
  assert.match(scene, /HollowBushing/);
  assert.match(previousL, /STEP_TWELVE_HOLE = 4/);
  assert.match(scene, /anchors\[unit\]\.rotationY/);
  assert.match(scene, /setFromAxisAngle\(X_AXIS, Math.PI\)/);
  assert.match(scene, /stepThirteenUnitTwist\(phase, unit\)/);
  assert.match(scene, /target\.quaternion\.copy/);
  assert.match(scene, /\.slerp\(/);
  assert.match(scene, /anchors\[id\]\.pins\.map/);
  assert.match(scene, /SHORT_ARM_HOLE_/);
  assert.doesNotMatch(scene, /opacity={0}|visible={false}|fadeOut|scale={\[-1/);
});

test("Step 13 has accurate instructions, UI navigation and photo-fit confirmation", () => {
  assert.match(route, /const isStepThirteen/);
  assert.match(route, /isStepThirteen \?/);
  assert.match(route, /<StepThirteenAssembly onCompleteStep={finishCurrentStep}/);
  assert.match(route, /currentStep.number <= 13/);
  assert.match(practical, /id: "marksmanship-s12",\s+number: 13,\s+title: "Attach the two completed L-shaped assemblies"/);
  assert.match(practical, /assemblyOutputId: "marksman-step13-two-l-brackets-two-pin-pairs-inward-stoppers-v3"/);
  assert.match(lesson, /bothBrownStoppersFaceRobotCenter: true/);
  assert.match(lesson, /bothLongArmsPointDown: true/);
  assert.match(lesson, /STEP_ELEVEN_RESULT_KEY/);
  assert.match(lesson, /STEP_TWELVE_RESULT_KEY/);
  assert.match(lesson, /totalOriginalBluePinsEngaged: 4/);
  assert.match(lesson, /physicallySelfConfirmed: true/);
  assert.match(lesson, /mechanicallyVerified: false/);
  assert.match(lesson, /onPrevious/);
  assert.match(lesson, /onReplay/);
  assert.match(lesson, /onTogglePause/);
});

test("New Step 13 and backwards-compatible Step 11 scene compile as TSX", () => {
  for (const name of [
    "src/components/practical/stepThirteenGeometry.ts",
    "src/components/practical/StepThirteenScene.tsx",
    "src/components/practical/StepThirteenAssembly.tsx",
    "src/components/practical/StepElevenScene.tsx",
  ]) {
    const transformed = ts.transpileModule(read(name), {
      fileName: name, reportDiagnostics: true,
      compilerOptions: {
        target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.ReactJSX,
      },
    });
    const errors = (transformed.diagnostics ?? [])
      .filter(d => d.category === ts.DiagnosticCategory.Error)
      .map(d => ts.flattenDiagnosticMessageText(d.messageText, "\n"));
    assert.deepEqual(errors, [], name);
  }
});
