import test from "node:test";
import {auditSandboxInfrastructure} from "../scripts/hitpay/j3-infrastructure-audit.mjs";
function tests(audit){
 const u="11111111-1111-1111-1111-111111111111",w="22222222-2222-2222-2222-222222222222",m="33333333-3333-3333-3333-333333333333",url="https://designerbestemread.wixstudio.com/my-site-1/_functions/hitpaySandbox";
 const e={VERCEL_ENV:"preview",VERCEL_GIT_COMMIT_REF:"feat/j3-sandbox-payment-20261126",J3_SANDBOX_ROTATION_CONFIRMED:"true",HITPAY_WEBHOOK_ID:w,HITPAY_BUSINESS_ID:m,HITPAY_WEBHOOK_URL:url};
 const cfg={environment:"sandbox",apiUrl:"https://api.sandbox.hit-pay.com",currency:"SGD",planId:u,membershipMinor:500,apiKey:"dummy-fixture"};
 const events=["payment_request.completed","payment_request.failed","charge.created","charge.updated","charge.failed","recurring_billing.method_attached","recurring_billing.method_detached","recurring_billing.subscription_updated"];
 const plan={id:u,cycle:"monthly",currency:"sgd",amount:"5.00"},webhook={id:w,business_id:m,url,event_types:events};
 const make=(p=plan,h=webhook,config=cfg)=>{const calls=[];return {calls,readConfig:()=>config,timeoutSignal:()=>undefined,request:async(url,opt)=>{calls.push({url,method:opt.method,redirect:opt.redirect});return {ok:true,json:async()=>url.includes("/subscription-plan/")?p:h};}}};
 const eq=(a,b)=>{if(a!==b)throw Error("assertion failed: "+a+" != "+b)};
 return [
 ["metadata is not signed-delivery proof",async()=>{const f=make();const r=await audit(e,f);eq(r.plan,"verified");eq(r.webhookRegistration,"verified");eq(r.ok,false);eq(r.endpointSalt,"unverified");eq(f.calls.length,2);eq(f.calls.every(x=>x.method==="GET"&&x.redirect==="error"&&x.url.startsWith(cfg.apiUrl+"/")),true)}],
 ["refuse production",async()=>{const f=make();eq((await audit({...e,VERCEL_ENV:"production"},f)).error,"PREVIEW_BRANCH_REQUIRED");eq(f.calls.length,0)}],
 ["refuse unrelated branch",async()=>{const f=make();eq((await audit({...e,VERCEL_GIT_COMMIT_REF:"main"},f)).error,"PREVIEW_BRANCH_REQUIRED");eq(f.calls.length,0)}],
 ["refuse unconfirmed rotation",async()=>{const f=make();eq((await audit({...e,J3_SANDBOX_ROTATION_CONFIRMED:"false"},f)).error,"ROTATION_CONFIRMATION_REQUIRED");eq(f.calls.length,0)}],
 ["reject wrong plan currency",async()=>{const f=make({...plan,currency:"myr"});eq((await audit(e,f)).error,"PLAN_MISMATCH");eq(f.calls.length,1)}],
 ["MYR plan accepted with matching configuration",async()=>{const f=make({...plan,currency:"myr"},webhook,{...cfg,currency:"MYR"});eq((await audit(e,f)).status,"read_only_checks_passed")}],
 ["reject missing charge.failed",async()=>eq((await audit(e,make(plan,{...webhook,event_types:events.filter(x=>x!=="charge.failed")}))).error,"WEBHOOK_REGISTRATION_MISMATCH")],
 ["reject wrong price",async()=>eq((await audit(e,make({...plan,amount:"5.01"}))).error,"PLAN_MISMATCH")],
 ["reject wrong cycle",async()=>eq((await audit(e,make({...plan,cycle:"weekly"}))).error,"PLAN_MISMATCH")],
 ["reject unrelated webhook merchant",async()=>eq((await audit(e,make(plan,{...webhook,business_id:u}))).error,"WEBHOOK_REGISTRATION_MISMATCH")],
 ["reject missing deposit event",async()=>eq((await audit(e,make(plan,{...webhook,event_types:events.slice(1)}))).error,"WEBHOOK_REGISTRATION_MISMATCH")],
 ["reject untrusted endpoint",async()=>{const f=make();eq((await audit({...e,HITPAY_WEBHOOK_URL:"https://example.invalid"},f)).error,"DEVELOPMENT_ENDPOINT_REQUIRED");eq(f.calls.length,0)}],
 ["reject live configuration",async()=>{const f=make(plan,webhook,{...cfg,apiUrl:"https://api.hit-pay.com"});eq((await audit(e,f)).error,"SANDBOX_CONFIGURATION_REQUIRED");eq(f.calls.length,0)}]
 ];
}
for(const [name,fn] of tests(auditSandboxInfrastructure))test(name,fn);
