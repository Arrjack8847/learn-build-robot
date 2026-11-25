// Explicit operator-requested sandbox acceptance probe; never a live payment.
// Only the specific prior failed reservation may be claimed with durable CAS.
// No retry, no real wallet, no membership or payment writes, no secrets in logs.
import {randomBytes} from "node:crypto";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {createSandboxTransport} from "./j3-node-transport.mjs";
const env=process.env;
const tag="[J3 Touch n Go]";
const version=()=>randomBytes(16).toString("hex");
const id="stem-lab-checkout-v1", collection="SandboxCheckoutTrials";
const planId="a34f0707-c529-4c64-9f1f-e969c0d3de16";
async function run(){
 if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.VERCEL_GIT_COMMIT_REF!=="feat/wix-lms-integration-20261125"||env.VERCEL_GIT_COMMIT_MESSAGE!=="J3: one-time Touch n Go sandbox subscription acceptance test"||env.HITPAY_API_BASE_URL!=="https://api.sandbox.hit-pay.com"||env.HITPAY_SANDBOX_PLAN_ID!==planId){console.log(tag+" SKIPPED outside authorized preview");return}
 try{
  const store=createWixStore(env);
  const row=await store.get(collection,id);
  if(!row||row.status!=="reserved_retry"||row.createdAt?.$date!=="2026-11-25T09:48:56.462Z"||row.planId!==planId||row.providerReference!==id||row.providerSubscriptionId||row.checkoutUrl){console.log(tag+" PRIOR_RESERVATION_NOT_ELIGIBLE; no POST");return}
  let posted=false;
  const request=async(url,options)=>{
   const u=new URL(url);
   if(u.origin!=="https://api.sandbox.hit-pay.com"||options.redirect!=="error")throw Error("SANDBOX_ONLY");
   if(options.method==="GET"){
    if(u.pathname!=="/v1/recurring-billing"&&u.pathname!=="/v1/subscription-plan/"+planId)throw Error("GET_REFUSED");
    return fetch(url,options);
   }
   if(options.method!=="POST"||u.pathname!=="/v1/recurring-billing"||u.search||posted)throw Error("POST_REFUSED");
   const body=JSON.parse(options.body);
   if(body.plan_id!==planId||body.reference!==id||body.customer_email!=="stem-lab-sandbox@example.com"||body.send_email!=="false"||body.times_to_be_charged!==2||JSON.stringify(body.payment_methods)!=='["card"]')throw Error("PAYLOAD_REFUSED");
   posted=true;
   body.payment_methods=["touch_n_go"];
   const response=await fetch(url,{...options,body:JSON.stringify(body)});
   console.log(tag+" CREATE_HTTP "+response.status);
   return response;
  };
  // Use a confirmed existing private deployment for the return URL. Returns never credit payments.
  const provider=createSandboxTransport({...env,HITPAY_SANDBOX_RETURN_URL:"https://learn-build-robot-71adlore2-soe-min-khants-projects.vercel.app/parent/payment-return"},request);
  const plan=await provider.getVerifiedFixturePlan();
  if(!plan||plan.planId!==planId||plan.amountMinor!==36000||plan.currency!=="MYR"||plan.cycle!=="monthly"){console.log(tag+" PLAN_NOT_VERIFIED; no POST");return}
  if(await provider.confirmNoMatchingSubscription(id)!==true){console.log(tag+" PRIOR_PROVIDER_LOOKUP_UNCONFIRMED; no POST");return}
  const next={planId,providerReference:id,status:"reserved_tng_test",stateVersion:version(),createdAt:{$date:new Date().toISOString()}};
  if(await store.replaceIfVersion(collection,id,row.stateVersion,next)!==true){console.log(tag+" RESERVATION_CHANGED; no POST");return}
  const result=await provider.createHostedSubscription({planId,customerEmail:"stem-lab-sandbox@example.com",reference:id});
  if(!result||!provider.isAllowedCheckoutUrl(result.url)||!(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result.subscriptionId))){console.log(tag+" RESPONSE_UNCONFIRMED; no retry");return}
  const saved=await store.replaceIfVersion(collection,id,next.stateVersion,{...next,status:"hosted",providerSubscriptionId:result.subscriptionId,checkoutUrl:result.url,stateVersion:version()});
  console.log(tag+" "+(saved===true?"HOSTED_CHECKOUT_SAVED":"BIND_UNCONFIRMED")+"; no payment confirmed");
 }catch{console.log(tag+" TEST_UNCONFIRMED_OR_REJECTED; no automatic retry");}
}
await run();
