// J3.2 server-only operator script. Sandbox fixture, never live billing.
// Official API: https://docs.hitpayapp.com/apis/recurring-billing/create-plan
// Two charges selected only for testing one renewal. Production cycle/termination rules TBD.
// No subscriptions, customers, checkout URLs, or real payment creation.
export const PLAN=Object.freeze({
  "name": "STEM Makers Lab Monthly Membership — Sandbox",
  "description": "Fictional test membership, RM360 per child per month; two billing cycles for renewal testing only.",
  "amount": 360,
  "currency": "MYR",
  "cycle": "monthly",
  "reference": "stem-lab-monthly-myr360-sandbox-v1",
  "start_date_method": "sign_up_date",
  "times_to_be_charged": 2
});
export async function provisionPlan(env,request,{create=false,timeoutSignal=()=>AbortSignal.timeout(15000)}={}) {
  const fail=error=>({ok:false,error});
  if(env.VERCEL_ENV==="production"||env.VERCEL_TARGET_ENV==="production")return fail("PRODUCTION_REFUSED");
  if(env.HITPAY_API_BASE_URL!=="https://api.sandbox.hit-pay.com")return fail("SANDBOX_REQUIRED");
  if(typeof env.HITPAY_API_KEY!=="string"||!env.HITPAY_API_KEY.trim())return fail("MISSING_API_KEY");
  const base="https://api.sandbox.hit-pay.com/v1/subscription-plan";
  const headers={"X-BUSINESS-API-KEY":env.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"};
  const matches=[];
  const valid=row=>row&&typeof row.id==="string"&&row.id.length>0&&row.reference===PLAN.reference&&row.name===PLAN.name&&Number(row.amount)===PLAN.amount&&String(row.currency).toUpperCase()===PLAN.currency&&row.cycle===PLAN.cycle;
  try {
    for(let page=1;page<=100;page++){
      const res=await request(base+"?page="+page+"&per_page=20",{method:"GET",headers,redirect:"error",cache:"no-store",signal:timeoutSignal()});
      if(!res.ok)return fail("LIST_FAILED");
      const payload=await res.json();
      if(!Array.isArray(payload?.data)||payload?.meta?.current_page!==page||!Number.isInteger(payload?.meta?.last_page)||payload.meta.last_page<page||payload.meta.last_page>100)return fail("INVALID_PAGINATION");
      matches.push(...payload.data.filter(row=>row?.reference===PLAN.reference||row?.name===PLAN.name));
      if(page===payload.meta.last_page)break;
    }
    if(matches.length>1)return fail("DUPLICATE_PLAN_REQUIRES_REVIEW");
    if(matches.length===1){
      if(!valid(matches[0]))return fail("EXISTING_PLAN_MISMATCH");
      return {ok:true,action:"existing",planId:matches[0].id,renewalSettingsVerified:false};
    }
    if(!create)return {ok:true,action:"not_created",plan:PLAN};
    // Explicit operator action only. One POST, never auto-retry after uncertain outcome.
    // Run serially by one operator: list-before-create is not atomic.
    const res=await request(base,{method:"POST",headers:{...headers,"Content-Type":"application/json"},body:JSON.stringify(PLAN),redirect:"error",cache:"no-store",signal:timeoutSignal()});
    if(!res.ok)return fail("CREATE_NOT_CONFIRMED_RECHECK_LIST");
    const row=await res.json();
    if(!valid(row))return fail("CREATE_RESPONSE_UNVERIFIED_RECHECK_LIST");
    return {ok:true,action:"created",planId:row.id,renewalSettingsVerified:false};
  }catch{return fail("REQUEST_FAILED_RECHECK_LIST");}
}
