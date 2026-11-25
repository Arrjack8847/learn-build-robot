// Node-only HitPay transport. Never import this from browser code.
import {createHmac,createHash,timingSafeEqual} from "node:crypto";
import {isAllowedSandboxCheckoutUrl} from "./checkout-url.mjs";
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
  const isAllowedCheckoutUrl=isAllowedSandboxCheckoutUrl;
  async function createHostedSubscription({planId,customerEmail,reference}){
    guard();
    if(!/^[a-f0-9-]{36}$/i.test(planId)||planId!==env.HITPAY_SANDBOX_PLAN_ID||(!/^[^\s@]+@example\.invalid$/i.test(customerEmail)&&customerEmail!=="stem-lab-sandbox@example.com")||!/^[a-zA-Z0-9_-]{1,128}$/.test(reference))throw Error("INVALID_FIXTURE");
    const redirect=new URL(env.HITPAY_SANDBOX_RETURN_URL);
    // Explicit preview URL, no arbitrary browser-supplied redirect.
    if(redirect.protocol!=="https:"||!redirect.hostname.endsWith(".vercel.app")||redirect.username||redirect.password||redirect.port||redirect.pathname!=="/parent/payment-return"||redirect.search||redirect.hash)throw Error("INVALID_RETURN_URL");
    const start=new Date(Date.now()+86400000+8*3600000).toISOString().slice(0,10);
    const body={plan_id:planId,customer_email:customerEmail,customer_name:"STEM Lab Sandbox Trial",save_card:"false",save_payment_method:"false",start_date:start,reference,redirect_url:redirect.href,payment_methods:["touch_n_go"],send_email:"false",times_to_be_charged:2};
    const res=await request(sandbox+"/v1/recurring-billing",{method:"POST",headers:{"X-BUSINESS-API-KEY":env.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest","Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(body),redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
    if(!res.ok){
      // Only fixed validation field names, never raw messages, values, tokens or customer data.
      const known=["customer_email","plan_id","customer_name","start_date","start_date_method","redirect_url","payment_methods","send_email","times_to_be_charged","save_card","save_payment_method","reference","currency","amount","cycle"];
      let fields=[];try{const detail=await res.json();const errors=detail?.errors;if(errors&&typeof errors==="object")fields=known.filter(k=>Object.hasOwn(errors,k));}catch{}
      console.warn("[J3 checkout] CREATE_HTTP "+res.status+" validation_fields="+fields.join(","));
      throw Error("UNCONFIRMED_SUBSCRIPTION");
    }
    const data=await res.json();
    if(typeof data.id!=="string"||!isAllowedCheckoutUrl(data.url)){
      console.warn("[J3 checkout] CREATE_RESPONSE_UNVERIFIED id_present="+(typeof data.id==="string")+" url_present="+(typeof data.url==="string"));
      throw Error("UNCONFIRMED_SUBSCRIPTION");
    }
    return {subscriptionId:data.id,url:data.url};
  }
  async function getVerifiedFixturePlan(){
    guard();
    const planId=env.HITPAY_SANDBOX_PLAN_ID;
    if(typeof planId!=="string"||!/^[a-f0-9-]{36}$/i.test(planId))return null;
    const res=await request(sandbox+"/v1/subscription-plan/"+encodeURIComponent(planId),{method:"GET",headers:{"X-BUSINESS-API-KEY":env.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
    if(!res.ok)return null;
    const data=await res.json();
    if(data.id!==planId||data.reference!=="stem-lab-monthly-myr360-sandbox-v1"||Number(data.amount)!==360||String(data.currency).toUpperCase()!=="MYR"||data.cycle!=="monthly")return null;
    // Charge count is explicitly set on the subsequent subscription POST;
    // the published plan detail response does not expose its charge count.
    return {planId,amountMinor:36000,currency:"MYR",cycle:"monthly",chargeCount:2};
  }
  async function confirmNoMatchingSubscription(reference){
    guard();
    if(reference!=="stem-lab-checkout-v1")return false;
    try{
      const states=["active","scheduled","retrying","inactive","canceled"];
      const results=await Promise.all(states.map(async status=>{
        const url=new URL(sandbox+"/v1/recurring-billing");
        url.searchParams.set("reference",reference);url.searchParams.set("status",status);
        const res=await request(url.href,{method:"GET",headers:{"X-BUSINESS-API-KEY":env.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});
        if(!res.ok)return false;
        const p=await res.json();
        const rows=Array.isArray(p?.data)?p.data:Array.isArray(p)?p:null;
        return !!rows&&rows.length===0&&(p?.meta?.last_page===1||p?.last_page===1||p?.meta?.total===0||p?.total===0);
      }));
      return results.every(Boolean);
    }catch{return false;}
  }
  return {createHostedSubscription,isAllowedCheckoutUrl,getVerifiedFixturePlan,confirmNoMatchingSubscription};
}
