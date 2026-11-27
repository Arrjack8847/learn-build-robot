import {createCombinedRuntime} from "./scheduling-runtime.mjs";
import {createCombinedBookingProjection} from "./booking-projection.mjs";
import {createJ12345AccessReader,readJ12345Access} from "../j12345/access.mjs";
import {readJ12345VerifiedChild} from "../j2-runtime.mjs";
import {isCombinedBranch} from "./scope.mjs";
import {runtimeEnabled} from "./http-utils.mjs";
export async function readCombinedAccess(child,env){
 if(!isCombinedBranch(env))return readJ12345Access(child,env);
 if(!runtimeEnabled(env))return null;
 try{
  const r=createCombinedRuntime(env),project=createCombinedBookingProjection({repository:r.repository,readVerifiedChild:id=>readJ12345VerifiedChild(id,env)});
  return await createJ12345AccessReader({storeFactory:()=>r.store,readAttendance:project})(child,env);
 }catch{return null;}
}
export async function verifyCombinedVisit(request,env){try{return await createCombinedRuntime(env).checkin?.verifyPass(request)??null;}catch{return null;}}
