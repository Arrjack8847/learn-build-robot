// Actual isolated Wix connectivity smoke, only on explicitly opted-in J4 preview.
// Uses existing server-only dev configuration. No credentials or record data are logged.
import {createJ4WixStore} from "./j4-wix-store.mjs";
import {fixtureEnabled,fixtureStoreEnv,ensureFixtureKey} from "./j4-wix-exercise.mjs";
import {randomBytes} from "node:crypto";
if(process.env.J4_FIXTURE_WIX_ENABLED==="1"&&process.env.VERCEL_GIT_COMMIT_REF==="feat/j4-private-staff-admin-20261126"){
 if(!fixtureEnabled(process.env))throw Error("J4_FIXTURE_CONFIGURATION_FAILED");
 const store=createJ4WixStore(fixtureStoreEnv(process.env));
 const s=await ensureFixtureKey(store);
 let verified=false;
 for(let i=0;i<5&&!verified;i++){
  const before=await store.readStrong(),next={...before,stateVersion:randomBytes(16).toString("hex")};
  if(!await store.compareAndSet(before.stateVersion,next))continue;
  const stale=await store.compareAndSet(before.stateVersion,{...before,stateVersion:randomBytes(16).toString("hex")});
  if(stale)throw Error("J4_STALE_WRITE_ACCEPTED");
  const after=await store.readStrong();
  if(after.stateVersion!==next.stateVersion)continue;
  if(after.students.length!==7||after.staff.length!==3||after.mode!=="j4-fixture-v1")throw Error("J4_FIXTURE_COUNTS");
  verified=true;
 }
 if(!verified)throw Error("J4_FIXTURE_PERSISTENCE_UNCONFIRMED");
 console.log("J4 LIVE WIX FIXTURE: strong read, conditional write, stale rejection, persisted reread verified.");
}
