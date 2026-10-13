import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import test from "node:test";
import ts from "typescript";

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
  assert.ok(ui.includes("physical assembly"));
  assert.ok(ui.includes("confirmed"));
  assert.ok(ui.includes("Select from physical reference"));
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
  assert.ok(ui.includes("physicallySelfConfirmed!==true"));
  assert.ok(ui.includes("beamUnattached!==true"));
  assert.ok(ui.includes("Continue to Step 7"));
  assert.ok(ui.includes("Return to Step 5"));
  assert.ok(ui.includes("Previous"));
  assert.ok(ui.includes("Replay"));
  assert.ok(ui.includes("Pause"));
  assert.ok(ui.includes("Reset camera"));
  assert.ok(ui.includes("prefers-reduced-motion"));
  assert.ok(scene.includes("autoRotate={phase===7&&!paused&&!reducedMotion}"));
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


test("Step 6 desktop gives 3D viewer a dedicated wide workspace",()=>{
  assert.ok(route.includes('isStepSix ? "max-w-[1580px]"'),"Full-width lesson container");
  assert.ok(route.includes('isStepSix ? "mx-auto mt-3 w-full max-w-[1540px]'),"Remove standard two-column lesson grid");
  assert.ok(route.includes('!isStepSix && <section className="min-w-0 md:rounded-[30px]'),"No empty generic instruction sidebar");
  assert.ok(ui.includes("lg:grid-cols-[minmax(0,1.8fr)_minmax(315px,0.95fr)]"),"Large viewer next to configuration");
  assert.ok(ui.includes('h-[clamp(340px,55vh,620px)]'),"Viewer above fold on normal desktop height");
  assert.ok(ui.indexOf('The 3D workspace is ready') < ui.indexOf('Mounting setup · confirm with real parts'),"Immediate status");
  assert.ok(ui.indexOf('className="relative h-[clamp') < ui.indexOf('Mounting setup · confirm with real parts'),"Viewer before form on narrow mobile screens");
  assert.ok(ui.includes("onReadyChange(ready)"),"Physical confirmation gate preserved");
});
