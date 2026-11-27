// Private, bounded, read-only-provider reconciliation on authenticated status refresh.
// Existing Wix receiver remains the only raw-body signature-verification ingress.
// No client-supplied event IDs, provider evidence, new provider charges or public webhook route.
import {BILLING_COLLECTION,validStudent,validProvider,checkoutKey,decodeCheckout,checkProviderBinding,providerKey} from "./billing-records.mjs";
import {createMembershipProviderReader,membershipProcessingEnabled} from "./membership-provider.mjs";
import {createMembershipReconciler,createMembershipReviewProcessor,readIntegratedMembership} from "./membership-reconciliation.mjs";
import {membershipTermsVersion} from "./infrastructure.mjs";
import {flushPaymentReceipts} from "./payment-receipts.mjs";
import {isCombinedBranch} from "../combined/scope.mjs";
import {createJ12345IdentityEnv} from "../j12345/identity-scope.mjs";
import {createAuthCrypto,previewRecipients} from "../parent-auth/secure-auth-transport.mjs";
const digest=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const epoch=x=>Number.isSafeInteger(x)?x:Date.parse(typeof x==="string"?x:x?.$date);
const types=new Set(["charge.created","charge.updated","recurring_billing.subscription_updated","recurring_billing.method_detached"]);
const validEvent=(e,now,since)=>e&&digest(e.providerEventKey)&&e.providerEventKey===e.payloadDigest&&validProvider(e.providerObjectId)&&e.environment==="sandbox"&&types.has(e.eventType)&&["pending","processed","duplicate"].includes(e.processingStatus)&&Number.isFinite(epoch(e.signatureVerifiedAt))&&epoch(e.signatureVerifiedAt)>=since&&epoch(e.signatureVerifiedAt)<=now;
const display=m=>m?.membershipStatus==="active"?"MEMBERSHIP_ACTIVE":m?.membershipStatus==="expired"?"MEMBERSHIP_EXPIRED":m?.membershipStatus==="verification_required"?"MEMBERSHIP_REVIEW_REQUIRED":"PAYMENT_PENDING";
export async function reconcileStudentCheckoutStatus({env,db,studentId,parentId,requestFn=fetch,clock=()=>Date.now(),providerFactory=createMembershipProviderReader}){
 if(!membershipProcessingEnabled(env))return null;
 if(!validStudent(studentId)||!validStudent(parentId))return "PAYMENT_VERIFICATION_REQUIRED";
 try{
  const row=await db.get(BILLING_COLLECTION,checkoutKey(studentId));if(!row)return null;
  let state=decodeCheckout(row,studentId),r=state.reservation;
  if(r.parentId!==parentId||r.status!=="bound"||r.termsVersion!==membershipTermsVersion(env)||!Number.isSafeInteger(r.termsAcceptedAt)||r.termsAcceptedAt>clock()||!await checkProviderBinding(db,"subscription",r.providerId,r))return null;
  // Existing verified holds must stay held, even when the provider is unavailable.
  if(state.membership?.policyReviewRequired===true)return "MEMBERSHIP_REVIEW_REQUIRED";
  const events=await db.listMembershipInbox({since:r.termsAcceptedAt,subscriptionId:r.providerId});
  if(!Array.isArray(events)||events.length>12||events.some(e=>!validEvent(e,clock(),r.termsAcceptedAt)))return "PAYMENT_VERIFICATION_REQUIRED";
  const provider=providerFactory(env,{request:requestFn,clock});
  const activate=createMembershipReconciler({env,db,provider,clock}),review=createMembershipReviewProcessor({env,db,provider,clock});
  const seen=new Set();let unresolved=false;
  // Process first payment before later events at equal receipt time. A current refund prevents stale activation.
  const ordered=[...events].sort((a,b)=>epoch(a.signatureVerifiedAt)-epoch(b.signatureVerifiedAt)||Number(b.eventType==="charge.created")-Number(a.eventType==="charge.created"));
  for(const e of ordered){
   const key=e.providerEventKey;if(seen.has(key))continue;seen.add(key);
   state=decodeCheckout(await db.get(BILLING_COLLECTION,checkoutKey(studentId)),studentId);
   if(state.membership?.policyReviewRequired===true)return "MEMBERSHIP_REVIEW_REQUIRED";
   if(state.payments?.some(p=>p.eventKey===key)||state.reviewEvents?.some(p=>p.eventKey===key))continue;
   const kind=await provider.classify(e,r);
   if(kind==="foreign"||kind==="ignored")continue;
   if(kind!=="matched"){unresolved=true;continue;}
   if(e.eventType==="charge.created"){
    const result=await activate(studentId,key);if(!result.ok)unresolved=true;
   }else{
    const result=await review(studentId,key);
    // A non-adverse subscription update can be acknowledged as harmless only after an authenticated read.
    if(!result.ok){
     if(e.eventType==="recurring_billing.subscription_updated"){
      const o=await provider.reconcileAdverseEvent({eventKey:key,eventType:e.eventType,objectId:e.providerObjectId,subscriptionId:r.providerId,reference:r.reference,planId:r.planId});
      if(o&&["active","scheduled","retrying"].includes(o.subscriptionStatus))continue;
     }
     unresolved=true;
    }
   }
  }
  const membership=await readIntegratedMembership({env,db,studentId,now:clock()});
  if(membership?.membershipStatus==="verification_required")return "MEMBERSHIP_REVIEW_REQUIRED";
  // Never show active while a matched adverse event or unknown charge remains unverified.
  if(unresolved)return "PAYMENT_VERIFICATION_REQUIRED";
  if(membership)await flushPaymentReceipts({env,db,studentId,requestFn,clock});
  return display(membership);
 }catch{return "PAYMENT_VERIFICATION_REQUIRED";}
}

