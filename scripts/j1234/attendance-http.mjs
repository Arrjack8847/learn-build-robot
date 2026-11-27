import {operatorAccess} from "./operator-boundary.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {resolveJ2Student} from "../j2-runtime.mjs";
import {attendanceEnabled,attendanceOperatorEnabled,attendanceIdentityEnv,createAttendanceService,readAttendanceProjection} from "./attendance.mjs";
import {isJ12345Preview} from "../j12345/identity-scope.mjs";
import {validStudent} from "../j123/billing-records.mjs";
const json=(status,data)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex, nofollow"}});
const fail=(status,reason)=>json(status,{ok:false,status:reason});
const paths={"/api/dev/j1234/attendance":"operator","/api/dev/j1234/check-in":"student"};
export function createAttendanceHttp({storeFactory=createWixStore,resolveStudent=resolveJ2Student,clock=()=>Date.now()}={}){
 return async(request,env)=>{
  const url=new URL(request.url),kind=paths[url.pathname],origin="https://"+env.VERCEL_URL;
  if(!kind||!attendanceEnabled(env)||!env.VERCEL_URL||url.origin!==origin||url.search||kind==="operator"&&!attendanceOperatorEnabled(env))return fail(404,"NOT_FOUND");
  if(request.method!=="POST")return fail(405,"METHOD_NOT_ALLOWED");
  if(request.headers.get("origin")!==origin||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-j1234")!=="1")return fail(403,"REFUSED");
  if(kind==="operator"){const access=operatorAccess(request,env);if(access!==200)return fail(access,access===404?"NOT_FOUND":access===503?"OPERATOR_UNAVAILABLE":"REFUSED");}
  if(request.headers.get("content-type")?.split(";")[0].trim().toLowerCase()!=="application/json"||!request.body)return fail(400,"INVALID_INPUT");
  let input;
  try{
   const reader=request.body.getReader(),decoder=new TextDecoder("utf-8",{fatal:true});let size=0,raw="";
   try{for(;;){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>1024){await reader.cancel();return fail(400,"INVALID_INPUT");}raw+=decoder.decode(part.value,{stream:true});}input=JSON.parse(raw+decoder.decode());}finally{reader.releaseLock();}
   if(!input||typeof input!=="object"||Array.isArray(input))return fail(400,"INVALID_INPUT");
   const action=input.action,keys=kind==="student"?(action==="status"?["action"]:action==="redeem"?["action","bookingId","code","requestId"]:null):action==="book"?["action","studentId","requestId"]:["issue","revoke","check_out","no_show","excuse"].includes(action)?["action","studentId","bookingId","requestId"]:null;
   if(!keys||Object.keys(input).length!==keys.length||!keys.every(k=>Object.hasOwn(input,k)))return fail(400,"INVALID_INPUT");
  }catch{return fail(400,"INVALID_INPUT");}
  try{
   attendanceIdentityEnv(env);const db=storeFactory(env);
   if(kind==="student"){
    if(isJ12345Preview(env)&&(request.headers.get("cookie")??"").split(";").some(p=>/^__Host-bsr-(?:parent-test|student-proof)\s*=\s*[^\s]/.test(p.trim())))return fail(401,"NOT_AUTHORIZED");
    const session=await resolveStudent(request,env);
    if(session?.role!=="student"||session.environment!=="private-preview"||!validStudent(session.studentId))return fail(401,"NOT_AUTHORIZED");
    if(input.action==="status"){
     const row=await db.get("Children",session.studentId),parentId=typeof row?.parentId==="string"?row.parentId:row?.parentId?._id??row?.parentId?.id;
     if(row?.childId!==session.studentId||!validStudent(parentId))return fail(503,"ATTENDANCE_UNCONFIRMED");
     const attendance=await readAttendanceProjection({env,db,studentId:session.studentId,parentId,now:clock()});
     const fresh=await resolveStudent(request,env);if(fresh?.studentId!==session.studentId||fresh.role!=="student")return fail(401,"NOT_AUTHORIZED");
     return json(200,{ok:true,status:"READY",attendance});
    }
    input={...input,studentId:session.studentId};
   }
   const result=await createAttendanceService({env,db,clock}).execute(input,{resolveStudent:()=>resolveStudent(request,env)});
   return json(result.ok?200:409,result);
  }catch{return fail(503,"ATTENDANCE_UNCONFIRMED");}
 };
}
export const handleJ1234Attendance=createAttendanceHttp();
