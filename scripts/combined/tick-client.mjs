// Explicit one-shot invocation for a company-owned scheduler. No scheduling/deployment performed here.
// Never pass an event payload, only the digest of an already verified Wix inbox row.
import {COMBINED_BRANCH} from "./scope.mjs";
const e=process.env,u=new URL(e.COMBINED_WORKER_ORIGIN??"https://invalid.invalid"),key=e.COMBINED_WORKER_KEY,eventKey=process.argv[2];
if(e.VERCEL_GIT_COMMIT_REF!==COMBINED_BRANCH||e.COMBINED_WORKER_CLIENT_ENABLED!=="1"||u.protocol!=="https:"||u.origin!==e.COMBINED_WORKER_ORIGIN||!u.hostname.endsWith(".vercel.app")||! /^[a-f0-9]{64}$/.test(key??"")||eventKey!==undefined&&! /^[a-f0-9]{64}$/.test(eventKey))throw Error("WORKER_CLIENT_DISABLED");
const response=await fetch(u.origin+"/api/dev/combined/worker",{method:"POST",headers:{Authorization:"Bearer "+key,...(eventKey?{"Content-Type":"application/json"}:{})},...(eventKey?{body:JSON.stringify({eventKey})}:{}),redirect:"error",cache:"no-store",signal:AbortSignal.timeout(60000)});
console.log(JSON.stringify({status:response.status,ok:response.ok}));if(!response.ok)process.exitCode=1;
