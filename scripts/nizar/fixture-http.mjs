// Explicitly fictional, operator-protected N3 preview. Not a parent authentication system.
import {createHash,timingSafeEqual} from "node:crypto";
import {enabled} from "./contract.mjs";
import {createSchedulingRepository} from "./repository.mjs";
import {createBookingService} from "./booking-service.mjs";
import {createN4Service} from "./automation-service.mjs";
const path="/api/dev/nizar/booking";
const id=x=>"qa-j2-"+createHash("sha256").update("nizar-n3-fictional-v1/"+x).digest("hex");
export const fixtures=[{name:"Test parent A",parentId:id("parent-a"),children:[{id:id("child-a1"),name:"Test student A1",paid:true},{id:id("child-a2"),name:"Test student A2",paid:false}]},{name:"Test parent B",parentId:id("parent-b"),children:[{id:id("child-b1"),name:"Test student B1",paid:true}]}];
export const fixtureEnabled=e=>enabled(e)&&e.NIZAR_FIXTURE_ENABLED==="1"&&typeof e.NIZAR_FIXTURE_OPERATOR_KEY==="string"&&/^[a-f0-9]{64}$/.test(e.NIZAR_FIXTURE_OPERATOR_KEY)&&new Set(e.NIZAR_FIXTURE_OPERATOR_KEY).size>=8&&![e.J12345_AUTH_ROOT,e.J12345_TEST_OPERATOR_SECRET,e.J1234_AUTH_ROOT,e.J1234_TEST_OPERATOR_SECRET,e.PARENT_AUTH_SECRET,e.STUDENT_AUTH_SECRET].includes(e.NIZAR_FIXTURE_OPERATOR_KEY);
const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"private, no-store","Vary":"X-STEM-Nizar-Operator","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex, nofollow"}});
const refuse=(status,code)=>reply(status,{ok:false,status:code});
async function readBody(r){
 const reader=r.body.getReader(),decoder=new TextDecoder("utf-8",{fatal:true});let bytes=0,raw="";
 try{for(;;){const x=await reader.read();if(x.done)break;bytes+=x.value.byteLength;if(bytes>2048){await reader.cancel();throw Error("TOO_LARGE");}raw+=decoder.decode(x.value,{stream:true});}return JSON.parse(raw+decoder.decode());}finally{reader.releaseLock();}
}
export function createNizarFixtureHttp({repositoryFactory=env=>createSchedulingRepository({env}),clock=Date.now}={}){
 return async(request,env)=>{
  const u=new URL(request.url),origin="https://"+env.VERCEL_URL;
  if(!fixtureEnabled(env)||!env.VERCEL_URL||u.pathname!==path||u.search||u.origin!==origin)return refuse(404,"NOT_AVAILABLE");
  if(request.method!=="POST")return refuse(405,"METHOD_NOT_ALLOWED");
  if(request.headers.get("origin")!==origin||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-nizar")!=="1"||request.headers.get("content-type")?.split(";")[0]!=="application/json"||!request.body)return refuse(403,"INVALID_REQUEST");
  if((request.headers.get("cookie")??"").split(";").some(v=>/^__Host-bsr-(?:parent-test|student|student-proof)=.+/.test(v.trim())))return refuse(403,"MIXED_SESSION");
  const provided=request.headers.get("x-stem-nizar-operator")??"";
  if(!/^[a-f0-9]{64}$/.test(provided)||!timingSafeEqual(Buffer.from(provided,"hex"),Buffer.from(env.NIZAR_FIXTURE_OPERATOR_KEY,"hex")))return refuse(403,"NOT_AUTHORIZED");
  let data;try{data=await readBody(request);}catch{return refuse(400,"INVALID_INPUT");}
  if(data?.action==="fixtures"&&Object.keys(data).length===1)return reply(200,{ok:true,status:"FIXTURES",families:fixtures.map((p,i)=>({index:i,name:p.name,children:p.children.map(c=>({id:c.id,name:c.name}))}))});
  if(!data||typeof data!=="object"||Array.isArray(data)||!Number.isInteger(data.family)||!fixtures[data.family])return refuse(400,"INVALID_INPUT");
  const {family,...input}=data;
  const resolveChild=async(actor,childId)=>{const p=fixtures[actor],c=p?.children.find(c=>c.id===childId);return c?{parentId:p.parentId,childId:c.id,stateVersion:"fictional-v1"}:null;};
  const readEligibility=async o=>({membership:fixtures.find(p=>p.parentId===o.parentId)?.children.find(c=>c.id===o.childId)?.paid?"active":"inactive",deposit:"clear"});
  try{
   const repository=repositoryFactory(env);
   const execute=createBookingService({repository,resolveChild,readEligibility,clock});
   const n4=createN4Service({repository,resolveChild,readEligibility,clock,readOwner:async(childId,parentId)=>resolveChild(fixtures.findIndex(p=>p.parentId===parentId),childId),readAttendance:async()=>null,verifyEvent:async()=>null});
   // Fictional fixture can exercise waitlist/reminders only; no payment/no-show facts accepted.
   let result;
   if(input.action==="fixture-tick"&&Object.keys(input).length===1)result=await n4.tick();
   else if(typeof input.action==="string"&&input.action.startsWith("waitlist-"))result=await n4.waitlist(input,family);
   else result=await execute(input,family);
   return reply(result.ok?200:result.status==="NOT_AUTHORIZED"?403:result.status==="INVALID_INPUT"?400:result.status==="SCHEDULING_UNAVAILABLE"||result.status==="COMMIT_UNCONFIRMED"?503:409,result);
  }catch{return refuse(503,"SCHEDULING_UNAVAILABLE");}
 };
}
export const handleNizarFixture=createNizarFixtureHttp();
