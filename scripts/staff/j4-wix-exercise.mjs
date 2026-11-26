// Only fictional data, never a production staff authorization adapter.
import {createHmac,randomBytes,randomInt,timingSafeEqual} from "node:crypto";
import {createJ4StateService} from "./j4-state-service.mjs";
import {createFixtureReadStore,calculateFixtureOverview} from "./j4-fixtures.mjs";
import {createStaffReadService} from "./read-service.mjs";
import {createJ4SimulatedReport} from "./j4-simulated-report.mjs";
export const J4_BRANCH="feat/j4-private-staff-admin-20261126";
export const J4_SITE="09d613aa-3a95-42ff-9ee3-2aa0c706c447";
export function fixtureEnabled(env){return env.VERCEL_ENV==="preview"&&env.VERCEL_TARGET_ENV!=="production"&&env.VERCEL_GIT_COMMIT_REF===J4_BRANCH&&env.J4_FIXTURE_WIX_ENABLED==="1"&&env.WIX_DEV_SITE_ID===J4_SITE&&!!env.WIX_DEV_DATA_API_KEY?.trim();}
export function fixtureStoreEnv(env){
 if(!fixtureEnabled(env))throw Error("J4_FIXTURE_DISABLED");
 // Reuse the already provisioned development-only credential inside the server.
 // The adapter pins a single site, collection and item. No credential is exposed.
 return {...env,J4_PRIVATE_ENABLED:"1",J4_WIX_SITE_ID:J4_SITE,J4_WIX_DATA_API_KEY:env.WIX_DEV_DATA_API_KEY};
}
export function makeFixtureCrypto(key){
 if(!/^[a-f0-9]{64}$/.test(key??""))throw Error("J4_FIXTURE_KEY_REQUIRED");
 return {newId:()=>randomBytes(16).toString("hex"),newCheckInCode:()=>String(randomInt(100000000)).padStart(8,"0"),checkInDigest:(scope,code)=>createHmac("sha256",Buffer.from(key,"hex")).update(JSON.stringify(["j4-fixture-only",scope,code])).digest("hex"),equalDigest:(a,b)=>/^[a-f0-9]{64}$/.test(a??"")&&/^[a-f0-9]{64}$/.test(b??"")&&timingSafeEqual(Buffer.from(a,"hex"),Buffer.from(b,"hex"))};
}
// Upgrade existing isolated snapshot once, without resetting its records or audit history.
export async function ensureFixtureKey(store){
 for(let i=0;i<6;i++){
  const state=await store.readStrong();
  if(!state||state.mode!=="j4-fixture-v1")throw Error("J4_FIXTURE_MISSING");
  if(state.fixtureCodeKey)return state;
  if(state.codes.length||state.sessions.length)throw Error("J4_LEGACY_FIXTURE_REVIEW_REQUIRED");
  const next={...state,fixtureCodeKey:randomBytes(32).toString("hex"),stateVersion:randomBytes(16).toString("hex")};
  if(!Object.hasOwn(next,"learningVisits"))next.learningVisits=state.attendance.filter(b=>b.studentId==="qa-j4-student-1"&&b.status==="attended"&&!b.checkOutAt).map(b=>({studentId:b.studentId,bookingId:b.bookingId,sessionDate:b.sessionDate,status:"learning"}));
  if(await store.compareAndSet(state.stateVersion,next))return next;
 }
 throw Error("J4_FIXTURE_RETRY");
}
export function createJ4WixExercise({store,clock}){
 return async (action,input,simulatedId)=>{
  if(typeof simulatedId!=="string"||!/^qa-j4-staff-[1-3]$/.test(simulatedId))return {ok:false,status:"REFUSED"};
  const snapshot=await ensureFixtureKey(store);
  const service=createJ4StateService({store,clock,crypto:makeFixtureCrypto(snapshot.fixtureCodeKey),fixtureActorId:simulatedId});
  const actor=await service.resolve(null);
  if(!actor)return {ok:false,status:"FIXTURE_ROLE_UNAVAILABLE"};
  if(action==="session"||action==="choose-fixture-role")return {ok:true,status:"READY",actor:{staffId:actor.staffId,displayName:actor.displayName,role:actor.role},storage:"wix-fixture"};
  if(action==="attendance")return service.attendance(null,input);
  if(action==="staff-status")return service.manageStaff(null,input);
  if(action==="check-in-code")return service.checkInCode(null,input);
  const fresh=await store.readStrong();
  const current=fresh?.staff.find(s=>s.staffId===simulatedId);
  if(!current||current.accountStatus!=="active"||current.role!==actor.role)return {ok:false,status:"FIXTURE_ROLE_UNAVAILABLE"};
  // All resource reads in this response use one immutable, strongly read version.
  const fixedActor={...actor,expiresAt:clock.now()+60000};
  if(action==="overview")return {ok:true,status:"READY",metrics:calculateFixtureOverview(fresh,actor.role,clock.localDay()),fixture:true,storage:"wix-fixture"};
  if(action==="simulated-report")return ["admin","finance"].includes(actor.role)?createJ4SimulatedReport(fresh,input.month):{ok:false,status:"REFUSED"};
  const read=createStaffReadService({identity:{resolveStaff:async()=>fixedActor},store:createFixtureReadStore(fresh,clock.now()),clock});
  if(action==="list"){const result=await read.list(null,input.resource,input.query??{});return {...result};}
  if(action==="student")return read.student(null,input.studentId);
  if(action==="student-profile"){
   const student=await read.student(null,input.studentId);if(!student.ok)return student;
   const resources=actor.role==="admin"?["memberships","attendance","checkins","progress","payments","deposits"]:["memberships","attendance","checkins","progress"];
   const pairs=await Promise.all(resources.map(async resource=>[resource,await read.list(null,resource,{page:1,pageSize:50,filters:{studentId:input.studentId}})]));
   if(pairs.some(([,p])=>!p.ok||p.total!==p.rows.length))return {ok:false,status:"PROFILE_UNCONFIRMED"};
   return {...student,related:Object.fromEntries(pairs.map(([key,p])=>[key,p.rows]))};
  }
  return {ok:false,status:"NOT_FOUND"};
 };
}
