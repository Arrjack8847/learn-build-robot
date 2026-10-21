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
  for(let manual=10;manual<=14;manual++)assert.ok(data.includes("originalManualStepNumbers: ["+manual+"]"));
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
  assert.ok(geometry.includes('stepEightPin:"BLUE_1",rail:1,hole:7'));
  assert.ok(geometry.includes('stepEightPin:"BLUE_2",rail:0,hole:7'));
  assert.ok(geometry.includes('stepEightPin:"BLUE_3",rail:1,hole:11'));
  assert.ok(geometry.includes('stepEightPin:"BLUE_4",rail:0,hole:11'));
  assert.ok(geometry.includes("alreadyOccupiedByStepSeven"));
  assert.ok(geometry.includes("mechanicallyVerified:false"));
  assert.ok(geometry.includes("STEP_NINE_STEP_SEVEN_YAW = Math.PI"));
  assert.ok(geometry.includes("stepNineOrientedPinOffset(point:V3)"));
  assert.ok(!geometry.includes("STEP_NINE_STEP_EIGHT_FLIP"));
  assert.ok(geometry.includes("STEP_NINE_STEP_EIGHT_FACE_FLIP = Math.PI"));
  assert.ok(!geometry.includes("STEP_NINE_OPPOSITE_FACE_YAW"));
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
  assert.ok(railConfig.includes("firstRailHole:12"));
  assert.ok(railConfig.includes("secondRailHole:7"));
  assert.ok(railConfig.includes("STEP_SEVEN_END_PIN_HOLE = 1"));
  assert.ok(scene.includes("(endWorldX+railCenterWorldX)/2"));
  assert.ok(scene.includes("overview||pinPhase?1:sign"));
  assert.ok(scene.includes("pinPhase?(mobile?26:20)"));
});

test("Step 8 guided motion stays reversible, camera-safe and physically unchanged",()=>{
  assert.ok(frameScene.includes('from "./marksmanLessonMotion"'));
  assert.ok(frameScene.includes("const seated=reverse?a:b;"),
    "Reverse withdrawal must begin at the actual seated pose");
  assert.ok(frameScene.includes("const aligned:StepEightPose"),
    "Approach and reverse must share a coaxial clearance waypoint");
  assert.ok(frameScene.includes('travel.phase===10&&(id==="FIFTEEN"||id==="BLACK_1"||id==="BLACK_2")'),
    "The two black pins must travel rigidly with the 15-hole beam on final locking");
  assert.ok(frameScene.includes("const firstCamera=useRef(true)"));
  assert.ok(frameScene.includes("onStart={()=>{cameraFlight.current=null;onUserCameraInteraction?.();}}"),
    "Manual orbit must interrupt the automatic camera flight");
  assert.ok(frameScene.includes("previousConfigKey.current=configKey"),
    "Photo calibration must reset rather than interpolate between incompatible hole choices");
  assert.ok(frame.includes("onMotionComplete={()=>setAnimating(false)}"));
  assert.ok(frame.includes("disabled={animating||(finished&&!physicalCheck)}"),
    "Do not advance while a connector is still moving");
  assert.ok(frameGeom.includes("sevenNearHole: 2"));
  assert.ok(frameGeom.includes("fifteenNearHole: 7"));
});


