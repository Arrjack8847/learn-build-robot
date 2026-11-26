import test from "node:test";
import {createStaffSessionBoundary} from "../scripts/staff/session-boundary.mjs";
async function checkStaffSession(create){
 const assert=(v,m)=>{if(!v)throw Error(m);};
 const token="a".repeat(43), digest="b".repeat(64),now=1234;
 const req=value=>({headers:{get:key=>key==="cookie"?value:null}});
 const env={VERCEL_ENV:"preview"};
 const account={staffId:"qa-j4-staff-1",accountType:"staff-test",accountStatus:"active",role:"staff",displayName:"Fictional staff",authVersion:"v1"};
 const session={sessionDigest:digest,accountType:"staff-test",staffId:account.staffId,authVersion:"v1",expiresAt:now+1000,revokedAt:null};
 let stored={...session},current={...account},reads=0;
 const store={readStaffSession:async()=>{reads++;return stored;},readStaffAccount:async()=>current,revokeStaffSessionAudited:async()=>{stored={...stored,revokedAt:now};return {committed:true};}};
 const deps={env,store,crypto:{staffSessionDigest:t=>{assert(t===token,"unexpected token");return digest;}},clock:{now:()=>now}};
 const service=create(deps), request=req("__Host-stem-staff="+token);
 const results=[];
 async function test(name,fn){await fn();results.push(name);}
 await test("production construction rejected",async()=>{let denied=false;try{create({...deps,env:{VERCEL_ENV:"production"}});}catch{denied=true;}assert(denied,"production enabled");});
 await test("missing, parent and duplicate cookie denied before storage",async()=>{for(const value of [null,"parent="+token,"__Host-stem-staff=bad","__Host-stem-staff="+token+"; __Host-stem-staff="+token])assert(!await service.resolveStaff(req(value)),"bad cookie accepted");assert(reads===0,"unexpected storage access");});
 await test("active individual staff session resolved",async()=>{const a=await service.resolveStaff(request);assert(a?.role==="staff"&&a.staffId===account.staffId&&a.subjectType==="staff","valid session rejected");});
 await test("parent session, expiry and revoked session denied",async()=>{for(const update of [{accountType:"parent-test"},{expiresAt:now},{revokedAt:1}]){stored={...session,...update};assert(!await service.resolveStaff(request),"invalid session accepted");}stored={...session};});
 await test("account deactivation and role version invalidation",async()=>{for(const update of [{accountStatus:"inactive"},{authVersion:"v2"},{role:"parent"},{accountType:"student-test"}]){current={...account,...update};assert(!await service.resolveStaff(request),"invalid account accepted");}current={...account};});
 await test("logout revokes and clears cookie; replay denied",async()=>{const r=await service.logout(request);assert(r.ok&&r.cookie.includes("HttpOnly")&&r.cookie.includes("Secure")&&r.cookie.includes("Max-Age=0"),"bad logout");assert(!await service.resolveStaff(request),"revoked token replayed");});
 return results;
}
test("J4 staff session boundary",async()=>{await checkStaffSession(createStaffSessionBoundary);});
