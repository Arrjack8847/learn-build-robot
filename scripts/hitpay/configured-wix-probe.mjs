// Preview-only probe. Never logs or persists any secret, signature, raw response or customer data.
// Signed synthetic event is deliberately outside the receiver allowlist; no inbox row or payment.
import {createHmac} from "node:crypto";
const env=process.env, site="09d613aa-3a95-42ff-9ee3-2aa0c706c447",tag="[J3 configured receiver]";
if(env.VERCEL_ENV==="preview"&&env.VERCEL_TARGET_ENV!=="production"&&env.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&env.VERCEL_GIT_COMMIT_MESSAGE==="J3: validate configured Wix webhook and sandbox payment status"&&env.WIX_DEV_SITE_ID===site){
 const url="https://designerbestemread.wixstudio.com/my-site-1/_functions/hitpaySandbox";
 const raw=Buffer.from(JSON.stringify({id:"qa-synthetic-ignored-event",business_id:"a34ebd5e-6bd2-4c62-a13d-b19f58f68fd7"}));
 async function probe(label,sig){
  try{const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json","hitpay-event-object":"qa_synthetic","hitpay-event-type":"ignored",...(sig?{"hitpay-signature":sig}:{})},body:raw,redirect:"error",cache:"no-store",signal:AbortSignal.timeout(15000)});let ok=null;try{ok=(await r.json()).ok}catch{}console.log(tag+" "+label+" HTTP "+r.status+" ok="+ok);return r.status;}catch{console.log(tag+" "+label+" UNAVAILABLE");return 0;}
 }
 await probe("unsigned",null);
 const invalid=await probe("forged","0".repeat(64));
 if(invalid===401&&env.WIX_DEV_DATA_API_KEY?.trim()){
  // Use only existing server-side scope; no new secret-read permission, no export.
  try{
   const r=await fetch("https://www.wixapis.com/_api/cloud-secrets-vault-server/api/v1/secrets/name/HITPAY_SANDBOX_WEBHOOK_SALT",{method:"GET",headers:{Authorization:env.WIX_DEV_DATA_API_KEY,"wix-site-id":site,Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});
   if(!r.ok){console.log(tag+" SIGNED_TEST_NOT_AVAILABLE HTTP "+r.status);}
   else {const {value}=await r.json();if(typeof value==="string"&&value.trim()){const sig=createHmac("sha256",value).update(raw).digest("hex");await probe("signed-ignored",sig);}else console.log(tag+" SIGNED_TEST_SECRET_UNAVAILABLE");}
  }catch{console.log(tag+" SIGNED_TEST_NOT_AVAILABLE")}
 }
}
