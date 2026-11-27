// Trusted private worker: exact bearer key; no browser-supplied payment or attendance evidence.
import {createCombinedRuntime} from "./scheduling-runtime.mjs";
import {flushCombinedNotices} from "./notice-delivery.mjs";
import {runtimeEnabled,secret,matches,mixed,fail,json} from "./http-utils.mjs";
export function createCombinedWorkerHttp({runtimeFactory=createCombinedRuntime,flush=flushCombinedNotices}={}){
 return async(request,env)=>{
  const u=new URL(request.url),origin="https://"+env.VERCEL_URL;
  if(!runtimeEnabled(env)||env.COMBINED_AUTOMATION_ENABLED!=="1"||u.pathname!=="/api/dev/combined/worker"||u.search||!env.VERCEL_URL||u.origin!==origin)return fail(404,"NOT_AVAILABLE");
  if(request.method!=="POST"||request.body!==null||mixed(request))return fail(403,"INVALID_REQUEST");
  const key=secret(env,"COMBINED_WORKER_KEY"),auth=request.headers.get("authorization")??"";
  if(!auth.startsWith("Bearer ")||!matches(auth.slice(7),key))return fail(403,"NOT_AUTHORIZED");
  try{const r=runtimeFactory(env),tick=await r.automation.tick();if(!tick.ok)return fail(503,tick.status);const notices=await flush({env,runtime:r});return json(notices.status==="pending"?503:200,{ok:notices.status!=="pending",automation:tick.status,notices: notices.status,accepted:notices.sent});}catch{return fail(503,"WORKER_UNAVAILABLE");}
 };
}
export const handleCombinedWorker=createCombinedWorkerHttp();
