import test from "node:test";
import assert from "node:assert/strict";
import {createFixtureBillingStore} from "../scripts/hitpay/fixture-billing-store.mjs";
import {runAtomicBillingScenarios} from "../scripts/hitpay/atomic-billing-scenarios.mjs";
test("single aggregate CAS transaction with concurrent synthetic payment, rollback and notification",async()=>{
 let row=null;
 const db={get:async()=>structuredClone(row),insert:async(c,id,v)=>{if(row)return false;row=structuredClone(v);return true;},replaceIfVersion:async(c,id,expected,v)=>{if(row.stateVersion!==expected)return false;row=structuredClone(v);return true;}};
 const env={VERCEL_ENV:"preview",WIX_DEV_SITE_ID:"09d613aa-3a95-42ff-9ee3-2aa0c706c447"};
 const store=createFixtureBillingStore({env,db,rowId:"qa-j3-unit"});
 assert.throws(()=>createFixtureBillingStore({env:{...env,VERCEL_ENV:"production"},db,rowId:"qa-j3-unit"}));
 assert.throws(()=>createFixtureBillingStore({env,db,rowId:"actual-membership"}));
 const results=await runAtomicBillingScenarios(store);assert.equal(results.length,11);
});
