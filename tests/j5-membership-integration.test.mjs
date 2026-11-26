import test from "node:test";
import assert from "node:assert/strict";
import {createStudentAccess} from "../scripts/j5/student-access.mjs";
import {createStudentOverview} from "../scripts/j5/student-overview.mjs";
import {normalizeJ3Membership} from "../scripts/j5/membership-policy.mjs";
const env={VERCEL_ENV:"preview"};
function fixture(){
 const bound={studentId:"qa-a",environment:"private-preview"};
 const state={now:2000,session:{...bound,role:"student"},membership:{...bound,status:"active",eligible:true,validFrom:1000,validUntil:3000},checkIn:{...bound,status:"verified",bookingId:"qa-booking",validFrom:1000,validUntil:4000,revoked:false},sessionReads:0,afterSession:null,readMember:null};
 const levels=Array.from({length:6},(_,i)=>({...bound,level:i+1,status:i===0?"in-progress":"locked",allowed:i===0,checkInRequired:true,completed:i===0?3:0,required:10}));
 const adapters={resolveStudent:async()=>{state.sessionReads++;if(state.sessionReads===2)state.afterSession?.();return state.session;},readProfile:async()=>({...bound,accountStatus:"active",displayName:"QA Student",studentCode:"QA-A"}),readMembership:async()=>state.readMember?state.readMember():state.membership,readCheckIn:async()=>state.checkIn,readLevels:async()=>levels,readLevelAccess:async(_id,level)=>levels[level-1],resolveActivity:async()=>({activityId:"activity-1",level:1,checkInRequired:true}),clock:{now:()=>state.now}};
 const access=createStudentAccess(adapters),overview=createStudentOverview(adapters);
 return {state,overview:()=>overview.load({},env),profile:()=>access.loadProfile({},env),access:()=>access.authorize({},env,"activity-1")};
}
for(const status of ["inactive","pending","failed","expired","renewal-required","verification-required"]){
 test(`${status}: keep progress, deny protected activity`,async()=>{const f=fixture();f.state.membership={...f.state.membership,status,eligible:false};const r=await f.overview();assert.equal(r.profile.membership,status);assert.equal(r.levels[0].completed,3);assert.equal(r.levels[0].available,false);assert.equal((await f.access()).code,"MEMBERSHIP_REQUIRED");});
}
test("activation restores only previously available levels",async()=>{const f=fixture();f.state.membership=null;assert.equal((await f.overview()).levels[0].available,false);f.state.membership={studentId:"qa-a",environment:"private-preview",status:"active",eligible:true,validFrom:2000,validUntil:3000};const r=await f.overview();assert.equal(r.levels[0].completed,3);assert.equal(r.levels[0].available,true);assert.ok(r.levels.slice(1).every(l=>!l.available));assert.equal((await f.access()).ok,true);});
test("fresh J3 status sampled after asynchronous read",async()=>{const f=fixture();f.state.readMember=()=>{f.state.now=2100;return normalizeJ3Membership({studentId:"qa-a",observation:{studentId:"qa-a",membershipStatus:"active",verifiedLearningEligibility:true,activatedAt:1000,validUntil:3000},now:f.state.now});};assert.equal((await f.access()).ok,true);});
test("membership expiry during final session check denies access",async()=>{const f=fixture();f.state.afterSession=()=>{f.state.now=3000;};assert.equal((await f.access()).code,"MEMBERSHIP_REQUIRED");});
test("membership expiry during final session check reflects in overview",async()=>{const f=fixture();f.state.afterSession=()=>{f.state.now=3000;};const r=await f.overview();assert.equal(r.profile.membership,"expired");assert.equal(r.levels[0].available,false);});
test("sibling and contradictory membership fail closed",async()=>{for(const patch of [{studentId:"qa-b"},{status:"pending",eligible:true}]){const f=fixture();Object.assign(f.state.membership,patch);assert.equal((await f.overview()).status,503);assert.equal((await f.access()).ok,false);}});
test("valid paid membership never overrides check-in",async()=>{const f=fixture();f.state.checkIn=null;assert.equal((await f.overview()).levels[0].reason,"check-in-required");assert.equal((await f.access()).code,"CHECK_IN_REQUIRED");});
test("profile cannot return after session revoked",async()=>{const f=fixture();f.state.afterSession=()=>{f.state.session=null;};assert.equal((await f.profile()).status,401);});
