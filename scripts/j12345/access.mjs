// Read-only bridge. The J3 ledger and J4 attendance are separate authorities.
import {isJ12345Preview,validJ12345Student} from "./identity-scope.mjs";
import {readJ12345MembershipObservation} from "../j1234/billing-projection.mjs";
import {readAttendanceProjection,localDay} from "../j1234/attendance.mjs";
import {normalizeJ3Membership,evaluateMembership} from "../j5/membership-policy.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {evaluateLearningSession} from "./learning-session.mjs";
const unavailable=()=>({membership:"verification-required",membershipValidUntil:null,membershipEligible:false,attendance:"unavailable",checkInAt:null,learningAccess:"unavailable",reason:"verification-required"});
export function createJ12345AccessReader({storeFactory=createWixStore,readMembership=readJ12345MembershipObservation,readAttendance=readAttendanceProjection,clock=()=>Date.now()}={}){
 return async function readAccess(child,env){
  if(!isJ12345Preview(env)||env.J12345_PROFILE_ENABLED!=="1"||env.J12345_REGISTRATION_ENABLED!=="1"||env.STUDENT_AUTH_ENABLED!=="true"||!validJ12345Student(child?.childId)||!validJ12345Student(child?.parentId)||child.accountStatus!=="preview-test")return unavailable();
  try{
   const db=storeFactory(env),studentId=child.childId,parentId=child.parentId,now=clock();
   const args={env,db,studentId,parentId,now};
   const [m,a]=await Promise.all([readMembership(args),readAttendance(args)]);
   const [m2,a2]=await Promise.all([readMembership(args),readAttendance(args)]);
   const fresh=clock();
   if(!Number.isSafeInteger(fresh)||fresh<now||localDay(fresh)!==localDay(now)||JSON.stringify(m)!==JSON.stringify(m2)||JSON.stringify(a)!==JSON.stringify(a2))return unavailable();
   const membership=evaluateMembership(normalizeJ3Membership({studentId,observation:m2,now}),studentId,fresh);
   if(membership.status==="unavailable")return unavailable();
   let attendance="unavailable",checkInAt=null;
   if(a2?.attendanceStatus==="not_booked"&&a2.bookingId===null)attendance="not-booked";
   else if(a2?.day===localDay(fresh)&&typeof a2.bookingId==="string"){
    if(a2.attendanceStatus==="booked"&&a2.checkInStatus==="not_checked_in"&&a2.visitStatus==="none")attendance="booked";
    if(a2.attendanceStatus==="attended"&&a2.checkInStatus==="checked_in"&&a2.visitStatus==="open"&&Number.isSafeInteger(a2.checkInAt)&&a2.checkInAt<=fresh&&localDay(a2.checkInAt)===localDay(fresh)){attendance="checked-in";checkInAt=a2.checkInAt;}
    if(a2.attendanceStatus==="checked_out"&&a2.checkInStatus==="checked_out"&&a2.visitStatus==="ended")attendance="checked-out";
    if(["no_show","excused"].includes(a2.attendanceStatus))attendance=a2.attendanceStatus.replace("_","-");
   }
   const reason=membership.status==="verification-required"||attendance==="unavailable"?"verification-required":!membership.eligible?"membership-required":attendance!=="checked-in"?"check-in-required":"learning-policy-required";
   // This is a visit window projection, not a course grant. Course and storage gates remain separate.
   const access={membership:membership.status,membershipValidUntil:membership.validUntil,membershipEligible:membership.eligible,attendance,checkInAt,bookingId:a2?.bookingId??null,bookingStartAt:a2?.bookingStartAt??null,bookingEndAt:a2?.bookingEndAt??null,learningAccess:"unavailable",reason};
   return {...access,learningSession:evaluateLearningSession(access,fresh)};
  }catch{return unavailable();}
 };
}
export const readJ12345Access=createJ12345AccessReader();
