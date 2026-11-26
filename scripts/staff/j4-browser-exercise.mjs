// J4 standalone browser exercise. No credentials, network, real records or durable claims.
// Every identity and operation in this module is deliberately synthetic.
import {createJ4Fixtures,createFixtureReadStore,calculateFixtureOverview} from "./j4-fixtures.mjs";
import {createJ4StateService} from "./j4-state-service.mjs";
import {createStaffReadService} from "./read-service.mjs";
import {createJ4SimulatedReport} from "./j4-simulated-report.mjs";
export function createJ4BrowserExercise({random,now=()=>Date.now()}){
 const clone=x=>JSON.parse(JSON.stringify(x));
 const localDay=()=>new Date(now()+8*3600000).toISOString().slice(0,10);
 const clock={now,localDay};
 const hex=n=>Array.from(random.getRandomValues(new Uint8Array(n)),x=>x.toString(16).padStart(2,"0")).join("");
 const ids=["qa-j4-staff-1","qa-j4-staff-2","qa-j4-staff-3"];
 let state={...createJ4Fixtures(localDay()),mode:"j4-fixture-v1",stateVersion:hex(16)};
 // Rebase only fictional active membership dates to the exercise date.
 const valid=new Date(localDay()+"T00:00:00Z");valid.setUTCDate(valid.getUTCDate()+25);
 for(const m of state.memberships)if(m.status==="active")m.validUntil=valid.toISOString().slice(0,10);
 const store={readStrong:async()=>clone(state),compareAndSet:async(v,n)=>{if(v!==state.stateVersion)return false;state=clone(n);return true;}};
 // Opaque lookup values only for the browser exercise; never use this as real credential hashing.
 const fingerprints=new Map();
 const fingerprint=(key)=>{if(!fingerprints.has(key))fingerprints.set(key,hex(32));return fingerprints.get(key);};
 const crypto={newId:()=>hex(16),staffSessionDigest:t=>fingerprint("simulated-session:"+t),checkInDigest:(scope,code)=>fingerprint(JSON.stringify([scope,code])),equalDigest:(a,b)=>a===b,newCheckInCode:()=>{const x=new Uint32Array(1);do{random.getRandomValues(x);}while(x[0]>=4200000000);return String(x[0]%100000000).padStart(8,"0");}};
 const service=createJ4StateService({store,crypto,clock});
 let selected=ids[0],token="";
 function choose(id){
  const account=state.staff.find(a=>a.staffId===id&&a.accountStatus==="active");
  if(!account||!ids.includes(id))return {ok:false,status:"REFUSED"};
  token=hex(22).slice(0,43);selected=id;
  state.sessions=state.sessions.filter(s=>s.staffId!==id);
  state.sessions.push({sessionDigest:crypto.staffSessionDigest(token),staffId:id,accountType:"staff-test",authVersion:account.authVersion,expiresAt:now()+8*3600000,revokedAt:null});
  state.stateVersion=hex(16);
  return {ok:true,status:"READY",actor:{staffId:id,displayName:account.displayName,role:account.role}};
 }
 choose(selected);
 async function call(action,input={}){
  if(action==="choose-fixture-role")return choose(input.staffId);
  const request={headers:{get:k=>k==="cookie"?"__Host-stem-staff="+token:""}};
  const actor=await service.resolve(request);
  if(!actor)return {ok:false,status:"FIXTURE_ROLE_UNAVAILABLE"};
  if(action==="session")return {ok:true,status:"READY",actor:{staffId:actor.staffId,displayName:actor.displayName,role:actor.role}};
  if(action==="attendance")return service.attendance(request,input);
  if(action==="staff-status")return service.manageStaff(request,input);
  if(action==="check-in-code")return service.checkInCode(request,input);
  const snapshot=await store.readStrong();
  if(action==="overview")return {ok:true,status:"READY",metrics:calculateFixtureOverview(snapshot,actor.role,localDay()),fixture:true};
  if(action==="simulated-report")return ["admin","finance"].includes(actor.role)?createJ4SimulatedReport(snapshot,input.month):{ok:false,status:"REFUSED"};
  const read=createStaffReadService({identity:{resolveStaff:()=>service.resolve(request)},store:createFixtureReadStore(snapshot,now()),clock});
  if(action==="list")return read.list(request,input.resource,input.query??{});
  if(action==="student")return read.student(request,input.studentId);
  return {ok:false,status:"NOT_FOUND"};
 }
 return {call};
}
