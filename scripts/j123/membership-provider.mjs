// Read-only sandbox provider adapter. No POST/PUT/DELETE to HitPay.
// Exact charge and subscription fields observed in the standalone J3 audit are used.
// Coverage normalization is deliberately a separate release gate: provider period shape is not yet confirmed.
import {J123_SITE,J123_ORIGIN,J123_PLAN,j123InfrastructureStatus} from "./infrastructure.mjs";
import {validProvider} from "./billing-records.mjs";
import {minorUnits} from "../hitpay/company-config.mjs";
import {reconcilePaymentMethod} from "../hitpay/j3-payment-method.mjs";
export const J123_MERCHANT="a34ebd5e-6bd2-4c62-a13d-b19f58f68fd7";
export const membershipProcessingEnabled=env=>{const s=j123InfrastructureStatus(env);return s.authReady&&s.providerConfigured&&s.rotationConfirmed&&s.webhookAccepted&&s.periodAccepted&&s.termsApproved&&env.J123_MEMBERSHIP_RECONCILIATION_ENABLED==="true";};
const currency=v=>typeof v==="string"?v.toUpperCase():null;
const money=v=>{try{return minorUnits(String(v));}catch{return null;}};
const refund=v=>typeof v==="number"&&v===0||typeof v==="string"&&/^0(?:\.0{1,2})?$/.test(v)?0:money(v);
const time=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(v)?Date.parse(v):null;
const dateValid=n=>Number.isSafeInteger(n)&&n>0;
const nonempty=v=>typeof v==="string"&&v.length>0&&v===v.trim();
// Proposed strict adapter contract, NOT a claim about current HitPay response fields.
// Enable only after a genuine authenticated response establishes this exact mapping.
// Missing, malformed, ambiguous or estimated coverage never creates a membership.
export function readConfirmedPeriod(env,charge){
 if(env.J123_PROVIDER_PERIOD_SCHEMA!=="confirmed_charge_billing_period_v1")return null;
 const p=charge?.billing_period;
 if(!p||![1,2].includes(p.cycle_number))return null;
 const periodStartAt=time(p.start_at),periodEndAt=time(p.end_at);
 if(!dateValid(periodStartAt)||!dateValid(periodEndAt)||periodEndAt<=periodStartAt)return null;
 return {periodEvidence:"verified_provider_billing_period",periodStartAt,periodEndAt,cycleNumber:p.cycle_number};
}
export function createMembershipProviderReader(env,{request=fetch,clock=()=>Date.now(),periodReader=readConfirmedPeriod}={}){
 if(!membershipProcessingEnabled(env))throw Error("RECONCILIATION_DISABLED");
 let keyPromise;const charges=new Map(),subscriptions=new Map();
 async function key(){
  if(!keyPromise)keyPromise=(async()=>{
   const r=await request("https://www.wixapis.com/_api/cloud-secrets-vault-server/api/v1/secrets/name/HITPAY_SANDBOX_API_KEY",{method:"GET",headers:{Authorization:env.WIX_DEV_DATA_API_KEY,"wix-site-id":J123_SITE,Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(5000)});
   if(!r.ok)throw Error("VAULT_UNAVAILABLE");
   const value=(await r.json()).value;if(!nonempty(value)||value===env.HITPAY_API_KEY)throw Error("VAULT_UNAVAILABLE");return value;
  })();return keyPromise;
 }
 async function get(map,path,id){
  if(!validProvider(id))throw Error("INVALID_PROVIDER_ID");
  if(!map.has(id))map.set(id,(async()=>{
   const r=await request(J123_ORIGIN+path+encodeURIComponent(id),{method:"GET",headers:{"X-BUSINESS-API-KEY":await key(),Accept:"application/json","X-Requested-With":"XMLHttpRequest"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(5000)});
   if(!r.ok)throw Error("PROVIDER_READ_UNCONFIRMED");const d=await r.json();
   if(!d||d.id!==id||d.business_id!=null&&d.business_id!==J123_MERCHANT)throw Error("PROVIDER_IDENTITY_UNCONFIRMED");
   return d;
  })());return map.get(id);
 }
 const charge=id=>get(charges,"/v1/charges/",id);
 const subscription=id=>get(subscriptions,"/v1/recurring-billing/",id);
 async function verifiedSubscription(binding){
  const s=await subscription(binding.subscriptionId);
  const plans=[s.business_recurring_plans_id,s.plan_id].filter(x=>x!=null);
  if(!plans.length||plans.some(x=>x!==J123_PLAN)||binding.planId!==J123_PLAN||s.reference!==binding.reference||currency(s.currency)!=="MYR"||money(s.amount)!==36000||s.cycle!=="monthly"||![2,"2"].includes(s.times_to_be_charged))throw Error("SUBSCRIPTION_UNCONFIRMED");
  // The sandbox business API key plus the verified inbox's merchant check are the trust boundary.
  // Any explicit merchant mismatch is rejected by get(), never inferred from arbitrary input.
  return s;
 }
 async function resolveEventSubscription(event){
  if(event.eventType==="charge.created"||event.eventType==="charge.updated"){
   const d=await charge(event.providerObjectId);
   if(typeof d.target_type!=="string"||!d.target_type)throw Error("CHARGE_TARGET_UNCONFIRMED");
   // Explicit non-recurring charge: not a J123 membership event.
   if(d.target_type!=="business_recurring_plan")return null;
   if(!validProvider(d.target_id))throw Error("CHARGE_TARGET_UNCONFIRMED");
   return d.target_id;
  }
  if(["recurring_billing.subscription_updated","recurring_billing.method_detached"].includes(event.eventType)){
   if(!validProvider(event.providerObjectId))throw Error("SUBSCRIPTION_UNCONFIRMED");
   return event.providerObjectId;
  }
  return null;
 }
 async function classify(event,reservation){
  const subscriptionId=await resolveEventSubscription(event);
  return !subscriptionId?"ignored":subscriptionId===reservation.providerId?"matched":"foreign";
 }
 async function reconcileVerifiedEvent(binding){
  const d=await charge(binding.chargeId),s=await verifiedSubscription(binding);
  if(d.target_type!=="business_recurring_plan"||d.target_id!==binding.subscriptionId||d.status!=="succeeded"||currency(d.currency)!=="MYR"||money(d.amount)!==36000||refund(d.refunded_amount)!==0||!reconcilePaymentMethod(d).verified)return null;
  // Explicit adverse status must not grant new coverage.
  if(["cancelled","canceled","paused","inactive"].includes(s.status))return null;
  const paidAt=time(d.closed_at),period=periodReader(env,d,s);
  if(!dateValid(paidAt)||paidAt>clock()||!period)return null;
  return {environment:"sandbox",businessId:J123_MERCHANT,eventKey:binding.eventKey,paymentId:d.id,subscriptionId:s.id,reference:s.reference,planId:J123_PLAN,status:"succeeded",refundedMinor:0,currency:"MYR",amountMinor:36000,paymentMethod:"touch_n_go",paidAt,...period};
 }
 async function reconcileAdverseEvent(binding){
  const s=await verifiedSubscription(binding),base={environment:"sandbox",businessId:J123_MERCHANT,eventKey:binding.eventKey,subscriptionId:s.id,reference:s.reference,planId:J123_PLAN,observedAt:clock()};
  if(binding.eventType==="charge.updated"){
   const d=await charge(binding.objectId);
   if(d.target_type!=="business_recurring_plan"||d.target_id!==s.id||currency(d.currency)!=="MYR"||money(d.amount)!==36000)return null;
   return {...base,paymentId:d.id,currency:"MYR",amountMinor:36000,refundedMinor:refund(d.refunded_amount)};
  }
  if(binding.objectId!==s.id)return null;
  if(binding.eventType==="recurring_billing.subscription_updated")return {...base,subscriptionStatus:s.status==="canceled"?"cancelled":s.status};
  if(binding.eventType==="recurring_billing.method_detached"&&typeof s.payment_method_attached==="boolean")return {...base,methodAttached:s.payment_method_attached};
  return null;
 }
 return {classify,resolveEventSubscription,reconcileVerifiedEvent,reconcileAdverseEvent};
}
