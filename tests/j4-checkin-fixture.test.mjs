import test from "node:test";
import assert from "node:assert/strict";
import {createJ4StateService} from "../scripts/staff/j4-state-service.mjs";
import {createJ4Fixtures,createFixtureReadStore} from "../scripts/staff/j4-fixtures.mjs";
test("isolated code lifecycle",async()=>{
 let seq=0,nextCode=11111110,state={...createJ4Fixtures(),mode:"j4-fixture-v1",stateVersion:"start"};
 const clone=x=>JSON.parse(JSON.stringify(x));
 const store={readStrong:async()=>clone(state),compareAndSet:async(v,n)=>{if(state.stateVersion!==v)return false;state=clone(n);return true;}};
 const crypto={newId:()=>`id-${++seq}`,newToken:()=>String(++seq).padStart(43,"a"),staffSessionDigest:t=>t.padStart(64,"a"),verifyPassword:async()=>true,newCheckInCode:()=>String(++nextCode),checkInDigest:(s,c)=>s+":"+c,equalDigest:(a,b)=>a===b};
 const clock={now:()=>Date.parse("2026-11-26T12:00:00+08:00"),localDay:()=>"2026-11-26"};
 const svc=createJ4StateService({store,crypto,clock});
 async function login(username){const r=await svc.signIn({username,password:"fixture-only-test-password"});assert.ok(r.ok);return {headers:{get:()=>r.cookie.split(";")[0]}};}
 const req=await login("qa-j4-staff-2"),finance=await login("qa-j4-staff-3");
 const run=(action,bookingId,code)=>svc.checkInCode(req,{action,bookingId,code});
 assert.equal((await svc.checkInCode(finance,{action:"issue-code",bookingId:"qa-j4-booking-5"})).ok,false);
 assert.equal((await run("issue-code","qa-j4-booking-2")).ok,false);
 const a=await run("issue-code","qa-j4-booking-5"),b=await run("issue-code","qa-j4-booking-5");assert.ok(a.ok&&b.ok);assert.equal(state.codes[0].status,"revoked");
 assert.equal((await run("validate-code","qa-j4-booking-5",a.code)).ok,false);
 const concurrent=await Promise.all([run("validate-code","qa-j4-booking-5",b.code),run("validate-code","qa-j4-booking-5",b.code)]);assert.equal(concurrent.filter(x=>x.ok).length,1);
 assert.equal(state.attendance[4].status,"attended");
 assert.ok((await run("issue-code","qa-j4-booking-7")).ok);
 for(let i=0;i<4;i++)assert.equal((await run("validate-code","qa-j4-booking-7","99999999")).ok,false);
 assert.equal(state.codes.at(-1).status,"locked");assert.equal(state.codes.at(-1).attempts,3);
 const rows=await createFixtureReadStore(state,clock.now()).list({resource:"checkins",page:1,pageSize:25,filters:{},sort:"bookingId",direction:"asc"});assert.equal(rows.total,7);assert.equal(Object.hasOwn(rows.rows[4],"digest"),false);
});
