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
  assert.ok(rails.includes("additionalBlueConnectorsInstalled:true"));
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

test("Step 7 uses photographed beam hole pairs and animates both installed free-end blue pins",()=>{
  assert.match(railConfig,/firstRailHole:6,secondRailHole:1/);
  assert.match(railConfig,/STEP_SEVEN_END_PIN_HOLE = 15/);
  assert.match(railConfig,/start:cfg.bridgeBStart/);
  assert.match(railConfig,/start:cfg.bridgeAStart/);
  assert.ok(railConfig.includes("endPinPose"));
  assert.ok(scene.includes("STEP_SEVEN_PIN_IDS.map"));
  assert.ok(scene.includes("pinInsertion"));
  assert.ok(rails.includes("additionalBlueConnectorsInstalled:true"));
  assert.ok(rails.includes("additionalBlueConnectorMounts:["));
  assert.ok(railConfig.includes('title:"Insert the first blue end pin'));
  assert.ok(railConfig.includes('title:"Insert the second blue end pin'));
  assert.ok(railConfig.includes("stepSevenCoreOffsetZ"));
  assert.ok(scene.includes("STEP7_GREY_CORE"));
  assert.ok(scene.includes("greyCore.current.position.z"));
  assert.ok(scene.includes("pinInsertion"));
  assert.ok(rails.includes("bothRailsMountedBeforeEndPins:true"));
  assert.ok(read("src/components/practical/StepNineAssemblyReview.tsx").includes("phase={STEP_SEVEN_FINAL_PHASE}"));
  assert.ok(railConfig.includes("STEP_SEVEN_MECHANICALLY_VERIFIED = false"));
});

test("Photographed operation order seats BOTH beams before either blue end pin",()=>{
  const actions=railConfig.slice(railConfig.indexOf("export const STEP_SEVEN_ACTIONS = ["),railConfig.indexOf("] as const;",railConfig.indexOf("export const STEP_SEVEN_ACTIONS = [")));
  const firstSeat=actions.indexOf('title:"Press the first grey joints');
  const secondSeat=actions.indexOf('title:"Press the second grey joints');
  const firstPin=actions.indexOf('title:"Insert the first blue end pin');
  const secondPin=actions.indexOf('title:"Insert the second blue end pin');
  assert.ok(firstSeat>0 && secondSeat>firstSeat && firstPin>secondSeat && secondPin>firstPin);
  assert.ok(scene.includes("const oldPhase=replay?Math.max(0,phase-1):was"));
  assert.ok(scene.includes("const from=snapshot(oldPhase)"));
  assert.ok(scene.includes("pose=t<0.42"));
  assert.ok(scene.includes("STEP_SEVEN_RAIL_IDS.map"));
  assert.ok(scene.includes("STEP_SEVEN_PIN_IDS.map"));
  assert.match(railConfig,/if\(first&&phase===3\)/);
  assert.match(railConfig,/if\(phase!==1&&phase!==3\)return 0/);
});
