// Run only in a private server environment with the HitPay variables configured.
// Node 22+: node --env-file=.env.local scripts/hitpay/check-sandbox.mjs
import { checkSandbox } from "./sandbox-client.mjs";
const result=await checkSandbox(process.env,fetch);
if(result.ok){
  console.log("HitPay sandbox API connected (read-only).");
  console.log("Subscription plans returned on first page: "+result.firstPageCount);
  console.log("Salt configured; signature validation still pending.");
}else{
  console.error("HitPay sandbox check failed: "+result.error+(result.status?" (HTTP "+result.status+")":""));
  process.exitCode=1;
}
