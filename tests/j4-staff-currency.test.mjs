import test from "node:test";
import assert from "node:assert/strict";
import {formatMonthlySales} from "../scripts/staff/sales-export.mjs";
import {createDeskOperations} from "../scripts/staff/desk-operations.mjs";
import {createDeskRegistrationPayment} from "../scripts/staff/desk-registration-payment.mjs";
const period="2026-11";
const row={receiptId:"r1",source:"hitpay",type:"sale",status:"settled",amountMinor:4200,localDate:"2026-11-12",currency:"SGD"};
test("SGD reconciled export and mixed currency rejection",()=>{
 const ledger={period,reconciled:true,currency:"SGD",rows:[row]};
 const res=formatMonthlySales(ledger,period);
 assert.equal(res.currency,"SGD");assert.equal(res.netMinor,4200);assert.match(res.csv,/Amount \(SGD\)/);assert.match(res.csv,/42\.00/);
 assert.throws(()=>formatMonthlySales({...ledger,rows:[{...row,currency:"MYR"}]},period));
 assert.throws(()=>formatMonthlySales({...ledger,reconciled:false},period));
});
const identity={resolveStaff:async()=>({staffId:"s1",displayName:"Fictional staff",role:"admin",accountStatus:"active"})};
const clock={now:()=>1760000000000,localDay:()=> "2026-11-26"};
test("receipt uses actual configured amount and currency",async()=>{
 const svc=createDeskOperations({identity,clock,store:{readIssuedReceipt:async()=>({receiptId:"r1",paymentId:"p1",source:"hitpay",childName:"Fictional",coveredMonth:period,amountMinor:4200,currency:"SGD",status:"issued",issuedAt:clock.now()})}});
 const res=await svc.receipt({},"r1");assert.equal(res.receipt.amountMinor,4200);assert.equal(res.receipt.currency,"SGD");
});
test("desk payment refuses absent amount policy without writing",async()=>{
 const svc=createDeskRegistrationPayment({identity,clock,policy:{deskPaymentsApproved:true,version:"v1",allowedDeskMethods:["cash"]},store:{recordAuditedDeskPayment:async()=>{throw Error("must not write");}}});
 const r=await svc.recordDeskPayment({},{membershipId:"m1",requestId:"req1",coveredMonth:period,reason:"test only",evidenceRef:"ref1",method:"cash"});
 assert.equal(r.status,"POLICY_REQUIRED");
});
