import test from "node:test";
import assert from "node:assert/strict";
import {createIntegratedCheckoutStore} from "../scripts/j123/checkout-store.mjs";
import {createIntegratedCheckoutHttp} from "../scripts/j123/checkout-http.mjs";
import {reconcileStudentCheckoutStatus,dispatchVerifiedMembershipEvent} from "../scripts/j123/membership-runtime.mjs";
import {createMembershipWorkerHttp} from "../scripts/j123/membership-worker-http.mjs";
import {createAuthCrypto} from "../scripts/parent-auth/secure-auth-transport.mjs";
import {flushPaymentReceipts} from "../scripts/j123/payment-receipts.mjs";
import {BILLING_COLLECTION,checkoutKey,decodeCheckout} from "../scripts/j123/billing-records.mjs";
import {J123_BRANCH,J123_SITE,J123_ORIGIN,J123_PLAN,J123_TERMS} from "../scripts/j123/infrastructure.mjs";
import {J123_MERCHANT,createMembershipProviderReader} from "../scripts/j123/membership-provider.mjs";
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:J123_BRANCH,VERCEL_URL:"fixture.vercel.app",WIX_DEV_SITE_ID:J123_SITE,WIX_DEV_DATA_API_KEY:"fixture-wix",RESEND_API_KEY:"fixture",RESEND_TEST_RECIPIENT:"fixture@gmail.com",PARENT_PREVIEW_OPEN_EMAIL:"1",PARENT_PREVIEW_VERIFIED_SENDER:"noreply@mail.bestemready.edu.my",PARENT_AUTH_SECRET:"0123456789abcdef".repeat(4),STUDENT_AUTH_SECRET:"fedcba9876543210".repeat(4),STUDENT_AUTH_ENABLED:"true",HITPAY_API_URL:J123_ORIGIN,HITPAY_PLAN_ID:J123_PLAN,HITPAY_CURRENCY:"MYR",HITPAY_MEMBERSHIP_AMOUNT:"360.00",HITPAY_SANDBOX_PAYMENT_METHOD:"touch_n_go",HITPAY_API_KEY:"DISABLED_J3_WIX_VAULT_ONLY",HITPAY_SALT_KEY:"DISABLED_J3_WIX_VAULT_ONLY",HITPAY_API_BASE_URL:"DISABLED_J3_WIX_VAULT_ONLY",J3_SANDBOX_ROTATION_CONFIRMED:"true",J123_CHECKOUT_ENABLED:"false",J123_GENUINE_WEBHOOK_ACCEPTED:"true",J123_PAYMENT_TERMS_VERSION:J123_TERMS,J123_MEMBERSHIP_RECONCILIATION_ENABLED:"true",J123_PROVIDER_PERIOD_SCHEMA:"confirmed_charge_billing_period_v1"};
const parent="qa-j2-"+"a".repeat(64),child="qa-j2-"+"b".repeat(64),sibling="qa-j2-"+"c".repeat(64),foreign="qa-j2-"+"f".repeat(64),eventKey="d".repeat(64);
const now=1795680000000,accepted=now-86400000,iso=n=>new Date(n).toISOString();
async function fixture({payerId=parent,emailHandler}={}){
 const parent=payerId;
 const rows=new Map(),events=[],calls=[],k=(c,i)=>c+":"+i;
 let tick=now;
 const db={get:async(c,i)=>structuredClone(rows.get(k(c,i))??null),insert:async(c,i,r)=>{if(rows.has(k(c,i)))return false;rows.set(k(c,i),structuredClone(r));return true;},replaceIfVersion:async(c,i,v,r)=>{if(rows.get(k(c,i))?.stateVersion!==v)return false;rows.set(k(c,i),structuredClone(r));return true;},listMembershipInbox:async()=>structuredClone(events)};
 const s=createIntegratedCheckoutStore({db,env,childId:child,resolvePayer:async()=>({parentId:parent,childId:child}),clock:()=>accepted});
 const {reservation:r}=await s.reserveAuthorizedCheckout({kind:"membership",environment:"sandbox",parentId:parent,childId:child,requestKey:"j123-membership-v1",email:parent+"@example.invalid",currency:"MYR",amountMinor:36000,planId:J123_PLAN});
 assert.equal(await s.claimDispatch(r),true);
 assert.equal(await s.bindCheckoutOnce({attemptId:r.attemptId,reference:r.reference,providerId:"sub-one",environment:"sandbox",kind:"membership"}),true);
 const providerSub={id:"sub-one",business_id:J123_MERCHANT,business_recurring_plans_id:J123_PLAN,reference:r.reference,currency:"myr",amount:"360.00",cycle:"monthly",times_to_be_charged:2,status:"active"};
 const providerCharge={id:"charge-one",business_id:J123_MERCHANT,target_id:"sub-one",target_type:"business_recurring_plan",status:"succeeded",currency:"myr",amount:"360.00",refunded_amount:"0.00",payment_method:{code:"touch_n_go",display_logo:{method:"touch_n_go"}},closed_at:iso(now-700),billing_period:{start_at:iso(now-1000),end_at:iso(now+86400000),cycle_number:1}};
 const providerCharges=new Map([["charge-one",providerCharge]]);
 const requestFn=async(url,opt)=>{
  calls.push({url,method:opt.method});
  if(url==="https://api.resend.com/emails"){assert.ok(emailHandler);return emailHandler(opt);}
  assert.equal(opt.method,"GET");assert.equal(opt.redirect,"error");
  if(url.startsWith("https://www.wixapis.com/"))return Response.json({value:"vault-sandbox-key"});
  assert.ok(url.startsWith(J123_ORIGIN+"/v1/"));assert.equal(opt.headers["X-BUSINESS-API-KEY"],"vault-sandbox-key");
  const id=url.split("/").at(-1);
  const value=url.includes("/charges/")?providerCharges.get(id):url.includes("/recurring-billing/")&&id==="sub-one"?providerSub:null;
  return value?Response.json(value):new Response(null,{status:404});
 };
 async function add(key,type="charge.created",object="charge-one",patch={}){
  const e={environment:"sandbox",eventType:type,providerObjectId:object,providerEventKey:key,payloadDigest:key,signatureVerifiedAt:{$date:iso(tick-100)},processingStatus:"pending",...patch};
  await db.insert("PaymentWebhookEvents",key,e);events.push(e);
 }
 const run=(e=env,id=child,p=parent)=>reconcileStudentCheckoutStatus({env:e,db,studentId:id,parentId:p,requestFn,clock:()=>tick});
 const state=async()=>decodeCheckout(await db.get(BILLING_COLLECTION,checkoutKey(child)),child);
 const statusHttp=(e=env)=>createIntegratedCheckoutHttp({resolvePayer:async(_,__,id)=>id===child?{parentId:parent,childId:child,email:parent+"@example.invalid"}:null,storeFactory:()=>db,requestFn,clock:()=>tick})(new Request("https://fixture.vercel.app/api/dev/j123/checkout/status",{method:"POST",headers:{origin:"https://fixture.vercel.app","sec-fetch-site":"same-origin","x-stem-j123":"1","content-type":"application/json"},body:JSON.stringify({childId:child})}),e);
 return {db,rows,events,calls,providerCharge,providerCharges,providerSub,add,run,state,statusHttp,requestFn,clock:()=>tick,advance:ms=>{tick+=ms;}};
}
test("signed Wix inbox automatically commits only the exact bound student's independently verified payment",async()=>{
 const f=await fixture();await f.add(eventKey);
 assert.equal(await f.run(env,child,foreign),null);assert.equal(f.calls.length,0);
 assert.equal(await f.run(env,sibling),null);assert.equal(f.calls.length,0);
 assert.equal(await f.run({...env,J123_MEMBERSHIP_RECONCILIATION_ENABLED:"false"}),null);assert.equal(f.calls.length,0);
 const results=await Promise.all([f.run(),f.run(),f.run()]);
 assert.deepEqual(results,["MEMBERSHIP_ACTIVE","MEMBERSHIP_ACTIVE","MEMBERSHIP_ACTIVE"]);
 const s=await f.state();assert.equal(s.payments.length,1);assert.equal(s.membership.studentId,child);
 assert.equal(f.calls.every(c=>c.method==="GET"),true);
 const count=f.calls.length;assert.equal(await f.run(),"MEMBERSHIP_ACTIVE");assert.equal(f.calls.length,count);
});
test("period mapping, exact method, explicit refund, merchant and subscription evidence are mandatory",async()=>{
 for(const edit of [f=>delete f.providerCharge.billing_period,f=>delete f.providerCharge.refunded_amount,f=>f.providerCharge.payment_method={code:"card"},f=>f.providerCharge.target_id="foreign-sub",f=>f.providerSub.reference="wrong",f=>f.providerCharge.business_id="wrong",f=>f.providerCharge.closed_at="2026-11-26 00:00:00"]){
  const f=await fixture();await f.add(eventKey);edit(f);
  assert.notEqual(await f.run(),"MEMBERSHIP_ACTIVE");assert.equal((await f.state()).membership,undefined);
 }
 const f=await fixture();await f.add(eventKey);
 assert.equal(await f.run({...env,J123_PROVIDER_PERIOD_SCHEMA:""}),"PAYMENT_VERIFICATION_REQUIRED");
 assert.equal((await f.state()).membership,undefined);
});
test("unsigned, old and overflowing inbox windows fail closed before provider reads",async()=>{
 for(const patch of [{signatureVerifiedAt:null},{signatureVerifiedAt:{$date:iso(accepted-1)}},{payloadDigest:"e".repeat(64)}]){
  const f=await fixture();await f.add(eventKey,"charge.created","charge-one",patch);
  assert.equal(await f.run(),"PAYMENT_VERIFICATION_REQUIRED");assert.equal(f.calls.length,0);
 }
 const f=await fixture();for(let i=0;i<13;i++)await f.add(i.toString(16).padStart(64,"0"));
 assert.equal(await f.run(),"PAYMENT_VERIFICATION_REQUIRED");assert.equal(f.calls.length,0);
});
test("verified refund arrives later, review hold is automatic and replay cannot reinstate membership",async()=>{
 const f=await fixture();await f.add(eventKey);assert.equal(await f.run(),"MEMBERSHIP_ACTIVE");
 f.advance(5000);f.providerCharge.refunded_amount="100.00";
 await f.add("e".repeat(64),"charge.updated");
 assert.equal(await f.run(),"MEMBERSHIP_REVIEW_REQUIRED");assert.equal((await f.state()).membership.policyReviewRequired,true);
 assert.equal(await f.run(),"MEMBERSHIP_REVIEW_REQUIRED");assert.equal((await f.state()).payments.length,1);
});
test("status API consumes durable verified membership, not checkout return or browser-supplied payment",async()=>{
 const f=await fixture();await f.add(eventKey);
 assert.equal(await f.run(),"MEMBERSHIP_ACTIVE");
 // The committed ledger is returned through the normal status boundary without calling provider again.
 const response=await f.statusHttp();assert.equal(response.status,200);assert.deepEqual(await response.json(),{ok:true,status:"MEMBERSHIP_ACTIVE"});
});

