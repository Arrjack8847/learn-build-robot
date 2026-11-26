import test from "node:test";
import assert from "node:assert/strict";
import {randomBytes,randomUUID} from "node:crypto";
import {createAuthCrypto} from "../scripts/parent-auth/secure-auth-transport.mjs";
import {createFamilyPreview,NOTICE_VERSION} from "../scripts/parent-auth/family-preview.mjs";
import {createPreviewOtp} from "../scripts/parent-auth/preview-otp.mjs";
function fixture(){
 let now=1795660000000;const rows=new Map(),key=(c,id)=>c+":"+id;
 const db={get:async(c,id)=>structuredClone(rows.get(key(c,id))??null),insert:async(c,id,r)=>{if(rows.has(key(c,id)))return false;rows.set(key(c,id),structuredClone(r));return true;},replaceIfVersion:async(c,id,v,r)=>{if(rows.get(key(c,id))?.stateVersion!==v)return false;rows.set(key(c,id),structuredClone(r));return true;},listFixtureChildren:async p=>[...rows.entries()].filter(([k,r])=>k.startsWith("Children:")&&r.parentId===p).map(([,r])=>structuredClone(r))};
 const crypto=createAuthCrypto({VERCEL_ENV:"preview",PARENT_AUTH_SECRET:randomBytes(32).toString("hex")}),clock={now:()=>now};
 const accounts={payerA:crypto.identityDigest("parent-preview-session","a@example.invalid"),payerB:crypto.identityDigest("parent-preview-session","b@example.invalid")};
 const family=version=>createFamilyPreview({db,crypto,clock,noticeVersion:version,resolveSession:async t=>accounts[t]?{accountType:"parent-test",accountId:accounts[t]}:null});
 return {db,rows,crypto,clock,accounts,family,advance:ms=>{now+=ms;}};
}
test("privacy version changes preserve old acceptance and require fresh consent exactly once",async()=>{
 const f=fixture(),v1=f.family(NOTICE_VERSION),v2=f.family("preview-fictional-v2"),p="qa-j2-"+f.accounts.payerA;
 assert.equal((await v1.handle("payerA","family-consent",{accepted:false,noticeVersion:NOTICE_VERSION})).status,"CONSENT_REQUIRED");
 assert.equal((await v1.handle("payerA","family-child-create",{name:"Test Alpha",birthYear:2018,requestKey:randomUUID()})).status,"CONSENT_REQUIRED");
 const accept1={accepted:true,noticeVersion:NOTICE_VERSION};
 assert.ok((await Promise.all(Array.from({length:8},()=>v1.handle("payerA","family-consent",accept1)))).every(x=>x.ok));
 const previous=await f.db.get("PrivacyConsents",p+"-consent");f.advance(1000);
 assert.equal((await v1.handle("payerA","family-consent",accept1)).ok,true);
 assert.deepEqual(await f.db.get("PrivacyConsents",p+"-consent"),previous);
 assert.equal((await v2.handle("payerA","family-status")).noticeVersion,"preview-fictional-v2");
 assert.equal((await v2.handle("payerA","family-consent",accept1)).ok,false);
 const accept2={accepted:true,noticeVersion:"preview-fictional-v2"};
 assert.ok((await Promise.all(Array.from({length:8},()=>v2.handle("payerA","family-consent",accept2)))).every(x=>x.ok));
 assert.equal((await v2.handle("payerA","family-status")).status,"FAMILY_READY");
 assert.deepEqual(await f.db.get("PrivacyConsents",p+"-consent"),previous);
 assert.equal([...f.rows.keys()].filter(k=>k.startsWith("PrivacyConsents:")).length,2);
 assert.equal((await v2.handle("payerB","family-status")).status,"CONSENT_REQUIRED");
});
test("parallel different request IDs, case and whitespace variants deduplicate; conflicting reuse is denied",async()=>{
 const f=fixture(),family=f.family(NOTICE_VERSION),p="qa-j2-"+f.accounts.payerA;
 for(const t of ["payerA","payerB"])await family.handle(t,"family-consent",{accepted:true,noticeVersion:NOTICE_VERSION});
 const req=randomUUID(),base={name:"Test Alpha",birthYear:2018,requestKey:req};
 const results=await Promise.all(Array.from({length:30},(_,i)=>family.handle("payerA","family-child-create",{...base,name:i%2?"Test ALPHA":"Test Alpha",requestKey:i===0?req:randomUUID()})));
 assert.ok(results.every(x=>x.ok));assert.equal(new Set(results.map(x=>x.child.id)).size,1);
 const original=results[0].child.id;
 assert.equal((await family.handle("payerA","family-child-create",{...base,name:"Test Beta"})).status,"REQUEST_CONFLICT");
 assert.equal((await family.handle("payerA","family-child-create",{...base,requestKey:"-".repeat(36)})).status,"INVALID_INPUT");
 assert.equal((await family.handle("payerA","family-child-create",{...base,birthYear:3000,requestKey:randomUUID()})).status,"INVALID_INPUT");
 assert.equal((await family.handle("payerA","family-child-create",{...base,name:"Test  Alpha",requestKey:randomUUID()})).child.id,original);
 const sibling=await family.handle("payerA","family-child-create",{...base,name:"Test Beta",requestKey:randomUUID()});assert.notEqual(sibling.child.id,original);
 const other=await family.handle("payerB","family-child-create",base);assert.notEqual(other.child.id,original);
 assert.equal((await f.db.listFixtureChildren(p)).length,2);
 assert.equal((await family.handle("payerB","family-child-get",{childId:original})).status,"NOT_FOUND");
});
test("existing legacy student ID is retained and an ambiguous historical duplicate fails closed",async()=>{
 const f=fixture(),family=f.family(NOTICE_VERSION),p="qa-j2-"+f.accounts.payerA;
 await family.handle("payerA","family-consent",{accepted:true,noticeVersion:NOTICE_VERSION});
 const req=randomUUID(),legacy="qa-j2-"+f.crypto.identityDigest("j2-child-"+p,req),row={childId:legacy,parentId:p,name:"Test Legacy",birthYear:2018,accountStatus:"preview-test",createdAt:{$date:new Date(f.clock.now()).toISOString()},stateVersion:f.crypto.newVersion()};
 await f.db.insert("Children",legacy,row);
 assert.equal((await family.handle("payerA","family-child-create",{name:row.name,birthYear:row.birthYear,requestKey:randomUUID()})).child.id,legacy);
 const duplicate="qa-j2-"+"d".repeat(64);await f.db.insert("Children",duplicate,{...row,childId:duplicate});
 assert.equal((await family.handle("payerA","family-child-create",{name:row.name,birthYear:row.birthYear,requestKey:randomUUID()})).status,"DUPLICATE_REVIEW_REQUIRED");
});
test("OTP core itself separates purpose, refuses unconfirmed session writes, and never returns OTP",async()=>{
 const f=fixture(),mail=[];const recipient="a@example.invalid",make=(accountType,store=f.db)=>createPreviewOtp({store,crypto:f.crypto,clock:f.clock,recipient,accountType,mailer:{sendParentCode:async(email,code)=>mail.push(code)}});
 const parent=make("parent-test"),proof=make("student-email-proof");
 assert.equal((await parent.requestCode()).status,"CODE_SENT");assert.equal((await proof.requestCode()).status,"CODE_SENT");assert.equal(mail.length,2);
 const p=await parent.verifyCode(mail[0]),v=await proof.verifyCode(mail[1]);assert.equal(p.status,"VERIFIED");assert.equal(v.status,"VERIFIED");
 assert.equal(await proof.resolveIdentity(p.token),null);assert.equal(await parent.resolveIdentity(v.token),null);
 f.advance(300000);assert.equal(await proof.resolveIdentity(v.token),null);assert.ok(await parent.resolveIdentity(p.token));
 const broken={...f.db,insert:async(c,id,r)=>c==="AuthSessions"?true:f.db.insert(c,id,r)};const svc=make("parent-test",broken);
 assert.equal((await svc.requestCode()).status,"CODE_SENT");await assert.rejects(svc.verifyCode(mail.at(-1)),/SESSION_WRITE_UNCONFIRMED/);
});
