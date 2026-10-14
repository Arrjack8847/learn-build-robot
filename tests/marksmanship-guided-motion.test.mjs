import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";

const read=(path)=>readFileSync(resolve(path),"utf8");
const source=read("src/components/practical/marksmanLessonMotion.ts");
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});
const m=await import("data:text/javascript;base64,"+Buffer.from(compiled.outputText).toString("base64"));

test("shared animation easing is bounded and symmetric",()=>{
  assert.equal(m.motionEase(-2),0);
  assert.equal(m.motionEase(0),0);
  assert.equal(m.motionEase(1),1);
  assert.equal(m.motionEase(3),1);
  assert.ok(Math.abs(m.motionEase(0.5)-0.5)<1e-10);
  for(const t of [0.1,0.2,0.3,0.4])assert.ok(Math.abs(m.motionEase(t)+m.motionEase(1-t)-1)<1e-10);
});

test("the insertion path aligns first, seats accurately, and rewinds via clearance",()=>{
  const loose={position:[-5,1,4],rotation:[0,0,0]};
  const aligned={position:[0,0,3],rotation:[0,0,0]};
  const seated={position:[0,0,0],rotation:[0,0,0]};
  assert.deepEqual(m.motionGuidedPose(loose,aligned,seated,0),loose);
  assert.deepEqual(m.motionGuidedPose(loose,aligned,seated,0.4),aligned);
  assert.deepEqual(m.motionGuidedPose(loose,aligned,seated,1),seated);
  assert.deepEqual(m.motionGuidedPose(seated,aligned,loose,0),seated);
  assert.deepEqual(m.motionGuidedPose(seated,aligned,loose,0.4),aligned);
  assert.deepEqual(m.motionGuidedPose(seated,aligned,loose,1),loose);
});

test("relevant connection labels are contextual and estimates are not presented as verified",()=>{
  assert.equal(m.showConnectionGuide(0,1,6),false);
  assert.equal(m.showConnectionGuide(3,1,6),true);
  assert.equal(m.showConnectionGuide(7,1,6),false);
  assert.equal(m.connectionLabel(5,false),"Hole 5 · estimated");
  assert.equal(m.connectionLabel(5,true),"Hole 5");
});

test("all existing Steps 1–7 use shared Step 6-style motion conventions",()=>{
  for(const path of [
    "MarksmanMotorAssembly.tsx","StepThreeScene.tsx","StepFourScene.tsx",
    "StepFiveScene.tsx","StepSixScene.tsx","MarksmanFrameScene.tsx",
  ]){
    const scene=read("src/components/practical/"+path);
    assert.ok(scene.includes('from "./marksmanLessonMotion"'),path+" must use the shared animation library");
  }
  for(const path of ["StepThreeScene.tsx","StepFourScene.tsx","StepFiveScene.tsx","StepSixScene.tsx","MarksmanFrameScene.tsx"]){
    const scene=read("src/components/practical/"+path);
    assert.ok(scene.includes("setGuideVisible(false)"),path+" must hide contextual overlays after movement");
    assert.ok(scene.includes("autoRotate={false}"),path+" must never steal learner camera control");
    assert.ok(scene.includes('onStart={() => {'),path+" must interrupt the automatic camera on student drag");
  }
  const frame=read("src/components/practical/MarksmanFrameScene.tsx");
  assert.ok(frame.includes("motionGuidedPose(a, aligned, b, amount, 0.4)"),"Step 7 must align before inserting");
  assert.ok(frame.includes("portrait ?"),"Step 7 camera must be portrait-responsive");
  assert.ok(!frame.includes("#e5a217"),"Do not restore the old yellow insertion guide");
  assert.ok(frame.includes("framePoses(phase, config, exploded)"),"Original Step 7 geometry drives the target poses");
  assert.ok(read("src/components/practical/MarksmanFramePreparation.tsx").includes("actionCount={ACTIONS.length}"));
});
