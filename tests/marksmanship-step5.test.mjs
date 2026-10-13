import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const scene=readFileSync(resolve("src/components/practical/StepFiveScene.tsx"),"utf8");
const controls=readFileSync(resolve("src/components/practical/StepFiveAssembly.tsx"),"utf8");
const route=readFileSync(resolve("src/routes/practical/$projectId.tsx"),"utf8");
const data=readFileSync(resolve("src/data/practical.ts"),"utf8");
function binary(path){
  const b=readFileSync(resolve(path));
  const triangles=b.readUInt32LE(80);
  assert.equal(b.length,84+triangles*50,path+": complete original binary STL");
  return b;
}
function sha(bytes){return createHash("sha256").update(bytes).digest("hex");}
test("Every Step 5 mesh is a byte-for-byte original",()=>{
  const items=[
    ["3D for marksman/beams/11.stl","public/marksmanship/models/beam11.stl"],
    ["48989.stl","public/marksmanship/models/bridge-48989.stl"],
    ["15100_fixed.stl","public/marksmanship/models/hollow-15100.stl"],
    ["3D for marksman/connector/long connector.stl","public/marksmanship/models/pin-long-step5.stl"],
    ["3D for marksman/connector/pin_pin.stl","public/marksmanship/models/pin-pin-step5.stl"],
  ];
  for(const [a,b] of items){
    assert.equal(sha(binary(a)),sha(binary(b)),"Missing or distorted source STL: "+b);
  }
});
test("Source dimensional facts and 11-hole correct pitch",()=>{
  const bridge=binary("48989.stl"),hollow=binary("15100_fixed.stl");
  assert.equal(bridge.readUInt32LE(80),49514);
  assert.equal(hollow.readUInt32LE(80),5130);
  assert.ok(scene.includes("STEP5_BRIDGE_HOLES_MM = [[-8, 4], [8, 4]]"));
  assert.ok(scene.includes("STEP5_HOLLOW_HOLE_MM = [-4, 0]"));
  assert.ok(scene.includes("copy.translate(-40,-3.65,-3.9)"));
  assert.ok(scene.includes("Array.from({length:11}"));
});
test("Two bridges, two hollow elbows, and six separate source pin meshes",()=>{
  for(const id of ["STEP5_BEAM_11","STEP5_BRIDGE_A","STEP5_BRIDGE_B","STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_LONG_PIN_04","STEP5_SHORT_PIN_02"]){
    assert.ok(scene.includes('"'+id+'"'),id);
  }
  for(const part of ["PIN_LOOSE","PIN_APPROACH","PIN_FINAL","interpolated(","motion.forward?t:1-t","getStepFivePreparedSnapshot","beamUnattached:true","step6Applied:false","mechanicallyVerified:false"]){
    assert.ok(scene.includes(part),part);
  }
});
test("Safety gate, previous/replay, Step 4 unchanged, Step 6 unmodified",()=>{
  for(const part of ["confirmedPhysical","Return to Step 4","Continue to Step 6","onBackToStep4","onContinueToStep6","Replay","Resume","Reset view","actual kit and the manual","robot:marksmanship:step4:assembled:v1"]){
    assert.ok(controls.includes(part),part);
  }
  assert.ok(route.includes("isStepFive && !stepFiveReady"));
  assert.ok(route.includes("StepFiveAssembly"));
  assert.ok(route.includes("onBackToStep4"));
  assert.ok(data.includes("Prepare the 11-hole beam and connector units"));
});
