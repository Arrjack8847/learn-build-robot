import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createIntegratedCheckoutHttp} from "../scripts/j123/checkout-http.mjs";
import {createMembershipWorkerHttp} from "../scripts/j123/membership-worker-http.mjs";
import {flushPaymentReceipts} from "../scripts/j123/payment-receipts.mjs";
import {getJ1Readiness} from "../scripts/j1/readiness.mjs";
import {J123_BRANCH,J123_SITE,J123_ORIGIN,J123_PLAN,J123_TERMS} from "../scripts/j123/infrastructure.mjs";
const child="qa-j2-"+"a".repeat(64),origin="https://fixture.vercel.app";
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:J123_BRANCH,VERCEL_URL:"fixture.vercel.app",WIX_DEV_SITE_ID:J123_SITE,WIX_DEV_DATA_API_KEY:"fixture",RESEND_API_KEY:"fixture",RESEND_TEST_RECIPIENT:"fixture@gmail.com",PARENT_PREVIEW_OPEN_EMAIL:"1",PARENT_PREVIEW_VERIFIED_SENDER:"noreply@mail.bestemready.edu.my",PARENT_AUTH_SECRET:"0123456789abcdef".repeat(4),STUDENT_AUTH_SECRET:"fedcba9876543210".repeat(4),STUDENT_AUTH_ENABLED:"true",HITPAY_API_URL:J123_ORIGIN,HITPAY_PLAN_ID:J123_PLAN,HITPAY_CURRENCY:"MYR",HITPAY_MEMBERSHIP_AMOUNT:"360.00",HITPAY_SANDBOX_PAYMENT_METHOD:"touch_n_go",HITPAY_API_KEY:"DISABLED_J3_WIX_VAULT_ONLY",HITPAY_SALT_KEY:"DISABLED_J3_WIX_VAULT_ONLY",HITPAY_API_BASE_URL:"DISABLED_J3_WIX_VAULT_ONLY",J3_SANDBOX_ROTATION_CONFIRMED:"true",J123_CHECKOUT_ENABLED:"true",J123_GENUINE_WEBHOOK_ACCEPTED:"true",J123_PAYMENT_TERMS_VERSION:J123_TERMS,J123_MEMBERSHIP_RECONCILIATION_ENABLED:"true",J123_MEMBERSHIP_WORKER_ENABLED:"true",J123_MEMBERSHIP_WORKER_SECRET:"ab".repeat(32),J123_PAYMENT_EMAIL_ENABLED:"true"};
const req=(path,body)=>new Request(origin+path,{method:"POST",headers:{origin,"sec-fetch-site":"same-origin","x-stem-j123":"1","content-type":"application/json",authorization:"Bearer "+env.J123_MEMBERSHIP_WORKER_SECRET},body:JSON.stringify(body)});
test("all payment, worker and receipt paths refuse production, wrong branch or wrong database before any side effect",async()=>{
 let calls=0;const never=()=>{calls++;throw Error("UNEXPECTED_SIDE_EFFECT");};
 const checkout=createIntegratedCheckoutHttp({resolvePayer:never,storeFactory:never,requestFn:never}),worker=createMembershipWorkerHttp({storeFactory:never,requestFn:never});
 const db={get:never,insert:never,replaceIfVersion:never};
 for(const patch of [{VERCEL_ENV:"production"},{VERCEL_TARGET_ENV:"production"},{VERCEL_GIT_COMMIT_REF:"main"},{WIX_DEV_SITE_ID:"wrong"}]){
  const cfg={...env,...patch};
  assert.equal((await checkout(req("/api/dev/j123/checkout",{childId:child,requestKey:"one",termsVersion:J123_TERMS}),cfg)).status,404);
  assert.equal((await checkout(req("/api/dev/j123/checkout/status",{childId:child}),cfg)).status,404);
  assert.equal((await worker(req("/api/dev/j123/membership-worker",{eventKey:"b".repeat(64)}),cfg)).status,404);
  assert.equal(await flushPaymentReceipts({env:cfg,db,studentId:child,requestFn:never}),"disabled");
 }
 assert.equal(calls,0);
});
test("default acceptance configuration prevents all checkout, worker and email mutations",async()=>{
 let calls=0;const never=()=>{calls++;throw Error("UNEXPECTED_SIDE_EFFECT");};
 const cfg={...env,J123_CHECKOUT_ENABLED:"false",J123_GENUINE_WEBHOOK_ACCEPTED:"false",J123_MEMBERSHIP_WORKER_ENABLED:"false",J123_PAYMENT_EMAIL_ENABLED:"false"};
 assert.equal((await createIntegratedCheckoutHttp({resolvePayer:never,storeFactory:never,requestFn:never})(req("/api/dev/j123/checkout",{childId:child,requestKey:"one",termsVersion:J123_TERMS}),cfg)).status,503);
 assert.equal((await createMembershipWorkerHttp({storeFactory:never,requestFn:never})(req("/api/dev/j123/membership-worker",{eventKey:"b".repeat(64)}),cfg)).status,404);
 assert.equal(await flushPaymentReceipts({env:cfg,db:{get:never},studentId:child,requestFn:never}),"disabled");
 const status=await getJ1Readiness(cfg);assert.equal(status.integratedIdentityConfiguration,"CONFIGURED");assert.equal(status.integratedLiveAcceptance,"NOT_VERIFIED");assert.equal(calls,0);
});
test("student change remounts checkout and invalidates old response generation (source regression)",()=>{
 const s=readFileSync(new URL("../src/components/j123-checkout.tsx",import.meta.url),"utf8");
 assert.match(s,/<StudentCheckout key=\{props\.childId\}/);
 assert.match(s,/useLayoutEffect\(\(\)=>\{active\.current=true;return\(\)=>\{active\.current=false;generation\.current\+\+;/);
 assert.match(s,/if\(!active\.current\|\|generation\.current!==g\)return;.*window\.location\.assign/);
 assert.match(s,/useState\(false\)/);
});