test("Step 8 exactly matches Step 7 motion category timing and camera duration",()=>{
  const oldMotion=read("src/components/practical/StepSevenRailsScene.tsx");
  assert.ok(oldMotion.includes("duration:phase===2||phase===4?1.8:phase===5||phase===6?1.25:1.45"));
  assert.ok(oldMotion.includes("delta/0.85"));
  const match=frameScene.match(/function actionDuration\(phase:number\):number \{([\s\S]*?)\n\}/);
  assert.ok(match,"Step 8 must define an action-duration mapping");
  const duration=new Function("phase",match[1]);
  for(const phase of [1,2,3,4,7,8])assert.equal(duration(phase),1.25,"connector "+phase);
  for(const phase of [5,6,10])assert.equal(duration(phase),1.8,"beam press "+phase);
  assert.equal(duration(9),1.45,"align center beam");
  assert.ok(frameScene.includes("Math.min(delta,0.06)/0.85"),"camera exactly 0.85 seconds");
  assert.ok(frameScene.includes("const oldPhase=replaying?Math.max(0,phase-1):prior;"),
    "Recreate deterministic old phase like Step 7, never interpolate from R3F-mutated target props");
  assert.ok(frameScene.includes("const from=stepEightPoses(oldPhase,config)"));
  assert.ok(frameScene.includes("posesDiffer(from,destination)"),
    "Do not invent a movement on the static final inspection action");
  assert.ok(frameScene.includes("t<0.42")&&frameScene.includes("t/0.42")&&frameScene.includes("(t-0.42)/0.58"),
    "Use Step 7's 42% approach and 58% straight insertion");
  assert.ok(frameScene.includes("cameraFlight.current=null;"),"dragging cancels camera flight");
  assert.ok(frameScene.includes("const seated=reverse?a:b;"),"reverse via shared insertion clearance");
  assert.ok(frameScene.includes("travel.phase===10&&(id===\"FIFTEEN\"||id===\"BLACK_1\"||id===\"BLACK_2\")"),
    "Two black connectors move rigidly with the final beam");
});

test("Step 8 approved 7-and-11 black-pin holes and preserved blue-pin target holes",()=>{
  assert.match(frameGeom,/sevenNearHole:\s*2,/);
  assert.match(frameGeom,/fifteenNearHole:\s*7,/);
  assert.ok(frameGeom.includes("beam15Hole:config.fifteenNearHole+4"));
  for(const value of ["hole5:2","hole5:4","receiverHole:3"]){
    assert.ok(frameGeom.includes(value),"Preserve existing receiver "+value);
  }
  assert.ok(frame.includes('i===6?" (approved)":""'),"Show the correct approved drop-down selection");
  assert.ok(frame.includes("activeBlackHole=phase===7?config.fifteenNearHole"));
  assert.ok(frame.includes("phase===8?config.fifteenNearHole+4:null"));
});

test("Early Step 8 actions teach a clear preparation, approach and connection sequence",()=>{
  assert.ok(frame.includes('aria-label="Preparation groups"'),"Group parts visibly before assembly");
  assert.ok(frame.includes("Group A · prepare first"));
  assert.ok(frame.includes("Group B · prepare second"));
  assert.ok(frame.includes("Keep nearby · use later"));
  assert.ok(frame.includes('aria-label="Active connector and receiving hole"'));
  assert.ok(frame.includes("Target · Hole {activeBlueHole}"));
  assert.ok(frame.includes("phase+1}/{STEP_EIGHT_SEQUENCE.length}"),"Unique action count, not repeated manual numbers");
  assert.ok(frameScene.includes("const activeBlue=phase>=1&&phase<=4"));
  assert.ok(frameScene.includes("const blueClearance:V3|null=toBlue"));
  assert.ok(frameScene.includes("points={[fromBlue,blueClearance]}"));
  assert.ok(frameScene.includes("points={[blueClearance,toBlue]}"));
  assert.ok(frameScene.includes("const activeReceiver=phase>=1&&phase<=4"));
  assert.ok(frameScene.includes("travel.phase===5&&("),
    "Both prepared 5-hole beam groups move together with their attached pins");
  assert.ok(frameScene.includes("id.startsWith(\"BLUE_\")"));
  assert.ok(frameScene.includes("Math.min(1,t/0.42)"),"Reposition groups in approach stage");
  assert.ok(frameScene.includes("(t-0.58)/0.42"),"Reverse without drifting connection targets");
  assert.ok(frame.includes('onUserCameraInteraction={()=>{if(phase===11)setAutoInspect(false);}}/>'),
    "Manual final inspection must disable auto orbit");
  assert.ok(frame.includes('relative z-10 mx-auto mt-3 w-full max-w-[900px]'),
    "Keep playback dock outside the 3D viewport");
  assert.ok(!frame.includes('absolute inset-x-2 bottom-2 z-10'),
    "Control dock must not obscure the 3D model");
  assert.ok(frameScene.includes('phase===5?["BLUE_1","BLUE_3"]'));
  assert.ok(frameScene.includes('phase===6?["BLUE_2","BLUE_4"]'));
});

