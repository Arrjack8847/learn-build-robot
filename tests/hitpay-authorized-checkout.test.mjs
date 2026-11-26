import test from "node:test";
import {createAuthorizedCheckout} from "../scripts/hitpay/authorized-checkout.mjs";
function checkoutCases(create) {
  const config={environment:"sandbox",currency:"SGD",membershipMinor:825,depositMinor:210,planId:"plan-fixture"};
  const input={kind:"membership",childId:"student-a",requestKey:"req-1"};
  const deposit={kind:"deposit",childId:"student-a",requestKey:"req-2",bookingId:"booking-a"};
  function fixture(options={}) {
    const counts={posts:0,binds:0,reserves:0};
    const parent={parentId:"parent-a",accountType:"parent",emailVerified:true,email:"qa@example.invalid"};
    let saved;
    const checkout=create({config,identity:{resolveParent:async()=>options.parent===undefined?parent:options.parent,hasCurrentConsentAndTerms:async()=>!options.noConsent},store:{
      getOwnedActiveChild:async(p,c)=>c==="student-a"?{parentId:p,childId:c}:null,
      getAuthorizedDepositBooking:async(p,c,b)=>({parentId:p,childId:c,bookingId:b,depositDue:!options.noDeposit}),
      reserveAuthorizedCheckout:async expected=>{counts.reserves++; if(saved)return {created:false,reservation:{...saved,requestKey:expected.requestKey}};saved={...expected,attemptId:"attempt-a",reference:"opaque-a",status:"reserved",startDate:"2026-11-26",...(options.corrupt||{})};return {created:true,reservation:saved};},
      bindCheckoutOnce:async()=>{counts.binds++;return !options.bindFailure;}
    },transport:{
      createMembership:async()=>{counts.posts++;if(options.timeout)throw Error("timeout");return {providerId:"sub-a",url:options.url||"https://securecheckout.sandbox.hit-pay.com/test"};},
      createDeposit:async r=>{counts.posts++;if(r.bookingId!=="booking-a"||r.amountMinor!==210)throw Error("bad booking");return {providerId:"dep-a",url:"https://securecheckout.sandbox.hit-pay.com/test"};}
    },isAllowedCheckoutUrl:url=>url.startsWith("https://securecheckout.sandbox.hit-pay.com/")});
    return {checkout,counts};
  }
  function equal(actual,expected){if(actual!==expected)throw Error("Expected "+expected+", got "+actual);}
  return [
    ["membership returns pending only",async()=>{const f=fixture();const r=await f.checkout({},input);equal(r.status,"pending_verification");equal(f.counts.posts,1);equal(f.counts.binds,1);}],
    ["reject browser-supplied amount",async()=>{const f=fixture();equal((await f.checkout({},{...input,amountMinor:1})).error,"INVALID_INPUT");equal(f.counts.posts,0);}],
    ["reject unauthenticated payer",async()=>{const f=fixture({parent:null});equal((await f.checkout({},input)).error,"NOT_AUTHORIZED");equal(f.counts.reserves,0);}],
    ["reject unrelated student",async()=>{const f=fixture();equal((await f.checkout({},{...input,childId:"student-b"})).error,"NOT_AUTHORIZED");equal(f.counts.posts,0);}],
    ["require current consent",async()=>{const f=fixture({noConsent:true});equal((await f.checkout({},input)).error,"CONSENT_REQUIRED");equal(f.counts.posts,0);}],
    ["reject deposit without approved booking rule",async()=>{const f=fixture({noDeposit:true});equal((await f.checkout({},deposit)).error,"DEPOSIT_NOT_AUTHORIZED");equal(f.counts.posts,0);}],
    ["deposit uses separate provider path",async()=>{const f=fixture();equal((await f.checkout({},deposit)).status,"pending_verification");equal(f.counts.posts,1);}],
    ["concurrent checkout returns existing attempt",async()=>{const f=fixture();const rs=await Promise.all([f.checkout({},input),f.checkout({},input)]);equal(rs.every(r=>r.status==="pending_verification"),true);equal(f.counts.posts,1);}],
    ["uncertain create does not retry",async()=>{const f=fixture({timeout:true});equal((await f.checkout({},input)).error,"RECONCILIATION_REQUIRED");equal((await f.checkout({},input)).status,"pending_verification");equal(f.counts.posts,1);}],
    ["reject corrupted reservation",async()=>{const f=fixture({corrupt:{childId:"student-b"}});equal((await f.checkout({},input)).error,"CHECKOUT_UNAVAILABLE");equal(f.counts.posts,0);}],
    ["reject hostile hosted URL",async()=>{const f=fixture({url:"https://evil.invalid"});equal((await f.checkout({},input)).error,"RECONCILIATION_REQUIRED");equal(f.counts.binds,0);}],
    ["failed binding does not retry",async()=>{const f=fixture({bindFailure:true});equal((await f.checkout({},input)).error,"RECONCILIATION_REQUIRED");await f.checkout({},input);equal(f.counts.posts,1);}],
  ];
}
for(const [name,run] of checkoutCases(createAuthorizedCheckout))test(name,run);
