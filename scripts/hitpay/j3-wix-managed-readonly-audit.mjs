// One authorized, preview-only, read-only provider audit using the existing Wix secret vault.
// Never logs secret values, signatures, response bodies, or customer identifiers.
// No fallback to legacy Vercel HITPAY_API_KEY, no provider mutations.
import {createHmac} from "node:crypto";
const e=process.env, tag="[J3 read-only audit]",site="09d613aa-3a95-42ff-9ee3-2aa0c706c447";
const endpoint="https://designerbestemread.wixstudio.com/my-site-1/_functions/hitpaySandbox",origin="https://api.sandbox.hit-pay.com",merchant="a34ebd5e-6bd2-4c62-a13d-b19f58f68fd7",planId="a34f0707-c529-4c64-9f1f-e969c0d3de16";
const required=["payment_request.completed","payment_request.failed","charge.created","charge.updated","charge.failed","recurring_billing.method_attached","recurring_billing.method_detached","recurring_billing.subscription_updated"];
const emit=(stage,result)=>console.log(tag+" "+stage+" "+JSON.stringify(result));
async function main(){
 if(e.VERCEL_ENV!=="preview"||e.VERCEL_TARGET_ENV==="production"||e.VERCEL_GIT_COMMIT_REF!=="feat/j3-sandbox-payment-20261126"||e.VERCEL_GIT_COMMIT_MESSAGE!=="J3: revalidate rotated Wix managed sandbox credentials")return;
 if(e.WIX_DEV_SITE_ID!==site||!e.WIX_DEV_DATA_API_KEY?.trim()||e.HITPAY_API_URL!==origin||e.HITPAY_PLAN_ID!==planId||e.HITPAY_CURRENCY!=="MYR"||e.HITPAY_SANDBOX_PAYMENT_METHOD!=="touch_n_go"){emit("scope",{ok:false});return}
 const getSecret=async name=>{try{const r=await fetch("https://www.wixapis.com/_api/cloud-secrets-vault-server/api/v1/secrets/name/"+name,{method:"GET",headers:{Authorization:e.WIX_DEV_DATA_API_KEY,"wix-site-id":site,Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});emit("vault_"+name,{http:r.status});if(!r.ok)return null;const v=(await r.json()).value;return typeof v==="string"&&v.trim()?v:null;}catch{emit("vault_"+name,{unavailable:true});return null}};
 const key=await getSecret("HITPAY_SANDBOX_API_KEY");
 if(!key)return;
 async function get(path,label){try{const r=await fetch(origin+path,{method:"GET",headers:{"X-BUSINESS-API-KEY":key,Accept:"application/json","X-Requested-With":"XMLHttpRequest"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});emit(label+"_http",{status:r.status});return r.ok?await r.json():null;}catch{emit(label,{unavailable:true});return null}}
 const plan=await get("/v1/subscription-plan/"+planId,"plan");
 emit("plan_match",{ok:plan?.id===planId&&String(plan.currency).toUpperCase()==="MYR"&&Number(plan.amount)===360&&plan.cycle==="monthly",twoCycles:Number(plan?.times_to_be_charged)===2});
 const list=await get("/v1/webhook-events","webhook_list");
 if(Array.isArray(list)){
  const matches=list.filter(x=>x?.url===endpoint);
  emit("webhook_unique",{count:matches.length});
  if(matches.length===1&&matches[0].business_id===merchant&&/^[a-f0-9-]{36}$/i.test(matches[0].id)){
    const detail=await get("/v1/webhook-events/"+encodeURIComponent(matches[0].id),"webhook_detail");
    const valid=detail?.id===matches[0].id&&detail?.business_id===merchant&&detail?.url===endpoint&&Array.isArray(detail.event_types);
    emit("webhook_match",{ok:!!valid&&required.every(x=>detail.event_types.includes(x)),requiredCount:required.length,matchedCount:valid?required.filter(x=>detail.event_types.includes(x)).length:0,extraCount:valid?detail.event_types.filter(x=>!required.includes(x)).length:0});
  }
 }
 const salt=await getSecret("HITPAY_SANDBOX_WEBHOOK_SALT");
 if(salt){
  const raw=JSON.stringify({id:"qa-j3-release-signed-ignored",business_id:merchant});
  const signature=createHmac("sha256",salt).update(raw).digest("hex");
  try{const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json","hitpay-event-object":"qa_synthetic","hitpay-event-type":"ignored","hitpay-signature":signature},body:raw,redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});emit("signed_ignored",{status:r.status,revisionMatch:r.headers.get("x-j3-receiver-revision")==="j3-eight-events-v1",ok:r.status===200});}catch{emit("signed_ignored",{unavailable:true})}
 }
}
try{await main()}catch{emit("audit",{unavailable:true})}
