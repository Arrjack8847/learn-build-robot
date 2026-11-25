// Node-only HitPay transport. Never import this from browser code.
import {createHmac,createHash,timingSafeEqual} from "node:crypto";
export const signatures={
  verify(raw,signature,salt){
    if(!Buffer.isBuffer(raw)&&!(raw instanceof Uint8Array))return false;
    if(typeof signature!=="string"||!/^[a-f0-9]{64}$/i.test(signature)||typeof salt!=="string"||!salt.trim())return false;
    const expected=createHmac("sha256",salt).update(raw).digest();
    return timingSafeEqual(expected,Buffer.from(signature,"hex"));
  },
  decode:raw=>new TextDecoder("utf-8",{fatal:true}).decode(raw),
  digest:raw=>createHash("sha256").update(raw).digest("hex")
};
export function createSandboxTransport(env,request=fetch){
  const sandbox="https://api.sandbox.hit-pay.com";
  const guard=()=>{
    if(env.VERCEL_ENV==="production"||env.VERCEL_TARGET_ENV==="production"||env.HITPAY_API_BASE_URL!==sandbox||!env.HITPAY_API_KEY?.trim())throw Error("SANDBOX_REQUIRED");
  };
  function isAllowedCheckoutUrl(value){
    try{
      const u=new URL(value);
      return u.protocol==="https:"&&u.hostname==="securecheckout.sandbox.hit-pay.com"&&!u.username&&!u.password&&!u.port;
    }catch{return false;}
  }
  async function createHostedSubscription({planId,customerEmail,reference}){
    guard();
    if(!/^[a-f0-9-]{36}$/i.test(planId)||planId!==env.HITPAY_SANDBOX_PLAN_ID||!/^[^\s@]+@example\.invalid$/i.test(customerEmail)||!/^[a-zA-Z0-9_-]{1,128}$/.test(reference))throw Error("INVALID_FIXTURE");
    const redirect=new URL(env.HITPAY_SANDBOX_RETURN_URL);
    // Explicit preview URL, no arbitrary browser-supplied redirect.
    if(redirect.protocol!=="https:"||!redirect.hostname.endsWith(".vercel.app")||redirect.username||redirect.password||redirect.port||redirect.pathname!=="/parent/payment-return"||redirect.search||redirect.hash)throw Error("INVALID_RETURN_URL");
    const start=new Date(Date.now()+86400000+8*3600000).toISOString().slice(0,10);
    const body={plan_id:planId,customer_email:customerEmail,start_date:start,reference,redirect_url:redirect.href,payment_methods:["card"],send_email:"false",times_to_be_charged:2};
    const res=await request(sandbox+"/v1/recurring-billing",{method:"POST",headers:{"X-BUSINESS-API-KEY":env.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest","Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(body),redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
    if(!res.ok)throw Error("UNCONFIRMED_SUBSCRIPTION");
    const data=await res.json();
    if(typeof data.id!=="string"||!isAllowedCheckoutUrl(data.url))throw Error("UNCONFIRMED_SUBSCRIPTION");
    return {subscriptionId:data.id,url:data.url};
  }
  return {createHostedSubscription,isAllowedCheckoutUrl};
}
