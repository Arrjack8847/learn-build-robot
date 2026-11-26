// Server-only J123 configuration contract. Never reads a provider or emits secret values.
import {createAuthCrypto,openPreviewRecipients,validPreviewEmail} from "../parent-auth/secure-auth-transport.mjs";
import {createStudentAuthCrypto} from "../student-auth/crypto.mjs";
export const J123_BRANCH="integration/j1-j2-j3-20261126";
export const J123_SITE="09d613aa-3a95-42ff-9ee3-2aa0c706c447";
export const J123_ORIGIN="https://api.sandbox.hit-pay.com";
export const J123_PLAN="a34f0707-c529-4c64-9f1f-e969c0d3de16";
export const J123_TERMS="j123-sandbox-membership-v1";
const SENTINEL="DISABLED_J3_WIX_VAULT_ONLY";
const present=v=>typeof v==="string"&&v.trim().length>0;
const testInbox=env=>typeof env.RESEND_TEST_RECIPIENT==="string"&&validPreviewEmail(env.RESEND_TEST_RECIPIENT.trim().toLowerCase());
export function isJ123Preview(env){
 return env.VERCEL_ENV==="preview"&&env.VERCEL_TARGET_ENV!=="production"&&env.VERCEL_GIT_COMMIT_REF===J123_BRANCH;
}
export function j123InfrastructureStatus(env){
 let parent=false,student=false;
 try{createAuthCrypto(env);parent=true;}catch{}
 try{createStudentAuthCrypto(env);student=true;}catch{}
 const checks={
  preview:isJ123Preview(env),
  wix:env.WIX_DEV_SITE_ID===J123_SITE&&present(env.WIX_DEV_DATA_API_KEY),
  resend:present(env.RESEND_API_KEY)&&testInbox(env)&&openPreviewRecipients(env)&&env.PARENT_PREVIEW_VERIFIED_SENDER==="noreply@mail.bestemready.edu.my",
  parentSecret:parent,
  studentSecret:student,
  distinctSecrets:parent&&student&&env.PARENT_AUTH_SECRET.toLowerCase()!==env.STUDENT_AUTH_SECRET.toLowerCase(),
  studentEnabled:env.STUDENT_AUTH_ENABLED==="true",
  sandbox:env.HITPAY_API_URL===J123_ORIGIN&&env.HITPAY_PLAN_ID===J123_PLAN&&env.HITPAY_CURRENCY==="MYR"&&env.HITPAY_MEMBERSHIP_AMOUNT==="360.00"&&env.HITPAY_SANDBOX_PAYMENT_METHOD==="touch_n_go",
  legacyDisabled:["HITPAY_API_KEY","HITPAY_SALT_KEY","HITPAY_API_BASE_URL"].every(k=>env[k]===SENTINEL),
  rotationConfirmed:env.J3_SANDBOX_ROTATION_CONFIRMED==="true",
  webhookAccepted:env.J123_GENUINE_WEBHOOK_ACCEPTED==="true",
  termsApproved:env.J123_PAYMENT_TERMS_VERSION===J123_TERMS,
  checkoutEnabled:env.J123_CHECKOUT_ENABLED==="true"
 };
 const authReady=["preview","wix","resend","parentSecret","studentSecret","distinctSecrets","studentEnabled"].every(k=>checks[k]);
 const providerConfigured=checks.preview&&checks.wix&&checks.sandbox&&checks.legacyDisabled;
 const checkoutReady=authReady&&providerConfigured&&checks.rotationConfirmed&&checks.webhookAccepted&&checks.termsApproved&&checks.checkoutEnabled;
 return Object.freeze({...checks,authReady,providerConfigured,checkoutReady});
}
export function requireJ123Identity(env){
 if(!j123InfrastructureStatus(env).authReady)throw Error("J123_IDENTITY_CONFIGURATION_REQUIRED");
}
