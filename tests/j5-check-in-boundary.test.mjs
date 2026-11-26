import {test} from "node:test";
import {createCheckInBoundary} from "../scripts/j5/check-in-boundary.mjs";
function checkInCases(){
 const request={method:"POST",sameOrigin:true},env={VERCEL_ENV:"preview"},body={code:"00123456"};
 function make(){
 const state={session:{role:"student",studentId:"a",environment:"private-preview"},result:{ok:true,studentId:"a",environment:"private-preview",attendanceCommitted:true,accessStatus:"verified",bookingId:"booking-a",validUntil:3000},calls:0,seen:null};
 const service=createCheckInBoundary({resolveStudent:async()=>state.session,redeemAtomic:async r=>{state.calls++;state.seen=r;return state.result},clock:{now:()=>2000}});
 return {state,service};
 }
 const eq=(a,b)=>{if(a!==b)throw Error(`Expected ${b}, got ${a}`)};
 const run=(f,r=request,e=env,b=body)=>f.service.verify(r,e,b);
 return [
 ["eight-digit leading zero retained",async()=>{let f=make(),r=await run(f);eq(r.ok,true);eq(f.state.seen.code,"00123456");eq(f.state.seen.studentId,"a");eq("bookingId" in r,false);eq("rawCode" in r,false)}],
 ["wrong, expired and exhausted generic",async()=>{for(const code of ["WRONG","EXPIRED","EXHAUSTED","REVOKED"]){let f=make();f.state.result={ok:false,code};eq((await run(f)).code,"CHECK_IN_REFUSED")}}],
 ["no browser identity",async()=>{let f=make();eq((await run(f,request,env,{code:body.code,studentId:"b"})).status,400);eq(f.state.calls,0)}],
 ["bad length",async()=>{let f=make();eq((await run(f,request,env,{code:"1234"})).status,400);eq(f.state.calls,0)}],
 ["cross-origin",async()=>{let f=make();eq((await run(f,{method:"POST",sameOrigin:false})).status,403);eq(f.state.calls,0)}],
 ["GET denied",async()=>{let f=make();eq((await run(f,{method:"GET",sameOrigin:true})).status,403);eq(f.state.calls,0)}],
 ["anonymous denied",async()=>{let f=make();f.state.session=null;eq((await run(f)).status,401);eq(f.state.calls,0)}],
 ["payer denied",async()=>{let f=make();f.state.session.role="payer";eq((await run(f)).status,401);eq(f.state.calls,0)}],
 ["production denied",async()=>{let f=make();eq((await run(f,request,{VERCEL_ENV:"production"})).status,403);eq(f.state.calls,0)}],
 ["foreign student response denied",async()=>{let f=make();f.state.result.studentId="b";eq((await run(f)).ok,false)}],
 ["uncommitted attendance denied",async()=>{let f=make();f.state.result.attendanceCommitted=false;eq((await run(f)).ok,false)}],
 ["expired result denied",async()=>{let f=make();f.state.result.validUntil=2000;eq((await run(f)).ok,false)}],
 ["missing adapter fails closed",async()=>{let f=make(),s=createCheckInBoundary({resolveStudent:async()=>f.state.session,clock:{now:()=>2000}});eq((await s.verify(request,env,body)).status,503)}],
 ["service error no credential leak",async()=>{let f=make(),s=createCheckInBoundary({resolveStudent:async()=>f.state.session,redeemAtomic:async()=>{throw Error(body.code)},clock:{now:()=>2000}});let r=await s.verify(request,env,body);eq(r.code,"CHECK_IN_UNAVAILABLE");eq(JSON.stringify(r).includes(body.code),false)}],
 ["revocation after redeem denied",async()=>{let f=make(),calls=0,s=createCheckInBoundary({resolveStudent:async()=>++calls===1?f.state.session:null,redeemAtomic:async()=>f.state.result,clock:{now:()=>2000}});eq((await s.verify(request,env,body)).status,401)}]
 ];
}
for(const [name,run] of checkInCases())test(name,run);
