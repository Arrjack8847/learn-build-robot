// Private, bounded, read-only-provider reconciliation on authenticated status refresh.
// Existing Wix receiver remains the only raw-body signature-verification ingress.
// No client-supplied event IDs, provider evidence, new provider charges or public webhook route.
import {BILLING_COLLECTION,validStudent,validProvider,checkoutKey,decodeCheckout,checkProviderBinding} from "./billing-records.mjs";
import {createMembershipProviderReader,membershipProcessingEnabled} from "./membership-provider.mjs";
import {createMembershipReconciler,createMembershipReviewProcessor,readIntegratedMembership} from "./membership-reconciliation.mjs";
import {J123_TERMS} from "./infrastructure.mjs";
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
  if(r.parentId!==parentId||r.status!=="bound"||r.termsVersion!==J123_TERMS||!Number.isSafeInteger(r.termsAcceptedAt)||r.termsAcceptedAt>clock()||!await checkProviderBinding(db,"subscription",r.providerId,r))return null;
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
  return display(membership);
 }catch{return "PAYMENT_VERIFICATION_REQUIRED";}
}
