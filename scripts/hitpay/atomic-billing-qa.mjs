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
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J3: verify genuine sandbox wallet charge evidence"){
 const tag="[J3 genuine charge audit]";
 try{
  const sandbox="https://api.sandbox.hit-pay.com";
  if(e.HITPAY_API_BASE_URL!==sandbox||!e.HITPAY_API_KEY?.trim())throw Error("SANDBOX_REQUIRED");
  const db=createWixStore(e);
  const row=await db.get("SandboxBillingState","qa-j3-wallet-setup-v1"), fixture=JSON.parse(row.stateJson);
  if(row.environment!=="sandbox-qa"||fixture.fixture!==true||fixture.reference!=="stem-lab-wallet-qa-v1"||fixture.providerSubscriptionId!=="a34f7a45-5563-4f1f-8586-62d830c38250")throw Error("FIXTURE_MISMATCH");
  const ids=["a34f7d35-6173-4f40-b69f-68058a491f96","a34f7d2c-d6cc-4b36-b950-9d00ce853e6a","a34f7d29-752f-4206-a847-6aa67bac69e3","a34f7d23-74f7-4d6b-b79d-6156ada6dea5","a34f7d1e-4b8b-49bb-9c3d-797d481ce4d0"];
  const counts={verifiedTarget:0,successful:0,failed:0,other:0,unconfirmed:0};
  for(const id of ids){
   const r=await fetch(sandbox+"/v1/charges/"+encodeURIComponent(id),{method:"GET",headers:{"X-BUSINESS-API-KEY":e.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
   if(!r.ok){counts.unconfirmed++;console.log(tag+" LOOKUP_HTTP "+r.status);continue;}
   const d=await r.json();
   const match=d.id===id&&d.target_id===fixture.providerSubscriptionId&&d.target_type==="business_recurring_plan"&&Number(d.amount)===360&&String(d.currency).toUpperCase()==="MYR";
   if(!match){counts.unconfirmed++;continue;}
   counts.verifiedTarget++;
   if(d.status==="succeeded"&&Number(d.refunded_amount)===0)counts.successful++;
   else if(d.status==="failed")counts.failed++;
   else counts.other++;
  }
  console.log(tag+" "+JSON.stringify({...counts,eligibilityChanged:false,emailSent:false}));
 }catch{console.log(tag+" UNCONFIRMED");}
}
