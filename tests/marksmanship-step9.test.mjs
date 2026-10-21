import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const read=(path)=>readFileSync(resolve(path),"utf8");
const geometry=read("src/components/practical/stepNineGeometry.ts");
const viewer=read("src/components/practical/StepNineScene.tsx");
const lesson=read("src/components/practical/StepNineAssemblyReview.tsx");
const routeData=read("src/data/practical.ts");

test("Photographed Step 9 begins at action zero and ends with inspection",()=>{
  const start=geometry.indexOf("export const STEP_NINE_ACTIONS");
  const end=geometry.indexOf("] as const;",start);
  const seq=geometry.slice(start,end);
  for(const label of ['number:"0"','number:"1"','number:"2"','number:"3"','number:"4"'])
    assert.ok(seq.includes(label),label);
  assert.ok(seq.indexOf("Prepare the two completed")<seq.indexOf("Turn Step 8 over to its opposite face"));
  assert.ok(seq.indexOf("Turn Step 8 over to its opposite face")<seq.indexOf("Align four mounting connectors beneath Step 7"));
  assert.ok(seq.indexOf("Align four mounting connectors beneath Step 7")<seq.indexOf("Lower Step 7 onto four real connectors"));
  assert.ok(seq.indexOf("Lower Step 7 onto four real connectors")<seq.indexOf("Inspect four real seated connectors"));
  assert.ok(lesson.includes("Action 0 prepares the two finished structures"));
});
test("The four photographed holes are the two open targets on each Step 7 rail",()=>{
  assert.ok(geometry.includes("STEP_NINE_RECEIVERS = [7, 11]"));
  const pairs=[["BLUE_1",1,7],["BLUE_2",0,7],["BLUE_3",1,11],["BLUE_4",0,11]];
  for(const [pin,rail,hole] of pairs){
    assert.ok(geometry.includes(`stepEightPin:"${pin}",rail:${rail},hole:${hole}`));
  }
  // The previously final 180-degree flip put Step 8's original +Z
  // blue connector ends on the DOWNWARD side. The corrected join restores
  // the original Step 8 face, reversing the lateral receiving-rail pairing.
  const blue=[[-1,-2,.58],[1,-2,.58],[-1,2,.58],[1,2,.58]];
  assert.deepEqual(blue.map(([x,y,z])=>[-y,-z,x]),
    [[2,-.58,-1],[2,-.58,1],[-2,-.58,-1],[-2,-.58,1]]);
  assert.ok(geometry.includes("alreadyOccupiedByStepSeven"));
  assert.ok(geometry.includes("geometryWarnings"));
});
test("Corrected Step 8 joins upward without changing its standalone poses",()=>{
  const thickness=7.8/8;
  const step8SevenRailHeight=(7.8+1.5)/8+thickness;
  const step8BluePinCenter=(7.8+1.5)/8-thickness/2+24/16+0.02;
  // Step 9's outer parent turns shared Y into world -Y.
  const step8JoinAxisShared=[0,-1,0]; // +local Z through joining orientation
  const step8JoinAxisWorld=[-step8JoinAxisShared[0],-step8JoinAxisShared[1],step8JoinAxisShared[2]];
  assert.deepEqual(step8JoinAxisWorld,[0,1,0],"The four blue connector upper ends must point toward Step 7");
  const step8PreparationAxisShared=[0,1,0]; // inverted presentation frame
  assert.deepEqual([-step8PreparationAxisShared[0],-step8PreparationAxisShared[1],step8PreparationAxisShared[2]],[0,-1,0]);
  const railCentreSharedY=0;
  const frameRootSharedY=railCentreSharedY+thickness+step8SevenRailHeight;
  const lowerSevenRailSharedY=frameRootSharedY-step8SevenRailHeight;
  assert.ok(Math.abs(lowerSevenRailSharedY-railCentreSharedY-thickness)<1e-9,
    "The Step 8 7-hole rail stays just BELOW Step 7's 15-hole rail, face-to-face");
  const greyBeamSharedY=frameRootSharedY-(7.8+1.5)/8;
  assert.ok(greyBeamSharedY>lowerSevenRailSharedY,"Step 8's grey crossbeams must stay below its white rails");
  assert.ok(geometry.includes("railCenterY + STEP_NINE_RAIL_FACE_SEATING + STEP_EIGHT_SEVEN_RAIL_SEATED_Z"));
  assert.ok(geometry.includes("stepEightPoses(11,config)"),"Real complete Step 8 pin centres feed the rigid solve");
  assert.ok(geometry.includes("stepNineOrientedPinOffset(completedStepEight[id].position)"));
  // Do not claim zero protrusion: with the unmeasured Step 8 seating the
  // predicted 24 mm pin tip is ~0.76 mm beyond the Step 7 upper beam face.
  const exposedEndY=frameRootSharedY-step8BluePinCenter-24/16;
  const farSideY=railCentreSharedY-thickness/2;
  const predictedOverhangMm=(farSideY-exposedEndY)*8;
  assert.ok(predictedOverhangMm>0&&predictedOverhangMm<2);
  assert.ok(geometry.includes("A blue connector may extend "),
    "Flag unmeasured remaining tip overhang; never shorten or hide connector meshes");
  assert.ok(geometry.includes("alreadyOccupiedByStepSeven"));
});

