// Independent J5 Level 1 policy from the approved 26 Nov brief. Not applied to other levels.
export function evaluateLevelOneFinalBuild({startedAt,finishedAt,checks,acknowledgedFinish}){
  // Timestamps must come from committed server attempt transitions, never browser input.
  if(!Number.isSafeInteger(startedAt)||!Number.isSafeInteger(finishedAt)||startedAt<0||finishedAt<startedAt)throw Error("INVALID_CHALLENGE_TIME");
  if(!Array.isArray(checks)||checks.length!==4||checks.some(x=>typeof x!=="boolean")||typeof acknowledgedFinish!=="boolean")throw Error("INVALID_CHALLENGE_ASSESSMENT");
  const elapsedSeconds=Math.ceil((finishedAt-startedAt)/1000),overtimeSeconds=Math.max(0,elapsedSeconds-900),criteriaMet=checks.filter(Boolean).length;
  return {timeLimitSeconds:900,elapsedSeconds,overtimeSeconds,criteriaMet,criteriaRequired:3,criteriaTotal:4,passed:acknowledgedFinish&&criteriaMet>=3,selfReported:true};
}
