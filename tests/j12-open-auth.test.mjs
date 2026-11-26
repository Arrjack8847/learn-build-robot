import test from "node:test";
import assert from "node:assert/strict";
import {randomBytes,randomUUID} from "node:crypto";
import {createParentAuthHttp} from "../scripts/parent-auth/http.mjs";
import {createStudentAuthHttp} from "../scripts/student-auth/http.mjs";
import {createStudentContext} from "../scripts/student-auth/session-context.mjs";
import {createAuthCrypto,createPortalOtpMailer} from "../scripts/parent-auth/secure-auth-transport.mjs";
import {createStudentAuthCrypto} from "../scripts/student-auth/crypto.mjs";
import {createPreviewSessionAccess} from "../scripts/parent-auth/preview-otp.mjs";
import {reserveIntegratedEmail,reserveIntegratedRecipient} from "../scripts/parent-auth/preview-email-budget.mjs";
import {createJ123CheckoutPayer} from "../scripts/j2-runtime.mjs";
import {createIntegratedCheckoutHttp} from "../scripts/j123/checkout-http.mjs";
import {scopeJ123StudentCredentials} from "../scripts/j123/student-credential-scope.mjs";
import {NOTICE_VERSION} from "../scripts/parent-auth/family-preview.mjs";

const cfg={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_URL:"j12.invalid",VERCEL_GIT_COMMIT_REF:"integration/j1-j2-20261126",PARENT_PREVIEW_OPEN_EMAIL:"1",PARENT_PREVIEW_VERIFIED_SENDER:"sender@example.invalid",RESEND_API_KEY:"fixture",RESEND_TEST_RECIPIENT:"original@example.invalid",STUDENT_AUTH_ENABLED:"true",PARENT_AUTH_SECRET:randomBytes(32).toString("hex"),STUDENT_AUTH_SECRET:randomBytes(32).toString("hex")};
function fixture({scoped=false}={}){
 let now=1795680000000;const rows=new Map(),sent=new Map(),key=(c,i)=>c+":"+i,clock={now:()=>now};
 const db={get:async(c,i)=>structuredClone(rows.get(key(c,i))??null),insert:async(c,i,r)=>{if(rows.has(key(c,i)))return false;rows.set(key(c,i),structuredClone(r));return true;},replaceIfVersion:async(c,i,v,r)=>{if(rows.get(key(c,i))?.stateVersion!==v)return false;rows.set(key(c,i),structuredClone(r));return true;},listFixtureChildren:async p=>[...rows].filter(([k,r])=>k.startsWith("Children:")&&r.parentId===p).map(([,r])=>structuredClone(r))};
 const auth=createAuthCrypto(cfg),crypto=createStudentAuthCrypto(cfg),emails=[];
 const mailerFor=recipient=>createPortalOtpMailer(cfg,recipient,async(url,opts)=>{assert.equal(url,"https://api.resend.com/emails");const body=JSON.parse(opts.body);assert.deepEqual(body.to,[recipient]);assert.equal(body.from,"BE STEM READY <sender@example.invalid>");sent.set(recipient,body.text.match(/\b\d{6}\b/)[0]);return new Response(JSON.stringify({id:randomUUID()}));});
 const reserveEmail=email=>reserveIntegratedEmail({store:db,crypto:auth,clock,email});
 const context=createStudentContext({db:scoped?scopeJ123StudentCredentials(db):db,auth,crypto,clock,emails,mailerFor,open:true});
 const revokeStudent=async(s,p)=>{await context.identity.logout(s);const old=await context.locate(p,true);if(old)await old.service.logout(p);};
 const parent=createParentAuthHttp({resolveContext:async()=>({db,crypto:auth,clock,approved:[],recipient:cfg.RESEND_TEST_RECIPIENT,mailerFor,revokeStudent,open:true,reserveEmail})});
 const student=createStudentAuthHttp({resolveContext:async()=>({db,emails,context,open:true,reserveEmail})});
 const call=async(kind,action,body,cookies="",env=cfg)=>{
  const prefix=kind==="parent"?"parent-otp":"student-auth",tag=kind==="parent"?"x-stem-otp-test":"x-stem-student-auth";
  const res=await (kind==="parent"?parent:student)(new Request("https://j12.invalid/api/dev/"+prefix+"/"+action,{method:"POST",headers:{origin:"https://j12.invalid","sec-fetch-site":"same-origin",[tag]:"1",...(cookies?{cookie:cookies}:{}),...(body?{"content-type":"application/json"}:{})},...(body?{body:JSON.stringify(body)}:{})}),env);
  return {http:res.status,data:await res.json(),cookies:res.headers.getSetCookie()};
 };
 const cookie=(r,name)=>{const v=r.cookies.find(c=>c.startsWith(name+"="));assert.ok(v);return v.split(";")[0];};
 const login=async(kind,email)=>{
  const request=await call(kind,kind==="parent"?"request-email":"request",{email});assert.equal(request.data.status,"CODE_SENT");
  const verify=await call(kind,kind==="parent"?"verify-email":"verify",{email,code:sent.get(email)});assert.equal(verify.http,200);
  return cookie(verify,kind==="parent"?"__Host-bsr-parent-test":"__Host-bsr-student-proof");
 };
 return {db,auth,clock,rows,context,call,login,cookie,advance:ms=>{now+=ms;},sent};
}
test("unlisted parent and student emails, normal names, direct role-bound proof, sibling PIN isolation and revocation",async()=>{
 const f=fixture(),a="new-parent@outlook.com",b="another-parent@yahoo.com";
 const payer=await f.login("parent",a);
 assert.equal((await f.call("parent","family-status",null,payer)).data.status,"CONSENT_REQUIRED");
 assert.equal((await f.call("parent","family-consent",{accepted:true,noticeVersion:NOTICE_VERSION},payer)).data.status,"CONSENT_RECORDED");
 const c1=(await f.call("parent","family-child-create",{name:"Jack",birthYear:2007,requestKey:randomUUID()},payer)).data.child;
 const c2=(await f.call("parent","family-child-create",{name:"မောင်မောင်",birthYear:2010,requestKey:randomUUID()},payer)).data.child;
 assert.ok(c1&&c2);assert.notEqual(c1.id,c2.id);
 for(const [child,pin] of [[c1,"274913"],[c2,"815306"]])assert.equal((await f.call("student","enroll",{studentId:child.id,pin},payer)).data.ok,true);
 assert.equal((await f.call("student","request",{email:a})).data.status,"COOLDOWN");
 f.advance(61000);
 const proof=await f.login("student",a),token=proof.split("=")[1];
 const proofAccess=createPreviewSessionAccess({store:f.db,crypto:f.auth,clock:f.clock,accountType:"student-email-proof-v2"});
 assert.equal((await proofAccess.resolveIdentity(token)).accountId,f.auth.identityDigest("parent-preview-session",a));
 assert.equal(await createPreviewSessionAccess({store:f.db,crypto:f.auth,clock:f.clock}).resolveIdentity(token),null);
 assert.equal((await f.call("parent","family-status",null,proof.replace("__Host-bsr-student-proof","__Host-bsr-parent-test"))).http,401);
 const list=await f.call("student","list",null,proof);assert.deepEqual(new Set(list.data.students.map(c=>c.id)),new Set([c1.id,c2.id]));
 const foreign=await f.login("parent",b);await f.call("parent","family-consent",{accepted:true,noticeVersion:NOTICE_VERSION},foreign);
 assert.equal((await f.call("parent","family-child-get",{childId:c1.id},foreign)).http,404);
 assert.equal((await f.call("student","sign-in",{studentId:c2.id,pin:"274913"},proof)).data.ok,false);
 const result=await f.call("student","sign-in",{studentId:c2.id,pin:"815306"},proof+"; "+payer);assert.equal(result.data.status,"VERIFIED");
 const student=f.cookie(result,"__Host-bsr-student");assert.match(result.cookies.find(c=>c.startsWith("__Host-bsr-student=")),/Secure; HttpOnly; SameSite=Strict/);
 assert.equal((await f.call("student","status",null,student)).data.student.id,c2.id);
 assert.equal((await f.call("student","list",null,proof)).data.ok,false);
 assert.equal((await f.call("parent","status",null,payer)).data.status,"NOT_VERIFIED");
 assert.equal((await f.call("student","logout",null,student)).data.status,"SIGNED_OUT");
 assert.equal((await f.call("student","status",null,student)).data.status,"NOT_VERIFIED");
 assert.equal((await f.call("parent","request-email",{email:"a@@bad"})).http,400);
 assert.equal((await f.call("student","request",{email:"a@@bad"})).http,400);
 assert.equal((await f.call("parent","request-email",{email:"third@example.invalid"},"",{...cfg,VERCEL_ENV:"production"})).http,404);
});
test("combined durable address throttle across both purposes and shared global cap",async()=>{
 const f=fixture(),email="one@example.invalid";
 const take=()=>reserveIntegratedRecipient({store:f.db,crypto:f.auth,clock:f.clock,email});
 const results=await Promise.all([take(),take(),take(),take()]);
 assert.equal(results.filter(x=>x===null).length,1);
 assert.equal(results.filter(x=>x==="COOLDOWN").length,3);
 for(let i=1;i<5;i++){f.advance(61000);assert.equal(await take(),null);}
 f.advance(61000);assert.equal(await take(),"HOURLY_LIMIT");
 f.advance(3600000);assert.equal(await take(),null);
 for(let i=0;i<25;i++){assert.equal(await reserveIntegratedEmail({store:f.db,crypto:f.auth,clock:f.clock,email:"fresh"+i+"@example.invalid"}),null);}
 assert.equal(await reserveIntegratedEmail({store:f.db,crypto:f.auth,clock:f.clock,email:"fresh25@example.invalid"}),"PREVIEW_EMAIL_BUDGET");
});