test("Step 8 preparation keeps all eleven original STL parts visibly separated",()=>{
  const match=frameGeom.match(/export const STEP_EIGHT_PREPARATION_LAYOUT:[^\n]* = \{([\s\S]*?)\n\};/);
  assert.ok(match,"A single explicit preparation layout is the source of truth");
  const prep=new Function("STEP_EIGHT_LEVEL","STEP_EIGHT_SEVEN_RAIL_PREPARATION_Z",
    "STEP_EIGHT_FIFTEEN_BEAM_ALIGNMENT_Z",
    `return ({${match[1]}});`)((7.8+1.5)/8,(7.8+1.5)/8+7.8/8+2.7,
      (7.8+1.5)/8+7.8/8+2.2);
  const ids=["FIVE_A","FIVE_B","SEVEN_A","SEVEN_B","FIFTEEN",
    "BLUE_1","BLUE_2","BLUE_3","BLUE_4","BLACK_1","BLACK_2"];
  assert.deepEqual(Object.keys(prep).sort(),ids.sort());
  const footprint=id=>id.startsWith("FIVE")?[5,1.15]:
    id.startsWith("SEVEN")?[1.15,7]:
    id==="FIFTEEN"?[1.15,15]:[1.35,1.35];
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
    const a=ids[i],b=ids[j];
    const [aw,ah]=footprint(a),[bw,bh]=footprint(b);
    const gapX=Math.abs(prep[a][0]-prep[b][0])-(aw+bw)/2;
    const gapY=Math.abs(prep[a][1]-prep[b][1])-(ah+bh)/2;
    assert.ok(gapX>=0.5||gapY>=0.5,
      `${a} and ${b} have insufficient separation in the preparation layout`);
  }
  assert.ok(frameGeom.includes("fifteenNearHole: 7"),"Keep approved black holes 7 and 11");
  assert.ok(frameGeom.includes("hole5:2")&&frameGeom.includes("hole5:4"));
  assert.ok(frameGeom.includes("receiverHole:3"));
  assert.ok(frameGeom.includes("longAtFrame ? STEP_EIGHT_FIFTEEN_BEAM_SEATED_Z") &&
    frameGeom.includes("STEP_EIGHT_FIFTEEN_BEAM_ALIGNMENT_Z"),
    "The 15-hole beam must align from ABOVE and descend onto the grey-beam top faces");
  assert.ok(frameGeom.includes("phase>=5?-1:STEP_EIGHT_PREPARATION_LAYOUT.SEVEN_A[0]"),
    "Only loose beam A positions may change");
  assert.ok(frameGeom.includes("phase>=6?1:STEP_EIGHT_PREPARATION_LAYOUT.SEVEN_B[0]"),
    "Only loose beam B positions may change");
  assert.ok(frameScene.includes("function fittedCamera(")&&
    frameScene.includes("const aspect=Math.max(0.3,width/Math.max(height,1))")&&
    frameScene.includes("phase===0?[0,-0.26,1]")&&
    frameScene.includes("Math.max(halfHeight/Math.tan(halfVFov)"),
    "Use a responsive near-overhead camera fitted to projected part extents");
  assert.ok(frameScene.includes("maxDistance={210}"),
    "Permit enough camera distance for portrait viewers without clipping");
});

