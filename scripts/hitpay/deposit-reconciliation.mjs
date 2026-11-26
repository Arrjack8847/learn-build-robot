// Pure validation boundary. No entitlement or membership changes here.
// The caller must persist a verified raw-body event first and fetch the provider
// request via authenticated API. The transaction must dedupe by payment ID.
import {minorUnits} from "./company-config.mjs";
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
export function validateDepositEvidence({config,reservation,event,provider}){
 const fail=error=>({ok:false,error});
 if(config?.environment!=="sandbox"||reservation?.kind!=="deposit"||reservation.environment!=="sandbox"||reservation.status!=="pending"||reservation.currency!==config.currency||reservation.amountMinor!==config.depositMinor||!id(reservation.parentId)||!id(reservation.childId)||!id(reservation.reference)||!id(reservation.providerId))return fail("INVALID_RESERVATION");
 if(event?.environment!=="sandbox"||event.eventType!=="payment_request.completed"||event.providerObjectId!==reservation.providerId||!Number.isSafeInteger(event.signatureVerifiedAt)||event.signatureVerifiedAt<=0||!/^[a-f0-9]{64}$/.test(event.payloadDigest??"")||event.providerEventKey!==event.payloadDigest)return fail("UNVERIFIED_EVENT");
 if(!provider||provider.id!==reservation.providerId||provider.reference_number!==reservation.reference||provider.status!=="completed"||String(provider.currency).toUpperCase()!==reservation.currency)return fail("PAYMENT_MISMATCH");
 try{if(minorUnits(String(provider.amount))!==reservation.amountMinor)return fail("PAYMENT_MISMATCH");}catch{return fail("PAYMENT_MISMATCH");}
 if(!Array.isArray(provider.payments)||provider.payments.length!==1)return fail("REVIEW_REQUIRED");
 const payment=provider.payments[0];
 if(!id(payment?.id)||payment.status!=="succeeded"||String(payment.currency).toUpperCase()!==reservation.currency)return fail("REVIEW_REQUIRED");
 try{if(minorUnits(String(payment.amount))!==reservation.amountMinor)return fail("REVIEW_REQUIRED");}catch{return fail("REVIEW_REQUIRED");}
 if(!/^0(?:\.0{1,2})?$/.test(String(payment.refunded_amount)))return fail("REVIEW_REQUIRED");
 // Independently verify charge/refund state before applying a durable projection.
 return {ok:true,status:"candidate_requires_charge_verification",providerPaymentId:payment.id,parentId:reservation.parentId,childId:reservation.childId,amountMinor:reservation.amountMinor,currency:reservation.currency};
}