test("actual payer OTP and consent/PIN context binds checkout to selected student only, not student proof or stale payer",async()=>{
 const f=fixture(),env={...cfg,VERCEL_GIT_COMMIT_REF:"integration/j1-j2-j3-20261126"};
 const resolve=createJ123CheckoutPayer({getStudentContext:()=>f.context});
 const req=cookie=>new Request("https://j12.invalid/api/dev/j123/checkout",{headers:{cookie}});
 const a=await f.login("parent","payer-a@example.invalid");
 await f.call("parent","family-consent",{accepted:true,noticeVersion:NOTICE_VERSION},a);
 const child=(await f.call("parent","family-child-create",{name:"Test Child",birthYear:2010,requestKey:randomUUID()},a)).data.child;
 assert.equal(await resolve(req(a),env,child.id),null);
 assert.equal((await f.call("student","enroll",{studentId:child.id,pin:"274913"},a)).data.ok,true);
 const binding=await resolve(req(a),env,child.id);
 assert.equal(binding.childId,child.id);assert.match(binding.email,/@example\.invalid$/);
 const b=await f.login("parent","payer-b@example.invalid");
 await f.call("parent","family-consent",{accepted:true,noticeVersion:NOTICE_VERSION},b);
 assert.equal(await resolve(req(b),env,child.id),null);
 f.advance(61000);
 const proof=await f.login("student","payer-a@example.invalid");
 assert.equal(await resolve(req(proof.replace("__Host-bsr-student-proof","__Host-bsr-parent-test")),env,child.id),null);
 assert.equal(await resolve(req(a+"; "+b),env,child.id),null);
 f.advance(600001);
 assert.equal(await resolve(req(a),env,child.id),null);
 assert.equal(await resolve(req(a),{...env,VERCEL_ENV:"production"},child.id),null);
});

