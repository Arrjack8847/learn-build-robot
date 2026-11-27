import {isJ12345Preview,validJ12345Student} from "./identity-scope.mjs";
import {progressEnabled} from "./progress.mjs";
export const staffLearningEnabled=e=>isJ12345Preview(e)&&e.J12345_STAFF_LEARNING_ENABLED==="1";
export function buildLearningStatistics({env,rows}){
 if(!staffLearningEnabled(env)||!progressEnabled(env))return {coverage:"unavailable",knownStudents:null,notInitialized:null,unknownStudents:null,knownLearningCompleted:null,knownBuildingCompleted:null,knownQuizzesPassed:null,knownChallengesPassed:null,knownQuizAttempts:null,knownChallengeAttempts:null,levelDistribution:null,currentlyLearning:null,completedProjects:null};
 if(!Array.isArray(rows)||rows.length>250||new Set(rows.map(r=>r.studentId)).size!==rows.length||rows.some(r=>!validJ12345Student(r.studentId)))throw Error("INVALID_LEARNING_DIRECTORY");
 const ready=rows.filter(r=>r.progress?.status==="ready").map(r=>r.progress),notInitialized=rows.filter(r=>r.progress?.status==="not-initialized").length,unknown=rows.length-ready.length-notInitialized;
 const num=n=>Number.isSafeInteger(n)&&n>=0;
 if(ready.some(p=>!Number.isInteger(p.currentLevel)||p.currentLevel<1||p.currentLevel>6||![p.learningCompleted,p.buildingCompleted,p.quizzesPassed,p.challengesPassed,p.attemptCounts?.quiz,p.attemptCounts?.challenge].every(num)))throw Error("INVALID_LEARNING_STATISTICS");
 const sum=key=>ready.reduce((s,p)=>s+p[key],0);
 const sumAttempts=key=>ready.reduce((s,p)=>s+p.attemptCounts[key],0);
 return {coverage:unknown?"partial":"complete",knownStudents:ready.length,notInitialized,unknownStudents:unknown,knownLearningCompleted:sum("learningCompleted"),knownBuildingCompleted:sum("buildingCompleted"),knownQuizzesPassed:sum("quizzesPassed"),knownChallengesPassed:sum("challengesPassed"),knownQuizAttempts:sumAttempts("quiz"),knownChallengeAttempts:sumAttempts("challenge"),levelDistribution:Object.fromEntries(Array.from({length:6},(_,i)=>[String(i+1),ready.filter(p=>p.currentLevel===i+1).length])),currentlyLearning:null,completedProjects:null};
}
