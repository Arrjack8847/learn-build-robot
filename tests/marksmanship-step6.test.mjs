import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import test from "node:test";
import ts from "typescript";
import { Euler, Vector3 } from "three";

const source=(path)=>readFileSync(resolve(path),"utf8");
const geometrySource=source("src/components/practical/StepSixGeometry.ts");
const scene=source("src/components/practical/StepSixScene.tsx");
const ui=source("src/components/practical/StepSixAssembly.tsx");
const route=source("src/routes/practical/$projectId.tsx");
const stepFive=source("src/components/practical/StepFiveScene.tsx");
const result=ts.transpileModule(geometrySource,{
  compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022},
});
const geometry=await import("data:text/javascript;base64,"+Buffer.from(result.outputText).toString("base64"));

function sourceStl(path) {
  const buf=readFileSync(resolve(path));
  const triangles=buf.readUInt32LE(80);
  assert.equal(84+50*triangles,buf.length,"STL bytes intact: "+path);
  return buf;
}
function sha(bytes){return createHash("sha256").update(bytes).digest("hex");}
test("Step 6 reuses exactly the 11 original Step 5 models without new pins",()=>{
  const pairs=[
    ["3D for marksman/beams/11.stl","public/marksmanship/models/beam11.stl"],
    ["48989.stl","public/marksmanship/models/bridge-48989.stl"],
    ["15100_fixed.stl","public/marksmanship/models/hollow-15100.stl"],
    ["3D for marksman/connector/long connector.stl","public/marksmanship/models/pin-long-step5.stl"],
    ["3D for marksman/connector/pin_pin.stl","public/marksmanship/models/pin-pin-step5.stl"],
  ];
  for(const [a,b] of pairs)
    assert.equal(sha(sourceStl(a)),sha(sourceStl(b)),"Original geometry preserved: "+b);
  assert.ok(scene.includes("STEP5_MODEL_PATHS"));
  assert.ok(scene.includes("prepared.transforms"));
  assert.ok(scene.includes("PINS[id].map(pin)"));
  assert.ok(scene.includes("STEP5_SHORT_PIN_02"));
  assert.ok(scene.includes("STEP5_LONG_PIN_04"));
});
test("Bridge hole mapping is derived from measured 16 mm spacing, never adjacent",()=>{
  assert.equal(geometry.BEAM_HOLE_COUNT,11);
  assert.equal(geometry.HOLE_PITCH_MM,8);
  assert.equal(geometry.BRIDGE_SPACING_MM,16);
  assert.equal(geometry.beamHoleX(1),-5);
  assert.equal(geometry.beamHoleX(11),5);
  assert.throws(()=>geometry.beamHoleX(12));
  const c={hollowASide:"back",hollowBSide:"front",
    bridgeAStart:4,bridgeASide:"front",bridgeBStart:8,bridgeBSide:"back"};
  assert.deepEqual(geometry.validateMountConfig(c),[]);
  const attaches=geometry.getStepSixAttachments(c);
  assert.deepEqual(attaches.map(a=>a.beamHoles),[[1],[2],[4,6],[8,10]]);
  assert.deepEqual(attaches.map(a=>a.id),[
    "STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_BRIDGE_A","STEP5_BRIDGE_B"]);
  for(const entry of attaches.slice(2)){
    assert.equal((entry.beamHoles[1]-entry.beamHoles[0])*8,16);
    assert.equal(entry.mechanicallyVerified,false);
  }
});
test("Never silently guess the unverified physical mounting locations or faces",()=>{
  assert.notEqual(geometry.EMPTY_MOUNT_CONFIG.bridgeAStart,4);
  assert.notEqual(geometry.EMPTY_MOUNT_CONFIG.bridgeBStart,8);
  assert.equal(geometry.configComplete(geometry.EMPTY_MOUNT_CONFIG),false);
  assert.throws(()=>geometry.getStepSixAttachments(geometry.EMPTY_MOUNT_CONFIG));
  const invalid={hollowASide:"front",hollowBSide:"front",
    bridgeAStart:4,bridgeASide:"front",bridgeBStart:6,bridgeBSide:"back"};
  assert.ok(geometry.validateMountConfig(invalid).length>=2);
  assert.ok(ui.includes("face orientation provisional"),"The face assignment must be disclosed as provisional");
  assert.ok(ui.includes("physicallyVerified:false"),"Tutorial completion must not be called physical certification");
  assert.ok(!ui.includes("<select"),"The student cannot be asked to configure technical faces/holes");
});
test("Source child-pin poses preserved under rigid parent while approaching beam",()=>{
  const prior={
    STEP5_BEAM_11:{parent:null,position:[0,4.1,0],rotation:[0,0,0],model:"beam11.stl"},
    STEP5_HOLLOW_A:{parent:null,position:[3.1,-1.5,0],rotation:[0,0,0],model:"hollow-15100.stl"},
    STEP5_HOLLOW_B:{parent:null,position:[5.8,-1.5,0],rotation:[0,0,0],model:"hollow-15100.stl"},
    STEP5_BRIDGE_A:{parent:null,position:[-4.6,-1.5,0],rotation:[0,0,0],model:"bridge-48989.stl"},
    STEP5_BRIDGE_B:{parent:null,position:[-.9,-1.5,0],rotation:[0,0,0],model:"bridge-48989.stl"},
  };
  const c={hollowASide:"back",hollowBSide:"front",
    bridgeAStart:4,bridgeASide:"front",bridgeBStart:8,bridgeBSide:"back"};
  const before=geometry.poseAtPhase("STEP5_BRIDGE_A",0,c,prior,4.1);
  assert.deepEqual(before,geometry.loosePose("STEP5_BRIDGE_A",prior));
  const aligned=geometry.poseAtPhase("STEP5_BRIDGE_A",3,c,prior,4.1);
  const inserted=geometry.poseAtPhase("STEP5_BRIDGE_A",4,c,prior,4.1);
  assert.equal(aligned.position[0],inserted.position[0]);
  assert.equal(aligned.position[1],inserted.position[1]);
  assert.notEqual(aligned.position[2],inserted.position[2]);
  assert.equal(inserted.position[0],-1);
  assert.equal(geometry.poseAtPhase("STEP5_BRIDGE_B",5,c,prior,4.1).position[0],3);
  assert.equal(geometry.poseAtPhase("STEP5_HOLLOW_A",0,c,prior,4.1).position[0],3.1);
  assert.equal(geometry.poseAtPhase("STEP5_HOLLOW_A",1,c,prior,4.1).position[0],-5);
  assert.ok(scene.includes("PINS[id]"));
  assert.ok(scene.includes("position={saved.position} rotation={saved.rotation}"));
});
test("Step 6 requires Step 5 saved state and never edits Steps 1–5 or Step 7",()=>{
  assert.ok(ui.includes("STEP5_SNAPSHOT_KEY"));
  assert.ok(ui.includes("snap.tutorialCompleted!==true && snap.physicallySelfConfirmed!==true"));
  assert.ok(ui.includes("beamUnattached!==true"));
  assert.ok(ui.includes("onContinueToStep7"));
  assert.ok(ui.includes("Return to Step 5"));
  assert.ok(ui.includes("AssemblyPlaybackControls"));
  assert.ok(ui.includes("AssemblyUtilityControls"));
  assert.ok(!ui.includes(">Continue to Step 7"),"Single shared lesson footer advances to the next step");
  const shared=source("src/components/practical/AssemblyLessonUI.tsx");
  for(const label of ["Previous","Replay","Pause","Reset view"]){assert.ok(shared.includes(label),label);}
  assert.ok(ui.includes("prefers-reduced-motion"));
  assert.ok(scene.includes("autoRotate={false}"),"Final assembly should stop and await the learner");
  assert.ok(scene.includes("guidePoseReverse"));
  assert.ok(route.includes("StepSixAssembly"));
  assert.ok(route.includes("isStepSix && !stepSixReady"));
  assert.ok(scene.includes("STEP5_MODEL_PATHS"));
  assert.ok(stepFive.includes("getStepFivePreparedSnapshot"));
});
test("Final assembly uses stable Step 5 IDs, declares uncertainty and Step 8 handoff",()=>{
  const c={hollowASide:"back",hollowBSide:"front",
    bridgeAStart:4,bridgeASide:"front",bridgeBStart:8,bridgeBSide:"back"};
  const snapshot=geometry.getStepSixSnapshot(c,"marksman-step5-prepared-connectors");
  assert.equal(snapshot.assemblyId,"marksman-step6-main-connector-beam");
  assert.equal(snapshot.mechanicallyVerified,false);
  assert.equal(snapshot.readyForStep8,true);
  assert.equal(snapshot.originalPinCount,6);
  assert.equal(snapshot.attachments.length,4);
  assert.equal(snapshot.stepFiveAssemblyId,"marksman-step5-prepared-connectors");
});


