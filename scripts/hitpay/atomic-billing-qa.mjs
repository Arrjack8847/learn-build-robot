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
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J3: prepare one isolated sandbox wallet authorization"){
 const tag="[J3 mock wallet]";
 try{
  const sandbox="https://api.sandbox.hit-pay.com";
  if(e.HITPAY_API_BASE_URL!==sandbox||!e.HITPAY_API_KEY?.trim())throw Error("SANDBOX_REQUIRED");
  const redirect=new URL(e.HITPAY_SANDBOX_RETURN_URL);
  if(redirect.protocol!=="https:"||!redirect.hostname.endsWith(".vercel.app")||redirect.username||redirect.password||redirect.port||redirect.pathname!=="/parent/payment-return"||redirect.search||redirect.hash)throw Error("INVALID_RETURN_URL");
  const db=createWixStore(e), collection="SandboxBillingState", id="qa-j3-wallet-setup-v1", reference="stem-lab-wallet-qa-v1";
  const initial={environment:"sandbox-qa",stateVersion:"reserved-v1",stateJson:JSON.stringify({fixture:true,reference,status:"reserved",chargeAttempted:false})};
  // Reserve before the only outbound POST; an uncertain response cannot be retried automatically.
  if(await db.get(collection,id)||!await db.insert(collection,id,initial)){console.log(tag+" ALREADY_RESERVED_NO_RETRY");}
  else {
   const body=new URLSearchParams({name:"STEM Lab sandbox wallet QA",customer_email:"stem-lab-sandbox@example.com",customer_name:"Fictional Sandbox Tester",currency:"MYR",amount:"360",save_payment_method:"true",generate_direct_link:"true",redirect_url:redirect.href,reference,send_email:"false"});
   body.append("payment_methods[]","touch_n_go");
   const r=await fetch(sandbox+"/v1/recurring-billing",{method:"POST",headers:{"X-BUSINESS-API-KEY":e.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest","Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},body,redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
   if(!r.ok){console.log(tag+" CREATE_HTTP "+r.status+" RESERVED_NO_RETRY");throw Error("WALLET_CREATE_UNCONFIRMED");}
   const d=await r.json();
   const u=new URL(d.direct_link?.direct_link_url);
   if(!/^[a-f0-9-]{36}$/i.test(d.id)||d.reference!==reference||String(d.currency).toUpperCase()!=="MYR"||d.cycle!=="save_card"||!Array.isArray(d.payment_methods)||d.payment_methods.length!==1||d.payment_methods[0]!=="touch_n_go"||u.protocol!=="https:"||u.username||u.password||u.port)throw Error("WALLET_RESPONSE_UNCONFIRMED");
   // Keep the returned customer authorization URL in the admin-only fixture, never in build logs.
   // It must be independently verified as a sandbox mock before opening it.
   const data={environment:"sandbox-qa",stateVersion:"created-v1",stateJson:JSON.stringify({fixture:true,reference,status:"authorization_pending",providerSubscriptionId:d.id,directLink:u.href,linkHost:u.hostname,chargeAttempted:false})};
   if(!await db.replaceIfVersion(collection,id,"reserved-v1",data))throw Error("WALLET_PERSIST_UNCONFIRMED");
   console.log(tag+" CREATED_AUTHORIZATION_PENDING; no charge attempted");
  }
 }catch(err){console.log(tag+" FAILED "+(typeof err?.message==="string"&&/^[A-Z0-9_]{1,80}$/.test(err.message)?err.message:"UNCONFIRMED"));process.exitCode=1;}
}
