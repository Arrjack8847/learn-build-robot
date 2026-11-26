// Read-only infrastructure checker; no provider mutations.
export async function auditSandboxInfrastructure(env,{readConfig,request,timeoutSignal}){
 const r={configuration:"unverified",plan:"unverified",webhookRegistration:"unverified",endpointSalt:"unverified",signedDelivery:"unverified"};
 const fail=error=>({ok:false,error,...r});
 if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.VERCEL_GIT_COMMIT_REF!=="feat/j3-sandbox-payment-20261126")return fail("PREVIEW_BRANCH_REQUIRED");
 if(env.J3_SANDBOX_ROTATION_CONFIRMED!=="true")return fail("ROTATION_CONFIRMATION_REQUIRED");
 let cfg;try{cfg=readConfig(env);}catch{return fail("CANONICAL_CONFIGURATION_INCOMPLETE");}
 if(cfg.environment!=="sandbox"||cfg.apiUrl!=="https://api.sandbox.hit-pay.com"||!["MYR","SGD"].includes(cfg.currency))return fail("SANDBOX_CONFIGURATION_REQUIRED");
 const uuid=x=>typeof x==="string"&&/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(x);
 if(![env.HITPAY_BUSINESS_ID,cfg.planId].every(uuid)||(env.HITPAY_WEBHOOK_ID&&!uuid(env.HITPAY_WEBHOOK_ID)))return fail("WEBHOOK_OR_MERCHANT_ID_REQUIRED");
 const endpoint="https://designerbestemread.wixstudio.com/my-site-1/_functions/hitpaySandbox";
 if(env.HITPAY_WEBHOOK_URL!==endpoint)return fail("DEVELOPMENT_ENDPOINT_REQUIRED");
 if(cfg.currency!=="MYR"||env.HITPAY_SANDBOX_PAYMENT_METHOD!=="touch_n_go")return fail("TOUCH_N_GO_SCOPE_REQUIRED");
 r.configuration="validated";
 const required=["payment_request.completed","payment_request.failed","charge.created","charge.updated","charge.failed","recurring_billing.method_attached","recurring_billing.method_detached","recurring_billing.subscription_updated"];
 async function get(path){
  const res=await request(cfg.apiUrl+path,{method:"GET",headers:{"X-BUSINESS-API-KEY":cfg.apiKey,Accept:"application/json","X-Requested-With":"XMLHttpRequest"},redirect:"error",cache:"no-store",signal:timeoutSignal()});
  if(!res.ok)throw Error("PROVIDER_READ_UNCONFIRMED");return res.json();
 }
 try{
  const p=await get("/v1/subscription-plan/"+encodeURIComponent(cfg.planId));
  const exactMinor=x=>{const s=String(x);if(!/^(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/.test(s))return null;const [w,f=""]=s.split(".");return Number(w)*100+Number(f.padEnd(2,"0"));};
  if(p?.id!==cfg.planId||p.cycle!=="monthly"||String(p.currency).toUpperCase()!==cfg.currency||exactMinor(p.amount)!==cfg.membershipMinor)return fail("PLAN_MISMATCH");
  r.plan="verified";
  const list=await get("/v1/webhook-events");
  if(!Array.isArray(list))return fail("WEBHOOK_LIST_UNCONFIRMED");
  const matches=list.filter(x=>x?.url===endpoint);
  if(matches.length!==1||!uuid(matches[0].id)||matches[0].business_id!==env.HITPAY_BUSINESS_ID||(env.HITPAY_WEBHOOK_ID&&matches[0].id!==env.HITPAY_WEBHOOK_ID))return fail("WEBHOOK_REGISTRATION_MISMATCH");
  const webhookId=matches[0].id;
  const w=await get("/v1/webhook-events/"+encodeURIComponent(webhookId));
  if(w?.id!==webhookId||w.business_id!==env.HITPAY_BUSINESS_ID||w.url!==endpoint||!Array.isArray(w.event_types)||!required.every(x=>w.event_types.includes(x)))return fail("WEBHOOK_REGISTRATION_MISMATCH");
  r.webhookRegistration="verified";
  return {ok:false,status:"read_only_checks_passed",error:"SIGNED_DELIVERY_REQUIRED",...r};
 }catch{return fail("PROVIDER_READ_UNCONFIRMED");}
}