test("trusted event dispatcher finds student from provider subscription binding, not browser input",async()=>{
 const f=await fixture();await f.add(eventKey);
 const dispatch=key=>dispatchVerifiedMembershipEvent({env,db:f.db,eventKey:key,requestFn:f.requestFn,clock:f.clock});
 const results=await Promise.all([dispatch(eventKey),dispatch(eventKey)]);
 assert.equal(results.filter(x=>x.status==="membership_committed").length,1);
 assert.equal(results.filter(x=>x.status==="duplicate").length,1);
 assert.equal((await f.state()).membership.studentId,child);
 const g=await fixture();g.providerCharge.target_id="unbound-sub";await g.add(eventKey);
 assert.deepEqual(await dispatchVerifiedMembershipEvent({env,db:g.db,eventKey,requestFn:g.requestFn,clock:g.clock}),{ok:false,status:"pending"});
 assert.equal((await g.state()).membership,undefined);
});
test("trusted worker rejects browser, bad key, foreign environment and extra fields; exact verified event commits",async()=>{
 const f=await fixture();await f.add(eventKey);
 const secret="ab".repeat(32),workerEnv={...env,J123_MEMBERSHIP_WORKER_ENABLED:"true",J123_MEMBERSHIP_WORKER_SECRET:secret};
 const h=createMembershipWorkerHttp({storeFactory:()=>f.db,requestFn:f.requestFn,clock:f.clock});
 const run=(e=workerEnv,token=secret,body={eventKey})=>h(new Request("https://fixture.vercel.app/api/dev/j123/membership-worker",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify(body)}),e);
 assert.equal((await run({...workerEnv,J123_MEMBERSHIP_WORKER_ENABLED:"false"})).status,404);
 assert.equal((await run({...workerEnv,VERCEL_ENV:"production"})).status,404);
 assert.equal((await run(workerEnv,"00".repeat(32))).status,401);
 assert.equal((await run({...workerEnv,J123_MEMBERSHIP_WORKER_SECRET:workerEnv.PARENT_AUTH_SECRET},workerEnv.PARENT_AUTH_SECRET)).status,503);
 assert.equal((await run(workerEnv,secret,{eventKey,studentId:child})).status,400);
 assert.equal(f.calls.length,0);
 const r=await run();assert.equal(r.status,200);assert.deepEqual(await r.json(),{ok:true,status:"membership_committed"});
 assert.equal((await run()).status,200);
 assert.equal((await run(workerEnv,secret,{eventKey:"a".repeat(64)})).status,503);
 assert.equal((await f.state()).payments.length,1);
});
test("explicit unrelated one-time charge is ignored rather than blocking a verified student",async()=>{
 const f=await fixture();await f.add(eventKey);
 f.providerCharges.set("charge-other",{...f.providerCharge,id:"charge-other",target_type:"payment_request",target_id:"other"});
 await f.add("e".repeat(64),"charge.created","charge-other");
 assert.equal(await f.run(),"MEMBERSHIP_ACTIVE");
});

