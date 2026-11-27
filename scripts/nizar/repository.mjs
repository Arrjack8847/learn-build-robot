// Bounded private test aggregate; no automatic migration or production capability.
// Conditional replacement is atomic at one Wix item; never split capacity and child limits into separate writes.
import {randomUUID} from "node:crypto";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {enabled,COLLECTION,RECORD_ID,validateBooking} from "./contract.mjs";
import {POLICY} from "./policy.mjs";
import {validateN4} from "./automation-state.mjs";
import {validateN5} from "./staff-state.mjs";
import {validateCheckins} from "../combined/checkin-state.mjs";
import {combinedRepositoryEnabled,COMBINED_RECORD,COMBINED_SCOPE} from "../combined/scope.mjs";
const MAX_BYTES=200000,MAX_ROWS=1000;
const fixtureScope="nizar-scheduling-preview-v1";
const empty=scope=>({scope,bookings:[],commands:[]});
const occupying=b=>["booked","attended","checked-out","held-unpaid","no-show","excused"].includes(b.bookingStatus);
function validate(s,scope){
 if(s?.scope!==scope||Object.keys(s).some(k=>!["scope","bookings","commands","n4","n5","checkins"].includes(k))||!Array.isArray(s.bookings)||s.bookings.length>MAX_ROWS||s.bookings.some(b=>!validateBooking(b)))throw Error("INVALID_SCHEDULE");
 const commands=s.commands??[];
 if(!Array.isArray(commands)||commands.length>2000||commands.some(c=>!c||Object.keys(c).length!==4||!["key","fingerprint","bookingId","at"].every(k=>Object.hasOwn(c,k))||! /^[a-f0-9]{64}$/.test(c.key??"")||! /^[a-f0-9]{64}$/.test(c.fingerprint??"")||typeof c.bookingId!=="string"||!Number.isSafeInteger(c.at)||c.at<=0)||new Set(commands.map(c=>c.key)).size!==commands.length)throw Error("INVALID_COMMANDS");
 const ids=new Set(),days=new Set(),slots=new Map();
 for(const b of s.bookings){
  if(ids.has(b.bookingId))throw Error("DUPLICATE_BOOKING");ids.add(b.bookingId);
  if(!occupying(b))continue;
  const day=b.childId+"/"+b.day,key=b.activity+"/"+b.startAt;
  if(days.has(day))throw Error("DAILY_LIMIT");days.add(day);
  const count=(slots.get(key)??0)+1;if(count>POLICY.capacityPerActivity)throw Error("CAPACITY");slots.set(key,count);
 }
 if(commands.some(c=>!ids.has(c.bookingId)))throw Error("ORPHAN_COMMAND");
 validateN4(s);validateN5(s);validateCheckins(s);
 const json=JSON.stringify(s);if(Buffer.byteLength(json)>MAX_BYTES)throw Error("SCHEDULE_LIMIT");
 return json;
}
export function createSchedulingRepository({env,db,storeFactory=createWixStore,newId=randomUUID,clock=Date.now}){
 const combined=combinedRepositoryEnabled(env);
 if(!enabled(env)&&!combined)throw Error("SCHEDULING_DISABLED");
 const scope=combined?COMBINED_SCOPE:fixtureScope,recordId=combined?COMBINED_RECORD:RECORD_ID;
 const storage=db??storeFactory(env);
 async function read(){
  const row=await storage.get(COLLECTION,recordId);
  if(!row)return {version:null,state:empty(scope)};
  if(row.environment!=="private-preview"||typeof row.stateVersion!=="string"||!row.stateVersion||typeof row.stateJson!=="string"||Buffer.byteLength(row.stateJson)>MAX_BYTES)throw Error("INVALID_SCHEDULE_ROW");
  const state=JSON.parse(row.stateJson);validate(state,scope);
  return {version:row.stateVersion,state};
 }
 return {read,async compareAndSet(expected,state){
  const stateJson=validate(state,scope),stateVersion=newId(),now=clock();
  if(!Number.isSafeInteger(now)||now<=0)throw Error("INVALID_CLOCK");
  const upcoming=new Map();
  for(const b of state.bookings){
   if(b.createdAt>now||b.updatedAt>now)throw Error("FUTURE_RECORD");
   if(!["booked","held-unpaid"].includes(b.bookingStatus)||b.startAt<=now)continue;
   const count=(upcoming.get(b.childId)??0)+1;
   if(count>POLICY.maxUpcoming)throw Error("UPCOMING_LIMIT");
   upcoming.set(b.childId,count);
  }
  if(typeof stateVersion!=="string"||!stateVersion||stateVersion===expected)throw Error("INVALID_VERSION");
  const next={environment:"private-preview",stateVersion,stateJson};
  let won,saved;
  try{won=expected===null?await storage.insert(COLLECTION,recordId,next):await storage.replaceIfVersion(COLLECTION,recordId,expected,next);
   if(won===false)return {status:"conflict"};
   if(won!==true)return {status:"unconfirmed"};
   saved=await storage.get(COLLECTION,recordId);
  }catch{return {status:"unconfirmed"};}
  // Another writer may supersede the revision before readback. Never report an uncertain write as failure or retry it blindly.
  if(saved?.stateVersion!==stateVersion||saved.stateJson!==stateJson)return {status:"unconfirmed"};
  return {status:"committed",version:stateVersion};
 }};
}
