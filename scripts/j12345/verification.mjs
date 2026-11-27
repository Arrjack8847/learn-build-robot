// Codespaces-only verification runner. No deploy, install, provider actions or automatic cleanup.
import {spawnSync} from "node:child_process";
import {existsSync,mkdirSync,writeFileSync,statfsSync,readFileSync} from "node:fs";
import {resolve} from "node:path";
import {J12345_BRANCH} from "./identity-scope.mjs";
const cwd=process.cwd(),reportDir=resolve(cwd,".j12345-verification");
const git=(...args)=>{const r=spawnSync("git",args,{cwd,encoding:"utf8"});if(r.status!==0)throw Error("Git preflight failed");return r.stdout.trim();};
const npm=process.platform==="win32"?"npm.cmd":"npm";
const report={schema:1,commit:null,startedAt:new Date().toISOString(),checks:[],developmentVerified:false,releaseReady:false,staticCurriculumPrivacy:"REVIEW_REQUIRED",liveAcceptance:"NOT_RUN"};
function save(){mkdirSync(reportDir,{recursive:true,mode:0o700});writeFileSync(resolve(reportDir,"report.json"),JSON.stringify(report,null,2)+"\n",{mode:0o600});}
try{
 if(!process.env.CODESPACES||process.env.CODESPACES!=="true")throw Error("Run inside the isolated GitHub Codespaces verification worktree.");
 if(git("rev-parse","--show-toplevel")!==cwd)throw Error("Run at the repository root.");
 report.commit=git("rev-parse","HEAD");
 if(git("status","--porcelain","--untracked-files=normal"))throw Error("Working tree is not clean. Preserve your changes and use an isolated clean worktree.");
 if(git("rev-parse","refs/remotes/origin/"+J12345_BRANCH)!==report.commit)throw Error("Fetch and check out the exact integration branch HEAD first.");
 const cfg=JSON.parse(readFileSync("vercel.json","utf8"));
 if(cfg.git?.deploymentEnabled?.[J12345_BRANCH]!==false)throw Error("Automatic deployment must remain disabled.");
 if(!existsSync("node_modules/vite/bin/vite.js"))throw Error("Dependencies missing; install in the verification worktree first.");
 for(const path of [".output","dist","build/client",".vercel/output"])if(existsSync(path))throw Error("Existing output: "+path+". Review and remove generated output only before verification.");
 const fs=statfsSync(cwd),freeGiB=fs.bavail*fs.bsize/1073741824;
 if(freeGiB<5)throw Error("Less than 5 GiB free. Review generated files and workspace capacity before building.");
 report.checks.push({name:"preflight",status:"PASS",freeGiB:Math.floor(freeGiB*100)/100});save();
 // Explicit environment allowlist; no provider secrets, real test recipient values or feature flags inherited.
 const env=Object.fromEntries(["PATH","HOME","USER","SHELL","TMPDIR","TEMP","TMP","LANG","LC_ALL","CI","TERM","SystemRoot","ComSpec"].filter(k=>typeof process.env[k]==="string").map(k=>[k,process.env[k]]));
 Object.assign(env,{VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:J12345_BRANCH,VERCEL_URL:"fixture.invalid",J12345_REGISTRATION_ENABLED:"0",J12345_COURSE_ENABLED:"0",J12345_PROGRESS_ENABLED:"0",J12345_ASSESSMENT_ENABLED:"0",J12345_STAFF_LEARNING_ENABLED:"0"});
 // Vite loads .env files automatically: refuse local environment files, not just inherited variables.
 const localFiles=[".env",".env.local",".env.j12345-private",".env.j12345-private.local",".env.production",".env.production.local",".env.development",".env.development.local"];
 if(localFiles.some(existsSync))throw Error("Local env files present. Use a clean verification worktree without provider credentials.");
 const check=(name,args)=>{const at=Date.now();const r=spawnSync(npm,args,{cwd,env,stdio:"inherit"});report.checks.push({name,status:r.status===0&&!r.error?"PASS":"FAIL",exitCode:r.status,signal:r.signal??null,durationMs:Date.now()-at});save();if(r.status!==0||r.error)throw Error(name+" failed.");};
 // Private build includes strict typecheck, all prebuild regression suites, final-build regression and public artifact audit.
 check("private-build-and-regression",["run","build:j12345-private"]);
 if(git("rev-parse","HEAD")!==report.commit||git("diff","--quiet")!==""||git("diff","--cached","--quiet")!=="")throw Error("Source changed during verification.");
 report.developmentVerified=true;
}catch(e){report.blocker=e instanceof Error?e.message:"Verification unavailable";process.exitCode=1;}
finally{report.finishedAt=new Date().toISOString();save();console.log(JSON.stringify(report,null,2));}
