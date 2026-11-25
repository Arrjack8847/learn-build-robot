// Exact authorized preview build only, synthetic ledger; no payment provider mutation.
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {createFixtureBillingStore} from "./fixture-billing-store.mjs";
import {runAtomicBillingScenarios} from "./atomic-billing-scenarios.mjs";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
// Network-free regression: conditional conflict is retryable, other errors fail closed.
const fakeEnv={VERCEL_ENV:"preview",WIX_DEV_SITE_ID:"09d613aa-3a95-42ff-9ee3-2aa0c706c447",WIX_DEV_DATA_API_KEY:"test-only-not-a-secret"};
for(const status of [409,412,428,500,403]){
 const mock=createWixStore(fakeEnv,async()=>({ok:false,status}));
 const result=mock.replaceIfVersion("SandboxBillingState","qa-j3-regression","v1",{stateVersion:"v2"});
 if([409,412,428].includes(status))assert.equal(await result,false);
 else await assert.rejects(result,/WIX_UPDATE_UNCONFIRMED/);
}
console.log("[J3 atomic QA] PASS conditional conflict status regression (5 cases)");
const e=process.env;
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J3: rerun isolated persistence QA with Wix conflict regression"){
 try{
  const db=createWixStore(e);
  if(!e.VERCEL_GIT_COMMIT_SHA||!e.VERCEL_URL)throw Error("MISSING_PREVIEW_ID");
  const rowId="qa-j3-atomic-"+createHash("sha256").update(e.VERCEL_GIT_COMMIT_SHA+":"+e.VERCEL_URL).digest("hex").slice(0,20);
  if(await db.get("SandboxBillingState",rowId))throw Error("QA_FIXTURE_ALREADY_EXISTS");
  const store=createFixtureBillingStore({env:e,db,rowId});
  const results=await runAtomicBillingScenarios(store);
  for(const result of results)console.log("[J3 atomic QA] PASS "+result);
  console.log("[J3 atomic QA] COMPLETE "+results.length+" synthetic scenarios; no actual payment or email");
 }catch(e){console.log("[J3 atomic QA] FAILED "+(typeof e?.message==="string"&&/^[A-Za-z0-9_ -]{1,100}$/.test(e.message)?e.message:"UNCONFIRMED"));process.exitCode=1;}
}

