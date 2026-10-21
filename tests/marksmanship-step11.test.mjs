import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import ts from "typescript";

const read = p => readFileSync(resolve(p), "utf8");
const geometry = read("src/components/practical/stepElevenGeometry.ts");
const scene = read("src/components/practical/StepElevenScene.tsx");
const ui = read("src/components/practical/StepElevenAssembly.tsx");
const route = read("src/routes/practical/$projectId.tsx");
const practical = read("src/data/practical.ts");

test("Step 11 reuses four original pin ends (blue 1, black 3, on both white beams)", () => {
  for (const part of ["BLUE_A_1", "BLACK_A_3", "BLUE_B_1", "BLACK_B_3"]) {
    assert.ok(geometry.includes('"' + part + '"'));
  }
  assert.match(geometry, /blue: 13, empty: 14, black: 15/);
  assert.match(geometry, /blue: 1, black: 3/);
  assert.match(geometry, /STEP_ELEVEN_FINAL_PHASE = 4/);
  assert.ok(geometry.includes("STEP_NINE_RAIL_FACE_SEATING"));
  assert.ok(geometry.includes("stepTenPoses(STEP_TEN_FINAL_PHASE)"));
  assert.ok(geometry.includes("railPose(id, STEP_SEVEN_FINAL_PHASE"));
});

test("Step 11 moves rigid completed groups, not independent connectors", () => {
  assert.ok(scene.includes("STEP11_EXACT_STEP9_COMPLETE"));
  assert.ok(scene.includes("STEP11_EXACT_STEP10_COMPLETE"));
  assert.ok(scene.includes("STEP11_STEP9_PREVIOUS_STEP8_FRAME"));
  assert.ok(scene.includes("STEP_EIGHT_PARTS.map"));
  assert.ok(scene.includes("STEP_TEN_PARTS.map"));
  assert.ok(scene.includes("stepTen.current.position.set(...motionLerp"));
  assert.ok(!scene.includes("opacity={0}"));
  assert.ok(!scene.includes("visible={false}"));
  assert.ok(scene.includes("STEP_TEN_JOIN_ROTATION"));
  assert.ok(scene.includes("stepNineMating(railConfig, stepSixConfig, beamY, frameConfig)"),
    "Step 11 must use Step 9's actual completed frame configuration");
  assert.ok(scene.includes("powerPreference: \"low-power\""));
  assert.ok(scene.includes("reducedMotion"));
});

test("Step 11 has guided action navigation, inspection, and preserved original lesson numbering", () => {
  assert.ok(route.includes("isStepEleven"));
  assert.ok(route.includes("<StepElevenAssembly onCompleteStep={finishCurrentStep} />"));
  assert.match(route, /currentStep.number <= 14/);
  assert.ok(practical.includes('number: 11,\n    title: "Join Step 9 and Step 10 Assemblies"'));
  assert.ok(ui.includes("STEP_NINE_ASSEMBLY_ID"));
  assert.ok(ui.includes("STEP_TEN_ASSEMBLY_ID"));
  assert.ok(ui.includes("physicallyChecked"));
  assert.ok(ui.includes("AssemblyPlaybackControls"));
  assert.ok(ui.includes("stepElevenPlacement"));
});

test("New TypeScript/TSX files transpile without diagnostics", () => {
  for (const name of [
    "src/components/practical/stepElevenGeometry.ts",
    "src/components/practical/StepElevenScene.tsx",
    "src/components/practical/StepElevenAssembly.tsx",
  ]) {
    const result = ts.transpileModule(read(name), {
      fileName: name,
      reportDiagnostics: true,
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.ReactJSX },
    });
    const fatal = (result.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error);
    assert.deepEqual(fatal.map(d => ts.flattenDiagnosticMessageText(d.messageText, "\n")), [], name);
  }
});
