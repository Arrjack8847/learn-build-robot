// N1 user-approved policies. Only Asia/Kuala_Lumpur business dates are supported.
export const HOUR=3600000,DAY=24*HOUR,MYT=8*HOUR;
export const POLICY=Object.freeze({
 timeZone:"Asia/Kuala_Lumpur",openHours:Object.freeze([10,11,13,14,15,16,17,19,20,21]),
 activities:Object.freeze(["robotics","drone"]),capacityPerActivity:5,advanceDays:7,maxUpcoming:7,maxDaily:1,
 cancellationNoticeMs:2*HOUR,unpaidHoldMs:24*HOUR,offerMs:30*60000,depositMinor:5000,
 noShowsBeforeDeposit:2,graceMs:0
});
const validNow=x=>Number.isSafeInteger(x)&&x>=0&&x<8640000000000000-10*DAY;
export function businessDay(now){if(!validNow(now))throw Error("INVALID_TIME");return new Date(now+MYT).toISOString().slice(0,10);}
export function dayStart(day){
 if(typeof day!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(day))throw Error("INVALID_DAY");
 const t=Date.parse(day+"T00:00:00+08:00");
 if(!validNow(t)||businessDay(t)!==day)throw Error("INVALID_DAY");
 return t;
}
export function slot(day,hour,activity){
 if(!POLICY.openHours.includes(hour)||!POLICY.activities.includes(activity))throw Error("INVALID_SLOT");
 const startAt=dayStart(day)+hour*HOUR;
 return {day,activity,startAt,endAt:startAt+HOUR};
}
export function bookableDay(day,now){
 const start=dayStart(day),today=dayStart(businessDay(now));
 return start>=today&&start<=today+POLICY.advanceDays*DAY;
}
export function canBookSlot(s,now,{walkIn=false,closedDays=[]}={}){
 try{
  const start=dayStart(s.day),hour=(s.startAt-start)/HOUR,expected=slot(s.day,hour,s.activity);
  return expected.endAt===s.endAt&&bookableDay(s.day,now)&&!closedDays.includes(s.day)&&
   (walkIn?s.startAt<=now&&now<s.endAt:s.startAt>now);
 }catch{return false;}
}
export function canCancel(startAt,now){return validNow(now)&&validNow(startAt)&&startAt-now>=POLICY.cancellationNoticeMs;}
