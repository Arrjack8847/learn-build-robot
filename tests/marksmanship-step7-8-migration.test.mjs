import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const read = (path) => readFileSync(resolve(path),"utf8");
const data=read("src/data/practical.ts");
const route=read("src/routes/practical/$projectId.tsx");
const progress=read("src/context/ProgressContext.tsx");
const rails=read("src/components/practical/StepSevenRailsAssembly.tsx");
const scene=read("src/components/practical/StepSevenRailsScene.tsx");
const railConfig=read("src/components/practical/stepSevenRailGeometry.ts");
const frame=read("src/components/practical/StepEightAssembly.tsx");
const frameGeom=read("src/components/practical/stepEightGeometry.ts");
const frameScene=read("src/components/practical/StepEightScene.tsx");

test("Thirty-two interactive entries without duplicate IDs or step numbers",()=>{
  const stepData=data.slice(data.indexOf("const marksmanshipSteps:"),data.indexOf("export const practicalProjects:"));
  const ids=[...stepData.matchAll(/^    id: "([^"]+)",/gm)].map(x=>x[1]);
  const numbers=[...stepData.matchAll(/^    number: (\d+),/gm)].map(x=>Number(x[1]));
  assert.equal(ids.length,32);
  assert.equal(new Set(ids).size,32);
  assert.deepEqual(numbers,Array.from({length:32},(_,i)=>i+1));
});
test("New step identity cannot inherit ambiguous historic Step 7/8 completions",()=>{
  assert.match(data,/id: "marksmanship-side-rails-v1",\s+number: 7,/);
  assert.match(data,/id: "marksmanship-rectangular-frame-v1",\s+number: 8,/);
  assert.match(data,/id: "marksmanship-inspect-assemblies-v1",\s+number: 9,/);
  assert.ok(progress.includes("legacyStepCompletionIds"));
  assert.ok(progress.includes('id === "marksmanship-s7" || id === "marksmanship-s8"'));
  assert.ok(!data.includes('id: "marksmanship-s7",'));
  assert.ok(!data.includes('id: "marksmanship-s8",'));
});
test("Original manual numbering remains stable and overlap is flagged",()=>{
  assert.match(data,/originalManualStepNumbers: \[7, 8\]/);
  for(let manual=9;manual<=14;manual++)assert.ok(data.includes("originalManualStepNumbers: ["+manual+"]"));
  assert.ok(data.includes("referenceOnly: true"));
  assert.ok(data.includes("/marksmanship/steps/31.png"));
  assert.ok(data.includes("Original manual operation may overlap"));
});
test("Route keeps previous step distinct from action controls and guards Step 7–9 footer",()=>{
  assert.ok(route.includes('aria-label="Previous Step"'));
  assert.ok(route.includes("const isStepSeven"));
  assert.ok(route.includes("const isStepEight"));
  assert.ok(route.includes("const isStepNine"));
  assert.ok(route.includes("StepSevenRailsAssembly onCompleteStep={finishCurrentStep}"));
  assert.ok(route.includes("StepNineAssemblyReview onCompleteStep={finishCurrentStep}"));
  assert.ok(route.includes("!isInteractiveMarksman && <footer"));
  assert.ok(!route.includes("<MarksmanFramePreparation onCompleteStep={finishCurrentStep}"));
});
test("Genuine Step 6 model/connector identity carries into Step 7 without invented proxy bodies",()=>{
  for(const id of ["STEP5_BEAM_11","STEP5_BRIDGE_A","STEP5_BRIDGE_B","STEP5_HOLLOW_A","STEP5_HOLLOW_B"]){
    assert.ok(scene.includes(id));
  }
  assert.ok(scene.includes("STEP5_MODEL_PATHS"));
  assert.ok(scene.includes("seatedPose"));
  assert.ok(scene.includes("15 beams.stl?url"));
  assert.ok(scene.includes("long connector.stl?url"));
  assert.ok(rails.includes("physicallySelfConfirmed:true"));
  assert.ok(rails.includes("additionalBlueConnectorMounts:STEP_SEVEN_END_PIN_IDS.map"));
  assert.ok(rails.includes("seatingDepthVerified:false"));
  assert.ok(railConfig.includes("STEP_SEVEN_MECHANICALLY_VERIFIED = false"));
});
test("Step 8 frame retains all eleven STL parts and real 5-hole connector order",()=>{
  assert.ok(frameScene.includes("5.stl?url"));
  assert.ok(frameScene.includes("7.stl?url"));
  assert.ok(frameScene.includes("15 beams.stl?url"));
  assert.ok(frameScene.includes("pin_pin.stl?url"));
  assert.ok(frameGeom.includes("hole5:2"));
  assert.ok(frameGeom.includes("hole5:4"));
  assert.ok(frameGeom.includes("mechanicallyVerified:false"));
  assert.ok(frame.includes("physicalCheck"));
  assert.ok(frame.includes("STEP_EIGHT_RESULT_KEY"));
});
test("Independent Assembly A and B are both required at Step 9",()=>{
  const stage=read("src/components/practical/StepNineAssemblyReview.tsx");
  assert.ok(stage.includes("STEP_SEVEN_RESULT_KEY"));
  assert.ok(stage.includes("STEP_EIGHT_RESULT_KEY"));
  assert.ok(stage.includes("StepSevenRailsScene"));
  assert.ok(stage.includes("StepEightScene"));
  assert.ok(stage.includes("Do not connect Assembly A and B yet"));
  assert.ok(stage.includes("physicallySelfConfirmed!==true"));
});

test("IMG_1716 final Step 7 action seats two distinct STL long blue connectors",()=>{
  assert.ok(railConfig.includes("STEP_SEVEN_END_HOLE = 1"));
  assert.ok(railConfig.includes("STEP_SEVEN_END_PIN_IDS"));
  assert.ok(railConfig.includes("endPinGuidedPose("));
  assert.ok(railConfig.includes('title:"Insert both blue end connectors"'));
  assert.ok(scene.includes("STEP_SEVEN_END_PIN_IDS.map"));
  assert.ok(scene.includes("blueGroups.current[id]"));
  assert.ok(scene.includes("endPinGuidedPose(id,amount"));
  assert.ok(scene.includes("insert.reverse"));
  assert.ok(rails.includes("IMG_1716"));
  assert.ok(read("src/components/practical/StepNineAssemblyReview.tsx").includes("<StepSevenRailsScene phase={5}"));
});

test("first 15-hole rail approaches from below and moves upward along the rotated pin axis",()=>{
  const localZtoWorldY = z => -Math.sin(Math.PI / 2) * z;
  const gap = 2.1;
  assert.ok(localZtoWorldY(gap+1.9) < localZtoWorldY(gap));
  assert.ok(localZtoWorldY(gap) < 0);
  assert.ok(railConfig.includes("STEP_SEVEN_UPWARD_PRESENTATION_ROTATION_X = Math.PI / 2"));
  assert.ok(scene.includes('name="STEP7_UPWARD_PRESENTATION"'));
  assert.ok(scene.includes("rotation={[STEP_SEVEN_UPWARD_PRESENTATION_ROTATION_X,0,0]}"));
  assert.ok(railConfig.includes('title:"Align the first rail underneath"'));
  assert.ok(railConfig.includes('title:"Push the first rail upward"'));
  assert.ok(railConfig.includes("const seated=first?phase>=2:phase>=4"));
});
