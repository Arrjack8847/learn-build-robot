import {classifyCoursePath} from "../../src/lib/j5-course-path.mjs";
import {evaluateMembership} from "./membership-policy.mjs";
export function resolveCourseResource(route,{getProjectLevel,hasCategory}){
 if(route.scope!=="protected")return null;
 const level=route.projectId?getProjectLevel(route.projectId):route.level;
 if(!Number.isInteger(level)||level<1||level>6)return null;
 if(route.kind==="category"&&!hasCategory(level,route.categoryId))return null;
 return {kind:route.kind,level,checkInRequired:true};
}
export function createCourseAuthority({resolveStudent,readSnapshot,resolveResource,clock}){
 const fail=(status,code)=>({ok:false,status,code});
 const id=x=>typeof x==="string"&&/^[A-Za-z0-9_-]{1,128}$/.test(x);
 const stamp=x=>Number.isSafeInteger(x)&&x>=0&&x<=8640000000000000;
 const student=s=>s?.role==="student"&&s.environment==="private-preview"&&id(s.studentId);
 const bound=(row,s)=>row?.studentId===s.studentId&&row.environment==="private-preview";
 return async function authorize(request,env,path){
  if(env?.VERCEL_ENV!=="preview"||env?.VERCEL_TARGET_ENV==="production")return fail(404,"NOT_AVAILABLE");
  const route=classifyCoursePath(path);
  if(route.scope!=="protected")return fail(404,"COURSE_UNAVAILABLE");
  try{
   const s=await resolveStudent(request,env);
   if(!student(s))return fail(401,"STUDENT_AUTH_REQUIRED");
   const resource=await resolveResource(route);
   if(!resource||resource.kind!==route.kind||!Number.isInteger(resource.level)||resource.level<1||resource.level>6||(route.level!==undefined&&resource.level!==route.level)||resource.checkInRequired!==true)return fail(404,"COURSE_UNAVAILABLE");
   const row=await readSnapshot(s.studentId);
   const again=await resolveStudent(request,env);
   if(!student(again)||again.studentId!==s.studentId)return fail(401,"STUDENT_AUTH_REQUIRED");
   const now=clock.now();
   if(!stamp(now)||!bound(row,s)||!bound(row.profile,s)||row.profile.accountStatus!=="active")return fail(403,"COURSE_UNAVAILABLE");
   const member=evaluateMembership(row.membership,s.studentId,now);
   if(member.status==="unavailable")return fail(503,"COURSE_UNAVAILABLE");
   if(!member.eligible)return fail(403,"MEMBERSHIP_REQUIRED");
   const c=row.checkIn;
   if(!bound(c,s)||c.status!=="verified"||c.revoked!==false||!id(c.bookingId)||!stamp(c.validFrom)||!stamp(c.validUntil)||c.validFrom>=c.validUntil||now<c.validFrom||now>=c.validUntil)return fail(403,"CHECK_IN_REQUIRED");
   const levels=row.levels;
   if(!Array.isArray(levels)||levels.length!==6||new Set(levels.map(l=>l?.level)).size!==6||levels.some(l=>!bound(l,s)||!Number.isInteger(l.level)||l.level<1||l.level>6||typeof l.allowed!=="boolean"||!["locked","unlocked","in-progress","completed"].includes(l.status)||l.allowed===(l.status==="locked")))return fail(503,"COURSE_UNAVAILABLE");
   const level=levels.find(l=>l.level===resource.level);
   if(level.allowed!==true)return fail(403,"LEVEL_LOCKED");
   return {ok:true,status:200,code:"COURSE_AUTHORIZED",validUntil:Math.min(member.validUntil,c.validUntil)};
  }catch{return fail(503,"COURSE_UNAVAILABLE");}
 };
}
