import test from "node:test";
import assert from "node:assert/strict";
import {j123InfrastructureStatus,requireJ123Identity,J123_BRANCH,J123_SITE,J123_ORIGIN,J123_PLAN,J123_TERMS} from "../scripts/j123/infrastructure.mjs";
import {getJ1Readiness} from "../scripts/j1/readiness.mjs";
import {handleParentOtpTest} from "../scripts/j2-runtime.mjs";
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:J123_BRANCH,VERCEL_URL:"test.vercel.app",WIX_DEV_SITE_ID:J123_SITE,WIX_DEV_DATA_API_KEY:"fixture-wix",RESEND_API_KEY:"fixture-resend",RESEND_TEST_RECIPIENT:"fixture@gmail.com",PARENT_PREVIEW_OPEN_EMAIL:"1",PARENT_PREVIEW_VERIFIED_SENDER:"noreply@mail.bestemready.edu.my",PARENT_AUTH_SECRET:"0123456789abcdef".repeat(4),STUDENT_AUTH_SECRET:"fedcba9876543210".repeat(4),STUDENT_AUTH_ENABLED:"true",HITPAY_API_URL:J123_ORIGIN,HITPAY_PLAN_ID:J123_PLAN,HITPAY_CURRENCY:"MYR",HITPAY_MEMBERSHIP_AMOUNT:"360.00",HITPAY_SANDBOX_PAYMENT_METHOD:"touch_n_go",HITPAY_API_KEY:"DISABLED_J3_WIX_VAULT_ONLY",HITPAY_SALT_KEY:"DISABLED_J3_WIX_VAULT_ONLY",HITPAY_API_BASE_URL:"DISABLED_J3_WIX_VAULT_ONLY",J123_CHECKOUT_ENABLED:"false",J123_GENUINE_WEBHOOK_ACCEPTED:"false"};
test("exact private branch, dev database and independent secrets are required",()=>{
 const s=j123InfrastructureStatus(env);assert.equal(s.authReady,true);assert.equal(s.providerConfigured,true);assert.equal(s.checkoutReady,false);
 for(const changed of [{VERCEL_ENV:"production"},{VERCEL_GIT_COMMIT_REF:"main"},{WIX_DEV_SITE_ID:"wrong"},{STUDENT_AUTH_SECRET:""},{STUDENT_AUTH_SECRET:env.PARENT_AUTH_SECRET.toUpperCase()},{STUDENT_AUTH_ENABLED:"false"},{RESEND_API_KEY:""},{PARENT_PREVIEW_OPEN_EMAIL:"0"},{PARENT_PREVIEW_VERIFIED_SENDER:"onboarding@resend.dev"}]){assert.equal(j123InfrastructureStatus({...env,...changed}).authReady,false);assert.throws(()=>requireJ123Identity({...env,...changed}));}
 assert.doesNotMatch(JSON.stringify(s),/fixture-|noreply@|0123456789abcdef|DISABLED_J3/);
});
test("only MYR TNG and isolated legacy settings qualify for checkout; explicit acceptance required",()=>{
 for(const changed of [{HITPAY_API_URL:"https://api.hit-pay.com"},{HITPAY_CURRENCY:"SGD"},{HITPAY_SANDBOX_PAYMENT_METHOD:"card"},{HITPAY_API_KEY:"legacy"},{HITPAY_SALT_KEY:"legacy"},{HITPAY_API_BASE_URL:"legacy"}])assert.equal(j123InfrastructureStatus({...env,...changed}).providerConfigured,false);
 const accepted={...env,J3_SANDBOX_ROTATION_CONFIRMED:"true",J123_CHECKOUT_ENABLED:"true",J123_GENUINE_WEBHOOK_ACCEPTED:"true",J123_PAYMENT_TERMS_VERSION:J123_TERMS};assert.equal(j123InfrastructureStatus(accepted).checkoutReady,true);
 for(const k of ["J3_SANDBOX_ROTATION_CONFIRMED","J123_CHECKOUT_ENABLED","J123_GENUINE_WEBHOOK_ACCEPTED","J123_PAYMENT_TERMS_VERSION"])assert.equal(j123InfrastructureStatus({...accepted,[k]:""}).checkoutReady,false);
});
test("Testing Centre distinguishes missing identity secret from safe sandbox configuration",async()=>{
 const r=await getJ1Readiness({...env,STUDENT_AUTH_SECRET:""});assert.equal(r.integratedIdentityConfiguration,"NOT_CONFIGURED");assert.equal(r.integratedSandboxConfiguration,"CONFIGURED");assert.equal(r.integratedCheckoutConfiguration,"NOT_CONFIGURED");assert.equal(r.genuineWebhookDelivery,"NOT_VERIFIED");assert.equal(r.realEmailDelivery,"NOT_VERIFIED");
});
test("missing J123 PIN secret refuses OTP before provider or database activity",async()=>{
 const request=new Request("https://test.vercel.app/api/dev/parent-otp/request-email",{method:"POST",headers:{origin:"https://test.vercel.app","sec-fetch-site":"same-origin","x-stem-otp-test":"1","content-type":"application/json"},body:JSON.stringify({email:"fixture@gmail.com"})});
 const r=await handleParentOtpTest(request,{...env,STUDENT_AUTH_SECRET:""});assert.equal(r.status,503);assert.equal((await r.json()).ok,false);
});
