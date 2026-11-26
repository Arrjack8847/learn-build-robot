// J5 independent check-in boundary, not a code issuing or booking service.
export function createCheckInBoundary({resolveStudent,redeemAtomic,clock}){
 const denied=(status,code)=>({ok:false,status,code});
 const validId=x=>typeof x==="string"&&/^[A-Za-z0-9_-]{1,128}$/.test(x);
 // A trusted HTTP transport must enforce same-origin POST, bounded body and abuse controls.
 // The booking adapter owns rate reservation BEFORE lookup, code comparison, atomic
 // attendance/pass issuance, expiry, membership recheck and reissue/checkout revocation.
 async function verify(request,env,input){
  if(env?.VERCEL_ENV!=="preview"||env?.VERCEL_TARGET_ENV==="production")return denied(403,"PRIVATE_PREVIEW_ONLY");
  if(request?.method!=="POST"||request?.sameOrigin!==true)return denied(403,"REQUEST_REFUSED");
  if(!input||typeof input!=="object"||Array.isArray(input)||Object.keys(input).length!==1||typeof input.code!=="string"||!/^\d{8}$/.test(input.code))return denied(400,"CHECK_IN_REFUSED");
  try{
   const s=await resolveStudent(request,env);
   if(s?.role!=="student"||s.environment!=="private-preview"||!validId(s.studentId))return denied(401,"STUDENT_AUTH_REQUIRED");
   if(typeof redeemAtomic!=="function")return denied(503,"CHECK_IN_UNAVAILABLE");
   // No client identity, expiry, booking, or membership is accepted.
   const r=await redeemAtomic({studentId:s.studentId,code:input.code,environment:"private-preview",request});
   if(r?.ok!==true)return denied(403,"CHECK_IN_REFUSED");
   const now=clock.now();
   if(r.studentId!==s.studentId||r.environment!=="private-preview"||r.attendanceCommitted!==true||r.accessStatus!=="verified"||!validId(r.bookingId)||!Number.isSafeInteger(now)||!Number.isSafeInteger(r.validUntil)||r.validUntil<=now)return denied(403,"CHECK_IN_REFUSED");
   const again=await resolveStudent(request,env);
   if(again?.role!=="student"||again.environment!=="private-preview"||again.studentId!==s.studentId)return denied(401,"STUDENT_AUTH_REQUIRED");
   // No code, internal booking ID, raw pass, or payment details in response.
   return {ok:true,status:200,code:"CHECK_IN_VERIFIED",validUntil:r.validUntil};
  }catch{return denied(503,"CHECK_IN_UNAVAILABLE");}
 }
 return {verify};
}