test("Step 6 uses a single full-screen 3D stage with a compact floating dock",()=>{
  const shared=source("src/components/practical/AssemblyLessonUI.tsx");
  const css=source("src/styles.css");
  assert.ok(route.includes('isInteractiveMarksman ? "mx-auto mt-2 w-full max-w-[1540px]"'));
  assert.ok(route.includes('!isInteractiveMarksman && <section'));
  assert.ok(route.includes('!isInteractiveMarksman && <footer'));
  assert.ok(ui.includes("AssemblyStage"),"Single wide stage must replace sidebar layout");
  assert.ok(ui.includes("AssemblyPlaybackControls"),"Floating dock is always available");
  assert.ok(css.includes(".assembly-lesson-dock"),"Responsive floating dock layout is defined");
  assert.ok(!ui.includes("Mounting setup · confirm with real parts"));
  assert.ok(!ui.includes('type="checkbox"'));
  assert.ok(ui.includes("onReadyChange(ready)"),"Tutorial readiness still gates completion");
});


test("Every new lesson resets inherited 3D workspace scroll position",()=>{
  assert.ok(route.includes("currentIndex !== previousStepIndex.current"));
  assert.ok(route.includes("lessonScrollArea.current.scrollTop = 0"));
  assert.ok(route.includes("<main ref={lessonScrollArea}"));
});


