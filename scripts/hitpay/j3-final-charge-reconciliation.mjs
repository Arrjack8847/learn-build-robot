// Read-only reconciliation of the exact successful sandbox charge. No provider mutations.
import {createHash,timingSafeEqual} from "node:crypto";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {legacyIsolated,reconcilePaymentMethod} from "./j3-payment-method.mjs";
const e=process.env,site="09d613aa-3a95-42ff-9ee3-2aa0c706c447",merchant="a34ebd5e-6bd2-4c62-a13d-b19f58f68fd7",origin="https://api.sandbox.hit-pay.com",id="a350e0e3-1b26-4ad0-b964-0fe3f277f1f4",endpoint="https://designerbestemread.wixstudio.com/my-site-1/_functions/hitpaySandbox";
const emit=(stage,d)=>console.log("[J3 final reconciliation] "+stage+" "+JSON.stringify(d));
const h=s=>createHash("sha256").update(s).digest();
const eq=(a,b)=>typeof a==="string"&&a.length>0&&typeof b==="string"&&b.length>0&&timingSafeEqual(h(a),h(b));
async function main(){
 if(e.VERCEL_ENV!=="preview"||e.VERCEL_TARGET_ENV==="production"||e.VERCEL_GIT_COMMIT_REF!=="feat/j3-sandbox-payment-20261126"||e.VERCEL_GIT_COMMIT_MESSAGE!=="J3: verify isolated Wix credentials and exact Touch n Go charge"||e.WIX_DEV_SITE_ID!==site||!e.WIX_DEV_DATA_API_KEY||e.HITPAY_API_URL!==origin)return;
 const wixHeaders={Authorization:e.WIX_DEV_DATA_API_KEY,"wix-site-id":site,Accept:"application/json"};
 async function secret(name){const r=await fetch("https://www.wixapis.com/_api/cloud-secrets-vault-server/api/v1/secrets/name/"+name,{headers:wixHeaders,redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error("VAULT_UNAVAILABLE");return (await r.json()).value}
 const key=await secret("HITPAY_SANDBOX_API_KEY"),salt=await secret("HITPAY_SANDBOX_WEBHOOK_SALT");
 const isolated=legacyIsolated(e);emit("legacy_isolation",{ok:isolated});if(!isolated||typeof key!=="string"||!key.trim()||eq(key,e.HITPAY_API_KEY))throw Error("CREDENTIAL_REFUSED");
 async function read(p){const r=await fetch(origin+p,{method:"GET",headers:{"X-BUSINESS-API-KEY":key,Accept:"application/json","X-Requested-With":"XMLHttpRequest"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error("PROVIDER_GET_FAILED");return r.json()}
 const lock=await createWixStore(e).get("SandboxCheckoutTrials","j3-rotated-wallet-acceptance-20261126-v1");
 if(lock?.status!=="reserved_mock_charge_no_retry"||!lock.providerSubscriptionId)throw Error("RESERVATION_REFUSED");
 const d=await read("/v1/charges/"+id),old=await read("/v1/charges/a34f7d35-6173-4f40-b69f-68058a491f96");
 const method=reconcilePaymentMethod(d),prior=reconcilePaymentMethod(old);
 const verified=d.id===id&&d.target_id===lock.providerSubscriptionId&&d.target_type==="business_recurring_plan"&&d.status==="succeeded"&&Number(d.amount)===360&&String(d.currency).toUpperCase()==="MYR"&&Number(d.refunded_amount)===0&&(!d.business_id||d.business_id===merchant);
 emit("charge",{verified,method,historicalMethod:prior,exactMethodVerified:verified&&method.verified,merchantMatch:!d.business_id||d.business_id===merchant});
 // Fixed allowlisted diagnostics, never emit arbitrary provider or customer values.
 emit("method_shape",{object:typeof d.payment_method==="object"&&d.payment_method!==null,fields:["name","code","method","type","method_logo","display_logo"].filter(k=>Object.hasOwn(d.payment_method??{},k)),topLevelMethod:typeof d.method==="string"});
 const list=await read("/v1/webhook-events");
 const match=Array.isArray(list)?list.filter(x=>x.url===endpoint&&x.business_id===merchant):[];
 if(match.length===1&&/^[a-f0-9-]{36}$/i.test(match[0].id)){const w=await read("/v1/webhook-events/"+match[0].id);const salts=[w.salt,w.webhook_salt].filter(x=>typeof x==="string"&&x.length);emit("webhook",{unique:true,chargeCreated:Array.isArray(w.event_types)&&w.event_types.includes("charge.created"),providerSaltAvailable:salts.length>0,providerSaltMatches:salts.length?salts.every(x=>eq(x,salt)):null});}
 const q=await fetch("https://www.wixapis.com/wix-data/v2/items/query",{method:"POST",headers:{...wixHeaders,"Content-Type":"application/json"},body:JSON.stringify({dataCollectionId:"PaymentWebhookEvents",query:{filter:{providerObjectId:id,environment:"sandbox"},paging:{limit:20}},consistentRead:true,returnTotalCount:true}),redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});
 if(q.ok){const data=await q.json(),rows=data.dataItems??[];emit("inbox",{total:data.pagingMetadata?.total,verifiedCreated:rows.filter(x=>x.data?.providerObjectId===id&&x.data?.eventType==="charge.created"&&x.data?.signatureVerifiedAt).length});}
}
try{await main()}catch{emit("unconfirmed",{})}
