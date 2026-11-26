// Internal pure boundary. A candidate is not a committed membership. Never mount this as a browser API.
export function validateVerifiedMembershipPayment({config,merchantId,event,reservation,observation}) {
  const fail=error=>({ok:false,error});
  const id=x=>typeof x==="string"&&/^[A-Za-z0-9_-]{1,128}$/.test(x);
  const stamp=x=>Number.isSafeInteger(x)&&x>0;
  if(config?.environment!=="sandbox"||config.currency!=="SGD"||!Number.isSafeInteger(config.membershipMinor)||config.membershipMinor<=0||!id(config.planId)||!id(merchantId))return fail("INVALID_CONFIG");
  const r=reservation;
  if(!r||r.environment!=="sandbox"||r.kind!=="membership"||r.status!=="bound"||r.currency!==config.currency||r.amountMinor!==config.membershipMinor||r.planId!==config.planId||![r.attemptId,r.reference,r.parentId,r.childId,r.providerId].every(id))return fail("INVALID_MEMBERSHIP_BINDING");
  const e=event;
  if(!e||e.environment!=="sandbox"||e.eventType!=="charge.created"||!id(e.providerObjectId)||!stamp(e.signatureVerifiedAt)||! /^[a-f0-9]{64}$/.test(e.payloadDigest??"")||e.providerEventKey!==e.payloadDigest)return fail("UNVERIFIED_EVENT");
  // Observation is produced only by a server-side authenticated provider reconciler.
  // A signed event or scheduled subscription alone is not a proof of settled coverage.
  const o=observation;
  if(!o||o.environment!=="sandbox"||o.businessId!==merchantId||o.eventKey!==e.providerEventKey||o.paymentId!==e.providerObjectId||o.subscriptionId!==r.providerId||o.reference!==r.reference||o.planId!==r.planId||o.status!=="succeeded"||o.refundedMinor!==0||o.currency!==r.currency||o.amountMinor!==r.amountMinor)return fail("PAYMENT_MISMATCH");
  // Coverage must be backed by independently verified provider billing evidence.
  // Never calculate from a browser timestamp or from the number of wallet charges.
  if(o.periodEvidence!=="verified_provider_billing_period"||!stamp(o.periodStartAt)||!stamp(o.periodEndAt)||o.periodEndAt<=o.periodStartAt||!stamp(o.paidAt)||o.periodEndAt<=o.paidAt||!Number.isSafeInteger(o.cycleNumber)||o.cycleNumber<1)return fail("BILLING_PERIOD_UNVERIFIED");
  return {ok:true,status:"verified_candidate",payment:{environment:"sandbox",purpose:"membership",attemptId:r.attemptId,parentId:r.parentId,studentId:r.childId,reference:r.reference,providerPaymentId:o.paymentId,providerSubscriptionId:o.subscriptionId,amountMinor:o.amountMinor,currency:o.currency,paidAt:o.paidAt,periodStartAt:o.periodStartAt,periodEndAt:o.periodEndAt,cycleNumber:o.cycleNumber,eventKey:e.providerEventKey}};
}
export function readStudentMembershipStatus({studentId,record,now}) {
  // Only call after independently authorizing the individual student session.
  if(typeof studentId!=="string"||!studentId||!Number.isSafeInteger(now)||now<=0)throw Error("INVALID_STATUS_REQUEST");
  const base={studentId,membershipStatus:"inactive",activatedAt:null,validUntil:null,renewalEligibility:"unverified",verifiedLearningEligibility:false};
  if(!record)return base;
  if(record.studentId!==studentId||record.environment!=="sandbox"||record.source!=="verified_membership_ledger")return {...base,membershipStatus:"verification_required"};
  if(record.state==="pending")return {...base,membershipStatus:"payment_pending"};
  if(record.state==="failed")return {...base,membershipStatus:"inactive"};
  // No cancellation, refund or grace-period policy is inferred by this reader.
  if(record.state!=="paid"||record.policyReviewRequired===true)return {...base,membershipStatus:"verification_required"};
  if(typeof record.providerPaymentId!=="string"||!record.providerPaymentId||!Number.isSafeInteger(record.activatedAt)||record.activatedAt<=0||!Number.isSafeInteger(record.validUntil)||record.validUntil<=record.activatedAt||!Number.isSafeInteger(record.validFrom)||record.validFrom>=record.validUntil)return {...base,membershipStatus:"verification_required"};
  const result={...base,activatedAt:record.activatedAt,validUntil:record.validUntil};
  if(now>=record.validUntil)return {...result,membershipStatus:"expired"};
  if(now<record.validFrom||now<record.activatedAt)return {...result,membershipStatus:"payment_pending"};
  // This is the membership gate only. J5 still enforces check-in and other access conditions.
  return {...result,membershipStatus:"active",verifiedLearningEligibility:true};
}
