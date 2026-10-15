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
test("Step 9 keeps both prior completed assemblies and connects them in five actions",()=>{
  const stage=read("src/components/practical/StepNineAssemblyReview.tsx");
  const scene=read("src/components/practical/StepNineScene.tsx");
  const geometry=read("src/components/practical/stepNineGeometry.ts");
  assert.ok(stage.includes("STEP_SEVEN_RESULT_KEY"));
  assert.ok(stage.includes("STEP_EIGHT_RESULT_KEY"));
  assert.ok(stage.includes("physicallySelfConfirmed!==true"));
  assert.ok(stage.includes("StepNineScene"));
  assert.ok(stage.includes("STEP_NINE_ACTIONS"));
  assert.ok(stage.includes("AssemblyPlaybackControls"));
  assert.ok(stage.includes("onCompleteStep()"));
  assert.ok(stage.includes("physicallySelfConfirmed:true"));
  assert.ok(scene.includes("STEP5_MODEL_PATHS"));
  assert.ok(scene.includes("STEP_SEVEN_RAIL_IDS.map"));
  assert.ok(scene.includes("STEP_EIGHT_PARTS.map"));
  assert.ok(scene.includes("stepEightPoses(11,frameConfig)"));
  assert.ok(scene.includes("stepNineFramePose"));
  assert.ok(geometry.includes("STEP_NINE_RECEIVERS = [7, 11]"));
  assert.ok(geometry.includes('stepEightPin:"BLUE_1",rail:0,hole:11'));
  assert.ok(geometry.includes('stepEightPin:"BLUE_2",rail:1,hole:11'));
  assert.ok(geometry.includes('stepEightPin:"BLUE_3",rail:0,hole:7'));
  assert.ok(geometry.includes('stepEightPin:"BLUE_4",rail:1,hole:7'));
  assert.ok(geometry.includes("alreadyOccupiedByStepSeven"));
  assert.ok(geometry.includes("mechanicallyVerified:false"));
});

test("Step 7 aligns one black and two grey connectors on each rail",()=>{
  assert.match(railConfig,/railCenterDistance:0\.9,firstRailHole:12,secondRailHole:7/);
  assert.ok(railConfig.includes('receivingBlackHole:receiving+black.beamHoles[0]!-bridge.beamHoles[0]!'));
  assert.ok(railConfig.includes('sourceBlackHole:black.beamHoles[0]!'));
  assert.ok(railConfig.includes('item.side===bridge.side')||railConfig.includes('v.side===bridge.side'));
  assert.ok(railConfig.includes('m.receivingBlackHole<1||m.receivingBlackHole>15'));
  assert.ok(scene.includes('rotation={[0,0,Math.PI]}'));
  assert.ok(scene.includes('greyCore.current.position.y'));
  assert.ok(scene.includes('mount.receivingBlackHole'));
  assert.ok(rails.includes('threePointEngagement:true'));
  assert.ok(rails.includes('railConfigurationErrors(config,handoff?.stepSixConfig)'));
  assert.ok(railConfig.includes("STEP_SEVEN_MECHANICALLY_VERIFIED = false"));
});
test("Both beams are attached before inserting either new blue free-end pin",()=>{
  const seq=railConfig.slice(railConfig.indexOf("export const STEP_SEVEN_ACTIONS"),railConfig.indexOf("] as const;",railConfig.indexOf("export const STEP_SEVEN_ACTIONS")));
  const f=seq.indexOf('title:"Lower all three joints into the first');
  const b=seq.indexOf('title:"Lower all three joints into the second');
  const p=seq.indexOf('title:"Insert first blue');
  const q=seq.indexOf('title:"Insert second blue');
  assert.ok(f>0&&b>f&&p>b&&q>p);
  assert.ok(scene.includes('STEP_SEVEN_PIN_IDS.map'));
  assert.ok(scene.includes('pinInsertion'));
  assert.ok(railConfig.includes('STEP_SEVEN_END_PIN_HOLE = 1'));
  assert.ok(rails.includes('bothRailsMountedBeforeEndPins:true'));
  assert.ok(read("src/components/practical/StepNineScene.tsx").includes("STEP_SEVEN_FINAL_PHASE"));
});

