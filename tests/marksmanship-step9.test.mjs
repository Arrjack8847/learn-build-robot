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
  assert.ok(seq.indexOf("Align four mounting connectors beneath Step 7")<seq.indexOf("Lower Step 7 until connectors are concealed"));
  assert.ok(seq.indexOf("Lower Step 7 until connectors are concealed")<seq.indexOf("Inspect the finished"));
  assert.ok(lesson.includes("Action 0 prepares the two finished structures"));
});
test("The four photographed holes are the two open targets on each Step 7 rail",()=>{
  assert.ok(geometry.includes("STEP_NINE_RECEIVERS = [7, 11]"));
  const pairs=[["BLUE_1",0,7],["BLUE_2",1,7],["BLUE_3",0,11],["BLUE_4",1,11]];
  for(const [pin,rail,hole] of pairs){
    assert.ok(geometry.includes(`stepEightPin:"${pin}",rail:${rail},hole:${hole}`));
  }
  // Face-over flip Rx(π), NOT horizontal yaw Ry(π):
  // original (-y,-z,x) becomes (-y,z,-x).
  // Opposite halves of the two-sided connectors now face the upper rails.
  const blue=[[-1,-2,.58],[1,-2,.58],[-1,2,.58],[1,2,.58]];
  assert.deepEqual(blue.map(([x,y,z])=>[-y,z,-x]),
    [[2,.58,1],[2,.58,-1],[-2,.58,1],[-2,.58,-1]]);
  assert.ok(geometry.includes("alreadyOccupiedByStepSeven"));
  assert.ok(geometry.includes("geometryWarnings"));
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
  assert.ok(geometry.includes('-(first.position[0]+second.position[0])/2 - 1'));
  assert.ok(geometry.includes('-(first.position[2]+second.position[2])/2'));
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

test("Action 1 flips ONLY Step 8's top/bottom faces around its long horizontal beam",()=>{
  assert.ok(geometry.includes('title:"Turn Step 8 over to its opposite face"'));
  assert.ok(geometry.includes("STEP_NINE_STEP_EIGHT_FACE_FLIP = Math.PI"));
  assert.ok(!geometry.includes("STEP_NINE_OPPOSITE_FACE_YAW"));
  assert.ok(geometry.includes("stepNineInitialPinOffset(point:V3)"));
  assert.ok(geometry.includes("return [-point[1],-point[2],point[0]]"));
  assert.ok(geometry.includes("stepNineOrientedPinOffset(point:V3)"));
  assert.ok(geometry.includes("return [-point[1],point[2],-point[0]]"));
  assert.ok(viewer.includes("const INITIAL_ALIGNMENT=new Quaternion().setFromRotationMatrix"));
  assert.ok(viewer.includes("const OPPOSITE_FACE_ALIGNMENT=new Quaternion()"));
  assert.ok(viewer.includes("new Vector3(1,0,0),STEP_NINE_STEP_EIGHT_FACE_FLIP"));
  assert.ok(!viewer.includes("new Vector3(0,1,0),STEP_NINE_STEP_EIGHT_FACE_FLIP"));
  assert.ok(viewer.includes(".multiply(INITIAL_ALIGNMENT)"));
  assert.ok(viewer.includes("const fromQuat=old>=1?OPPOSITE_FACE_ALIGNMENT:INITIAL_ALIGNMENT"));
  assert.ok(viewer.includes("const toQuat=phase>=1?OPPOSITE_FACE_ALIGNMENT:INITIAL_ALIGNMENT"));
  assert.ok(viewer.includes("frame.current.quaternion.copy(m.fromQuat).slerp(m.toQuat,ease(t))"));
  assert.ok(viewer.includes('name="STEP9_STEP8_COMPLETE_ASSEMBLY" ref={frame}'));
  assert.ok(viewer.includes("quaternion={phase>=1?OPPOSITE_FACE_ALIGNMENT:INITIAL_ALIGNMENT}"));
  assert.ok(lesson.includes("stepEightTopBottomFaceTurnDegrees:180"));
  assert.ok(lesson.includes('stepEightAttachmentSide:"opposite-top-bottom-face"'));
});
test("Opposite top/bottom face exposes the other pin half but never moves original pin meshes",()=>{
  const pins=[[-1,-2,.58],[1,-2,.58],[-1,2,.58],[1,2,.58]];
  const original=pins.map(([x,y,z])=>[-y,-z,x]);
  const flipped=pins.map(([x,y,z])=>[-y,z,-x]);
  original.forEach((p,i)=>{
    assert.equal(flipped[i][0],p[0], "The long-beam x direction is unchanged");
    assert.equal(flipped[i][1],-p[1], "Top/bottom side must reverse");
    assert.equal(flipped[i][2],-p[2], "Opposite mounting face changes side");
  });
  assert.ok(geometry.includes("STEP_NINE_RECEIVERS = [7, 11]"));
  assert.ok(geometry.includes("- level,"));
  assert.ok(geometry.includes("stepNineOrientedPinOffset([-1,-2,level])"));
  assert.ok(geometry.includes("stepNineOrientedPinOffset([ 1,-2,level])"));
  assert.ok(geometry.includes("stepNineOrientedPinOffset([-1, 2,level])"));
  assert.ok(geometry.includes("stepNineOrientedPinOffset([ 1, 2,level])"));
  assert.ok(viewer.includes("stepEightPoses(11,frameConfig)"));
});

test("Action 3 conceals four joining BLUE pins only after their seating motion",()=>{
  assert.ok(viewer.includes("const mountingPins=useRef<(Mesh|null)[]>([])"));
  assert.ok(viewer.includes("const setMountingPinOpacity=(amount:number)"));
  assert.ok(viewer.includes("mat.opacity=opacity"));
  assert.ok(viewer.includes("setMountingPinOpacity((animate?old:phase)>=3?0:1)"));
  assert.ok(viewer.includes("if(m.action===3)"));
  assert.ok(viewer.includes("1-Math.max(0,Math.min(1,(seatAmount-0.78)/0.22))"));
  assert.ok(viewer.includes('if(id.startsWith("BLUE"))mountingPins.current[Number(id.slice(-1))-1]=node;'));
  assert.ok(viewer.includes("transparent={id.startsWith(\"BLUE\")}"));
  assert.ok(viewer.includes("opacity={id.startsWith(\"BLUE\")&&phase>=3?0:1}"));
  assert.ok(lesson.includes("joiningBlueConnectorDisplayConcealed:true"));
  assert.ok(lesson.includes('joiningBlueConnectorConcealment:"visual-only-until-physical-fit-verified"'));
  assert.ok(lesson.includes("visual concealment"));
  assert.ok(!viewer.includes("scale.set("), "No stretching or deleting physical mesh geometry");
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
  assert.ok(lesson.includes("None of the four joining blue connector shafts remain visibly exposed"));
});
