// Run J4 tests in the dedicated preview only. Never change the other journeys' build/test behavior.
import {spawnSync} from "node:child_process";
if(process.env.VERCEL_ENV==="preview"&&process.env.VERCEL_GIT_COMMIT_REF==="feat/j4-private-staff-admin-20261126"){
 const result=spawnSync(process.execPath,["--test",...["j4-staff-read-contract","j4-staff-session","j4-staff-currency","j4-fixtures","j4-state-service","j4-checkin-fixture","j4-http","j4-desk-report","j4-wix-boundary"].map(x=>"tests/"+x+".test.mjs")],{stdio:"inherit"});
 if(result.error||result.status!==0)process.exit(result.status||1);
}
