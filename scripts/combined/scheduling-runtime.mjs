import {createWixStore} from "../parent-auth/wix-store.mjs";
import {createAuthCrypto,previewRecipients} from "../parent-auth/secure-auth-transport.mjs";
import {createJ12345IdentityEnv} from "../j12345/identity-scope.mjs";
import {createSchedulingRepository} from "../nizar/repository.mjs";
import {createBookingService} from "../nizar/booking-service.mjs";
import {createN4Service} from "../nizar/automation-service.mjs";
import {createStaffSchedulingService,createSharedAttendanceAdapter} from "../nizar/staff-service.mjs";
import {createCombinedIdentityMembership} from "./identity-membership.mjs";
import {createCombinedCheckin} from "./checkin-service.mjs";
import {resolveJ2Student} from "../j2-runtime.mjs";
import {runtimeEnabled,secret,matches,mixed,cookie} from "./http-utils.mjs";
export function createCombinedRuntime(env,{db,clock=Date.now}={}){
 if(!runtimeEnabled(env))throw Error("COMBINED_DISABLED");
 const cfg=createJ12345IdentityEnv(env),store=db??createWixStore(env),repository=createSchedulingRepository({env,db:store,clock});
 const identity=createCombinedIdentityMembership({env,db:store,clock});
 const deps={repository,clock,...identity};
 const resolveStaff=async request=>env.COMBINED_STAFF_ENABLED==="1"&&!mixed(request)&&matches(request.headers.get("x-stem-combined-staff"),secret(env,"COMBINED_STAFF_KEY"))?{staffId:"combined-test-operator-v1",version:"combined-v1",permissions:["schedule:read","schedule:walk-in","schedule:attendance"]}:null;
 const attendance=createSharedAttendanceAdapter(deps);
 const staff=createStaffSchedulingService({...deps,resolveStaff});
 const booking=createBookingService(deps);
 const automation=createN4Service({...deps,readAttendance:b=>attendance.noAttendance(b,{canonicalAttendanceEnabled:env.COMBINED_CANONICAL_ATTENDANCE_ACCEPTED==="1"}),verifyEvent:async()=>null});
 async function listStudents(request){
  if(!await resolveStaff(request))return null;
  const auth=createAuthCrypto(cfg),ids=new Set(),result=[];
  for(const email of previewRecipients(cfg)){
   const parentId="qa-j2-"+auth.identityDigest("parent-preview-session",email);
   for(const row of await store.listFixtureChildren(parentId)){
    if(ids.has(row.childId))throw Error("DUPLICATE_CHILD");
    const c=await identity.readOwner(row.childId,parentId);
    if(!c||c.stateVersion!==row.stateVersion)throw Error("CHILD_UNCONFIRMED");
    ids.add(c.childId);result.push({id:c.childId,name:c.name});
   }
  }
  return await resolveStaff(request)?result:null;
 }
 const codeSecret=secret(env,"COMBINED_CODE_SECRET");
 const checkin=env.COMBINED_CHECKIN_ENABLED==="1"&&codeSecret?createCombinedCheckin({...deps,resolveStaff,secret:codeSecret,resolveStudent:async request=>{if((request.headers.get("cookie")??"").split(";").some(x=>/^__Host-bsr-(?:parent-test|student-proof)=.+/.test(x.trim())))return null;const s=await resolveJ2Student(request,env);return s?.role==="student"?{childId:s.studentId,sessionToken:cookie(request,"__Host-bsr-student")}:null;}}):null;
 return {...deps,booking,automation,staff,attendance,resolveStaff,listStudents,store,checkin};
}
