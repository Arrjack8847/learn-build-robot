import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import ts from "typescript";
const source = path => readFileSync(resolve(path),"utf8");
const code=source("src/components/practical/stepSevenGeometry.ts");
const moduleSource=ts.transpileModule(code,{
  compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022},
}).outputText;
const g=await import("data:text/javascript;base64,"+Buffer.from(moduleSource).toString("base64"));
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,a+" vs "+b);

test("Step 7 starts with exactly eleven unique genuine component IDs",()=>{
  assert.equal(g.STEP_SEVEN_PARTS.length,11);
  assert.equal(new Set(g.STEP_SEVEN_PARTS).size,11);
  assert.equal(g.STEP_SEVEN_SEQUENCE.length,12);
  assert.deepEqual([...new Set(g.STEP_SEVEN_SEQUENCE.map(x=>x.number))],
    ["7.1","7.2","7.3","7.4","7.5","7.6","7.7"]);
  const scene=source("src/components/practical/StepSevenScene.tsx");
  for(const model of ["beams/5.stl?url","beams/7.stl?url",
    "beams/15 beams.stl?url","connector/long connector.stl?url",
    "connector/pin_pin.stl?url"])
    assert.ok(scene.includes(model),"missing original "+model);
  assert.ok(!scene.includes("boxGeometry"));
});
test("Four blue connector axes occupy 5-hole positions 2/4 and genuine 7-hole receiving centers",()=>{
  for(const receiving of [1,2,3]){
    const cfg={...g.STEP_SEVEN_DEMO_CONFIG,sevenNearHole:receiving};
    const mount=g.stepSevenMating(cfg);
    assert.deepEqual(mount.blue.map(x=>x.hole5),[2,4,2,4]);
    for(const entry of mount.blue){
      const a=g.fiveHoleAnchor(entry.beam,entry.hole5);
      const b=g.sevenHoleAnchor(entry.rail,entry.hole7,cfg);
      close(a[0],b[0]);close(a[1],b[1]);
      close(a[2]-b[2],g.STEP_SEVEN_LEVEL);
    }
    const completed=g.stepSevenPoses(6,cfg);
    close(completed.SEVEN_A.position[0],-1);
    close(completed.SEVEN_B.position[0],1);
    close(completed.FIVE_A.position[1],-2);
    close(completed.FIVE_B.position[1],2);
  }
});
test("Central 15-hole locking candidate meets real hole centers, not invented geometry",()=>{
  for(let first=1;first<=11;first++){
    const cfg={...g.STEP_SEVEN_DEMO_CONFIG,fifteenNearHole:first};
    const pair=g.stepSevenMating(cfg).black;
    for(const [i,entry] of pair.entries()){
      assert.equal(entry.beam15Hole,first+i*4);
      assert.equal(entry.receiverHole,3);
      const beam=g.fifteenHoleAnchor(entry.beam15Hole,cfg);
      const receiver=g.fiveHoleAnchor(entry.beam5,3);
      close(beam[0],receiver[0]);close(beam[1],receiver[1]);
    }
    for(const phase of [7,8,9,10,11]){
      const positions=g.stepSevenPoses(phase,cfg);
      const beam=positions.FIFTEEN.position;
      if(phase>=7){
        close(positions.BLACK_1.position[0],beam[0]);
        close(positions.BLACK_1.position[1]-beam[1],first-8);
        close(positions.BLACK_1.position[2]-beam[2],g.STEP_SEVEN_LEVEL/2);
      }
      if(phase>=8){
        close(positions.BLACK_2.position[0],beam[0]);
        close(positions.BLACK_2.position[1]-beam[1],first-4);
        close(positions.BLACK_2.position[2]-beam[2],g.STEP_SEVEN_LEVEL/2);
      }
    }
  }
});
test("All phases produce stable reversible poses; final long beam and locks stay together",()=>{
  const cfg=g.STEP_SEVEN_DEMO_CONFIG;
  for(let phase=0;phase<g.STEP_SEVEN_SEQUENCE.length;phase++){
    const a=g.stepSevenPoses(phase,cfg);
    const b=g.stepSevenPoses(phase,cfg);
    assert.deepEqual(a,b);
    assert.equal(Object.keys(a).length,11);
    for(const part of g.STEP_SEVEN_PARTS)
      assert.ok(a[part].position.every(Number.isFinite));
  }
  const final=g.stepSevenPoses(11,cfg);
  close(final.FIFTEEN.position[0],0);
  close(final.FIFTEEN.position[2],0);
  close(final.BLACK_1.position[1],-2);
  close(final.BLACK_2.position[1],2);
  const aligned=g.stepSevenPoses(9,cfg);
  close(aligned.FIFTEEN.position[0],0);
  assert.ok(aligned.FIFTEEN.position[2]<final.FIFTEEN.position[2]);
});
test("No unverified connector position is described as mechanically certified",()=>{
  assert.equal(g.STEP_SEVEN_MECHANICALLY_VERIFIED,false);
  assert.equal(g.stepSevenMating(g.STEP_SEVEN_DEMO_CONFIG).mechanicallyVerified,false);
  assert.deepEqual(g.stepSevenConfigurationErrors(g.STEP_SEVEN_DEMO_CONFIG),[]);
  assert.ok(g.stepSevenConfigurationErrors({...g.STEP_SEVEN_DEMO_CONFIG,fifteenNearHole:12}).length);
  const ui=source("src/components/practical/StepSevenAssembly.tsx");
  assert.ok(ui.includes("not yet photo-verified"));
  assert.ok(ui.includes("Mechanical fit not verified"));
  assert.ok(ui.includes("Previous"));
  assert.ok(ui.includes("Next action"));
  assert.ok(ui.includes("Replay current assembly action"));
  assert.ok(ui.includes("Pause animation"));
  assert.ok(ui.includes("Reset camera"));
  assert.ok(ui.includes("prefers-reduced-motion"));
  assert.ok(!ui.includes("physical confirmation checkbox"));
});
test("Only Step 7 mounts the new viewer, keeps 31-step manual and gates completion",()=>{
  const route=source("src/routes/practical/$projectId.tsx");
  assert.ok(route.includes("isStepSeven && ("));
  assert.ok(route.includes("<StepSevenAssembly"));
  assert.ok(route.includes("isStepSeven && !stepSevenReady"));
  assert.ok(route.includes("Original Step 7 manual — preserved for reference"));
  const data=source("src/data/practical.ts");
  assert.equal([...data.matchAll(/id: "marksmanship-s\d+"/g)].length,31);
  assert.ok(data.includes('title: "Prepare two 15-hole beams"'));
  assert.ok(data.includes('title: "Connect the long beams"'));
  for(const old of ["StepThreeAssembly","StepFourAssembly","StepFiveAssembly","StepSixAssembly"])
    assert.ok(route.includes(old));
});
