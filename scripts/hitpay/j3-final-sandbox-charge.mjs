// Explicitly authorized single simulated charge, existing sandbox saved-wallet fixture only.
// A durable, insert-only QA reservation prevents retries across builds; uncertainty is terminal.
// No production, new wallet, new subscription, email, real membership, or secret logging.
import {randomBytes,createHash,timingSafeEqual} from "node:crypto";
import {createWixStore} from "../parent-auth/wix-store.mjs";
const e=process.env,site="09d613aa-3a95-42ff-9ee3-2aa0c706c447",merchant="a34ebd5e-6bd2-4c62-a13d-b19f58f68fd7",origin="https://api.sandbox.hit-pay.com",endpoint="https://designerbestemread.wixstudio.com/my-site-1/_functions/hitpaySandbox";
const historic=["a34f7d35-6173-4f40-b69f-68058a491f96","a34f7d2c-d6cc-4b36-b950-9d00ce853e6a","a34f7d29-752f-4206-a847-6aa67bac69e3","a34f7d23-74f7-4d6b-b79d-6156ada6dea5","a34f7d1e-4b8b-49bb-9c3d-797d481ce4d0"];
const collection="SandboxCheckoutTrials",lockId="j3-rotated-wallet-acceptance-20261126-v1",planId="a34f0707-c529-4c64-9f1f-e969c0d3de16";
const uuid=x=>typeof x==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x);
const emit=(stage,extra={})=>console.log("[J3 final sandbox] "+stage+" "+JSON.stringify(extra));
const required=["payment_request.completed","payment_request.failed","charge.created","charge.updated","charge.failed","recurring_billing.method_attached","recurring_billing.method_detached","recurring_billing.subscription_updated"];
const hash=s=>createHash("sha256").update(s.trim()).digest();
const method=d=>d?.payment_provider?.charge?.method??d?.payment_method??d?.method;
const isTng=d=>method(d)==="touch_n_go";
const exactAmount=d=>Number(d?.amount)===360&&String(d?.currency).toUpperCase()==="MYR";
async function main(){
 if(e.VERCEL_ENV!=="preview"||e.VERCEL_TARGET_ENV==="production"||e.VERCEL_GIT_COMMIT_REF!=="feat/j3-sandbox-payment-20261126"||e.VERCEL_GIT_COMMIT_MESSAGE!=="J3: run one guarded Touch n Go mock charge against verified existing wallet")return;
 if(e.WIX_DEV_SITE_ID!==site||!e.WIX_DEV_DATA_API_KEY?.trim()||e.HITPAY_API_URL!==origin||e.HITPAY_CURRENCY!=="MYR"||e.HITPAY_PLAN_ID!==planId||e.HITPAY_SANDBOX_PAYMENT_METHOD!=="touch_n_go"||!e.HITPAY_API_KEY?.trim()){emit("SCOPE_REFUSED");return}
 const store=createWixStore(e);
 if(await store.get(collection,lockId)){emit("ALREADY_RESERVED_NO_RETRY");return}
 const secret=await fetch("https://www.wixapis.com/_api/cloud-secrets-vault-server/api/v1/secrets/name/HITPAY_SANDBOX_API_KEY",{headers:{Authorization:e.WIX_DEV_DATA_API_KEY,"wix-site-id":site,Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});
 if(!secret.ok){emit("VAULT_REFUSED",{http:secret.status});return}
 const key=(await secret.json()).value;
 if(typeof key!=="string"||!key.trim()||timingSafeEqual(hash(key),hash(e.HITPAY_API_KEY))){emit("ROTATION_UNCONFIRMED");return}
 const headers={"X-BUSINESS-API-KEY":key,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"};
 async function read(p){const r=await fetch(origin+p,{method:"GET",headers,redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error("PROVIDER_GET_FAILED");return r.json()}
 const plan=await read("/v1/subscription-plan/"+planId);
 if(plan.id!==planId||!exactAmount(plan)||plan.cycle!=="monthly"||Number(plan.times_to_be_charged)!==2){emit("PLAN_REFUSED");return}
 const list=await read("/v1/webhook-events");const match=Array.isArray(list)?list.filter(x=>x.url===endpoint):[];
 if(match.length!==1||match[0].business_id!==merchant||!uuid(match[0].id)){emit("WEBHOOK_REFUSED");return}
 const detail=await read("/v1/webhook-events/"+match[0].id);
 if(detail.id!==match[0].id||detail.business_id!==merchant||detail.url!==endpoint||!Array.isArray(detail.event_types)||!required.every(x=>detail.event_types.includes(x))){emit("WEBHOOK_EVENTS_REFUSED");return}
 const charges=await Promise.all(historic.map(id=>read("/v1/charges/"+id)));
 const target=charges[0]?.target_id;
 if(!uuid(target)||!charges.every((d,i)=>d.id===historic[i]&&d.target_id===target&&d.target_type==="business_recurring_plan"&&d.status==="succeeded"&&exactAmount(d)&&Number(d.refunded_amount)===0&&(!d.business_id||d.business_id===merchant))){emit("HISTORIC_BINDING_REFUSED");return}
 const wallet=await read("/v1/recurring-billing/"+target);
 const methods=wallet?.payment_methods;
 const onlyTng=Array.isArray(methods)&&methods.length===1&&methods[0]==="touch_n_go";
 if(wallet.id!==target||wallet.cycle!=="save_card"||wallet.status!=="active"||String(wallet.currency).toUpperCase()!=="MYR"||!onlyTng||![false,0,"0","false"].includes(wallet.send_email)|| (wallet.business_id&&wallet.business_id!==merchant)){emit("WALLET_REFUSED",{idMatch:wallet.id===target,saveCard:wallet.cycle==="save_card",active:wallet.status==="active",currencyMatch:String(wallet.currency).toUpperCase()==="MYR",onlyTng,emailDisabled:[false,0,"0","false"].includes(wallet.send_email)});return}
 emit("WALLET_VERIFIED",{historicalCharges:charges.length,method:"touch_n_go",amount:"360.00",currency:"MYR"});
 const row={planId:"save_card",providerReference:lockId,providerSubscriptionId:target,status:"reserved_mock_charge_no_retry",stateVersion:randomBytes(16).toString("hex"),createdAt:{$date:new Date().toISOString()}};
 if(await store.insert(collection,lockId,row)!==true){emit("RESERVATION_CONFLICT");return}
 const saved=await store.get(collection,lockId);
 if(saved?.stateVersion!==row.stateVersion||saved.providerSubscriptionId!==target||saved.status!==row.status){emit("RESERVATION_UNCONFIRMED");return}
 // Sole provider mutation. Never retry, even after timeout or an uncertain response.
 const post=await fetch(origin+"/v1/charge/recurring-billing/"+target,{method:"POST",headers:{...headers,"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({amount:"360.00",currency:"MYR"}),redirect:"error",cache:"no-store",signal:AbortSignal.timeout(20000)});
 emit("MOCK_CHARGE_HTTP",{status:post.status});
 if(!post.ok)return;
 const receipt=await post.json();
 if(!uuid(receipt.payment_id)||historic.includes(receipt.payment_id)||receipt.recurring_billing_id!==target||!exactAmount(receipt)||receipt.status!=="succeeded"){emit("RECEIPT_UNCONFIRMED_NO_RETRY");return}
 const verified=await read("/v1/charges/"+receipt.payment_id);
 const valid=verified.id===receipt.payment_id&&verified.target_id===target&&verified.target_type==="business_recurring_plan"&&exactAmount(verified)&&verified.status==="succeeded"&&Number(verified.refunded_amount)===0&&(!verified.business_id||verified.business_id===merchant);
 emit("AUTHENTICATED_CHARGE",{verified:valid,methodMatches:isTng(verified),paymentId:receipt.payment_id});
 if(!valid)return;
 const query=await fetch("https://www.wixapis.com/wix-data/v2/items/query",{method:"POST",headers:{Authorization:e.WIX_DEV_DATA_API_KEY,"wix-site-id":site,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({dataCollectionId:"PaymentWebhookEvents",query:{filter:{providerObjectId:receipt.payment_id,environment:"sandbox",eventType:"charge.created"},paging:{limit:20}},consistentRead:true,returnTotalCount:true}),redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});
 if(!query.ok){emit("INBOX_READ_FAILED",{http:query.status});return}
 const data=await query.json(),rows=data.dataItems??[];
 const matched=rows.filter(x=>x.data?.providerObjectId===receipt.payment_id&&x.data.environment==="sandbox"&&x.data.eventType==="charge.created"&&x.data.signatureVerifiedAt&&x.data.processingStatus==="pending");
 emit("GENUINE_INBOX",{matched:matched.length,total:data.pagingMetadata?.total??null,verified:matched.length===1&&data.pagingMetadata?.total===1});
}
try{await main()}catch{emit("UNCONFIRMED_NO_RETRY")}
