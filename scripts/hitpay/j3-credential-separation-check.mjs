// Metadata-only outcome. No old key is sent to any provider; no values or hashes are logged.
import {createHash,timingSafeEqual} from "node:crypto";
const e=process.env,site="09d613aa-3a95-42ff-9ee3-2aa0c706c447";
const emit=status=>console.log("[J3 credential separation] "+JSON.stringify({status}));
async function main(){
 if(e.VERCEL_ENV!=="preview"||e.VERCEL_TARGET_ENV==="production"||e.VERCEL_GIT_COMMIT_REF!=="feat/j3-sandbox-payment-20261126"||e.VERCEL_GIT_COMMIT_MESSAGE!=="J3: revalidate rotated Wix managed sandbox credentials")return;
 if(e.WIX_DEV_SITE_ID!==site||!e.WIX_DEV_DATA_API_KEY?.trim()||e.HITPAY_API_URL!=="https://api.sandbox.hit-pay.com"){emit("scope_unconfirmed");return;}
 if(!e.HITPAY_API_KEY?.trim()){emit("legacy_not_available");return;}
 try{
  const r=await fetch("https://www.wixapis.com/_api/cloud-secrets-vault-server/api/v1/secrets/name/HITPAY_SANDBOX_API_KEY",{method:"GET",headers:{Authorization:e.WIX_DEV_DATA_API_KEY,"wix-site-id":site,Accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});
  if(!r.ok){emit("vault_unavailable");return;}
  const key=(await r.json()).value;
  if(typeof key!=="string"||!key.trim()){emit("vault_key_unavailable");return;}
  const digest=s=>createHash("sha256").update(s.trim()).digest();
  emit(timingSafeEqual(digest(key),digest(e.HITPAY_API_KEY))?"same_as_legacy":"different_from_legacy");
 }catch{emit("comparison_unavailable")}
}
await main();
