// Preview-only J1/J2/J3 composition. No legacy credentials, deposit, or membership activation.
import {resolveJ123CheckoutPayer} from "../j2-runtime.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {createAuthorizedCheckout} from "../hitpay/authorized-checkout.mjs";
import {createCompanySandboxTransport} from "../hitpay/company-sandbox-transport.mjs";
import {readCompanyHitPayConfig} from "../hitpay/company-config.mjs";
import {isAllowedSandboxCheckoutUrl} from "../hitpay/checkout-url.mjs";
import {createIntegratedCheckoutStore} from "./checkout-store.mjs";
const BRANCH="integration/j1-j2-j3-20261126",SITE="09d613aa-3a95-42ff-9ee3-2aa0c706c447",ORIGIN="https://api.sandbox.hit-pay.com",PLAN="a34f0707-c529-4c64-9f1f-e969c0d3de16";
export const TERMS="j123-sandbox-membership-v1";
const json=(s,b)=>new Response(JSON.stringify(b),{status:s,headers:{"Content-Type":"application/json","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"}});
const fail=(s,status)=>json(s,{ok:false,status});
export function createIntegratedCheckoutHttp({resolvePayer=resolveJ123CheckoutPayer,storeFactory=createWixStore,requestFn=fetch}={}){
 return async(request,env)=>{
  const origin="https://"+env.VERCEL_URL;
  if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.VERCEL_GIT_COMMIT_REF!==BRANCH||env.WIX_DEV_SITE_ID!==SITE)return fail(404,"PREVIEW_ONLY");
  if(request.method!=="POST")return fail(405,"METHOD_NOT_ALLOWED");
  if(!env.VERCEL_URL||new URL(request.url).origin!==origin||request.headers.get("origin")!==origin||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-j123")!=="1")return fail(403,"INVALID_REQUEST");
  // Provider mutation stays closed until genuine delivery and approved test terms are accepted.
  if(env.J123_CHECKOUT_ENABLED!=="true"||env.J123_GENUINE_WEBHOOK_ACCEPTED!=="true"||env.J123_PAYMENT_TERMS_VERSION!==TERMS)return fail(503,"PAYMENT_TEST_NOT_ENABLED");
  if(!request.headers.get("content-type")?.startsWith("application/json")||!request.body)return fail(400,"INVALID_INPUT");
  try{
   const reader=request.body.getReader();let total=0,raw="";const decoder=new TextDecoder("utf-8",{fatal:true});
   try{for(;;){const part=await reader.read();if(part.done)break;total+=part.value.byteLength;if(total>1024){await reader.cancel();return fail(400,"INVALID_INPUT");}raw+=decoder.decode(part.value,{stream:true});}raw+=decoder.decode();}finally{reader.releaseLock();}
   const input=JSON.parse(raw);
   if(!input||typeof input!=="object"||Array.isArray(input)||Object.keys(input).length!==3||!/^qa-j2-[a-f0-9]{64}$/.test(input.childId??"")||!/^[-a-zA-Z0-9_]{1,128}$/.test(input.requestKey??"")||input.termsVersion!==TERMS)return fail(400,"INVALID_INPUT");
   const payer=await resolvePayer(request,env,input.childId);if(!payer)return fail(401,"NOT_AUTHORIZED");
   // Only Wix vault values are used; never fall back to inherited Vercel values.
   async function secret(name){const r=await requestFn("https://www.wixapis.com/_api/cloud-secrets-vault-server/api/v1/secrets/name/"+name,{headers:{Authorization:env.WIX_DEV_DATA_API_KEY,"wix-site-id":SITE,Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error("VAULT_UNAVAILABLE");const v=(await r.json()).value;if(typeof v!=="string"||!v.trim())throw Error("VAULT_UNAVAILABLE");return v;}
   if(!env.WIX_DEV_DATA_API_KEY?.trim()||env.HITPAY_API_URL!==ORIGIN||env.HITPAY_PLAN_ID!==PLAN||env.HITPAY_CURRENCY!=="MYR"||env.HITPAY_MEMBERSHIP_AMOUNT!=="360.00"||env.HITPAY_SANDBOX_PAYMENT_METHOD!=="touch_n_go")return fail(503,"CONFIGURATION_REQUIRED");
   const providerEnv={...env,HITPAY_API_KEY:await secret("HITPAY_SANDBOX_API_KEY"),HITPAY_SALT:await secret("HITPAY_SANDBOX_WEBHOOK_SALT"),HITPAY_DEPOSIT_AMOUNT:"50.00",J3_SANDBOX_ROTATION_CONFIRMED:"true"};
   const config=readCompanyHitPayConfig(providerEnv),db=storeFactory(env,requestFn);
   const store=createIntegratedCheckoutStore({db,resolvePayer,request,env,childId:input.childId});
   const identity={resolveParent:async()=>{const fresh=await resolvePayer(request,env,input.childId);return fresh?{accountType:"parent",emailVerified:true,parentId:fresh.parentId,email:fresh.email}:null;},hasCurrentConsentAndTerms:async(p,c)=>p===payer.parentId&&c===input.childId&&input.termsVersion===TERMS&&!!await resolvePayer(request,env,c)};
   const transport=createCompanySandboxTransport(providerEnv,{request:requestFn,returnOrigin:origin});
   const checkout=createAuthorizedCheckout({config,identity,store,transport,isAllowedCheckoutUrl:isAllowedSandboxCheckoutUrl});
   const result=await checkout(request,{kind:"membership",childId:input.childId,requestKey:input.requestKey});
   return result.ok?json(200,result):fail(result.error==="NOT_AUTHORIZED"?401:409,result.error);
  }catch{return fail(503,"CHECKOUT_UNAVAILABLE");}
 };
}
export const handleIntegratedCheckout=createIntegratedCheckoutHttp();
