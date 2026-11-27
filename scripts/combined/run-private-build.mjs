// Codespaces-only opt-in private artifact. Never deploys or sets runtime acceptance flags.
import {spawnSync} from "node:child_process";
import {existsSync,lstatSync} from "node:fs";
import {combinedPreview,COMBINED_BRANCH} from "./scope.mjs";
import {auditPublicOutput} from "../security/audit-j5-public-output.mjs";
import {reviewStaticAssets} from "../security/review-j12345-static-assets.mjs";
const env={...process.env,COMBINED_PRIVATE_BUILD_PIPELINE:"1",COMBINED_RUNTIME_ENABLED:"0",COMBINED_CHECKIN_ENABLED:"0",COMBINED_AUTOMATION_ENABLED:"0",COMBINED_NOTICE_ENABLED:"0"};
function run(cmd,args){const r=spawnSync(cmd,args,{stdio:"inherit",env});if(r.error||r.status!==0)throw Error("Private combined build failed: "+cmd);}
try{
 if(process.env.CODESPACES!=="true"||!combinedPreview(env)||env.VERCEL_GIT_COMMIT_REF!==COMBINED_BRANCH)throw Error("Exact combined Codespaces preview environment required");
 run("npm",["run","typecheck"]);
 run("npm",["run","test:combined"]);
 run("npm",["run","prebuild"]);
 run("npm",["run","test:final-build"]);
 run(process.execPath,["node_modules/vite/bin/vite.js","build","--mode","combined-private"]);
 run("npm",["run","postbuild"]);
 const roots=[".output/public",".output/server/public","dist/client","build/client",".vercel/output/static"].filter(p=>existsSync(p)&&lstatSync(p).isDirectory());
 const report=auditPublicOutput(roots);console.log(JSON.stringify(report,null,2));if(!report.passed)throw Error("Private output audit failed");
 console.log(JSON.stringify({staticAssetReview:reviewStaticAssets(roots)},null,2));
 console.log("Private build checks only. No production release or provider acceptance is established.");
}catch(e){console.error(e instanceof Error?e.message:"Private build failed");process.exitCode=1;}
