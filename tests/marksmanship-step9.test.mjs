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
  assert.ok(seq.indexOf("Prepare the two completed")<seq.indexOf("Flip Step 8 upside down"));
  assert.ok(seq.indexOf("Flip Step 8 upside down")<seq.indexOf("Align four pins below Step 7"));
  assert.ok(seq.indexOf("Align four pins below Step 7")<seq.indexOf("Lower Step 7 onto all four pins"));
  assert.ok(seq.indexOf("Lower Step 7 onto all four pins")<seq.indexOf("Inspect the completed"));
  assert.ok(lesson.includes("Action 0 starts"));
});
test("The four photographed holes are the two open targets on each Step 7 rail",()=>{
  assert.ok(geometry.includes("STEP_NINE_RECEIVERS = [7, 11]"));
  const pairs=[["BLUE_1",1,7],["BLUE_2",0,7],["BLUE_3",1,11],["BLUE_4",0,11]];
  for(const [pin,rail,hole] of pairs){
    assert.ok(geometry.includes(`stepEightPin:"${pin}",rail:${rail},hole:${hole}`));
  }
  // The original Step 8 5-hole bars have centres at x +/-1, y +/-2.
  // The outer shared root flips Y. Pins face UP when local +Z maps
  // to shared -Y: original (x,y,z) becomes (-y,-z,x).
  const blue=[[-1,-2,.58],[1,-2,.58],[-1,2,.58],[1,2,.58]];
  assert.deepEqual(blue.map(([x,y,z])=>[-y,-z,x]),
    [[2,-.58,-1],[2,-.58,1],[-2,-.58,-1],[-2,-.58,1]]);
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

test("Action 1 flips the complete Step 8 assembly without moving individual pieces",()=>{
  assert.ok(geometry.includes("STEP_NINE_STEP_EIGHT_FLIP = Math.PI"));
  assert.ok(geometry.includes("return [-point[1],-point[2],point[0]]"));
  assert.ok(viewer.includes("const ALIGNMENT=new Quaternion().setFromRotationMatrix"));
  assert.ok(viewer.includes("const UPRIGHT_ALIGNMENT=new Quaternion()"));
  assert.ok(viewer.includes("new Vector3(1,0,0),STEP_NINE_STEP_EIGHT_FLIP"));
  assert.ok(viewer.includes(".multiply(ALIGNMENT)"));
  assert.ok(viewer.includes("const fromQuat=from.orient?ALIGNMENT:LOOSE;"));
  assert.ok(viewer.includes("const toQuat=to.orient?ALIGNMENT:LOOSE;"));
  assert.ok(viewer.includes("frame.current.quaternion.copy(m.fromQuat).slerp(m.toQuat,ease(t))"));
  assert.ok(viewer.includes('name="STEP9_STEP8_COMPLETE_ASSEMBLY" ref={frame}'));
  assert.ok(viewer.includes('name="STEP9_STEP7_COMPLETE_ASSEMBLY"'));
  assert.ok(lesson.includes("stepEightFlippedUpsideDown:true"));
});

test("Four Step 8 blue pins face UP from the stationary lower frame",()=>{
  assert.ok(geometry.includes("if(phase===1)return {position:[x-10,y+1.8,z],orient:true}"));
  assert.ok(geometry.includes("return {position:[x,y,z],orient:true}"));
  assert.ok(geometry.includes("+ STEP_NINE_ESTIMATED_PIN_CENTRE_CLEARANCE + level"));
  assert.ok(geometry.includes("stepNineFlippedPinOffset([-1,-2,level])"));
  assert.ok(geometry.includes("stepNineFlippedPinOffset([ 1,-2,level])"));
  assert.ok(geometry.includes("stepNineFlippedPinOffset([-1, 2,level])"));
  assert.ok(geometry.includes("stepNineFlippedPinOffset([ 1, 2,level])"));
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
  assert.ok(lesson.includes("Step 8 stays underneath and its four blue pins point upward"));
});
