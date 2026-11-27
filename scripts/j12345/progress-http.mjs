import {validJ12345Student,createJ12345IdentityEnv} from "./identity-scope.mjs";
import {createProgressRepository,progressEnabled} from "./progress.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
export function createProgressHttp({resolveStudent,readVerifiedChild,authorizeCourse,storeFactory=createWixStore,clock=Date.now}){
 const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json","Cache-Control":"private, no-store","Vary":"Cookie","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex, nofollow"}});
 const fail=(status,code)=>reply(status,{ok:false,code});
 return async(request,env)=>{
  const u=new URL(request.url),origin="https://"+env.VERCEL_URL;
  if(!progressEnabled(env)||u.pathname!=="/api/dev/j5/progress"||u.search||!env.VERCEL_URL||u.origin!==origin)return fail(404,"NOT_AVAILABLE");
  if(request.method!=="POST")return fail(405,"METHOD_NOT_ALLOWED");
  if(request.headers.get("origin")!==origin||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-j5")!=="1"||request.headers.get("content-type")?.split(";")[0]!=="application/json"||!request.body)return fail(403,"INVALID_REQUEST");
  if((request.headers.get("cookie")??"").split(";").some(x=>/^__Host-bsr-(?:parent-test|student-proof)\s*=/.test(x.trim())))return fail(401,"STUDENT_AUTH_REQUIRED");
  let input;
  try{const r=request.body.getReader(),d=new TextDecoder("utf-8",{fatal:true});let n=0,s="";try{for(;;){const part=await r.read();if(part.done)break;n+=part.value.byteLength;if(n>1024){await r.cancel();return fail(400,"INVALID_INPUT");}s+=d.decode(part.value,{stream:true});}input=JSON.parse(s+d.decode());}finally{r.releaseLock();}}
  catch{return fail(400,"INVALID_INPUT");}
  if(!input||typeof input!=="object"||Array.isArray(input))return fail(400,"INVALID_INPUT");
  const keys=input.kind==="initialize"?["kind"]:input.kind==="checkpoint"?["kind","resourceId","mode","position"]:null;
  if(!keys||Object.keys(input).length!==keys.length||!keys.every(k=>Object.hasOwn(input,k)))return fail(400,"INVALID_INPUT");
  if(input.kind==="checkpoint"&&(!["learning","building"].includes(input.mode)||typeof input.resourceId!=="string"||! /^[a-z0-9_-]{1,128}$/.test(input.resourceId)||!Number.isSafeInteger(input.position)||input.position<1))return fail(400,"INVALID_INPUT");
  try{
   createJ12345IdentityEnv(env);
   const s=await resolveStudent(request,env);
   if(s?.role!=="student"||s.environment!=="private-preview"||!validJ12345Student(s.studentId))return fail(401,"STUDENT_AUTH_REQUIRED");
   const recheck=async()=>{const fresh=await resolveStudent(request,env);return fresh?.role==="student"&&fresh.environment==="private-preview"&&fresh.studentId===s.studentId?readVerifiedChild(s.studentId,env):null;};
   const child=await recheck();if(child?.childId!==s.studentId)return fail(401,"STUDENT_AUTH_REQUIRED");
   const result=await createProgressRepository({db:storeFactory(env),env,clock}).write(child,input,{recheck,authorize:async req=>{const grant=await authorizeCourse(request,env,"/projects/"+req.resourceId);return grant?.ok===true&&grant.code==="COURSE_AUTHORIZED"&&Number.isSafeInteger(grant.validUntil)&&grant.validUntil>clock();}});
   return reply(result.ok?200:result.code==="STUDENT_AUTH_REQUIRED"?401:409,result);
  }catch{return fail(503,"PROGRESS_UNAVAILABLE");}
 };
}
