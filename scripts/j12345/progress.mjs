// Server-only individual progress aggregate. Browser checkpoints are not completion evidence.
import {createHash,randomUUID} from "node:crypto";
import {isJ12345Preview,validJ12345Student,createJ12345IdentityEnv} from "./identity-scope.mjs";
import {projectCommittedProgress} from "../j5/committed-progress.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
export const COLLECTION="J12345LearningProgress",POLICY_KEY="j12345-approved-curriculum-v1";
const scope="j12345-progress-v1",hash=x=>createHash("sha256").update(x).digest("hex");
const key=id=>scope+"-"+hash(id);
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
const stamp=x=>Number.isSafeInteger(x)&&x>0&&x<=8640000000000000;
const modes=["learning","building","quiz","challenge"],learning=["learning","building"];
const unavailable=()=>({status:"unavailable"});
export const progressEnabled=e=>isJ12345Preview(e)&&e.J12345_PROGRESS_ENABLED==="1"&&e.J12345_PROFILE_ENABLED==="1"&&e.J12345_REGISTRATION_ENABLED==="1"&&e.STUDENT_AUTH_ENABLED==="true";
const owner=c=>validJ12345Student(c?.childId)&&validJ12345Student(c.parentId)&&c.accountStatus==="preview-test"&&typeof c.stateVersion==="string"&&!!c.stateVersion;
const sameChild=(a,b)=>owner(a)&&owner(b)&&a.childId===b.childId&&a.parentId===b.parentId&&a.stateVersion===b.stateVersion;
const binding=c=>({studentId:c.childId,environment:"private-preview"});
function levels(c,initial){return Array.from({length:6},(_,i)=>({...binding(c),level:i+1,allowed:i+1===initial,status:i+1===initial?"unlocked":"locked"}));}
function validatePolicy(p){
 if(p?.approved!==true||!id(p.version)||p.initialLevel!==1||p.progression!=="all-required-and-final-build-v1"||!Array.isArray(p.requirements)||p.requirements.length>2000)return false;
 if(p.requirements.some(r=>!r||!modes.includes(r.mode)||!id(r.resourceId)||!Number.isInteger(r.level)||r.level<1||r.level>6||typeof r.title!=="string"||!r.title.trim()||r.title.length>160||learning.includes(r.mode)&&(!Number.isSafeInteger(r.maxPosition)||r.maxPosition<1||r.maxPosition>10000)))return false;
 if(new Set(p.requirements.map(r=>r.mode+":"+r.resourceId)).size!==p.requirements.length)return false;
 return Array.from({length:6},(_,i)=>i+1).every(l=>p.requirements.some(r=>r.level===l&&r.mode==="challenge")&&p.requirements.some(r=>r.level===l&&r.mode==="learning")&&p.requirements.some(r=>r.level===l&&r.mode==="building"));
}
export function createProgressRepository({db,env,clock=Date.now,newId=randomUUID}){
 async function policy(){
  if(!progressEnabled(env)||!id(env.J12345_PROGRESS_POLICY_VERSION)||! /^[a-f0-9]{64}$/.test(env.J12345_PROGRESS_POLICY_SHA256??""))throw Error("POLICY_UNAVAILABLE");
  const row=await db.get(COLLECTION,POLICY_KEY);
  if(row?.environment!=="private-preview"||typeof row.stateVersion!=="string"||typeof row.stateJson!=="string"||hash(row.stateJson)!==env.J12345_PROGRESS_POLICY_SHA256)throw Error("POLICY_UNAVAILABLE");
  const p=JSON.parse(row.stateJson);
  if(!validatePolicy(p)||p.version!==env.J12345_PROGRESS_POLICY_VERSION)throw Error("POLICY_UNAVAILABLE");
  return p;
 }
 function decode(row,c,p){
  if(row?.environment!=="private-preview"||!id(row.stateVersion)||typeof row.stateJson!=="string"||Buffer.byteLength(row.stateJson)>300000)throw Error("INVALID_PROGRESS_ROW");
  const s=JSON.parse(row.stateJson);
  if(s.scope!==scope||s.studentId!==c.childId||s.parentId!==c.parentId||s.policyVersion!==p.version||s.policyHash!==env.J12345_PROGRESS_POLICY_SHA256||!Array.isArray(s.records)||s.records.length>2000)throw Error("INVALID_PROGRESS_ROW");
  const v=projectCommittedProgress({studentId:c.childId,policy:p,records:s.records,levelStates:s.levels,currentLevel:s.currentLevel,now:clock()});
  if(!v.ok)throw Error(v.code);
  const ordered=v.levels;
  const highest=ordered.filter(l=>l.allowed).at(-1)?.level;
  if(highest!==s.currentLevel||ordered.some(l=>l.level<s.currentLevel&&l.status!=="completed"||l.level>s.currentLevel&&l.status!=="locked"))throw Error("INVALID_LEVEL_SEQUENCE");
  const reqs=new Map(p.requirements.map(q=>[q.mode+":"+q.resourceId,q]));
  const history=s.records.slice().sort((a,b)=>b.updatedAt-a.updatedAt).slice(0,20).map(r=>({title:reqs.get(r.mode+":"+r.resourceId).title,mode:r.mode,level:r.level,status:r.status,updatedAt:r.updatedAt,...(r.status==="started"&&Number.isSafeInteger(r.position)?{position:r.position}:{})}));
  return {s,v:{...v,history}};
 }
 const encode=s=>{const stateJson=JSON.stringify(s);if(Buffer.byteLength(stateJson)>300000)throw Error("PROGRESS_CAPACITY_REVIEW");return {environment:"private-preview",stateVersion:newId(),stateJson};};
 const view=v=>({status:"ready",currentLevel:v.learning.currentLevel,overallCompleted:v.learning.overallCompleted,overallRequired:v.learning.overallRequired,learningCompleted:v.learning.learningCompleted,buildingCompleted:v.learning.buildingCompleted,quizzesPassed:v.learning.quizzesPassed,challengesPassed:v.learning.challengesPassed,latest:v.learning.latest,history:v.history,levels:v.levels.map(({level,status,completed,required})=>({level,status,completed,required}))});
 async function read(c){
  if(!owner(c))return unavailable();
  try{const p=await policy(),row=await db.get(COLLECTION,key(c.childId));if(!row)return {status:"not-initialized"};return view(decode(row,c,p).v);}catch{return unavailable();}
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
     s={scope,...binding(c),parentId:c.parentId,policyVersion:p.version,policyHash:env.J12345_PROGRESS_POLICY_SHA256,currentLevel:p.initialLevel,levels:levels(c,p.initialLevel),records:[]};
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
      const attemptId="result-"+hash(req.mode+":"+action.evidenceId),existing=s.records.find(r=>r.attemptId===attemptId);
      if(existing){if(existing.status!==ev.status||existing.resourceId!==req.resourceId)return {ok:false,code:"EVIDENCE_CONFLICT"};return {ok:true,progress:view(decode(row,c,p).v)};}
      s.records.push({...binding(c),committed:true,policyVersion:p.version,attemptId,level:req.level,mode:req.mode,resourceId:req.resourceId,status:ev.status,updatedAt:at});
      const needed=p.requirements.filter(r=>r.level===req.level);
      if(needed.every(q=>s.records.some(r=>r.resourceId===q.resourceId&&r.mode===q.mode&&["completed","passed"].includes(r.status)))){
       s.levels[req.level-1].status="completed";
       if(req.level<6&&s.levels[req.level].status==="locked"){s.levels[req.level]={...s.levels[req.level],allowed:true,status:"unlocked"};s.currentLevel=Math.max(s.currentLevel,req.level+1);}
      }else if(s.levels[req.level-1].status==="unlocked")s.levels[req.level-1].status="in-progress";
     }else return {ok:false,code:"INVALID_ACTION"};
     if(!await authorize(req))return {ok:false,code:"COURSE_UNAVAILABLE"};
    }
    if(!sameChild(c,await recheck())||JSON.stringify(await policy())!==JSON.stringify(p))return {ok:false,code:"PROGRESS_CHANGED"};
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
 return {read,write};
}
export async function readJ12345Progress(child,env){
 if(!progressEnabled(env))return unavailable();
 try{createJ12345IdentityEnv(env);return await createProgressRepository({db:createWixStore(env),env}).read(child);}catch{return unavailable();}
}
