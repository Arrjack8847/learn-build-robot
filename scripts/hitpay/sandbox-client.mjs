// Server-side sandbox diagnostic only. No browser import or public HTTP endpoint.
// Official reference: https://docs.hitpayapp.com/apis/recurring-billing/get-all-plans
// Do not log provider response bodies, API keys, or salt.
// A successful GET validates the API key, not the webhook signing salt.
export async function checkSandbox(env,request,timeoutSignal=()=>AbortSignal.timeout(15000)) {
  const fail=error=>({ok:false,error});
  if(env.VERCEL_ENV==="production"||env.VERCEL_TARGET_ENV==="production")return fail("PRODUCTION_REFUSED");
  if(env.HITPAY_API_BASE_URL!=="https://api.sandbox.hit-pay.com")return fail("SANDBOX_REQUIRED");
  if(typeof env.HITPAY_API_KEY!=="string"||!env.HITPAY_API_KEY.trim()||typeof env.HITPAY_SALT_KEY!=="string"||!env.HITPAY_SALT_KEY.trim())return fail("MISSING_CONFIG");
  try{
    const res=await request("https://api.sandbox.hit-pay.com/v1/subscription-plan?page=1&per_page=20",{
      method:"GET",headers:{"X-BUSINESS-API-KEY":env.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest","Accept":"application/json"},
      redirect:"error",cache:"no-store",signal:timeoutSignal()
    });
    if(!res.ok)return {ok:false,error:"UPSTREAM_HTTP_ERROR",status:res.status};
    const data=await res.json();
    if(!Array.isArray(data?.data))return fail("UNEXPECTED_RESPONSE");
    return {ok:true,firstPageCount:data.data.length,saltConfigured:true};
  }catch{return fail("UPSTREAM_UNAVAILABLE");}
}
