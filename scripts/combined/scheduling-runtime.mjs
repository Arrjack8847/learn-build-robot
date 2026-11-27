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
import {runtimeEnabled,secret,cookie} from "./http-utils.mjs";
import {createCombinedStaffResolver,staffRoster} from "./staff-identity.mjs";
export function createCombinedRuntime(env,{db,clock=Date.now}={}){
 if(!runtimeEnabled(env))throw Error("COMBINED_DISABLED");
 const cfg=createJ12345IdentityEnv(env),store=db??createWixStore(env),repository=createSchedulingRepository({env,db:store,clock});
 const identity=createCombinedIdentityMembership({env,db:store,clock});
 const deps={repository,clock,...identity};
 const resolveStaff=createCombinedStaffResolver(env);
 const staffNames=new Map(staffRoster(env).map(s=>[s.staffId,s.name]));
 const attendance=createSharedAttendanceAdapter(deps);
 const staff=createStaffSchedulingService({...deps,resolveStaff,staffName:id=>staffNames.get(id)??null});
 const booking=createBookingService(deps);
 const automation=createN4Service({...deps,readAttendance:b=>attendance.noAttendance(b,{canonicalAttendanceEnabled:env.COMBINED_CANONICAL_ATTENDANCE_ACCEPTED==="1"}),verifyEvent:async()=>null});
 async function listStudents(request){
  const actor=await resolveStaff(request);if(!actor?.permissions.includes("schedule:read"))return null;
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
  const fresh=await resolveStaff(request);
  return fresh?.staffId===actor.staffId&&fresh.version===actor.version?result:null;
 }
 const codeSecret=secret(env,"COMBINED_CODE_SECRET");
 const checkin=env.COMBINED_CHECKIN_ENABLED==="1"&&codeSecret?createCombinedCheckin({...deps,resolveStaff,secret:codeSecret,resolveStudent:async request=>{if((request.headers.get("cookie")??"").split(";").some(x=>/^__Host-bsr-(?:parent-test|student-proof)=.+/.test(x.trim())))return null;const s=await resolveJ2Student(request,env);return s?.role==="student"?{childId:s.studentId,sessionToken:cookie(request,"__Host-bsr-student")}:null;}}):null;
 return {...deps,booking,automation,staff,attendance,resolveStaff,listStudents,store,checkin};
}
