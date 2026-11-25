// Read-only, once per authorized preview commit. No webhook registration,
// payment creation, secret disclosure, membership changes, or email delivery.
import {createWixStore} from "../parent-auth/wix-store.mjs";
const e=process.env,tag="[J3 sandbox audit]";
const expectedUrl="https://designerbestemread.wixstudio.com/my-site-1/_functions/hitpaySandbox";
const oldUrl="https://learn-build-robot-56gua6wcj-soe-min-khants-projects.vercel.app/api/dev/hitpay/webhook";
const merchant="a34ebd5e-6bd2-4c62-a13d-b19f58f68fd7";
const uuid=s=>typeof s==="string"&&/^[a-f0-9-]{36}$/i.test(s);
const fixedEvents=["charge.created","charge.updated","charge.failed","recurring_billing.method_attached","recurring_billing.method_detached","recurring_billing.subscription_updated"];
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J3: read-only audit of sandbox webhook configuration and provider charges"&&e.HITPAY_API_BASE_URL==="https://api.sandbox.hit-pay.com"&&e.HITPAY_API_KEY?.trim()){
 async function get(path){
  const res=await fetch("https://api.sandbox.hit-pay.com"+path,{method:"GET",headers:{"X-BUSINESS-API-KEY":e.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
  if(!res.ok)return {http:res.status};
  return {http:res.status,data:await res.json()};
 }
 try{
  const result=await get("/v1/webhook-events");
  const rows=Array.isArray(result.data)?result.data:null;
  const ours=rows?.filter(x=>x?.business_id===merchant&&[expectedUrl,oldUrl].includes(x.url)&&uuid(x.id))??[];
  console.log(tag+" WEBHOOK_LIST "+JSON.stringify({http:result.http,listShape:!!rows,total:rows?.length??null,matching:ours.length,wix:ours.filter(x=>x.url===expectedUrl).length,old:ours.filter(x=>x.url===oldUrl).length}));
  for(const r of ours.slice(0,2)){
   const detail=await get("/v1/webhook-events/"+encodeURIComponent(r.id));
   const d=detail.data;
   console.log(tag+" WEBHOOK_DETAIL "+JSON.stringify({http:detail.http,matched:d?.id===r.id&&d?.business_id===merchant&&d?.url===r.url,destination:r.url===expectedUrl?"wix":"old-preview",events:fixedEvents.filter(x=>Array.isArray(d?.event_types)&&d.event_types.includes(x)),hasSaltField:typeof d?.salt==="string"&&!!d.salt,hasWebhookSaltField:typeof d?.webhook_salt==="string"&&!!d.webhook_salt}));
  }
 }catch{console.log(tag+" WEBHOOK_LOOKUP_UNAVAILABLE")}
 try{
  const trial=await createWixStore(e).get("SandboxCheckoutTrials","stem-lab-checkout-v1");
  if(trial?.status!=="hosted"||trial.planId!==e.HITPAY_SANDBOX_PLAN_ID||trial.providerReference!=="stem-lab-checkout-v1"||!uuid(trial.providerSubscriptionId)){console.log(tag+" TRIAL_NOT_VERIFIED");throw Error("STOP")}
  let results=[];
  for(const status of ["scheduled","active","retrying","inactive","canceled"]){
   const q=new URLSearchParams({reference:"stem-lab-checkout-v1",status});
   const r=await get("/v1/recurring-billing?"+q);
   const rows=Array.isArray(r.data?.data)?r.data.data:[];
   results.push({status,http:r.http,matching:rows.filter(x=>x.id===trial.providerSubscriptionId&&x.reference===trial.providerReference&&x.business_recurring_plans_id===trial.planId&&Number(x.amount)===360&&String(x.currency).toUpperCase()==="MYR").length});
  }
  console.log(tag+" SUBSCRIPTION "+JSON.stringify(results));
  // Only inspect recent exact-amount candidates, never log customer details or raw payloads.
  const q=new URLSearchParams({date_from:"2026-11-25",amount_from:"360",amount_to:"360",per_page:"25"});
  const charges=await get("/v1/charges?"+q);
  const candidates=Array.isArray(charges.data?.data)?charges.data.data.filter(x=>uuid(x.id)&&Number(x.amount)===360&&String(x.currency).toUpperCase()==="MYR"):[];
  let exact=0,success=0;
  for(const row of candidates.slice(0,25)){
   const d=(await get("/v1/charges/"+encodeURIComponent(row.id))).data;
   if(d?.id===row.id&&d.target_id===trial.providerSubscriptionId&&d.target_type==="business_recurring_plan"){exact++;if(d.status==="succeeded"&&Number(d.refunded_amount)===0)success++}
  }
  console.log(tag+" CHARGE_EVIDENCE "+JSON.stringify({http:charges.http,candidates:candidates.length,hasMore:!!charges.data?.meta?.next_cursor,exactTarget:exact,successfulUnrefunded:success,eligibilityChanged:false}));
 }catch{console.log(tag+" CHARGE_LOOKUP_UNAVAILABLE")}
 try{
  const res=await fetch("https://www.wixapis.com/_api/cloud-secrets-vault-server/api/v1/secrets",{method:"GET",headers:{Authorization:e.WIX_DEV_DATA_API_KEY,"wix-site-id":"09d613aa-3a95-42ff-9ee3-2aa0c706c447",Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});
  let present=null;if(res.ok){const d=await res.json();present=Array.isArray(d.secrets)&&d.secrets.some(x=>x.name==="HITPAY_SANDBOX_WEBHOOK_SALT")}
  console.log(tag+" WIX_SECRET_METADATA "+JSON.stringify({http:res.status,configured:present}));
 }catch{console.log(tag+" SECRET_METADATA_UNAVAILABLE")}
}