test("Preparation moves both complete rigid roots, while the original internal joint poses are preserved",()=>{
  assert.ok(viewer.includes("STEP5_MODEL_PATHS"));
  assert.ok(viewer.includes("stepEightPoses(11,frameConfig)"));
  assert.ok(viewer.includes("endPinPose(id,STEP_SEVEN_FINAL_PHASE"));
  assert.ok(viewer.includes("railPose(id,STEP_SEVEN_FINAL_PHASE"));
  assert.ok(viewer.includes("ref={frame}"));
  assert.ok(viewer.includes("frame.current.position.set"));
  assert.ok(viewer.includes("frame.current.quaternion.copy"));
  assert.ok(!viewer.includes("scale.set("));
  assert.ok(!viewer.includes("clipPath"));
});
test("Step 9 requires both saved independent assemblies, supports controls, and self-confirmed finish",()=>{
  assert.ok(lesson.includes("STEP_SEVEN_RESULT_KEY"));
  assert.ok(lesson.includes("STEP_EIGHT_RESULT_KEY"));
  assert.ok(lesson.includes("physicallySelfConfirmed!==true"));
  assert.ok(lesson.includes("AssemblyPlaybackControls"));
  assert.ok(lesson.includes("onReplay="));
  assert.ok(lesson.includes("onTogglePause="));
  assert.ok(lesson.includes("onPrevious="));
  assert.ok(lesson.includes("step9:joined:v1"));
  assert.ok(lesson.includes("physicallySelfConfirmed:true"));
  assert.ok(routeData.includes('title: "Connect Step 8 to Step 7 using four blue pins"'));
});

test("Step 7 turns 180 degrees horizontally ONLY within Step 9",()=>{
  assert.match(geometry,/STEP_NINE_STEP_SEVEN_YAW = Math.PI/);
  assert.match(geometry,/return \[-point\[0\],point\[1\],-point\[2\]\]/);
  assert.ok(viewer.includes('name="STEP9_STEP7_COMPLETE_ASSEMBLY"'));
  assert.ok(!viewer.includes('name="STEP9_STEP8_COMPLETE_ASSEMBLY" rotation={[0,STEP_NINE_STEP_SEVEN_YAW,0]}'));
  assert.ok(viewer.includes('name="STEP9_STEP8_COMPLETE_ASSEMBLY" ref={frame}'));
  assert.ok(geometry.includes('stepSevenLocalTarget:stepNineTurnedPoint(['));
  assert.ok(geometry.includes("centreOf(0)"));
  assert.ok(geometry.includes("centreOf(2)"));
  assert.ok(geometry.includes("STEP_NINE_RAIL_FACE_SEATING"));
  assert.ok(geometry.includes("STEP_EIGHT_THICKNESS_MM / STEP_EIGHT_PITCH_MM"));
  assert.ok(geometry.includes("Math.abs(Math.abs(first.position[2]-second.position[2])-2)>0.3"));
  assert.ok(geometry.includes('stepEightPinOffsets'));
  const rotateHorizontal=([x,y,z])=>[-x,y,-z];
  assert.deepEqual(rotateHorizontal([2,4,-1]),[-2,4,1]);
  assert.deepEqual(rotateHorizontal([-4,7,3]),[4,7,-3]);
});