// Separate one-time sandbox wallet setup. No charge, real customer or plan mutation.
// See https://docs.hitpayapp.com/apis/guide/sandbox and embedded-recurring-billing.
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J3: repair sandbox wallet preflight and guarded authorization"){
 const tag="[J3 mock wallet]";
 let stage="configuration";
 try{
  const sandbox="https://api.sandbox.hit-pay.com";
  if(e.HITPAY_API_BASE_URL!==sandbox||!e.HITPAY_API_KEY?.trim())throw Error("SANDBOX_REQUIRED");
  // Exact previously verified development deployment; independent of runtime-only return URL settings.
  const redirect=new URL("https://learn-build-robot-1czku2jld-soe-min-khants-projects.vercel.app/parent/payment-return");
  stage="database";
  if(redirect.protocol!=="https:"||!redirect.hostname.endsWith(".vercel.app")||redirect.username||redirect.password||redirect.port||redirect.pathname!=="/parent/payment-return"||redirect.search||redirect.hash)throw Error("INVALID_RETURN_URL");
  const db=createWixStore(e), collection="SandboxBillingState", id="qa-j3-wallet-setup-v1", reference="stem-lab-wallet-qa-v1";
  const initial={environment:"sandbox-qa",stateVersion:"reserved-v1",stateJson:JSON.stringify({fixture:true,reference,status:"reserved",chargeAttempted:false})};
  stage="provider-preflight";
  // Refuse to create if any matching provider reference exists or a list is incomplete.
  for(const status of ["scheduled","active","retrying","inactive","canceled"]){
   const q=new URLSearchParams({reference,status});
   const p=await fetch(sandbox+"/v1/recurring-billing?"+q,{method:"GET",headers:{"X-BUSINESS-API-KEY":e.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});
   if(!p.ok)throw Error("PROVIDER_PREFLIGHT_HTTP_"+p.status);
   const j=await p.json();
   if(!Array.isArray(j.data)||j.data.length!==0||!(j.meta?.last_page===1||j.last_page===1||j.meta?.total===0||j.total===0))throw Error("PROVIDER_PREFLIGHT_NOT_EMPTY_OR_UNCONFIRMED");
  }
  stage="reservation";
  // Reserve before the only outbound POST; an uncertain response cannot be retried automatically.
  if(await db.get(collection,id)||!await db.insert(collection,id,initial)){console.log(tag+" ALREADY_RESERVED_NO_RETRY");}
  else {
   stage="wallet-create";
   const body=new URLSearchParams({name:"STEM Lab sandbox wallet QA",customer_email:"stem-lab-sandbox@example.com",customer_name:"Fictional Sandbox Tester",currency:"MYR",amount:"360",save_payment_method:"true",generate_direct_link:"true",redirect_url:redirect.href,reference,send_email:"false"});
   body.append("payment_methods[]","touch_n_go");
   const r=await fetch(sandbox+"/v1/recurring-billing",{method:"POST",headers:{"X-BUSINESS-API-KEY":e.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest","Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},body,redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
   if(!r.ok){console.log(tag+" CREATE_HTTP "+r.status+" RESERVED_NO_RETRY");throw Error("WALLET_CREATE_UNCONFIRMED");}
   stage="response-validation";
   const d=await r.json();
   if(typeof d.direct_link?.direct_link_url!=="string")throw Error("DIRECT_LINK_MISSING");
   const u=new URL(d.direct_link.direct_link_url);
   if(!/^[a-f0-9-]{36}$/i.test(d.id)||d.reference!==reference||String(d.currency).toUpperCase()!=="MYR"||d.cycle!=="save_card"||!Array.isArray(d.payment_methods)||d.payment_methods.length!==1||d.payment_methods[0]!=="touch_n_go"||u.protocol!=="https:"||u.username||u.password||u.port)throw Error("WALLET_RESPONSE_UNCONFIRMED");
   // Keep the returned customer authorization URL in the admin-only fixture, never in build logs.
   // It must be independently verified as a sandbox mock before opening it.
   const data={environment:"sandbox-qa",stateVersion:"created-v1",stateJson:JSON.stringify({fixture:true,reference,status:"authorization_pending",providerSubscriptionId:d.id,directLink:u.href,linkHost:u.hostname,chargeAttempted:false})};
   stage="persist-authorization";
   if(!await db.replaceIfVersion(collection,id,"reserved-v1",data))throw Error("WALLET_PERSIST_UNCONFIRMED");
   console.log(tag+" CREATED_AUTHORIZATION_PENDING; no charge attempted");
  }
 }catch(err){console.log(tag+" FAILED stage="+stage+" "+(typeof err?.message==="string"&&/^[A-Z0-9_]{1,80}$/.test(err.message)?err.message:"UNCONFIRMED"));process.exitCode=1;}
}

// Read-only provider reconciliation audit for the exact fictional wallet and received events.
// Never grant membership, send email, initiate charges, or print credentials/customer data.
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J3: reconcile charges against stored provider subscription ID"){
 const tag="[J3 genuine charge audit]";
 try{
  const sandbox="https://api.sandbox.hit-pay.com";
  if(e.HITPAY_API_BASE_URL!==sandbox||!e.HITPAY_API_KEY?.trim())throw Error("SANDBOX_REQUIRED");
  const db=createWixStore(e);
  const row=await db.get("SandboxBillingState","qa-j3-wallet-setup-v1"), fixture=JSON.parse(row.stateJson);
  if(row.environment!=="sandbox-qa"||fixture.fixture!==true||fixture.reference!=="stem-lab-wallet-qa-v1"||fixture.providerSubscriptionId!=="a34f7a45-392b-4c53-85b5-9286e07912a0")throw Error("FIXTURE_MISMATCH");
  const ids=["a34f7d35-6173-4f40-b69f-68058a491f96","a34f7d2c-d6cc-4b36-b950-9d00ce853e6a","a34f7d29-752f-4206-a847-6aa67bac69e3","a34f7d23-74f7-4d6b-b79d-6156ada6dea5","a34f7d1e-4b8b-49bb-9c3d-797d481ce4d0"];
  const counts={verifiedTarget:0,successful:0,failed:0,other:0,unconfirmed:0};
  for(const id of ids){
   const r=await fetch(sandbox+"/v1/charges/"+encodeURIComponent(id),{method:"GET",headers:{"X-BUSINESS-API-KEY":e.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
   if(!r.ok){counts.unconfirmed++;console.log(tag+" LOOKUP_HTTP "+r.status);continue;}
   const d=await r.json();
   const match=d.id===id&&d.target_id===fixture.providerSubscriptionId&&d.target_type==="business_recurring_plan"&&Number(d.amount)===360&&String(d.currency).toUpperCase()==="MYR";
   if(!match){counts.unconfirmed++;console.log(tag+" MISMATCH "+JSON.stringify({id:d.id===id,target:d.target_id===fixture.providerSubscriptionId,targetType:d.target_type==="business_recurring_plan",amount:Number(d.amount)===360,currency:String(d.currency).toUpperCase()==="MYR"}));continue;}
   counts.verifiedTarget++;
   if(d.status==="succeeded"&&Number(d.refunded_amount)===0)counts.successful++;
   else if(d.status==="failed")counts.failed++;
   else counts.other++;
  }
  console.log(tag+" "+JSON.stringify({...counts,eligibilityChanged:false,emailSent:false}));
 }catch(err){console.log(tag+" UNCONFIRMED "+(typeof err?.message==="string"&&/^[A-Z0-9_]{1,80}$/.test(err.message)?err.message:"UNCLASSIFIED"));}
}

// Real sandbox evidence, isolated from student eligibility and monthly billing.
// The saved-wallet fixture is not a monthly plan; five charges cannot prove five periods.
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J3: persist verified mock charge evidence without granting membership"){
 const tag="[J3 evidence ledger]";
 try{
  const sandbox="https://api.sandbox.hit-pay.com";
  if(e.HITPAY_API_BASE_URL!==sandbox||!e.HITPAY_API_KEY?.trim())throw Error("SANDBOX_REQUIRED");
  const db=createWixStore(e),collection="SandboxBillingState",id="qa-j3-wallet-evidence-v1";
  const row=await db.get(collection,"qa-j3-wallet-setup-v1"),fixture=JSON.parse(row.stateJson);
  if(row.environment!=="sandbox-qa"||fixture.fixture!==true||fixture.reference!=="stem-lab-wallet-qa-v1"||fixture.providerSubscriptionId!=="a34f7a45-392b-4c53-85b5-9286e07912a0")throw Error("FIXTURE_MISMATCH");
  const pairs=[
   ["a34f7d35-6173-4f40-b69f-68058a491f96","e76b5fa3a7e515917d63fa05d1d739afde088ce6bb00340c0d5f7077e081ea4d"],
   ["a34f7d2c-d6cc-4b36-b950-9d00ce853e6a","32e2c8879c762801aa1e681d37163febd8193ae13eb27228f6e9030c85775559"],
   ["a34f7d29-752f-4206-a847-6aa67bac69e3","c5fb8727b7ab9f7dbf4f1c5cf07e01678a6a357c14c5e0d8006e41e1a9eb27a8"],
   ["a34f7d23-74f7-4d6b-b79d-6156ada6dea5","f7cdea3b68194214173fb4c77d0d1174d82d53f334b3de872f32dacc2ea61d6b"],
   ["a34f7d1e-4b8b-49bb-9c3d-797d481ce4d0","5cdc9110237d8e242a422441c851ee22dc6e28a7e1652490e721ee6ae3edeacd"]
  ];
  const payments=[];
  for(const [chargeId,eventKey] of pairs){
   const event=await db.get("PaymentWebhookEvents",eventKey);
   const verifiedAt=Date.parse(typeof event?.signatureVerifiedAt==="string"?event.signatureVerifiedAt:event?.signatureVerifiedAt?.$date);
   if(event?.environment!=="sandbox"||event.providerEventKey!==eventKey||event.payloadDigest!==eventKey||event.providerObjectId!==chargeId||event.eventType!=="charge.created"||event.processingStatus!=="pending"||!Number.isFinite(verifiedAt))throw Error("INBOX_EVIDENCE_MISMATCH");
   const r=await fetch(sandbox+"/v1/charges/"+encodeURIComponent(chargeId),{method:"GET",headers:{"X-BUSINESS-API-KEY":e.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
   if(!r.ok)throw Error("PROVIDER_LOOKUP_HTTP_"+r.status);
   const d=await r.json();
   if(d.id!==chargeId||d.target_id!==fixture.providerSubscriptionId||d.target_type!=="business_recurring_plan"||Number(d.amount)!==360||String(d.currency).toUpperCase()!=="MYR"||d.status!=="succeeded"||Number(d.refunded_amount)!==0)throw Error("PROVIDER_EVIDENCE_MISMATCH");
   payments.push({chargeId,eventKey,amountMinor:36000,currency:"MYR",status:"succeeded",refundedMinor:0});
  }
  if(new Set(payments.map(p=>p.chargeId)).size!==5||new Set(payments.map(p=>p.eventKey)).size!==5)throw Error("DUPLICATE_EVIDENCE");
  const state={schema:1,fixture:true,reference:fixture.reference,providerSubscriptionId:fixture.providerSubscriptionId,payments,verifiedTotalMinor:payments.reduce((n,p)=>n+p.amountMinor,0),membershipDecision:"hold_no_monthly_period_evidence",eligibilityChanged:false,emailSent:false,originalInboxUnchanged:true};
  const stateJson=JSON.stringify(state);
  const version="evidence-"+createHash("sha256").update(stateJson).digest("hex");
  const data={environment:"sandbox-qa",stateVersion:version,stateJson};
  const existing=await db.get(collection,id);
  if(!existing)await db.insert(collection,id,data);
  const saved=await db.get(collection,id);
  if(saved?.environment!=="sandbox-qa"||saved.stateVersion!==version||saved.stateJson!==stateJson)throw Error("EVIDENCE_PERSISTENCE_CONFLICT");
  console.log(tag+" PASS "+JSON.stringify({verifiedPayments:payments.length,verifiedTotalMinor:state.verifiedTotalMinor,readbackVerified:true,replaySafe:true,membershipDecision:state.membershipDecision,eligibilityChanged:false,emailSent:false}));
 }catch(err){console.log(tag+" FAILED "+(typeof err?.message==="string"&&/^[A-Z0-9_]{1,100}$/.test(err.message)?err.message:"UNCONFIRMED"));process.exitCode=1;}
}

// A single opt-in development QA send to the configured test inbox only.
// This fixture uses synthetic membership data, not the five actual wallet charges.
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J3: test confirmation delivery to configured sandbox inbox"){
 const tag="[J3 email QA]";
 let stage="configuration";
 try{
  const {createSandboxPaymentMailer}=await import("./sandbox-payment-mailer.mjs");
  const {createBillingCore}=await import("./j3-core.mjs");
  const {signatures}=await import("./j3-node-transport.mjs");
  const {createHmac,randomUUID}=await import("node:crypto");
  const mailer=createSandboxPaymentMailer(e);
  const db=createWixStore(e),collection="SandboxBillingState",rowId="qa-j3-email-delivery-v1";
  stage="reservation";
  if(await db.get(collection,rowId))throw Error("EXISTING_EMAIL_FIXTURE_NO_RETRY");
  // Atomically reserve the one permitted fixture before creating a payment.
  const initial={schema:1,fixture:true,membership:{id:"qa-membership",environment:"sandbox",parentId:"qa-parent",childId:"qa-child",providerSubscriptionId:"qa-subscription",paymentStatus:"unpaid",subscriptionStatus:"active"},events:{},payments:{},outbox:{}};
  if(!await db.insert(collection,rowId,{environment:"sandbox-qa",stateVersion:randomUUID(),stateJson:JSON.stringify(initial)}))throw Error("EXISTING_EMAIL_FIXTURE_NO_RETRY");
  const store=createFixtureBillingStore({env:e,db,rowId});
  const clock={now:()=>Date.now()},now=clock.now(),salt="qa-email-fixture-only";
  const raw=Buffer.from(JSON.stringify({id:"qa-event-1",business_id:"qa-business"}));
  const key=signatures.digest(raw);
  const core=createBillingCore({env:{VERCEL_ENV:"preview",HITPAY_API_BASE_URL:"https://api.sandbox.hit-pay.com",HITPAY_WEBHOOK_SALT:salt,HITPAY_BUSINESS_ID:"qa-business"},identity:{},store,provider:{reconcileVerifiedEvent:async event=>event.providerEventKey===key?{environment:"sandbox",businessId:"qa-business",eventKey:key,subscriptionId:"qa-subscription",paymentId:"qa-email-charge-v1",amountMinor:36000,currency:"MYR",coveredMonth:"2026-11",periodEndAt:now+86400000,occurredAt:now,cycleNumber:1,kind:"paid"}:null},clock,ids:{},signatures});
  stage="fixture-payment";
  const received=await core.receive(raw,createHmac("sha256",salt).update(raw).digest("hex"),"charge","created");
  if(!received.ok||(await core.reconcile(key)).status!=="paid")throw Error("SYNTHETIC_PAYMENT_NOT_COMMITTED");
  stage="claim";
  const job=await store.claimPendingEmail();
  if(!job||job.status!=="claimed"||job.paymentId!=="qa-email-charge-v1"||job.parentId!=="qa-parent"||job.childId!=="qa-child")throw Error("EMAIL_JOB_NOT_CLAIMED");
  const state=await store.read(),payment=state.payments[job.paymentId];
  if(state.membership.paymentStatus!=="paid"||state.events[key]?.processingStatus!=="processed")throw Error("PAYMENT_NOT_COMMITTED");
  stage="send";
  // A crash or ambiguous provider response leaves a claimed job, never auto-retried.
  const result=await mailer.sendCommitted({job:{...job,status:"sending"},payment,parent:{id:"qa-parent",email:"qa-parent@example.invalid"},child:{id:"qa-child",parentId:"qa-parent",name:"Fictional QA child"}});
  if(!result.accepted||typeof result.providerMessageId!=="string"||!/^[a-zA-Z0-9_-]{1,128}$/.test(result.providerMessageId))throw Error("EMAIL_ACCEPTANCE_UNCONFIRMED");
  stage="persist";
  const saved=await db.get(collection,rowId),draft=JSON.parse(saved.stateJson);
  const entry=draft.outbox[job.deduplicationKey];
  if(saved.environment!=="sandbox-qa"||draft.fixture!==true||entry?.status!=="claimed"||entry.attemptCount!==1)throw Error("EMAIL_STATE_CONFLICT");
  Object.assign(entry,{status:"accepted",providerMessageId:result.providerMessageId});
  if(!await db.replaceIfVersion(collection,rowId,saved.stateVersion,{environment:"sandbox-qa",stateVersion:randomUUID(),stateJson:JSON.stringify(draft)}))throw Error("EMAIL_STATE_CONFLICT");
  const verified=await store.read();
  if(verified.outbox[job.deduplicationKey]?.status!=="accepted"||verified.outbox[job.deduplicationKey]?.providerMessageId!==result.providerMessageId)throw Error("EMAIL_READBACK_UNCONFIRMED");
  console.log(tag+" PASS provider accepted one fictional confirmation; Wix readback verified; inbox delivery not yet confirmed");
 }catch(err){console.log(tag+" FAILED stage="+stage+" "+(typeof err?.message==="string"&&/^[A-Z0-9_]{1,100}$/.test(err.message)?err.message:"UNCONFIRMED"));process.exitCode=1;}
}

// Read-only monthly trial audit. Saved wallet charges do not establish monthly entitlement.
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J3: audit existing monthly subscription and billing period evidence"){
 const tag="[J3 monthly audit]";
 try{
  const sandbox="https://api.sandbox.hit-pay.com";
  if(e.HITPAY_API_BASE_URL!==sandbox||!e.HITPAY_API_KEY?.trim())throw Error("SANDBOX_REQUIRED");
  const db=createWixStore(e),trial=await db.get("SandboxCheckoutTrials","stem-lab-checkout-v1");
  if(trial?.status!=="hosted"||trial.providerReference!=="stem-lab-checkout-v1"||trial.providerSubscriptionId!=="a34f1623-3fe7-49ad-b217-bfeccfd41709"||trial.planId!=="a34f0707-c529-4c64-9f1f-e969c0d3de16"||trial.planId!==e.HITPAY_SANDBOX_PLAN_ID)throw Error("TRIAL_MISMATCH");
  async function get(path){const r=await fetch(sandbox+path,{method:"GET",headers:{"X-BUSINESS-API-KEY":e.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error("LOOKUP_HTTP_"+r.status);return r.json();}
  const plan=await get("/v1/subscription-plan/"+encodeURIComponent(trial.planId));
  if(plan.id!==trial.planId||plan.reference!=="stem-lab-monthly-myr360-sandbox-v1"||Number(plan.amount)!==360||String(plan.currency).toUpperCase()!=="MYR"||plan.cycle!=="monthly")throw Error("PLAN_MISMATCH");
  const rows=[];
  for(const status of ["scheduled","active","retrying","inactive","canceled"]){
   const p=await get("/v1/recurring-billing?"+new URLSearchParams({reference:trial.providerReference,status}));
   if(!Array.isArray(p.data))throw Error("LIST_SHAPE_UNCONFIRMED");
   for(const d of p.data)if(d.id===trial.providerSubscriptionId&&d.reference===trial.providerReference&&d.business_recurring_plans_id===trial.planId)rows.push({status,d});
  }
  if(rows.length!==1)throw Error("SUBSCRIPTION_STATE_UNCONFIRMED");
  const {status,d}=rows[0];
  if(Number(d.amount)!==360||String(d.currency).toUpperCase()!=="MYR")throw Error("SUBSCRIPTION_AMOUNT_MISMATCH");
  const date=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}(?:[ T][0-9:.+Z-]+)?$/.test(v)&&Number.isFinite(Date.parse(v))?v:null;
  console.log(tag+" SUBSCRIPTION "+JSON.stringify({verifiedPlan:true,status,reportedStatus:typeof d.status==="string"&&["scheduled","active","retrying","inactive","canceled"].includes(d.status)?d.status:null,cycle:d.cycle==="monthly"?"monthly":null,startDate:date(d.start_date),nextChargeDate:date(d.next_charge_date),lastChargeDate:date(d.last_charge_date),timesCharged:Number.isInteger(d.times_charged)?d.times_charged:null,timesToBeCharged:Number.isInteger(d.times_to_be_charged)?d.times_to_be_charged:null,savedMethod:typeof d.save_payment_method==="boolean"?d.save_payment_method:null,dateFields:Object.keys(d).filter(k=>/^(start_date|next_charge_date|last_charge_date|end_date|cycle|times_charged|times_to_be_charged|payment_methods|save_payment_method|status|next_billing_date|last_billing_date)$/.test(k))}));
  const q=new URLSearchParams({date_from:"2026-11-25",amount_from:"360",amount_to:"360",per_page:"100"});
  const p=await get("/v1/charges?"+q);
  if(!Array.isArray(p.data))throw Error("CHARGE_LIST_UNCONFIRMED");
  const candidates=p.data.filter(x=>/^[a-f0-9-]{36}$/i.test(x.id)&&Number(x.amount)===360&&String(x.currency).toUpperCase()==="MYR");
  if(candidates.length>100)throw Error("AUDIT_LIMIT");
  let matched=0,successful=0,failed=0;
  for(const x of candidates){const v=await get("/v1/charges/"+encodeURIComponent(x.id));if(v.id!==x.id)throw Error("CHARGE_ID_MISMATCH");if(v.target_id===trial.providerSubscriptionId&&v.target_type==="business_recurring_plan"){matched++;if(v.status==="succeeded"&&Number(v.refunded_amount)===0)successful++;if(v.status==="failed")failed++;}}
  console.log(tag+" CHARGES "+JSON.stringify({matched,successful,failed,candidates:candidates.length,hasMore:!!p.meta?.next_cursor,entitlementChanged:false,monthlyPeriodVerified:false}));
 }catch(err){console.log(tag+" UNCONFIRMED "+(typeof err?.message==="string"&&/^[A-Z0-9_]{1,100}$/.test(err.message)?err.message:"UNCLASSIFIED"));process.exitCode=1;}
}
