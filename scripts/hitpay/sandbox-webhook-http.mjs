// Raw-body, server-only HitPay event receiver. Inbox only; no membership changes.
import {createBillingCore} from "./j3-core.mjs";
import {signatures} from "./j3-node-transport.mjs";
const LIMIT=262144;
const branch="feat/wix-lms-integration-20261125";
export function createSandboxWebhook({resolveInbox,clock={now:()=>Date.now()}}){
  return async function handle(request,env){
    const reply=(status,value)=>new Response(JSON.stringify(value),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
    const url=new URL(request.url);
    if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.VERCEL_GIT_COMMIT_REF!==branch||env.HITPAY_API_BASE_URL!=="https://api.sandbox.hit-pay.com")return reply(404,{ok:false});
    if(url.pathname!=="/api/dev/hitpay/webhook"||url.search)return reply(404,{ok:false});
    if(request.method!=="POST")return reply(405,{ok:false});
    if(!env.HITPAY_WEBHOOK_SALT?.trim()||!env.HITPAY_BUSINESS_ID?.trim())return reply(503,{ok:false});
    const sig=request.headers.get("hitpay-signature")??"";
    if(!/^[a-f0-9]{64}$/i.test(sig))return reply(401,{ok:false});
    if(!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")||!request.body)return reply(400,{ok:false});
    const size=request.headers.get("content-length");
    if(size!==null&&(!/^\d+$/.test(size)||Number(size)>LIMIT))return reply(413,{ok:false});
    try{
      const chunks=[];let n=0;
      const reader=request.body.getReader();
      try{
        for(;;){const {done,value}=await reader.read();if(done)break;n+=value.byteLength;if(n>LIMIT){await reader.cancel();return reply(413,{ok:false});}chunks.push(value);}
      }finally{reader.releaseLock();}
      const raw=new Uint8Array(n);let offset=0;for(const chunk of chunks){raw.set(chunk,offset);offset+=chunk.byteLength;}
      // Verify signature before even resolving the database adapter.
      if(!signatures.verify(raw,sig,env.HITPAY_WEBHOOK_SALT))return reply(401,{ok:false});
      // A valid signature on a truncated JSON body is a payload error, not an auth error.
      if(n<2)return reply(400,{ok:false});
      const store=await resolveInbox(env);
      const core=createBillingCore({env,store,clock,signatures});
      const result=await core.receive(raw,sig,request.headers.get("hitpay-event-object"),request.headers.get("hitpay-event-type"));
      if(result.ok)return reply(200,{ok:true});
      if(["INVALID_SIGNATURE","UNMATCHED_MERCHANT"].includes(result.error))return reply(401,{ok:false});
      if(result.error==="INVALID_PAYLOAD")return reply(400,{ok:false});
      return reply(503,{ok:false});
    }catch{return reply(503,{ok:false});}
  };
}
