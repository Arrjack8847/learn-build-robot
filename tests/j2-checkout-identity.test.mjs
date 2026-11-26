import test from "node:test";
import assert from "node:assert/strict";
import {createJ2CheckoutIdentity} from "../scripts/parent-auth/j2-checkout-identity.mjs";
test("J3 handoff accepts only owned student with approved consent, terms and authoritative inactive membership",async()=>{
 const p="qa-j2-"+"1".repeat(64),a="qa-j2-"+"a".repeat(64),b="qa-j2-"+"b".repeat(64);
 let terms=true,status="unpaid";
 const h=createJ2CheckoutIdentity({resolveVerifiedPayer:async t=>t==="payer"?{role:"payer",environment:"private-preview",parentId:p,emailVerified:true}:null,readOwnedStudent:async(parent,id)=>id===a?{parentId:parent,childId:id}:null,readCurrentConsent:async()=>true,readApprovedTerms:async()=>terms,readMembership:async id=>({studentId:id,status})});
 assert.equal((await h.authorizeCheckout("student",{childId:a,requestKey:"test-1"})).status,"NOT_AUTHORIZED");
 assert.equal((await h.authorizeCheckout("payer",{childId:b,requestKey:"test-1"})).status,"NOT_AUTHORIZED");
 terms=false;assert.equal((await h.authorizeCheckout("payer",{childId:a,requestKey:"test-1"})).status,"CONSENT_REQUIRED");
 terms=true;status="active";assert.equal((await h.authorizeCheckout("payer",{childId:a,requestKey:"test-1"})).status,"MEMBERSHIP_ALREADY_ACTIVE_OR_PENDING");
 status="unpaid";assert.deepEqual((await h.authorizeCheckout("payer",{childId:a,requestKey:"test-1"})).intent,{environment:"sandbox",parentId:p,childId:a,requestKey:"test-1"});
});
