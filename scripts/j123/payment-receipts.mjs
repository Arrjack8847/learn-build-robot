// Private sandbox receipt outbox in the same CAS aggregate as the verified payment.
import {createHash,randomUUID} from "node:crypto";
import {createAuthCrypto,previewRecipients,validPreviewEmail} from "../parent-auth/secure-auth-transport.mjs";
import {createFamilyPreview} from "../parent-auth/family-preview.mjs";
import {membershipProcessingEnabled} from "./membership-provider.mjs";
import {J123_TERMS,billingIdentityEnv} from "./infrastructure.mjs";
import {BILLING_COLLECTION,validStudent,validProvider,checkoutKey,decodeCheckout,encodeCheckout,checkProviderBinding} from "./billing-records.mjs";
const hash=x=>createHash("sha256").update(x).digest("hex");
const digest=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const time=x=>Number.isSafeInteger(x)&&x>0;
const epoch=x=>Number.isSafeInteger(x)?x:Date.parse(typeof x==="string"?x:x?.$date);
const receiptKey=id=>"j123-receipt-v1-"+hash(id);
const windowMs=23*3600000,leaseMs=60000,maxAttempts=3;
const enabled=env=>membershipProcessingEnabled(env)&&env.J123_PAYMENT_EMAIL_ENABLED==="true";
export function newPaymentReceipt(payment,now){
 if(!validProvider(payment?.providerPaymentId)||!digest(payment.eventKey)||!time(now))throw Error("INVALID_RECEIPT");
 return {id:receiptKey(payment.providerPaymentId),providerPaymentId:payment.providerPaymentId,eventKey:payment.eventKey,status:"pending",attempts:0,createdAt:now};
}
// Only controlled preview inboxes explicitly configured by the operator.
// Match the verified parent's digest; never send to the synthetic @example.invalid address or a generic fallback.
export function approvedReceiptRecipient(env,parentId){
 if(!validStudent(parentId))return null;
 const crypto=createAuthCrypto(env),matches=previewRecipients(env).filter(e=>validPreviewEmail(e)&&!e.endsWith(".invalid")&&"qa-j2-"+crypto.identityDigest("parent-preview-session",e)===parentId);
 return matches.length===1?matches[0]:null;
}
const myt=t=>new Date(t+8*3600000).toISOString().slice(0,16).replace("T"," ")+" MYT";
async function messageFor({env,db,clock,state,job}){
 const r=state.reservation,p=state.payments?.find(x=>x.providerPaymentId===job.providerPaymentId);
 if(!p||job.id!==receiptKey(p.providerPaymentId)||job.eventKey!==p.eventKey||p.environment!=="sandbox"||p.purpose!=="membership"||p.studentId!==r.childId||p.parentId!==r.parentId||p.attemptId!==r.attemptId||p.reference!==r.reference||p.providerSubscriptionId!==r.providerId||p.currency!=="MYR"||p.amountMinor!==36000||![1,2].includes(p.cycleNumber)||![p.paidAt,p.periodStartAt,p.periodEndAt].every(time)||p.periodEndAt<=p.periodStartAt||p.paidAt>clock()||state.membership?.studentId!==r.childId||state.membership?.source!=="verified_membership_ledger"||state.membership?.state!=="paid"||state.membership?.policyReviewRequired===true||r.status!=="bound"||r.termsVersion!==J123_TERMS||!await checkProviderBinding(db,"subscription",r.providerId,r)||!await checkProviderBinding(db,"charge",p.providerPaymentId,r))return null;
 const e=await db.get("PaymentWebhookEvents",p.eventKey);
 if(!e||e.environment!=="sandbox"||e.eventType!=="charge.created"||e.providerObjectId!==p.providerPaymentId||e.payloadDigest!==p.eventKey||e.providerEventKey!==p.eventKey||!["pending","processed","duplicate"].includes(e.processingStatus)||!time(epoch(e.signatureVerifiedAt))||epoch(e.signatureVerifiedAt)>clock())return null;
 const recipient=approvedReceiptRecipient(env,r.parentId);if(!recipient)return null;
 const family=createFamilyPreview({db,crypto:createAuthCrypto(env),clock:{now:clock},resolveSession:async()=>({accountType:"parent-test",accountId:r.parentId.slice(6)})});
 const child=await family.handle("internal","family-child-get",{childId:r.childId});
 if(!child.ok||child.child?.id!==r.childId)return null;
 return {from:"BE STEM READY <noreply@mail.bestemready.edu.my>",to:[recipient],subject:"STEM Makers Lab — Sandbox payment confirmed",text:["SANDBOX TEST — No real money was charged.","Student: "+child.child.name,"Student account reference: "+r.childId.slice(-12),"Payment amount: RM360.00","Payment method: Touch 'n Go (sandbox)","Billing cycle: "+p.cycleNumber+" of 2","Verified payment: "+myt(p.paidAt),"Coverage: "+myt(p.periodStartAt)+" to "+myt(p.periodEndAt),"Payment reference: "+p.providerPaymentId,"This confirms a verified test payment, not current access eligibility or a real financial receipt."].join("\n")};
}
function validJobs(state){
 const jobs=state.receipts??[];
 return Array.isArray(jobs)&&jobs.length<=2&&jobs.every(j=>j&&validProvider(j.providerPaymentId)&&j.id===receiptKey(j.providerPaymentId)&&digest(j.eventKey)&&time(j.createdAt)&&Number.isInteger(j.attempts)&&j.attempts>=0&&j.attempts<=maxAttempts&&["pending","claimed","accepted","review"].includes(j.status))&&new Set(jobs.map(j=>j.id)).size===jobs.length?jobs:null;
}
// Claim and release via CAS; request is immutable by payload digest, and provider key is fixed.
// Resend's retention is 24h; never retry an ambiguous send after our conservative 23h window.
export async function flushPaymentReceipts({env,db,studentId,requestFn=fetch,clock=()=>Date.now(),newId=randomUUID}){
 if(!enabled(env))return "disabled";
 try{env=billingIdentityEnv(env);}catch{return "disabled";}
 if(!validStudent(studentId))return "review_required";
 try{
  const key=checkoutKey(studentId);
  let row=await db.get(BILLING_COLLECTION,key);if(!row)return "none";
  let state=decodeCheckout(row,studentId),jobs=validJobs(state);
  if(!jobs)return "review_required";
  if(state.membership?.policyReviewRequired===true)return "review_required";
  let pending=false,review=false;
  async function change(old,s,job,next){
   const receipts=s.receipts.map(x=>x.id===job.id?next:x),encoded=encodeCheckout({...s,receipts},newId);
   if(await db.replaceIfVersion(BILLING_COLLECTION,key,old.stateVersion,encoded)!==true)return false;
   const saved=decodeCheckout(await db.get(BILLING_COLLECTION,key),studentId);
   return JSON.stringify(saved.receipts?.find(x=>x.id===job.id))===JSON.stringify(next);
  }
  for(const initial of jobs){
   row=await db.get(BILLING_COLLECTION,key);state=decodeCheckout(row,studentId);jobs=validJobs(state);
   if(!jobs||state.membership?.policyReviewRequired===true)return "review_required";
   const j=jobs.find(x=>x.id===initial.id);if(!j)return "review_required";
   if(j.status==="accepted")continue;
   if(j.status==="review"){review=true;continue;}
   const now=clock();
   if(!time(now)||j.createdAt>now)return "review_required";
   if(j.status==="claimed"&&(!time(j.leaseUntil)||!time(j.firstAttemptAt)||!digest(j.payloadDigest)))return "review_required";
   if(j.status==="claimed"&&j.leaseUntil>now||j.nextAttemptAt>now){pending=true;continue;}
   const first=j.firstAttemptAt??now;
   if(!time(first)||first>now||now-first>=windowMs||j.attempts>=maxAttempts){
    if(!await change(row,state,j,{...j,status:"review",reason:"retry_window_closed"}))pending=true;else review=true;
    continue;
   }
   const message=await messageFor({env,db,clock,state,job:j});
   if(!message){pending=true;continue;}
   const body=JSON.stringify(message),payloadDigest=hash(body);
   if(j.payloadDigest&&j.payloadDigest!==payloadDigest){
    if(!await change(row,state,j,{...j,status:"review",reason:"receipt_payload_changed"}))pending=true;else review=true;
    continue;
   }
   const claim={...j,status:"claimed",attempts:j.attempts+1,firstAttemptAt:first,leaseUntil:now+leaseMs,payloadDigest,claimId:newId()};
   if(!await change(row,state,j,claim)){pending=true;continue;}
   // Re-read the claim and review hold before any network request. A receipt is historical evidence, not an activation grant.
   const claimedRow=await db.get(BILLING_COLLECTION,key),claimedState=decodeCheckout(claimedRow,studentId);
   if(claimedState.membership?.policyReviewRequired===true)return "review_required";
   const current=claimedState.receipts?.find(x=>x.id===j.id);
   if(current?.claimId!==claim.claimId||current.status!=="claimed"||clock()-first>=windowMs||clock()>=claim.leaseUntil){pending=true;continue;}
   const confirmed=await messageFor({env,db,clock,state:claimedState,job:current});
   if(!confirmed||hash(JSON.stringify(confirmed))!==payloadDigest){pending=true;continue;}
   let next;
   try{
    const response=await requestFn("https://api.resend.com/emails",{method:"POST",headers:{Authorization:"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json","Idempotency-Key":j.id},body,redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw Error("EMAIL_UNCONFIRMED");
    const result=await response.json();if(!validProvider(result?.id))throw Error("EMAIL_UNCONFIRMED");
    // Provider acceptance is not proof of inbox delivery.
    next={...claim,status:"accepted",providerEmailId:result.id,acceptedAt:clock()};
   }catch{next={...claim,status:"pending",nextAttemptAt:clock()+leaseMs};}
   const latestRow=await db.get(BILLING_COLLECTION,key),latest=decodeCheckout(latestRow,studentId),latestJob=latest.receipts?.find(x=>x.id===j.id);
   if(latestJob?.claimId!==claim.claimId||latestJob.status!=="claimed"||!await change(latestRow,latest,latestJob,next)){pending=true;continue;}
   if(next.status!=="accepted")pending=true;
  }
  return pending?"pending":review?"review_required":jobs.length?"accepted":"none";
 }catch{return "pending";}
}
