import {test} from "node:test";
import {createStudentOverview} from "../scripts/j5/student-overview.mjs";
function overviewCases(){
 const now=2000,env={VERCEL_ENV:"preview"};
 function make(){
  const s={role:"student",studentId:"a",environment:"private-preview"}, base={studentId:"a",environment:"private-preview"};
  const state={s,p:{...base,displayName:"Fictional A",studentCode:"QA-A",accountStatus:"active",parentEmail:"private@example.invalid"},m:{...base,status:"active",validFrom:1000,validUntil:3000,eligible:true},c:{...base,status:"verified",revoked:false,bookingId:"booking-a",validFrom:1000,validUntil:3000},levels:Array.from({length:6},(_,i)=>({...base,level:i+1,allowed:i===0,status:i===0?"in-progress":"locked",checkInRequired:true,completed:i===0?2:0,required:10})),calls:0};
  const svc=createStudentOverview({resolveStudent:async()=>{state.calls++;return state.s},readProfile:async()=>state.p,readMembership:async()=>state.m,readCheckIn:async()=>state.c,readLevels:async()=>state.levels,clock:{now:()=>now}});
  return {state,svc};
 }
 const eq=(a,b)=>{if(a!==b)throw Error(`Expected ${b}, got ${a}`)};
 const load=f=>f.svc.load({},env);
 return [
 ["six levels and private projection",async()=>{const r=await load(make());eq(r.ok,true);eq(r.levels.length,6);eq(r.levels[0].available,true);eq(r.levels[1].reason,"level-locked");eq("parentEmail" in r.profile,false);eq("studentId" in r.levels[0],false)}],
 ["membership pending preserves progress",async()=>{let f=make();f.state.m.status="pending";f.state.m.eligible=false;let r=await load(f);eq(r.profile.membership,"pending");eq(r.levels[0].completed,2);eq(r.levels[0].reason,"membership-required")}],
 ["membership expiry denies learning",async()=>{let f=make();f.state.m.validUntil=now;let r=await load(f);eq(r.profile.membership,"expired");eq(r.levels[0].available,false)}],
 ["missing check-in",async()=>{let f=make();f.state.c=null;let r=await load(f);eq(r.levels[0].reason,"check-in-required")}],
 ["check-in expiry boundary",async()=>{let f=make();f.state.c.validUntil=now;let r=await load(f);eq(r.profile.checkIn,"expired");eq(r.levels[0].available,false)}],
 ["revoked check-in",async()=>{let f=make();f.state.c.revoked=true;eq((await load(f)).levels[0].available,false)}],
 ["no optional check-in exemption for protected course routes",async()=>{let f=make();f.state.c=null;f.state.levels[0].checkInRequired=false;eq((await load(f)).levels[0].available,false)}],
 ["sibling membership rejected",async()=>{let f=make();f.state.m.studentId="b";eq((await load(f)).code,"MEMBERSHIP_UNAVAILABLE")}],
 ["sibling level rejected",async()=>{let f=make();f.state.levels[0].studentId="b";eq((await load(f)).code,"LEVELS_UNAVAILABLE")}],
 ["sibling check-in rejected",async()=>{let f=make();f.state.c.studentId="b";eq((await load(f)).code,"CHECK_IN_UNAVAILABLE")}],
 ["duplicate level rejected",async()=>{let f=make();f.state.levels[1].level=1;eq((await load(f)).code,"LEVELS_UNAVAILABLE")}],
 ["false completion rejected",async()=>{let f=make();f.state.levels[0].status="completed";eq((await load(f)).code,"LEVELS_UNAVAILABLE")}],
 ["locked contradiction rejected",async()=>{let f=make();f.state.levels[1].allowed=true;eq((await load(f)).code,"LEVELS_UNAVAILABLE")}],
 ["unauthenticated rejected",async()=>{let f=make();f.state.s=null;eq((await load(f)).status,401)}],
 ["production rejected",async()=>eq((await make().svc.load({},{VERCEL_ENV:"production"})).status,403)],
 ["payer rejected",async()=>{let f=make();f.state.s.role="payer";eq((await load(f)).status,401)}],
 ["session revoked midread rejected",async()=>{let f=make();let svc=createStudentOverview({resolveStudent:async()=>++f.state.calls===1?f.state.s:null,readProfile:async()=>f.state.p,readMembership:async()=>f.state.m,readCheckIn:async()=>f.state.c,readLevels:async()=>f.state.levels,clock:{now:()=>now}});eq((await svc.load({},env)).status,401)}]
 ];
}
for(const [name,run] of overviewCases())test(name,run);
