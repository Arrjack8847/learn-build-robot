import {test} from "node:test";
import {createStudentAccess} from "../scripts/j5/student-access.mjs";
function fixtureCases(){
  const now=2000, env={VERCEL_ENV:"preview"};
  function make(){
    const state={student:{role:"student",studentId:"a",environment:"private-preview"}, profile:{studentId:"a",environment:"private-preview",accountStatus:"active",displayName:"Fictional A",studentCode:"QA-A",parentEmail:"never-return@example.invalid"}, membership:{studentId:"a",environment:"private-preview",status:"active",eligible:true,validFrom:1000,validUntil:3000},checkIn:{studentId:"a",environment:"private-preview",bookingId:"booking-a",status:"verified",validFrom:1000,validUntil:3000,revoked:false},level:{studentId:"a",environment:"private-preview",level:1,allowed:true},activity:{activityId:"activity-1",level:1,checkInRequired:true},calls:0};
    const access=createStudentAccess({resolveStudent:async()=>{state.calls++;return state.student},readProfile:async()=>state.profile,readMembership:async()=>state.membership,readCheckIn:async()=>state.checkIn,resolveActivity:async()=>state.activity,readLevelAccess:async()=>state.level,clock:{now:()=>now}});
    return {state,access};
  }
  const auth=(f,e=env,id="activity-1")=>f.access.authorize({},e,id);
  function eq(actual,expected){if(actual!==expected)throw Error(`Expected ${expected}, got ${actual}`)}
  return [
    ["eligible student",async()=>{eq((await auth(make())).ok,true)}],
    ["production denied",async()=>{eq((await auth(make(),{VERCEL_ENV:"production"})).code,"PRIVATE_PREVIEW_ONLY")}],
    ["production target denied",async()=>{eq((await auth(make(),{VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"production"})).code,"PRIVATE_PREVIEW_ONLY")}],
    ["anonymous denied",async()=>{let f=make();f.state.student=null;eq((await auth(f)).status,401)}],
    ["payer denied",async()=>{let f=make();f.state.student.role="payer";eq((await auth(f)).status,401)}],
    ["staff denied",async()=>{let f=make();f.state.student.role="staff";eq((await auth(f)).status,401)}],
    ["sibling profile denied",async()=>{let f=make();f.state.profile.studentId="b";eq((await auth(f)).code,"STUDENT_UNAVAILABLE")}],
    ["sibling membership denied",async()=>{let f=make();f.state.membership.studentId="b";eq((await auth(f)).code,"MEMBERSHIP_REQUIRED")}],
    ["pending payment denied",async()=>{let f=make();f.state.membership.status="pending";eq((await auth(f)).code,"MEMBERSHIP_REQUIRED")}],
    ["expiry boundary denied",async()=>{let f=make();f.state.membership.validUntil=now;eq((await auth(f)).code,"MEMBERSHIP_REQUIRED")}],
    ["inactive profile denied",async()=>{let f=make();f.state.profile.accountStatus="disabled";eq((await auth(f)).status,403)}],
    ["missing check-in denied",async()=>{let f=make();f.state.checkIn=null;eq((await auth(f)).code,"CHECK_IN_REQUIRED")}],
    ["sibling check-in denied",async()=>{let f=make();f.state.checkIn.studentId="b";eq((await auth(f)).code,"CHECK_IN_REQUIRED")}],
    ["expired check-in denied",async()=>{let f=make();f.state.checkIn.validUntil=now;eq((await auth(f)).code,"CHECK_IN_REQUIRED")}],
    ["revoked check-in denied",async()=>{let f=make();f.state.checkIn.revoked=true;eq((await auth(f)).code,"CHECK_IN_REQUIRED")}],
    ["locked level denied",async()=>{let f=make();f.state.level.allowed=false;eq((await auth(f)).code,"LEVEL_LOCKED")}],
    ["sibling level denied",async()=>{let f=make();f.state.level.studentId="b";eq((await auth(f)).code,"LEVEL_LOCKED")}],
    ["unknown activity denied",async()=>{eq((await auth(make(),env,"other")).status,404)}],
    ["profile projection preserves expired account access",async()=>{let f=make();f.state.membership.validUntil=now;let r=await f.access.loadProfile({},env);eq(r.ok,true);eq(r.profile.membershipStatus,"expired");eq("parentEmail" in r.profile,false);eq("studentId" in r.profile,false)}],
    ["revoked session after async reads denied",async()=>{let f=make();const access=createStudentAccess({resolveStudent:async()=>++f.state.calls===1?f.state.student:null,readProfile:async()=>f.state.profile,readMembership:async()=>f.state.membership,readCheckIn:async()=>f.state.checkIn,resolveActivity:async()=>f.state.activity,readLevelAccess:async()=>f.state.level,clock:{now:()=>now}});eq((await access.authorize({},env,"activity-1")).status,401)}],
    ["adapter failure fails closed",async()=>{let access=createStudentAccess({resolveStudent:async()=>{throw Error("database offline")}});eq((await access.authorize({},env,"activity-1")).status,503)}]
  ];
}
for(const [name,run] of fixtureCases())test(name,run);
