import {test} from "node:test";
import {evaluateLevelOneFinalBuild} from "../scripts/j5/level-one-final-build.mjs";
function levelOneCases(){
 const make=(changes={})=>({startedAt:1000,finishedAt:901000,checks:[true,true,true,false],acknowledgedFinish:true,...changes});
 const eq=(a,b)=>{if(a!==b)throw Error(`Expected ${b}, got ${a}`)};
 const rejects=(v,code)=>{try{evaluateLevelOneFinalBuild(v)}catch(e){eq(e.message,code);return}throw Error("Expected rejection")};
 return [
 ["three out of four passes",()=>eq(evaluateLevelOneFinalBuild(make()).passed,true)],
 ["two checks fail",()=>eq(evaluateLevelOneFinalBuild(make({checks:[true,true,false,false]})).passed,false)],
 ["15 minute exact boundary",()=>eq(evaluateLevelOneFinalBuild(make()).overtimeSeconds,0)],
 ["overtime recorded without automatic failure",()=>{const r=evaluateLevelOneFinalBuild(make({finishedAt:932000}));eq(r.overtimeSeconds,31);eq(r.passed,true)}],
 ["fractional overtime rounded up",()=>eq(evaluateLevelOneFinalBuild(make({finishedAt:901001})).overtimeSeconds,1)],
 ["unacknowledged finish fails",()=>eq(evaluateLevelOneFinalBuild(make({acknowledgedFinish:false})).passed,false)],
 ["five criteria rejected",()=>rejects(make({checks:[true,true,true,true,true]}),"INVALID_CHALLENGE_ASSESSMENT")],
 ["invalid timestamp rejected",()=>rejects(make({finishedAt:0}),"INVALID_CHALLENGE_TIME")],
 ["non-boolean checks rejected",()=>rejects(make({checks:[true,true,true,1]}),"INVALID_CHALLENGE_ASSESSMENT")],
 ["self-report explicitly identified",()=>eq(evaluateLevelOneFinalBuild(make()).selfReported,true)]
 ];
}
for(const [name,run] of levelOneCases())test(name,run);
