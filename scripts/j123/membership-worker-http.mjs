// Disabled-by-default trusted worker endpoint. It cannot create payment requests,
// accept browser payment evidence, bypass Vercel protection or set acceptance flags.
import {timingSafeEqual} from "node:crypto";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {membershipProcessingEnabled} from "./membership-provider.mjs";
import {dispatchVerifiedMembershipEvent} from "./membership-runtime.mjs";
const json=(status,body)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
const validSecret=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
export function createMembershipWorkerHttp({storeFactory=createWixStore,requestFn=fetch,clock=()=>Date.now()}={}){
 return async(request,env)=>{
  const url=new URL(request.url);
  if(url.pathname!=="/api/dev/j123/membership-worker"||url.search||!membershipProcessingEnabled(env)||env.J123_MEMBERSHIP_WORKER_ENABLED!=="true"||!env.VERCEL_URL||url.origin!=="https://"+env.VERCEL_URL)return json(404,{ok:false});
  if(request.method!=="POST")return json(405,{ok:false});
  // Worker access is separate from payer/student auth, and Vercel deployment protection remains intact.
  const key=env.J123_MEMBERSHIP_WORKER_SECRET;
  if(!validSecret(key)||[env.PARENT_AUTH_SECRET,env.STUDENT_AUTH_SECRET].some(v=>typeof v==="string"&&v.toLowerCase()===key))return json(503,{ok:false});
  const auth=request.headers.get("authorization")??"";
  if(!/^Bearer [a-f0-9]{64}$/.test(auth)||!timingSafeEqual(Buffer.from(auth.slice(7),"hex"),Buffer.from(key,"hex")))return json(401,{ok:false});
  if(!request.headers.get("content-type")?.startsWith("application/json")||!request.body)return json(400,{ok:false});
  try{
   const reader=request.body.getReader(),decoder=new TextDecoder("utf-8",{fatal:true});let size=0,raw="";
   try{for(;;){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>256){await reader.cancel();return json(400,{ok:false});}raw+=decoder.decode(part.value,{stream:true});}raw+=decoder.decode();}finally{reader.releaseLock();}
   let input;try{input=JSON.parse(raw);}catch{return json(400,{ok:false});}
   if(!input||typeof input!=="object"||Array.isArray(input)||Object.keys(input).length!==1||typeof input.eventKey!=="string"||! /^[a-f0-9]{64}$/.test(input.eventKey))return json(400,{ok:false});
   const result=await dispatchVerifiedMembershipEvent({env,db:storeFactory(env,requestFn),eventKey:input.eventKey,requestFn,clock});
   // Only a committed, duplicate, or explicitly unrelated event is acknowledged.
   // The caller must preserve/retry pending events; no identifiers or provider details returned.
   return json(result.ok?200:503,{ok:result.ok,status:result.status});
  }catch{return json(503,{ok:false});}
 };
}
export const handleMembershipWorker=createMembershipWorkerHttp();
