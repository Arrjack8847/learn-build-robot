// Isolated Codespaces verification or exact Vercel preview build. No provider credentials or activation flags inherited.
import {spawnSync} from "node:child_process";
import {existsSync,lstatSync,readFileSync,readdirSync} from "node:fs";
import {COMBINED_BRANCH,COMBINED_SITE} from "./scope.mjs";
import {auditPublicOutput} from "../security/audit-j5-public-output.mjs";
import {reviewStaticAssets} from "../security/review-j12345-static-assets.mjs";
const git=(...args)=>{const r=spawnSync("git",args,{encoding:"utf8"});if(r.status!==0)throw Error("Git preflight failed");return r.stdout.trim();};
const env=Object.fromEntries(["PATH","HOME","USER","SHELL","TMPDIR","TEMP","TMP","LANG","LC_ALL","CI","TERM","SystemRoot","ComSpec"].filter(k=>typeof process.env[k]==="string").map(k=>[k,process.env[k]]));
Object.assign(env,{CODESPACES:"true",VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:COMBINED_BRANCH,VERCEL_URL:"fixture.invalid",WIX_DEV_SITE_ID:COMBINED_SITE,COMBINED_PRIVATE_BUILD_PIPELINE:"1",COMBINED_RUNTIME_ENABLED:"0",COMBINED_IDENTITY_ENABLED:"0",COMBINED_SCHEDULING_ENABLED:"0",COMBINED_CHECKIN_ENABLED:"0",COMBINED_AUTOMATION_ENABLED:"0",COMBINED_NOTICE_ENABLED:"0",COMBINED_DEPOSIT_ENABLED:"0",COMBINED_PAYMENT_BRIDGE_ENABLED:"0"});
const vercel=process.env.VERCEL==="1"&&process.env.VERCEL_ENV==="preview"&&process.env.VERCEL_TARGET_ENV!=="production"&&process.env.VERCEL_GIT_COMMIT_REF===COMBINED_BRANCH&&/^[a-f0-9]{40}$/.test(process.env.VERCEL_GIT_COMMIT_SHA??"");
if(vercel){
 delete env.CODESPACES;
 Object.assign(env,{VERCEL:"1",VERCEL_GIT_COMMIT_SHA:process.env.VERCEL_GIT_COMMIT_SHA});
}
function run(cmd,args){const r=spawnSync(cmd,args,{stdio:"inherit",env});if(r.error||r.status!==0)throw Error("Private combined build failed: "+cmd+" "+args.join(" "));}
try{
 if(process.env.VERCEL==="1"&&!vercel)throw Error("Vercel build requires exact combined preview and commit metadata");
 if(!vercel&&(process.env.CODESPACES!=="true"||git("rev-parse","--show-toplevel")!==process.cwd()))throw Error("Use the isolated Codespaces repository root or exact Vercel preview");
 const commit=vercel?process.env.VERCEL_GIT_COMMIT_SHA:git("rev-parse","HEAD");
 if(!vercel&&(git("rev-parse","refs/remotes/origin/"+COMBINED_BRANCH)!==commit||git("status","--porcelain","--untracked-files=normal")))throw Error("Use the clean, exact combined branch HEAD");
 if(JSON.parse(readFileSync("vercel.json","utf8")).git?.deploymentEnabled?.[COMBINED_BRANCH]!==false)throw Error("Automatic deployment must remain disabled");
 if(readdirSync(".").some(p=>p===".env"||p.startsWith(".env.")&&p!==".env.example"))throw Error("Use a verification worktree without local .env files");
 if(!existsSync("node_modules/vite/bin/vite.js"))throw Error("Install dependencies in the isolated verification worktree first");
 for(const p of [".output","dist","build/client",".vercel/output"])if(existsSync(p))throw Error("Existing build output: "+p+"; review before verification");
 run("npm",["run","typecheck"]);
 run("npm",["run","test:combined"]);
 run("npm",["run","prebuild"]);
 run("npm",["run","test:final-build"]);
 run(process.execPath,["node_modules/vite/bin/vite.js","build","--mode","combined-private"]);
 run("npm",["run","postbuild"]);
 const roots=[".output/public",".output/server/public","dist/client","build/client",".vercel/output/static"].filter(p=>existsSync(p)&&lstatSync(p).isDirectory());
 if(vercel&&!roots.includes(".vercel/output/static"))throw Error("Expected Vercel static output");
 if(vercel&&!existsSync(".vercel/output/config.json"))throw Error("Expected Vercel Build Output API configuration");
 const report=auditPublicOutput(roots);console.log(JSON.stringify(report,null,2));if(!report.passed)throw Error("Private output audit failed");
 console.log(JSON.stringify({staticAssetReview:reviewStaticAssets(roots)},null,2));
 if(!vercel&&(git("rev-parse","HEAD")!==commit||git("status","--porcelain","--untracked-files=no")))throw Error("Tracked source changed during verification");
 // Also refuse PDF binaries accidentally packaged outside the public static directory.
 if(vercel){
  function verifyNoPdf(dir){for(const name of readdirSync(dir)){const p=dir+"/"+name,s=lstatSync(p);if(/\\.pdf(?:\\.(?:gz|br))?$/i.test(name))throw Error("PDF deployment artifact detected");if(s.isDirectory()&&!s.isSymbolicLink())verifyNoPdf(p);}}
  verifyNoPdf(".vercel/output");
 }
 console.log("Private build checks only. No production release or provider acceptance is established.");
}catch(e){console.error(e instanceof Error?e.message:"Private build failed");process.exitCode=1;}
