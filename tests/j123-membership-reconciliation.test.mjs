import test from "node:test";
import assert from "node:assert/strict";
import {createIntegratedCheckoutStore} from "../scripts/j123/checkout-store.mjs";
import {createMembershipReconciler,readIntegratedMembership,createMembershipReviewProcessor} from "../scripts/j123/membership-reconciliation.mjs";
import {BILLING_COLLECTION,checkoutKey,decodeCheckout} from "../scripts/j123/billing-records.mjs";
import {J123_BRANCH,J123_SITE,J123_ORIGIN,J123_PLAN,J123_TERMS} from "../scripts/j123/infrastructure.mjs";
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:J123_BRANCH,VERCEL_URL:"fixture.vercel.app",WIX_DEV_SITE_ID:J123_SITE,WIX_DEV_DATA_API_KEY:"fixture",RESEND_API_KEY:"fixture",RESEND_TEST_RECIPIENT:"fixture@gmail.com",PARENT_PREVIEW_OPEN_EMAIL:"1",PARENT_PREVIEW_VERIFIED_SENDER:"noreply@mail.bestemready.edu.my",PARENT_AUTH_SECRET:"0123456789abcdef".repeat(4),STUDENT_AUTH_SECRET:"fedcba9876543210".repeat(4),STUDENT_AUTH_ENABLED:"true",HITPAY_API_URL:J123_ORIGIN,HITPAY_PLAN_ID:J123_PLAN,HITPAY_CURRENCY:"MYR",HITPAY_MEMBERSHIP_AMOUNT:"360.00",HITPAY_SANDBOX_PAYMENT_METHOD:"touch_n_go",HITPAY_API_KEY:"DISABLED_J3_WIX_VAULT_ONLY",HITPAY_SALT_KEY:"DISABLED_J3_WIX_VAULT_ONLY",HITPAY_API_BASE_URL:"DISABLED_J3_WIX_VAULT_ONLY",J3_SANDBOX_ROTATION_CONFIRMED:"true",J123_CHECKOUT_ENABLED:"true",J123_GENUINE_WEBHOOK_ACCEPTED:"true",J123_PAYMENT_TERMS_VERSION:J123_TERMS,J123_MEMBERSHIP_RECONCILIATION_ENABLED:"true"};
const parent="qa-j2-"+"a".repeat(64),child="qa-j2-"+"b".repeat(64),sibling="qa-j2-"+"c".repeat(64),key="d".repeat(64),merchant="a34ebd5e-6bd2-4c62-a13d-b19f58f68fd7";
const now=1795680000000,periodStartAt=now-1000,periodEndAt=now+100000;
async function fixture(){
 const rows=new Map(),id=(c,k)=>c+":"+k;
 const db={get:async(c,k)=>structuredClone(rows.get(id(c,k))??null),insert:async(c,k,r)=>{if(rows.has(id(c,k)))return false;rows.set(id(c,k),structuredClone(r));return true;},replaceIfVersion:async(c,k,v,r)=>{if(rows.get(id(c,k))?.stateVersion!==v)return false;rows.set(id(c,k),structuredClone(r));return true;}};
 const store=createIntegratedCheckoutStore({db,env,childId:child,resolvePayer:async()=>({parentId:parent,childId:child}),clock:()=>now});
 const {reservation:r}=await store.reserveAuthorizedCheckout({kind:"membership",environment:"sandbox",parentId:parent,childId:child,requestKey:"j123-membership-v1",email:parent+"@example.invalid",currency:"MYR",amountMinor:36000,planId:J123_PLAN});
 assert.equal(await store.bindCheckoutOnce({attemptId:r.attemptId,reference:r.reference,providerId:"sub-one",environment:"sandbox",kind:"membership"}),true);
 const event={environment:"sandbox",eventType:"charge.created",providerObjectId:"charge-one",signatureVerifiedAt:{$date:new Date(now-500).toISOString()},payloadDigest:key,providerEventKey:key,processingStatus:"pending"};
 await db.insert("PaymentWebhookEvents",key,event);
 const observation={environment:"sandbox",businessId:merchant,eventKey:key,paymentId:"charge-one",subscriptionId:"sub-one",reference:r.reference,planId:J123_PLAN,status:"succeeded",refundedMinor:0,currency:"MYR",amountMinor:36000,periodEvidence:"verified_provider_billing_period",periodStartAt,periodEndAt,paidAt:now-700,cycleNumber:1,paymentMethod:"touch_n_go"};
 let calls=0;
 const make=(o=observation,e=env)=>createMembershipReconciler({env:e,db,clock:()=>now,provider:{reconcileVerifiedEvent:async binding=>{calls++;assert.equal(binding.subscriptionId,"sub-one");return o;}}});
 const state=async()=>decodeCheckout(await db.get(BILLING_COLLECTION,checkoutKey(child)),child);
 return {db,rows,make,observation,event,state,calls:()=>calls};
}
test("verified charge and period commit once with concurrent replay; sibling cannot inherit membership",async()=>{
 const f=await fixture(),reconcile=f.make();
 const result=await Promise.all([reconcile(child,key),reconcile(child,key),reconcile(child,key)]);
 assert.equal(result.filter(r=>r.status==="membership_committed").length,1);
 assert.equal(result.filter(r=>r.status==="duplicate").length,2);
 const s=await f.state();assert.equal(s.payments.length,1);assert.equal(s.membership.studentId,child);
 assert.equal((await readIntegratedMembership({env,db:f.db,studentId:child,now})).membershipStatus,"active");
 assert.equal(await readIntegratedMembership({env,db:f.db,studentId:sibling,now}),null);
 assert.equal((await readIntegratedMembership({env,db:f.db,studentId:child,now:periodEndAt})).membershipStatus,"expired");
 assert.equal(await readIntegratedMembership({env:{...env,J123_GENUINE_WEBHOOK_ACCEPTED:"false"},db:f.db,studentId:child,now}),null);
});
test("rejects foreign subscription, wrong method, amount, refund, merchant and missing period without activation",async()=>{
 const f=await fixture();for(const change of [{subscriptionId:"other"},{paymentMethod:"card"},{amountMinor:1},{refundedMinor:1},{businessId:"other"},{periodEvidence:"estimated"},{cycleNumber:3},{cycleNumber:2},{paidAt:now+1}]){
  assert.equal((await f.make({...f.observation,...change})(child,key)).ok,false);
  assert.equal((await f.state()).membership,undefined);
 }
});
test("gates, unsigned event, wrong event type and sibling refuse provider reconciliation",async()=>{
 const f=await fixture();
 for(const change of [{VERCEL_ENV:"production"},{J123_GENUINE_WEBHOOK_ACCEPTED:"false"},{J123_MEMBERSHIP_RECONCILIATION_ENABLED:"false"}])assert.equal((await f.make(f.observation,{...env,...change})(child,key)).ok,false);
 assert.equal((await f.make()(sibling,key)).ok,false);
 f.rows.set("PaymentWebhookEvents:"+key,{...f.event,signatureVerifiedAt:null});
 assert.equal((await f.make()(child,key)).ok,false);
 f.rows.set("PaymentWebhookEvents:"+key,{...f.event,eventType:"recurring_billing.method_attached"});
 assert.equal((await f.make()(child,key)).ok,false);assert.equal(f.calls(),0);
});

