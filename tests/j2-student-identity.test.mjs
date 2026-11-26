import test from "node:test";
import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import {createStudentIdentity} from "../scripts/student-auth/identity.mjs";
import {createStudentAuthCrypto} from "../scripts/student-auth/crypto.mjs";
const id=n=>"qa-j2-"+n.repeat(64);
function fixture(){
 let now=1000000;const map=new Map(),proofs=new Map(),used=new Set(),p=id("1"),q=id("2"),a=id("a"),b=id("b"),c=id("c");
 const key=(c,i)=>c+":"+i,clone=x=>structuredClone(x);
 const db={get:async(c,i)=>clone(map.get(key(c,i))??null),insert:async(c,i,r)=>{if(map.has(key(c,i)))return false;map.set(key(c,i),clone(r));return true;},replaceIfVersion:async(c,i,v,r)=>{if(map.get(key(c,i))?.stateVersion!==v)return false;map.set(key(c,i),clone(r));return true;}};
 const crypto=createStudentAuthCrypto({VERCEL_ENV:"preview",STUDENT_AUTH_SECRET:randomBytes(32).toString("hex")});
 const service=createStudentIdentity({db,crypto,clock:{now:()=>now},resolvePayer:async t=>t==="payer-a"?{role:"payer",parentId:p}:t==="payer-b"?{role:"payer",parentId:q}:null,resolveEmailProof:async t=>!used.has(t)?proofs.get(t):null,consumeEmailProof:async(t,proof)=>{if(used.has(t)||proofs.get(t)!==proof)return false;used.add(t);return true;},getOwnedStudent:async(parent,student)=>parent===p&&[a,b].includes(student)||parent===q&&student===c});
 const proof=(t,parent=p)=>proofs.set(t,{role:"student-email-proof",parentId:parent});
 return {service,db,crypto,p,q,a,b,c,proof,advance:ms=>{now+=ms;}};
}
test("distinct sibling PINs, payer ownership, proof scope, student-only sessions and revocation",async()=>{
 const f=fixture(),s=f.service;f.proof("otp-a");f.proof("otp-b");
 assert.equal((await s.enroll("payer-b",f.a,"581304")).ok,false);
 assert.equal((await s.enroll("payer-a",f.a,"123456")).ok,false);
 assert.equal((await s.enroll("payer-a",f.a,"581304")).status,"ENROLLED");
 assert.equal((await s.enroll("payer-a",f.b,"723819")).status,"ENROLLED");
 assert.equal((await s.enroll("payer-a",f.a,"982731")).status,"ALREADY_ENROLLED");
 const saved=await f.db.get("StudentAuthCredentials",f.a);assert.notEqual(saved.pinHash,"581304");assert.match(saved.pinHash,/^[a-f0-9]{32}:[a-f0-9]{64}$/);
 assert.equal((await s.signIn("payer-a",f.a,"581304")).ok,false);
 assert.equal((await s.signIn("otp-a",f.c,"581304")).ok,false);
 assert.equal((await s.signIn("otp-a",f.b,"581304")).ok,false);
 const login=await s.signIn("otp-a",f.a,"581304");assert.equal(login.status,"VERIFIED");
 const sibling=await s.signIn("otp-b",f.b,"723819");assert.equal(sibling.status,"VERIFIED");
 assert.deepEqual(await s.resolveStudentSession(login.token),{role:"student",studentId:f.a,environment:"private-preview"});
 assert.equal((await s.resolveStudentSession(sibling.token)).studentId,f.b);
 assert.equal((await s.signIn("otp-a",f.a,"581304")).ok,false);
 assert.equal(await s.resolveStudentSession("payer-a"),null);
 await s.logout(login.token);assert.equal(await s.resolveStudentSession(login.token),null);
 assert.equal((await s.resolveStudentSession(sibling.token)).studentId,f.b);
 f.advance(14400001);assert.equal(await s.resolveStudentSession(sibling.token),null);
});
test("durable five-attempt lock, expiry and concurrent attempts",async()=>{
 const f=fixture(),s=f.service;f.proof("otp");
 await s.enroll("payer-a",f.a,"581304");
 const attempts=await Promise.all(Array.from({length:12},()=>s.signIn("otp",f.a,"777777")));
 assert.ok(attempts.every(r=>!r.ok));
 assert.equal((await f.db.get("StudentAuthCredentials",f.a)).attempts,5);
 assert.equal((await s.signIn("otp",f.a,"581304")).ok,false);
 f.advance(900001);assert.equal((await s.signIn("otp",f.a,"581304")).status,"VERIFIED");
});
test("student cryptography refuses production and binds PIN hash to student ID",async()=>{
 assert.throws(()=>createStudentAuthCrypto({VERCEL_ENV:"production",STUDENT_AUTH_SECRET:randomBytes(32).toString("hex")}));
 const f=fixture(),hash=await f.crypto.hashPin(f.a,"581304");
 assert.equal(await f.crypto.verifyPin(f.b,"581304",hash),false);
 assert.equal(await f.crypto.verifyPin(f.a,"581304",hash),true);
});
