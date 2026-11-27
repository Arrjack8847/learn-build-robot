import {createJ12345IdentityEnv,validJ12345Student} from "./identity-scope.mjs";
import {assessmentEnabled,createAssessmentService} from "./assessment.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json","Cache-Control":"private, no-store","Vary":"Cookie","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex, nofollow"}});
const fail=(status,code)=>reply(status,{ok:false,code});
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
export function validateAssessmentInput(v){
 if(!v||typeof v!=="object"||Array.isArray(v)||!["quiz","challenge"].includes(v.mode))return false;
 const quiz=v.mode==="quiz",base=["mode",quiz?"resourceId":"level","action"];
 if(quiz?!id(v.resourceId):!Number.isInteger(v.level)||v.level<1||v.level>6)return false;
 let extra;
 switch(v.action){
 case "resume":extra=[];break;
 case "discover":extra=quiz?["requestId"]:["requestId","retry"];if(!id(v.requestId)||!quiz&&!["new","same"].includes(v.retry))return false;break;
 case "answer":if(!quiz||!id(v.questionId)||!Number.isInteger(v.choice)||v.choice<0||v.choice>3)return false;extra=["attemptId","questionId","choice"];break;
 case "start":if(quiz||v.referenceReady!==true)return false;extra=["attemptId","referenceReady"];break;
 case "finish":if(quiz||typeof v.acknowledgedFinish!=="boolean")return false;extra=["attemptId","acknowledgedFinish"];break;
 case "submit":extra=["attemptId",quiz?"answers":"checks"];if(quiz?(!v.answers||typeof v.answers!=="object"||Array.isArray(v.answers)||Object.keys(v.answers).length!==5||Object.entries(v.answers).some(([k,n])=>!id(k)||!Number.isInteger(n)||n<0||n>3)):(!Array.isArray(v.checks)||v.checks.length!==(v.level===1?4:5)||v.checks.some(c=>typeof c!=="boolean")))return false;break;
 default:return false;
 }
 if(extra.includes("attemptId")&&!id(v.attemptId))return false;
 const keys=[...base,...extra];return Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
}
export function createAssessmentHttp({resolveStudent,readVerifiedChild,authorizeCourse,resolveQuiz,resolveCandidates,storeFactory=createWixStore,clock=Date.now}){
 return async(request,env)=>{
  const url=new URL(request.url),origin="https://"+env.VERCEL_URL;
  if(!assessmentEnabled(env)||!env.VERCEL_URL||url.origin!==origin||url.pathname!=="/api/dev/j5/assessment"||url.search)return fail(404,"NOT_AVAILABLE");
  if(request.method!=="POST")return fail(405,"METHOD_NOT_ALLOWED");
  if(request.headers.get("origin")!==origin||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-j5")!=="1"||request.headers.get("content-type")?.split(";")[0]!=="application/json"||!request.body)return fail(403,"INVALID_REQUEST");
  if((request.headers.get("cookie")??"").split(";").some(p=>/^__Host-bsr-(?:parent-test|student-proof)\s*=/.test(p.trim())))return fail(401,"STUDENT_AUTH_REQUIRED");
  let input;
  try{const r=request.body.getReader(),d=new TextDecoder("utf-8",{fatal:true});let n=0,s="";try{for(;;){const part=await r.read();if(part.done)break;n+=part.value.byteLength;if(n>2048){await r.cancel();return fail(400,"INVALID_INPUT");}s+=d.decode(part.value,{stream:true});}input=JSON.parse(s+d.decode());}finally{r.releaseLock();}}catch{return fail(400,"INVALID_INPUT");}
  if(!validateAssessmentInput(input))return fail(400,"INVALID_INPUT");
  try{
   createJ12345IdentityEnv(env);
   const s=await resolveStudent(request,env);
   if(s?.role!=="student"||s.environment!=="private-preview"||!validJ12345Student(s.studentId))return fail(401,"STUDENT_AUTH_REQUIRED");
   const recheck=async()=>{const r=await resolveStudent(request,env);return r?.role==="student"&&r.environment==="private-preview"&&r.studentId===s.studentId?readVerifiedChild(s.studentId,env):null;};
   const c=await recheck();if(c?.childId!==s.studentId)return fail(401,"STUDENT_AUTH_REQUIRED");
   const result=await createAssessmentService({db:storeFactory(env),env,resolveQuiz,resolveCandidates,clock})(c,input,{recheck,authorize:async path=>{const g=await authorizeCourse(request,env,path);return g?.ok===true&&g.code==="COURSE_AUTHORIZED"&&Number.isSafeInteger(g.validUntil)&&g.validUntil>clock();}});
   return reply(result.ok?200:409,result);
  }catch{return fail(503,"ASSESSMENT_UNAVAILABLE");}
 };
}
