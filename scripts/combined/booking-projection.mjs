// Internal projection for the later J4/J5 migration. Not a login, code or learning-pass grant.
import {businessDay} from "../nizar/policy.mjs";
import {isChildId} from "../nizar/contract.mjs";
import {staffAudit} from "../nizar/staff-state.mjs";
export const unavailable=()=>({attendanceStatus:"unavailable",checkInStatus:"unavailable",visitStatus:"none",bookingId:null,bookingStartAt:null,bookingEndAt:null,checkInAt:null,day:null,revision:null});
const exactChild=(a,b)=>a&&b&&a.childId===b.childId&&a.parentId===b.parentId&&a.stateVersion===b.stateVersion;
export function createCombinedBookingProjection({repository,readVerifiedChild,clock=Date.now}){
 return async({studentId,parentId})=>{
  try{
   if(!isChildId(studentId)||!isChildId(parentId))return unavailable();
   const first=await readVerifiedChild(studentId);
   if(first?.childId!==studentId||first.parentId!==parentId||first.accountStatus!=="preview-test"||typeof first.stateVersion!=="string"||!first.stateVersion)return unavailable();
   const snap=await repository.read(),now=clock(),day=businessDay(now);
   const rows=snap.state.bookings.filter(b=>b.childId===studentId&&b.day===day&&b.bookingStatus!=="cancelled");
   if(rows.length>1||rows.some(b=>b.parentId!==parentId))return unavailable();
   const fresh=await readVerifiedChild(studentId);
   if(!exactChild(first,fresh)||fresh.accountStatus!=="preview-test"||(await repository.read()).version!==snap.version||businessDay(clock())!==day)return unavailable();
   if(!rows.length)return {...unavailable(),day,attendanceStatus:"not_booked",checkInStatus:"not_checked_in"};
   const b=rows[0],a=staffAudit(snap.state).find(x=>x.bookingId===b.bookingId&&["manual-attendance","verified-check-in"].includes(x.kind)),out=staffAudit(snap.state).find(x=>x.bookingId===b.bookingId&&x.kind==="checkout");
   const base={day,bookingId:b.bookingId,bookingStartAt:b.startAt,bookingEndAt:b.endAt,revision:b.revision,activity:b.activity,checkInAt:null,visitStatus:"none",checkInStatus:"not_checked_in"};
   if(b.bookingStatus==="booked")return {...base,attendanceStatus:"booked"};
   if(b.bookingStatus==="held-unpaid")return {...base,attendanceStatus:"held_unpaid"};
   if(b.bookingStatus==="no-show"||b.bookingStatus==="excused")return {...base,attendanceStatus:b.bookingStatus.replace("-","_")};
   if(!a||a.at<b.startAt||a.at>=b.endAt||a.at>clock())return unavailable();
   if(b.bookingStatus==="checked-out"&&out&&out.at>=a.at&&out.at<=clock())return {...base,attendanceStatus:"checked_out",checkInStatus:"checked_out",visitStatus:"ended",checkInAt:a.at};
   if(b.bookingStatus==="attended"&&!out)return {...base,attendanceStatus:"attended",checkInStatus:"checked_in",visitStatus:"open",checkInAt:a.at};
   return unavailable();
  }catch{return unavailable();}
 };
}
