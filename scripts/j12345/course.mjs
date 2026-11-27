// Exact-branch production-safe course boundary. No invented level rows or visit lifetime.
import {isJ12345Preview,validJ12345Student,J12345_BRANCH} from "./identity-scope.mjs";
import {classifyCoursePath} from "../../src/lib/j5-course-path.mjs";
import {createCourseHttp} from "../j5/course-http.mjs";
import {createPrivatePdfHttp} from "../j5/pdf-http.mjs";
import {lookupPrivatePdf} from "../j5/pdf-course-catalog.mjs";
const fail=(status,code)=>({ok:false,status,code});
const bound=s=>s?.role==="student"&&s.environment==="private-preview"&&validJ12345Student(s.studentId);
const mixed=r=>(r.headers.get("cookie")??"").split(";").some(p=>/^__Host-bsr-(?:parent-test|student-proof)\s*=\s*[^\s]/.test(p.trim()));
const same=(a,b)=>a?.childId===b?.childId&&a?.parentId===b?.parentId&&a?.stateVersion===b?.stateVersion&&a?.accountStatus===b?.accountStatus;
const enabled=e=>isJ12345Preview(e)&&e.J12345_COURSE_ENABLED==="1"&&e.J12345_PROFILE_ENABLED==="1"&&e.J12345_REGISTRATION_ENABLED==="1"&&e.STUDENT_AUTH_ENABLED==="true";
export function createJ12345CourseAuthority({resolveStudent,readVerifiedChild,readAccess,resolveResource,readProgress}){
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
   if(progress){
    if(progress.status!=="ready"||!Array.isArray(progress.levels)||progress.levels.length!==6)return fail(503,"COURSE_UNAVAILABLE");
    const level=progress.levels.find(l=>l.level===resource.level);
    if(!level||!["unlocked","in-progress","completed"].includes(level.status))return fail(403,"LEVEL_LOCKED");
   }
   // The approved learning duration/termination policy is still required.
   // Even verified individual level evidence cannot grant a course by itself.
   return fail(403,"LEARNING_POLICY_REQUIRED");
  }catch{return fail(503,"COURSE_UNAVAILABLE");}
 };
}
export function createJ12345CourseBoundary({privateArtifact=false,...deps}){
 const authorize=createJ12345CourseAuthority(deps);
 const course=createCourseHttp({getAuthority:async()=>authorize});
 const pdf=createPrivatePdfHttp({lookupDocument:lookupPrivatePdf,getServices:async()=>null});
 return async(request,env,next)=>{
  const u=new URL(request.url),api=u.pathname==="/api/dev/j5/course-access",document=u.pathname.startsWith("/api/dev/j5/pdf/");
  const route=classifyCoursePath(u.pathname),branch=env?.VERCEL_GIT_COMMIT_REF===J12345_BRANCH;
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
