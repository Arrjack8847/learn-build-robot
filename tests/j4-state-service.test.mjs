import test from "node:test";
import {createJ4StateService} from "../scripts/staff/j4-state-service.mjs";
import {createJ4Fixtures} from "../scripts/staff/j4-fixtures.mjs";
async function checkState(create,seed){
 const assert=(v,m)=>{if(!v)throw Error(m);};let sequence=0;
 let state={...seed(),mode:"j4-fixture-v1",stateVersion:"initial"};
 const clone=x=>JSON.parse(JSON.stringify(x));
 const store={readStrong:async()=>clone(state),compareAndSet:async(v,n)=>{if(state.stateVersion!==v)return false;state=clone(n);return true;}};
 const tokens=new Map();const crypto={newId:()=>`id-${++sequence}`,newToken:()=>String(++sequence).padStart(43,"a"),staffSessionDigest:t=>{if(!tokens.has(t))tokens.set(t,String(++sequence).padStart(64,"0"));return tokens.get(t);},verifyPassword:async(u,p)=>p==="fixture-only-password-"+u};
 const clock={now:()=>Date.parse("2026-11-26T12:00:00+08:00"),localDay:()=>"2026-11-26"};
 const svc=create({store,crypto,clock}),results=[];
 const login=async id=>{const a=await svc.signIn({username:id,password:"fixture-only-password-"+id});assert(a.ok,"sign in");return {headers:{get:()=>a.cookie.split(";")[0]}};};
 const admin=await login("qa-j4-staff-1"), staff=await login("qa-j4-staff-2"), finance=await login("qa-j4-staff-3");
 assert((await svc.resolve(admin)).role==="admin"&&(await svc.resolve(staff)).role==="staff"&&(await svc.resolve(finance)).role==="finance","roles");results.push("three independent staff sessions");
 const cmd={bookingId:"qa-j4-booking-5",action:"mark-present",requestId:"request-123456",reason:"fixture arrival"};
 assert(!(await svc.attendance(finance,cmd)).ok,"finance wrote attendance");
 const pair=await Promise.all([svc.attendance(staff,cmd),svc.attendance(staff,cmd)]);
 assert(pair.every(x=>x.ok)&&pair[0].auditId===pair[1].auditId&&state.audit.filter(x=>x.requestId===cmd.requestId).length===1,"concurrency");results.push("concurrent duplicate attendance commits once");
 assert(!(await svc.attendance(staff,{...cmd,bookingId:"qa-j4-booking-2",requestId:"request-234567"})).ok,"unpaid student");results.push("inactive membership refused");
 const checkout=await svc.attendance(staff,{...cmd,action:"check-out",requestId:"request-345678"});assert(checkout.ok&&state.students[4].checkInStatus==="not-checked-in","checkout");results.push("checkout and student status atomic");
 assert(!(await svc.manageStaff(staff,{staffId:"qa-j4-staff-3",accountStatus:"inactive",reason:"fixture status test"})).ok,"unauthorized account mutation");
 assert((await svc.manageStaff(admin,{staffId:"qa-j4-staff-3",accountStatus:"inactive",reason:"fixture status test"})).ok&&!await svc.resolve(finance),"deactivation");results.push("admin deactivation invalidates finance session");
 assert((await svc.logout(staff)).ok&&!await svc.resolve(staff),"logout");results.push("logout revocation");
 for(let i=0;i<6;i++)assert(!(await svc.signIn({username:"qa-j4-staff-1",password:"incorrect-password"})).ok,"bad password");
 assert(state.attempts.filter(x=>x.staffId==="qa-j4-staff-1").length===5,"rate limit");results.push("durable attempt reservation limit");
 return results;
}
test("J4 fixture state service",async()=>{await checkState(createJ4StateService,createJ4Fixtures);});
