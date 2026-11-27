// Approved booked-hour policy. No grace, rolling countdown, or inferred legacy slots.
export const LEARNING_SESSION_MS=60*60*1000;
const DAY=24*60*60*1000,MYT=8*60*60*1000;
const stamp=n=>Number.isSafeInteger(n)&&n>0&&n<=8640000000000000-DAY;
export function validBookedHour(start,end){
 return stamp(start)&&stamp(end)&&(start+MYT)%LEARNING_SESSION_MS===0&&end-start===LEARNING_SESSION_MS&&Math.floor((start+MYT)/DAY)===Math.floor((end-1+MYT)/DAY);
}
export function currentBookedHour(now){
 if(!stamp(now))throw Error("INVALID_BOOKING_TIME");
 const start=Math.floor((now+MYT)/LEARNING_SESSION_MS)*LEARNING_SESSION_MS-MYT;
 return {bookingStartAt:start,bookingEndAt:start+LEARNING_SESSION_MS};
}
export function evaluateLearningSession(access,now){
 const deny=(status,endsAt=null)=>({status,endsAt});
 if(!stamp(now)||!access||access.reason==="verification-required")return deny("unavailable");
 if(access.membershipEligible!==true||access.membership!=="active")return deny("membership-required");
 if(access.attendance!=="checked-in")return deny("check-in-required");
 const {bookingId,bookingStartAt:start,bookingEndAt:end,checkInAt:checkIn,membershipValidUntil:memberEnd}=access;
 if(typeof bookingId!=="string"||!bookingId||!validBookedHour(start,end)||!stamp(checkIn)||!stamp(memberEnd)||checkIn<start||checkIn>=end||checkIn>now)return deny("unavailable");
 const deadline=Math.min(end,memberEnd);
 if(deadline<=checkIn)return deny("unavailable");
 if(now>=deadline)return deny("expired",deadline);
 return {status:"eligible",endsAt:deadline};
}