const emailEnv={...env,J123_PAYMENT_EMAIL_ENABLED:"true"};
const verifiedParent="qa-j2-"+createAuthCrypto(emailEnv).identityDigest("parent-preview-session","fixture@gmail.com");
async function receiptFixture(emailHandler){
 const f=await fixture({payerId:verifiedParent,emailHandler});
 await f.db.insert("Parents",verifiedParent,{parentId:verifiedParent,email:verifiedParent+"@example.invalid",emailVerified:true,accountStatus:"preview-test"});
 await f.db.insert("PrivacyConsents",verifiedParent+"-consent",{parentId:verifiedParent,noticeVersion:"preview-fictional-v1",acceptedAt:{$date:iso(accepted-1000)}});
 await f.db.insert("Children",child,{childId:child,parentId:verifiedParent,accountStatus:"preview-test",name:"Test Student",birthYear:2010,stateVersion:"fixture"});
 await f.add(eventKey);
 return {...f,flush:(e=emailEnv)=>flushPaymentReceipts({env:e,db:f.db,studentId:child,requestFn:f.requestFn,clock:f.clock}),dispatch:(e=emailEnv)=>dispatchVerifiedMembershipEvent({env:e,db:f.db,eventKey,requestFn:f.requestFn,clock:f.clock})};
}
test("Phase 07 queues receipt atomically, sends only to digest-matched approved parent, and never duplicates",async()=>{
 const sends=[],f=await receiptFixture(async opt=>{sends.push(opt);return Response.json({id:"resend-fixture-id"});});
 assert.equal(await f.flush(),"none");
 assert.equal(sends.length,0);
 const first=await f.dispatch({...emailEnv,J123_PAYMENT_EMAIL_ENABLED:"false"});
 assert.equal(first.status,"membership_committed");
 assert.equal((await f.state()).receipts.length,1);
 assert.equal((await f.state()).receipts[0].status,"pending");
 assert.equal(sends.length,0);
 await Promise.all([f.flush(),f.flush(),f.flush()]);
 assert.equal(sends.length,1);
 const payload=JSON.parse(sends[0].body);
 assert.deepEqual(payload.to,["fixture@gmail.com"]);assert.match(payload.text,/Test Student/);assert.match(payload.text,/RM360.00/);assert.match(payload.text,/SANDBOX TEST/);
 assert.equal((await f.state()).receipts[0].status,"accepted");
 assert.equal((await f.dispatch()).receiptStatus,"accepted");
 assert.equal(sends.length,1);
 assert.doesNotMatch(JSON.stringify(await f.state()),/fixture@gmail.com|Test Student/);
});
test("Phase 07 retries exact payload/key inside retention window, and email failure never rolls back membership",async()=>{
 const sends=[],f=await receiptFixture(async opt=>{sends.push({body:opt.body,key:opt.headers["Idempotency-Key"]});if(sends.length===1)throw Error("timeout");return Response.json({id:"resend-fixture-id"});});
 const first=await f.dispatch();assert.equal(first.status,"membership_committed");assert.equal(first.receiptStatus,"pending");assert.equal((await f.state()).membership.state,"paid");
 assert.equal(await f.flush(),"pending");assert.equal(sends.length,1);
 f.advance(61000);assert.equal(await f.flush(),"accepted");
 assert.equal(sends.length,2);assert.deepEqual(sends[0],sends[1]);
 assert.equal((await f.state()).receipts[0].attempts,2);
});
test("Phase 07 refuses unknown recipient, removed consent, review hold and expired ambiguous retry",async()=>{
 const sends=[],f=await receiptFixture(async opt=>{sends.push(opt);throw Error("timeout");});
 await f.dispatch({...emailEnv,J123_PAYMENT_EMAIL_ENABLED:"false"});
 assert.equal(await f.flush({...emailEnv,RESEND_TEST_RECIPIENT:"other@gmail.com"}),"pending");
 assert.equal(sends.length,0);
 const k="PrivacyConsents:"+verifiedParent+"-consent",prior=f.rows.get(k);f.rows.delete(k);
 assert.equal(await f.flush(),"pending");assert.equal(sends.length,0);f.rows.set(k,prior);
 assert.equal(await f.flush(),"pending");assert.equal(sends.length,1);
 f.advance(23*3600000+1);
 assert.equal(await f.flush(),"review_required");assert.equal(sends.length,1);
 assert.equal((await f.state()).receipts[0].status,"review");
 const g=await receiptFixture(async opt=>{sends.push(opt);return Response.json({id:"never"});});
 await g.dispatch({...emailEnv,J123_PAYMENT_EMAIL_ENABLED:"false"});
 const key=checkoutKey(child),row=await g.db.get(BILLING_COLLECTION,key),state=decodeCheckout(row,child);
 await g.db.replaceIfVersion(BILLING_COLLECTION,key,row.stateVersion,{...row,stateVersion:"held",stateJson:JSON.stringify({...state,membership:{...state.membership,policyReviewRequired:true}})});
 assert.equal(await g.flush(),"review_required");assert.equal(sends.length,1);
});
test("Phase 07 payload change after ambiguous send never uses a different body with same key",async()=>{
 let sends=0;const f=await receiptFixture(async()=>{sends++;throw Error("timeout");});await f.dispatch();
 const row=await f.db.get("Children",child);await f.db.replaceIfVersion("Children",child,row.stateVersion,{...row,name:"Changed Student",stateVersion:"new"});
 f.advance(61000);assert.equal(await f.flush(),"review_required");assert.equal(sends,1);
});