test("User-confirmed Step 6 bridge holes 3/5 and 7/9 retain unverified black-face alignment",()=>{
  const photo=geometry.STEP_SIX_PHOTO_SUGGESTION;
  assert.deepEqual(geometry.getStepSixAttachments(photo).map(x=>x.beamHoles),
    [[1],[2],[3,5],[7,9]]);
  assert.equal(photo.bridgeASide,"front");
  assert.equal(photo.bridgeBSide,"back");
  assert.equal(photo.hollowASide,"back");
  assert.equal(photo.hollowBSide,"front");
  assert.ok(geometry.STEP_SIX_PHOTO_SUGGESTION_STATUS.includes("requires physical confirmation"));
  assert.equal(geometry.configComplete(geometry.EMPTY_MOUNT_CONFIG),false);
  assert.ok(ui.includes("STEP_SIX_PHOTO_SUGGESTION"));
  assert.ok(ui.includes("Confirmed hole pairs"));
  assert.ok(ui.includes("face orientation provisional"));
});
test("Both 15100 black pin axes remain world-upright while pegs face inward",()=>{
  const config=geometry.STEP_SIX_PHOTO_SUGGESTION;
  for(const id of ["STEP5_HOLLOW_A","STEP5_HOLLOW_B"]){
    const pose=geometry.seatedPose(id,config,4.1);
    const r=new Euler(...pose.rotation,"XYZ");
    const blackPinDirection=new Vector3(0,0,1).applyEuler(r);
    assert.ok(blackPinDirection.distanceTo(new Vector3(0,1,0))<1e-6,id+" black pin must point up");
    const pegDirection=new Vector3(1,0,0).applyEuler(r);
    const side=id==="STEP5_HOLLOW_A"?config.hollowASide:config.hollowBSide;
    const inward=side==="front"?-1:1;
    assert.ok(pegDirection.distanceTo(new Vector3(0,0,inward))<1e-6,id+" peg must enter beam");
  }
});
test("Far bridge mirrors full prepared assembly including both pins",()=>{
  const config=geometry.STEP_SIX_PHOTO_SUGGESTION;
  const near=geometry.seatedPose("STEP5_BRIDGE_A",config,4.1);
  const far=geometry.seatedPose("STEP5_BRIDGE_B",config,4.1);
  assert.deepEqual(near.rotation,[0,0,0]);
  assert.deepEqual(far.rotation,[0,Math.PI,0]);
  assert.deepEqual(geometry.getStepSixAttachments(config).slice(2).map(x=>x.side),
    ["front","back"]);
  assert.ok(scene.includes("previousConfig"));
  assert.ok(scene.includes("Math.abs(phase-previous.current.phase)>1"));
});

test("Confirmed Step 6 mounts rigidly align Step 7 at black 5 / grey 6,8 and black 4 / grey 10,12",async()=>{
  const railSource=source("src/components/practical/stepSevenRailGeometry.ts");
  const railTranspiled=ts.transpileModule(railSource,{
    compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022},
  }).outputText;
  const stepSixUrl="data:text/javascript;base64,"+Buffer.from(result.outputText).toString("base64");
  const railJs=railTranspiled.replace('"./StepSixGeometry"',JSON.stringify(stepSixUrl));
  assert.notEqual(railJs,railTranspiled,"Geometry module import must resolve to current Step 6");
  const rails=await import("data:text/javascript;base64,"+Buffer.from(railJs).toString("base64"));
  const setup=geometry.STEP_SIX_PHOTO_SUGGESTION;
  const chosen=rails.STEP_SEVEN_PHOTO_CONFIG;
  const first=rails.railMounts(rails.STEP_SEVEN_RAIL_IDS[0],setup,chosen);
  const second=rails.railMounts(rails.STEP_SEVEN_RAIL_IDS[1],setup,chosen);
  assert.deepEqual([first.side,first.sourceBlackHole,first.sourceGreyHoles],["front",2,[3,5]]);
  assert.deepEqual([second.side,second.sourceBlackHole,second.sourceGreyHoles],["back",1,[7,9]]);
  assert.deepEqual([first.receivingBlackHole,...first.receivingGreyHoles],[5,6,8]);
  assert.deepEqual([second.receivingBlackHole,...second.receivingGreyHoles],[4,10,12]);
  assert.equal(first.offsetX,second.offsetX,"One rigid translation aligns both rail connectors");
  assert.deepEqual(rails.railConfigurationErrors(chosen,setup),[]);
  assert.equal(geometry.STEP_SIX_RESULT,"robot:marksmanship:step6:assembled:v2");
  assert.equal(rails.STEP_SEVEN_RESULT_KEY,"robot:marksmanship:step7:assembly-a:v2");
});
