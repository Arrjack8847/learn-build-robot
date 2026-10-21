import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const read = path => readFileSync(path, "utf8");
const geometrySource = read("src/components/practical/stepTwelveGeometry.ts");
const js = ts.transpileModule(geometrySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const g = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const scene = read("src/components/practical/StepTwelveScene.tsx");
const lesson = read("src/components/practical/StepTwelveAssembly.tsx");
const route = read("src/routes/practical/$projectId.tsx");
const data = read("src/data/practical.ts");

test("Step 12 uses TWO separate 5-by-3 L-beams and two pins and bushings", () => {
  assert.equal(g.STEP_TWELVE_HOLE, 4);
  assert.equal(g.STEP_TWELVE_LONG_HOLES, 5);
  assert.equal(g.STEP_TWELVE_SHORT_HOLES, 3);
  assert.deepEqual(g.STEP_TWELVE_COMPONENTS, { lBeams: 2, blackPins: 2, bushings: 2 });
  assert.equal(g.STEP_TWELVE_PARTS.length, 6);
  assert.equal(g.STEP_TWELVE_FINAL_PHASE, 6);
  assert.equal(g.STEP_TWELVE_ACTIONS.length, 7);
  assert.deepEqual(g.STEP_TWELVE_HOLE_CENTER, [0, -3, 0]);
  assert.deepEqual(g.stepTwelveValidate(), []);
});

test("second L is rotated to an opposite face without negative scaling", () => {
  assert.deepEqual(g.STEP_TWELVE_ROOTS.A.rotation, [0, 0, 0]);
  assert.deepEqual(g.STEP_TWELVE_ROOTS.B.rotation, [0, Math.PI, 0]);
  assert.ok(g.STEP_TWELVE_ROOTS.A.position[0] < 0);
  assert.ok(g.STEP_TWELVE_ROOTS.B.position[0] > 0);
  assert.match(scene, /rotation={rotation}/);
  assert.doesNotMatch(scene, /scale={\[-1/);
});

test("both connectors move onto Hole 4 from opposite world-side directions", () => {
  const aLoose = g.stepTwelvePoses(1).PIN_A.position;
  const aSeated = g.stepTwelvePoses(2).PIN_A.position;
  const bLoose = g.stepTwelvePoses(3).PIN_B.position;
  const bSeated = g.stepTwelvePoses(4).PIN_B.position;
  assert.ok(aLoose[2] > aSeated[2], "A descends along local +Z toward the beam");
  // B has an exact Y-180 rotation: its world Z is NEGATED.
  assert.ok(-bLoose[2] < -bSeated[2], "B ascends from the lower world face");
  assert.deepEqual(aSeated.slice(0, 2), [0, -3]);
  assert.deepEqual(bSeated.slice(0, 2), [0, -3]);
  assert.equal(aSeated[2], bSeated[2]);
  assert.match(g.STEP_TWELVE_ACTIONS[2].instruction, /TOP face DOWN/);
  assert.match(g.STEP_TWELVE_ACTIONS[4].instruction, /BELOW upward/);
});

test("two hollow bushings slide over retained black pins on their own face", () => {
  const p2 = g.stepTwelvePoses(2);
  const p3 = g.stepTwelvePoses(3);
  const p4 = g.stepTwelvePoses(4);
  const p5 = g.stepTwelvePoses(5);
  assert.ok(p2.BUSHING_A.position[2] > p3.BUSHING_A.position[2]);
  assert.ok(-p4.BUSHING_B.position[2] < -p5.BUSHING_B.position[2]);
  assert.deepEqual(p3.PIN_A, p5.PIN_A);
  assert.deepEqual(p4.PIN_B, p5.PIN_B);
  assert.match(scene, /cylinderGeometry args={\[0\.40, 0\.40, 0\.92, 32, 1, true\]}/);
  assert.match(scene, /geometry={geometry\.pin}/);
  assert.doesNotMatch(scene, /opacity={0}|visible={false}|fadeOut/i);
});

test("backward playback, reduced motion and camera underside are supported", () => {
  for (let phase = 0; phase <= g.STEP_TWELVE_FINAL_PHASE; phase++) {
    const poses = g.stepTwelvePoses(phase);
    assert.deepEqual(new Set(Object.keys(poses)), new Set(g.STEP_TWELVE_PARTS));
    for (const pose of Object.values(poses))
      assert.ok([...pose.position, ...pose.rotation].every(Number.isFinite));
  }
  assert.throws(() => g.stepTwelvePoses(7));
  assert.match(scene, /motionGuidedPose/);
  assert.match(scene, /"reverse"/);
  assert.match(scene, /reducedMotion/);
  assert.match(scene, /view === "bottom"/);
  assert.match(lesson, /onPrevious/);
  assert.match(lesson, /onReplay/);
});

test("Step 12 is reachable without changing Step 11's saved assembly", () => {
  assert.match(route, /isStepEleven \?/);
  assert.match(route, /isStepTwelve \?/);
  assert.match(route, /<StepTwelveAssembly onCompleteStep={finishCurrentStep}/);
  assert.match(route, /currentStep.number <= 14/);
  assert.match(data, /id: "marksmanship-s11",\s+number: 12,\s+title: "Prepare two opposite-side L-shaped assemblies"/);
  assert.match(data, /assemblyOutputId: "marksman-step12-opposite-face-l-beams-v1"/);
  assert.match(lesson, /physicallySelfConfirmed: true/);
  assert.match(lesson, /noVanishingOrShortenedPins: true/);
});
