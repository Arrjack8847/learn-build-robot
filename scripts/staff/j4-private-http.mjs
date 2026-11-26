import {createJ4WixStore} from "./j4-wix-store.mjs";
import {createJ4Crypto} from "./j4-crypto.mjs";
import {createJ4StateService} from "./j4-state-service.mjs";
import {createFixtureReadStore,calculateFixtureOverview} from "./j4-fixtures.mjs";
import {createStaffReadService} from "./read-service.mjs";
const reply=(status,data,cookie)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff",...(cookie?{"Set-Cookie":cookie}:{})}});
async function body(request){
 if(!request.headers.get("content-type")?.startsWith("application/json")||!request.body)throw Error("BAD_BODY");
 const reader=request.body.getReader();let total=0;const parts=[];
 try{while(true){const p=await reader.read();if(p.done)break;total+=p.value.byteLength;if(total>4096){await reader.cancel();throw Error("BAD_BODY");}parts.push(p.value);}}finally{reader.releaseLock();}
 const buf=new Uint8Array(total);let at=0;for(const p of parts){buf.set(p,at);at+=p.length;}
 const data=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(buf));if(!data||typeof data!=="object"||Array.isArray(data))throw Error("BAD_BODY");return data;
}
export function createJ4Http({makeStore=createJ4WixStore,makeCrypto=createJ4Crypto,makeClock=()=>({now:()=>Date.now(),localDay:()=>new Date(Date.now()+8*3600000).toISOString().slice(0,10)})}={}){
 return async (request,env)=>{
  const origin=env.VERCEL_URL?"https://"+env.VERCEL_URL:"";
  if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.J4_PRIVATE_ENABLED!=="1"||env.VERCEL_GIT_COMMIT_REF!=="feat/j4-private-staff-admin-20261126")return reply(404,{ok:false,status:"NOT_FOUND"});
  if(request.method!=="POST")return reply(405,{ok:false,status:"METHOD_NOT_ALLOWED"});
  if(!origin||new URL(request.url).origin!==origin||request.headers.get("origin")!==origin||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-staff")!=="1")return reply(403,{ok:false,status:"REFUSED"});
  const action=new URL(request.url).pathname.split("/").pop();
  if(!["sign-in","sign-out","session","overview","list","student","attendance","staff-status","check-in-code"].includes(action))return reply(404,{ok:false,status:"NOT_FOUND"});
  let input;try{input=await body(request);}catch{return reply(400,{ok:false,status:"INVALID_INPUT"});}
  try{
   const store=makeStore(env),crypto=makeCrypto(env),clock=makeClock();
   const svc=createJ4StateService({store,crypto,clock});
   let result;
   if(action==="sign-in")result=await svc.signIn(input);
   else if(action==="sign-out")result=await svc.logout(request);
   else {
    const actor=await svc.resolve(request);
    if(!actor)return reply(401,{ok:false,status:"REFUSED"});
    if(action==="session")result={ok:true,status:"READY",actor:{staffId:actor.staffId,displayName:actor.displayName,role:actor.role}};
    else if(action==="attendance")result=await svc.attendance(request,input);
    else if(action==="staff-status")result=await svc.manageStaff(request,input);
    else if(action==="check-in-code")result=await svc.checkInCode(request,input);
    else{
     const snapshot=await store.readStrong();
     // Re-resolve after taking the snapshot. Never trust browser role or record scope.
     const fresh=await svc.resolve(request);
     if(!fresh||fresh.staffId!==actor.staffId||fresh.role!==actor.role)return reply(401,{ok:false,status:"REFUSED"});
     if(action==="overview")result={ok:true,status:"READY",metrics:calculateFixtureOverview(snapshot,fresh.role,clock.localDay()),fixture:true};
     else{
      const read=createStaffReadService({identity:{resolveStaff:()=>svc.resolve(request)},store:createFixtureReadStore(snapshot,clock.now()),clock});
      result=action==="list"?await read.list(request,input.resource,input.query??{}):await read.student(request,input.studentId);
     }
    }
   }
   const {cookie,...safe}=result;
   return reply(result.ok?200:result.status==="INVALID_INPUT"?400:result.status==="RETRY_REQUIRED"?409:403,safe,cookie);
  }catch{return reply(503,{ok:false,status:"J4_PRIVATE_SERVICE_UNAVAILABLE"});}
 };
}
export const handleJ4Private=createJ4Http();
