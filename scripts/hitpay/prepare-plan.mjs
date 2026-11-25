// Run in a private server environment, one operator at a time.
// Default dry-run: node --env-file=.env.local scripts/hitpay/prepare-plan.mjs
// Explicit creation: node --env-file=.env.local scripts/hitpay/prepare-plan.mjs --create-sandbox-plan
import { provisionPlan } from "./monthly-plan.mjs";
const args=process.argv.slice(2);
if(args.length>1||(args.length===1&&args[0]!=="--create-sandbox-plan")){console.error("Invalid argument");process.exitCode=1;}else{
 const result=await provisionPlan(process.env,fetch,{create:args[0]==="--create-sandbox-plan"});
 console.log(JSON.stringify(result,null,2));
 if(!result.ok)process.exitCode=1;
}