test("Step 8 responsive camera, mobile controls and animated instructional guides",()=>{
  assert.ok(frameScene.includes("if(phase<=2)return [\"FIVE_A\",\"BLUE_1\",\"BLUE_2\"]"));
  assert.ok(frameScene.includes("if(phase<=4)return [\"FIVE_B\",\"BLUE_3\",\"BLUE_4\"]"));
  assert.ok(frameScene.includes("poses.push(stepEightPoses(phase-1,config))"),
    "Camera must fit both start and end positions during each animation");
  assert.ok(frameScene.includes("halfWidth/(Math.tan(halfVFov)*aspect)"),
    "Camera must fit horizontal FOV on narrow screens");
  assert.ok(frameScene.includes("halfHeight/Math.tan(halfVFov)"),
    "Camera must fit vertical FOV on landscape screens");
  assert.ok(frameScene.includes("lastViewport.current={width:size.width,height:size.height}"),
    "Reframe after browser resize and device orientation changes");
  assert.ok(frameScene.includes("size.width<520?1.25:size.width<900?1.5:1.75"),
    "Use adaptive pixel density for mobile, tablet, and desktop GPUs");
  assert.ok(frameScene.includes('gl={{antialias:true,powerPreference:"high-performance"}}'));
  assert.ok(frameScene.includes("const opacity=Math.min(1,Math.max(0,(1-pct)/0.18))*0.88"),
    "Fade guidance as insertion seats, without extending the action duration");
  assert.ok(frameScene.includes("guideGroup.current?.traverse"));
  assert.ok(frameScene.includes("pin?.material as MeshStandardMaterial"));
  assert.ok(frame.includes("min-[430px]:grid-cols-2 lg:grid-cols-3"),
    "Preparation cards must stack on small phones");
  assert.ok(frame.includes("h-[clamp(300px,50svh,560px)]"),
    "Viewer must fit in portrait mobile viewport");
  assert.ok(frame.includes("sm:h-[clamp(430px,68svh,780px)]"));
  assert.ok(frame.includes("min-h-11 min-w-0"),"Next control must remain usable on small screens");
  assert.ok(frameGeom.includes("fifteenNearHole: 7"),"Never change approved black holes 7 and 11");
});

