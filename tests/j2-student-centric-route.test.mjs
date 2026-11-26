import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const signIn=readFileSync(new URL("../src/routes/parent.sign-in.tsx",import.meta.url),"utf8");
const old=readFileSync(new URL("../src/routes/parent.dashboard.tsx",import.meta.url),"utf8");
test("normal payer route does not lead to parent management",()=>{assert.doesNotMatch(signIn,/window\.location\.replace\("\/parent\/dashboard"\)/);assert.match(old,/window\.location\.replace\("\/parent\/sign-in"\)/);assert.doesNotMatch(old,/family-child-edit/);});
test("payer selection rechecks server ownership and fails closed",()=>{assert.match(signIn,/portal\("family-child-get",\{childId:selected\}\)/);assert.match(signIn,/r\.child\.id!==selected/);assert.match(signIn,/No payment has been created or membership activated/);assert.doesNotMatch(signIn,/RM360|sandbox-checkout|family-child-edit/);});
test("resend countdown and new student registration are present",()=>{assert.match(signIn,/Date\.now\(\)\+60000/);assert.match(signIn,/Register another student/);assert.match(signIn,/portal\("logout"\)/);});

import {randomBytes,randomUUID} from "node:crypto";
import {createAuthCrypto} from "../scripts/parent-auth/secure-auth-transport.mjs";
import {createPreviewOtp} from "../scripts/parent-auth/preview-otp.mjs";
import {createFamilyPreview,NOTICE_VERSION} from "../scripts/parent-auth/family-preview.mjs";
test("five fixture payers, siblings, concurrent retry, consent and isolation",async()=>{
 const rows=new Map(),clone=x=>structuredClone(x),key=(c,i)=>c+":"+i;
 const db={get:async(c,i)=>clone(rows.get(key(c,i))??null),insert:async(c,i,v)=>{if(rows.has(key(c,i)))return false;rows.set(key(c,i),clone(v));return true;},replaceIfVersion:async(c,i,v,next)=>{if(rows.get(key(c,i))?.stateVersion!==v)return false;rows.set(key(c,i),clone(next));return true;},listFixtureChildren:async p=>[...rows].filter(([k,v])=>k.startsWith("Children:")&&v.parentId===p).map(([,v])=>clone(v))};
 let now=Date.now();const clock={now:()=>now},mail=new Map(),crypto=createAuthCrypto({VERCEL_ENV:"preview",PARENT_AUTH_SECRET:randomBytes(32).toString("hex")});
 const addresses=Array.from({length:5},(_,i)=>"fixture-"+i+"@example.invalid");
 const services=addresses.map((recipient,i)=>createPreviewOtp({store:db,crypto:{...crypto,sixDigits:()=>String(100001+i)},clock,recipient,mailer:{sendParentCode:async(address,code)=>{mail.set(address,code);}}}));
 for(const svc of services)assert.equal((await svc.requestCode()).status,"CODE_SENT");
 assert.equal((await services[0].verifyCode(mail.get(addresses[1]))).ok,false);
 const tokens=[];
 for(let i=0;i<5;i++){const r=await services[i].verifyCode(mail.get(addresses[i]));assert.equal(r.status,"VERIFIED");tokens.push(r.token);assert.equal((await services[i].verifyCode(mail.get(addresses[i]))).ok,false);}
 assert.equal(new Set(tokens).size,5);
 const family=createFamilyPreview({db,crypto,clock,resolveSession:async token=>{for(const svc of services){const identity=await svc.resolveIdentity(token);if(identity)return identity;}return null;}});
 const call=(token,action,body)=>family.handle(token,action,body);
 assert.equal((await call("","family-status")).status,"NOT_AUTHORIZED");
 for(const t of tokens){assert.equal((await call(t,"family-status")).status,"CONSENT_REQUIRED");assert.equal((await call(t,"family-consent",{accepted:true,noticeVersion:NOTICE_VERSION})).status,"CONSENT_RECORDED");}
 const input={name:"Test Student A",birthYear:2018,requestKey:randomUUID()};
 const results=await Promise.all(Array.from({length:6},()=>call(tokens[0],"family-child-create",input)));
 assert.ok(results.every(r=>r.ok&&r.child.id===results[0].child.id));
 const second=await call(tokens[0],"family-child-create",{name:"Test Student B",birthYear:2018,requestKey:randomUUID()});
 assert.notEqual(second.child.id,results[0].child.id);
 const other=await call(tokens[1],"family-child-create",{name:"Test Student A",birthYear:2018,requestKey:randomUUID()});
 assert.notEqual(other.child.id,results[0].child.id);
 assert.equal((await call(tokens[0],"family-status")).children.length,2);
 assert.equal((await call(tokens[1],"family-status")).children.length,1);
 assert.equal((await call(tokens[0],"family-child-get",{childId:other.child.id})).status,"NOT_FOUND");
 for(const t of tokens.slice(2))assert.equal((await call(t,"family-child-get",{childId:second.child.id})).status,"NOT_FOUND");
 assert.equal((await call(tokens[0],"family-child-get",{childId:second.child.id})).child.id,second.child.id);
 await services[0].logout(tokens[0]);assert.equal((await call(tokens[0],"family-status")).status,"NOT_AUTHORIZED");
 now+=61000;assert.equal((await services[0].requestCode()).status,"CODE_SENT");
 const returned=await services[0].verifyCode(mail.get(addresses[0]));assert.equal(returned.status,"VERIFIED");
 assert.equal((await call(returned.token,"family-status")).children.length,2);
 assert.equal((await services[3].requestCode()).status,"CODE_SENT");now+=300001;
 assert.equal((await services[3].verifyCode(mail.get(addresses[3]))).status,"INVALID_OR_EXPIRED");
});