test("Updated Step 8 setup is integrated without reconstructing or replacing its final assembly",()=>{
  const step8Geom=read("src/components/practical/stepEightGeometry.ts");
  const step8View=read("src/components/practical/StepEightScene.tsx");
  const step8UI=read("src/components/practical/StepEightAssembly.tsx");
  assert.ok(step8Geom.includes("STEP_EIGHT_PREPARATION_LAYOUT"));
  assert.ok(step8Geom.includes("fifteenNearHole: 7"));
  assert.ok(step8Geom.includes("const movedFrame = phase >= 5"));
  assert.ok(step8View.includes("const smooth=motionEase"));
  assert.ok(step8View.includes("function actionDuration(phase:number)"));
  assert.ok(step8UI.includes('aria-label="Preparation groups"'));
  assert.ok(viewer.includes("stepEightPoses(11,frameConfig)"),
    "Step 9 must show the fully assembled Step 8, not its earlier loose preparation phase");
  assert.ok(lesson.includes("needsStepEightRefresh"),
    "Saved earlier Step 8 configurations cannot silently become physically approved");
  assert.ok(lesson.includes("STEP_EIGHT_DEMO_CONFIG"));
  assert.ok(lesson.includes("usesUpdatedStepEightAssembly:true"));
  assert.ok(lesson.includes("stepEightBlackPinHoles:[7,11]"));
});

test("Step 9 Action 0 enters as two separate completed assemblies, using Step 7 timing",()=>{
  assert.ok(geometry.includes("STEP_NINE_PREP_DURATION = 1.45"));
  assert.ok(geometry.includes("STEP_NINE_CAMERA_DURATION = 0.85"));
  assert.ok(geometry.includes("STEP_NINE_PREP_ENTRANCE_OFFSET = 8.5"));
  assert.ok(viewer.includes("enterPreparation=phase===0&&(!mounted.current||replay)&&!reducedMotion"));
  assert.ok(viewer.includes("const fromStart:V3=[STEP_NINE_PREP_ENTRANCE_OFFSET,0,0]"));
  assert.ok(viewer.includes("to.position[0]-STEP_NINE_PREP_ENTRANCE_OFFSET"));
  assert.ok(viewer.includes("ref={stepSeven}"));
  assert.ok(viewer.includes("ref={frame}"));
  assert.ok(viewer.includes("stepSeven.current?.position.set(...motionLerp"));
  assert.ok(viewer.includes("const stepEightT=Math.max(0,Math.min(1,(t-0.10)/0.90))"));
  assert.ok(viewer.includes("if(t===1){prepEntrance.current=null;motionDone.current?.();}"));
  assert.ok(viewer.includes("Math.max(1,0.9/Math.max(0.45,aspect))"));
  assert.ok(viewer.includes("STEP_NINE_CAMERA_DURATION"));
  assert.ok(lesson.includes("Assembly A · Step 7"));
  assert.ok(lesson.includes("Assembly B · Updated Step 8"));
});