test("Step 8 blue pins descend from above, remain visible and never protrude below the 5-hole beams",()=>{
  const match=frameGeom.match(/export const STEP_EIGHT_PREPARATION_LAYOUT:[^\n]* = \{([\s\S]*?)\n\};/);
  assert.ok(match,"Expected explicit layout with all 11 original parts");
  const prep=new Function("STEP_EIGHT_LEVEL","STEP_EIGHT_SEVEN_RAIL_PREPARATION_Z",
    "STEP_EIGHT_FIFTEEN_BEAM_ALIGNMENT_Z",
    `return ({${match[1]}});`)((7.8+1.5)/8,(7.8+1.5)/8+7.8/8+2.7,
      (7.8+1.5)/8+7.8/8+2.2);
  assert.ok(frameGeom.includes("STEP_EIGHT_BLUE_CONNECTOR_LENGTH_MM = 24"));
  assert.ok(frameGeom.includes("export const STEP_EIGHT_BLUE_PIN_SEATED_Z ="));
  assert.ok(frameGeom.includes("STEP_EIGHT_BLUE_CONNECTOR_LENGTH_MM/(2*STEP_EIGHT_PITCH_MM) + 0.02"));
  for(let n=1;n<=4;n++){
    const beam=n<=2?"FIVE_A":"FIVE_B";
    const beamTop=prep[beam][2]+(7.8/8)/2;
    const beamBottom=prep[beam][2]-(7.8/8)/2;
    const pinCenter=beamBottom+24/(2*8)+0.02;
    const pinBottom=pinCenter-24/(2*8);
    const pinTop=pinCenter+24/(2*8);
    assert.ok(prep["BLUE_"+n][2]-24/(2*8)>beamTop,
      "Connector "+n+" must start completely ABOVE the 5-hole beam");
    assert.ok(pinBottom>=beamBottom,
      "Connector "+n+" must not extend below its beam after seating");
    assert.ok(pinTop>beamTop,
      "Connector "+n+" must remain visibly exposed above its beam");
  }
  assert.ok(frameScene.includes("const sign=phase===7||phase===8?-1:1"),
    "Blue and white parts move downward, but black pins rise into the 15-hole beam");
  assert.ok(frameScene.includes("[toBlue[0],toBlue[1],toBlue[2]+2.15]"),
    "The gold insertion guide must match the top-down insertion path");
  assert.ok(frameScene.includes("phase>=1&&phase<=4?[0.75,-1.2,1.15]"),
    "Camera must show the exposed blue ends from above");
  assert.ok(frameScene.includes('const underside=id==="FIFTEEN"&&(phase===7||phase===8)') &&
    frameScene.includes('const faceZ=(STEP_EIGHT_THICKNESS_MM/(2*STEP_EIGHT_PITCH_MM)+0.04)*'),
    "Blue-pin hole rings mark the TOP face while black-pin rings mark the underside");
  assert.ok(frameGeom.includes("const seated = phase>=activation;") &&
    frameGeom.includes("const p=seated ? [hole-3,beamY,STEP_EIGHT_BLUE_PIN_SEATED_Z]"),
    "Seated connectors must stay installed and move rigidly with their beams");
  assert.ok(frameScene.includes('STEP_EIGHT_PARTS.map(id=>{')&&
    frameScene.includes('name={id} visible={true}')&&
    frameScene.includes('frustumCulled={false}')&&
    frameScene.includes('transparent={false} opacity={1}'),
    "All original STL meshes must remain visible, opaque, and unscaled");
  assert.equal((frameScene.match(/opacity=opacity/g)||[]).length,1,
    "Only temporary guides, never actual parts, may animate opacity");
  assert.ok(frameScene.includes('if(line.material)line.material.opacity=opacity'));
  assert.ok(frameScene.includes('guideGroup.current?.traverse'));
  assert.ok(frameGeom.includes("fifteenNearHole: 7") &&
    frameGeom.includes("hole5:2") && frameGeom.includes("hole5:4"),
    "Keep all approved hole selections unchanged");
  for(let n=1;n<=4;n++)
    assert.ok(frameGeom.includes("blue connector "+n)||frameGeom.includes("connector "+n),
      "Name each blue connector in its action");
  assert.equal((frameGeom.match(/DOWNWARD/g)||[]).length,7,
    "All four blue pins and all three white-beam insertions must move downward");
});

