import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(path, "utf8");
const geometry = read("src/components/practical/stepFourteenGeometry.ts");
const scene = read("src/components/practical/StepFourteenScene.tsx");
const ui = read("src/components/practical/StepFourteenAssembly.tsx");
const base = read("src/components/practical/StepElevenScene.tsx");
const preceding = read("src/components/practical/StepThirteenScene.tsx");
const route = read("src/routes/practical/$projectId.tsx");
const lessons = read("src/data/practical.ts");


test("The original GLB physically contains four circular motor mounting rims at 48 by 16 mm spacing", () => {
  const buf = readFileSync("3D for marksman/mortor.glb");
  assert.equal(buf.toString("utf8", 0, 4), "glTF");
  const jsonLength = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.toString("utf8", 20, 20 + jsonLength));
  const binaryStart = 20 + jsonLength + 8;
  function faceRingVertexCount(meshIndex, yCenterMm, zCenterMm, motorPartYOffsetMm) {
    const accessor = gltf.accessors[gltf.meshes[meshIndex].primitives[0].attributes.POSITION];
    const bufferView = gltf.bufferViews[accessor.bufferView];
    const start = binaryStart + bufferView.byteOffset + (accessor.byteOffset ?? 0);
    const stride = bufferView.byteStride ?? 12;
    let count = 0;
    for (let i = 0; i < accessor.count; i++) {
      const offset = start + i * stride;
      const x = buf.readFloatLE(offset) * 1000;
      const y = buf.readFloatLE(offset + 4) * 1000 + motorPartYOffsetMm;
      const z = buf.readFloatLE(offset + 8) * 1000;
      if (Math.abs(Math.abs(x) - 12) > 0.05) continue;
      const radius = Math.hypot(y - yCenterMm, z - zCenterMm);
      if (radius >= 3.25 && radius <= 3.65) count++;
    }
    return count;
  }
  // Actual 10090.dat front body: two holes at Y=4 mm, Z=+/-8 mm.
  // Actual 10089.dat rear body, translated +52 mm: two holes at
  // Y=52 mm, Z=+/-8 mm; each rim has hundreds of sampled vertices.
  for (const z of [-8, 8]) {
    assert.ok(faceRingVertexCount(1, 4, z, 0) > 100, "front hole rim at z " + z);
    assert.ok(faceRingVertexCount(0, 52, z, 52) > 100, "rear hole rim at z " + z);
  }
  assert.ok(geometry.includes("frontBehindAxleHub: 4, rearBehindAxleHub: 52"));
  assert.ok(geometry.includes("transverseOffset: 8, housingFaceOffset: 12"));
  assert.ok(scene.includes("STEP_FOURTEEN_MOTOR_HOLES_MM.frontBehindAxleHub / 8"));
});

test("Step 14 targets exactly the four ORIGINAL Step 10 grey-beam blue pins", () => {
  for (const id of ["BLUE_A_6", "BLUE_A_12", "BLUE_B_6", "BLUE_B_12"])
    assert.ok(geometry.includes('"' + id + '"'));
  assert.ok(geometry.includes("STEP_TEN_FINAL_PHASE"));
  assert.ok(geometry.includes("stepTenPoses"));
  assert.ok(geometry.includes("BLUE_A_6: 3, BLUE_A_12: 9"));
  assert.ok(geometry.includes("BLUE_B_6: 3, BLUE_B_12: 9"));
  assert.ok(geometry.includes("xs[1]! - xs[0]! - 6"));
  assert.ok(geometry.includes("ys[1]! - ys[0]! - 2"));
  assert.ok(geometry.includes("motor"));
  assert.ok(geometry.includes("physical confirmation"));
});
test("Preserves the complete real Step 2 motor assembly as ONE rigid moving unit", () => {
  for (const file of ["mortor.glb", "short.stl", "ROUND DISC.stl", "5.stl", "pin_pin.stl"])
    assert.ok(scene.includes(file), file);
  for (const part of ["STEP2_SHORT_AXLE", "STEP2_CIRCULAR_DISC", "STEP2_FIVE_HOLE_BEAM", "STEP2_DISC_PIN"])
    assert.ok(scene.includes(part), part);
  assert.ok(scene.includes("STEP14_COMPLETE_STEP2_RIGID_UNIT"));
  assert.ok(scene.includes('node.name.includes("10095")'), "Use FRONT motor axle hub");
  assert.ok(scene.includes('node.name.includes("10091")'), "Reject rear cable retainer as axle hub");
  assert.ok(scene.includes("stepFourteenPose"));
  assert.ok(scene.includes("holder.current.rotation.z"));
  assert.ok(scene.includes("model.lateralCenter"));
});
test("Step 13 L-brackets and prior frame remain unchanged; motor mounts within Step 10 group", () => {
  assert.ok(base.includes('name="STEP11_EXACT_STEP10_COMPLETE"'));
  assert.ok(base.includes("{stepTenExtraScene}"));
  assert.ok(base.includes("STEP_TEN_PARTS.map"));
  assert.ok(preceding.includes("stepTenExtraScene={props.stepTenExtraScene}"));
  assert.ok(scene.includes("StepThirteenScene"));
  assert.ok(scene.includes("STEP_THIRTEEN_FINAL_PHASE"));
  assert.ok(scene.includes("stepTenExtraScene"));
  assert.ok(!scene.includes("STEP5_LONG_PIN_01"), "Do not confuse L mounting pins with motor pins");
});
test("Four connector meshes never fade and final mounting is a single straight insertion", () => {
  assert.ok(geometry.includes("phase === 3"));
  assert.ok(geometry.includes("rotationZ: 0"));
  assert.ok(geometry.includes("phase <= 1"));
  assert.ok(scene.includes("motionLerp"));
  assert.ok(scene.includes("reducedMotion"));
  assert.ok(scene.includes("replayKey"));
  assert.ok(scene.includes("paused"));
  assert.ok(!scene.includes("opacity={0}"));
});
test("Step 14 shows its own step navigation, camera controls and real-kit approval", () => {
  assert.ok(route.includes("isStepFourteen"));
  assert.ok(route.includes("<StepFourteenAssembly onCompleteStep={finishCurrentStep} />"));
  assert.ok(route.includes("currentStep.number <= 14"));
  assert.ok(lessons.includes('assemblyOutputId: "marksman-step14-step2-motor-step13-four-gray-pins-v1"'));
  for(const keyword of ["AssemblyStage", "AssemblyPlaybackControls", "AssemblyActionCard", "physicallyChecked", "STEP_THIRTEEN_RESULT_KEY", "STEP_FOURTEEN_RESULT_KEY"])
    assert.ok(ui.includes(keyword), keyword);
  assert.ok(ui.includes("physicallySelfConfirmed") === false);
  assert.ok(ui.includes("mechanicallyVerified: false"));
  assert.ok(ui.includes("axleAndDiscFaceBlackThreeHoleCrossbeam: true"));
});
