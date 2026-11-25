import { z } from "zod";
import { getWixMemberToken } from "./wix-auth";
const count=z.number().int().nonnegative();
const date=z.string().datetime({offset:true});
const profile=z.object({studentCode:z.string(),displayName:z.string(),accountStatus:z.string(),enrolledAt:date,progressVersion:count});
const level=z.object({level:z.number().int().min(1).max(6),status:z.string(),learningCompleted:count,buildingCompleted:count,quizPassed:z.boolean(),challengePassed:z.boolean()});
const attempt=z.object({projectId:z.string(),level:count,passed:z.boolean(),submittedAt:date});
const dashboardSchema=z.object({
  profile,curriculumVersion:z.string(),
  levels:z.array(level).length(6).refine(rows=>new Set(rows.map(r=>r.level)).size===6),
  totals:z.object({learningCompleted:count,buildingCompleted:count,quizAttempts:count,buildChallenges:count,achievements:count}),
  achievements:z.array(z.object({achievementId:z.string(),level:count,awardedAt:date})),
  hasMoreAchievements:z.boolean(),
  recentQuizzes:z.array(attempt.extend({scorePercent:z.number().min(0).max(100)})),
  recentChallenges:z.array(attempt.extend({criteriaMet:count,elapsedSeconds:count,overtimeSeconds:count}))
});
const metric=z.object({required:count,completed:count,satisfied:z.boolean(),remainingProjectIds:z.array(z.string())});
const readinessSchema=z.object({level:count,nextLevel:count.nullable(),policy:z.string(),
  requirements:z.object({learning:metric,building:metric,quizzes:metric,challenge:z.object({satisfied:z.boolean()})}),
  coverage:z.object({quizBanksAvailable:count,quizBanksRequired:count,quizCoverageComplete:z.boolean(),challengeCandidateVariants:count,challengeCoverageVerified:z.boolean()}),
  requirementsMet:z.boolean(),unlockEnabled:z.boolean(),blockers:z.array(z.string())});
export type StudentDashboard=z.infer<typeof dashboardSchema>;
export type LevelReadiness=z.infer<typeof readinessSchema>;
export class LmsError extends Error {
  constructor(public status:number,public code:string){super(code);}
}
// Wix's documented OAuth-authenticated HTTP function gateway.
// Fixed endpoint and operation allowlist: no arbitrary URL or admin credential.
async function call<T>(name:"lmsInitialize"|"lmsDashboard"|"lmsLevelReadiness"|"lmsLearning"|"lmsBuilding"|"lmsProgress"|"lmsQuizStart"|"lmsQuizSubmit",schema:z.ZodType<T>,body?:object,signal?:AbortSignal):Promise<T>{
  const token=await getWixMemberToken();
  if(!token)throw new LmsError(401,"MEMBER_AUTH_REQUIRED");
  const response=await fetch("https://www.wixapis.com/velo/v1/http/invoke/"+name,{
    method:body?"POST":"GET",headers:{Authorization:token,...(body?{"Content-Type":"application/json"}:{})},
    ...(body?{body:JSON.stringify(body)}:{}),credentials:"omit",cache:"no-store",redirect:"error",signal
  });
  const data:unknown=await response.json().catch(()=>null);
  if(!response.ok){
    const code=z.object({error:z.string()}).safeParse(data);
    throw new LmsError(response.status,code.success?code.data.error:"LMS_REQUEST_FAILED");
  }
  const parsed=schema.safeParse(data);
  if(!parsed.success)throw new LmsError(502,"INVALID_LMS_RESPONSE");
  return parsed.data;
}
export async function loadStudentDashboard(signal?:AbortSignal){
  try{return await call("lmsDashboard",dashboardSchema,undefined,signal);}
  catch(error){
    if(!(error instanceof LmsError)||error.status!==404||error.code!=="STUDENT_NOT_INITIALIZED")throw error;
    await call("lmsInitialize",z.object({profile}),{},signal);
    return call("lmsDashboard",dashboardSchema,undefined,signal);
  }
}
export function loadLevelReadiness(level:number,signal?:AbortSignal){
  return call("lmsLevelReadiness",readinessSchema,{level},signal);
}

const activitySchema=z.object({
  projectId:z.string(),level:z.number().int().min(1).max(6),
  mode:z.enum(["learning","building"]),
  status:z.enum(["In progress","Completed","ReferenceReviewed"]),
  progressPercent:z.number().min(0).max(100),
  startedAt:date,completedAt:date.nullable()
});
export type ActivityProgress=z.infer<typeof activitySchema>;
export type ActivityMode=ActivityProgress["mode"];
export const activitySyncEnabled=import.meta.env.VITE_WIX_ACTIVITY_SYNC==="true";
export async function recordActivity(projectId:string,mode:ActivityMode,action:"start"|"complete",signal?:AbortSignal){
  const result=await call(mode==="learning"?"lmsLearning":"lmsBuilding",z.object({activity:activitySchema}),{projectId,action},signal);
  if(result.activity.projectId!==projectId||result.activity.mode!==mode)throw new LmsError(502,"ACTIVITY_MISMATCH");
  return result.activity;
}
export function loadActivityProgress(signal?:AbortSignal){
  return call("lmsProgress",z.object({curriculumVersion:z.string(),activities:z.array(activitySchema)}),undefined,signal);
}

export const quizSyncEnabled=import.meta.env.VITE_WIX_QUIZ_SYNC==="true";
const question=z.object({
  id:z.string(),topic:z.string(),prompt:z.string(),
  choices:z.tuple([z.string(),z.string(),z.string(),z.string()]),
  hint:z.string(),learningSlide:z.number().int().positive(),
  diagram:z.enum(["large-to-small","small-to-large"]).optional()
});
const reviewQuestion=question.extend({correctIndex:z.number().int().min(0).max(3),
  explanation:z.string(),selectedIndex:z.number().int().min(0).max(3)});
const quizResultSchema=z.object({
  projectId:z.string(),correctCount:z.number().int().min(0).max(5),
  questionCount:z.literal(5),scorePercent:z.number().min(0).max(100),
  passed:z.boolean(),submittedAt:date,review:z.array(reviewQuestion).length(5)
}).refine(r=>new Set(r.review.map(q=>q.id)).size===5 &&
  r.review.filter(q=>q.selectedIndex===q.correctIndex).length===r.correctCount &&
  r.scorePercent===r.correctCount*20 && r.passed===(r.correctCount>=4));
const startSchema=z.discriminatedUnion("state",[
  z.object({state:z.literal("started"),requestId:z.string(),projectId:z.string(),
    startedAt:date,questions:z.array(question).length(5).refine(q=>new Set(q.map(x=>x.id)).size===5)}),
  z.object({state:z.literal("submitted"),result:quizResultSchema})
]);
export type ServerQuizQuestion=z.infer<typeof question>;
export type ServerQuizResult=z.infer<typeof quizResultSchema>;
export async function startServerQuiz(projectId:string,requestId:string,signal?:AbortSignal){
  const r=await call("lmsQuizStart",startSchema,{projectId,requestId},signal);
  if(r.state==="started"?(r.projectId!==projectId||r.requestId!==requestId):r.result.projectId!==projectId)
    throw new LmsError(502,"QUIZ_MISMATCH");
  return r;
}
export async function submitServerQuiz(projectId:string,requestId:string,answers:Record<string,number>,signal?:AbortSignal){
  const r=await call("lmsQuizSubmit",quizResultSchema,{projectId,requestId,answers},signal);
  if(r.projectId!==projectId)throw new LmsError(502,"QUIZ_MISMATCH");
  return r;
}
