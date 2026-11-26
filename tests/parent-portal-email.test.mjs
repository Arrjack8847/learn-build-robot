import test from "node:test";
import assert from "node:assert/strict";
import {previewRecipients,createPortalOtpMailer} from "../scripts/parent-auth/secure-auth-transport.mjs";
const env={VERCEL_ENV:"preview",RESEND_API_KEY:"fixture",RESEND_FROM_EMAIL:"onboarding@resend.dev",RESEND_TEST_RECIPIENT:"one@example.invalid"};
test("only explicit preview inbox may receive email",()=>{assert.deepEqual(previewRecipients(env),["one@example.invalid"]);assert.throws(()=>createPortalOtpMailer(env,"other@example.invalid"));assert.throws(()=>previewRecipients({...env,PARENT_PREVIEW_RECIPIENTS:"two@example.invalid"}));});
test("bounded extra allowlist requires sender and rejects arbitrary recipients",async()=>{const cfg={...env,PARENT_PREVIEW_RECIPIENTS:"two@example.invalid",PARENT_PREVIEW_VERIFIED_SENDER:"sender@example.invalid"};assert.deepEqual(previewRecipients(cfg),["one@example.invalid","two@example.invalid"]);let sent=0;const mail=createPortalOtpMailer(cfg,"two@example.invalid",async(url,options)=>{sent++;assert.equal(url,"https://api.resend.com/emails");assert.deepEqual(JSON.parse(options.body).to,["two@example.invalid"]);return new Response(JSON.stringify({id:"fixture"}));});await assert.rejects(mail.sendParentCode("other@example.invalid","123456",300000,"a".repeat(32)));await mail.sendParentCode("two@example.invalid","123456",300000,"a".repeat(32));assert.equal(sent,1);assert.throws(()=>createPortalOtpMailer({...cfg,VERCEL_ENV:"production"},"two@example.invalid"));});

test("five independent approved inboxes are accepted; sixth and production are denied",async()=>{
 const addresses=["one","two","three","four","five"].map(x=>x+"@example.invalid");
 const cfg={...env,PARENT_PREVIEW_RECIPIENTS:addresses.slice(1).join(","),PARENT_PREVIEW_VERIFIED_SENDER:"sender@example.invalid"};
 assert.deepEqual(previewRecipients(cfg),addresses);
 assert.throws(()=>previewRecipients({...cfg,PARENT_PREVIEW_RECIPIENTS:cfg.PARENT_PREVIEW_RECIPIENTS+",six@example.invalid"}));
 const sent=[];
 for(const [index,address] of addresses.entries()){
  const code=String(100000+index);
  const challenge=(index+1).toString(16).padStart(32,"0");
  const mail=createPortalOtpMailer(cfg,address,async(url,options)=>{
   const body=JSON.parse(options.body);sent.push({to:body.to,subject:body.subject,key:options.headers["Idempotency-Key"]});
   assert.equal(body.text.includes(code),true);
   return new Response(JSON.stringify({id:"fixture-"+index}));
  });
  await assert.rejects(mail.sendParentCode(addresses[(index+1)%addresses.length],code,300000,challenge));
  await mail.sendParentCode(address,code,300000,challenge);
 }
 assert.deepEqual(sent.map(x=>x.to),addresses.map(x=>[x]));
 assert.equal(new Set(sent.map(x=>x.key)).size,5);
 assert.throws(()=>createPortalOtpMailer({...cfg,VERCEL_TARGET_ENV:"production"},addresses[0]));
});
test("provider rejection does not report successful OTP delivery",async()=>{
 const cfg={...env,PARENT_PREVIEW_RECIPIENTS:"two@example.invalid",PARENT_PREVIEW_VERIFIED_SENDER:"sender@example.invalid"};
 const mail=createPortalOtpMailer(cfg,"two@example.invalid",async()=>new Response("fixture failure",{status:429}));
 await assert.rejects(mail.sendParentCode("two@example.invalid","123456",300000,"b".repeat(32)),/DELIVERY_UNCONFIRMED/);
});
