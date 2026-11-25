import test from "node:test";
import assert from "node:assert/strict";
import {createSandboxTrial} from "../scripts/hitpay/sandbox-trial.mjs";
const planId="a34f0707-c529-4c64-9f1f-e969c0d3de16";
const initial={planId,providerReference:"stem-lab-checkout-v1",status:"reserved",stateVersion:"v1",createdAt:{$date:"2026-11-25T09:37:45.693Z"}};
function fixture(row=initial,absent=true,success=true){
 let current=structuredClone(row),posts=0,seq=1;
 const provider={getVerifiedFixturePlan:async()=>({planId,amountMinor:36000,currency:"MYR",cycle:"monthly",chargeCount:2}),confirmNoMatchingSubscription:async()=>absent,isAllowedCheckoutUrl:u=>u==="https://securecheckout.sandbox.hit-pay.com/fixture",createHostedSubscription:async()=>{posts++;if(!success)throw Error("unconfirmed");return {subscriptionId:"a34f0707-c529-4c64-9f1f-e969c0d3de17",url:"https://securecheckout.sandbox.hit-pay.com/fixture"}}};
 const store={get:async()=>structuredClone(current),insert:async()=>false,replaceIfVersion:async(c,id,v,next)=>{if(current.stateVersion!==v)return false;current=structuredClone(next);return true}};
 const service=createSandboxTrial({store,provider,planId,newVersion:()=>String(++seq),clock:{now:()=>Date.parse("2026-11-25T10:00:00Z")}});
 return {service,posts:()=>posts};
}
test("one reconciled reservation can be retried with CAS, never twice",async()=>{const f=fixture();assert.equal((await f.service.status()).status,"READY");await Promise.all([f.service.open(),f.service.open()]);assert.equal(f.posts(),1);assert.equal((await f.service.status()).status,"HOSTED")});
test("uncertain second attempt stays blocked",async()=>{const f=fixture(initial,true,false);await f.service.open();assert.equal((await f.service.status()).status,"RECONCILIATION_REQUIRED");await f.service.open();assert.equal(f.posts(),1)});
test("matching or unconfirmed provider lookup refuses retry",async()=>{const f=fixture(initial,false);assert.equal((await f.service.open()).status,"RECONCILIATION_REQUIRED");assert.equal(f.posts(),0)});
test("other reservation cannot be retried",async()=>{const f=fixture({...initial,createdAt:{$date:"2026-11-25T09:38:00.000Z"}});assert.equal((await f.service.status()).status,"RECONCILIATION_REQUIRED");await f.service.open();assert.equal(f.posts(),0)});
