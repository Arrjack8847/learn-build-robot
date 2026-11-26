import {test} from "node:test";
import {classifyCoursePath} from "../src/lib/j5-course-path.mjs";
import {resolveCourseResource,createCourseAuthority} from "../scripts/j5/course-authority.mjs";
function courseCases(){
 const eq=(a,b)=>{if(a!==b)throw Error(`Expected ${b}, got ${a}`)};
 const env={VERCEL_ENV:"preview"},now=2000,base={studentId:"qa-a",environment:"private-preview"};
 function fixture(){
  const state={now,session:{...base,role:"student"},snapshot:{...base,profile:{...base,accountStatus:"active"},membership:{...base,status:"active",eligible:true,validFrom:1000,validUntil:3000},checkIn:{...base,status:"verified",revoked:false,bookingId:"booking-a",validFrom:1000,validUntil:2500},levels:Array.from({length:6},(_,i)=>({...base,level:i+1,status:i===0?"in-progress":"locked",allowed:i===0}))},reads:0,sessions:0,after:null,fail:false};
  const auth=createCourseAuthority({resolveStudent:async()=>{if(++state.sessions===2)state.after?.();return state.session;},readSnapshot:async()=>{state.reads++;if(state.fail)throw Error("private data");return state.snapshot;},resolveResource:r=>resolveCourseResource(r,{getProjectLevel:p=>p==="robot-a"?1:p==="robot-b"?2:undefined,hasCategory:(l,c)=>l===1&&c==="robots"}),clock:{now:()=>state.now}});
  return {state,run:(p="/practical/robot-a",e=env)=>auth({},e,p)};
 }
 return [
 ["public selection shells and unrelated routes",()=>{for(const p of ["/practical","/practical/","/practical/levels","/practical/levels/"])eq(classifyCoursePath(p).scope,"shell");for(const p of ["/","/parent/dashboard","/staff/admin","/student/dashboard","/auth/"])eq(classifyCoursePath(p).scope,"outside")}],
 ["all six final builds and levels classified",()=>{for(let i=1;i<=6;i++){eq(classifyCoursePath("/practical/level-"+i+"/final-build").level,i);eq(classifyCoursePath(i===1?"/practical/level-1":"/practical/levels/"+i).level,i)}}],
 ["noncanonical and malformed protected paths rejected",()=>{for(const p of ["/Practical/robot-a","//practical/robot-a","/pract%69cal/robot-a","/practical/%72obot-a","/practical/levels/01","/practical/levels/7","/practical/levels/2/robots/extra","/quiz/robot-a%2f","/practical/level-2/robots","/projects/","/practical//robot-a","/practical/robot-a?mode=learning"])eq(classifyCoursePath(p).scope,"invalid")}],
 ["all project entry points use server catalog level",async()=>{for(const p of ["/practical/robot-a","/projects/robot-a","/quiz/robot-a","/practical/level-1","/practical/level-1/robots","/practical/level-1/final-build"])eq((await fixture().run(p)).ok,true)}],
 ["unknown project/category and bad path fail",async()=>{for(const p of ["/quiz/missing","/practical/level-1/unknown","/practical/levels/99"])eq((await fixture().run(p)).status,404)}],
 ["locked level cannot be bypassed via project or quiz",async()=>{for(const p of ["/practical/robot-b","/projects/robot-b","/quiz/robot-b","/practical/levels/2","/practical/level-2/final-build"])eq((await fixture().run(p)).code,"LEVEL_LOCKED")}],
 ["anonymous payer staff rejected before storage",async()=>{for(const s of [null,{...base,role:"payer"},{...base,role:"staff"}]){const f=fixture();f.state.session=s;eq((await f.run()).status,401);eq(f.state.reads,0)}}],
 ["all non-active states denied",async()=>{for(const status of ["inactive","pending","failed","expired","renewal-required","verification-required"]){const f=fixture();f.state.snapshot.membership={...base,status,eligible:false};eq((await f.run()).code,"MEMBERSHIP_REQUIRED")}}],
 ["membership expiry boundary",async()=>{const f=fixture();f.state.snapshot.membership.validUntil=now;eq((await f.run()).code,"MEMBERSHIP_REQUIRED")}],
 ["missing revoked expired or foreign check-in denied",async()=>{for(const patch of [null,{revoked:true},{validUntil:now},{studentId:"qa-b"},{validFrom:now+1}]){const f=fixture();f.state.snapshot.checkIn=patch?{...f.state.snapshot.checkIn,...patch}:null;eq((await f.run()).code,"CHECK_IN_REQUIRED")}}],
 ["foreign profile or snapshot rejected",async()=>{for(const k of ["snapshot","profile"]){const f=fixture();if(k==="snapshot")f.state.snapshot.studentId="qa-b";else f.state.snapshot.profile.studentId="qa-b";eq((await f.run()).status,403)}}],
 ["foreign membership and invalid level projection refused",async()=>{let f=fixture();f.state.snapshot.membership.studentId="qa-b";eq((await f.run()).status,503);f=fixture();f.state.snapshot.levels[0].studentId="qa-b";eq((await f.run()).status,503)}],
 ["session switch during read refused",async()=>{const f=fixture();f.state.after=()=>{f.state.session={...base,role:"student",studentId:"qa-b"}};eq((await f.run()).status,401)}],
 ["expiry during session recheck refused",async()=>{const f=fixture();f.state.after=()=>{f.state.now=2500};eq((await f.run()).code,"CHECK_IN_REQUIRED")}],
 ["success contains only decision and earliest expiry",async()=>{const r=await fixture().run();eq(r.validUntil,2500);eq(Object.keys(r).sort().join(","),"code,ok,status,validUntil")}],
 ["provider failure and production fail closed",async()=>{const f=fixture();f.state.fail=true;eq((await f.run()).status,503);eq((await fixture().run("/quiz/robot-a",{VERCEL_ENV:"production"})).status,404)}]
 ];
}
for(const [name,run] of courseCases())test(name,run);
