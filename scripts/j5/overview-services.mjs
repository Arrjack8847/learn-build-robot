import {createStudentOverview} from "./student-overview.mjs";
import {createJ5Http} from "./http.mjs";
import {createCheckInService} from "./check-in-service.mjs";
import {projectCommittedProgress,authorizeResume} from "./committed-progress.mjs";

// One coherent, student-scoped snapshot per request. Providers are server-owned;
// no test identity or persistence implementation is imported into application runtime.
export function createOverviewServices({resolveStudent,readSnapshot,clock,checkInAuthority,resolveActivity,authorizeCourse}){
 if(typeof resolveStudent!=="function"||typeof readSnapshot!=="function"||typeof clock?.now!=="function")throw Error("J5 overview adapters required");
 const overview={async load(request,env){
  let snapshot=null, owner=null, evidence=null;
  const service=createStudentOverview({resolveStudent,clock,
   readProfile:async id=>{
    const row=await readSnapshot(id);
    if(row?.studentId!==id||row.environment!=="private-preview")return null;
    snapshot=row;owner=id;
    if(row.progressEvidence!=null){
     const p=row.progressEvidence;
     evidence=projectCommittedProgress({studentId:id,policy:p.policy,records:p.records,levelStates:row.levels,currentLevel:p.currentLevel,now:clock.now()});
    }
    return row.profile;
   },
   readMembership:async id=>{if(owner!==id)throw Error("Snapshot mismatch");return snapshot.membership??null;},
   readCheckIn:async id=>{if(owner!==id)throw Error("Snapshot mismatch");return snapshot.checkIn??null;},
   readLevels:async id=>{if(owner!==id)throw Error("Snapshot mismatch");return evidence?evidence.ok?evidence.levels:null:snapshot.levels;}
  });
  const result=await service.load(request,env);
  if(!result.ok)return result;
  const summary=evidence?.ok?evidence.learning:snapshot?.learning;
  if(summary==null)return result;
  const count=n=>Number.isSafeInteger(n)&&n>=0;
  const stamp=n=>count(n)&&n<=8640000000000000;
  const latest=summary.latest;
  if(summary.studentId!==owner||summary.environment!=="private-preview"||!Number.isInteger(summary.currentLevel)||summary.currentLevel<1||summary.currentLevel>6||result.levels.find(l=>l.level===summary.currentLevel)?.status==="locked"||![summary.overallCompleted,summary.overallRequired,summary.learningCompleted,summary.buildingCompleted,summary.quizzesPassed,summary.challengesPassed].every(count)||summary.overallCompleted>summary.overallRequired||!(latest===null||(typeof latest?.title==="string"&&latest.title.trim()&&latest.title.length<=160&&["learning","building","quiz","challenge"].includes(latest.mode)&&stamp(latest.updatedAt))))return {ok:false,status:503,code:"LEARNING_SUMMARY_UNAVAILABLE"};
  let resume=null;
  if(evidence?.ok&&result.profile.membership==="active"&&result.profile.checkIn==="verified"&&typeof resolveActivity==="function"&&typeof authorizeCourse==="function"){
   resume=await authorizeResume({candidate:evidence.resumeCandidate,resolveActivity,authorize:authorizeCourse,request,env,now:()=>clock.now()});
   const current=await resolveStudent(request,env);
   if(current?.role!=="student"||current.studentId!==owner||current.environment!=="private-preview")return {ok:false,status:401,code:"STUDENT_AUTH_REQUIRED"};
   if(resume&&!result.levels.find(l=>l.level===resume.level)?.available)resume=null;
  }
  return {...result,profile:{...result.profile,learning:{currentLevel:summary.currentLevel,overallCompleted:summary.overallCompleted,overallRequired:summary.overallRequired,learningCompleted:summary.learningCompleted,buildingCompleted:summary.buildingCompleted,quizzesPassed:summary.quizzesPassed,challengesPassed:summary.challengesPassed,latest:latest===null?null:{title:latest.title,mode:latest.mode,updatedAt:latest.updatedAt},...(resume?{resume}:{})}}};
 }};
 return {overview,checkIn:createCheckInService({resolveStudent,readSnapshot,clock,authority:checkInAuthority})};
}
export function createIndependentOverviewHttp(adapters){
 const services=createOverviewServices(adapters);
 return createJ5Http({getServices:async()=>services,parseOrigin:url=>new URL(url).origin,respond:(status,body,headers)=>new Response(JSON.stringify(body),{status,headers})});
}
