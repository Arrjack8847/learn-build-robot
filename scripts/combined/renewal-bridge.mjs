// Only signed inbox records, globally bound subscriptions, verified prior billing and authenticated provider reads.
// The failed-charge field mapping is provisional until sandbox acceptance. Never infer a failure from expiry.
import {createMembershipProviderReader,membershipProcessingEnabled} from "../j123/membership-provider.mjs";
import {BILLING_COLLECTION,checkoutKey,decodeCheckout,checkProviderBinding,providerKey,validStudent,validProvider} from "../j123/billing-records.mjs";
import {membershipTermsVersion} from "../j123/infrastructure.mjs";
import {scopeJ1234BillingStore} from "../j1234/billing-scope.mjs";
import {readJ1234BillingProjection} from "../j1234/billing-projection.mjs";
import {dispatchVerifiedMembershipEvent} from "../j123/membership-runtime.mjs";
import {createCombinedPaymentBridge} from "./payment-bridge.mjs";
import {digest,n4} from "../nizar/automation-state.mjs";
const hash=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x),epoch=x=>Number.isSafeInteger(x)?x:Date.parse(typeof x==="string"?x:x?.$date);
const fail=status=>({ok:false,status});
const cycle=(sub,start)=>digest(["renewal-cycle-v1",sub,2,start]);
export async function createRenewalProcessor({env,runtime,providerFactory=createMembershipProviderReader,readBilling=readJ1234BillingProjection,dispatch=dispatchVerifiedMembershipEvent}){
 const db=scopeJ1234BillingStore(runtime.store,env),clock=runtime.clock;
 const enabled=env.COMBINED_PAYMENT_BRIDGE_ENABLED==="1"&&env.COMBINED_FAILED_RENEWAL_ACCEPTED==="1"&&env.COMBINED_FAILED_RENEWAL_SCHEMA==="confirmed_failed_charge_period_v1"&&membershipProcessingEnabled(env);
 async function bound(childId,parentId){
  const owner=await runtime.readOwner(childId,parentId);if(!owner)return null;
  const row=await db.get(BILLING_COLLECTION,checkoutKey(childId));if(!row)return null;
  const state=decodeCheckout(row,childId),r=state.reservation;
  if(r.parentId!==parentId||r.status!=="bound"||r.termsVersion!==membershipTermsVersion(env)||!await checkProviderBinding(db,"subscription",r.providerId,r))return null;
  const ledger=await readBilling({env,db:runtime.store,studentId:childId,parentId,now:clock()});
  if(!Array.isArray(ledger.payments)||!ledger.payments.length||ledger.paymentStatus!=="verified")return null;
  if((await db.get(BILLING_COLLECTION,checkoutKey(childId)))?.stateVersion!==row.stateVersion)return null;
  return {r,ledger,state};
 }
 async function recover(childId,parentId){
  const snap=await runtime.repository.read(),hold=n4(snap.state).holds.find(h=>h.childId===childId&&h.parentId===parentId&&h.status!=="restored");
  if(!hold)return {ok:true,status:"NO_HOLD"};
  const b=await bound(childId,parentId),p=b?.state.payments?.find(x=>x.cycleNumber===2),v=b?.ledger.payments?.find(x=>x.cycleNumber===2);
  if(!p||!v||b.ledger.membershipStatus!=="active"||p.providerPaymentId!==v.paymentId||!hash(p.eventKey)||hold.cycleId!==cycle(b.r.providerId,p.periodStartAt)||p.paidAt<hold.failedAt)return fail("RECOVERY_PENDING");
  const evidence={kind:"renewal-paid",eventId:p.eventKey,childId,parentId,cycleId:hold.cycleId,at:p.paidAt};
  const bridge=createCombinedPaymentBridge({env,runtime,readVerifiedEvidence:async k=>k===p.eventKey?evidence:null});
  return bridge(p.eventKey);
 }
 async function process(eventKey){
  if(!enabled||!hash(eventKey))return fail("RENEWAL_DISABLED");
  try{
   const e=await runtime.store.get("PaymentWebhookEvents",eventKey),at=epoch(e?.signatureVerifiedAt);
   if(e?.providerEventKey!==eventKey||e.payloadDigest!==eventKey||e.environment!=="sandbox"||!["charge.created","charge.updated"].includes(e.eventType)||!["pending","processed","duplicate"].includes(e.processingStatus)||!Number.isSafeInteger(at)||at<=0||at>clock()||!validProvider(e.providerObjectId))return fail("UNVERIFIED_EVENT");
   const provider=providerFactory(env,{clock}),subscriptionId=await provider.resolveEventSubscription(e);
   if(!subscriptionId)return fail("UNMATCHED_EVENT");
   const row=await db.get(BILLING_COLLECTION,providerKey("subscription",subscriptionId)),v=row?.environment==="sandbox-qa"?JSON.parse(row.stateJson):null;
   if(v?.scope!=="j123-provider-binding-v1"||v.kind!=="subscription"||v.providerId!==subscriptionId||!validStudent(v.childId)||!validStudent(v.parentId))return fail("UNMATCHED_EVENT");
   const b=await bound(v.childId,v.parentId);
   if(!b||b.r.providerId!==subscriptionId||at<b.r.termsAcceptedAt)return fail("UNVERIFIED_MEMBERSHIP");
   const failed=await provider.reconcileFailedRenewal({objectId:e.providerObjectId,subscriptionId,reference:b.r.reference,planId:b.r.planId});
   if(!failed){
    // Successful renewal must first be committed by the existing signed J3 reconciler.
    const paid=await dispatch({env,db,eventKey,clock,providerFactory});
    if(!paid.ok)return fail("RENEWAL_EVIDENCE_PENDING");
    const result=await recover(v.childId,v.parentId);
    return result.ok?{ok:true,status:result.status}:result;
   }
   const fresh=await bound(v.childId,v.parentId),first=fresh?.ledger.payments?.find(x=>x.cycleNumber===1);
   if(!first||fresh.r.providerId!==subscriptionId||failed.periodStartAt!==first.periodEndAt||failed.failedAt<first.paidAt||failed.failedAt>at)return fail("RENEWAL_EVIDENCE_PENDING");
   if(fresh.ledger.payments.some(x=>x.cycleNumber===2))return {ok:true,status:"SUPERSEDED_FAILURE"};
   const evidence={kind:"renewal-failed",eventId:eventKey,childId:v.childId,parentId:v.parentId,cycleId:cycle(subscriptionId,failed.periodStartAt),at:failed.failedAt};
   const bridge=createCombinedPaymentBridge({env,runtime,readVerifiedEvidence:async k=>k===eventKey?evidence:null});
   const result=await bridge(eventKey);
   if(result.ok){const after=await bound(v.childId,v.parentId);if(after?.ledger.payments.some(x=>x.cycleNumber===2))return recover(v.childId,v.parentId);}
   return result;
  }catch{return fail("RENEWAL_EVIDENCE_PENDING");}
 }
 async function recoverHolds(){
  if(!enabled)return {ok:true,status:"DISABLED"};
  const snap=await runtime.repository.read();let pending=0;
  for(const h of n4(snap.state).holds.filter(h=>h.status!=="restored")){
   try{const result=await recover(h.childId,h.parentId);if(!result.ok)pending++;}catch{pending++;}
  }
  return {ok:true,pending};
 }
 return {process,recoverHolds};
}
