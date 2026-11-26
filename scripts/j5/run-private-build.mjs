#!/usr/bin/env node
// Explicit private-build pipeline only. No deployment, no source PDF deletion.
import {spawnSync} from "node:child_process";
import {existsSync,lstatSync} from "node:fs";
import {auditPublicOutput} from "../security/audit-j5-public-output.mjs";
const env={...process.env,J5_PRIVATE_BUILD_PIPELINE:"1",VITE_J5_PRIVATE_UI:"true"};
const npm=process.platform==="win32"?"npm.cmd":"npm";
function run(command,args){const r=spawnSync(command,args,{stdio:"inherit",env});if(r.error||r.status!==0)throw Error("Private build step failed: "+command);}
try{
 run(npm,["run","assets:webp"]);
 run(process.execPath,["node_modules/vite/bin/vite.js","build","--mode","j5-private"]);
 run(process.execPath,["scripts/pdf/remove-all-output-pdfs.mjs"]);
 const roots=[".output/public",".output/server/public","dist/client","build/client",".vercel/output/static"].filter(p=>existsSync(p)&&lstatSync(p).isDirectory());
 if(roots.length===0)throw Error("No known public output root; refuse release");
 const report=auditPublicOutput(roots);
 console.log(JSON.stringify(report,null,2));
 if(!report.passed)throw Error("Private output contains public PDF, legacy origin or unreviewed artifacts");
 console.log("PDF output diagnostic passed; live origin/provider acceptance is still required. Do not deploy.");
}catch(error){console.error(error instanceof Error?error.message:"Private build unavailable");process.exitCode=1;}
