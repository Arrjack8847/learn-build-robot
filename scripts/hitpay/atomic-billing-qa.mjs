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
