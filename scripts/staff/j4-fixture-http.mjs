import {createJ4WixStore} from "./j4-wix-store.mjs";
import {fixtureEnabled,fixtureStoreEnv,createJ4WixExercise} from "./j4-wix-exercise.mjs";
const actions=new Set(["session","choose-fixture-role","overview","list","student","student-profile","attendance","staff-status","check-in-code","simulated-report"]);
const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex, nofollow"}});
async function readBody(request){
 if(request.headers.get("content-type")?.split(";")[0].trim().toLowerCase()!=="application/json"||!request.body)throw Error("INVALID_INPUT");
 const reader=request.body.getReader();let total=0;const parts=[];
 try{while(true){const p=await reader.read();if(p.done)break;total+=p.value.byteLength;if(total>4096){await reader.cancel();throw Error("INVALID_INPUT");}parts.push(p.value);}}finally{reader.releaseLock();}
 const buf=new Uint8Array(total);let at=0;for(const p of parts){buf.set(p,at);at+=p.length;}
 const input=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(buf));
 if(!input||typeof input!=="object"||Array.isArray(input)||Object.keys(input).some(k=>!["simulatedStaffId","input"].includes(k))||!input.input||typeof input.input!=="object"||Array.isArray(input.input)||typeof input.simulatedStaffId!=="string"||!/^qa-j4-staff-[1-3]$/.test(input.simulatedStaffId))throw Error("INVALID_INPUT");
 return input;
}
// Vercel deployment protection is the environment boundary for this fictional exercise.
// Never use browser-selected identities as real authorization. No real data or production.
export function createJ4FixtureHttp({makeStore=createJ4WixStore,makeClock=()=>({now:()=>Date.now(),localDay:()=>new Date(Date.now()+8*3600000).toISOString().slice(0,10)})}={}){
 return async(request,env)=>{
  if(!fixtureEnabled(env))return reply(404,{ok:false,status:"NOT_FOUND"});
  if(request.method!=="POST")return reply(405,{ok:false,status:"METHOD_NOT_ALLOWED"});
  const url=new URL(request.url),origin="https://"+env.VERCEL_URL;
  if(!env.VERCEL_URL||url.origin!==origin||request.headers.get("origin")!==origin||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-j4-fixture")!=="1")return reply(403,{ok:false,status:"REFUSED"});
  const match=/^\/api\/dev\/j4-fixture\/([a-z-]+)$/.exec(url.pathname);
  if(!match||!actions.has(match[1]))return reply(404,{ok:false,status:"NOT_FOUND"});
  let body;try{body=await readBody(request);}catch{return reply(400,{ok:false,status:"INVALID_INPUT"});}
  // Only simulation actor IDs are accepted; no account credentials, arbitrary collection/ID or raw writes.
  try{
   const run=createJ4WixExercise({store:makeStore(fixtureStoreEnv(env)),clock:makeClock()});
   const result=await run(match[1],body.input,body.simulatedStaffId);
   return reply(result.ok?200:result.status==="INVALID_INPUT"?400:result.status==="RETRY_REQUIRED"?409:403,result);
  }catch{return reply(503,{ok:false,status:"J4_WIX_FIXTURE_UNAVAILABLE"});}
 };
}
export const handleJ4Fixture=createJ4FixtureHttp();