test("Phase 04 end-to-end: scoped PIN, two siblings, checkout status and expiry with provider writes disabled",async()=>{
 const f=fixture({scoped:true}),env={...cfg,VERCEL_GIT_COMMIT_REF:"integration/j1-j2-j3-20261126",WIX_DEV_SITE_ID:"09d613aa-3a95-42ff-9ee3-2aa0c706c447",J123_CHECKOUT_ENABLED:"false",J123_GENUINE_WEBHOOK_ACCEPTED:"false"};
 const resolve=createJ123CheckoutPayer({getStudentContext:()=>f.context});
 let providerCalls=0;
 const checkout=createIntegratedCheckoutHttp({resolvePayer:resolve,storeFactory:()=>f.db,requestFn:async()=>{providerCalls++;throw Error("NETWORK_FORBIDDEN");}});
 const call=async(cookie,childId,extra={})=>checkout(new Request("https://j12.invalid/api/dev/j123/checkout/status",{method:"POST",headers:{origin:"https://j12.invalid","sec-fetch-site":"same-origin","x-stem-j123":"1","content-type":"application/json",...(cookie?{cookie}:{})},body:JSON.stringify({childId,...extra})}),env);
 const a=await f.login("parent","phase04-a@example.invalid");
 await f.call("parent","family-consent",{accepted:true,noticeVersion:NOTICE_VERSION},a);
 const children=[];
 for(const [name,birthYear,pin] of [["Test Alpha",2010,"274913"],["Test Beta",2012,"815306"]]){
  const r=await f.call("parent","family-child-create",{name,birthYear,requestKey:randomUUID()},a);
  assert.equal(r.data.ok,true);const id=r.data.child.id;children.push(id);
  assert.equal((await call(a,id)).status,401);
  assert.equal((await f.call("student","enroll",{studentId:id,pin},a)).data.ok,true);
  assert.ok(await f.db.get("StudentAuthCredentials","j123-pin-v1-"+id));
  assert.equal(await f.db.get("StudentAuthCredentials",id),null);
  const status=await call(a,id);assert.equal(status.status,200);
  assert.deepEqual(await status.json(),{ok:true,status:"PAYMENT_TEST_NOT_ENABLED"});
 }
 assert.notEqual(children[0],children[1]);
 const b=await f.login("parent","phase04-b@example.invalid");
 await f.call("parent","family-consent",{accepted:true,noticeVersion:NOTICE_VERSION},b);
 for(const id of children){assert.equal((await call(b,id)).status,401);assert.equal((await call("",id)).status,401);assert.equal((await call(a+"; "+b,id)).status,401);}
 assert.equal((await call(a,children[0],{parentId:"forged"})).status,400);
 f.advance(61000);
 const proof=await f.login("student","phase04-a@example.invalid");
 assert.equal((await call(proof.replace("__Host-bsr-student-proof","__Host-bsr-parent-test"),children[0])).status,401);
 const signed=await f.call("student","sign-in",{studentId:children[1],pin:"815306"},proof);
 assert.equal(signed.data.status,"VERIFIED");
 const student=f.cookie(signed,"__Host-bsr-student");
 assert.equal((await call(student,children[1])).status,401);
 assert.equal((await call(student.replace("__Host-bsr-student","__Host-bsr-parent-test"),children[1])).status,401);
 assert.equal((await f.call("student","status",null,student)).data.student.id,children[1]);
 const payerId="qa-j2-"+f.auth.identityDigest("parent-preview-session","phase04-a@example.invalid");
 const consentKey=payerId+"-consent",consent=await f.db.get("PrivacyConsents",consentKey);
 f.rows.delete("PrivacyConsents:"+consentKey);
 assert.equal((await call(a,children[0])).status,401);
 f.rows.set("PrivacyConsents:"+consentKey,consent);
 assert.equal((await call(a,children[0])).status,200);
 f.advance(600001);
 assert.equal((await call(a,children[0])).status,401);
 assert.equal(providerCalls,0);
 assert.equal([...f.rows.keys()].filter(x=>x.startsWith("SandboxBillingState:j123-checkout-v1-")).length,0);
});
