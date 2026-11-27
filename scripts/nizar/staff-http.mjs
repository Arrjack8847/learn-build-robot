// Separate private operator fixture, not a production staff identity system.
import {timingSafeEqual} from "node:crypto";
import {fixtureEnabled,fixtures} from "./fixture-http.mjs";
import {createSchedulingRepository} from "./repository.mjs";
import {createStaffSchedulingService} from "./staff-service.mjs";
import {createN4Service} from "./automation-service.mjs";
const path="/api/dev/nizar/staff";
const staffId="nizar-fictional-staff-v1";
const exact=(x,ks)=>x&&typeof x==="object"&&!Array.isArray(x)&&Object.keys(x).length===ks.length&&ks.every(k=>Object.hasOwn(x,k));
export function staffFixtureEnabled(e){
 const key=e?.NIZAR_STAFF_FIXTURE_KEY;
 return fixtureEnabled(e)&&e.NIZAR_STAFF_FIXTURE_ENABLED==="1"&&typeof key==="string"&&/^[a-f0-9]{64}$/.test(key)&&new Set(key).size>=8&&![e.NIZAR_FIXTURE_OPERATOR_KEY,e.J12345_AUTH_ROOT,e.J12345_TEST_OPERATOR_SECRET,e.J1234_AUTH_ROOT,e.J1234_TEST_OPERATOR_SECRET,e.PARENT_AUTH_SECRET,e.STUDENT_AUTH_SECRET].includes(key);
}
const response=(status,data)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"private, no-store","Vary":"X-STEM-Nizar-Staff","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex, nofollow"}});
const fail=(s,status)=>response(s,{ok:false,status});
async function body(r){
 const reader=r.body.getReader(),decoder=new TextDecoder("utf-8",{fatal:true});let size=0,raw="";
 try{for(;;){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>2048){await reader.cancel();throw Error("TOO_LARGE");}raw+=decoder.decode(part.value,{stream:true});}return JSON.parse(raw+decoder.decode());}finally{reader.releaseLock();}
}
export function createStaffFixtureHttp({repositoryFactory=env=>createSchedulingRepository({env}),clock=Date.now}={}){
 return async(request,env)=>{
  const u=new URL(request.url),origin="https://"+env.VERCEL_URL;
  if(!staffFixtureEnabled(env)||!env.VERCEL_URL||u.origin!==origin||u.pathname!==path||u.search)return fail(404,"NOT_AVAILABLE");
  if(request.method!=="POST")return fail(405,"METHOD_NOT_ALLOWED");
  if(request.headers.get("origin")!==origin||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-nizar")!=="1"||request.headers.get("content-type")?.split(";")[0]!=="application/json"||!request.body)return fail(403,"INVALID_REQUEST");
  if((request.headers.get("cookie")??"").split(";").some(v=>/^__Host-bsr-(?:parent-test|student|student-proof)=.+/.test(v.trim())))return fail(403,"MIXED_SESSION");
  const key=request.headers.get("x-stem-nizar-staff")??"";
  if(!/^[a-f0-9]{64}$/.test(key)||!timingSafeEqual(Buffer.from(key,"hex"),Buffer.from(env.NIZAR_STAFF_FIXTURE_KEY,"hex")))return fail(403,"NOT_AUTHORIZED");
  let input;try{input=await body(request);}catch{return fail(400,"INVALID_INPUT");}
  if(exact(input,["action"])&&input.action==="students")return response(200,{ok:true,students:fixtures.flatMap(p=>p.children.map(c=>({id:c.id,name:c.name})))});
  if(!input||typeof input!=="object"||Array.isArray(input))return fail(400,"INVALID_INPUT");
  try{
   const repository=repositoryFactory(env);
   const readOwner=async(childId,parentId)=>{for(const p of fixtures){if(parentId!==null&&parentId!==p.parentId)continue;const c=p.children.find(c=>c.id===childId);if(c)return {childId:c.id,parentId:p.parentId,name:c.name,stateVersion:"fictional-v1"};}return null;};
   const readEligibility=async o=>({membership:fixtures.find(p=>p.parentId===o.parentId)?.children.find(c=>c.id===o.childId)?.paid?"active":"inactive",deposit:"clear"});
   const actor=Symbol("authorized fictional staff");
   const service=createStaffSchedulingService({repository,clock,readOwner,readEligibility,resolveStaff:async a=>a===actor?{staffId,version:"fixture-v1",permissions:["schedule:read","schedule:walk-in","schedule:attendance"]}:null});
   let result;
   if(input.action==="day"&&exact(input,["action","day"]))result=await service.dayView(actor,input.day);
   else if(input.action==="excuse"&&exact(input,["action","bookingId","revision","childId","reason","requestId"])){
    const snap=await repository.read(),b=snap.state.bookings.find(b=>b.bookingId===input.bookingId&&b.childId===input.childId);
    if(!b)return fail(409,"BOOKING_CHANGED");
    const o=await readOwner(b.childId,b.parentId);if(!o)return fail(403,"NOT_AUTHORIZED");
    if(typeof input.requestId!=="string"||! /^(?:[a-zA-Z0-9_-]{16,128})$/.test(input.requestId)||typeof input.revision!=="string"||! /^(?:[a-zA-Z0-9_-]{16,128})$/.test(input.revision))return fail(400,"INVALID_INPUT");
    const event={eventId:input.requestId,kind:"excuse",childId:b.childId,parentId:b.parentId,bookingId:b.bookingId,revision:input.revision,staffId,reason:input.reason,at:clock()};
    const n4=createN4Service({repository,readOwner,readEligibility,clock,resolveChild:async()=>null,readAttendance:async()=>null,verifyEvent:async e=>e===event?event:null});
    result=await n4.event(event);
   }else if(["walk-in","manual-attendance","checkout"].includes(input.action))result=await service.mutate(input,actor);
   else return fail(400,"INVALID_INPUT");
   return response(result.ok?200:result.status==="NOT_AUTHORIZED"?403:result.status==="INVALID_INPUT"||result.status==="INVALID_DAY"?400:["SCHEDULING_UNAVAILABLE","COMMIT_UNCONFIRMED"].includes(result.status)?503:409,result);
  }catch{return fail(503,"SCHEDULING_UNAVAILABLE");}
 };
}
export const handleStaffFixture=createStaffFixtureHttp();
