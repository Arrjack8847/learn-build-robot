// J5 server-only projection of trusted committed educational evidence.
// Requirements come from the approved curriculum/level policy, not client data.
// This module is not a database writer or an automatic level-unlock service.
const modes=new Set(["learning","building","quiz","challenge"]);
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
const stamp=x=>Number.isSafeInteger(x)&&x>=0&&x<=8640000000000000;
const count=x=>Number.isSafeInteger(x)&&x>=0;
const bound=(row,studentId)=>row?.studentId===studentId&&row.environment==="private-preview";
const key=(mode,resourceId)=>mode+":"+resourceId;
export function projectCommittedProgress({studentId,policy,records,levelStates,now}){
 const fail=code=>({ok:false,code});
 if(!id(studentId)||!stamp(now)||policy?.approved!==true||!id(policy.version)||!Array.isArray(policy.requirements)||!Array.isArray(records)||!Array.isArray(levelStates))return fail("PROGRESS_POLICY_UNAVAILABLE");
 if(levelStates.length!==6||new Set(levelStates.map(r=>r?.level)).size!==6||levelStates.some(r=>!bound(r,studentId)||!Number.isInteger(r.level)||r.level<1||r.level>6||!["locked","unlocked","in-progress","completed"].includes(r.status)))return fail("LEVEL_STATE_UNAVAILABLE");
 const requirements=new Map();
 for(const r of policy.requirements){
  if(!modes.has(r?.mode)||!id(r.resourceId)||!Number.isInteger(r.level)||r.level<1||r.level>6||typeof r.title!=="string"||!r.title.trim()||r.title.length>160||requirements.has(key(r.mode,r.resourceId)))return fail("INVALID_REQUIREMENTS");
  requirements.set(key(r.mode,r.resourceId),r);
 }
 if([...Array(6)].some((_,i)=>![...requirements.values()].some(r=>r.level===i+1)))return fail("INCOMPLETE_REQUIREMENTS");
 const fulfilled=new Set(),seenAttempts=new Map();
 let latest=null,resume=null;
 const sorted=[...records].sort((a,b)=>(a?.updatedAt??0)-(b?.updatedAt??0));
 for(const r of sorted){
  if(!bound(r,studentId)||r.committed!==true||r.policyVersion!==policy.version||!id(r.attemptId)||!id(r.resourceId)||!modes.has(r.mode)||!stamp(r.updatedAt)||r.updatedAt>now)return fail("INVALID_PROGRESS_EVIDENCE");
  const k=key(r.mode,r.resourceId),req=requirements.get(k);
  if(!req||r.level!==req.level)return fail("INVALID_PROGRESS_EVIDENCE");
  const stateAllowed=r.mode==="learning"||r.mode==="building"?["started","completed","reference-reviewed"]:["started","failed","passed"];
  if(!stateAllowed.includes(r.status))return fail("INVALID_PROGRESS_EVIDENCE");
  const attemptKey=r.mode+":"+r.attemptId;
  const previous=seenAttempts.get(attemptKey);
  // Evidence is a committed snapshot (one row per attempt), not an event stream.
  if(previous)return fail("DUPLICATE_ATTEMPT_EVIDENCE");
  seenAttempts.set(attemptKey,true);
  if(r.status==="completed"||r.status==="passed")fulfilled.add(k);
  if(!latest||r.updatedAt>latest.updatedAt)latest={title:req.title,mode:r.mode,updatedAt:r.updatedAt};
  if(r.status==="started"&&(r.mode==="learning"||r.mode==="building")&&count(r.position)&&r.position>0&&count(req.maxPosition)&&req.maxPosition>=r.position&&(!resume||r.updatedAt>resume.updatedAt)){
   resume={resourceId:r.resourceId,mode:r.mode,level:r.level,position:r.position,updatedAt:r.updatedAt};
  }
 }
 const levels=levelStates.slice().sort((a,b)=>a.level-b.level).map(r=>{
  const entries=[...requirements.entries()].filter(([,q])=>q.level===r.level);
  const completed=entries.filter(([k])=>fulfilled.has(k)).length;
  return {studentId,environment:"private-preview",level:r.level,status:r.status,allowed:r.status!=="locked",checkInRequired:true,completed,required:entries.length};
 });
 // Never use this projection to grant a level; contradictory committed state fails.
 if(levels.some(r=>(r.status==="completed"&&r.completed!==r.required)||(r.status==="locked"&&r.completed>0)))return fail("INCONSISTENT_LEVEL_STATE");
 const current=levels.find(r=>r.allowed&&r.status!=="completed")??levels.filter(r=>r.allowed).at(-1);
 if(!current)return fail("LEVEL_STATE_UNAVAILABLE");
 const totals=mode=>[...fulfilled].filter(k=>k.startsWith(mode+":")).length;
 if(resume&&(fulfilled.has(key(resume.mode,resume.resourceId))||!levels.find(r=>r.level===resume.level)?.allowed))resume=null;
 return {ok:true,levels,learning:{studentId,environment:"private-preview",currentLevel:current.level,overallCompleted:fulfilled.size,overallRequired:requirements.size,learningCompleted:totals("learning"),buildingCompleted:totals("building"),quizzesPassed:totals("quiz"),challengesPassed:totals("challenge"),latest},resumeCandidate:resume};
}
// Candidate is NOT access permission. Re-resolve canonical catalog and authorize
// current session/level/check-in before projecting an exact resume destination.
export async function authorizeResume({candidate,resolveActivity,authorize,request,env,now}){
 if(!candidate||!id(candidate.resourceId)||!["learning","building"].includes(candidate.mode)||!Number.isInteger(candidate.level)||candidate.level<1||candidate.level>6||!count(candidate.position)||candidate.position<1)return null;
 try{
  const resource=await resolveActivity(candidate.resourceId,candidate.mode);
  if(!resource||resource.resourceId!==candidate.resourceId||resource.mode!==candidate.mode||resource.level!==candidate.level||!id(resource.projectId)||!count(resource.maxPosition)||candidate.position>resource.maxPosition)return null;
  const path="/practical/"+resource.projectId;
  const grant=await authorize(request,env,path);
  if(grant?.ok!==true||grant.code!=="COURSE_AUTHORIZED"||!stamp(grant.validUntil)||grant.validUntil<=now())return null;
  return {path,mode:candidate.mode,position:candidate.position,level:candidate.level};
 }catch{return null;}
}