test("Step 9 prevents overlapping navigation animations but keeps pause/replay and reduced motion",()=>{
  assert.ok(lesson.includes("const [animating,setAnimating]=useState(Boolean(ready))"));
  assert.ok(lesson.includes("if(animating)return; // Finish one guided movement"));
  assert.ok(lesson.includes("onMotionComplete={()=>setAnimating(false)}"));
  assert.ok(lesson.includes("previousDisabled={!ready||animating||phase===0}"));
  assert.ok(lesson.includes("nextDisabled={!ready||animating}"));
  assert.ok(lesson.includes("replayDisabled={!ready||animating}"));
  assert.ok(lesson.includes("onTogglePause={()=>setPaused(v=>!v)}"));
  assert.ok(viewer.includes("if(paused)return;"));
  assert.ok(viewer.includes("!reducedMotion;"));
  assert.ok(!viewer.includes("scale.set("));
});

test("Action 1 rotates the ENTIRE rigid Step 8 frame from wrong face to original upward blue-pin face",()=>{
  assert.ok(geometry.includes('title:"Turn Step 8 over to its opposite face"'));
  assert.ok(geometry.includes("STEP_NINE_STEP_EIGHT_FACE_FLIP = Math.PI"));
  assert.ok(!geometry.includes("STEP_NINE_OPPOSITE_FACE_YAW"));
  assert.ok(geometry.includes("stepNineInitialPinOffset(point:V3)"));
  assert.ok(geometry.includes("return [-point[1],point[2],-point[0]]"));
  assert.ok(geometry.includes("stepNineOrientedPinOffset(point:V3)"));
  assert.ok(geometry.includes("return [-point[1],-point[2],point[0]]"));
  assert.ok(viewer.includes("const JOINING_FACE_ALIGNMENT=new Quaternion().setFromRotationMatrix"));
  assert.ok(viewer.includes("const PREPARATION_FACE_ALIGNMENT=new Quaternion()"));
  assert.ok(viewer.includes("new Vector3(1,0,0),STEP_NINE_STEP_EIGHT_FACE_FLIP"));
  assert.ok(viewer.includes(".multiply(JOINING_FACE_ALIGNMENT)"));
  assert.ok(viewer.includes("const fromQuat=old>=1?JOINING_FACE_ALIGNMENT:PREPARATION_FACE_ALIGNMENT"));
  assert.ok(viewer.includes("const toQuat=phase>=1?JOINING_FACE_ALIGNMENT:PREPARATION_FACE_ALIGNMENT"));
  assert.ok(viewer.includes("frame.current.quaternion.copy(m.fromQuat).slerp(m.toQuat,ease(t))"));
  assert.ok(viewer.includes('name="STEP9_STEP8_COMPLETE_ASSEMBLY" ref={frame}'));
  assert.ok(viewer.includes("quaternion={phase>=1?JOINING_FACE_ALIGNMENT:PREPARATION_FACE_ALIGNMENT}"));
  assert.ok(!viewer.includes("rotation={[0,STEP_NINE_STEP_SEVEN_YAW,0]}>"+"\n        {STEP_EIGHT_PARTS"));
  assert.ok(lesson.includes("stepEightTopBottomFaceTurnDegrees:180"));
  assert.ok(lesson.includes('stepEightAttachmentSide:"original-step8-upward-connector-face"'));
});
test("Correct pin axes and the four Step 7 rail positions remain rigidly aligned",()=>{
  const join=([x,y,z])=>[-y,-z,x]; // Step 8 original connector face
  const prepare=([x,y,z])=>[-y,z,-x]; // prior wrong-face orientation
  const rootToWorld=([x,y,z])=>[-x,-y,z];
  assert.deepEqual(rootToWorld(join([0,0,1])),[0,1,0]);
  assert.deepEqual(rootToWorld(prepare([0,0,1])),[0,-1,0]);
  const pins=[[-1,-2,2.195],[1,-2,2.195],[-1,2,2.195],[1,2,2.195]];
  // Step 7 rail 0 uses Step 6 back bridge, rail 1 the front bridge.
  // Their 180-degree yaw gives target shared Z values +.975, -.975.
  const targets=[
    {rail:1,hole:7,x:2,z:-.975},
    {rail:0,hole:7,x:2,z:.975},
    {rail:1,hole:11,x:-2,z:-.975},
    {rail:0,hole:11,x:-2,z:.975},
  ];
  const offsets=pins.map(join);
  offsets.forEach(([x,_,z],index)=>{
    assert.ok(Math.abs(x-targets[index].x)<.3);
    assert.ok(Math.abs(z-targets[index].z)<.3);
  });
  assert.ok(geometry.includes('stepEightPin:"BLUE_1",rail:1,hole:7'));
  assert.ok(geometry.includes('stepEightPin:"BLUE_2",rail:0,hole:7'));
  assert.ok(geometry.includes('stepEightPin:"BLUE_3",rail:1,hole:11'));
  assert.ok(geometry.includes('stepEightPin:"BLUE_4",rail:0,hole:11'));
  assert.ok(geometry.includes("A photo-marked hole overlaps a connector"),
    "Existing rail connector occupancy must not be concealed by this face fix");
});

