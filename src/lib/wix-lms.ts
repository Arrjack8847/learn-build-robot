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
async function call<T>(name:"lmsInitialize"|"lmsDashboard"|"lmsLevelReadiness",schema:z.ZodType<T>,body?:object,signal?:AbortSignal):Promise<T>{
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
