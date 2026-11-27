// Server-owned assessment attempts, isolated from browser progress and other students.
import {createHash,randomInt,randomUUID} from "node:crypto";
import {evaluateLevelOneFinalBuild} from "../j5/level-one-final-build.mjs";
import {COLLECTION,createProgressRepository,progressEnabled} from "./progress.mjs";
import {validJ12345Student} from "./identity-scope.mjs";
const hash=x=>createHash("sha256").update(x).digest("hex");
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
const text=x=>typeof x==="string"&&x.trim().length>0&&x.length<=4000;
const stamp=x=>Number.isSafeInteger(x)&&x>0&&x<=8640000000000000;
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fail=code=>({ok:false,code});
const same=(a,b)=>a?.childId===b?.childId&&a?.parentId===b?.parentId&&a?.stateVersion===b?.stateVersion&&b?.accountStatus==="preview-test";
export const assessmentEnabled=e=>progressEnabled(e)&&e.J12345_ASSESSMENT_ENABLED==="1";
const publicQuestion=q=>({id:q.id,prompt:q.prompt,choices:q.choices,hint:q.hint,...(q.diagram?{diagram:q.diagram}:{})});
function quizQuestions(bank,previous=[],pick=randomInt){
 if(!Array.isArray(bank)||bank.length!==10||new Set(bank.map(q=>q.id)).size!==10||bank.some(q=>!id(q.id)||!text(q.topic)||!text(q.prompt)||!text(q.hint)||!text(q.explanation)||!Array.isArray(q.choices)||q.choices.length!==4||q.choices.some(c=>!text(c))||!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>3||!Number.isInteger(q.learningSlide)||q.learningSlide<1))throw Error("QUIZ_UNAVAILABLE");
 const groups=[...new Set(bank.map(q=>q.topic))].map(t=>bank.filter(q=>q.topic===t));
 if(groups.length!==5||groups.some(g=>g.length!==2))throw Error("QUIZ_UNAVAILABLE");
 const selected=groups.map(g=>{const fresh=g.filter(q=>!previous.includes(q.id)),choices=fresh.length?fresh:g;return choices[pick(choices.length)];});
 for(let i=selected.length-1;i>0;i--){const n=pick(i+1);[selected[i],selected[n]]=[selected[n],selected[i]];}
 return selected;
}
function gradeQuiz(questions,answers){
 if(!answers||typeof answers!=="object"||Array.isArray(answers)||Object.keys(answers).length!==5||questions.some(q=>!Object.hasOwn(answers,q.id)||!Number.isInteger(answers[q.id])||answers[q.id]<0||answers[q.id]>3))throw Error("INVALID_ANSWERS");
 const review=questions.map(q=>({...publicQuestion(q),selectedIndex:answers[q.id],correctIndex:q.correctIndex,explanation:q.explanation,learningSlide:q.learningSlide}));
 const correctCount=review.filter(q=>q.correctIndex===q.selectedIndex).length;
 return {correctCount,total:5,passed:correctCount>=4,review};
}
export function evaluateAdvancedChallenge({startedAt,finishedAt,checks,acknowledgedFinish}){
 if(!stamp(startedAt)||!stamp(finishedAt)||finishedAt<startedAt||!Array.isArray(checks)||checks.length!==5||checks.some(x=>typeof x!=="boolean")||typeof acknowledgedFinish!=="boolean")throw Error("INVALID_CHALLENGE");
 const elapsedSeconds=Math.ceil((finishedAt-startedAt)/1000),criteriaMet=checks.filter(Boolean).length;
 return {timeLimitSeconds:900,elapsedSeconds,overtimeSeconds:Math.max(0,elapsedSeconds-900),criteriaMet,criteriaRequired:4,criteriaTotal:5,passed:acknowledgedFinish&&criteriaMet>=4&&finishedAt-startedAt<=900000,selfReported:true};
}
const candidateValid=(c,level)=>c&&id(c.projectId)&&typeof c.variantId==="string"&&/^[a-zA-Z0-9_:-]{1,160}$/.test(c.variantId)&&text(c.title)&&/^\/api\/dev\/j5\/pdf\/pdf-\d{4}$/.test(c.sourceUrl)&&Number.isInteger(c.page)&&c.page>0&&c.crop&&["x","y","width","height"].every(k=>Number.isFinite(c.crop[k])&&c.crop[k]>=0&&c.crop[k]<=1)&&c.crop.width>0&&c.crop.height>0&&c.crop.x+c.crop.width<=1.000001&&c.crop.y+c.crop.height<=1.000001&&Array.isArray(c.checks)&&c.checks.length===(level===1?4:5)&&c.checks.every(text)&&(!c.imageUrl||/^https:\/\/static\.wixstatic\.com\/media\/[A-Za-z0-9_.~-]+$/.test(c.imageUrl));
const view=s=>({attemptId:s.attemptId,mode:s.mode,resourceId:s.resourceId,level:s.level,status:s.status,startedAt:s.startedAt??null,finishedAt:s.finishedAt??null,...(s.mode==="quiz"?{questions:s.questions.map(publicQuestion),answers:s.answers??{}}:{candidate:s.candidate,timeLimitSeconds:900}),...(s.status==="submitted"?{result:s.result}: {})});
export function createAssessmentService({db,env,resolveQuiz,resolveCandidates,clock=Date.now,pick=randomInt,newId=randomUUID}){
 const progress=createProgressRepository({db,env,clock});
 return async function execute(child,input,{recheck,authorize}){
  if(!assessmentEnabled(env)||!validJ12345Student(child?.childId)||!validJ12345Student(child?.parentId)||child.accountStatus!=="preview-test"||typeof recheck!=="function"||typeof authorize!=="function")return fail("ASSESSMENT_UNAVAILABLE");
  try{
   const req=await progress.assessmentRequirement(child,input);
   if(!req)return fail("LEVEL_LOCKED");
   const path=req.mode==="quiz"?"/quiz/"+req.resourceId:"/practical/level-"+req.level+"/final-build";
   const allowed=async()=>same(child,await recheck())&&await authorize(path);
   if(!await allowed())return fail("COURSE_UNAVAILABLE");
   const key="j12345-assessment-v1-"+hash(child.childId+"/"+req.mode+"/"+req.resourceId);
   const scope={studentId:child.childId,parentId:child.parentId,mode:req.mode,resourceId:req.resourceId,level:req.level,policyVersion:req.policyVersion,policyHash:req.policyHash};
   function decode(row){
    if(row?.environment!=="private-preview"||!id(row.stateVersion)||typeof row.stateJson!=="string"||row.stateJson.length>100000)throw Error("INVALID_ATTEMPT");
    const s=JSON.parse(row.stateJson);
    if(Object.entries(scope).some(([k,v])=>s[k]!==v)||!id(s.attemptId)||!id(s.requestId)||!["selected","started","finished","submitted"].includes(s.status))throw Error("INVALID_ATTEMPT");
    if(s.mode==="quiz"){
     if(!Array.isArray(s.questions)||s.questions.length!==5||!["started","submitted"].includes(s.status)||!stamp(s.startedAt))throw Error("INVALID_ATTEMPT");
     if(s.status==="submitted"&&!equal(s.result,gradeQuiz(s.questions,s.answers)))throw Error("INVALID_ATTEMPT");
    }else{
     if(!candidateValid(s.candidate,s.level)||s.status!=="selected"&&!stamp(s.startedAt)||["finished","submitted"].includes(s.status)&&(!stamp(s.finishedAt)||s.finishedAt<s.startedAt||typeof s.acknowledgedFinish!=="boolean"))throw Error("INVALID_ATTEMPT");
     if(s.status==="submitted"){const grade=s.level===1?evaluateLevelOneFinalBuild:evaluateAdvancedChallenge;if(!equal(s.result,grade(s)))throw Error("INVALID_ATTEMPT");}
    }
    return s;
   }
   async function commitResult(s){
    if(s.status!=="submitted")return {ok:true,attempt:view(s)};
    // Attempt is written first. Replaying Resume or Submit retries the exact same
    // immutable evidence into the progress CAS; a new draw cannot discard pending evidence.
    const result=await progress.write(child,{kind:"verified-result",mode:req.mode,resourceId:req.resourceId,evidenceId:s.attemptId},{
     recheck,authorize:async r=>r.mode===req.mode&&r.resourceId===req.resourceId&&await allowed(),
     verifyEvidence:async({child:bound,requirement,evidenceId,policyVersion})=>{
      const stored=decode(await db.get(COLLECTION,key));
      if(bound.childId!==child.childId||requirement.resourceId!==req.resourceId||stored.attemptId!==evidenceId||stored.status!=="submitted"||stored.policyVersion!==policyVersion||!equal(stored.result,s.result))return null;
      const r=stored.result;
      const assessmentSummary=req.mode==="quiz"?{correctCount:r.correctCount,total:5}:{criteriaMet:r.criteriaMet,criteriaTotal:r.criteriaTotal,elapsedSeconds:r.elapsedSeconds,overtimeSeconds:r.overtimeSeconds,selfReported:true,acknowledgedFinish:stored.acknowledgedFinish};
      return {studentId:child.childId,resourceId:req.resourceId,mode:req.mode,evidenceId,policyVersion,verified:true,status:r.passed?"passed":"failed",assessmentSummary};
     }
    });
    return result.ok?{ok:true,attempt:view(s),progressSaved:true}: {ok:true,attempt:view(s),progressSaved:false};
   }
   for(let n=0;n<3;n++){
    const row=await db.get(COLLECTION,key),old=row?decode(row):null;
    if(!await allowed())return fail("COURSE_UNAVAILABLE");
    if(input.action==="resume")return old?commitResult(old):{ok:true,attempt:null};
    let s;
    if(input.action==="discover"){
     if(old?.requestId===input.requestId)return commitResult(old);
     if(old&&old.status!=="submitted")return fail("ATTEMPT_IN_PROGRESS");
     if(old?.status==="submitted"&&!(await commitResult(old)).progressSaved)return fail("RESULT_SAVE_PENDING");
     if(!id(input.requestId))return fail("INVALID_INPUT");
     s={...scope,attemptId:newId(),requestId:input.requestId,status:req.mode==="quiz"?"started":"selected"};
     if(req.mode==="quiz"){
      const bank=await resolveQuiz(req.resourceId,req.level);
      s.questions=quizQuestions(bank,old?.questions?.map(q=>q.id)??[],pick);s.answers={};s.startedAt=clock();
     }else{
      const pool=(await resolveCandidates(req.level,req)).filter(c=>candidateValid(c,req.level));
      const projects=[...new Set(pool.map(c=>c.projectId))];
      if(!projects.length)return fail("CHALLENGE_POOL_NOT_READY");
      if(input.retry==="same"&&(!old||old.mode!=="challenge"))return fail("INVALID_RETRY");
      if(input.retry==="same"){const c=pool.find(c=>c.projectId===old.candidate.projectId&&c.variantId===old.candidate.variantId&&equal(c,old.candidate));if(!c)return fail("CHALLENGE_POOL_NOT_READY");s.candidate=c;}
      else{const fresh=projects.filter(p=>p!==old?.candidate?.projectId),choices=old&&fresh.length?fresh:projects,p=choices[pick(choices.length)],variants=pool.filter(c=>c.projectId===p);s.candidate=variants[pick(variants.length)];}
     }
    }else{
     if(!old||old.attemptId!==input.attemptId)return fail("ATTEMPT_NOT_FOUND");
     if(old.status==="submitted"){
      if(input.action==="submit"&&(old.mode==="quiz"?equal(old.answers,input.answers):equal(old.checks,input.checks)))return commitResult(old);
      return fail("ATTEMPT_ALREADY_SUBMITTED");
     }
     s=structuredClone(old);
     if(req.mode==="quiz"){
      if(input.action==="answer"){
       if(s.status!=="started"||!s.questions.some(q=>q.id===input.questionId)||!Number.isInteger(input.choice)||input.choice<0||input.choice>3)return fail("INVALID_ANSWERS");
       s.answers[input.questionId]=input.choice;
      }else if(input.action==="submit"){s.result=gradeQuiz(s.questions,input.answers);s.answers=input.answers;s.finishedAt=clock();s.status="submitted";}
      else return fail("INVALID_ACTION");
     }else if(input.action==="start"){
      if(s.status==="started")return {ok:true,attempt:view(s)};
      if(s.status!=="selected"||input.referenceReady!==true)return fail("REFERENCE_REQUIRED");
      // Browser can confirm a visible reference, not attest independent physical inspection.
      s.startedAt=clock();s.status="started";
     }else if(input.action==="finish"){
      if(s.status==="finished")return {ok:true,attempt:view(s)};
      if(s.status!=="started"||typeof input.acknowledgedFinish!=="boolean")return fail("INVALID_ACTION");
      s.finishedAt=clock();s.acknowledgedFinish=input.acknowledgedFinish;s.status="finished";
     }else if(input.action==="submit"){
      if(s.status!=="finished")return fail("INVALID_ACTION");
      s.checks=input.checks;
      s.result=(req.level===1?evaluateLevelOneFinalBuild:evaluateAdvancedChallenge)(s);s.status="submitted";
     }else return fail("INVALID_ACTION");
    }
    const fresh=await progress.assessmentRequirement(child,input);
    if(!equal(fresh,req)||!await allowed())return fail("COURSE_UNAVAILABLE");
    const next={environment:"private-preview",stateVersion:newId(),stateJson:JSON.stringify(s)};decode(next);
    const won=row?await db.replaceIfVersion(COLLECTION,key,row.stateVersion,next):await db.insert(COLLECTION,key,next);
    if(won!==true)continue;
    const saved=await db.get(COLLECTION,key);
    if(saved?.stateVersion!==next.stateVersion||saved.stateJson!==next.stateJson||!await allowed())return fail("ATTEMPT_UNCONFIRMED");
    return commitResult(decode(saved));
   }
   return fail("ATTEMPT_CONFLICT");
  }catch{return fail("ASSESSMENT_UNAVAILABLE");}
 };
}
