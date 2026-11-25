// Tests real billing core with a durable aggregate CAS store and fictional provider evidence.
// No real payment, membership eligibility, or email. The email transport is a capture sink.
import {createBillingCore} from "./j3-core.mjs";
import {signatures} from "./j3-node-transport.mjs";
import {createHmac} from "node:crypto";
export async function runAtomicBillingScenarios(store){
 const env={VERCEL_ENV:"preview",HITPAY_API_BASE_URL:"https://api.sandbox.hit-pay.com",HITPAY_WEBHOOK_SALT:"qa-fixture-not-a-provider-secret",HITPAY_BUSINESS_ID:"qa-business"};
 const now=1795560000000, observations=new Map(), captures=[];
 const core=createBillingCore({env,identity:{},store,provider:{reconcileVerifiedEvent:async e=>observations.get(e.providerEventKey),captureSandboxEmail:async j=>{captures.push(j);return true}},clock:{now:()=>now},ids:{},signatures});
 const results=[], check=(v,n)=>{if(!v)throw Error(n);results.push(n);};
 let seq=0;
 function fixture(kind,options={}){
  const raw=Buffer.from(JSON.stringify({id:"qa-event-"+(++seq),business_id:"qa-business"}));
  const key=signatures.digest(raw);
  observations.set(key,{environment:"sandbox",businessId:"qa-business",eventKey:key,subscriptionId:"qa-subscription",paymentId:"qa-charge-1",amountMinor:36000,currency:"MYR",coveredMonth:"2026-11",periodEndAt:now+86400000,occurredAt:now,cycleNumber:1,kind,...options});
  return {key,raw,sig:createHmac("sha256",env.HITPAY_WEBHOOK_SALT).update(raw).digest("hex")};
 }
 const receive=e=>core.receive(e.raw,e.sig,"charge","created");
 await store.initialize();
 let e=fixture("paid");
 check((await core.receive(e.raw,"0".repeat(64),"charge","created")).error==="INVALID_SIGNATURE","forged event rejected");
 check((await receive(e)).ok&&(await store.read()).membership.paymentStatus==="unpaid","signed event alone stays unpaid");
 const before=await store.read();
 try{await store.transaction(async tx=>{await tx.patchMembership("qa-membership",{paymentStatus:"paid"});throw Error("intentional rollback")});}catch(err){if(err.message!=="intentional rollback")throw err;}
 check(JSON.stringify(before)===JSON.stringify(await store.read()),"failed transaction rolls back");
 const duplicates=await Promise.all([core.reconcile(e.key),core.reconcile(e.key)]);
 const paid=await store.read();
 check(duplicates.some(x=>x.status==="paid")&&duplicates.some(x=>x.status==="duplicate")&&paid.membership.paymentStatus==="paid"&&Object.keys(paid.payments).length===1&&Object.keys(paid.outbox).length===1&&paid.events[e.key].processingStatus==="processed","concurrent verified fixture commits exactly once");
 check((await core.deliverOne()).status==="captured"&&(await core.deliverOne()).status==="empty"&&captures.length===1&&captures[0].to==="qa-parent@example.invalid","confirmation captured once from committed ledger");
 e=fixture("paid",{subscriptionId:"wrong-subscription",paymentId:"qa-wrong-charge",occurredAt:now+1});await receive(e);
 check((await core.reconcile(e.key)).error==="UNMATCHED_SUBSCRIPTION","wrong subscription denied");
 e=fixture("failed",{paymentId:"qa-charge-2",cycleNumber:2,coveredMonth:"2026-12",occurredAt:now+2});await receive(e);
 check((await core.reconcile(e.key)).status==="failed"&&(await store.read()).membership.paymentStatus==="unpaid","failed renewal makes fixture unpaid");
 check((await core.deliverOne()).status==="captured"&&captures.length===2,"failed payment notice captured");
 e=fixture("paid",{paymentId:"qa-charge-2",cycleNumber:2,coveredMonth:"2026-12",occurredAt:now+3});await receive(e);
 check((await core.reconcile(e.key)).status==="paid"&&(await store.read()).membership.paidThroughMonth==="2026-12","successful renewal advances paid-through");
 e=fixture("refunded",{paymentId:"qa-charge-2",cycleNumber:2,coveredMonth:"2026-12",occurredAt:now+4});await receive(e);
 check((await core.reconcile(e.key)).status==="refunded"&&(await store.read()).membership.paymentStatus==="unpaid","matching refund disables paid status");
 e=fixture("cancelled",{cycleNumber:2,occurredAt:now+5});await receive(e);
 check((await core.reconcile(e.key)).status==="cancelled"&&(await store.read()).membership.subscriptionStatus==="cancelled","cancellation blocks fixture eligibility");
 return results;
}
