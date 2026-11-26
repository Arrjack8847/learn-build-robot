// New contract adapter, NOT mounted. Old MYR fixture transport remains isolated.
import {readCompanyHitPayConfig,decimal,minorUnits} from "./company-config.mjs";
import {isAllowedSandboxCheckoutUrl} from "./checkout-url.mjs";
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
const fixtureEmail=x=>typeof x==="string"&&/^[a-z0-9._+-]+@example\.invalid$/i.test(x);
export function createCompanySandboxTransport(env,{request=fetch,returnOrigin}={}){
 const cfg=readCompanyHitPayConfig(env);
 if(cfg.environment!=="sandbox"||env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production")throw Error("PREVIEW_ONLY");
 if(env.J3_SANDBOX_ROTATION_CONFIRMED!=="true")throw Error("ROTATION_CONFIRMATION_REQUIRED");
 if(env.HITPAY_SANDBOX_PAYMENT_METHOD!=="touch_n_go"||cfg.currency!=="MYR")throw Error("TOUCH_N_GO_MY_R_REQUIRED");
 if(!env.VERCEL_URL||returnOrigin!=="https://"+env.VERCEL_URL)throw Error("INVALID_RETURN_ORIGIN");
 const origin=new URL(returnOrigin);
 if(origin.protocol!=="https:"||!origin.hostname.endsWith(".vercel.app")||origin.origin!==returnOrigin||origin.username||origin.password||origin.port)throw Error("INVALID_RETURN_ORIGIN");
 const redirect=returnOrigin+"/parent/payment-return";
 async function call(path,{method="GET",body,form=false}={}){
  const headers={"X-BUSINESS-API-KEY":cfg.apiKey,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"};
  if(body!==undefined)headers["Content-Type"]=form?"application/x-www-form-urlencoded":"application/json";
  const r=await request(cfg.apiUrl+path,{method,headers,...(body===undefined?{}:{body:form?new URLSearchParams(body):JSON.stringify(body)}),redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
  if(!r.ok)throw Error("PROVIDER_UNCONFIRMED");
  return r.json();
 }
 async function verifyPlan(){
  const p=await call("/v1/subscription-plan/"+encodeURIComponent(cfg.planId));
  if(p?.id!==cfg.planId||String(p.currency).toUpperCase()!==cfg.currency||minorUnits(String(p.amount))!==cfg.membershipMinor||p.cycle!=="monthly")throw Error("PLAN_MISMATCH");
  return true;
 }
 function verifyReservation(r,kind){
  if(!r||r.kind!==kind||r.environment!=="sandbox"||r.status!=="reserved"||!id(r.parentId)||!id(r.childId)||!id(r.reference)||!fixtureEmail(r.email)||r.currency!==cfg.currency||r.amountMinor!==(kind==="membership"?cfg.membershipMinor:cfg.depositMinor))throw Error("INVALID_RESERVATION");
 }
 function hosted(p){if(!id(p?.id)||!isAllowedSandboxCheckoutUrl(p.url))throw Error("CHECKOUT_UNCONFIRMED");return {providerId:p.id,url:p.url};}
 // Caller must atomically reserve a unique reference and reconcile ambiguous calls.
 // No automatic POST retry. Never accept these fields directly from a browser.
 async function createMembership(r){
  verifyReservation(r,"membership");await verifyPlan();
  if(typeof r.startDate!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(r.startDate)||!Number.isFinite(Date.parse(r.startDate))||new Date(r.startDate).toISOString().slice(0,10)!==r.startDate)throw Error("INVALID_START_DATE");
  // Current provider API documents JSON for recurring billing, with array methods.
  // Touch n Go only. Hosted monthly flow is distinct from the save_card mock flow; genuine renewal is unverified.
  return hosted(await call("/v1/recurring-billing",{method:"POST",body:{plan_id:cfg.planId,customer_email:r.email,customer_name:"STEM Lab QA Parent",start_date:r.startDate,redirect_url:redirect,reference:r.reference,payment_methods:["touch_n_go"],save_payment_method:"false",send_email:"false",times_to_be_charged:2}}));
 }
 async function createDeposit(r){
  verifyReservation(r,"deposit");
  return hosted(await call("/v1/payment-requests",{method:"POST",form:true,body:{amount:decimal(cfg.depositMinor),currency:cfg.currency,email:r.email,purpose:"STEM Makers Lab sandbox no-show deposit",redirect_url:redirect,reference_number:r.reference,allow_repeated_payments:"false","payment_methods[]":"touch_n_go"}}));
 }
 async function lookupDeposit(providerId){if(!id(providerId))throw Error("INVALID_PROVIDER_ID");return call("/v1/payment-requests/"+encodeURIComponent(providerId));}
 return {verifyPlan,createMembership,createDeposit,lookupDeposit};
}
