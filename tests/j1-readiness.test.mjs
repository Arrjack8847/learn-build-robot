import test from "node:test";
import assert from "node:assert/strict";
import {getJ1Readiness,handleJ1Readiness} from "../scripts/j1/readiness.mjs";
const origin="https://j1-test.vercel.app",path="/api/dev/j1/readiness";
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:"integration/j1-j2-20261126",VERCEL_URL:"j1-test.vercel.app",WIX_DEV_SITE_ID:"09d613aa-3a95-42ff-9ee3-2aa0c706c447",WIX_DEV_DATA_API_KEY:"fixture-wix-secret",RESEND_API_KEY:"fixture-resend-secret",PARENT_AUTH_SECRET:"0123456789abcdef".repeat(4),STUDENT_AUTH_SECRET:"fedcba9876543210".repeat(4),STUDENT_AUTH_ENABLED:"true",PARENT_PREVIEW_VERIFIED_SENDER:"noreply@mail.bestemready.edu.my",PARENT_PREVIEW_OPEN_EMAIL:"1",HITPAY_API_URL:"https://api.sandbox.hit-pay.com",HITPAY_API_KEY:"fixture-hitpay-secret"};
const headers={origin,"sec-fetch-site":"same-origin","x-stem-j1-readiness":"1"};
const req=(method="POST",url=origin+path,h=headers)=>new Request(url,{method,headers:h});
const noNetwork=()=>{throw Error("Unexpected upstream call")};
test("production and other branches fail closed",async()=>{
 for(const e of [{...env,VERCEL_ENV:"production"},{...env,VERCEL_TARGET_ENV:"production"},{...env,VERCEL_GIT_COMMIT_REF:"main"},{...env,VERCEL_GIT_COMMIT_REF:"feat/j3-sandbox-payment-20261126"}]){assert.equal(await getJ1Readiness(e),null);assert.equal((await handleJ1Readiness(req(),e,noNetwork)).status,404);}
});
test("origin, method and header guards reject without provider calls",async()=>{
 assert.equal((await handleJ1Readiness(req("GET"),env,noNetwork)).status,405);
 assert.equal((await handleJ1Readiness(req("POST","https://other.vercel.app"+path),env,noNetwork)).status,404);
 assert.equal((await handleJ1Readiness(req("POST",origin+path,{...headers,origin:"https://evil.example"}),env,noNetwork)).status,403);
 assert.equal((await handleJ1Readiness(req("POST",origin+path,{"sec-fetch-site":"same-origin",origin}),env,noNetwork)).status,403);
});
test("page does not call providers or disclose credential values",async()=>{
 const r=await handleJ1Readiness(req("GET",origin+"/dev/testing-centre",{}),env,noNetwork);
 assert.equal(r.status,200);const body=await r.text();assert.match(body,/J1 \+ J2 Private Testing Centre/);assert.match(body,/Not run/);assert.doesNotMatch(body,/fixture-(?:wix|resend|hitpay)-secret|0123456789abcdef/);assert.equal(r.headers.get("cache-control"),"private, no-store");assert.equal(r.headers.get("x-robots-tag"),"noindex, nofollow");
});
test("actual probe is a single filtered Wix read and exposes only status enums",async()=>{
 let calls=0;
 const r=await handleJ1Readiness(req(),env,async(url,opts)=>{calls++;assert.equal(url,"https://www.wixapis.com/wix-data/v2/items/query");assert.equal(opts.method,"POST");const body=JSON.parse(opts.body);assert.equal(body.dataCollectionId,"Children");assert.match(body.query.filter.parentId,/^qa-j2-[a-f0-9]{64}$/);assert.equal(body.query.filter.accountStatus,"preview-test");return new Response(JSON.stringify({dataItems:[],pagingMetadata:{total:0}}));});
 assert.equal(calls,1);const data=await r.json();assert.equal(data.checks.wixRead,"VERIFIED_READ_ONLY");assert.equal(data.checks.studentAuthSecret,"CONFIGURED");assert.equal(data.checks.studentAuthEnabled,"CONFIGURED");assert.equal(data.checks.sandboxCredentialIsolation,"NOT_VERIFIED");assert.equal(data.checks.realEmailDelivery,"NOT_VERIFIED");assert.doesNotMatch(JSON.stringify(data),/fixture-|noreply@|qa-j2-/);
});
test("missing credentials and provider failure never appear ready",async()=>{
 const missing=await getJ1Readiness({...env,WIX_DEV_DATA_API_KEY:"",RESEND_API_KEY:"",PARENT_AUTH_SECRET:""},{probe:true,request:noNetwork});
 assert.equal(missing.wixRead,"NOT_CONFIGURED");assert.equal(missing.authSecret,"NOT_CONFIGURED");assert.equal(missing.resendKey,"NOT_CONFIGURED");
 const failed=await getJ1Readiness(env,{probe:true,request:async()=>new Response("sensitive upstream body",{status:403})});assert.equal(failed.wixRead,"READ_UNCONFIRMED");assert.doesNotMatch(JSON.stringify(failed),/sensitive upstream body/);
});

