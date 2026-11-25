// Fictional integration scenarios. Run: node tests/hitpay-j3.test.mjs
import {createBillingCore} from "../scripts/hitpay/j3-core.mjs";
async function runScenarios(createBillingCore){
  const env={VERCEL_ENV:"preview",HITPAY_API_BASE_URL:"https://api.sandbox.hit-pay.com",HITPAY_WEBHOOK_SALT:"fixture-salt",HITPAY_BUSINESS_ID:"fixture-business"};
  const events=new Map(),payments=new Map(),outbox=new Map(),observations=new Map(),rawBodies=new Map(),captured=[];
  let membership={id:"membership-1",environment:"sandbox",parentId:"parent-a",childId:"child-a",providerSubscriptionId:"sub-1",paymentStatus:"unpaid",subscriptionStatus:"active"};
  let reserved=null,posts=0,seq=0,consent=true,queue=Promise.resolve();
  const now=1795560000000;
  const parent={accountType:"parent",parentId:"parent-a",emailVerified:true,email:"parent@example.invalid"};
  const tx={
    getEvent:async k=>events.get(k),getMembershipBySubscription:async(e,s)=>e==="sandbox"&&s===membership.providerSubscriptionId?{...membership}:null,
    getPayment:async(e,k)=>payments.get(e+":"+k),
    putPaymentOnceOrTransition:async(p,prev)=>{const k=p.environment+":"+p.id;if((payments.get(k)?.status??null)!==prev)throw Error("conflict");payments.set(k,p);},
    patchMembership:async(id,p)=>{if(id!==membership.id)throw Error("wrong membership");membership={...membership,...p};},
    insertOutboxOnce:async job=>{if(!outbox.has(job.deduplicationKey))outbox.set(job.deduplicationKey,{...job});},
    completeEvent:async(k,outcome)=>{events.set(k,{...events.get(k),processingStatus:"processed",outcome});}
  };
  // Serialized mock transaction; not an implementation of Wix atomic persistence.
  const store={
    getOwnedActiveChild:async(p,c)=>p==="parent-a"&&c==="child-a"?{parentId:p,childId:c}:null,
    reserveCheckout:async attempt=>{if(reserved)return {created:false,attempt:reserved};reserved={...attempt,id:"attempt-1"};return {created:true,attempt:reserved};},
    bindCheckoutOnce:async(id,s)=>id==="attempt-1"&&s==="sub-1",
    insertVerifiedEventOnce:async e=>{if(!events.has(e.providerEventKey))events.set(e.providerEventKey,{...e});return events.get(e.providerEventKey);},
    getVerifiedEventStrong:async k=>events.get(k),
    transaction:fn=>{const p=queue.then(()=>fn(tx));queue=p.catch(()=>{});return p;},
    claimPendingEmail:async()=>{const j=[...outbox.values()].find(x=>x.status==="pending");if(j){j.status="claimed";return {...j};}return null;},
    getCommittedEmailDetails:async j=>{const p=payments.get("sandbox:"+j.paymentId);return p?{...p,paymentId:p.id,email:parent.email,childName:"Sample Child"}:null;},
    markEmailReview:async k=>{outbox.get(k).status="review";},
    markEmailCaptured:async k=>{outbox.get(k).status="captured";}
  };
  const provider={
    getVerifiedFixturePlan:async()=>({planId:"plan-1",amountMinor:36000,currency:"MYR",cycle:"monthly",chargeCount:2}),
    createHostedSubscription:async()=>{posts++;return {subscriptionId:"sub-1",url:"https://securecheckout.sandbox.hit-pay.com/fixture"};},
    isAllowedCheckoutUrl:url=>url==="https://securecheckout.sandbox.hit-pay.com/fixture",
    reconcileVerifiedEvent:async e=>observations.get(e.providerEventKey),
    captureSandboxEmail:async e=>{captured.push(e);return true;}
  };
  // Signature verification mocked here; real Node HMAC vectors in separate tests.
  const signatures={verify:(raw,sig,salt)=>sig==="a".repeat(64)&&salt==="fixture-salt",decode:raw=>rawBodies.get(raw),digest:raw=>raw.key};
  const deps={env,identity:{resolveParent:async ctx=>ctx,hasCurrentConsentAndTerms:async()=>consent},store,provider,clock:{now:()=>now},ids:{reference:()=>"ref-1"},signatures};
  const svc=createBillingCore(deps),checks=[];
  const check=(condition,label)=>{if(!condition)throw Error(label);checks.push(label);};
  const input={childId:"child-a",requestKey:"request-1"};
  check((await svc.checkout(null,input)).error==="NOT_AUTHORIZED","anonymous checkout refused");
  check((await svc.checkout(parent,{...input,childId:"child-b"})).error==="CHILD_NOT_FOUND","cross-parent checkout refused");
  check((await svc.checkout(parent,{...input,amount:1})).error==="INVALID_INPUT","client price injection refused");
  consent=false;check((await svc.checkout(parent,input)).error==="CONSENT_REQUIRED","missing consent refused");consent=true;
  const cs=await Promise.all([svc.checkout(parent,input),svc.checkout(parent,input)]);
  check(cs.every(x=>x.ok)&&posts===1,"concurrent duplicate checkout makes one provider request");
  check(membership.paymentStatus==="unpaid"&&payments.size===0,"checkout redirect or abandonment does not mark paid");
  check((await createBillingCore({...deps,env:{...env,VERCEL_ENV:"production"}}).checkout(parent,input)).error==="SANDBOX_REQUIRED","production checkout refused");
  const mk=(kind="paid",overrides={},bodyOverrides={})=>{
    const key=(++seq).toString(16).padStart(64,"0");
    const raw={key,byteLength:100};rawBodies.set(raw,JSON.stringify({id:"object-"+seq,business_id:env.HITPAY_BUSINESS_ID,...bodyOverrides}));
    observations.set(key,{kind,environment:"sandbox",businessId:env.HITPAY_BUSINESS_ID,eventKey:key,subscriptionId:"sub-1",paymentId:"charge-1",amountMinor:36000,currency:"MYR",coveredMonth:"2026-11",periodEndAt:now+20000000,occurredAt:now,cycleNumber:1,...overrides});
    return {key,raw};
  };
  const receive=e=>svc.receive(e.raw,"a".repeat(64),"charge","created");
  let e=mk();
  check((await svc.receive(e.raw,"b".repeat(64),"charge","created")).error==="INVALID_SIGNATURE"&&events.size===0,"forged signature rejected before persistence");
  check((await createBillingCore({...deps,env:{...env,HITPAY_WEBHOOK_SALT:""}}).receive(e.raw,"a".repeat(64),"charge","created")).error==="WEBHOOK_NOT_CONFIGURED","API salt cannot substitute for endpoint salt");
  check((await receive(mk("paid",{},{business_id:"another"}))).error==="UNMATCHED_MERCHANT","wrong merchant refused");
  check((await svc.reconcile(e.key)).error==="UNVERIFIED_EVENT","unverified event cannot credit");
  check((await receive(e)).ok&&membership.paymentStatus==="unpaid","signed notification alone does not credit");
  check((await svc.reconcile(e.key)).status==="paid"&&membership.paymentStatus==="paid"&&payments.size===1&&outbox.size===1,"verified payment credits correct child and queues one email");
  await receive(e);const duplicates=await Promise.all([svc.reconcile(e.key),svc.reconcile(e.key)]);
  check(duplicates.every(x=>x.status==="duplicate")&&payments.size===1&&outbox.size===1,"replayed event does not duplicate ledger or email");
  const e2=mk("paid",{occurredAt:now+1});await receive(e2);
  check((await svc.reconcile(e2.key)).status==="duplicate"&&payments.size===1,"different event for same charge is idempotent");
  const wrong=mk("paid",{paymentId:"wrong-amount",amountMinor:1,occurredAt:now+2});await receive(wrong);
  check((await svc.reconcile(wrong.key)).error==="PAYMENT_MISMATCH","wrong amount refused");
  const other=mk("paid",{subscriptionId:"unknown",occurredAt:now+3});await receive(other);
  check((await svc.reconcile(other.key)).error==="UNMATCHED_SUBSCRIPTION","unmapped subscription refused");
  check((await svc.deliverOne()).status==="captured"&&captured.length===1&&captured[0].text.includes("RM360.00")&&captured[0].text.includes("Sample Child"),"confirmation generated from committed ledger");
  check((await svc.deliverOne()).status==="empty","email not duplicated");
  const failed=mk("failed",{paymentId:"charge-2",cycleNumber:2,coveredMonth:"2026-12",occurredAt:now+100});await receive(failed);
  check((await svc.reconcile(failed.key)).status==="failed"&&membership.paymentStatus==="unpaid"&&outbox.size===2,"failed renewal marks unpaid and queues notice");
  check((await svc.deliverOne()).status==="captured"&&captured[1].subject.includes("failed"),"failure notification generated");
  const stale=mk("paid",{occurredAt:now+1});await receive(stale);
  check((await svc.reconcile(stale.key)).error==="STALE_EVENT_REVIEW_REQUIRED"&&membership.paymentStatus==="unpaid","late old event cannot re-enable access");
  const retry=mk("paid",{paymentId:"charge-2",cycleNumber:2,coveredMonth:"2026-12",occurredAt:now+200,periodEndAt:now+40000000});await receive(retry);
  check((await svc.reconcile(retry.key)).status==="paid"&&membership.paidThroughMonth==="2026-12"&&payments.size===2,"successful renewal recovers paid status");
  const cancel=mk("cancelled",{cycleNumber:2,occurredAt:now+300});await receive(cancel);
  check((await svc.reconcile(cancel.key)).status==="cancelled"&&membership.paymentStatus==="unpaid","cancellation disables eligibility in conservative fixture policy");
  const postCancel=mk("paid",{cycleNumber:2,paymentId:"charge-3",occurredAt:now+400});await receive(postCancel);
  check((await svc.reconcile(postCancel.key)).error==="CANCELLED_REVIEW_REQUIRED","post-cancellation charge requires review");
  return checks;
}
const checks=await runScenarios(createBillingCore);
for(const check of checks)console.log("PASS "+check);
console.log(checks.length+" fixture checks passed");
