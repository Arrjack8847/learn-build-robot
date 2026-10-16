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
const tenTs = read("src/components/practical/stepTenGeometry.ts");
const tenJs = ts.transpileModule(tenTs, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const tenUri = "data:text/javascript;base64," + Buffer.from(tenJs).toString("base64");
const geometryJs = ts.transpileModule(geometry, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText.replace('from "./stepTenGeometry"', 'from "' + tenUri + '"');
const g = await import("data:text/javascript;base64," + Buffer.from(geometryJs).toString("base64"));

test("Step 13 only uses existing same-gray-rail mounting pins at Holes 6 and 12", () => {
  assert.deepEqual(g.STEP_THIRTEEN_MOUNTS, ["BLUE_A_6", "BLUE_A_12"]);
  assert.equal(g.STEP_THIRTEEN_FINAL_PHASE, 6);
  assert.equal(g.STEP_THIRTEEN_ACTIONS.length, 7);
  const anchors = g.stepThirteenAnchors({ target: [0, 0, 0] });
  assert.equal(anchors.A.pin[0], 2);
  assert.equal(anchors.B.pin[0], -4);
  assert.equal(anchors.A.pin[2], -1);
  assert.equal(anchors.B.pin[2], -1);
  assert.equal(anchors.A.seated[0], anchors.A.pin[0]);
  assert.equal(anchors.B.seated[0], anchors.B.pin[0]);
  assert.equal(anchors.A.seated[2], anchors.A.pin[2]);
  assert.equal(anchors.B.seated[2], anchors.B.pin[2]);
  assert.deepEqual(g.stepThirteenWarnings(anchors).filter(x => x.includes("must")), []);
});

test("L brackets move separately, finish coaxially, and reverse without altering pins", () => {
  const anchors = g.stepThirteenAnchors({ target: [-6, 2, 3] });
  const originalPins = JSON.stringify({ A: anchors.A.pin, B: anchors.B.pin });
  assert.deepEqual(g.stepThirteenUnitPosition(0, "A", anchors), anchors.A.loose);
  assert.deepEqual(g.stepThirteenUnitPosition(0, "B", anchors), anchors.B.loose);
  assert.deepEqual(g.stepThirteenUnitPosition(2, "A", anchors), anchors.A.clearance);
  assert.deepEqual(g.stepThirteenUnitPosition(2, "B", anchors), anchors.B.loose);
  assert.deepEqual(g.stepThirteenUnitPosition(3, "A", anchors), anchors.A.seated);
  assert.deepEqual(g.stepThirteenUnitPosition(4, "B", anchors), anchors.B.clearance);
  assert.deepEqual(g.stepThirteenUnitPosition(5, "B", anchors), anchors.B.seated);
  assert.deepEqual(g.stepThirteenUnitPosition(6, "A", anchors), anchors.A.seated);
  assert.deepEqual(g.stepThirteenUnitPosition(6, "B", anchors), anchors.B.seated);
  assert.equal(anchors.A.clearance[0], anchors.A.seated[0]);
  assert.equal(anchors.A.clearance[2], anchors.A.seated[2]);
  assert.equal(anchors.B.clearance[0], anchors.B.seated[0]);
  assert.equal(anchors.B.clearance[2], anchors.B.seated[2]);
  assert.ok(anchors.A.clearance[1] > anchors.A.seated[1]);
  assert.ok(anchors.B.clearance[1] > anchors.B.seated[1]);
  assert.equal(JSON.stringify({ A: anchors.A.pin, B: anchors.B.pin }), originalPins);
  assert.throws(() => g.stepThirteenUnitPosition(7, "A", anchors));
});

test("Step 13 reuses original completed chassis and PREPARED opposite-face L pieces", () => {
  assert.match(scene, /<StepElevenScene phase={4}/);
  assert.match(scene, /extraScene={<Suspense/);
  assert.match(scene, /skipEntryAnimation/);
  assert.match(previousScene, /\{extraScene\}/);
  assert.match(scene, /stepTwelvePoses\(STEP_TWELVE_FINAL_PHASE\)/);
  assert.match(scene, /BEAM L_\.stl\?url/);
  assert.match(scene, /pin_pin\.stl\?url/);
  assert.match(scene, /HollowBushing/);
  assert.match(scene, /BASE_ORIENTATION/);
  assert.match(scene, /OPPOSITE_ORIENTATION/);
  assert.match(previousL, /STEP_TWELVE_HOLE = 4/);
  assert.match(scene, /onMotionComplete/);
  assert.match(scene, /replayKey/);
  assert.match(scene, /reducedMotion/);
  assert.doesNotMatch(scene, /opacity={0}|visible={false}|fadeOut|scale={\[-1/);
});

test("Step 13 has its own learner controls, safe completion and numbering", () => {
  assert.match(route, /const isStepThirteen/);
  assert.match(route, /isStepThirteen \?/);
  assert.match(route, /<StepThirteenAssembly onCompleteStep={finishCurrentStep}/);
  assert.match(route, /currentStep.number <= 13/);
  assert.match(practical, /id: "marksmanship-s12",\s+number: 13,\s+title: "Attach the two completed L-shaped assemblies"/);
  assert.match(practical, /assemblyOutputId: "marksman-step13-two-l-brackets-on-gray-rail-v1"/);
  assert.match(lesson, /STEP_ELEVEN_RESULT_KEY/);
  assert.match(lesson, /STEP_TWELVE_RESULT_KEY/);
  assert.match(lesson, /physicallySelfConfirmed: true/);
  assert.match(lesson, /mechanicallyVerified: false/);
  assert.match(lesson, /onPrevious/);
  assert.match(lesson, /onReplay/);
  assert.match(lesson, /onTogglePause/);
});

test("Step 13 and the backwards-compatible Stage changes transpile", () => {
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
