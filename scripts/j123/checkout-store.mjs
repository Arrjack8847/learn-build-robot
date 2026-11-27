import {membershipTermsVersion} from "./infrastructure.mjs";
// Durable single unresolved membership reservation per student. Never activates membership.
import {randomUUID} from "node:crypto";
import {BILLING_COLLECTION as collection,CHECKOUT_SCOPE as scope,validStudent as valid,checkoutKey as rowId,decodeCheckout,encodeCheckout,checkProviderBinding} from "./billing-records.mjs";
export function createIntegratedCheckoutStore({db,resolvePayer,request,env,childId,clock=()=>Date.now(),newId=randomUUID}){
 if(!valid(childId))throw Error("INVALID_CHILD");
 const key=rowId(childId);
 const parse=row=>decodeCheckout(row,childId).reservation;
 const encode=(r)=>({environment:"sandbox-qa",stateVersion:newId(),stateJson:JSON.stringify({scope,reservation:r})});
 async function owned(parentId,selected){const p=await resolvePayer(request,env,selected);return p?.parentId===parentId&&p.childId===childId?{parentId,childId}:null;}
 async function reserveAuthorizedCheckout(expected){
  if(expected.kind!=="membership"||expected.environment!=="sandbox"||expected.currency!=="MYR"||expected.amountMinor!==36000||expected.childId!==childId||!await owned(expected.parentId,childId))throw Error("NOT_AUTHORIZED");
  let old=await db.get(collection,key),replaceRetry=false;
  if(old){const r=parse(old);if(r.termsVersion!==membershipTermsVersion(env))throw Error("TERMS_REVIEW_REQUIRED");if(!Object.entries(expected).every(([k,v])=>r[k]===v))throw Error("UNRESOLVED_STUDENT_CHECKOUT");if(r.status!=="reserved"||r.dispatchState!=="retryable")return {created:false,reservation:r};replaceRetry=true;}
  const r={...expected,attemptId:newId(),reference:"j123-"+newId(),status:"reserved",dispatchState:"preflight",termsVersion:membershipTermsVersion(env),termsAcceptedAt:clock(),startDate:new Date(clock()+86400000+8*3600000).toISOString().slice(0,10)};
  const next=encode(r),created=replaceRetry?await db.replaceIfVersion(collection,key,old.stateVersion,next):await db.insert(collection,key,next);old=await db.get(collection,key);const saved=parse(old);
  if(!Object.entries(expected).every(([k,v])=>saved[k]===v))throw Error("RESERVATION_CONFLICT");
  if(created===true&&old.stateVersion!==next.stateVersion)throw Error("RESERVATION_UNCONFIRMED");
  return {created:created===true,reservation:saved};
 }
 // The caller must claim this exact attempt durably before transmitting any POST.
 // An uncertain write is not a permission to send a payment request.
 async function claimDispatch(r){
  const old=await db.get(collection,key),saved=parse(old);
  if(saved.termsVersion!==membershipTermsVersion(env)||saved.status!=="reserved"||saved.dispatchState!=="preflight"||saved.attemptId!==r.attemptId||saved.reference!==r.reference||!await owned(saved.parentId,childId))return false;
  const next=encodeCheckout({...decodeCheckout(old,childId),reservation:{...saved,dispatchState:"dispatched"}},newId);
  if(await db.replaceIfVersion(collection,key,old.stateVersion,next)!==true)return false;
  const after=await db.get(collection,key);return after?.stateVersion===next.stateVersion&&parse(after).dispatchState==="dispatched";
 }
 // Never release a dispatched, legacy, or ambiguous attempt. A late caller cannot claim a replaced attempt.
 async function releaseUnsent(r){
  const old=await db.get(collection,key);if(!old)return false;
  const saved=parse(old);
  if(saved.status!=="reserved"||saved.dispatchState!=="preflight"||saved.attemptId!==r.attemptId||saved.reference!==r.reference)return false;
  const next=encodeCheckout({...decodeCheckout(old,childId),reservation:{...saved,dispatchState:"retryable"}},newId);
  if(await db.replaceIfVersion(collection,key,old.stateVersion,next)!==true)return false;
  const after=await db.get(collection,key);return after?.stateVersion===next.stateVersion&&parse(after).dispatchState==="retryable";
 }
 async function bindCheckoutOnce({attemptId,reference,providerId,environment,kind}){
  const old=await db.get(collection,key),r=parse(old);if(r.termsVersion!==membershipTermsVersion(env)||r.status!=="reserved"||r.attemptId!==attemptId||r.reference!==reference||environment!=="sandbox"||kind!=="membership"||!/^[-a-zA-Z0-9_]{1,128}$/.test(providerId))return false;
  // A provider subscription may belong to exactly one student, even across concurrent checkouts.
  if(!await checkProviderBinding(db,"subscription",providerId,r,{reserve:true,newId}))return false;
  const next=encodeCheckout({...decodeCheckout(old,childId),reservation:{...r,status:"bound",providerId}},newId);if(await db.replaceIfVersion(collection,key,old.stateVersion,next)!==true)return false;
  const saved=await db.get(collection,key);return saved?.stateVersion===next.stateVersion&&parse(saved).providerId===providerId;
 }
 async function getStatus(parentId){if(!await owned(parentId,childId))throw Error("NOT_AUTHORIZED");const row=await db.get(collection,key);if(!row)return "NO_CHECKOUT";const r=parse(row);if(r.termsVersion!==membershipTermsVersion(env)||r.parentId!==parentId||r.environment!=="sandbox"||r.kind!=="membership"||!["reserved","bound"].includes(r.status))throw Error("INVALID_BINDING");return r.status==="bound"&&await checkProviderBinding(db,"subscription",r.providerId,r)?"PAYMENT_PENDING":r.status==="reserved"&&r.dispatchState==="retryable"?"CHECKOUT_RETRYABLE":"RECONCILIATION_REQUIRED";}
 return {getOwnedActiveChild:owned,reserveAuthorizedCheckout,bindCheckoutOnce,claimDispatch,releaseUnsent,getStatus,getAuthorizedDepositBooking:async()=>null};
}
