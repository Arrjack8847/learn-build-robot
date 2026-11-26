// Internal only. No HTTP mount, scheduler, synthetic webhook or production access.
// The provider adapter must independently authenticate charge, subscription, method and billing-period evidence.
// A normalized observation must never be accepted from a browser or inferred from a webhook payload.
import {randomUUID} from "node:crypto";
import {J123_PLAN,J123_TERMS} from "./infrastructure.mjs";
import {membershipProcessingEnabled as enabled,J123_MERCHANT as merchantId} from "./membership-provider.mjs";
import {newPaymentReceipt} from "./payment-receipts.mjs";
import {validateVerifiedMembershipPayment,readStudentMembershipStatus} from "../hitpay/verified-membership-contract.mjs";
import {BILLING_COLLECTION,validStudent,checkoutKey,decodeCheckout,encodeCheckout,checkProviderBinding} from "./billing-records.mjs";
const config=Object.freeze({environment:"sandbox",currency:"MYR",membershipMinor:36000,planId:J123_PLAN});
const digest=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const epoch=x=>Number.isSafeInteger(x)?x:Date.parse(typeof x==="string"?x:x?.$date);
const fail=error=>({ok:false,error});
// Disabling NEW checkouts does not revoke already verified coverage. All other acceptance gates stay required.
const signed=(e,key,now)=>e&&e.providerEventKey===key&&e.payloadDigest===key&&e.environment==="sandbox"&&["pending","processed","duplicate"].includes(e.processingStatus)&&Number.isFinite(epoch(e.signatureVerifiedAt))&&epoch(e.signatureVerifiedAt)>0&&epoch(e.signatureVerifiedAt)<=now;
export function createMembershipReconciler({env,db,provider,clock=()=>Date.now(),newId=randomUUID}){
 return async function reconcile(studentId,eventKey){
  if(!enabled(env))return fail("RECONCILIATION_DISABLED");
  if(!validStudent(studentId)||!digest(eventKey))return fail("INVALID_INPUT");
  try{
   const event=await db.get("PaymentWebhookEvents",eventKey);
   if(!signed(event,eventKey,clock())||event.eventType!=="charge.created")return fail("UNVERIFIED_EVENT");
   const key=checkoutKey(studentId),row=await db.get(BILLING_COLLECTION,key),state=decodeCheckout(row,studentId),r=state.reservation;
   if(r.termsVersion!==J123_TERMS||!await checkProviderBinding(db,"subscription",r.providerId,r))return fail("INVALID_MEMBERSHIP_BINDING");
   // Adapter is an internal trusted dependency, and receives only exact reservation and event identifiers.
   const o=await provider.reconcileVerifiedEvent({eventKey,chargeId:event.providerObjectId,subscriptionId:r.providerId,reference:r.reference,planId:r.planId});
   if(o?.paymentMethod!=="touch_n_go"||![1,2].includes(o?.cycleNumber)||o?.paidAt>clock())return fail("PROVIDER_EVIDENCE_REQUIRED");
   const candidate=validateVerifiedMembershipPayment({config,merchantId,event:{...event,signatureVerifiedAt:epoch(event.signatureVerifiedAt)},reservation:r,observation:o});
   if(!candidate.ok)return candidate;
   const p=candidate.payment;
   // A charge is globally bound once. An ambiguous claim or CAS failure remains recoverable only for the exact same student.
   // Charge ownership never implies activation: the aggregate CAS below is the authoritative commit.
   if(!await checkProviderBinding(db,"charge",p.providerPaymentId,r,{reserve:true,newId}))return fail("CHARGE_BINDING_CONFLICT");
   for(let tries=0;tries<8;tries++){
    const current=await db.get(BILLING_COLLECTION,key),s=decodeCheckout(current,studentId);
    if(!Object.entries(r).every(([k,v])=>s.reservation[k]===v))return fail("RESERVATION_CHANGED");
    const payments=s.payments??[];
    if(!Array.isArray(payments)||payments.length>2||s.membership?.policyReviewRequired)return fail("LEDGER_REVIEW_REQUIRED");
    const same=payments.find(x=>x.providerPaymentId===p.providerPaymentId);
    if(same){
     const {eventKey:ignored,...prior}=same,{eventKey:ignored2,...next}=p;
     if(!Object.entries(next).every(([k,v])=>prior[k]===v))return fail("PAYMENT_CONFLICT");
     return {ok:true,status:"duplicate"};
    }
    const previous=payments.at(-1);
    if(p.cycleNumber!==payments.length+1||previous&&(p.periodStartAt!==previous.periodEndAt||p.paidAt<previous.paidAt))return fail("BILLING_SEQUENCE_UNVERIFIED");
    const membership={studentId,environment:"sandbox",source:"verified_membership_ledger",state:"paid",providerPaymentId:p.providerPaymentId,activatedAt:previous?s.membership.activatedAt:p.paidAt,validFrom:previous?s.membership.validFrom:p.periodStartAt,validUntil:p.periodEndAt};
    // Payment ledger and membership projection are committed together by a single conditional Wix update.
    // The inbox row is retained as immutable evidence; a replay sees the exact committed payment.
    const receipts=s.receipts??[];
    if(!Array.isArray(receipts)||receipts.length>1||receipts.some(j=>j.providerPaymentId===p.providerPaymentId))return fail("RECEIPT_LEDGER_REVIEW_REQUIRED");
    const next=encodeCheckout({...s,payments:[...payments,p],membership,receipts:[...receipts,newPaymentReceipt(p,clock())]},newId);
    if(await db.replaceIfVersion(BILLING_COLLECTION,key,current.stateVersion,next)===true){
     const saved=await db.get(BILLING_COLLECTION,key),verified=decodeCheckout(saved,studentId);
     if(!verified.payments?.some(x=>x.providerPaymentId===p.providerPaymentId)||verified.membership?.studentId!==studentId)return fail("COMMIT_UNCONFIRMED");
     return {ok:true,status:"membership_committed"};
    }
   }
   return fail("RECONCILIATION_CONFLICT");
  }catch{return fail("RECONCILIATION_UNCONFIRMED");}
 };
}
// Internal reader only. J5 learning access is not wired to this ledger.
// Disable on incomplete provider acceptance, unverified ownership or malformed ledger.
export async function readIntegratedMembership({env,db,studentId,now=Date.now()}){
 if(!enabled(env)||!validStudent(studentId))return null;
 try{
  const row=await db.get(BILLING_COLLECTION,checkoutKey(studentId));if(!row)return null;
  const state=decodeCheckout(row,studentId),r=state.reservation,m=state.membership,p=state.payments?.at(-1);
  if(!m||!p||r.status!=="bound"||m.studentId!==studentId||p.studentId!==studentId||p.providerSubscriptionId!==r.providerId||m.providerPaymentId!==p.providerPaymentId||m.validUntil!==p.periodEndAt||!await checkProviderBinding(db,"subscription",r.providerId,r)||!await checkProviderBinding(db,"charge",p.providerPaymentId,r))return null;
  return readStudentMembershipStatus({studentId,record:m,now});
 }catch{return null;}
}

