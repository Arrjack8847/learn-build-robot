// Read-only staff projection. The J3 ledger, never a staff action, establishes paid coverage.
// No provider calls, payment creation, receipts or entitlement writes in a dashboard refresh.
import {BILLING_COLLECTION,checkoutKey,decodeCheckout,checkProviderBinding,validStudent,validProvider} from "../j123/billing-records.mjs";
import {J123_PLAN,membershipTermsVersion} from "../j123/infrastructure.mjs";
import {membershipProcessingEnabled} from "../j123/membership-provider.mjs";
import {readStudentMembershipStatus} from "../hitpay/verified-membership-contract.mjs";
import {isJ1234Preview} from "./identity-scope.mjs";
import {scopeJ1234BillingStore} from "./billing-scope.mjs";
import {isFamilyPreview as isJ12345Preview} from "../j12345/identity-scope.mjs";
const date=x=>Number.isSafeInteger(x)&&x>0;
const eventTime=x=>date(x)?x:Date.parse(typeof x==="string"?x:x?.$date);
const unavailable=()=>({membershipStatus:"unavailable",paymentStatus:"unavailable",activatedAt:null,validUntil:null,renewalStatus:"unverified",payments:[]});
const review=()=>({...unavailable(),membershipStatus:"verification_required",paymentStatus:"verification_required"});
const validEvent=(e,p,r,now)=>e&&e.environment==="sandbox"&&e.eventType==="charge.created"&&e.providerObjectId===p.providerPaymentId&&e.providerEventKey===p.eventKey&&e.payloadDigest===p.eventKey&&["pending","processed","duplicate"].includes(e.processingStatus)&&date(eventTime(e.signatureVerifiedAt))&&eventTime(e.signatureVerifiedAt)>=r.termsAcceptedAt&&eventTime(e.signatureVerifiedAt)<=now;
async function readBilling({env,db,studentId,parentId,now=Date.now(),includeEligibility=false}){
 if(!(isJ1234Preview(env)&&env.J1234_BILLING_READ_ENABLED==="1"||isJ12345Preview(env)&&env.J12345_BILLING_READ_ENABLED==="1")||!membershipProcessingEnabled(env)||!validStudent(studentId)||!validStudent(parentId)||!date(now))return unavailable();
 const store=scopeJ1234BillingStore(db,env);
 try{
  const key=checkoutKey(studentId),row=await store.get(BILLING_COLLECTION,key);
  if(!row)return {...unavailable(),membershipStatus:"inactive",paymentStatus:"not_started"};
  const s=decodeCheckout(row,studentId),r=s.reservation;
  if(r.childId!==studentId||r.parentId!==parentId||r.environment!=="sandbox"||r.kind!=="membership"||r.currency!=="MYR"||r.amountMinor!==36000||r.planId!==J123_PLAN||r.termsVersion!==membershipTermsVersion(env)||!date(r.termsAcceptedAt)||r.termsAcceptedAt>now||!validProvider(r.reference)||!validProvider(r.attemptId))return review();
  if(r.status==="reserved"){
   if(s.membership||s.payments!==undefined&&(!Array.isArray(s.payments)||s.payments.length))return review();
   return {...unavailable(),membershipStatus:r.dispatchState==="retryable"?"inactive":"verification_required",paymentStatus:r.dispatchState==="retryable"?"not_submitted":"verification_required"};
  }
  if(r.status!=="bound"||r.dispatchState!=="dispatched"||!validProvider(r.providerId)||!await checkProviderBinding(store,"subscription",r.providerId,r))return review();
  const payments=s.payments??[];
  if(!Array.isArray(payments)||payments.length>2)return review();
  if(!payments.length)return s.membership?review():{...unavailable(),membershipStatus:"payment_pending",paymentStatus:"pending"};
  const m=s.membership;
  if(!m||m.studentId!==studentId||m.environment!=="sandbox"||m.source!=="verified_membership_ledger"||m.state!=="paid")return review();
  const ids=new Set(),history=[];
  for(const [i,p] of payments.entries()){
   const previous=payments[i-1];
   if(!p||p.studentId!==studentId||p.parentId!==parentId||p.environment!=="sandbox"||p.purpose!=="membership"||p.reference!==r.reference||p.attemptId!==r.attemptId||p.providerSubscriptionId!==r.providerId||p.currency!=="MYR"||p.amountMinor!==36000||!validProvider(p.providerPaymentId)||ids.has(p.providerPaymentId)||! /^[a-f0-9]{64}$/.test(p.eventKey??"")||p.cycleNumber!==i+1||![p.paidAt,p.periodStartAt,p.periodEndAt].every(date)||p.paidAt<r.termsAcceptedAt||p.paidAt>now||p.periodEndAt<=p.periodStartAt||p.periodEndAt<=p.paidAt||previous&&(previous.periodEndAt!==p.periodStartAt||previous.paidAt>p.paidAt)||!await checkProviderBinding(store,"charge",p.providerPaymentId,r))return review();
   const e=await store.get("PaymentWebhookEvents",p.eventKey);if(!validEvent(e,p,r,now))return review();
   ids.add(p.providerPaymentId);
   history.push({paymentId:p.providerPaymentId,studentId,currency:"MYR",amountMinor:36000,status:"verified",evidenceType:"hitpay-sandbox",paymentMethod:"touch_n_go",paidAt:p.paidAt,periodStartAt:p.periodStartAt,periodEndAt:p.periodEndAt,cycleNumber:p.cycleNumber});
  }
  const first=payments[0],last=payments.at(-1);
  if(m.providerPaymentId!==last.providerPaymentId||m.activatedAt!==first.paidAt||m.validFrom!==first.periodStartAt||m.validUntil!==last.periodEndAt)return review();
  const reviews=s.reviewEvents??[];
  if(!Array.isArray(reviews)||reviews.length>100||reviews.length>0&&m.policyReviewRequired!==true)return review();
  // A concurrent ledger change invalidates the snapshot. Never mix old coverage and new payments.
  const current=await store.get(BILLING_COLLECTION,key);
  if(!current||current.stateVersion!==row.stateVersion||current.stateJson!==row.stateJson)return review();
  const status=readStudentMembershipStatus({studentId,record:m,now});
  const held=status.membershipStatus==="verification_required";
  return {...(includeEligibility?{verifiedLearningEligibility:status.verifiedLearningEligibility}:{}),membershipStatus:status.membershipStatus,paymentStatus:held?"review_required":"verified",activatedAt:held?null:status.activatedAt,validUntil:held?null:status.validUntil,renewalStatus:held?"review_required":payments.length===2?"two_cycles_verified":"second_cycle_unverified",payments:history.map(p=>held?{...p,status:"review_required"}:p)};
 }catch{return review();}
}

export async function readJ1234BillingProjection(args){return readBilling(args);}
// Shared verified ledger reader: use the J3 eligibility bit only after the complete evidence chain passes.
export async function readJ12345MembershipObservation(args){
 if(!isJ12345Preview(args.env))return {studentId:args.studentId,membershipStatus:"verification_required",activatedAt:null,validUntil:null,verifiedLearningEligibility:false};
 const p=await readBilling({...args,includeEligibility:true});
 return {studentId:args.studentId,membershipStatus:p.membershipStatus==="unavailable"?"verification_required":p.membershipStatus,activatedAt:p.activatedAt,validUntil:p.validUntil,verifiedLearningEligibility:p.verifiedLearningEligibility===true};
}
