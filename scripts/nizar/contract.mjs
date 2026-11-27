// Scheduling's canonical server boundary. No browser-supplied identity, membership or attendance.
import {POLICY,slot,dayStart,HOUR,businessDay} from "./policy.mjs";
export const NIZAR_BRANCH="feat/nizar-scheduling-20261127";
export const COLLECTION="NizarSchedulingPreview",RECORD_ID="nizar-scheduling-preview-v1";
export const enabled=e=>e?.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF===NIZAR_BRANCH&&e.NIZAR_SCHEDULING_ENABLED==="1";
export const isChildId=x=>typeof x==="string"&&/^qa-j2-[a-f0-9]{64}$/.test(x);
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{16,128}$/.test(x);
const statuses=["booked","cancelled","attended","no-show","excused","checked-out","held-unpaid"];
const stamp=x=>Number.isSafeInteger(x)&&x>0;
const bookingKeys=["bookingId","childId","parentId","revision","bookingStatus","createdAt","updatedAt","day","activity","startAt","endAt"];
export function validateBooking(b){
 if(!b||typeof b!=="object"||Array.isArray(b)||Object.keys(b).length!==bookingKeys.length||!bookingKeys.every(k=>Object.hasOwn(b,k))||!id(b.bookingId)||!isChildId(b.childId)||!isChildId(b.parentId)||!id(b.revision)||!statuses.includes(b.bookingStatus)||!stamp(b.createdAt)||!stamp(b.updatedAt)||b.updatedAt<b.createdAt)return false;
 try{const start=dayStart(b.day),hour=(b.startAt-start)/HOUR,expected=slot(b.day,hour,b.activity);return expected.endAt===b.endAt&&b.createdAt<b.endAt;}catch{return false;}
}
export function parentBooking(b,parentId){if(!validateBooking(b)||b.parentId!==parentId)return null;return {bookingId:b.bookingId,childId:b.childId,day:b.day,activity:b.activity,startAt:b.startAt,endAt:b.endAt,bookingStatus:b.bookingStatus,revision:b.revision,createdAt:b.createdAt,updatedAt:b.updatedAt};}
export function attendanceBooking(b,childId,parentId,now){
 if(!validateBooking(b)||b.childId!==childId||b.parentId!==parentId||businessDay(now)!==b.day||now<b.startAt||now>=b.endAt||!["booked","attended"].includes(b.bookingStatus))return null;
 return {bookingId:b.bookingId,childId:b.childId,day:b.day,bookingStartAt:b.startAt,bookingEndAt:b.endAt,bookingStatus:b.bookingStatus,activity:b.activity,revision:b.revision};
}
