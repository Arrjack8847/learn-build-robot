import test from "node:test";
import assert from "node:assert/strict";
import {normalizePaymentMethod,reconcilePaymentMethod,legacyIsolated} from "../scripts/hitpay/j3-payment-method.mjs";
test("provider nested display name",()=>assert.equal(reconcilePaymentMethod({payment_method:{name:"Touch 'n Go"}}).verified,true));
test("provider code",()=>assert.equal(reconcilePaymentMethod({payment_method:{code:"touch_n_go",type:"wallet"}}).verified,true));
test("string and variant normalization",()=>{assert.equal(normalizePaymentMethod("Touch ’n Go eWallet"),"touch_n_go");assert.equal(reconcilePaymentMethod({payment_method:"TNG"}).verified,true)});
test("missing or generic wallet is insufficient",()=>{assert.equal(reconcilePaymentMethod({payment_method:{type:"wallet"}}).verified,false);assert.equal(reconcilePaymentMethod({}).verified,false)});
test("other or conflicting payment method rejected",()=>{assert.equal(reconcilePaymentMethod({payment_method:{code:"grabpay"}}).verified,false);assert.equal(reconcilePaymentMethod({payment_method:{code:"touch_n_go",name:"GrabPay"}}).verified,false)});
test("all three legacy settings must be disabled",()=>{const x=Object.fromEntries(["HITPAY_API_KEY","HITPAY_SALT_KEY","HITPAY_API_BASE_URL"].map(k=>[k,"DISABLED_J3_WIX_VAULT_ONLY"]));assert.equal(legacyIsolated(x),true);assert.equal(legacyIsolated({...x,HITPAY_API_KEY:"fixture-old"}),false);assert.equal(legacyIsolated({}),false)});
