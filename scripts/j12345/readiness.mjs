// Configuration diagnostics only. Never reads student records, runs tests or grants access.
import {isJ12345Preview,createJ12345IdentityEnv} from "./identity-scope.mjs";
import {operatorAccess} from "../j1234/operator-boundary.mjs";
import {attendanceEnabled,attendanceOperatorEnabled} from "../j1234/attendance.mjs";
import {j123InfrastructureStatus} from "../j123/infrastructure.mjs";
import {membershipProcessingEnabled} from "../j123/membership-provider.mjs";
import {progressEnabled} from "./progress.mjs";
import {assessmentEnabled} from "./assessment.mjs";
import {staffLearningEnabled} from "./staff-learning.mjs";
const configured=x=>x?"CONFIGURED":"NOT_CONFIGURED";
export const j12345Labels={
 j12345Identity:"J12345 isolated identity",j12345Profile:"Individual student profile gate",
 j12345Billing:"Membership reconciliation gate",j12345Ledger:"Verified ledger read gate",
 j12345ProviderAcceptance:"Independent sandbox provider acceptance flag",
 j12345Worker:"Independent membership worker configuration",
 j12345Attendance:"Daily student attendance gate",j12345Operator:"Separate test operator capability",
 j12345AttendanceOperator:"Attendance operator gate",j12345Course:"Course feature configuration",
 j12345Progress:"Individual progress configuration",j12345Policy:"Pinned curriculum version and digest configuration",
 j12345Assessment:"Quiz and Final Build configuration",j12345Staff:"Staff learning read gate",
 j12345SessionGate:"One-hour learning session activation gate",j12345LearningEntitlement:"Verified learning-session enforcement",
 j12345Storage:"Verified private PDF storage and origin protection",
 j12345Schema:"Live progress database permissions and persistence",
 j12345StaffAuthorization:"Real staff authorization",j12345Typecheck:"Current integration strict TypeScript evidence",
 j12345Regression:"Combined regression evidence",j12345Build:"Private build and artifact audit evidence",
 j12345Browser:"Browser and device acceptance",j12345Live:"End-to-end live acceptance"
};
export function getJ12345Readiness(env){
 if(!isJ12345Preview(env))return null;
 let identity;
 try{identity=createJ12345IdentityEnv(env);}catch{}
 const isolated=!!identity,profile=isolated&&env.J12345_PROFILE_ENABLED==="1";
 let operator=false,billing=false;
 if(isolated){operator=operatorAccess(new Request("https://fixture.invalid",{headers:{"x-stem-j1234-operator":env.J12345_TEST_OPERATOR_SECRET??""}}),env)===200;billing=membershipProcessingEnabled(env);}
 const key=env.J12345_MEMBERSHIP_WORKER_SECRET;
 const worker=billing&&env.J123_MEMBERSHIP_WORKER_ENABLED==="true"&&typeof key==="string"&&/^[a-f0-9]{64}$/.test(key)&&new Set(Buffer.from(key,"hex")).size>=8&&![env.J123_MEMBERSHIP_WORKER_SECRET,env.J1234_AUTH_ROOT,env.J12345_AUTH_ROOT,env.J1234_TEST_OPERATOR_SECRET,env.J12345_TEST_OPERATOR_SECRET,env.PARENT_AUTH_SECRET,env.STUDENT_AUTH_SECRET,identity?.PARENT_AUTH_SECRET,identity?.STUDENT_AUTH_SECRET].some(v=>typeof v==="string"&&v.toLowerCase()===key);
 const progress=profile&&progressEnabled(env);
 const policy=progress&&/^[a-zA-Z0-9_-]{1,128}$/.test(env.J12345_PROGRESS_POLICY_VERSION??"")&&/^[a-f0-9]{64}$/.test(env.J12345_PROGRESS_POLICY_SHA256??"");
 return {j12345Identity:configured(isolated),j12345Profile:configured(profile),j12345Billing:configured(billing),j12345Ledger:configured(billing&&env.J12345_BILLING_READ_ENABLED==="1"),j12345ProviderAcceptance:configured(isolated&&j123InfrastructureStatus(env).webhookAccepted),j12345Worker:configured(worker),j12345Attendance:configured(profile&&attendanceEnabled(env)),j12345Operator:configured(operator),j12345AttendanceOperator:configured(operator&&attendanceEnabled(env)&&attendanceOperatorEnabled(env)),j12345Course:configured(profile&&env.J12345_COURSE_ENABLED==="1"),j12345Progress:configured(progress),j12345Policy:configured(policy),j12345Assessment:configured(policy&&assessmentEnabled(env)),j12345Staff:configured(operator&&profile&&staffLearningEnabled(env)),j12345SessionGate:configured(profile&&env.J12345_COURSE_ENABLED==="1"&&env.J12345_LEARNING_SESSION_ENABLED==="1"),j12345LearningEntitlement:"NOT_VERIFIED",j12345Storage:"NOT_VERIFIED",j12345Schema:"NOT_VERIFIED",j12345StaffAuthorization:"NOT_VERIFIED",j12345Typecheck:"NOT_VERIFIED",j12345Regression:"NOT_VERIFIED",j12345Build:"NOT_VERIFIED",j12345Browser:"NOT_VERIFIED",j12345Live:"NOT_VERIFIED"};
}
