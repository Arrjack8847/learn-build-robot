// Read-only sandbox reconciliation. Never logs the full checkout URL, credentials or customer data.
const env=process.env;
const tag="[J3 Touch n Go recovery]";
if(env.VERCEL_ENV==="preview"&&env.VERCEL_TARGET_ENV!=="production"&&env.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&env.VERCEL_GIT_COMMIT_MESSAGE==="J3: recover existing Touch n Go subscription metadata without creating another"&&env.HITPAY_API_BASE_URL==="https://api.sandbox.hit-pay.com"&&env.HITPAY_API_KEY?.trim()){
 const ref="stem-lab-checkout-v1",planId="a34f0707-c529-4c64-9f1f-e969c0d3de16";
 try{
  const results=await Promise.all(["active","scheduled","retrying","inactive","canceled"].map(async status=>{
   const url=new URL("https://api.sandbox.hit-pay.com/v1/recurring-billing");
   url.searchParams.set("reference",ref);url.searchParams.set("status",status);
   const response=await fetch(url,{method:"GET",headers:{"X-BUSINESS-API-KEY":env.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
   if(!response.ok)return {status,http:response.status,complete:false};
   const p=await response.json();
   const rows=Array.isArray(p?.data)?p.data:Array.isArray(p)?p:null;
   if(!rows)return {status,http:response.status,complete:false};
   const complete=p?.meta?.last_page===1||p?.last_page===1||p?.meta?.total===rows.length||p?.total===rows.length;
   const matches=rows.filter(r=>r?.reference===ref).map(r=>{
    const urls={};
    for(const key of ["url","checkout_url","payment_url"]){
     if(typeof r[key]!=="string")continue;
     try{const u=new URL(r[key]);urls[key]={https:u.protocol==="https:",host:/^[a-z0-9.-]+\.hit-pay\.com$/i.test(u.hostname)?u.hostname:"UNRECOGNIZED_HOST",credentials:!!(u.username||u.password),port:!!u.port};}catch{urls[key]={invalid:true}}
    }
    return {idValid:typeof r.id==="string"&&/^[a-f0-9-]{36}$/i.test(r.id),planMatches:r.business_recurring_plans_id===planId||r.plan_id===planId,amountMatches:Number(r.amount)===360,currencyMatches:String(r.currency).toUpperCase()==="MYR",urls,fields:Object.keys(r).filter(k=>["id","url","checkout_url","payment_url","reference","status","business_recurring_plans_id","plan_id","amount","currency","cycle","times_to_be_charged"].includes(k))};
   });
   return {status,http:response.status,count:rows.length,complete,matches};
  }));
  console.log(tag+" "+JSON.stringify(results));
 }catch{console.log(tag+" LOOKUP_UNAVAILABLE");}
}else console.log(tag+" SKIPPED outside authorized preview");