test("Both extra Step 7 pins enter exposed Hole 1 from the black-connector face",()=>{
  assert.ok(railConfig.includes('STEP_SEVEN_END_PIN_FACE = "black-connector-side"'));
  assert.ok(railConfig.includes('STEP_SEVEN_END_PIN_INSERTION_AXIS = "+local-Y"'));
  assert.ok(railConfig.includes("holeFromExposedEnd:1 as const"));
  assert.ok(railConfig.includes("holeFromMeshStart:STEP_SEVEN_END_PIN_HOLE"));
  assert.ok(railConfig.includes("rail.position[1]-STEP_SEVEN_END_PIN_PROJECTION_OFFSET"));
  assert.ok(railConfig.includes("final[1]-2.5"));
  assert.ok(railConfig.includes("occupied.includes(STEP_SEVEN_END_PIN_HOLE)"));
  assert.ok(scene.includes("endPinMount(id,config,beamY,stepSixConfig)"));
  assert.ok(scene.includes('name={id+"-black-side-end-hole"}'));
  assert.ok(scene.includes("pinInsertion"));
  assert.ok(rails.includes("hole:1,holeFromExposedEnd:1,installationFace:STEP_SEVEN_END_PIN_FACE"));
  assert.ok(railConfig.includes("holeFromOppositeEnd:16-STEP_SEVEN_END_PIN_HOLE"));
  assert.ok(scene.includes("STEP_SEVEN_END_PIN_HOLE-8"));
  assert.ok(scene.includes('name={id+"-black-side-end-hole"}'));
  assert.ok(rails.includes("additionalBlueConnectorInsertionAxis:STEP_SEVEN_END_PIN_INSERTION_AXIS"));
  assert.ok(rails.includes("BLACK-CONNECTOR SIDE"));
});

test("Step 7 moves both added end pins to the opposite/right-hand free end without moving rails",()=>{
  // The scene root is rotated 180 degrees around Z. Local hole 1 (x=-7)
  // consequently maps to the screenshot's exposed right-hand rail end.
  assert.match(railConfig,/STEP_SEVEN_END_PIN_HOLE = 1;/);
  assert.ok(railConfig.includes("const x=rail.position[0]+STEP_SEVEN_END_PIN_HOLE-8"));
  assert.ok(scene.includes("STEP_SEVEN_END_PIN_HOLE-8"));
  assert.ok(scene.includes("endPinPose(id,phase,config,beamY,stepSixConfig)"));
  assert.ok(railConfig.includes("railPose(id:StepSevenRailId,phase:number"));
  assert.ok(rails.includes('rail:"STEP7_RAIL_FRONT_15",hole:1'));
  assert.ok(rails.includes('rail:"STEP7_RAIL_BACK_15",hole:1'));
  assert.ok(!rails.includes('rail:"STEP7_RAIL_FRONT_15",hole:15'));
  assert.ok(!rails.includes('rail:"STEP7_RAIL_BACK_15",hole:15'));
});

test("Approved Step 7 rail calibration and visible end-pin camera framing",()=>{
  assert.match(railConfig,/railCenterDistance:0\.9,firstRailHole:12,secondRailHole:7/);
  assert.ok(rails.includes("STEP_SEVEN_PHOTO_CONFIG"));
  assert.ok(rails.includes("first rail grey holes 12/14"));
  assert.ok(rails.includes("second rail grey holes 7/9"));
  assert.ok(railConfig.includes("STEP_SEVEN_END_PIN_HOLE = 1"));
  assert.ok(scene.includes("(endWorldX+railCenterWorldX)/2"));
  assert.ok(scene.includes("overview||pinPhase?1:sign"));
  assert.ok(scene.includes("pinPhase?(mobile?26:20)"));
});
