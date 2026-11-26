import {evaluateMembership} from "./membership-policy.mjs";

// Adapter contract only. The reviewed booking authority owns code issuance,
// durable attempt reservations, atomic attendance/pass writes and revocation.
export function createCheckInService({resolveStudent,readSnapshot,authority,clock}) {
 const fail=(status,code)=>({ok:false,status,code});
 const refused=()=>fail(403,"CHECK_IN_REFUSED");
 const unavailable=()=>fail(503,"CHECK_IN_UNAVAILABLE");
 const id=x=>typeof x==="string"&&/^[A-Za-z0-9_-]{1,128}$/.test(x);
 const stamp=x=>Number.isSafeInteger(x)&&x>=0&&x<=8640000000000000;
 const matches=(row,studentId)=>row?.studentId===studentId&&row.environment==="private-preview";
 const identity=(s)=>s?.role==="student"&&s.environment==="private-preview"&&id(s.studentId);
 async function verify(wrapper,env,input) {
  if(env?.VERCEL_ENV!=="preview"||env?.VERCEL_TARGET_ENV==="production")return fail(403,"PRIVATE_PREVIEW_ONLY");
  if(wrapper?.method!=="POST"||wrapper.sameOrigin!==true||!wrapper.originalRequest)return refused();
  if(!input||typeof input!=="object"||Array.isArray(input)||Object.keys(input).length!==1||typeof input.code!=="string"||!/^\d{8}$/.test(input.code))return fail(400,"CHECK_IN_REFUSED");
  try {
   const request=wrapper.originalRequest;
   const s=await resolveStudent(request,env);
   if(!identity(s))return fail(401,"STUDENT_AUTH_REQUIRED");
   const studentId=s.studentId;
   if(typeof authority?.reserveAttempt!=="function"||typeof authority?.redeemAtomic!=="function"||typeof authority?.readCurrentAccess!=="function")return unavailable();
   const snapshot=await readSnapshot(studentId);
   if(!matches(snapshot,studentId)||!matches(snapshot.profile,studentId)||snapshot.profile.accountStatus!=="active")return refused();
   if(!evaluateMembership(snapshot.membership,studentId,clock.now()).eligible)return refused();
   // Reservation is durable, student-bound, and made BEFORE any code lookup.
   // No code is sent to the reservation operation. The authority determines limits.
   const reserved=await authority.reserveAttempt({studentId,environment:"private-preview",request});
   if(reserved?.ok!==true)return refused();
   if(!matches(reserved,studentId)||!id(reserved.reservationId))return unavailable();
   const again=await resolveStudent(request,env);
   if(!identity(again)||again.studentId!==studentId)return fail(401,"STUDENT_AUTH_REQUIRED");
   // Provider MUST consume the reservation once and recheck membership, session,
   // booking, local day/hour, code and revocation within its atomic transaction.
   const result=await authority.redeemAtomic({studentId,environment:"private-preview",reservationId:reserved.reservationId,code:input.code,request});
   if(result?.ok!==true)return refused();
   if(!matches(result,studentId)||result.reservationId!==reserved.reservationId||result.membershipVerified!==true||result.attendanceCommitted!==true||result.reservationConsumed!==true||result.accessStatus!=="verified"||!id(result.bookingId)||!id(result.accessVersion)||!stamp(result.validUntil))return refused();
   const current=await authority.readCurrentAccess({studentId,environment:"private-preview",bookingId:result.bookingId,request});
   const finalSnapshot=await readSnapshot(studentId);
   const last=await resolveStudent(request,env);
   if(!identity(last)||last.studentId!==studentId)return fail(401,"STUDENT_AUTH_REQUIRED");
   const now=clock.now();
   if(!matches(finalSnapshot,studentId)||!matches(finalSnapshot.profile,studentId)||finalSnapshot.profile.accountStatus!=="active"||!evaluateMembership(finalSnapshot.membership,studentId,now).eligible)return refused();
   if(!matches(current,studentId)||current.bookingId!==result.bookingId||current.accessVersion!==result.accessVersion||current.status!=="verified"||current.revoked!==false||!stamp(current.validFrom)||current.validUntil!==result.validUntil||!stamp(now)||now<current.validFrom||now>=result.validUntil)return refused();
   return {ok:true,status:200,code:"CHECK_IN_VERIFIED",validUntil:result.validUntil};
  } catch {return unavailable();}
 }
 return {verify};
}
