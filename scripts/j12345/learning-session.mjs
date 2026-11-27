// Owner-approved maximum one-hour visit policy. No browser clock or renewal input.
export const LEARNING_SESSION_MS=60*60*1000;
const DAY=24*60*60*1000,MYT=8*60*60*1000;
const stamp=n=>Number.isSafeInteger(n)&&n>0&&n<=8640000000000000-DAY;
export function evaluateLearningSession(access,now){
 const deny=(status,endsAt=null)=>({status,endsAt});
 if(!stamp(now)||!access||access.reason==="verification-required")return deny("unavailable");
 if(access.membershipEligible!==true||access.membership!=="active")return deny("membership-required");
 if(access.attendance!=="checked-in")return deny("check-in-required");
 const start=access.checkInAt,memberEnd=access.membershipValidUntil;
 if(!stamp(start)||!stamp(memberEnd)||start>now)return deny("unavailable");
 const midnight=(Math.floor((start+MYT)/DAY)+1)*DAY-MYT;
 const end=Math.min(start+LEARNING_SESSION_MS,memberEnd,midnight);
 if(end<=start)return deny("unavailable");
 if(now>=end)return deny("expired",end);
 return {status:"eligible",endsAt:end};
}
