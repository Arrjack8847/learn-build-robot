// Read-only, preview-only operator diagnostic. No secrets or provider bodies logged.
// Build hook runs on the explicitly requested diagnostic commit only.
import {checkSandbox} from "./sandbox-client.mjs";
import {provisionPlan} from "./monthly-plan.mjs";
const env=process.env;
const prefix="[J3 sandbox readiness]";
const buildHook=process.argv.includes("--build-hook");
if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.VERCEL_GIT_COMMIT_REF!=="feat/wix-lms-integration-20261125"||(buildHook&&env.VERCEL_GIT_COMMIT_MESSAGE!=="J3: run read-only sandbox readiness diagnostic")){
  console.log(prefix+" SKIPPED outside designated private preview diagnostic");
}else{
  const signal=AbortSignal.timeout(25000);
  // Enforce exact destination and method even if helpers later change.
  const readOnly=(url,options)=>{const target=new URL(url);if(target.origin!=="https://api.sandbox.hit-pay.com"||target.pathname!=="/v1/subscription-plan"||options?.method!=="GET"||options.redirect!=="error")throw Error("SANDBOX_GET_ONLY");return fetch(url,{...options,signal});};
  try{
    const result=await checkSandbox(env,readOnly,()=>signal);
    const errors=new Set(["PRODUCTION_REFUSED","SANDBOX_REQUIRED","MISSING_CONFIG","UPSTREAM_HTTP_ERROR","UNEXPECTED_RESPONSE","UPSTREAM_UNAVAILABLE"]);
    if(!result.ok){console.log(prefix+" CONNECTION_FAILED "+(errors.has(result.error)?result.error:"UNKNOWN")+(Number.isInteger(result.status)?" HTTP "+result.status:""));}
    else{
      console.log(prefix+" CONNECTION_OK; read-only sandbox plan list accepted");
      const plan=await provisionPlan(env,readOnly,{create:false,timeoutSignal:()=>signal});
      const outcomes=new Set(["LIST_FAILED","INVALID_PAGINATION","DUPLICATE_PLAN_REQUIRES_REVIEW","EXISTING_PLAN_MISMATCH","REQUEST_FAILED_RECHECK_LIST","SANDBOX_REQUIRED","MISSING_API_KEY"]);
      console.log(prefix+" PLAN "+(plan.ok?(plan.action==="existing"?"MATCH_FOUND":plan.action==="not_created"?"NOT_FOUND":"UNKNOWN"):(outcomes.has(plan.error)?plan.error:"UNKNOWN")));
      console.log(prefix+" WEBHOOK_SALT "+(env.HITPAY_WEBHOOK_SALT?.trim()?"CONFIGURED":"MISSING")+"; BUSINESS_ID "+(env.HITPAY_BUSINESS_ID?.trim()?"CONFIGURED":"MISSING")+"; PLAN_ID "+(env.HITPAY_SANDBOX_PLAN_ID?.trim()?"CONFIGURED":"MISSING")+"; RETURN_URL "+(env.HITPAY_SANDBOX_RETURN_URL?.trim()?"CONFIGURED":"MISSING"));
    }
  }catch{console.log(prefix+" DIAGNOSTIC_UNAVAILABLE");}
}
