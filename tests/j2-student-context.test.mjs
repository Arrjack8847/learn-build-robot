import test from "node:test";
import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import {createAuthCrypto} from "../scripts/parent-auth/secure-auth-transport.mjs";
import {createStudentAuthCrypto} from "../scripts/student-auth/crypto.mjs";
import {createStudentContext} from "../scripts/student-auth/session-context.mjs";
import {createFamilyPreview,NOTICE_VERSION} from "../scripts/parent-auth/family-preview.mjs";
test("real OTP core plus student context: parent enrollment, proof isolation, ownership, session and revocation",async()=>{
 let now=1795660000000;
 const rows=new Map(),sent=new Map(),key=(c,id)=>c+":"+id,copy=x=>structuredClone(x);
 const db={get:async(c,id)=>copy(rows.get(key(c,id))??null),insert:async(c,id,r)=>{if(rows.has(key(c,id)))return false;rows.set(key(c,id),copy(r));return true;},replaceIfVersion:async(c,id,v,r)=>{if(rows.get(key(c,id))?.stateVersion!==v)return false;rows.set(key(c,id),copy(r));return true;},listFixtureChildren:async p=>[...rows.entries()].filter(([k,r])=>k.startsWith("Children:")&&r.parentId===p).map(([,r])=>copy(r))};
 const env={VERCEL_ENV:"preview",PARENT_AUTH_SECRET:randomBytes(32).toString("hex"),STUDENT_AUTH_SECRET:randomBytes(32).toString("hex")},auth=createAuthCrypto(env),crypto=createStudentAuthCrypto(env),clock={now:()=>now},emails=["a@example.invalid","b@example.invalid"];
 const context=createStudentContext({db,auth,crypto,clock,emails,mailerFor:email=>({sendParentCode:async(recipient,code)=>{assert.equal(recipient,email);sent.set(email,code);}})});
 async function otp(email,student){const service=context.svc(email,student);assert.equal((await service.requestCode()).status,"CODE_SENT");const result=await service.verifyCode(sent.get(email));assert.equal(result.status,"VERIFIED");return result.token;}
 async function register(email,name,requestKey){const payer=await otp(email,false),svc=context.svc(email,false);const family=createFamilyPreview({db,crypto:auth,clock,resolveSession:t=>svc.resolveIdentity(t)});assert.equal((await family.handle(payer,"family-consent",{accepted:true,noticeVersion:NOTICE_VERSION})).ok,true);const r=await family.handle(payer,"family-child-create",{name,birthYear:2018,requestKey});assert.equal(r.ok,true);return {payer,id:r.child.id};}
 const a=await register(emails[0],"Test Alpha","aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
 const b=await register(emails[1],"Test Beta","bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
 assert.notEqual(a.id,b.id);
 assert.equal((await context.identity.enroll(b.payer,a.id,"581304")).ok,false);
 assert.equal((await context.identity.enroll(a.payer,a.id,"581304")).status,"ENROLLED");
 assert.equal((await context.identity.enroll(b.payer,b.id,"723819")).status,"ENROLLED");
 const proof=await otp(emails[0],true);
 assert.equal(await context.payer(proof),null);
 assert.equal(await context.proof(a.payer),null);
 assert.equal((await context.identity.signIn(proof,b.id,"723819")).ok,false);
 const result=await context.identity.signIn(proof,a.id,"581304");assert.equal(result.status,"VERIFIED");
 assert.equal(await context.proof(proof),null);
 assert.equal(await context.payer(result.token),null);
 assert.equal((await context.identity.resolveStudentSession(result.token)).studentId,a.id);
 await context.identity.logout(result.token);
 assert.equal(await context.identity.resolveStudentSession(result.token),null);
 const other=await otp(emails[1],true);
 now+=300001;assert.equal(await context.proof(other),null);
 assert.equal((await context.identity.signIn(other,b.id,"723819")).ok,false);
});
