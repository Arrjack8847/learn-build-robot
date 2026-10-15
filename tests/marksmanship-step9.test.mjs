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
  assert.ok(seq.indexOf("Prepare the two completed")<seq.indexOf("Align all four blue"));
  assert.ok(seq.indexOf("Align all four blue")<seq.indexOf("Insert all four"));
  assert.ok(seq.indexOf("Insert all four")<seq.indexOf("Inspect the completed"));
  assert.ok(lesson.includes("Action 0 starts"));
});
test("The four photographed holes are the two open targets on each Step 7 rail",()=>{
  assert.ok(geometry.includes("STEP_NINE_RECEIVERS = [7, 11]"));
  const pairs=[["BLUE_1",1,7],["BLUE_2",0,7],["BLUE_3",1,11],["BLUE_4",0,11]];
  for(const [pin,rail,hole] of pairs){
    assert.ok(geometry.includes(`stepEightPin:"${pin}",rail:${rail},hole:${hole}`));
  }
  // The original Step 8 5-hole bars have centres at x +/-1, y +/-2.
  // Under (x,y,z) -> (-y,-z,x), the pins face upward at
  // receiving x = +2/-2 along the original Step 7 rail direction.
  const blue=[[-1,-2],[1,-2],[-1,2],[1,2]];
  assert.deepEqual(blue.map(([x,y])=>[-y,x]),[[2,-1],[2,1],[-2,-1],[-2,1]]);
  assert.ok(geometry.includes("alreadyOccupiedByStepSeven"));
  assert.ok(geometry.includes("geometryWarnings"));
});
test("Only the rigid Step 8 root moves; original pins and existing Step 7 joint poses are preserved",()=>{
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
  assert.ok(viewer.includes('name="STEP9_STEP7_COMPLETE_ASSEMBLY" rotation={[0,STEP_NINE_STEP_SEVEN_YAW,0]}'));
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
