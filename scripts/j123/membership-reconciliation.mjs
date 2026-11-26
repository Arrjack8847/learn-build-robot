// Internal only. No HTTP mount, scheduler, synthetic webhook or production access.
// The provider adapter must independently authenticate charge, subscription, method and billing-period evidence.
// A normalized observation must never be accepted from a browser or inferred from a webhook payload.
import {randomUUID} from "node:crypto";
import {j123InfrastructureStatus,J123_PLAN,J123_TERMS} from "./infrastructure.mjs";
import {validateVerifiedMembershipPayment,readStudentMembershipStatus} from "../hitpay/verified-membership-contract.mjs";
import {BILLING_COLLECTION,validStudent,checkoutKey,decodeCheckout,encodeCheckout,checkProviderBinding} from "./billing-records.mjs";
const merchantId="a34ebd5e-6bd2-4c62-a13d-b19f58f68fd7";
const config=Object.freeze({environment:"sandbox",currency:"MYR",membershipMinor:36000,planId:J123_PLAN});
const digest=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const epoch=x=>Number.isSafeInteger(x)?x:Date.parse(typeof x==="string"?x:x?.$date);
const fail=error=>({ok:false,error});
const enabled=env=>j123InfrastructureStatus(env).checkoutReady&&env.J123_MEMBERSHIP_RECONCILIATION_ENABLED==="true";
export function createMembershipReconciler({env,db,provider,clock=()=>Date.now(),newId=randomUUID}){
 return async function reconcile(studentId,eventKey){
  if(!enabled(env))return fail("RECONCILIATION_DISABLED");
  if(!validStudent(studentId)||!digest(eventKey))return fail("INVALID_INPUT");
  try{
   const event=await db.get("PaymentWebhookEvents",eventKey);
   if(!event||event.providerEventKey!==eventKey||event.payloadDigest!==eventKey||event.eventType!=="charge.created"||event.environment!=="sandbox"||!["pending","processed","duplicate"].includes(event.processingStatus)||!Number.isFinite(epoch(event.signatureVerifiedAt))||epoch(event.signatureVerifiedAt)<=0||epoch(event.signatureVerifiedAt)>clock())return fail("UNVERIFIED_EVENT");
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
    const next=encodeCheckout({...s,payments:[...payments,p],membership},newId);
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
