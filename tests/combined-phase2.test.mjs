import test from "node:test";
import assert from "node:assert/strict";
import {createJ12345IdentityEnv,J12345_BRANCH,isCombinedIdentityPreview} from "../scripts/j12345/identity-scope.mjs";
import {COMBINED_BRANCH,COMBINED_SITE} from "../scripts/combined/scope.mjs";
import {createAuthCrypto} from "../scripts/parent-auth/secure-auth-transport.mjs";
import {createCombinedParentChildResolver} from "../scripts/j2-runtime.mjs";
import {createCombinedIdentityMembership} from "../scripts/combined/identity-membership.mjs";
import {scopeJ1234BillingStore} from "../scripts/j1234/billing-scope.mjs";
import {createIntegratedCheckoutHttp} from "../scripts/j123/checkout-http.mjs";
import {readJ12345MembershipObservation} from "../scripts/j1234/billing-projection.mjs";
import {BILLING_COLLECTION,checkoutKey,decodeCheckout,encodeCheckout,checkProviderBinding} from "../scripts/j123/billing-records.mjs";
import {COMBINED_MEMBERSHIP_TERMS,J123_TERMS,J123_ORIGIN,J123_PLAN,j123InfrastructureStatus} from "../scripts/j123/infrastructure.mjs";
const root="0123456789abcdef".repeat(4),oldRoot="fedcba9876543210".repeat(4);
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:COMBINED_BRANCH,VERCEL_URL:"fixture.vercel.app",WIX_DEV_SITE_ID:COMBINED_SITE,WIX_DEV_DATA_API_KEY:"fixture",RESEND_API_KEY:"fixture",PARENT_PREVIEW_VERIFIED_SENDER:"noreply@mail.bestemready.edu.my",COMBINED_RUNTIME_ENABLED:"1",COMBINED_SCHEDULING_ENABLED:"1",COMBINED_IDENTITY_ENABLED:"1",COMBINED_AUTH_ROOT:root,COMBINED_TEST_EMAILS:"alpha@example.invalid,beta@example.invalid",J12345_AUTH_ROOT:oldRoot,J12345_TEST_EMAILS:"alpha@example.invalid",J12345_REGISTRATION_ENABLED:"1",STUDENT_AUTH_ENABLED:"true",J12345_BILLING_ENABLED:"1",J12345_BILLING_READ_ENABLED:"1",HITPAY_API_URL:J123_ORIGIN,HITPAY_PLAN_ID:J123_PLAN,HITPAY_CURRENCY:"MYR",HITPAY_MEMBERSHIP_AMOUNT:"360.00",HITPAY_SANDBOX_PAYMENT_METHOD:"touch_n_go",HITPAY_API_KEY:"DISABLED_J3_WIX_VAULT_ONLY",HITPAY_SALT_KEY:"DISABLED_J3_WIX_VAULT_ONLY",HITPAY_API_BASE_URL:"DISABLED_J3_WIX_VAULT_ONLY",J3_SANDBOX_ROTATION_CONFIRMED:"true",J123_GENUINE_WEBHOOK_ACCEPTED:"true",COMBINED_PROVIDER_ACCEPTED:"1",COMBINED_PAYMENT_TERMS_VERSION:COMBINED_MEMBERSHIP_TERMS,J123_CHECKOUT_ENABLED:"true",J123_MEMBERSHIP_RECONCILIATION_ENABLED:"true",J123_PROVIDER_PERIOD_SCHEMA:"confirmed_charge_billing_period_v1"};
const origin="https://"+env.VERCEL_URL,now=1795755600000,token="a".repeat(43);
const childId="qa-j2-"+"c".repeat(64),sibling="qa-j2-"+"d".repeat(64),parentId="qa-j2-"+createAuthCrypto(createJ12345IdentityEnv(env)).identityDigest("parent-preview-session","alpha@example.invalid");
const owner={childId,parentId,stateVersion:"child-v1",name:"Test Child",accountStatus:"preview-test"};
function dbFixture(){const rows=new Map(),k=(c,i)=>c+":"+i;return {get:async(c,i)=>structuredClone(rows.get(k(c,i))??null),insert:async(c,i,r)=>{if(rows.has(k(c,i)))return false;rows.set(k(c,i),structuredClone(r));return true;},replaceIfVersion:async(c,i,v,r)=>{if(rows.get(k(c,i))?.stateVersion!==v)return false;rows.set(k(c,i),structuredClone(r));return true;}};}
test("combined keys, scopes and provider acceptance are independent",()=>{
 const cfg=createJ12345IdentityEnv(env),prior=createJ12345IdentityEnv({...env,VERCEL_GIT_COMMIT_REF:J12345_BRANCH});
 assert.notEqual(cfg.PARENT_AUTH_SECRET,prior.PARENT_AUTH_SECRET);assert.notEqual(cfg.STUDENT_AUTH_SECRET,prior.STUDENT_AUTH_SECRET);assert.notEqual(cfg.PARENT_AUTH_SECRET,cfg.STUDENT_AUTH_SECRET);
 assert.equal(j123InfrastructureStatus(env).checkoutReady,true);
 for(const changed of [{COMBINED_RUNTIME_ENABLED:"0"},{COMBINED_IDENTITY_ENABLED:"0"},{COMBINED_SCHEDULING_ENABLED:"0"},{NIZAR_FIXTURE_ENABLED:"1"},{VERCEL_ENV:"production"},{WIX_DEV_SITE_ID:"wrong"},{COMBINED_AUTH_ROOT:oldRoot},{COMBINED_MEMBERSHIP_WORKER_SECRET:root}]){
  assert.throws(()=>createJ12345IdentityEnv({...env,...changed}));
  assert.equal(j123InfrastructureStatus({...env,...changed}).checkoutReady,false);
 }
 assert.throws(()=>scopeJ1234BillingStore(dbFixture(),{...env,COMBINED_RUNTIME_ENABLED:"0"}));
 for(const changed of [{COMBINED_PROVIDER_ACCEPTED:"0",J12345_PROVIDER_ACCEPTED:"1"},{COMBINED_PAYMENT_TERMS_VERSION:J123_TERMS},{J123_PROVIDER_PERIOD_SCHEMA:""},{J12345_BILLING_READ_ENABLED:"0"}])assert.equal(j123InfrastructureStatus({...env,...changed}).checkoutReady,false);
});
test("parent resolution uses the selected child's current consent and ownership; mixed cookies, revoked or stale sessions refused",async()=>{
 let active=true,stale=false,calls=0;
 const resolve=createCombinedParentChildResolver({getStudentContext:()=>({locate:async t=>t===token&&active?{parentId}:null,familyFor:p=>({handle:async(_a,_b,{childId:id})=>p===parentId&&id===childId?{ok:true,child:{id,name:owner.name,version:stale?"changed":owner.stateVersion}}:{ok:false}})}),readChild:async id=>{calls++;return id===childId?owner:null;}});
 const request=cookie=>new Request(origin+"/api/dev/combined/booking",{headers:{cookie}});
 const good="__Host-bsr-parent-test="+token;
 assert.deepEqual(await resolve(request(good),env,childId),owner);
 assert.equal(await resolve(request(good),env,sibling),null);
 assert.equal(await resolve(request(good+"; __Host-bsr-student="+token),env,childId),null);
 assert.equal(await resolve(request(good+"; "+good),env,childId),null);
 stale=true;assert.equal(await resolve(request(good),env,childId),null);
 stale=false;active=false;assert.equal(await resolve(request(good),env,childId),null);
 assert.equal(await resolve(request(good),{...env,COMBINED_IDENTITY_ENABLED:"0"},childId),null);
 assert.equal(calls,2);
});
test("combined checkout requires its own explicit policy version and stores it; never activates on return",async()=>{
 const db=dbFixture(),calls=[];
 const http=createIntegratedCheckoutHttp({resolvePayer:async(_r,_e,id)=>id===childId?{parentId,childId,email:parentId+"@example.invalid"}:null,storeFactory:()=>db,clock:()=>now,requestFn:async(url,opt)=>{calls.push(url);if(url.startsWith("https://www.wixapis.com/"))return Response.json({value:"fixture-vault"});if(url.includes("/v1/subscription-plan/"))return Response.json({id:J123_PLAN,currency:"MYR",amount:"360.00",cycle:"monthly",times_to_be_charged:2});if(url.endsWith("/v1/recurring-billing"))return Response.json({id:"sub-combined-fixture",url:"https://securecheckout.sandbox.hit-pay.com/fixture"});throw Error("Unexpected provider");}});
 const request=(id,terms)=>new Request(origin+"/api/dev/j123/checkout",{method:"POST",headers:{origin,"sec-fetch-site":"same-origin","x-stem-j123":"1","content-type":"application/json"},body:JSON.stringify({childId:id,requestKey:"fixture-1",termsVersion:terms})});
 assert.equal((await http(request(childId,J123_TERMS),env)).status,400);
 assert.equal((await http(request(sibling,COMBINED_MEMBERSHIP_TERMS),env)).status,401);
 assert.equal(calls.length,0);
 assert.equal((await http(request(childId,COMBINED_MEMBERSHIP_TERMS),env)).status,200);
 const key=checkoutKey(childId),r=decodeCheckout(await db.get(BILLING_COLLECTION,"combined-"+key),childId).reservation;
 assert.equal(r.termsVersion,COMBINED_MEMBERSHIP_TERMS);assert.equal(r.termsAcceptedAt,now);
 assert.equal(await db.get(BILLING_COLLECTION,key),null);
 assert.equal(await db.get(BILLING_COLLECTION,"j12345-"+key),null);
 const status=await readJ12345MembershipObservation({env,db,studentId:childId,parentId,now});
 assert.equal(status.membershipStatus,"payment_pending");assert.equal(status.verifiedLearningEligibility,false);
});
test("paid coverage is accepted only with scoped ledger, bound provider charge and signature evidence; sibling, expiry and ownership change fail",async()=>{
 const db=dbFixture(),scoped=scopeJ1234BillingStore(db,env),eventKey="e".repeat(64),paymentId="combined-charge",subscriptionId="combined-subscription";
 const r={kind:"membership",environment:"sandbox",parentId,childId,requestKey:"j123-membership-v1",email:parentId+"@example.invalid",currency:"MYR",amountMinor:36000,planId:J123_PLAN,attemptId:"combined-attempt",reference:"combined-reference",status:"bound",dispatchState:"dispatched",termsVersion:COMBINED_MEMBERSHIP_TERMS,termsAcceptedAt:now-10000,providerId:subscriptionId};
 const paidAt=now-5000,validUntil=now+86400000;
 const payment={environment:"sandbox",purpose:"membership",attemptId:r.attemptId,parentId,studentId:childId,reference:r.reference,providerPaymentId:paymentId,providerSubscriptionId:subscriptionId,amountMinor:36000,currency:"MYR",paidAt,periodStartAt:paidAt,periodEndAt:validUntil,cycleNumber:1,eventKey};
 const membership={studentId:childId,environment:"sandbox",source:"verified_membership_ledger",state:"paid",providerPaymentId:paymentId,activatedAt:paidAt,validFrom:paidAt,validUntil};
 await scoped.insert(BILLING_COLLECTION,checkoutKey(childId),encodeCheckout({scope:"j123-checkout-v1",reservation:r,payments:[payment],membership}));
 let profile={...owner},t=now;
 const identity=createCombinedIdentityMembership({env,db,readChild:async id=>id===childId?profile:id===sibling?{...owner,childId:sibling}:null,resolveParent:async()=>profile,clock:()=>t});
 assert.notEqual((await identity.readEligibility(owner)).membership,"active");
 assert.equal(await checkProviderBinding(scoped,"subscription",subscriptionId,r,{reserve:true}),true);
 assert.equal(await checkProviderBinding(scoped,"charge",paymentId,r,{reserve:true}),true);
 assert.notEqual((await identity.readEligibility(owner)).membership,"active");
 await db.insert("PaymentWebhookEvents",eventKey,{environment:"sandbox",eventType:"charge.created",providerObjectId:paymentId,providerEventKey:eventKey,payloadDigest:eventKey,processingStatus:"pending",signatureVerifiedAt:now-1000});
 assert.deepEqual(await identity.readEligibility(owner),{membership:"active",deposit:"clear",validUntil});
 assert.equal((await identity.readEligibility({...owner,childId:sibling})).membership,"inactive");
 assert.equal(await identity.readOwner(childId,"qa-j2-"+"f".repeat(64)),null);
 profile={...owner,stateVersion:"changed"};assert.notEqual((await identity.readEligibility(owner)).membership,"active");
 profile=owner;t=validUntil;assert.equal((await identity.readEligibility(owner)).membership,"inactive");
});
