// Server-only bridge: an independently verified provider adapter must provide normalized evidence.
// Never mount normalized evidence as an HTTP payload. Do not infer failed renewals from expiry or absence.
import {createN4Service} from "../nizar/automation-service.mjs";
import {runtimeEnabled} from "./http-utils.mjs";
import {n4} from "../nizar/automation-state.mjs";
export function createCombinedPaymentBridge({env,runtime,readVerifiedEvidence}){
 if(!runtimeEnabled(env)||env.COMBINED_PAYMENT_BRIDGE_ENABLED!=="1"||typeof readVerifiedEvidence!=="function")throw Error("PAYMENT_BRIDGE_DISABLED");
 return async eventKey=>{
  if(typeof eventKey!=="string"||!/^[a-f0-9]{64}$/.test(eventKey))return {ok:false,status:"UNVERIFIED_EVENT"};
  const observation=await readVerifiedEvidence(eventKey);
  if(!observation||observation.eventId!==eventKey||!["renewal-failed","renewal-paid","deposit-paid"].includes(observation.kind))return {ok:false,status:"UNVERIFIED_EVENT"};
  const owner=await runtime.readOwner(observation.childId,observation.parentId);
  if(!owner)return {ok:false,status:"NOT_AUTHORIZED"};
  const service=createN4Service({...runtime,verifyEvent:async key=>key===eventKey?await readVerifiedEvidence(key):null,readAttendance:async()=>null});
  const result=await service.event(eventKey);
  if(result.ok&&observation.kind==="renewal-failed"){
   // Revoke every active grant for this child; new code required after recovery.
   for(let i=0;i<8;i++){
    const snap=await runtime.repository.read(),hold=n4(snap.state).holds.find(h=>h.childId===owner.childId&&h.cycleId===observation.cycleId);
    if(!hold||hold.status==="restored")break;
    const rows=snap.state.checkins??[],next=rows.map(c=>c.childId===owner.childId&&c.status!=="revoked"?{...c,status:"revoked",claimId:null,grantRevision:null,sessionDigest:null,validUntil:null,memberUntil:null}:c);
    if(JSON.stringify(rows)===JSON.stringify(next))break;
    const saved=await runtime.repository.compareAndSet(snap.version,{...snap.state,checkins:next});
    if(saved.status==="committed")break;
    if(saved.status!=="conflict"||i===7)return {ok:false,status:"REVOCATION_UNCONFIRMED"};
   }
  }
  return result;
 };
}
