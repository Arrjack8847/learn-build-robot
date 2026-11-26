import test from "node:test";
import {validateVerifiedMembershipPayment,readStudentMembershipStatus} from "../scripts/hitpay/verified-membership-contract.mjs";
function membershipCases(validate,read) {
 const config={environment:"sandbox",currency:"SGD",membershipMinor:825,planId:"plan-a"};
 const reservation={environment:"sandbox",kind:"membership",status:"bound",currency:"SGD",amountMinor:825,planId:"plan-a",attemptId:"attempt-a",reference:"ref-a",parentId:"parent-a",childId:"student-a",providerId:"sub-a"};
 const event={environment:"sandbox",eventType:"charge.created",providerObjectId:"pay-a",signatureVerifiedAt:150,payloadDigest:"a".repeat(64),providerEventKey:"a".repeat(64)};
 const observation={environment:"sandbox",businessId:"merchant-a",eventKey:event.providerEventKey,paymentId:"pay-a",subscriptionId:"sub-a",reference:"ref-a",planId:"plan-a",status:"succeeded",refundedMinor:0,currency:"SGD",amountMinor:825,periodEvidence:"verified_provider_billing_period",periodStartAt:100,periodEndAt:1000,paidAt:120,cycleNumber:1};
 const input={config,merchantId:"merchant-a",reservation,event,observation};
 const record={studentId:"student-a",environment:"sandbox",source:"verified_membership_ledger",state:"paid",providerPaymentId:"pay-a",activatedAt:120,validFrom:100,validUntil:1000};
 const status=(r,now=500,studentId="student-a")=>read({record:r,now,studentId});
 const eq=(a,b)=>{if(a!==b)throw Error("Expected "+b+", got "+a);};
 return [
 ["verified provider evidence binds individual student",()=>{const r=validate(input);eq(r.status,"verified_candidate");eq(r.payment.studentId,"student-a");}],
 ["method attachment cannot activate",()=>eq(validate({...input,event:{...event,eventType:"recurring_billing.method_attached"}}).ok,false)],
 ["deposit cannot activate membership",()=>eq(validate({...input,reservation:{...reservation,kind:"deposit"}}).ok,false)],
 ["wrong subscription rejected",()=>eq(validate({...input,observation:{...observation,subscriptionId:"sub-b"}}).ok,false)],
 ["wrong reference rejected",()=>eq(validate({...input,observation:{...observation,reference:"ref-b"}}).ok,false)],
 ["wrong merchant rejected",()=>eq(validate({...input,observation:{...observation,businessId:"merchant-b"}}).ok,false)],
 ["currency mismatch rejected",()=>eq(validate({...input,observation:{...observation,currency:"MYR"}}).ok,false)],
 ["amount mismatch rejected",()=>eq(validate({...input,observation:{...observation,amountMinor:1}}).ok,false)],
 ["failed charge rejected",()=>eq(validate({...input,observation:{...observation,status:"failed"}}).ok,false)],
 ["refund rejected for activation",()=>eq(validate({...input,observation:{...observation,refundedMinor:1}}).ok,false)],
 ["unverified coverage rejected",()=>eq(validate({...input,observation:{...observation,periodEvidence:"estimated"}}).ok,false)],
 ["unsigned event rejected",()=>eq(validate({...input,event:{...event,signatureVerifiedAt:0}}).ok,false)],
 ["valid paid record grants membership gate",()=>eq(status(record).verifiedLearningEligibility,true)],
 ["sibling cannot inherit membership",()=>eq(status(record,500,"student-b").verifiedLearningEligibility,false)],
 ["expired record denies membership gate",()=>eq(status(record,1000).membershipStatus,"expired")],
 ["unverified record denies membership gate",()=>eq(status({...record,source:"browser"}).verifiedLearningEligibility,false)],
 ["pending record denies membership gate",()=>eq(status({...record,state:"pending"}).verifiedLearningEligibility,false)],
 ["future coverage denies membership gate",()=>eq(status(record,110).verifiedLearningEligibility,false)],
 ["policy review denies membership gate",()=>eq(status({...record,policyReviewRequired:true}).verifiedLearningEligibility,false)]
 ];
}
for(const [name,run] of membershipCases(validateVerifiedMembershipPayment,readStudentMembershipStatus))test(name,run);