test("J123 testing centre exposes disabled acceptance gates without claiming live verification",async()=>{
 const integrated={...env,VERCEL_GIT_COMMIT_REF:"integration/j1-j2-j3-20261126",J123_CHECKOUT_ENABLED:"false",J123_GENUINE_WEBHOOK_ACCEPTED:"false"};
 const r=await handleJ1Readiness(req("GET",origin+"/dev/testing-centre",{}),integrated,noNetwork);
 assert.equal(r.status,200);const body=await r.text();
 assert.match(body,/J1 \+ J2 \+ J3 Private Testing Centre/);assert.match(body,/Live acceptance is deferred/);assert.match(body,/Payment confirmation email gate/);assert.match(body,/Genuine provider billing-period mapping/);assert.doesNotMatch(body,/fixture-wix-secret|fixture-resend-secret/);
 const c=await getJ1Readiness(integrated);for(const key of ["integratedCheckoutConfiguration","integratedMembershipGate","integratedWorkerGate","integratedReceiptGate"])assert.equal(c[key],"NOT_CONFIGURED");
 assert.equal(c.integratedPeriodMapping,"NOT_VERIFIED");assert.equal(c.integratedLiveAcceptance,"NOT_VERIFIED");
});

test("J1234 testing centre reports separate disabled readiness gates and never discloses secrets",async()=>{
 const e={...env,VERCEL_GIT_COMMIT_REF:"integration/j1-j2-j3-j4-20261126",J1234_AUTH_ROOT:"abcdef0123456789".repeat(4),J1234_TEST_OPERATOR_SECRET:"012345abcdef6789".repeat(4),J1234_TEST_EMAILS:"fixture@example.invalid"};
 const r=await handleJ1Readiness(req("GET",origin+"/dev/testing-centre",{}),e,noNetwork);assert.equal(r.status,200);
 const body=await r.text();assert.match(body,/J1 \+ J2 \+ J3 \+ J4 Private Testing Centre/);assert.match(body,/Independent test operator capability/);assert.match(body,/Live acceptance is deferred/);assert.match(body,/\/staff\/admin/);
 assert.doesNotMatch(body,/abcdef0123456789|012345abcdef6789|fixture@example.invalid/);
 const c=await getJ1Readiness(e);for(const k of ["j1234ApprovedTestIdentity","j1234OperatorCapability","j1234DirectoryGate","j1234BillingReadGate","j1234AttendanceGate","j1234AttendanceOperatorGate"])assert.equal(c[k],"NOT_CONFIGURED");
 assert.equal(c.j1234ActualStaffAuthorization,"NOT_VERIFIED");assert.equal(c.integratedLiveAcceptance,"NOT_VERIFIED");
 const p=await handleJ1Readiness(req("GET",origin+"/dev/testing-centre",{}),{...e,VERCEL_ENV:"production"},noNetwork);assert.equal(p.status,404);
});
