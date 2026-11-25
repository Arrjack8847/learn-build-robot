// Read-only investigation of the one fictional checkout. No POST, no reservation reset.
// https://docs.hitpayapp.com/apis/recurring-billing/get-all-billing
const env=process.env;
const tag="[J3 checkout reconciliation]";
if(env.VERCEL_ENV==="preview"&&env.VERCEL_TARGET_ENV!=="production"&&env.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&env.VERCEL_GIT_COMMIT_MESSAGE==="J3: reconcile prior sandbox checkout by read-only provider lookup"&&env.HITPAY_API_BASE_URL==="https://api.sandbox.hit-pay.com"&&env.HITPAY_API_KEY?.trim()){
 const ref="stem-lab-checkout-v1";
 const states=["active","scheduled","retrying","inactive","canceled"];
 try{
  const result=await Promise.all(states.map(async status=>{
   const url=new URL("https://api.sandbox.hit-pay.com/v1/recurring-billing");
   url.searchParams.set("reference",ref);
   url.searchParams.set("status",status);
   const response=await fetch(url,{method:"GET",headers:{"X-BUSINESS-API-KEY":env.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
   if(!response.ok)return {status,http:response.status,complete:false};
   const payload=await response.json();
   const rows=Array.isArray(payload)?payload:Array.isArray(payload?.data)?payload.data:null;
   if(!rows)return {status,http:response.status,complete:false,shape:"unknown"};
   const complete=payload?.meta?.last_page===1||payload?.last_page===1||payload?.meta?.total===rows.length||payload?.total===rows.length;
   const matches=rows.filter(r=>r?.reference===ref).map(r=>{let host=null;try{const u=new URL(r.url);if(u.protocol==="https:"&&/^[a-z0-9.-]+\.hit-pay\.com$/i.test(u.hostname)&&!u.username&&!u.password&&!u.port)host=u.hostname}catch{}return {idValid:typeof r.id==="string"&&/^[a-f0-9-]{36}$/i.test(r.id),hasUrl:typeof r.url==="string",checkoutHost:host,planMatches:r.business_recurring_plans_id===env.HITPAY_SANDBOX_PLAN_ID||r.plan_id===env.HITPAY_SANDBOX_PLAN_ID,amountMatches:Number(r.amount)===360,keys:Object.keys(r).filter(k=>["id","url","reference","business_recurring_plans_id","plan_id","amount","currency","status","checkout_url"].includes(k))}});
   return {status,http:response.status,count:rows.length,complete,matches};
  }));
  console.log(tag+" "+JSON.stringify(result));
 }catch{console.log(tag+" LOOKUP_UNAVAILABLE; no retry or reset");}
}else console.log(tag+" SKIPPED outside designated private preview");
