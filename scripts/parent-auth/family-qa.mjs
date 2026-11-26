// Local fixture tests and exact-preview live Wix test. Never sends OTPs to a real inbox.
import assert from "node:assert/strict";
import {createHash,randomBytes,randomUUID} from "node:crypto";
import {createAuthCrypto} from "./secure-auth-transport.mjs";
import {createPreviewOtp} from "./preview-otp.mjs";
import {createFamilyPreview,NOTICE_VERSION} from "./family-preview.mjs";
import {createWixStore} from "./wix-store.mjs";
const e=process.env;
async function run(db,crypto,namespace){
 let now=Date.now();
 const clock={now:()=>now},mail=new Map();
 const svc=email=>createPreviewOtp({store:db,crypto,clock,recipient:email,mailer:{sendParentCode:async(address,code)=>{mail.set(address,code);}}});
 const aEmail="qa-j2-a-"+namespace+"@example.invalid",bEmail="qa-j2-b-"+namespace+"@example.invalid";
 const a=svc(aEmail),b=svc(bEmail);
 const login=async(s,email)=>{assert.equal((await s.requestCode()).status,"CODE_SENT");const code=mail.get(email);const result=await s.verifyCode(code);assert.equal(result.status,"VERIFIED");assert.equal((await s.verifyCode(code)).ok,false);return result.token;};
 await a.requestCode();const original=mail.get(aEmail);const wrong=original==="000000"?"111111":"000000";
 for(let i=0;i<4;i++)assert.equal((await a.verifyCode(wrong)).status,"INVALID_OR_EXPIRED");
 assert.equal((await a.verifyCode(wrong)).status,"LOCKED");assert.equal((await a.verifyCode(original)).status,"LOCKED");assert.equal((await a.requestCode()).status,"LOCKED");console.log("[J2 QA] PASS five attempts and resend lock");
 now+=900001;
 const at=await login(a,aEmail),bt=await login(b,bEmail);
 const family=createFamilyPreview({db,crypto,clock,resolveSession:async token=>await a.resolveIdentity(token)??await b.resolveIdentity(token)});
 const call=(token,action,input)=>family.handle(token,action,input);
 assert.equal((await call("", "family-status")).status,"NOT_AUTHORIZED");
 assert.equal((await call(at,"family-status")).status,"CONSENT_REQUIRED");
 assert.equal((await call(at,"family-child-create",{name:"Test Child",birthYear:2018,requestKey:randomUUID()})).status,"CONSENT_REQUIRED");
 for(const t of [at,bt]){assert.equal((await call(t,"family-consent",{accepted:false,noticeVersion:NOTICE_VERSION})).ok,false);assert.equal((await call(t,"family-consent",{accepted:true,noticeVersion:NOTICE_VERSION})).status,"CONSENT_RECORDED");}
 const input={name:"Test Child A",birthYear:2018,requestKey:randomUUID()};
 const ca=await call(at,"family-child-create",input);assert.equal(ca.status,"CHILD_SAVED");
 assert.equal((await call(at,"family-child-create",input)).child.id,ca.child.id);
 const cb=await call(bt,"family-child-create",{name:"Test Child B",birthYear:2019,requestKey:randomUUID()});assert.equal(cb.status,"CHILD_SAVED");
 assert.deepEqual((await call(at,"family-status")).children.map(c=>c.id),[ca.child.id]);
 assert.deepEqual((await call(bt,"family-status")).children.map(c=>c.id),[cb.child.id]);
 assert.equal((await call(at,"family-child-get",{childId:cb.child.id})).status,"NOT_FOUND");
 assert.equal((await call(at,"family-child-edit",{childId:cb.child.id,name:"Test Stolen",birthYear:2019,version:cb.child.version})).status,"NOT_FOUND");
 const edited=await call(at,"family-child-edit",{childId:ca.child.id,name:"Test Updated",birthYear:2020,version:ca.child.version});
 assert.equal(edited.child.name,"Test Updated");
 assert.equal((await call(at,"family-child-edit",{childId:ca.child.id,name:"Test Stale",birthYear:2020,version:ca.child.version})).status,"EDIT_CONFLICT");
 assert.equal((await call(bt,"family-child-get",{childId:cb.child.id})).child.name,"Test Child B");
 console.log("[J2 QA] PASS consent, persistent profiles, retry, isolation and conditional edit");
 await a.logout(at);assert.equal((await call(at,"family-status")).status,"NOT_AUTHORIZED");now+=43200001;assert.equal((await call(bt,"family-status")).status,"NOT_AUTHORIZED");console.log("[J2 QA] PASS logout and expiry");
}
const mem=new Map(),clone=x=>structuredClone(x),key=(c,i)=>c+":"+i;
const db={get:async(c,i)=>clone(mem.get(key(c,i))??null),insert:async(c,i,v)=>{if(mem.has(key(c,i)))return false;mem.set(key(c,i),clone(v));return true;},replaceIfVersion:async(c,i,version,v)=>{if(mem.get(key(c,i))?.stateVersion!==version)return false;mem.set(key(c,i),clone(v));return true;},listFixtureChildren:async p=>[...mem].filter(([k,v])=>k.startsWith("Children:")&&v.parentId===p).map(([k,v])=>clone(v))};
await run(db,createAuthCrypto({VERCEL_ENV:"preview",PARENT_AUTH_SECRET:randomBytes(32).toString("hex")}),"memory");
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J2: connect isolated parent consent and child profiles to secure Wix sessions"){
 if(!e.VERCEL_URL||!e.VERCEL_GIT_COMMIT_SHA)throw Error("PREVIEW_ID_REQUIRED");
 const ns=createHash("sha256").update(e.VERCEL_URL+":"+e.VERCEL_GIT_COMMIT_SHA).digest("hex").slice(0,20);
 await run(createWixStore(e),createAuthCrypto(e),ns);
 console.log("[J2 QA] LIVE WIX PASS (fictional accounts, captured OTP only)");
}

