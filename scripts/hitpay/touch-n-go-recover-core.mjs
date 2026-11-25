import {isAllowedSandboxCheckoutUrl} from "./checkout-url.mjs";
const collection="SandboxCheckoutTrials",ref="stem-lab-checkout-v1";
const planId="a34f0707-c529-4c64-9f1f-e969c0d3de16";
const timestamp="2026-11-25T09:58:09.492Z";
const states=["active","scheduled","retrying","inactive","canceled"];
const uuid=v=>typeof v==="string"&&/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(v);
export async function recoverExistingTouchNGo({store,readSubscriptions,newVersion}){
 const row=await store.get(collection,ref);
 if(!row||row.planId!==planId||row.providerReference!==ref||typeof row.stateVersion!=="string"||!row.stateVersion)return "RESERVATION_MISMATCH";
 if(row.status==="hosted"&&uuid(row.providerSubscriptionId)&&isAllowedSandboxCheckoutUrl(row.checkoutUrl))return "ALREADY_HOSTED";
 if(row.status!=="reserved_tng_test"||row.createdAt?.$date!==timestamp||row.providerSubscriptionId||row.checkoutUrl)return "RESERVATION_NOT_ELIGIBLE";
 const all=await Promise.all(states.map(async status=>{
  const p=await readSubscriptions(status);
  const rows=Array.isArray(p?.data)?p.data:Array.isArray(p)?p:null;
  if(!rows||!(p?.meta?.last_page===1||p?.last_page===1||p?.meta?.total===rows.length||p?.total===rows.length))throw Error("LOOKUP_INCOMPLETE");
  return rows.filter(r=>r?.reference===ref).map(r=>({r,status}));
 }));
 const matches=all.flat();
 if(matches.length!==1)return "MATCH_COUNT_"+matches.length;
 const {r,status}=matches[0];
 if(status!=="scheduled"||r.status!=="scheduled"||!uuid(r.id)||(r.business_recurring_plans_id??r.plan_id)!==planId||Number(r.amount)!==360||String(r.currency).toUpperCase()!=="MYR"||r.cycle!=="monthly"||Number(r.times_to_be_charged)!==2||!isAllowedSandboxCheckoutUrl(r.url))return "MATCH_DETAILS_UNVERIFIED";
 const next={...row,status:"hosted",providerSubscriptionId:r.id,checkoutUrl:r.url,stateVersion:newVersion()};
 if(await store.replaceIfVersion(collection,ref,row.stateVersion,next)!==true)return "CAS_NOT_CONFIRMED";
 const saved=await store.get(collection,ref);
 return saved?.status==="hosted"&&saved.providerSubscriptionId===r.id&&saved.checkoutUrl===r.url&&saved.stateVersion===next.stateVersion?"HOSTED_VERIFIED":"READBACK_UNCONFIRMED";
}
