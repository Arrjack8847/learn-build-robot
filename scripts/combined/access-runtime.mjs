import {createCombinedRuntime} from "./scheduling-runtime.mjs";
import {createCombinedBookingProjection} from "./booking-projection.mjs";
import {createJ12345AccessReader,readJ12345Access} from "../j12345/access.mjs";
import {readJ12345VerifiedChild} from "../j2-runtime.mjs";
import {isCombinedBranch} from "./scope.mjs";
import {runtimeEnabled} from "./http-utils.mjs";
import {n4} from "../nizar/automation-state.mjs";
import {readJ12345MembershipObservation} from "../j1234/billing-projection.mjs";
export async function readCombinedAccess(child,env){
 if(!isCombinedBranch(env))return readJ12345Access(child,env);
 if(!runtimeEnabled(env))return null;
 try{
  const r=createCombinedRuntime(env),project=createCombinedBookingProjection({repository:r.repository,readVerifiedChild:id=>readJ12345VerifiedChild(id,env)});
  const readMembership=async args=>{
   const before=await r.repository.read(),observed=await readJ12345MembershipObservation(args),after=await r.repository.read();
   if(before.version!==after.version)return {studentId:args.studentId,membershipStatus:"verification_required",activatedAt:null,validUntil:null,verifiedLearningEligibility:false};
   const hold=n4(after.state).holds.find(h=>h.childId===args.studentId&&h.parentId===args.parentId&&h.status!=="restored");
   return hold?{studentId:args.studentId,membershipStatus:"payment_pending",activatedAt:null,validUntil:null,verifiedLearningEligibility:false}:observed;
  };
  return await createJ12345AccessReader({storeFactory:()=>r.store,readAttendance:project,readMembership})(child,env);
 }catch{return null;}
}
export async function verifyCombinedVisit(request,env){try{return await createCombinedRuntime(env).checkin?.verifyPass(request)??null;}catch{return null;}}