test("refund evidence places only the bound student under review; duplicate event is idempotent",async()=>{
 const f=await fixture();assert.equal((await f.make()(child,key)).status,"membership_committed");
 const adverseKey="e".repeat(64),event={...f.event,eventType:"charge.updated",providerEventKey:adverseKey,payloadDigest:adverseKey};
 await f.db.insert("PaymentWebhookEvents",adverseKey,event);
 const observation={...f.observation,eventKey:adverseKey,refundedMinor:100,observedAt:now};
 const make=o=>createMembershipReviewProcessor({env,db:f.db,clock:()=>now,provider:{reconcileAdverseEvent:async()=>o}});
 assert.equal((await make({...observation,subscriptionId:"foreign"})(child,adverseKey)).ok,false);
 assert.equal((await make({...observation,refundedMinor:0})(child,adverseKey)).ok,false);
 const result=await Promise.all([make(observation)(child,adverseKey),make(observation)(child,adverseKey)]);
 assert.equal(result.filter(r=>r.status==="review_required").length,1);assert.equal(result.filter(r=>r.status==="duplicate").length,1);
 assert.equal((await readIntegratedMembership({env,db:f.db,studentId:child,now})).membershipStatus,"verification_required");
 assert.equal((await f.state()).payments.length,1);assert.equal((await f.make()(child,key)).ok,false);
 assert.equal(await readIntegratedMembership({env,db:f.db,studentId:sibling,now}),null);
});
test("verified cancellation or method detachment cannot grant membership; a genuine adverse event sets a review hold",async()=>{
 for(const [eventType,patch] of [["recurring_billing.subscription_updated",{subscriptionStatus:"cancelled"}],["recurring_billing.method_detached",{methodAttached:false}]]){
  const f=await fixture(),k="f".repeat(64);
  await f.db.insert("PaymentWebhookEvents",k,{...f.event,eventType,providerObjectId:"sub-one",providerEventKey:k,payloadDigest:k});
  const run=createMembershipReviewProcessor({env,db:f.db,clock:()=>now,provider:{reconcileAdverseEvent:async()=>({...f.observation,eventKey:k,observedAt:now,...patch})}});
  assert.equal((await run(child,k)).ok,false);
  assert.equal((await f.make()(child,key)).status,"membership_committed");
  assert.equal((await run(child,k)).status,"review_required");
  assert.equal((await readIntegratedMembership({env,db:f.db,studentId:child,now})).verifiedLearningEligibility,false);
 }
});
test("disabling new checkouts preserves verified membership but disabling webhook acceptance denies it",async()=>{
 const f=await fixture();await f.make()(child,key);
 assert.equal((await readIntegratedMembership({env:{...env,J123_CHECKOUT_ENABLED:"false"},db:f.db,studentId:child,now})).membershipStatus,"active");
});