test("Step 8 both 7-hole white beams descend onto the four upper blue-pin ends",()=>{
  const pitch=8,thickness=7.8;
  const fiveCenter=(thickness+1.5)/pitch;
  const halfThickness=thickness/(2*pitch);
  const fiveBottom=fiveCenter-halfThickness;
  const fiveTop=fiveCenter+halfThickness;
  const sevenCenter=fiveCenter+thickness/pitch;
  const sevenBottom=sevenCenter-halfThickness;
  const sevenTop=sevenCenter+halfThickness;
  const blueCenter=fiveBottom+24/(2*pitch)+0.02;
  const blueBottom=blueCenter-24/(2*pitch);
  const blueTop=blueCenter+24/(2*pitch);
  const alignedRailCenter=sevenCenter+2.15;
  const looseRailCenter=sevenCenter+2.7;
  assert.ok(Math.abs(sevenBottom-fiveTop)<1e-9,
    "Installed 7-hole beams should rest ON TOP of the 5-hole beams");
  assert.ok(blueBottom>=fiveBottom,
    "Blue pins may not protrude under any 5-hole beam");
  assert.ok(blueTop>sevenTop,
    "All four blue pin ends remain visible ABOVE the installed white rails");
  assert.ok(alignedRailCenter-halfThickness>blueTop,
    "Each rail must clear the standing pins before its downward seating stroke");
  assert.ok(looseRailCenter>alignedRailCenter,
    "Both loose rails start higher than the insertion alignment waypoint");
  assert.ok(frameGeom.includes("export const STEP_EIGHT_SEVEN_RAIL_SEATED_Z =")&&
    frameGeom.includes("STEP_EIGHT_LEVEL + STEP_EIGHT_THICKNESS_MM/STEP_EIGHT_PITCH_MM"));
  assert.ok(frameGeom.includes("STEP_EIGHT_SEVEN_RAIL_PREPARATION_Z ="));
  assert.ok(frameGeom.includes("SEVEN_A: [-8.5,0,STEP_EIGHT_SEVEN_RAIL_PREPARATION_Z]"));
  assert.ok(frameGeom.includes("SEVEN_B: [4,0,STEP_EIGHT_SEVEN_RAIL_PREPARATION_Z]"));
  assert.ok(frameGeom.includes("phase>=5?STEP_EIGHT_SEVEN_RAIL_SEATED_Z:STEP_EIGHT_PREPARATION_LAYOUT.SEVEN_A[2]"));
  assert.ok(frameGeom.includes("phase>=6?STEP_EIGHT_SEVEN_RAIL_SEATED_Z:STEP_EIGHT_PREPARATION_LAYOUT.SEVEN_B[2]"));
  assert.ok(frameGeom.includes("if(phase===5||phase===6)return [phase===5?-1:1,0,STEP_EIGHT_SEVEN_RAIL_SEATED_Z]"));
  assert.ok(frameScene.includes("const sign=phase===7||phase===8?-1:1"),
    "Both 7-hole beams retain their downward insertion directions");
  assert.ok(frameScene.includes("const descendingWhiteRail=phase===5||phase===6"));
  assert.ok(frameScene.includes("STEP_EIGHT_SEVEN_RAIL_SEATED_Z+2.15"),
    "The dual-connector guides stop at the top interface, not below the frame");
  assert.ok(frameScene.includes('phase===5?["BLUE_1","BLUE_3"]')&&
    frameScene.includes('phase===6?["BLUE_2","BLUE_4"]'),
    "Each white rail must align onto its pair of blue pins");
  assert.ok(frameScene.includes("travel.phase===5&&(")&&
    frameScene.includes('id.startsWith("BLUE_")'),
    "Both 5-hole rails and all four pins remain rigid while the first 7-hole rail seats");
  assert.ok(frameGeom.includes("fifteenNearHole: 7")&&
    frameGeom.includes("hole5:2")&&frameGeom.includes("hole5:4"),
    "Existing approved hole numbers must be unaffected");
  assert.ok(frameGeom.includes("config.sevenNearHole+4"),
    "The 7-hole receiving pair must stay four holes apart");
  assert.ok(frameScene.includes("active&&((id===\"SEVEN_A\"&&phase===5)||(id===\"SEVEN_B\"&&phase===6))"),
    "Mark the actual underside receiving holes on the descending white rails");
  assert.ok(frameGeom.includes('Keep both blue tips visible from the top.') &&
    frameGeom.includes('all four connectors remain visible'),
    "Instructions must describe both descending rails and retained blue pins");
});


