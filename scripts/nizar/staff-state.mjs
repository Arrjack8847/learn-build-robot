// N5 canonical audit records; same CAS transaction as the booking transition.
import {isChildId} from "./contract.mjs";
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{16,128}$/.test(x);
const hash=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const time=x=>Number.isSafeInteger(x)&&x>0;
export const staffAudit=s=>s.n5??[];
export function validateN5(s){
 const rows=staffAudit(s),keys=["key","fingerprint","bookingId","childId","actorId","kind","at","revision","reason"];
 if(!Array.isArray(rows)||rows.length>2000||new Set(rows.map(a=>a.key)).size!==rows.length)throw Error("INVALID_STAFF_AUDIT");
 const seen=new Map();
 for(const a of rows){
  if(!a||Object.keys(a).length!==keys.length||!keys.every(k=>Object.hasOwn(a,k))||!hash(a.key)||!hash(a.fingerprint)||!id(a.bookingId)||!isChildId(a.childId)||!id(a.actorId)||!id(a.revision)||!time(a.at)||!["walk-in","manual-attendance","verified-check-in","checkout"].includes(a.kind)||typeof a.reason!=="string"||a.reason.length>300||a.reason.trim()!==a.reason||a.kind!=="verified-check-in"&&a.reason.length<3)throw Error("INVALID_STAFF_AUDIT");
  const b=s.bookings.find(b=>b.bookingId===a.bookingId&&b.childId===a.childId);
  if(!b||a.at<b.createdAt)throw Error("ORPHAN_STAFF_AUDIT");
  const prev=seen.get(a.bookingId);
  if(a.kind==="walk-in"){if(prev)throw Error("DUPLICATE_WALK_IN");}
  else if(a.kind==="manual-attendance"||a.kind==="verified-check-in"){if(prev?.attendance||a.at<b.startAt||a.at>=b.endAt)throw Error("INVALID_ATTENDANCE_AUDIT");}
  else if(!prev?.attendance||prev.checkout||a.at<prev.attendance.at)throw Error("INVALID_CHECKOUT_AUDIT");
  seen.set(a.bookingId,{attendance:a.kind==="manual-attendance"||a.kind==="verified-check-in"?a:prev?.attendance,checkout:a.kind==="checkout"?a:prev?.checkout});
 }
 for(const b of s.bookings.filter(b=>["attended","checked-out"].includes(b.bookingStatus))){
  const v=seen.get(b.bookingId);
  if(!v?.attendance||b.bookingStatus==="attended"&&v.checkout||b.bookingStatus==="checked-out"&&!v.checkout)throw Error("MISSING_ATTENDANCE_AUDIT");
 }
}
