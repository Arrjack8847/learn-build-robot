// Individually issued, high-entropy development staff capabilities; no shared-key fallback.
import {createHash,timingSafeEqual} from "node:crypto";
import {runtimeEnabled,mixed} from "./http-utils.mjs";
const permissions=["schedule:read","schedule:walk-in","schedule:attendance","schedule:excuse","finance:refund","finance:read","reports:export"];
const digest=value=>createHash("sha256").update(value,"utf8").digest("hex");
const hex=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
export function staffRoster(env){
 if(!runtimeEnabled(env)||env.COMBINED_STAFF_ENABLED!=="1")return [];
 try{
  const raw=env.COMBINED_STAFF_ROSTER_JSON;
  if(typeof raw!=="string"||raw.length>16000)return [];
  const rows=JSON.parse(raw);
  if(!Array.isArray(rows)||!rows.length||rows.length>20)return [];
  const ids=new Set(),hashes=new Set();
  for(const r of rows){
   if(!r||Object.keys(r).length!==5||!["staffId","name","keyDigest","enabled","permissions"].every(k=>Object.hasOwn(r,k))||typeof r.staffId!=="string"||!/^staff-[a-z0-9-]{10,64}$/.test(r.staffId)||typeof r.name!=="string"||!r.name.trim()||r.name!==r.name.trim()||r.name.length>80||/[\x00-\x1f\x7f]/.test(r.name)||!hex(r.keyDigest)||typeof r.enabled!=="boolean"||!Array.isArray(r.permissions)||!r.permissions.includes("schedule:read")||r.permissions.some(p=>!permissions.includes(p))||new Set(r.permissions).size!==r.permissions.length||ids.has(r.staffId)||hashes.has(r.keyDigest))return [];
   ids.add(r.staffId);hashes.add(r.keyDigest);
  }
  const otherKeys=["COMBINED_AUTH_ROOT","COMBINED_STAFF_KEY","COMBINED_WORKER_KEY","COMBINED_CODE_SECRET","COMBINED_MEMBERSHIP_WORKER_SECRET","J12345_AUTH_ROOT","J1234_AUTH_ROOT","J12345_TEST_OPERATOR_SECRET","J1234_TEST_OPERATOR_SECRET","J123_MEMBERSHIP_WORKER_SECRET","J12345_MEMBERSHIP_WORKER_SECRET","PARENT_AUTH_SECRET","STUDENT_AUTH_SECRET","NIZAR_FIXTURE_OPERATOR_KEY","NIZAR_STAFF_FIXTURE_KEY"];
  const forbidden=new Set(otherKeys.flatMap(k=>typeof env[k]==="string"&&env[k]?[digest(env[k].toLowerCase())]:[]));
  if(rows.some(r=>forbidden.has(r.keyDigest)))return [];
  return rows;
 }catch{return [];}
}
export function createCombinedStaffResolver(env){
 return async request=>{
  if(!request||mixed(request))return null;
  const key=request.headers.get("x-stem-combined-staff")??"";
  if(!hex(key)||new Set(Buffer.from(key,"hex")).size<16)return null;
  const proof=Buffer.from(digest(key),"hex");
  let match=null;
  for(const r of staffRoster(env)){
   if(timingSafeEqual(proof,Buffer.from(r.keyDigest,"hex"))&&r.enabled)match=r;
  }
  if(!match)return null;
  return {staffId:match.staffId,name:match.name,version:digest(JSON.stringify(match)),permissions:[...match.permissions]};
 };
}
