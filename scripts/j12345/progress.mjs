// Server-only individual progress aggregate. Browser checkpoints are not completion evidence.
import {createHash,randomUUID} from "node:crypto";
import {isCombinedBranch} from "../combined/scope.mjs";
import {isFamilyPreview as isJ12345Preview,validJ12345Student,createJ12345IdentityEnv} from "./identity-scope.mjs";
import {projectCommittedProgress} from "../j5/committed-progress.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
export const COLLECTION="J12345LearningProgress",POLICY_KEY="j12345-approved-curriculum-v1";
const hash=x=>createHash("sha256").update(x).digest("hex");
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
const stamp=x=>Number.isSafeInteger(x)&&x>0&&x<=8640000000000000;
const modes=["learning","building","quiz","challenge"],learning=["learning","building"];
const unavailable=()=>({status:"unavailable"});
export const progressEnabled=e=>isJ12345Preview(e)&&e.J12345_PROGRESS_ENABLED==="1"&&e.J12345_PROFILE_ENABLED==="1"&&e.J12345_REGISTRATION_ENABLED==="1"&&e.STUDENT_AUTH_ENABLED==="true";
const owner=c=>validJ12345Student(c?.childId)&&validJ12345Student(c.parentId)&&c.accountStatus==="preview-test"&&typeof c.stateVersion==="string"&&!!c.stateVersion;
const sameChild=(a,b)=>owner(a)&&owner(b)&&a.childId===b.childId&&a.parentId===b.parentId&&a.stateVersion===b.stateVersion;
const binding=c=>({studentId:c.childId,environment:"private-preview"});
function levels(c,initial){return Array.from({length:6},(_,i)=>({...binding(c),level:i+1,allowed:i+1===initial,status:i+1===initial?"unlocked":"locked"}));}
function assessmentSummary(mode,level,status,v){
 if(v===undefined)return null; // Legacy evidence has no score detail.
 if(!v||typeof v!=="object"||Array.isArray(v)||!["passed","failed"].includes(status))throw Error("INVALID_ASSESSMENT_SUMMARY");
 const pass=status==="passed";
 if(mode==="quiz"){
  if(Object.keys(v).length!==2||v.total!==5||!Number.isInteger(v.correctCount)||v.correctCount<0||v.correctCount>5||pass!==(v.correctCount>=4))throw Error("INVALID_ASSESSMENT_SUMMARY");
  return {correctCount:v.correctCount,total:5};
 }
 if(mode!=="challenge")throw Error("INVALID_ASSESSMENT_SUMMARY");
 const total=level===1?4:5,required=level===1?3:4;
 if(Object.keys(v).length!==6||v.criteriaTotal!==total||!Number.isInteger(v.criteriaMet)||v.criteriaMet<0||v.criteriaMet>total||!Number.isSafeInteger(v.elapsedSeconds)||v.elapsedSeconds<0||v.overtimeSeconds!==Math.max(0,v.elapsedSeconds-900)||v.selfReported!==true||typeof v.acknowledgedFinish!=="boolean"||pass!==(v.acknowledgedFinish&&v.criteriaMet>=required&&(level===1||v.elapsedSeconds<=900)))throw Error("INVALID_ASSESSMENT_SUMMARY");
 return {criteriaMet:v.criteriaMet,criteriaTotal:total,elapsedSeconds:v.elapsedSeconds,overtimeSeconds:v.overtimeSeconds,selfReported:true,acknowledgedFinish:v.acknowledgedFinish};
}
function validatePolicy(p){
 if(p?.approved!==true||!id(p.version)||p.initialLevel!==1||p.progression!=="all-required-and-final-build-v1"||!Array.isArray(p.requirements)||p.requirements.length>2000)return false;
 if(p.requirements.some(r=>!r||!modes.includes(r.mode)||!id(r.resourceId)||!Number.isInteger(r.level)||r.level<1||r.level>6||typeof r.title!=="string"||!r.title.trim()||r.title.length>160||learning.includes(r.mode)&&(!Number.isSafeInteger(r.maxPosition)||r.maxPosition<1||r.maxPosition>10000)))return false;
 if(new Set(p.requirements.map(r=>r.mode+":"+r.resourceId)).size!==p.requirements.length)return false;
 return Array.from({length:6},(_,i)=>i+1).every(l=>p.requirements.some(r=>r.level===l&&r.mode==="challenge")&&p.requirements.some(r=>r.level===l&&r.mode==="learning")&&p.requirements.some(r=>r.level===l&&r.mode==="building"));
}
export function createProgressRepository({db,env,clock=Date.now,newId=randomUUID}){
 const combined=isCombinedBranch(env),scope=combined?"combined-progress-v1":"j12345-progress-v1",key=id=>scope+"-"+hash(id);
 const policyVersion=combined?env.COMBINED_PROGRESS_POLICY_VERSION:env.J12345_PROGRESS_POLICY_VERSION,policyHash=combined?env.COMBINED_PROGRESS_POLICY_SHA256:env.J12345_PROGRESS_POLICY_SHA256;
 async function policy(){
  if(!progressEnabled(env)||!id(policyVersion)||! /^[a-f0-9]{64}$/.test(policyHash??""))throw Error("POLICY_UNAVAILABLE");
  const row=await db.get(COLLECTION,isCombinedBranch(env)?"combined-approved-curriculum-v1":POLICY_KEY);
  if(row?.environment!=="private-preview"||typeof row.stateVersion!=="string"||typeof row.stateJson!=="string"||hash(row.stateJson)!==policyHash)throw Error("POLICY_UNAVAILABLE");
  const p=JSON.parse(row.stateJson);
  if(!validatePolicy(p)||p.version!==policyVersion||combined&&Array.from({length:6},(_,i)=>i+1).some(level=>p.requirements.filter(r=>r.level===level&&r.mode==="challenge").length!==1))throw Error("POLICY_UNAVAILABLE");
  return p;
 }
 function decode(row,c,p){
  if(row?.environment!=="private-preview"||!id(row.stateVersion)||typeof row.stateJson!=="string"||Buffer.byteLength(row.stateJson)>300000)throw Error("INVALID_PROGRESS_ROW");
  const s=JSON.parse(row.stateJson);
  if(s.scope!==scope||s.studentId!==c.childId||s.parentId!==c.parentId||s.policyVersion!==p.version||s.policyHash!==policyHash||!Array.isArray(s.records)||s.records.length>2000)throw Error("INVALID_PROGRESS_ROW");
  const v=projectCommittedProgress({studentId:c.childId,policy:p,records:s.records,levelStates:s.levels,currentLevel:s.currentLevel,now:clock()});
  if(!v.ok)throw Error(v.code);
  const ordered=v.levels;
  const highest=ordered.filter(l=>l.allowed).at(-1)?.level;
  if(highest!==s.currentLevel||ordered.some(l=>l.level<s.currentLevel&&l.status!=="completed"||l.level>s.currentLevel&&l.status!=="locked"))throw Error("INVALID_LEVEL_SEQUENCE");
  const reqs=new Map(p.requirements.map(q=>[q.mode+":"+q.resourceId,q]));
  const allHistory=s.records.slice().sort((a,b)=>b.updatedAt-a.updatedAt||a.attemptId.localeCompare(b.attemptId)).map(r=>{
   const summary=assessmentSummary(r.mode,r.level,r.status,r.assessmentSummary);
   return {title:reqs.get(r.mode+":"+r.resourceId).title,mode:r.mode,level:r.level,status:r.status,updatedAt:r.updatedAt,...(r.status==="started"&&Number.isSafeInteger(r.position)?{position:r.position}:{}),...(summary?{assessmentSummary:summary}:{})};
  });
  return {s,v:{...v,history:allHistory.slice(0,20)},allHistory};
 }
 const encode=s=>{const stateJson=JSON.stringify(s);if(Buffer.byteLength(stateJson)>300000)throw Error("PROGRESS_CAPACITY_REVIEW");return {environment:"private-preview",stateVersion:newId(),stateJson};};
 const view=v=>({status:"ready",currentLevel:v.learning.currentLevel,overallCompleted:v.learning.overallCompleted,overallRequired:v.learning.overallRequired,learningCompleted:v.learning.learningCompleted,buildingCompleted:v.learning.buildingCompleted,quizzesPassed:v.learning.quizzesPassed,challengesPassed:v.learning.challengesPassed,latest:v.learning.latest,history:v.history,levels:v.levels.map(({level,status,completed,required})=>({level,status,completed,required}))});
 async function read(c){
  if(!owner(c))return unavailable();
  try{const p=await policy(),k=key(c.childId),row=await db.get(COLLECTION,k);if(!row)return {status:"not-initialized"};const v=view(decode(row,c,p).v);if(combined){const fresh=await db.get(COLLECTION,k);if(fresh?.stateVersion!==row.stateVersion||fresh.stateJson!==row.stateJson||JSON.stringify(await policy())!==JSON.stringify(p))return unavailable();return {...v,policyVersion:p.version,policyHash,revision:row.stateVersion};}return v;}catch{return unavailable();}
 }
 async function write(c,action,{recheck,authorize,verifyEvidence}={}){
  if(!owner(c)||!progressEnabled(env)||typeof recheck!=="function")return {ok:false,code:"PROGRESS_UNAVAILABLE"};
  try{
   const p=await policy(),k=key(c.childId);
   for(let tries=0;tries<3;tries++){
    const row=await db.get(COLLECTION,k);
    if(!sameChild(c,await recheck()))return {ok:false,code:"STUDENT_AUTH_REQUIRED"};
    let s;
    if(action.kind==="initialize"){
     if(row)return {ok:true,progress:view(decode(row,c,p).v)};
     s={scope,...binding(c),parentId:c.parentId,policyVersion:p.version,policyHash:policyHash,currentLevel:p.initialLevel,levels:levels(c,p.initialLevel),records:[]};
    }else{
     if(!row)return {ok:false,code:"PROGRESS_NOT_INITIALIZED"};
     s=decode(row,c,p).s;
     const req=p.requirements.find(r=>r.resourceId===action.resourceId&&r.mode===action.mode);
     if(!req||!s.levels.find(l=>l.level===req.level)?.allowed)return {ok:false,code:"LEVEL_LOCKED"};
     if(typeof authorize!=="function"||!await authorize(req))return {ok:false,code:"COURSE_UNAVAILABLE"};
     const at=clock();if(!stamp(at))throw Error("INVALID_CLOCK");
     if(action.kind==="checkpoint"){
      if(!learning.includes(req.mode)||!Number.isSafeInteger(action.position)||action.position<1||action.position>req.maxPosition)return {ok:false,code:"INVALID_POSITION"};
      const completed=s.records.some(r=>r.mode===req.mode&&r.resourceId===req.resourceId&&r.status==="completed");
      if(completed)return {ok:true,progress:view(decode(row,c,p).v)};
      const attemptId="checkpoint-"+hash(req.mode+":"+req.resourceId),prior=s.records.find(r=>r.attemptId===attemptId);
      // A stale or concurrent checkpoint never moves the saved position backwards.
      if(prior&&prior.position>=action.position)return {ok:true,progress:view(decode(row,c,p).v)};
      s.records=s.records.filter(r=>r.attemptId!==attemptId);
      s.records.push({...binding(c),committed:true,policyVersion:p.version,attemptId,level:req.level,mode:req.mode,resourceId:req.resourceId,status:"started",position:action.position,updatedAt:at});
      if(s.levels[req.level-1].status==="unlocked")s.levels[req.level-1].status="in-progress";
     }else if(action.kind==="verified-result"){
      // Internal future grader only. The HTTP endpoint never accepts this action.
      if(typeof verifyEvidence!=="function"||!id(action.evidenceId))return {ok:false,code:"EVIDENCE_REQUIRED"};
      const ev=await verifyEvidence({child:c,requirement:req,evidenceId:action.evidenceId,policyVersion:p.version});
      if(ev?.studentId!==c.childId||ev.resourceId!==req.resourceId||ev.mode!==req.mode||ev.policyVersion!==p.version||ev.evidenceId!==action.evidenceId||ev.verified!==true||!(learning.includes(req.mode)?["completed","reference-reviewed"]:["passed","failed"]).includes(ev.status))return {ok:false,code:"EVIDENCE_REQUIRED"};
      const summary=assessmentSummary(req.mode,req.level,ev.status,ev.assessmentSummary);
      const attemptId="result-"+hash(req.mode+":"+action.evidenceId),existing=s.records.find(r=>r.attemptId===attemptId);
      if(existing){if(existing.status!==ev.status||existing.resourceId!==req.resourceId||existing.assessmentSummary!==undefined&&JSON.stringify(existing.assessmentSummary)!==JSON.stringify(summary))return {ok:false,code:"EVIDENCE_CONFLICT"};return {ok:true,progress:view(decode(row,c,p).v)};}
      s.records.push({...binding(c),committed:true,policyVersion:p.version,attemptId,level:req.level,mode:req.mode,resourceId:req.resourceId,status:ev.status,updatedAt:at,...(summary?{assessmentSummary:summary}:{})});
      const needed=p.requirements.filter(r=>r.level===req.level);
      if(needed.every(q=>s.records.some(r=>r.resourceId===q.resourceId&&r.mode===q.mode&&["completed","passed"].includes(r.status)))){
       s.levels[req.level-1].status="completed";
       if(req.level<6&&s.levels[req.level].status==="locked"){s.levels[req.level]={...s.levels[req.level],allowed:true,status:"unlocked"};s.currentLevel=Math.max(s.currentLevel,req.level+1);}
      }else if(s.levels[req.level-1].status==="unlocked")s.levels[req.level-1].status="in-progress";
     }else return {ok:false,code:"INVALID_ACTION"};
     if(!await authorize(req))return {ok:false,code:"COURSE_UNAVAILABLE"};
    }
    if(!sameChild(c,await recheck())||JSON.stringify(await policy())!==JSON.stringify(p))return {ok:false,code:"PROGRESS_CHANGED"};
    if(combined&&action.kind!=="initialize"){const req=p.requirements.find(r=>r.resourceId===action.resourceId&&r.mode===action.mode);if(!req||!await authorize(req)||!sameChild(c,await recheck()))return {ok:false,code:"COURSE_UNAVAILABLE"};}
    const next=encode(s);decode(next,c,p);
    const won=row?await db.replaceIfVersion(COLLECTION,k,row.stateVersion,next):await db.insert(COLLECTION,k,next);
    if(won!==true)continue;
    const saved=await db.get(COLLECTION,k);
    if(saved?.stateVersion!==next.stateVersion||saved.stateJson!==next.stateJson||!sameChild(c,await recheck()))return {ok:false,code:"PROGRESS_UNCONFIRMED"};
    return {ok:true,progress:view(decode(saved,c,p).v)};
   }
   return {ok:false,code:"PROGRESS_CONFLICT"};
  }catch{return {ok:false,code:"PROGRESS_UNAVAILABLE"};}
 }
 async function assessmentRequirement(c,{mode,resourceId,level}){
  if(!owner(c)||!["quiz","challenge"].includes(mode))return null;
  try{
   const p=await policy(),row=await db.get(COLLECTION,key(c.childId));if(!row)return null;
   const {s}=decode(row,c,p);
   const matches=p.requirements.filter(r=>r.mode===mode&&(mode==="quiz"?r.resourceId===resourceId:r.level===level));
   if(matches.length!==1||!s.levels.find(l=>l.level===matches[0].level)?.allowed)return null;
   return {...matches[0],policyVersion:p.version,policyHash:policyHash};
  }catch{return null;}
 }
 // Internal read-only operator projection. Only callers with verified directory ownership may use it.
 async function staffRead(c,{page=1,pageSize=20,mode="all"}={}){
  if(!owner(c)||!Number.isInteger(page)||page<1||page>100||!Number.isInteger(pageSize)||pageSize<1||pageSize>50||!["all",...modes].includes(mode))return unavailable();
  try{
   const p=await policy(),row=await db.get(COLLECTION,key(c.childId));
   if(!row)return {status:"not-initialized"};
   const {v,allHistory}=decode(row,c,p);
   const entries=allHistory.filter(r=>mode==="all"||r.mode===mode);
   const assess=allHistory.filter(r=>["quiz","challenge"].includes(r.mode)&&["passed","failed"].includes(r.status));
   const current=await db.get(COLLECTION,key(c.childId));
   if(current?.stateVersion!==row.stateVersion||current.stateJson!==row.stateJson||JSON.stringify(await policy())!==JSON.stringify(p))return unavailable();
   return {...view(v),attemptCounts:{quiz:assess.filter(r=>r.mode==="quiz").length,challenge:assess.filter(r=>r.mode==="challenge").length,failed:assess.filter(r=>r.status==="failed").length},activity:{page,pageSize,mode,total:entries.length,rows:entries.slice((page-1)*pageSize,page*pageSize)}};
  }catch{return unavailable();}
 }
 return {read,write,assessmentRequirement,staffRead};
}
export async function readJ12345Progress(child,env){
 if(!progressEnabled(env))return unavailable();
 try{createJ12345IdentityEnv(env);return await createProgressRepository({db:createWixStore(env),env}).read(child);}catch{return unavailable();}
}
