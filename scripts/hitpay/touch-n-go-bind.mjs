// One-time guarded recovery: GET only to HitPay; conditional update to isolated Wix trial.
// No new subscription, payment, member, or email can be created here.
import {randomBytes} from "node:crypto";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {recoverExistingTouchNGo} from "./touch-n-go-recover-core.mjs";
const env=process.env,tag="[J3 Touch n Go bind]";
if(env.VERCEL_ENV==="preview"&&env.VERCEL_TARGET_ENV!=="production"&&env.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&env.VERCEL_GIT_COMMIT_MESSAGE==="J3: restore verified existing Touch n Go sandbox checkout"&&env.HITPAY_API_BASE_URL==="https://api.sandbox.hit-pay.com"&&env.HITPAY_SANDBOX_PLAN_ID==="a34f0707-c529-4c64-9f1f-e969c0d3de16"&&env.HITPAY_API_KEY?.trim()){
 try{
  const result=await recoverExistingTouchNGo({store:createWixStore(env),newVersion:()=>randomBytes(16).toString("hex"),readSubscriptions:async status=>{
   const u=new URL("https://api.sandbox.hit-pay.com/v1/recurring-billing");u.searchParams.set("reference","stem-lab-checkout-v1");u.searchParams.set("status",status);
   const r=await fetch(u.href,{method:"GET",headers:{"X-BUSINESS-API-KEY":env.HITPAY_API_KEY,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});
   if(!r.ok)throw Error("LOOKUP_UNAVAILABLE");return r.json();
  }});
  console.log(tag+" "+result+"; no payment confirmed");
 }catch{console.log(tag+" RECOVERY_UNCONFIRMED; no POST");}
}else console.log(tag+" SKIPPED outside authorized preview");
