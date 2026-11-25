// Exact authorized preview build only, synthetic ledger; no payment provider mutation.
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {createFixtureBillingStore} from "./fixture-billing-store.mjs";
import {runAtomicBillingScenarios} from "./atomic-billing-scenarios.mjs";
const e=process.env;
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J3: implement isolated atomic billing ledger and run sandbox persistence QA"){
 try{
  const db=createWixStore(e);
  const rowId="qa-j3-atomic-"+e.VERCEL_GIT_COMMIT_SHA.slice(0,12);
  const prior=await db.get("SandboxBillingState",rowId);
  if(prior){console.log("[J3 atomic QA] existing fixture; not replaying scenario");}
  else {
   const store=createFixtureBillingStore({env:e,db,rowId});
   const results=await runAtomicBillingScenarios(store);
   for(const result of results)console.log("[J3 atomic QA] PASS "+result);
   console.log("[J3 atomic QA] COMPLETE "+results.length+" synthetic scenarios; no actual payment or email");
  }
 }catch(e){console.log("[J3 atomic QA] FAILED "+(typeof e?.message==="string"&&/^[A-Za-z0-9_ -]{1,100}$/.test(e.message)?e.message:"UNCONFIRMED"));process.exitCode=1;}
}
