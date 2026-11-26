import {operatorAccess} from "./operator-boundary.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {isJ1234Preview,createJ1234IdentityEnv} from "./identity-scope.mjs";
import {createStudentDirectory,parseDirectoryQuery} from "./student-directory.mjs";
// Protected preview and explicit fictional dataset enablement are the test boundary, not real staff authorization.
const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex, nofollow"}});
export function createJ1234StudentHttp({storeFactory=createWixStore,clock={now:()=>Date.now()}}={}){
 return async(request,env)=>{
  const url=new URL(request.url),origin="https://"+env.VERCEL_URL;
  if(!isJ1234Preview(env)||env.J1234_REGISTRATION_ENABLED!=="1"||env.J1234_STUDENT_READ_ENABLED!=="1"||!env.VERCEL_URL||url.origin!==origin||url.pathname!=="/api/dev/j1234/students"||url.search)return reply(404,{ok:false,status:"NOT_FOUND"});
  if(request.method!=="POST")return reply(405,{ok:false,status:"METHOD_NOT_ALLOWED"});
  if(request.headers.get("origin")!==origin||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-j1234")!=="1")return reply(403,{ok:false,status:"REFUSED"});
  const access=operatorAccess(request,env);if(access!==200)return reply(access,{ok:false,status:access===404?"NOT_FOUND":access===503?"OPERATOR_UNAVAILABLE":"REFUSED"});
  if(request.headers.get("content-type")?.split(";")[0].trim().toLowerCase()!=="application/json"||!request.body)return reply(400,{ok:false,status:"INVALID_INPUT"});
  let input;try{
   const reader=request.body.getReader(),decoder=new TextDecoder("utf-8",{fatal:true});let size=0,raw="";
   try{for(;;){const p=await reader.read();if(p.done)break;size+=p.value.byteLength;if(size>1024){await reader.cancel();return reply(400,{ok:false,status:"INVALID_INPUT"});}raw+=decoder.decode(p.value,{stream:true});}input=JSON.parse(raw+decoder.decode());}finally{reader.releaseLock();}
   if(!parseDirectoryQuery(input))return reply(400,{ok:false,status:"INVALID_INPUT"});
  }catch{return reply(400,{ok:false,status:"INVALID_INPUT"});}
  try{createJ1234IdentityEnv(env);return reply(200,await createStudentDirectory({env,db:storeFactory(env),clock}).list(input));}catch{return reply(503,{ok:false,status:"DIRECTORY_UNAVAILABLE"});}
 };
}
export const handleJ1234Students=createJ1234StudentHttp();
