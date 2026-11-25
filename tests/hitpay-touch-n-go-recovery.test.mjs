import test from "node:test";
import assert from "node:assert/strict";
import {isAllowedSandboxCheckoutUrl} from "../scripts/hitpay/checkout-url.mjs";
import {recoverExistingTouchNGo} from "../scripts/hitpay/touch-n-go-recover-core.mjs";
const planId="a34f0707-c529-4c64-9f1f-e969c0d3de16",ref="stem-lab-checkout-v1",id="a34f0707-c529-4c64-9f1f-e969c0d3de17";
const row={planId,providerReference:ref,status:"reserved_tng_test",stateVersion:"v1",createdAt:{$date:"2026-11-25T09:58:09.492Z"}};
const match={id,reference:ref,status:"scheduled",business_recurring_plans_id:planId,amount:"360.00",currency:"MYR",cycle:"monthly",times_to_be_charged:2,url:"https://hitpay-billing-sandbox.fly.dev/fixture"};
function fixture({record=row,subscription=match,duplicate=false,incomplete=false,cas=true}={}){
 let saved=structuredClone(record),writes=0;
 const deps={store:{get:async()=>structuredClone(saved),replaceIfVersion:async(c,r,v,n)=>{writes++;if(!cas||saved.stateVersion!==v)return false;saved=structuredClone(n);return true}},readSubscriptions:async s=>({data:s==="scheduled"?[subscription,...(duplicate?[subscription]:[])]:[],meta:{last_page:incomplete?2:1}}),newVersion:()=>"v2"};
 return {run:()=>recoverExistingTouchNGo(deps),writes:()=>writes,saved:()=>saved};
}
test("exact sandbox origins accepted; arbitrary and live URLs denied",()=>{for(const u of ["https://securecheckout.sandbox.hit-pay.com/fixture",match.url])assert.equal(isAllowedSandboxCheckoutUrl(u),true);for(const u of ["https://other.fly.dev/x","https://hitpay-billing-sandbox.fly.dev.evil.test","http://hitpay-billing-sandbox.fly.dev/x","https://user@hitpay-billing-sandbox.fly.dev/x","https://hitpay-billing-sandbox.fly.dev:8443/x","https://securecheckout.hit-pay.com/x"])assert.equal(isAllowedSandboxCheckoutUrl(u),false)});
test("verified unique subscription bound once; second recovery idempotent",async()=>{const f=fixture();assert.equal(await f.run(),"HOSTED_VERIFIED");assert.equal(f.saved().providerSubscriptionId,id);assert.equal(f.saved().status,"hosted");assert.equal(await f.run(),"ALREADY_HOSTED");assert.equal(f.writes(),1)});
test("duplicate match refused",async()=>{const f=fixture({duplicate:true});assert.equal(await f.run(),"MATCH_COUNT_2");assert.equal(f.writes(),0)});
test("invalid URL, plan, amount, currency, cycle, charge count and status refused",async()=>{for(const patch of [{url:"https://evil.fly.dev/x"},{business_recurring_plans_id:"other"},{amount:361},{currency:"USD"},{cycle:"weekly"},{times_to_be_charged:3},{status:"active"}]){const f=fixture({subscription:{...match,...patch}});assert.equal(await f.run(),"MATCH_DETAILS_UNVERIFIED");assert.equal(f.writes(),0)}});
test("unrelated reservation refused",async()=>{const f=fixture({record:{...row,createdAt:{$date:"2026-11-25T09:59:00.000Z"}}});assert.equal(await f.run(),"RESERVATION_NOT_ELIGIBLE");assert.equal(f.writes(),0)});
test("incomplete provider list refused",async()=>{const f=fixture({incomplete:true});await assert.rejects(f.run(),/LOOKUP_INCOMPLETE/);assert.equal(f.writes(),0)});
test("CAS race does not overwrite existing reservation",async()=>{const f=fixture({cas:false});assert.equal(await f.run(),"CAS_NOT_CONFIRMED");assert.equal(f.saved().status,"reserved_tng_test")});