test("Step 8 all three white rails sit above grey beams; center rail descends on two black locks",()=>{
  const pitch=8,thickness=7.8;
  const greyZ=(thickness+1.5)/pitch;
  const halfThick=thickness/(2*pitch);
  const greyTop=greyZ+halfThick;
  const greyBottom=greyZ-halfThick;
  const outerWhiteZ=greyZ+thickness/pitch;
  const white15Z=outerWhiteZ;
  const white15Bottom=white15Z-halfThick;
  const alignedZ=white15Z+2.2;
  const centerBlackZ=white15Z-halfThick;
  assert.ok(Math.abs(white15Z-outerWhiteZ)<1e-9,
    "Center and outer white rails must seat at exactly the SAME TOP HEIGHT");
  assert.ok(Math.abs(white15Bottom-greyTop)<1e-9,
    "The center white beam must touch BOTH grey beams from ABOVE");
  assert.ok(white15Z>greyZ && white15Bottom>greyBottom,
    "The 15-hole white beam must never sit under the grey 5-hole beams");
  assert.ok(Math.abs(centerBlackZ-greyTop)<1e-9,
    "The black pins must straddle the white-over-grey mating interface");
  assert.ok(alignedZ-halfThick-16/(2*pitch)>greyTop,
    "The black pins must clear the frame before the long beam descends");
  assert.ok(frameGeom.includes("export const STEP_EIGHT_FIFTEEN_BEAM_SEATED_Z =")&&
    frameGeom.includes("STEP_EIGHT_SEVEN_RAIL_SEATED_Z;"),
    "Center rail is coplanar with outer white rails");
  assert.ok(frameGeom.includes("export const STEP_EIGHT_BLACK_PIN_INTERFACE_OFFSET_Z =")&&
    frameGeom.includes("-STEP_EIGHT_THICKNESS_MM/(2*STEP_EIGHT_PITCH_MM)"),
    "Black pins engage DOWN into the grey beams from the central white beam");
  assert.ok(frameGeom.includes("export const STEP_EIGHT_FIFTEEN_BEAM_ALIGNMENT_Z =")&&
    frameGeom.includes("STEP_EIGHT_FIFTEEN_BEAM_SEATED_Z + 2.2"));
  assert.ok(frameGeom.includes("FIFTEEN: [9,0,STEP_EIGHT_FIFTEEN_BEAM_ALIGNMENT_Z]"),
    "The loose long white beam must stay above the frame, never pass through it");
  assert.ok(frameGeom.includes("longAtFrame ? STEP_EIGHT_FIFTEEN_BEAM_SEATED_Z")&&
    frameGeom.includes(": STEP_EIGHT_FIFTEEN_BEAM_ALIGNMENT_Z;"),
    "The long beam must remain above grey beams during alignment");
  assert.ok(frameGeom.includes("xyz(longX,firstY,longZ+STEP_EIGHT_BLACK_PIN_INTERFACE_OFFSET_Z)")&&
    frameGeom.includes("xyz(longX,secondY,longZ+STEP_EIGHT_BLACK_PIN_INTERFACE_OFFSET_Z)"),
    "Both real black connectors must move RIGIDLY with the center beam");
  assert.ok(frameGeom.includes("fifteenNearHole: 7")&&
    frameGeom.includes("beam15Hole:config.fifteenNearHole+4")&&
    frameGeom.includes('receiverHole:3'),
    "Black-pin target holes remain 7 and 11 on center beam, Hole 3 on grey beams");
  assert.ok(frameGeom.includes("const firstY = longAligned ? -2")&&
    frameGeom.includes("const secondY = firstY + 4"),
    "Both black pins must align with grey beams at y=-2 and +2");
  assert.ok(frameScene.includes("const sign=phase===7||phase===8?-1:1")&&
    frameScene.includes('travel.phase===10&&(id==="FIFTEEN"||id==="BLACK_1"||id==="BLACK_2")'),
    "Action 11 still lowers the long white beam with both already-installed black pins");
  assert.ok(frameScene.includes("const descendingWhiteRail=phase===5||phase===6||phase===9||phase===10"),
    "Double-pin guides show a TOP-DOWN movement, never underside insertion");
  assert.ok(frameGeom.includes("All three white beams stay on top; nothing disappears or detaches."));
  assert.ok(frameGeom.includes("SAME TOP SIDE as the pair of 7-hole white beams."));
  assert.ok(frameGeom.includes("STEP_EIGHT_SEVEN_RAIL_SEATED_Z"),
    "Previously approved first and second white-rail seating must stay unchanged");
});

