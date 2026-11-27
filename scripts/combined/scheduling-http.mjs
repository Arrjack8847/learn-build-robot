import {createCombinedRuntime} from "./scheduling-runtime.mjs";
import {createN4Service} from "../nizar/automation-service.mjs";
import {runtimeEnabled,browserRequest,readBody,fail,json,exact,resultResponse,validId} from "./http-utils.mjs";
export function createCombinedSchedulingHttp({runtimeFactory=createCombinedRuntime}={}){
 return async(request,env)=>{
  const path=new URL(request.url).pathname;
  if(!runtimeEnabled(env)||!["/api/dev/combined/booking","/api/dev/combined/staff","/api/dev/combined/check-in"].includes(path))return fail(404,"NOT_AVAILABLE");
  if(!browserRequest(request,env))return fail(403,"INVALID_REQUEST");
  let input;try{input=await readBody(request);}catch{return fail(400,"INVALID_INPUT");}
  if(!input||typeof input!=="object"||Array.isArray(input))return fail(400,"INVALID_INPUT");
  try{
   const r=runtimeFactory(env);
   if(path.endsWith("/booking"))return resultResponse(await (typeof input.action==="string"&&input.action.startsWith("waitlist-")?r.automation.waitlist(input,request):r.booking(input,request)));
   if(path.endsWith("/check-in")){if(!r.checkin||!exact(input,["bookingId","code"]))return fail(404,"NOT_AVAILABLE");return resultResponse(await r.checkin.redeem(request,input));}
   const actor=await r.resolveStaff(request);if(!actor)return fail(403,"NOT_AUTHORIZED");
   if(input.action==="issue-code"&&exact(input,["action","bookingId","revision","childId"]))return r.checkin?resultResponse(await r.checkin.issue(request,input)):fail(404,"NOT_AVAILABLE");
   if(exact(input,["action"])&&input.action==="students"){const students=await r.listStudents(request);return students?json(200,{ok:true,students}):fail(403,"NOT_AUTHORIZED");}
   if(exact(input,["action","day"])&&input.action==="day")return resultResponse(await r.staff.dayView(request,input.day));
   if(input.action==="excuse"&&exact(input,["action","bookingId","revision","childId","reason","requestId"])&&validId(input.requestId)&&validId(input.revision)){
    const snap=await r.repository.read(),b=snap.state.bookings.find(b=>b.bookingId===input.bookingId&&b.childId===input.childId);
    if(!b)return fail(409,"BOOKING_CHANGED");
    const event={kind:"excuse",eventId:input.requestId,childId:b.childId,parentId:b.parentId,bookingId:b.bookingId,revision:input.revision,staffId:actor.staffId,reason:input.reason,at:r.clock()};
    const n4=createN4Service({...r,readAttendance:async()=>null,verifyEvent:async e=>e===event&&await r.resolveStaff(request)?event:null});
    return resultResponse(await n4.event(event));
   }
   if(["walk-in","manual-attendance","checkout"].includes(input.action))return resultResponse(await r.staff.mutate(input,request));
   return fail(400,"INVALID_INPUT");
  }catch{return fail(503,"SCHEDULING_UNAVAILABLE");}
 };
}
export const handleCombinedScheduling=createCombinedSchedulingHttp();
