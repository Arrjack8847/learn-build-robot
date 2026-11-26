import {auditSandboxInfrastructure} from "./j3-infrastructure-audit.mjs";
import {readCompanyHitPayConfig} from "./company-config.mjs";
const result=await auditSandboxInfrastructure(process.env,{readConfig:readCompanyHitPayConfig,request:fetch,timeoutSignal:()=>AbortSignal.timeout(12000)});
console.log(JSON.stringify(result));
if(result.status!=="read_only_checks_passed")process.exitCode=1;
