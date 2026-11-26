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

import {openPreviewRecipients,validPreviewEmail,createAuthCrypto} from "../scripts/parent-auth/secure-auth-transport.mjs";
import {createPreviewOtp,createPreviewSessionAccess} from "../scripts/parent-auth/preview-otp.mjs";
import {reservePreviewEmailBudget} from "../scripts/parent-auth/preview-email-budget.mjs";
const openEnv={...env,PARENT_PREVIEW_OPEN_EMAIL:"1",PARENT_PREVIEW_VERIFIED_SENDER:"sender@example.invalid"};
test("protected open mode accepts arbitrary valid recipients, not malformed addresses or production",async()=>{
 assert.equal(openPreviewRecipients(openEnv),true);
 for(const address of ["one@gmail.com","other@outlook.com","tester+new@yahoo.com","parent@school.edu.my","six@example.invalid","seven@example.invalid"]){
  assert.equal(validPreviewEmail(address),true);
  const mail=createPortalOtpMailer(openEnv,address,async(url,options)=>{assert.deepEqual(JSON.parse(options.body).to,[address]);return new Response(JSON.stringify({id:"fixture"}));});
  await mail.sendParentCode(address,"123456",300000,"a".repeat(32));
 }
 for(const address of ["a@@test.com","a b@test.com","a..b@test.com","x@-bad.com","x@bad..com","x@test.com\nBcc: x@test.com"])assert.throws(()=>createPortalOtpMailer(openEnv,address));
 assert.throws(()=>createPortalOtpMailer({...openEnv,VERCEL_ENV:"production"},"one@gmail.com"));
 assert.throws(()=>createPortalOtpMailer({...openEnv,VERCEL_TARGET_ENV:"production"},"one@gmail.com"));
 assert.throws(()=>createPortalOtpMailer({...openEnv,PARENT_PREVIEW_VERIFIED_SENDER:"onboarding@resend.dev"},"one@gmail.com"));
});
function fixtureStore(){
 const rows=new Map();return {async get(c,id){return structuredClone(rows.get(c+":"+id)??null)},async insert(c,id,row){const k=c+":"+id;if(rows.has(k))return false;rows.set(k,structuredClone(row));return true},async replaceIfVersion(c,id,v,row){const k=c+":"+id;if(rows.get(k)?.stateVersion!==v)return false;rows.set(k,structuredClone(row));return true}};
}
const fixtureCrypto=()=>createAuthCrypto({...openEnv,PARENT_AUTH_SECRET:"0123456789abcdef".repeat(4)});
test("open session resolver validates hashed tokens, preserves individual identities and revocation",async()=>{
 const store=fixtureStore(),crypto=fixtureCrypto(),clock={now:()=>1795708800000};
 const mail=new Map();const service=recipient=>createPreviewOtp({store,crypto,clock,recipient,mailer:{async sendParentCode(email,code){mail.set(email,code)}}});
 const a=service("first@example.invalid"),b=service("second@example.invalid");
 assert.equal((await a.requestCode()).ok,true);assert.equal((await b.requestCode()).ok,true);
 const ta=(await a.verifyCode(mail.get("first@example.invalid"))).token,tb=(await b.verifyCode(mail.get("second@example.invalid"))).token;
 const access=createPreviewSessionAccess({store,crypto,clock});
 assert.notEqual((await access.resolveIdentity(ta)).accountId,(await access.resolveIdentity(tb)).accountId);
 assert.equal(await b.resolveIdentity(ta),null);assert.equal(await access.resolveIdentity("x".repeat(43)),null);
 assert.equal((await access.logout(ta)).status,"SIGNED_OUT");assert.equal(await access.resolveIdentity(ta),null);assert.ok(await access.resolveIdentity(tb));
});
test("global durable request budget applies across identities and concurrent callers",async()=>{
 const store=fixtureStore(),crypto=fixtureCrypto();let now=1795737600000;const clock={now:()=>now};
 const take=()=>reservePreviewEmailBudget({store,crypto,clock});
 const first=await Promise.all([take(),take(),take(),take(),take()]);assert.equal(first.filter(Boolean).length,5);
 for(let i=5;i<25;i++)assert.equal(await take(),true);
 assert.equal(await take(),false);now+=3600000;
 for(let i=0;i<25;i++)assert.equal(await take(),true);
 now+=3600000;for(let i=0;i<10;i++)assert.equal(await take(),true);
 assert.equal(await take(),false);
});