// A single email to the designated development inbox. Consume and revoke the code/session
// immediately; the test is not a login to the user's real account.
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J2: verify real OTP mail transport and secure session round trip"){
 const {createTestOtpMailer}=await import("./secure-auth-transport.mjs");
 const db=createWixStore(e),baseCrypto=createAuthCrypto(e),mailer=createTestOtpMailer(e);
 const recipient=e.RESEND_TEST_RECIPIENT?.trim().toLowerCase();
 if(!recipient)throw Error("TEST_RECIPIENT_REQUIRED");
 const marker="qa-j2-otp-email-v1",collection="SandboxBillingState";
 if(await db.get(collection,marker))throw Error("OTP_EMAIL_QA_ALREADY_RESERVED_NO_RETRY");
 const stateVersion=baseCrypto.newVersion();
 if(!await db.insert(collection,marker,{environment:"sandbox-qa",stateVersion,stateJson:JSON.stringify({fixture:true,status:"reserved"})}))throw Error("OTP_EMAIL_QA_ALREADY_RESERVED_NO_RETRY");
 // Separate namespace prevents interfering with the interactive preview account.
 const crypto={...baseCrypto,identityDigest:(kind,email)=>baseCrypto.identityDigest("qa-j2-email-v1-"+kind,email)};
 let code=null,token=null;
 const service=createPreviewOtp({store:db,crypto,clock:{now:()=>Date.now()},recipient,mailer:{async sendParentCode(address,value,ttl,id){await mailer.sendParentCode(address,value,ttl,id);code=value;}}});
 try{
  const requested=await service.requestCode();
  if(requested.status!=="CODE_SENT"||typeof code!=="string")throw Error("OTP_MAIL_UNCONFIRMED");
  const verified=await service.verifyCode(code);
  if(verified.status!=="VERIFIED")throw Error("OTP_SESSION_UNCONFIRMED");
  token=verified.token;
  assert.equal((await service.status(token)).status,"VERIFIED");
  assert.equal((await service.verifyCode(code)).ok,false);
  assert.equal((await service.logout(token)).status,"SIGNED_OUT");
  assert.equal((await service.status(token)).status,"NOT_VERIFIED");
  if(!await db.replaceIfVersion(collection,marker,stateVersion,{environment:"sandbox-qa",stateVersion:baseCrypto.newVersion(),stateJson:JSON.stringify({fixture:true,status:"passed",emailAccepted:true,codeConsumed:true,sessionRevoked:true})}))throw Error("OTP_QA_WRITE_UNCONFIRMED");
  const result=JSON.parse((await db.get(collection,marker)).stateJson);
  assert.equal(result.status,"passed");
  console.log("[J2 OTP email QA] PASS provider accepted OTP; durable verification, replay refusal, session revocation; inbox delivery separate");
 }finally{
  code=null;
  if(token)await service.logout(token);
 }
}
