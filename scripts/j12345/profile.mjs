import {isJ12345Preview,validJ12345Student} from "./identity-scope.mjs";
const bound=s=>s?.role==="student"&&s.environment==="private-preview"&&validJ12345Student(s.studentId);
const same=(a,b)=>a?.childId===b?.childId&&a?.parentId===b?.parentId&&a?.stateVersion===b?.stateVersion&&a?.name===b?.name&&a?.accountStatus===b?.accountStatus;
// Children.childId is the canonical logical profile ID. No second Wix profile is created or guessed.
export function createJ12345ProfileHttp({resolveStudent,readVerifiedChild,readAccess}){
 return async function handle(request,env){
  const out=(status,data)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex, nofollow"}});
  const fail=(status,code)=>out(status,{ok:false,code});
  const url=new URL(request.url);
  if(!isJ12345Preview(env)||env.J12345_PROFILE_ENABLED!=="1"||env.J12345_REGISTRATION_ENABLED!=="1"||env.STUDENT_AUTH_ENABLED!=="true"||url.pathname!=="/api/dev/j5/profile")return fail(404,"NOT_AVAILABLE");
  if(request.method!=="POST")return fail(405,"METHOD_NOT_ALLOWED");
  const origin=env.VERCEL_URL?"https://"+env.VERCEL_URL:"";
  if(!origin||url.origin!==origin||url.search||request.headers.get("origin")!==origin||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-student-profile")!=="1"||request.body!==null)return fail(403,"INVALID_REQUEST");
  if((request.headers.get("cookie")??"").split(";").some(p=>/^__Host-bsr-(?:parent-test|student-proof)\s*=\s*[^\s]/.test(p.trim())))return fail(401,"STUDENT_AUTH_REQUIRED");
  try{
   const first=await resolveStudent(request,env);
   if(!bound(first))return fail(401,"STUDENT_AUTH_REQUIRED");
   const child=await readVerifiedChild(first.studentId,env);
   if(child?.childId!==first.studentId||!validJ12345Student(child.parentId)||child.accountStatus!=="preview-test"||typeof child.stateVersion!=="string"||!child.stateVersion||typeof child.name!=="string"||child.name!==child.name.trim()||!child.name||child.name.length>48)return fail(503,"PROFILE_UNAVAILABLE");
   const access=typeof readAccess==="function"?await readAccess(child,env):null;
   const again=await readVerifiedChild(first.studentId,env);
   const last=await resolveStudent(request,env);
   if(!bound(last)||last.studentId!==first.studentId)return fail(401,"STUDENT_AUTH_REQUIRED");
   if(!same(child,again))return fail(503,"PROFILE_UNAVAILABLE");
   return out(200,{ok:true,profile:{studentId:first.studentId,displayName:child.name,identityStatus:"verified",learningAccess:"unavailable",...(access?{access}: {})}});
  }catch{return fail(503,"PROFILE_UNAVAILABLE");}
 };
}
