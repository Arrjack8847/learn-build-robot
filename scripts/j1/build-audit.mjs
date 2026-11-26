// Executes only on the designated J1 preview commit. Read-only, redacted.
import {isJ1Preview,getJ1Readiness} from "./readiness.mjs";
if(isJ1Preview(process.env)&&process.env.VERCEL_GIT_COMMIT_MESSAGE==="J1: private readiness centre and safe acceptance audit [skip ci]"){
 const checks=await getJ1Readiness(process.env,{probe:true});
 console.log("[J1 readiness audit] "+JSON.stringify(checks));
}