// Confirmed adverse events are recorded as a review hold, not an invented refund or cancellation policy.
// Both the verified inbox entry and independent provider observation must match the exact student binding.
// Never issue a refund or cancel a subscription here.
export function createMembershipReviewProcessor({env,db,provider,clock=()=>Date.now(),newId=randomUUID}){
 return async function review(studentId,eventKey){
  if(!enabled(env))return fail("RECONCILIATION_DISABLED");
  if(!validStudent(studentId)||!digest(eventKey))return fail("INVALID_INPUT");
  try{
   const e=await db.get("PaymentWebhookEvents",eventKey);
   if(!signed(e,eventKey,clock())||!["charge.updated","recurring_billing.subscription_updated","recurring_billing.method_detached"].includes(e.eventType))return fail("UNVERIFIED_EVENT");
   const k=checkoutKey(studentId),original=decodeCheckout(await db.get(BILLING_COLLECTION,k),studentId),r=original.reservation;
   if(r.status!=="bound"||r.termsVersion!==J123_TERMS||!await checkProviderBinding(db,"subscription",r.providerId,r))return fail("INVALID_MEMBERSHIP_BINDING");
   const charge=e.eventType==="charge.updated";
   if(charge?(!original.payments?.some(p=>p.providerPaymentId===e.providerObjectId)||!await checkProviderBinding(db,"charge",e.providerObjectId,r)):e.providerObjectId!==r.providerId)return fail("UNMATCHED_ADVERSE_EVENT");
   const o=await provider.reconcileAdverseEvent({eventKey,eventType:e.eventType,objectId:e.providerObjectId,subscriptionId:r.providerId,reference:r.reference,planId:r.planId});
   if(!o||o.environment!=="sandbox"||o.businessId!==merchantId||o.eventKey!==eventKey||o.subscriptionId!==r.providerId||o.reference!==r.reference||o.planId!==r.planId||!Number.isSafeInteger(o.observedAt)||o.observedAt<epoch(e.signatureVerifiedAt)||o.observedAt>clock())return fail("PROVIDER_EVIDENCE_REQUIRED");
   let reason;
   if(charge){
    if(o.paymentId!==e.providerObjectId||o.currency!=="MYR"||o.amountMinor!==36000||!Number.isSafeInteger(o.refundedMinor)||o.refundedMinor<1||o.refundedMinor>36000)return fail("REFUND_UNVERIFIED");
    reason="REFUND_REVIEW";
   }else if(e.eventType==="recurring_billing.method_detached"){
    if(o.methodAttached!==false)return fail("DETACHMENT_UNVERIFIED");reason="METHOD_DETACHED_REVIEW";
   }else{
    if(!["cancelled","paused","expired","inactive"].includes(o.subscriptionStatus))return fail("SUBSCRIPTION_CHANGE_UNVERIFIED");reason="SUBSCRIPTION_REVIEW";
   }
   for(let i=0;i<8;i++){
    const row=await db.get(BILLING_COLLECTION,k),state=decodeCheckout(row,studentId);
    if(!Object.entries(r).every(([key,value])=>state.reservation[key]===value)||!state.membership||state.membership.studentId!==studentId)return fail("MEMBERSHIP_UNCONFIRMED");
    // Keep the verified payment history. Only deny membership eligibility pending policy review.
    const reviews=state.reviewEvents??[];
    if(!Array.isArray(reviews)||reviews.length>100)return fail("LEDGER_REVIEW_REQUIRED");
    const existing=reviews.find(x=>x.eventKey===eventKey);
    if(existing)return existing.reason===reason&&state.membership.policyReviewRequired===true?{ok:true,status:"duplicate"}:fail("REVIEW_CONFLICT");
    if(reviews.length===100)return fail("LEDGER_REVIEW_REQUIRED");
    const next=encodeCheckout({...state,reviewEvents:[...reviews,{eventKey,reason,observedAt:o.observedAt}],membership:{...state.membership,policyReviewRequired:true}},newId);
    if(await db.replaceIfVersion(BILLING_COLLECTION,k,row.stateVersion,next)===true){
     const saved=decodeCheckout(await db.get(BILLING_COLLECTION,k),studentId);
     if(saved.membership?.policyReviewRequired===true&&saved.reviewEvents?.some(x=>x.eventKey===eventKey))return {ok:true,status:"review_required"};
     return fail("COMMIT_UNCONFIRMED");
    }
   }
   return fail("RECONCILIATION_CONFLICT");
  }catch{return fail("RECONCILIATION_UNCONFIRMED");}
 };
}
