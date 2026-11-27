// Exact-branch course boundary with approved fixed booked-hour expiry.
import {isFamilyPreview as isJ12345Preview,validJ12345Student,J12345_BRANCH} from "./identity-scope.mjs";
import {classifyCoursePath} from "../../src/lib/j5-course-path.mjs";
import {createCourseHttp} from "../j5/course-http.mjs";
import {createPrivatePdfHttp} from "../j5/pdf-http.mjs";
import {lookupPrivatePdf} from "../j5/pdf-course-catalog.mjs";
import {evaluateLearningSession} from "./learning-session.mjs";
import {isCombinedBranch} from "../combined/scope.mjs";
const fail=(status,code)=>({ok:false,status,code});
const bound=s=>s?.role==="student"&&s.environment==="private-preview"&&validJ12345Student(s.studentId);
const mixed=r=>(r.headers.get("cookie")??"").split(";").some(p=>/^__Host-bsr-(?:parent-test|student-proof)\s*=/.test(p.trim()));
const same=(a,b)=>a?.childId===b?.childId&&a?.parentId===b?.parentId&&a?.stateVersion===b?.stateVersion&&a?.accountStatus===b?.accountStatus;
const enabled=e=>isJ12345Preview(e)&&e.J12345_COURSE_ENABLED==="1"&&e.J12345_PROFILE_ENABLED==="1"&&e.J12345_REGISTRATION_ENABLED==="1"&&e.STUDENT_AUTH_ENABLED==="true";
export function createJ12345CourseAuthority({resolveStudent,readVerifiedChild,readAccess,resolveResource,readProgress,verifyVisit,clock=Date.now}){
 return async(request,env,path)=>{
  if(!enabled(env))return fail(404,"COURSE_UNAVAILABLE");
  if(mixed(request))return fail(401,"STUDENT_AUTH_REQUIRED");
  try{
   const s=await resolveStudent(request,env);
   if(!bound(s))return fail(401,"STUDENT_AUTH_REQUIRED");
   const route=classifyCoursePath(path);
   if(route.scope!=="protected")return fail(404,"COURSE_UNAVAILABLE");
   const resource=await resolveResource(route);
   if(!resource||resource.kind!==route.kind||!Number.isInteger(resource.level)||resource.level<1||resource.level>6)return fail(404,"COURSE_UNAVAILABLE");
   const child=await readVerifiedChild(s.studentId,env);
   if(child?.childId!==s.studentId||!validJ12345Student(child.parentId)||child.accountStatus!=="preview-test"||!child.stateVersion)return fail(403,"COURSE_UNAVAILABLE");
   const a=await readAccess(child,env);
   const progress=typeof readProgress==="function"?await readProgress(child,env):null;
   const again=await readVerifiedChild(s.studentId,env),fresh=await resolveStudent(request,env);
   if(!bound(fresh)||fresh.studentId!==s.studentId)return fail(401,"STUDENT_AUTH_REQUIRED");
   if(!same(child,again))return fail(503,"COURSE_UNAVAILABLE");
   if(!a||a.reason==="verification-required")return fail(503,"COURSE_UNAVAILABLE");
   if(a.membershipEligible!==true)return fail(403,"MEMBERSHIP_REQUIRED");
   if(a.attendance!=="checked-in")return fail(403,"CHECK_IN_REQUIRED");
   if(!progress)return fail(503,"COURSE_UNAVAILABLE");
   if(progress){
    if(progress.status!=="ready"||!Array.isArray(progress.levels)||progress.levels.length!==6)return fail(503,"COURSE_UNAVAILABLE");
    const level=progress.levels.find(l=>l.level===resource.level);
    if(!level||!["unlocked","in-progress","completed"].includes(level.status))return fail(403,"LEVEL_LOCKED");
   }
   // Owner approval of duration is NOT authorization to activate the private preview.
   if(env.J12345_LEARNING_SESSION_ENABLED!=="1")return fail(403,"LEARNING_POLICY_REQUIRED");
   // Re-read attendance and membership after the progress read; reject a changed visit.
   const observed=await readAccess(child,env),lastChild=await readVerifiedChild(s.studentId,env),lastSession=await resolveStudent(request,env);
   if(!bound(lastSession)||lastSession.studentId!==s.studentId)return fail(401,"STUDENT_AUTH_REQUIRED");
   if(!same(child,lastChild)||!observed||observed.reason==="verification-required")return fail(503,"COURSE_UNAVAILABLE");
   if(observed.membershipEligible!==true)return fail(403,"MEMBERSHIP_REQUIRED");
   if(observed.attendance!=="checked-in")return fail(403,"CHECK_IN_REQUIRED");
   if(observed.bookingId!==a.bookingId||observed.bookingRevision!==a.bookingRevision||observed.bookingStartAt!==a.bookingStartAt||observed.bookingEndAt!==a.bookingEndAt||observed.checkInAt!==a.checkInAt||observed.membershipValidUntil!==a.membershipValidUntil)return fail(503,"COURSE_UNAVAILABLE");
   let grant=null;
   if(isCombinedBranch(env)){grant=typeof verifyVisit==="function"?await verifyVisit(request,env):null;if(!grant||grant.bookingId!==observed.bookingId||grant.revision!==observed.bookingRevision||!Number.isSafeInteger(grant.validUntil)||grant.validUntil<=clock())return fail(403,"CHECK_IN_REQUIRED");}
   const decision=evaluateLearningSession(observed,clock());
   if(decision.status==="expired")return fail(403,"LEARNING_SESSION_EXPIRED");
   if(decision.status!=="eligible")return fail(503,"COURSE_UNAVAILABLE");
   return {ok:true,status:200,code:"COURSE_AUTHORIZED",validUntil:grant?Math.min(decision.endsAt,grant.validUntil):decision.endsAt};
  }catch{return fail(503,"COURSE_UNAVAILABLE");}
 };
}
export function createJ12345CourseBoundary({privateArtifact=false,...deps}){
 const authorize=createJ12345CourseAuthority(deps);
 const course=createCourseHttp({getAuthority:async()=>authorize});
 const pdf=createPrivatePdfHttp({lookupDocument:lookupPrivatePdf,getServices:async()=>null});
 return async(request,env,next)=>{
  const u=new URL(request.url),api=u.pathname==="/api/dev/j5/course-access",document=u.pathname.startsWith("/api/dev/j5/pdf/");
  const route=classifyCoursePath(u.pathname),branch=env?.VERCEL_GIT_COMMIT_REF===J12345_BRANCH||isCombinedBranch(env);
  if(!api&&!document&&(!(branch||privateArtifact)||route.scope==="outside"||route.scope==="shell"))return next();
  // The generic J5 transport flag is supplied only internally, without changing the real branch.
  // Keep the route locked even when the new course flag is off.
  if(!isJ12345Preview(env)||!env.VERCEL_URL||u.origin!=="https://"+env.VERCEL_URL){
   return new Response(null,{status:404,headers:{"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"}});
  }
  const scoped={...env,J5_PRIVATE_ENABLED:"true"};
  if(document)return enabled(env)?pdf(request,scoped):new Response(null,{status:404,headers:{"Cache-Control":"private, no-store"}});
  return course(request,scoped,next);
 };
}
