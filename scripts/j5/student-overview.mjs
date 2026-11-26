import {projectLevelRows} from "../../src/lib/j5-level-selection.mjs";
import {evaluateMembership} from "./membership-policy.mjs";
// J5 server-only read projection; trusted adapters are injected, no real provider integration.
export function createStudentOverview({resolveStudent,readProfile,readMembership,readCheckIn,readLevels,clock}){
 const deny=(status,code)=>({ok:false,status,code});
 const validId=x=>typeof x==="string"&&/^[A-Za-z0-9_-]{1,128}$/.test(x);
 const time=x=>Number.isSafeInteger(x)&&x>=0;
 const matches=(x,id)=>x?.studentId===id&&x.environment==="private-preview";
 const instant=(row,now)=>time(row.validFrom)&&time(row.validUntil)&&row.validFrom<=now&&now<row.validUntil;
 async function load(request,env){
  if(env?.VERCEL_ENV!=="preview"||env?.VERCEL_TARGET_ENV==="production")return deny(403,"PRIVATE_PREVIEW_ONLY");
  try{
   const s=await resolveStudent(request,env);
   if(s?.role!=="student"||s.environment!=="private-preview"||!validId(s.studentId))return deny(401,"STUDENT_AUTH_REQUIRED");
   const id=s.studentId;
   const p=await readProfile(id);
   if(!matches(p,id)||p.accountStatus!=="active")return deny(403,"STUDENT_UNAVAILABLE");
   if(typeof p.displayName!=="string"||!p.displayName.trim()||p.displayName.length>120||!validId(p.studentCode))return deny(503,"PROFILE_UNAVAILABLE");
   const [m,c,levels]=await Promise.all([readMembership(id),readCheckIn(id),readLevels(id)]);
   const again=await resolveStudent(request,env);
   if(again?.role!=="student"||again.environment!=="private-preview"||again.studentId!==id)return deny(401,"STUDENT_AUTH_REQUIRED");
   const now=clock.now();
   if(!time(now))return deny(503,"SERVICE_UNAVAILABLE");
   const decision=evaluateMembership(m,id,now);
   if(decision.status==="unavailable")return deny(503,"MEMBERSHIP_UNAVAILABLE");
   const membership=decision.status,validUntil=decision.validUntil;
   let checkIn="required",checkInUntil=null;
   if(c!=null){
    if(!matches(c,id))return deny(503,"CHECK_IN_UNAVAILABLE");
    if(c.status==="verified"&&c.revoked===false&&validId(c.bookingId)&&time(c.validFrom)&&time(c.validUntil)&&c.validFrom<c.validUntil){
     if(instant(c,now)){checkIn="verified";checkInUntil=c.validUntil;}
     else if(now>=c.validUntil)checkIn="expired";
    }
   }
   const projected=projectLevelRows(levels,id,membership,checkIn);
   if(!projected)return deny(503,"LEVELS_UNAVAILABLE");
   return {ok:true,profile:{displayName:p.displayName,studentCode:p.studentCode,accountStatus:"active",membership,validUntil,checkIn,checkInUntil},levels:projected};
  }catch{return deny(503,"SERVICE_UNAVAILABLE");}
 }
 return {load};
}
