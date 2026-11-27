// Builds locally in the existing cloud workspace only. Never deploys.
import {spawnSync} from "node:child_process";
import {existsSync,lstatSync} from "node:fs";
import {reviewStaticAssets} from "../security/review-j12345-static-assets.mjs";
import {auditPublicOutput} from "../security/audit-j5-public-output.mjs";
import {J12345_BRANCH,isJ12345Preview} from "./identity-scope.mjs";
const env={...process.env,J12345_PRIVATE_BUILD_PIPELINE:"1"};
const npm=process.platform==="win32"?"npm.cmd":"npm";
function run(cmd,args){const r=spawnSync(cmd,args,{stdio:"inherit",env});if(r.error||r.status!==0)throw Error("Private build step failed: "+cmd);}
try{
 if(!isJ12345Preview(env)||env.VERCEL_GIT_COMMIT_REF!==J12345_BRANCH)throw Error("Exact J12345 preview environment required");
 run(npm,["run","typecheck"]);
 run(npm,["run","prebuild"]);
 run(npm,["run","test:final-build"]);
 run(process.execPath,["node_modules/vite/bin/vite.js","build","--mode","j12345-private"]);
 run(npm,["run","postbuild"]);
 const roots=[".output/public",".output/server/public","dist/client","build/client",".vercel/output/static"].filter(p=>existsSync(p)&&lstatSync(p).isDirectory());
 const report=auditPublicOutput(roots);
 console.log(JSON.stringify(report,null,2));
 if(!report.passed)throw Error("Private output contains unreviewed artifacts or legacy PDF references");
 const assets=reviewStaticAssets(roots);
 console.log(JSON.stringify({staticAssetReview:assets},null,2));
 console.log("PDF artifact check passed; this is not a release approval. Static curriculum classification, storage and live acceptance remain required. Do not deploy.");
}catch(e){console.error(e instanceof Error?e.message:"Private build unavailable");process.exitCode=1;}