// Exact-event dispatcher for a trusted server worker. Resolve the student from the
// authenticated provider subscription and create-only binding index, never the caller.
// An event may remain pending until its subscription is bound or provider evidence is available.
export async function dispatchVerifiedMembershipEvent({env,db,eventKey,requestFn=fetch,clock=()=>Date.now(),providerFactory=createMembershipProviderReader}){
 if(!membershipProcessingEnabled(env))return {ok:false,status:"disabled"};
 if(!digest(eventKey))return {ok:false,status:"invalid"};
 try{
  const e=await db.get("PaymentWebhookEvents",eventKey);
  if(!validEvent(e,clock(),1)||e.providerEventKey!==eventKey)return {ok:false,status:"unverified"};
  const provider=providerFactory(env,{request:requestFn,clock});
  const subscriptionId=await provider.resolveEventSubscription(e);
  if(!subscriptionId)return {ok:true,status:"ignored"};
  const binding=await db.get(BILLING_COLLECTION,providerKey("subscription",subscriptionId));
  // No binding yet is not proof the event will never belong to J123: keep it retryable.
  if(!binding)return {ok:false,status:"pending"};
  if(binding.environment!=="sandbox-qa"||typeof binding.stateVersion!=="string")return {ok:false,status:"pending"};
  const v=JSON.parse(binding.stateJson);
  if(v.scope!=="j123-provider-binding-v1"||v.kind!=="subscription"||v.providerId!==subscriptionId||!validStudent(v.childId)||!validStudent(v.parentId))return {ok:false,status:"pending"};
  if(isCombinedBranch(env)){
   const cfg=createJ12345IdentityEnv(env),crypto=createAuthCrypto(cfg);
   if(!previewRecipients(cfg).some(email=>"qa-j2-"+crypto.identityDigest("parent-preview-session",email)===v.parentId))return {ok:false,status:"pending"};
  }
  const state=decodeCheckout(await db.get(BILLING_COLLECTION,checkoutKey(v.childId)),v.childId),r=state.reservation;
  if(r.providerId!==subscriptionId||r.parentId!==v.parentId||r.status!=="bound"||r.termsVersion!==membershipTermsVersion(env)||!Number.isSafeInteger(r.termsAcceptedAt)||r.termsAcceptedAt<=0||!validEvent(e,clock(),r.termsAcceptedAt)||!await checkProviderBinding(db,"subscription",subscriptionId,r))return {ok:false,status:"pending"};
  async function paymentResult(status){
   const receiptStatus=await flushPaymentReceipts({env,db,studentId:v.childId,requestFn,clock});
   return {ok:true,status,...(receiptStatus==="disabled"?{}:{receiptStatus})};
  }
  if(state.payments?.some(p=>p.eventKey===eventKey))return await paymentResult("duplicate");
  if(state.reviewEvents?.some(p=>p.eventKey===eventKey))return {ok:true,status:"duplicate"};
  const run=e.eventType==="charge.created"?createMembershipReconciler({env,db,provider,clock}):createMembershipReviewProcessor({env,db,provider,clock});
  const result=await run(v.childId,eventKey);
  if(result.ok)return e.eventType==="charge.created"?await paymentResult(result.status):{ok:true,status:result.status};
  if(e.eventType==="recurring_billing.subscription_updated"){
   const o=await provider.reconcileAdverseEvent({eventKey,eventType:e.eventType,objectId:e.providerObjectId,subscriptionId:r.providerId,reference:r.reference,planId:r.planId});
   if(o&&["active","scheduled","retrying"].includes(o.subscriptionStatus))return {ok:true,status:"ignored"};
  }
  return {ok:false,status:"pending"};
 }catch{return {ok:false,status:"pending"};}
}