test("Four BLUE connector meshes always remain opaque: never faded, hidden, removed or scaled",()=>{
  assert.ok(viewer.includes('STEP_EIGHT_PARTS.map(id=>'));
  assert.ok(viewer.includes('<mesh geometry={meshes[model]} castShadow receiveShadow>'));
  assert.ok(viewer.includes('color={color} roughness={0.54} side={DoubleSide}'));
  assert.ok(!viewer.includes("mountingPins=useRef"));
  assert.ok(!viewer.includes("setMountingPinOpacity"));
  assert.ok(!viewer.includes("mat.opacity"));
  assert.ok(!viewer.includes("pin.visible="));
  assert.ok(!viewer.includes("transparent={id.startsWith"));
  assert.ok(!viewer.includes("opacity={id.startsWith"));
  assert.ok(!viewer.includes("depthWrite={!(id.startsWith"));
  assert.ok(!viewer.includes("scale.set("));
  assert.ok(lesson.includes("joiningBlueConnectorMeshesPreserved:true"));
  assert.ok(lesson.includes('joiningBlueConnectorVisibility:"opaque-at-all-stages"'));
  assert.ok(lesson.includes("The viewer NEVER hides or fades these connectors."));
  assert.ok(geometry.includes("The connectors remain physically present, opaque, and unchanged"));
});
test("Action 3 lowers ONLY Step 7 onto four Step 8 blue pins",()=>{
  assert.ok(geometry.includes("STEP_NINE_STEP_SEVEN_ALIGN_LIFT = 3.3"));
  assert.ok(geometry.includes("phase===2?[0,-STEP_NINE_STEP_SEVEN_ALIGN_LIFT,0]:[0,0,0]"));
  assert.ok(viewer.includes("const fromSeven=stepNineStepSevenPose(old)"));
  assert.ok(viewer.includes("const toSeven=stepNineStepSevenPose(phase)"));
  assert.ok(viewer.includes("const movesSeven=fromSeven.some"));
  assert.ok(viewer.includes("if(m.action===2)"));
  assert.ok(viewer.includes("raise the complete Step 7 structure"));
  assert.ok(viewer.includes("m.action===3"));
  assert.ok(viewer.includes("stepEightPosition=m.toEight;"),
    "The lower Step 8 assembly must remain stationary during insertion");
  assert.ok(viewer.includes("stepSeven.current.position.set(...stepSevenPosition)"));
  assert.ok(viewer.includes("frame.current.position.set(...stepEightPosition)"));
  assert.ok(viewer.includes("local[1]+2.6"));
  assert.ok(viewer.includes('cameraView==="bottom"'));
  assert.ok(lesson.includes('"bottom"'));
  assert.ok(lesson.includes('stationaryDuringInsertion:"step8"'));
  assert.ok(lesson.includes('loweredDuringInsertion:"step7"'));
  assert.ok(lesson.includes("The four original blue connectors remain present and opaque throughout."));
});
