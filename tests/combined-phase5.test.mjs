import test from "node:test";
import assert from "node:assert/strict";
import {createDepositService} from "../scripts/combined/deposit-service.mjs";
import {validateDeposits} from "../scripts/combined/deposit-state.mjs";
import {createN4Service} from "../scripts/nizar/automation-service.mjs";
import {depositBalance,digest,emptyN4} from "../scripts/nizar/automation-state.mjs";
const childId="qa-j2-"+"a".repeat(64),parentId="qa-j2-"+"b".repeat(64),owner={childId,parentId,stateVersion:"fixture-v1"};
const now=Date.parse("2026-11-27T10:00:00+08:00"),month="2026-11";
function fixture(){
 let version=0,posts=0,fail=false,state={bookings:[{childId,parentId,day:"2026-11-25",bookingStatus:"no-show"},{childId,parentId,day:"2026-11-26",bookingStatus:"no-show"}],n4:emptyN4()};
 const repository={read:async()=>({version:String(version),state:structuredClone(state)}),compareAndSet:async(v,s)=>{if(v!==String(version))return {status:"conflict"};validateDeposits(s);state=structuredClone(s);version++;return {status:"committed"};}};
 const deps={repository,clock:()=>now,resolveChild:async(a,c)=>a==="parent"&&c===childId?owner:null,readOwner:async(c,p)=>c===childId&&p===parentId?owner:null,readEligibility:async()=>({membership:"active",deposit:"clear"})};
 const service=createDepositService({...deps,transport:{create:async()=>{posts++;if(fail)throw Error("UNCERTAIN");return {providerId:"fixture-payment-request-1",url:"https://securecheckout.sandbox.hit-pay.com/test"};}}});
 const automation=createN4Service({...deps,verifyEvent:async e=>e?.verified===true?e:null,readAttendance:async()=>null});
 return {service,automation,repository,posts:()=>posts,fail:()=>fail=true};
}
test("one reservation under concurrent attempts, no credit from checkout return",async()=>{
 const s=fixture(),cmd={childId,requestId:"fixture-deposit-1"};
 assert.equal((await s.service.checkout("other",cmd)).ok,false);
 await Promise.all(Array.from({length:12},(_,i)=>s.service.checkout("parent",{...cmd,requestId:"fixture-deposit-"+i})));
 assert.equal(s.posts(),1);const state=(await s.repository.read()).state;assert.equal(state.deposits.length,1);assert.equal(state.deposits[0].status,"pending");assert.equal(depositBalance(state,childId,month).held,0);
 const r=state.deposits[0],event={verified:true,kind:"deposit-paid",eventId:"e".repeat(64),childId,parentId,at:now,currency:"MYR",amount:5000,depositId:r.id,providerPaymentId:"fixture-charge-1",paymentId:digest(["deposit-charge","fixture-charge-1"])};
 assert.equal((await s.automation.event({...event,verified:false})).ok,false);
 assert.equal((await s.automation.event(event)).ok,true);assert.equal((await s.automation.event(event)).status,"ALREADY_COMMITTED");
 const paid=(await s.repository.read()).state;assert.equal(paid.deposits[0].status,"settled");assert.equal(depositBalance(paid,childId,month).held,5000);assert.equal(paid.n4.ledger.length,1);
});
test("uncertain dispatch is not automatically repeated",async()=>{
 const s=fixture();s.fail();assert.equal((await s.service.checkout("parent",{childId,requestId:"fixture-unknown-1"})).status,"DEPOSIT_RECONCILIATION_PENDING");
 assert.equal((await s.service.checkout("parent",{childId,requestId:"fixture-unknown-2"})).status,"DEPOSIT_RECONCILIATION_PENDING");assert.equal(s.posts(),1);
});
