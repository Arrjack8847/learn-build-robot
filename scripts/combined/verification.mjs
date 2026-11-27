// Explicit future Codespaces verification. Never deploys or grants release approval.
import {spawnSync} from "node:child_process";
import {mkdirSync,writeFileSync,readFileSync} from "node:fs";
import {resolve} from "node:path";
import {COMBINED_BRANCH} from "./scope.mjs";
const report={schema:1,commit:null,startedAt:new Date().toISOString(),checks:[],developmentVerified:false,releaseReady:false,providerAcceptance:"NOT_VERIFIED",securityReview:"NOT_VERIFIED",staticCurriculumPrivacy:"REVIEW_REQUIRED",liveAcceptance:"NOT_RUN"};
const git=(...args)=>{const r=spawnSync("git",args,{encoding:"utf8"});if(r.status!==0)throw Error("Git preflight failed");return r.stdout.trim();};
let reportDir=null;
try{
 if(process.env.CODESPACES!=="true"||git("rev-parse","--show-toplevel")!==process.cwd())throw Error("Use a clean isolated Codespaces repository root");
 reportDir=resolve(".combined-verification");
 report.commit=git("rev-parse","HEAD");
 if(git("rev-parse","refs/remotes/origin/"+COMBINED_BRANCH)!==report.commit||git("status","--porcelain","--untracked-files=normal"))throw Error("Check out the clean combined branch HEAD");
 if(JSON.parse(readFileSync("vercel.json","utf8")).git?.deploymentEnabled?.[COMBINED_BRANCH]!==false)throw Error("Automatic deployment must be disabled");
 report.checks.push({name:"source-preflight",status:"PASS"});
 // Build runner sanitizes its child process environment, refuses credential files and never starts a server.
 const at=Date.now(),r=spawnSync("npm",["run","build:combined-private"],{stdio:"inherit"});
 report.checks.push({name:"private-build-and-regression",status:r.status===0&&!r.error?"PASS":"FAIL",exitCode:r.status,signal:r.signal??null,durationMs:Date.now()-at});
 if(r.status!==0||r.error)throw Error("Private build/regression failed");
 if(git("rev-parse","HEAD")!==report.commit||git("status","--porcelain","--untracked-files=no"))throw Error("Tracked source changed");
 report.developmentVerified=true;
}catch(e){report.blocker=e instanceof Error?e.message:"Verification unavailable";process.exitCode=1;}
finally{
 report.finishedAt=new Date().toISOString();
 if(reportDir){mkdirSync(reportDir,{recursive:true,mode:0o700});writeFileSync(resolve(reportDir,"report.json"),JSON.stringify(report,null,2)+"\n",{mode:0o600});}
 console.log(JSON.stringify(report,null,2));
}
