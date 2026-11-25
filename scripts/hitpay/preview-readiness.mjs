// One designated preview build may provision a sandbox PLAN, never a charge or customer.
// Do not redeploy this commit or run concurrent builds. The list-before-create is
// not an atomic provider reservation. A failed/ambiguous POST must be reconciled
// with a read-only list, never repeated automatically.
import {checkSandbox} from "./sandbox-client.mjs";
import {provisionPlan,PLAN} from "./monthly-plan.mjs";
const env=process.env;
const prefix="[J3 sandbox plan]";
if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.VERCEL_GIT_COMMIT_REF!=="feat/wix-lms-integration-20261125"||env.VERCEL_GIT_COMMIT_MESSAGE!=="J3: provision one sandbox membership plan"||!process.argv.includes("--build-hook")){
  console.log(prefix+" SKIPPED outside designated provisioning build");
}else{
  const signal=AbortSignal.timeout(25000);
  let posted=false;
  const restricted=async(url,options)=>{
    const target=new URL(url);
    if(target.origin!=="https://api.sandbox.hit-pay.com"||target.pathname!=="/v1/subscription-plan"||options?.redirect!=="error")throw Error("SANDBOX_PLAN_ONLY");
    if(options.method==="POST"){
      if(posted||target.search||options.body!==JSON.stringify(PLAN))throw Error("POST_REFUSED");
      posted=true;
    }else if(options.method!=="GET")throw Error("METHOD_REFUSED");
    const response=await fetch(url,{...options,signal});
    if(options.method==="POST")console.log(prefix+" CREATE_HTTP "+response.status);
    return response;
  };
  try{
    const connection=await checkSandbox(env,restricted,()=>signal);
    if(!connection.ok){console.log(prefix+" CONNECTION_FAILED");}
    else{
      const plan=await provisionPlan(env,restricted,{create:true,timeoutSignal:()=>signal});
      const errors=new Set(["LIST_FAILED","INVALID_PAGINATION","DUPLICATE_PLAN_REQUIRES_REVIEW","EXISTING_PLAN_MISMATCH","CREATE_NOT_CONFIRMED_RECHECK_LIST","CREATE_RESPONSE_UNVERIFIED_RECHECK_LIST","REQUEST_FAILED_RECHECK_LIST"]);
      if(plan.ok&&["created","existing"].includes(plan.action)&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(plan.planId)){
        console.log(prefix+" "+plan.action.toUpperCase()+" PLAN_ID "+plan.planId+" MYR 360 monthly; renewal settings not verified");
        const verify=await provisionPlan(env,restricted,{create:false,timeoutSignal:()=>signal});
        console.log(prefix+" READBACK "+(verify.ok&&verify.action==="existing"&&verify.planId===plan.planId?"MATCH":"UNCONFIRMED"));
      }else console.log(prefix+" NOT_CONFIRMED "+(errors.has(plan.error)?plan.error:"UNKNOWN")+"; no automatic retry");
    }
  }catch{console.log(prefix+" UNCONFIRMED; no automatic retry");}
}
