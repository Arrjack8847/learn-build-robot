// Trusted private worker: exact bearer key; no browser-supplied payment or attendance evidence.
import {createCombinedRuntime} from "./scheduling-runtime.mjs";
import {createCombinedPaymentBridge} from "./payment-bridge.mjs";
import {createRenewalProcessor} from "./renewal-bridge.mjs";
import {flushCombinedNotices} from "./notice-delivery.mjs";
import {runtimeEnabled,secret,matches,mixed,fail,json,exact,readBody} from "./http-utils.mjs";
export function createCombinedWorkerHttp({runtimeFactory=createCombinedRuntime,flush=flushCombinedNotices}={}){
 return async(request,env)=>{
  const u=new URL(request.url),origin="https://"+env.VERCEL_URL;
  if(!runtimeEnabled(env)||env.COMBINED_AUTOMATION_ENABLED!=="1"||u.pathname!=="/api/dev/combined/worker"||u.search||!env.VERCEL_URL||u.origin!==origin)return fail(404,"NOT_AVAILABLE");
  if(request.method!=="POST"||mixed(request))return fail(403,"INVALID_REQUEST");
  const key=secret(env,"COMBINED_WORKER_KEY"),auth=request.headers.get("authorization")??"";
  if(!auth.startsWith("Bearer ")||!matches(auth.slice(7),key))return fail(403,"NOT_AUTHORIZED");
  try{
   const r=runtimeFactory(env),renewal=await createRenewalProcessor({env,runtime:r});
   if(request.body!==null){
    if(env.COMBINED_PAYMENT_BRIDGE_ENABLED!=="1"||request.headers.get("content-type")?.split(";")[0]!=="application/json")return fail(403,"INVALID_REQUEST");
    let input;try{input=await readBody(request,256);}catch{return fail(400,"INVALID_INPUT");}
    if(!exact(input,["eventKey"])||typeof input.eventKey!=="string"||! /^[a-f0-9]{64}$/.test(input.eventKey))return fail(400,"INVALID_INPUT");
    const e=await r.store.get("PaymentWebhookEvents",input.eventKey);let result;
    if(e?.eventType==="payment_request.completed"){
     if(!r.depositProvider)return fail(503,"DEPOSIT_DISABLED");
     const bridge=createCombinedPaymentBridge({env,runtime:r,readVerifiedEvidence:k=>r.depositProvider.evidence({runtime:r,eventKey:k})});result=await bridge(input.eventKey);
    }else result=await renewal.process(input.eventKey);
    return json(result.ok?200:503,result);
   }
   const recovery=await renewal.recoverHolds(),tick=await r.automation.tick();if(!tick.ok)return fail(503,tick.status);
   const notices=await flush({env,runtime:r});
   const attention=["pending","review"].includes(notices.status);
   return json(attention?503:200,{ok:!attention,automation:tick.status,renewalPending:recovery.pending??0,notices:notices.status,noticeReview: notices.review??0,accepted:notices.sent});
  }catch{return fail(503,"WORKER_UNAVAILABLE");}
 };
}
export const handleCombinedWorker=createCombinedWorkerHttp();