test("Step 8 both black connector pins enter from below and rise into holes 7 and 11",()=>{
  const pitch=8,thickness=7.8;
  const greyZ=(thickness+1.5)/pitch;
  const railZ=greyZ+thickness/pitch;
  const longWhiteZ=railZ+2.2;
  const longWhiteBottom=longWhiteZ-thickness/(2*pitch);
  const pinSeatedZ=longWhiteBottom;
  const pinLooseZ=1.3;
  const blackHalfLength=16/(2*pitch);
  const pinClearanceZ=pinSeatedZ-2.15;
  assert.ok(pinLooseZ+blackHalfLength<longWhiteBottom,
    "Both loose black STL pins must sit fully BELOW the detached 15-hole white beam");
  assert.ok(pinClearanceZ+blackHalfLength<longWhiteBottom,
    "The coaxial upward approach must not intersect the white beam before seating");
  assert.ok(pinSeatedZ>pinClearanceZ && pinClearanceZ>pinLooseZ,
    "Pins first align below, then enter UPWARD without changing their final location");
  assert.ok(frameGeom.includes('BLACK_1: [6.5,-10.6,1.3]')&&
    frameGeom.includes('BLACK_2: [10.7,-10.6,1.3]'),
    "Both black connectors remain physically separated in the loose parts layout");
  assert.ok(frameScene.includes("const sign=phase===7||phase===8?-1:1"),
    "Only black connectors use -Z clearance and UPWARD insertion");
  assert.ok(frameScene.includes('phase===7||phase===8?[0.85,-1.1,-0.9]'),
    "Inspect the receiving holes from the underside while installing black pins");
  assert.ok(frameScene.includes('const underside=id==="FIFTEEN"&&(phase===7||phase===8)')&&
    frameScene.includes('rotation={underside?[Math.PI,0,0]:[0,0,0]}'),
    "The orange target rings must mark the underside of the long white beam");
  assert.ok(frameScene.includes('const activeBlack=phase===7?"BLACK_1":phase===8?"BLACK_2":null'));
  assert.ok(frameScene.includes('[toBlack[0],toBlack[1],toBlack[2]-2.15]'),
    "Both instructional guides must show an approach from BELOW");
  assert.ok(frameScene.includes('points={[fromBlack,blackClearance]}')&&
    frameScene.includes('points={[blackClearance,toBlack]}'),
    "Black connector guide paths must rise from the loose pose into each hole");
  assert.ok(frameScene.includes('const activeConnector=activeBlue===id||activeBlack===id'),
    "Pin highlighted during motion remains fully rendered");
  assert.ok(frameGeom.includes('const id=phase===7?"BLACK_1":"BLACK_2"')&&
    frameGeom.includes('const seated=stepEightPoses(phase,config)[id].position'),
    "Guide target is an actual world-space mounting location, not a fabricated origin");
  assert.ok(frameGeom.includes('fifteenNearHole: 7')&&
    frameGeom.includes('beam15Hole:config.fifteenNearHole+4')&&
    frameGeom.includes('receiverHole:3'),
    "Final black-pin holes remain 7 and 11; corresponding grey receivers stay Hole 3");
  assert.ok(frameGeom.includes('xyz(longX,firstY,longZ+STEP_EIGHT_BLACK_PIN_INTERFACE_OFFSET_Z)')&&
    frameGeom.includes('xyz(longX,secondY,longZ+STEP_EIGHT_BLACK_PIN_INTERFACE_OFFSET_Z)'),
    "The installed pins keep their approved mounted poses and move with the beam");
  assert.ok(frameGeom.includes('push vertically UPWARD into the UNDERSIDE')&&
    frameGeom.includes('push UPWARD into the UNDERSIDE'),
    "Both instructions explicitly teach lower-to-upper insertion");
  assert.ok(frame.includes('push vertically UPWARD into its UNDERSIDE'),
    "The active action panel must agree with the 3D black pin animation");
});
