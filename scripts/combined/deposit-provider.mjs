// Exact accepted sandbox scope only; independently read payment request AND charge.
import {J123_SITE,J123_ORIGIN,j123InfrastructureStatus} from "../j123/infrastructure.mjs";
import {J123_MERCHANT} from "../j123/membership-provider.mjs";
import {runtimeEnabled} from "./http-utils.mjs";
import {minorUnits} from "../hitpay/company-config.mjs";
import {isAllowedSandboxCheckoutUrl} from "../hitpay/checkout-url.mjs";
import {validateDepositEvidence} from "../hitpay/deposit-reconciliation.mjs";
import {reconcilePaymentMethod} from "../hitpay/j3-payment-method.mjs";
import {checkProviderBinding} from "../j123/billing-records.mjs";
import {deposits} from "./deposit-state.mjs";
import {digest} from "../nizar/automation-state.mjs";
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
const stamp=x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(x)?Date.parse(x):NaN;
const epoch=x=>Number.isSafeInteger(x)?x:Date.parse(typeof x==="string"?x:x?.$date);
export const depositEnabled=e=>runtimeEnabled(e)&&e.COMBINED_DEPOSIT_ENABLED==="1"&&e.COMBINED_DEPOSIT_PROVIDER_ACCEPTED==="1"&&e.COMBINED_PAYMENT_BRIDGE_ENABLED==="1"&&e.COMBINED_DEPOSIT_CHARGE_SCHEMA==="verified_payment_request_charge_v1"&&(()=>{const s=j123InfrastructureStatus(e);return s.authReady&&s.providerConfigured&&s.rotationConfirmed&&s.webhookAccepted&&s.periodAccepted&&s.termsApproved&&s.ledgerReadReady;})();
export function createDepositProvider(env,{request=fetch,clock=Date.now}={}){
 if(!depositEnabled(env))throw Error("DEPOSIT_DISABLED");
 let key;
 async function call(path,body){
  if(!key){const r=await request("https://www.wixapis.com/_api/cloud-secrets-vault-server/api/v1/secrets/name/HITPAY_SANDBOX_API_KEY",{headers:{Authorization:env.WIX_DEV_DATA_API_KEY,"wix-site-id":J123_SITE},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error("VAULT_UNAVAILABLE");key=(await r.json()).value;if(typeof key!=="string"||!key.trim()||key===env.HITPAY_API_KEY)throw Error("VAULT_UNAVAILABLE");}
  const r=await request(J123_ORIGIN+path,{method:body?"POST":"GET",headers:{"X-BUSINESS-API-KEY":key,"X-Requested-With":"XMLHttpRequest",Accept:"application/json",...(body?{"Content-Type":"application/x-www-form-urlencoded"}:{})},...(body?{body:new URLSearchParams(body)}:{}),redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});
  if(!r.ok)throw Error("PROVIDER_UNCONFIRMED");const p=await r.json();if(!p||p.business_id!=null&&p.business_id!==J123_MERCHANT)throw Error("MERCHANT_MISMATCH");return p;
 }
 async function create(r){
  if(!j123InfrastructureStatus(env).checkoutReady||r.status!=="dispatching"||r.amountMinor!==5000||r.currency!=="MYR"||!id(r.id)||!env.VERCEL_URL?.endsWith(".vercel.app"))throw Error("INVALID_RESERVATION");
  const p=await call("/v1/payment-requests",{amount:"50.00",currency:"MYR",purpose:"STEM Makers Lab sandbox refundable deposit",reference_number:r.id,redirect_url:"https://"+env.VERCEL_URL+"/parent/payment-return",allow_repeated_payments:"false","payment_methods[]":"touch_n_go"});
  if(!id(p.id)||p.reference_number!==r.id||p.status!=="pending"||String(p.currency).toUpperCase()!=="MYR"||minorUnits(String(p.amount))!==5000||!isAllowedSandboxCheckoutUrl(p.url))throw Error("PROVIDER_UNCONFIRMED");
  return {providerId:p.id,url:p.url};
 }
 async function evidence({runtime,eventKey}){
  const e=await runtime.store.get("PaymentWebhookEvents",eventKey),at=epoch(e?.signatureVerifiedAt);
  if(e?.providerEventKey!==eventKey||e.payloadDigest!==eventKey||e.environment!=="sandbox"||e.eventType!=="payment_request.completed"||!["pending","processed","duplicate"].includes(e.processingStatus)||!Number.isSafeInteger(at)||at>clock()||!id(e.providerObjectId))return null;
  const snap=await runtime.repository.read(),r=deposits(snap.state).find(x=>x.providerId===e.providerObjectId);
  if(!r||at<r.createdAt||r.status==="dispatching")return null;
  if(r.status==="settled")return r.eventKey===eventKey?{kind:"deposit-paid",eventId:eventKey,childId:r.childId,parentId:r.parentId,at:r.paidAt,currency:"MYR",amount:5000,paymentId:digest(["deposit-charge",r.paymentId]),depositId:r.id,providerPaymentId:r.paymentId}:null;
  const p=await call("/v1/payment-requests/"+encodeURIComponent(r.providerId));
  const candidate=validateDepositEvidence({config:{environment:"sandbox",currency:"MYR",depositMinor:5000},reservation:{...r,kind:"deposit",environment:"sandbox",reference:r.id},event:{...e,signatureVerifiedAt:at},provider:p});
  if(!candidate.ok)return null;
  const charge=await call("/v1/charges/"+encodeURIComponent(candidate.providerPaymentId)),paidAt=stamp(charge.closed_at);
  // Proposed strict mapping; no acceptance flag until genuine provider evidence establishes it.
  if(charge.id!==candidate.providerPaymentId||charge.target_type!=="payment_request"||charge.target_id!==r.providerId||charge.status!=="succeeded"||String(charge.currency).toUpperCase()!=="MYR"||minorUnits(String(charge.amount))!==5000||!/^0(?:\.0{1,2})?$/.test(String(charge.refunded_amount))||!reconcilePaymentMethod(charge).verified||!Number.isSafeInteger(paidAt)||paidAt<r.createdAt||paidAt>clock())return null;
  if(!await checkProviderBinding(runtime.store,"charge",charge.id,{...r,attemptId:r.id,reference:r.id},{reserve:true}))return null;
  return {kind:"deposit-paid",eventId:eventKey,childId:r.childId,parentId:r.parentId,at:paidAt,currency:"MYR",amount:5000,paymentId:digest(["deposit-charge",charge.id]),depositId:r.id,providerPaymentId:charge.id};
 }
 return {create,evidence};
}
