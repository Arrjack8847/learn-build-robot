// N5 staff schedule and canonical attendance mutations.
// Resolve staff, child ownership, membership and verified code evidence on the server.
import {randomUUID} from "node:crypto";
import {POLICY,HOUR,businessDay,dayStart,slot,canBookSlot} from "./policy.mjs";
import {attendanceBooking,isChildId} from "./contract.mjs";
import {n4,digest,depositBalance,effectiveEligibility,hasQueue,reservedOffers} from "./automation-state.mjs";
import {staffAudit} from "./staff-state.mjs";
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{16,128}$/.test(x);
const exact=(x,ks)=>x&&typeof x==="object"&&!Array.isArray(x)&&Object.keys(x).length===ks.length&&ks.every(k=>Object.hasOwn(x,k));
const fail=status=>({ok:false,status});
const sameOwner=(a,b)=>a&&b&&a.childId===b.childId&&a.parentId===b.parentId&&a.stateVersion===b.stateVersion;
const validOwner=(o,c)=>o&&o.childId===c&&isChildId(o.parentId)&&typeof o.stateVersion==="string"&&o.stateVersion.length>0;
const eligible=e=>e?.membership==="active"&&e.deposit==="clear";
const validReason=r=>typeof r==="string"&&r.trim()===r&&r.length>=3&&r.length<=300;
const active=b=>b.bookingStatus!=="cancelled";
const attendance=a=>["manual-attendance","verified-check-in"].includes(a.kind);
export function projectDay(state,day,now,closedDays=[]){
 dayStart(day);const closed=closedDays.includes(day),rows=state.bookings.filter(b=>b.day===day).sort((a,b)=>a.startAt-b.startAt||a.activity.localeCompare(b.activity)||a.bookingId.localeCompare(b.bookingId));
 const slots=POLICY.openHours.flatMap(hour=>POLICY.activities.map(activity=>{
  const s=slot(day,hour,activity),bookings=rows.filter(b=>b.startAt===s.startAt&&b.activity===activity);
  const occupied=bookings.filter(active).length,offered=reservedOffers(state,s),queued=n4(state).waitlist.filter(w=>w.status==="queued"&&w.activity===activity&&w.startAt===s.startAt).length;
  const free=queued?0:Math.max(0,POLICY.capacityPerActivity-occupied-offered);
  const remaining=canBookSlot(s,now,{closedDays})?free:0,walkInRemaining=canBookSlot(s,now,{closedDays,walkIn:true})?free:0;
  return {...s,hour,capacity:POLICY.capacityPerActivity,occupied,offered,queued,remaining,walkInRemaining,open:!closed,bookings};
 }));
 return {day,serverNow:now,closed,slots,totals:{bookings:rows.filter(active).length,attended:rows.filter(b=>["attended","checked-out"].includes(b.bookingStatus)).length,noShows:rows.filter(b=>b.bookingStatus==="no-show").length,held:rows.filter(b=>b.bookingStatus==="held-unpaid").length,cancelled:rows.filter(b=>b.bookingStatus==="cancelled").length,excused:rows.filter(b=>b.bookingStatus==="excused").length,offered:slots.reduce((n,x)=>n+x.offered,0)}};
}
export function createStaffSchedulingService({repository,resolveStaff,readOwner,readEligibility,verifyCheckIn=async()=>null,clock=Date.now,newId=randomUUID,closedDays=[],staffName=()=>null}){
 const staff=async(actor,permission)=>{const s=await resolveStaff(actor);return s&&id(s.staffId)&&typeof s.version==="string"&&s.permissions?.includes(permission)?s:null;};
 const sameStaff=(a,b)=>a&&b&&a.staffId===b.staffId&&a.version===b.version;
 async function dayView(actor,day){
  try{
   const s=await staff(actor,"schedule:read");if(!s)return fail("NOT_AUTHORIZED");
   try{dayStart(day);}catch{return fail("INVALID_DAY");}
   const {state,version}=await repository.read(),v=projectDay(state,day,clock(),closedDays);
   const owners=new Map();
   for(const x of v.slots)x.bookings=await Promise.all(x.bookings.map(async b=>{
    const o=await readOwner(b.childId,b.parentId);
    if(!validOwner(o,b.childId)||o.parentId!==b.parentId)throw Error("OWNER_UNCONFIRMED");
    owners.set(b.childId,o);
    const record=staffAudit(state).find(a=>a.bookingId===b.bookingId&&attendance(a)),checkout=staffAudit(state).find(a=>a.bookingId===b.bookingId&&a.kind==="checkout"),excuse=n4(state).excuses.find(a=>a.bookingId===b.bookingId);
    const e=effectiveEligibility(state,o,await readEligibility(o),v.serverNow);
    return {bookingId:b.bookingId,childId:b.childId,childName:typeof o.name==="string"?o.name.slice(0,120):"Student",day:b.day,activity:b.activity,startAt:b.startAt,endAt:b.endAt,revision:b.revision,status:b.bookingStatus,membership:e.membership,deposit:e.deposit,checkInAt:record?.at??null,checkOutAt:checkout?.at??null,checkedInBy:record?(record.kind==="verified-check-in"?"Verified student code":staffName(record.actorId)??record.actorId):null,checkedOutBy:checkout?staffName(checkout.actorId)??checkout.actorId:null,excuse:excuse?{reason:excuse.reason,at:excuse.at,by:staffName(excuse.staffId)??excuse.staffId}:null};
   }));
   for(const o of owners.values())if(!sameOwner(o,await readOwner(o.childId,o.parentId)))return fail("SCHEDULING_UNAVAILABLE");
   if((await repository.read()).version!==version)return fail("BOOKING_BUSY");
   if(!sameStaff(s,await staff(actor,"schedule:read")))return fail("NOT_AUTHORIZED");
   return {ok:true,status:"READY",snapshotVersion:version,...v};
  }catch{return fail("SCHEDULING_UNAVAILABLE");}
 }
 async function mutate(input,actor,proof=null){
  try{
   const kind=input?.action,verified=kind==="verified-check-in",walk=kind==="walk-in";
   const keys=walk?["action","childId","activity","reason","requestId"]:verified?["action","childId","bookingId","revision","requestId"]:["action","childId","bookingId","revision","reason","requestId"];
   if(!["walk-in","manual-attendance","checkout","verified-check-in"].includes(kind)||!exact(input,keys)||!isChildId(input.childId)||!id(input.requestId)||!walk&&(!id(input.bookingId)||!id(input.revision))||!verified&&!validReason(input.reason)||walk&&!POLICY.activities.includes(input.activity))return fail("INVALID_INPUT");
   const permission=walk?"schedule:walk-in":"schedule:attendance";
   const initial=verified?await verifyCheckIn(proof,input):await staff(actor,permission);
   if(verified?(!initial||initial.bookingId!==input.bookingId||initial.childId!==input.childId||initial.revision!==input.revision||!id(initial.evidenceId)||!isChildId(initial.parentId)||initial.evidenceId!==input.requestId):!initial)return fail("NOT_AUTHORIZED");
   const actorId=verified?initial.evidenceId:initial.staffId;
   const key=digest(["n5",actorId,input.requestId]),fingerprint=digest(input);
   for(let retry=0;retry<8;retry++){
    const snap=await repository.read(),s=structuredClone(snap.state),now=clock();
    const auth=verified?await verifyCheckIn(proof,input):await staff(actor,permission);
    if(verified?(!auth||auth.evidenceId!==initial.evidenceId||auth.bookingId!==initial.bookingId||auth.revision!==initial.revision||auth.childId!==initial.childId||auth.parentId!==initial.parentId):!sameStaff(initial,auth))return fail("NOT_AUTHORIZED");
    const audit=staffAudit(s),prev=audit.find(a=>a.key===key);
    if(prev){if(prev.fingerprint!==fingerprint)return fail("REQUEST_ID_CONFLICT");return {ok:true,status:"ALREADY_COMMITTED",bookingId:prev.bookingId,revision:prev.revision};}
    const b=walk?null:s.bookings.find(b=>b.bookingId===input.bookingId&&b.childId===input.childId);
    if(!walk&&(!b||b.revision!==input.revision||verified&&b.parentId!==initial.parentId))return fail("BOOKING_CHANGED");
    const o=await readOwner(input.childId,b?.parentId??null);
    if(!validOwner(o,input.childId)||b&&o.parentId!==b.parentId)return fail("NOT_AUTHORIZED");
    let target=null,status;
    if(walk){
     const day=businessDay(now),hour=Math.floor((now-dayStart(day))/HOUR);
     try{target=slot(day,hour,input.activity);}catch{return fail("LAB_CLOSED");}
     if(!canBookSlot(target,now,{walkIn:true,closedDays}))return fail("LAB_CLOSED");
     if(s.bookings.some(x=>active(x)&&x.childId===o.childId&&x.day===day))return fail("DAILY_LIMIT");
     if(s.bookings.filter(x=>active(x)&&x.activity===target.activity&&x.startAt===target.startAt).length+reservedOffers(s,target)>=POLICY.capacityPerActivity||hasQueue(s,target))return fail("SLOT_FULL");
     status="booked";
    }else if(kind==="checkout"){
     if(b.bookingStatus!=="attended"||!audit.some(a=>a.bookingId===b.bookingId&&attendance(a)))return fail("NOT_ATTENDED");
     status="checked-out";
    }else{
     if(b.bookingStatus!=="booked"||now<b.startAt||now>=b.endAt||closedDays.includes(b.day))return fail("OUTSIDE_BOOKED_HOUR");
     status="attended";
    }
    if(kind!=="checkout"){
     const e=effectiveEligibility(s,o,await readEligibility(o),clock());
     // Deposit policy applies to new bookings, not already-booked visits.
     if(e.membership!=="active"||walk&&!eligible(e))return fail(e.membership!=="active"?"MEMBERSHIP_REQUIRED":"DEPOSIT_REQUIRED");
    }
    const current=await readOwner(o.childId,o.parentId);
    if(!sameOwner(o,current))return fail("NOT_AUTHORIZED");
    const fresh=verified?await verifyCheckIn(proof,input):await staff(actor,permission);
    if(verified?(!fresh||fresh.evidenceId!==initial.evidenceId||fresh.bookingId!==initial.bookingId||fresh.childId!==initial.childId||fresh.revision!==initial.revision||fresh.parentId!==initial.parentId):!sameStaff(initial,fresh))return fail("NOT_AUTHORIZED");
    const finalEligibility=kind==="checkout"?null:effectiveEligibility(s,current,await readEligibility(current),clock());
    if(finalEligibility&&(finalEligibility.membership!=="active"||walk&&!eligible(finalEligibility)))return fail(finalEligibility.membership!=="active"?"MEMBERSHIP_REQUIRED":"DEPOSIT_REQUIRED");
    const at=clock();
    if(finalEligibility?.validUntil!==undefined&&at>=finalEligibility.validUntil)return fail("MEMBERSHIP_REQUIRED");
    if(at<now||walk&&!canBookSlot(target,at,{walkIn:true,closedDays})||!walk&&kind!=="checkout"&&(at<b.startAt||at>=b.endAt))return fail("OUTSIDE_BOOKED_HOUR");
    const revision=newId(),bookingId=b?.bookingId??newId();
    const next=walk?{...target,bookingId,childId:o.childId,parentId:o.parentId,revision,bookingStatus:status,createdAt:at,updatedAt:at}:{...b,revision,bookingStatus:status,updatedAt:at};
    s.bookings=[...s.bookings.filter(x=>x.bookingId!==bookingId),next];
    s.n5=[...audit,{key,fingerprint,bookingId,childId:o.childId,actorId,kind,at,revision,reason:verified?"":input.reason}];
    const saved=await repository.compareAndSet(snap.version,s);
    if(saved.status==="conflict")continue;
    if(saved.status!=="committed")return fail("COMMIT_UNCONFIRMED");
    return {ok:true,status:"COMMITTED",bookingId,revision};
   }
   return fail("BOOKING_BUSY");
  }catch{return fail("SCHEDULING_UNAVAILABLE");}
 }
 return {dayView,mutate};
}
// J4/J5 internal reader. A pass is never created by this adapter.
// All access must also revalidate verified identity, current membership, revocation and pass authority.
export function createSharedAttendanceAdapter({repository,readOwner,readEligibility,clock=Date.now}){
 async function currentBooking(childId,parentId){
  if(!isChildId(childId)||!isChildId(parentId))return null;
  const o=await readOwner(childId,parentId);if(!validOwner(o,childId)||o.parentId!==parentId)return null;
  const snap=await repository.read(),state=snap.state,now=clock();
  if(effectiveEligibility(state,o,await readEligibility(o),now).membership!=="active")return null;
  if(!sameOwner(o,await readOwner(childId,parentId)))return null;
  if((await repository.read()).version!==snap.version)return null;
  const b=state.bookings.find(b=>b.childId===childId&&b.parentId===parentId&&b.day===businessDay(now)&&active(b));
  const p=attendanceBooking(b,childId,parentId,clock());if(!p)return null;
  const check=staffAudit(state).find(a=>a.bookingId===b.bookingId&&attendance(a));
  return {...p,checkInAt:check?.at??null};
 }
 // Use only after the real J5 check-in path is fully connected to this aggregate.
 async function noAttendance(booking,{canonicalAttendanceEnabled=false}={}){
  if(!canonicalAttendanceEnabled)return null;
  const {state}=await repository.read(),b=state.bookings.find(x=>x.bookingId===booking.bookingId);
  if(!b||b.revision!==booking.revision||b.childId!==booking.childId||b.parentId!==booking.parentId||clock()<b.endAt||b.bookingStatus!=="booked"||staffAudit(state).some(a=>a.bookingId===b.bookingId&&attendance(a)))return null;
  return {bookingId:b.bookingId,revision:b.revision,status:"confirmed-no-attendance"};
 }
 return {currentBooking,noAttendance};
}
