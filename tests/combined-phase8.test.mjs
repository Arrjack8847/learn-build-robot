import test from "node:test";
import assert from "node:assert/strict";
import {inspectProviders} from "../scripts/combined/phase8-provider-check.mjs";
import {COMBINED_BRANCH,COMBINED_SITE} from "../scripts/combined/scope.mjs";
import {J123_ORIGIN,J123_PLAN} from "../scripts/j123/infrastructure.mjs";
const base={CODESPACES:"true",VERCEL_ENV:"preview",VERCEL_GIT_COMMIT_REF:COMBINED_BRANCH,WIX_DEV_SITE_ID:COMBINED_SITE,WIX_DEV_DATA_API_KEY:"synthetic-wix-secret",RESEND_API_KEY:"synthetic-resend-secret",PARENT_PREVIEW_VERIFIED_SENDER:"noreply@mail.bestemready.edu.my"};
test("phase 8 diagnostics never contact providers by default or accept a production or wrong-site scope",async()=>{
 let calls=0;const request=async()=>{calls++;throw Error("unexpected");};
 const a=await inspectProviders(base,{request});assert.equal(a.checks.scope,"PASS");assert.equal(a.checks.wixRead,"NOT_RUN");assert.equal(a.providerAcceptance,"NOT_VERIFIED");
 for(const e of [{...base,VERCEL_ENV:"production"},{...base,WIX_DEV_SITE_ID:"wrong"},{...base,VERCEL_GIT_COMMIT_REF:"main"}])assert.equal((await inspectProviders(e,{probe:true,request})).checks.scope,"REFUSED");
 assert.equal(calls,0);
});
test("phase 8 probes are redacted, never send email or create payments and distinguish read evidence from acceptance",async()=>{
 const calls=[];const e={...base,HITPAY_API_URL:J123_ORIGIN,HITPAY_PLAN_ID:J123_PLAN,HITPAY_CURRENCY:"MYR",HITPAY_MEMBERSHIP_AMOUNT:"360.00",HITPAY_SANDBOX_PAYMENT_METHOD:"touch_n_go",HITPAY_API_KEY:"DISABLED_J3_WIX_VAULT_ONLY",HITPAY_SALT_KEY:"DISABLED_J3_WIX_VAULT_ONLY",HITPAY_API_BASE_URL:"DISABLED_J3_WIX_VAULT_ONLY"};
 const response=(body,status=200)=>new Response(JSON.stringify(body),{status});
 const result=await inspectProviders(e,{probe:true,request:async(url,o)=>{calls.push([url,o.method]);if(url.endsWith("/query"))return response({dataItems:[],pagingMetadata:{total:0}});if(url.includes("/items/"))return response({},404);if(url.endsWith("/domains"))return response({data:[{name:"mail.bestemready.edu.my",status:"verified"}]});if(url.includes("/secrets/name/"))return response({value:"synthetic-vault-secret"});if(url.includes("/subscription-plan/"))return response({id:J123_PLAN,reference:"stem-lab-monthly-myr360-sandbox-v1",amount:360,currency:"MYR",cycle:"monthly"});return response([],200);}});
 assert.equal(result.checks.wixRead,"VERIFIED_READ_ONLY");assert.equal(result.checks.combinedScheduleRead,"ROW_NOT_FOUND_OR_COLLECTION_UNCONFIRMED");assert.equal(result.checks.resendDomainRead,"VERIFIED_READ_ONLY");assert.equal(result.checks.hitpayPlanRead,"VERIFIED_READ_ONLY");assert.equal(result.checks.genuineTngPayment,"NOT_VERIFIED");assert.equal(result.releaseReady,false);
 assert.ok(calls.every(([u,m])=>m==="GET"||m==="POST"&&u.endsWith("/query")));assert.doesNotMatch(JSON.stringify(result),/synthetic-.*secret/);
});
