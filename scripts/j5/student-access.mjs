import {evaluateMembership} from "./membership-policy.mjs";
// J5 isolated server-only authorization foundation. No live adapters or HTTP mounts.
export function createStudentAccess({resolveStudent,readProfile,readMembership,readCheckIn,resolveActivity,readLevelAccess,clock}){
  const deny=(status,code)=>({ok:false,status,code});
  const validId=v=>typeof v==="string"&&/^[A-Za-z0-9_-]{1,128}$/.test(v);
  const instant=v=>typeof v==="number"&&Number.isFinite(v);
  async function identity(request,env){
    if(env?.VERCEL_ENV!=="preview"||env?.VERCEL_TARGET_ENV==="production")return deny(403,"PRIVATE_PREVIEW_ONLY");
    const s=await resolveStudent(request,env);
    if(s?.role!=="student"||s.environment!=="private-preview"||!validId(s.studentId))return deny(401,"STUDENT_AUTH_REQUIRED");
    const p=await readProfile(s.studentId);
    if(p?.studentId!==s.studentId||p.environment!=="private-preview"||p.accountStatus!=="active")return deny(403,"STUDENT_UNAVAILABLE");
    return {ok:true,studentId:s.studentId,profile:p};
  }
  async function loadProfile(request,env){
    try{
      const i=await identity(request,env);if(!i.ok)return i;
      const p=i.profile,m=await readMembership(i.studentId);
      const s=await resolveStudent(request,env);
      if(s?.role!=="student"||s.environment!=="private-preview"||s.studentId!==i.studentId)return deny(401,"STUDENT_AUTH_REQUIRED");
      const now=clock.now();if(!instant(now))return deny(503,"SERVICE_UNAVAILABLE");
      const membership=evaluateMembership(m,i.studentId,now);
      if(membership.status==="unavailable")return deny(503,"MEMBERSHIP_UNAVAILABLE");
      if(typeof p.displayName!=="string"||!p.displayName.trim()||typeof p.studentCode!=="string"||!p.studentCode.trim())return deny(503,"PROFILE_UNAVAILABLE");
      // Public-facing projection only; no parent identifiers, credentials, or database row IDs.
      return {ok:true,profile:{displayName:p.displayName,studentCode:p.studentCode,accountStatus:p.accountStatus,membershipStatus:membership.status}};
    }catch{return deny(503,"SERVICE_UNAVAILABLE");}
  }
  async function authorize(request,env,activityId){
    try{
      const i=await identity(request,env);if(!i.ok)return i;
      if(!validId(activityId))return deny(404,"ACTIVITY_UNAVAILABLE");
      const a=await resolveActivity(activityId);
      if(a?.activityId!==activityId||!Number.isInteger(a.level)||a.level<1||a.level>6||typeof a.checkInRequired!=="boolean")return deny(404,"ACTIVITY_UNAVAILABLE");
      const now=clock.now();if(!instant(now))return deny(503,"SERVICE_UNAVAILABLE");
      const m=await readMembership(i.studentId);
      if(!evaluateMembership(m,i.studentId,now).eligible)return deny(403,"MEMBERSHIP_REQUIRED");
      let c=null;
      if(a.checkInRequired){
        c=await readCheckIn(i.studentId);
        if(c?.studentId!==i.studentId||c.environment!=="private-preview"||c.status!=="verified"||!validId(c.bookingId)||!instant(c.validFrom)||!instant(c.validUntil)||c.validFrom>=c.validUntil||now<c.validFrom||now>=c.validUntil||c.revoked!==false)return deny(403,"CHECK_IN_REQUIRED");
      }
      const l=await readLevelAccess(i.studentId,a.level);
      if(l?.studentId!==i.studentId||l.environment!=="private-preview"||l.level!==a.level||l.allowed!==true)return deny(403,"LEVEL_LOCKED");
      // Re-resolve session after asynchronous reads. Adapters must perform transactional checks
      // for protected writes and authorize every subsequent request; this is not a bearer pass.
      const s=await resolveStudent(request,env);
      if(s?.role!=="student"||s.environment!=="private-preview"||s.studentId!==i.studentId)return deny(401,"STUDENT_AUTH_REQUIRED");
      const finalNow=clock.now();
      if(!evaluateMembership(m,i.studentId,finalNow).eligible)return deny(403,"MEMBERSHIP_REQUIRED");
      if(a.checkInRequired&&(!instant(finalNow)||finalNow<c.validFrom||finalNow>=c.validUntil))return deny(403,"CHECK_IN_REQUIRED");
      return {ok:true,studentId:i.studentId,activityId,level:a.level};
    }catch{return deny(503,"SERVICE_UNAVAILABLE");}
  }
  return {loadProfile,authorize};
}
