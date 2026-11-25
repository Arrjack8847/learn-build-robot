// Server-only QA adapter. NOT a production membership store or public route.
// One bounded Wix row is the atomic source of truth for fictional payment,
// membership, processed event and outbox. Never split a commit across rows.
import {randomUUID} from "node:crypto";
const collection="SandboxBillingState";
const isFixture=id=>typeof id==="string"&&/^qa-j3-[a-z0-9-]{1,70}$/.test(id);
const safeKey=k=>typeof k==="string"&&/^[a-zA-Z0-9_:-]{1,200}$/.test(k)&&!["__proto__","constructor","prototype"].includes(k);
const own=(o,k)=>safeKey(k)&&Object.hasOwn(o,k)?o[k]:undefined;
const copy=v=>v===undefined?undefined:structuredClone(v);
export function createFixtureBillingStore({env,db,rowId}){
 if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.WIX_DEV_SITE_ID!=="09d613aa-3a95-42ff-9ee3-2aa0c706c447"||!isFixture(rowId))throw Error("QA_ONLY");
 const initial=()=>({schema:1,fixture:true,membership:{id:"qa-membership",environment:"sandbox",parentId:"qa-parent",childId:"qa-child",providerSubscriptionId:"qa-subscription",paymentStatus:"unpaid",subscriptionStatus:"active"},events:{},payments:{},outbox:{}});
 const encode=(state,version)=>{const stateJson=JSON.stringify(state);if(Buffer.byteLength(stateJson)>48000)throw Error("QA_LEDGER_LIMIT");return {environment:"sandbox-qa",stateVersion:version,stateJson}};
 const parse=row=>{if(row?.environment!=="sandbox-qa"||typeof row.stateVersion!=="string"||typeof row.stateJson!=="string"||Buffer.byteLength(row.stateJson)>48000)throw Error("INVALID_QA_ROW");const s=JSON.parse(row.stateJson);if(s.schema!==1||s.fixture!==true||s.membership?.id!=="qa-membership"||s.membership.parentId!=="qa-parent"||s.membership.childId!=="qa-child"||s.membership.providerSubscriptionId!=="qa-subscription"||!s.events||!s.payments||!s.outbox)throw Error("INVALID_QA_STATE");return s;};
 async function initialize(){let row=await db.get(collection,rowId);if(!row){await db.insert(collection,rowId,encode(initial(),randomUUID()));row=await db.get(collection,rowId);}return copy(parse(row));}
 async function read(){return parse(await db.get(collection,rowId));}
 async function mutate(fn){
  for(let attempt=0;attempt<12;attempt++){
   const row=await db.get(collection,rowId),state=parse(row),before=JSON.stringify(state);
   const result=await fn(state);
   if(JSON.stringify(state)===before)return copy(result);
   // Callback mutates only a detached draft. Exceptions never commit partial writes.
   // A failed validation result must not commit mutations.
   if(result?.ok===false)return copy(result);
   const next=encode(state,randomUUID());
   if(await db.replaceIfVersion(collection,rowId,row.stateVersion,next))return copy(result);
  }
  throw Error("QA_CAS_CONTENTION");
 }
 async function transaction(fn){return mutate(async s=>fn({
   getEvent:async k=>copy(own(s.events,k)),
   getMembershipBySubscription:async(e,k)=>e==="sandbox"&&k===s.membership.providerSubscriptionId?copy(s.membership):null,
   getPayment:async(e,k)=>e==="sandbox"?copy(own(s.payments,k)):null,
   putPaymentOnceOrTransition:async(p,prev)=>{if(!safeKey(p.id)||p.environment!=="sandbox"||p.membershipId!==s.membership.id||p.parentId!==s.membership.parentId||p.childId!==s.membership.childId||p.providerSubscriptionId!==s.membership.providerSubscriptionId||(own(s.payments,p.id)?.status??null)!==prev)throw Error("QA_PAYMENT_CONFLICT");s.payments[p.id]=copy(p);},
   patchMembership:async(id,p)=>{if(id!==s.membership.id||Object.keys(p).some(k=>!["paymentStatus","subscriptionStatus","nextChargeAt","lastCycle","lastProviderOccurredAt","lastKind","lastPaymentId","paidThroughMonth","paidThroughAt"].includes(k)))throw Error("QA_MEMBERSHIP_CONFLICT");Object.assign(s.membership,copy(p));},
   insertOutboxOnce:async j=>{if(!safeKey(j.deduplicationKey)||j.environment!=="sandbox"||j.parentId!==s.membership.parentId||j.childId!==s.membership.childId)throw Error("QA_OUTBOX_CONFLICT");if(!own(s.outbox,j.deduplicationKey))s.outbox[j.deduplicationKey]=copy(j);},
   completeEvent:async(k,outcome)=>{const e=own(s.events,k);if(!e)throw Error("QA_EVENT_MISSING");s.events[k]={...e,processingStatus:"processed",outcome};}
  }));}
 return {initialize,read,transaction,
  // Only known synthetic IDs are permitted here. Do not use this adapter for real webhook processing.
  insertVerifiedEventOnce:async e=>{if(!/^[a-f0-9]{64}$/.test(e.providerEventKey)||e.payloadDigest!==e.providerEventKey||e.environment!=="sandbox"||!/^qa-event-[0-9]+$/.test(e.providerObjectId)||e.processingStatus!=="pending")throw Error("QA_EVENT_ONLY");return mutate(s=>{if(!own(s.events,e.providerEventKey))s.events[e.providerEventKey]=copy(e);return s.events[e.providerEventKey];});},
  getVerifiedEventStrong:async k=>copy(own((await read()).events,k)),
  claimPendingEmail:async()=>mutate(s=>{const j=Object.values(s.outbox).find(v=>v.status==="pending");if(!j)return null;j.status="claimed";j.attemptCount=(j.attemptCount??0)+1;return j;}),
  getCommittedEmailDetails:async j=>{const s=await read(),p=own(s.payments,j.paymentId);return p?{...copy(p),paymentId:p.id,email:"qa-parent@example.invalid",childName:"QA fictional child"}:null;},
  markEmailCaptured:async k=>mutate(s=>{const j=own(s.outbox,k);if(!j||j.status!=="claimed")throw Error("QA_JOB_NOT_CLAIMED");j.status="captured";return true;}),
  markEmailReview:async k=>mutate(s=>{const j=own(s.outbox,k);if(!j||j.status!=="claimed")throw Error("QA_JOB_NOT_CLAIMED");j.status="review";return true;})
 };
}
