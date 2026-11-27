// N3 server booking operations. Identity and membership are trusted injected authorities.
// All changes, capacity and durable replay evidence commit through one CAS snapshot.
import {createHash,randomUUID} from "node:crypto";
import {POLICY,DAY,businessDay,dayStart,slot,canBookSlot,canCancel} from "./policy.mjs";
import {isChildId,parentBooking} from "./contract.mjs";
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const requestId=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{16,128}$/.test(x);
const exact=(x,keys)=>x&&typeof x==="object"&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const occupying=b=>b.bookingStatus!=="cancelled";
const upcoming=(b,now)=>["booked","held-unpaid"].includes(b.bookingStatus)&&b.startAt>now;
const fail=status=>({ok:false,status});
function validInput(i){
 if(!i||!isChildId(i.childId))return false;
 if(i.action==="view")return exact(i,["action","childId"]);
 if(!requestId(i.requestId))return false;
 if(i.action==="book")return exact(i,["action","childId","day","hour","activity","requestId"]);
 if(i.action==="move")return exact(i,["action","childId","bookingId","revision","day","hour","activity","requestId"])&&requestId(i.bookingId)&&requestId(i.revision);
 if(i.action==="cancel")return exact(i,["action","childId","bookingId","revision","requestId"])&&requestId(i.bookingId)&&requestId(i.revision);
 return false;
}
export function createBookingService({repository,resolveChild,readEligibility,clock=Date.now,newId=randomUUID,closedDays=[]}){
 // Never substitute a client-selected payment/parent flag for these authorities.
 const validOwner=(o,id)=>o&&o.childId===id&&isChildId(o.parentId)&&typeof o.stateVersion==="string"&&o.stateVersion.length>0;
 const same=(a,b)=>validOwner(b,a.childId)&&a.parentId===b.parentId&&a.stateVersion===b.stateVersion;
 const eligible=e=>e?.membership==="active"&&e.deposit==="clear";
 const reason=e=>e?.membership==="inactive"?"MEMBERSHIP_REQUIRED":e?.membership!=="active"?"ELIGIBILITY_UNAVAILABLE":e.deposit==="required"?"DEPOSIT_REQUIRED":"ELIGIBILITY_UNAVAILABLE";
 function view(state,o,e,now){
  const days=[];
  for(let d=0;d<=POLICY.advanceDays;d++){
   const day=businessDay(dayStart(businessDay(now))+d*DAY),slots=[];
   for(const h of POLICY.openHours)for(const activity of POLICY.activities){
    const s=slot(day,h,activity);if(!canBookSlot(s,now,{closedDays}))continue;
    const used=state.bookings.filter(b=>occupying(b)&&b.startAt===s.startAt&&b.activity===activity).length;
    slots.push({...s,hour:h,remaining:Math.max(0,POLICY.capacityPerActivity-used)});
   }
   days.push({day,slots});
  }
  return {ok:true,status:"READY",childId:o.childId,membership:e?.membership??"unavailable",canBook:eligible(e),eligibilityStatus:eligible(e)?"ELIGIBLE":reason(e),days,bookings:state.bookings.filter(b=>b.childId===o.childId&&b.parentId===o.parentId&&b.endAt>now&&b.bookingStatus!=="cancelled").map(b=>({...parentBooking(b,o.parentId),canModify:b.bookingStatus==="booked"&&canCancel(b.startAt,now)})).sort((a,b)=>a.startAt-b.startAt),maxUpcoming:POLICY.maxUpcoming,serverNow:now};
 }
 return async function execute(input,actor){
  if(!validInput(input))return fail("INVALID_INPUT");
  try{
   const first=await resolveChild(actor,input.childId);if(!validOwner(first,input.childId))return fail("NOT_AUTHORIZED");
   let target=null;
   if(["book","move"].includes(input.action)){try{target=slot(input.day,input.hour,input.activity);}catch{return fail("INVALID_SLOT");}}
   const key=input.action==="view"?null:hash([first.parentId,input.requestId]);
   const fp=key?hash([input.action,input.childId,input.bookingId??null,input.revision??null,input.day??null,input.hour??null,input.activity??null]):null;
   for(let retry=0;retry<8;retry++){
    const snap=await repository.read(),owner=await resolveChild(actor,input.childId);
    if(!same(first,owner))return fail("NOT_AUTHORIZED");
    const state=snap.state,now=clock(),eligibility=await readEligibility(owner);
    const fresh=await resolveChild(actor,input.childId);if(!same(owner,fresh))return fail("NOT_AUTHORIZED");
    if(input.action==="view")return view(state,owner,eligibility,clock());
    const prior=(state.commands??[]).find(c=>c.key===key);
    if(prior)return prior.fingerprint===fp?{ok:true,status:"ALREADY_COMMITTED",bookingId:prior.bookingId}:fail("REQUEST_ID_CONFLICT");
    const old=input.action==="book"?null:state.bookings.find(b=>b.bookingId===input.bookingId&&b.childId===owner.childId&&b.parentId===owner.parentId);
    if(input.action!=="book"&&(!old||old.revision!==input.revision||old.bookingStatus!=="booked"))return fail("BOOKING_CHANGED");
    if(old&&!canCancel(old.startAt,now))return fail("CANCELLATION_CLOSED");
    if(target){
     if(!eligible(eligibility))return fail(reason(eligibility));
     if(!canBookSlot(target,now,{closedDays}))return fail("INVALID_SLOT");
     const others=state.bookings.filter(b=>b.bookingId!==old?.bookingId);
     if(others.some(b=>occupying(b)&&b.childId===owner.childId&&b.day===target.day))return fail("DAILY_LIMIT");
     if(others.filter(b=>b.childId===owner.childId&&upcoming(b,now)).length>=POLICY.maxUpcoming)return fail("UPCOMING_LIMIT");
     if(others.filter(b=>occupying(b)&&b.activity===target.activity&&b.startAt===target.startAt).length>=POLICY.capacityPerActivity)return fail("SLOT_FULL");
    }
    const finalOwner=await resolveChild(actor,input.childId);
    if(!same(owner,finalOwner))return fail("NOT_AUTHORIZED");
    if(target){const finalEligibility=await readEligibility(finalOwner);if(!eligible(finalEligibility))return fail(reason(finalEligibility));}
    const at=clock();
    if(at<now||old&&!canCancel(old.startAt,at)||target&&!canBookSlot(target,at,{closedDays}))return fail("SLOT_CHANGED");
    const id=old?.bookingId??newId();
    const next=input.action==="cancel"?{...old,bookingStatus:"cancelled",revision:newId(),updatedAt:at}:{...target,bookingId:id,childId:owner.childId,parentId:owner.parentId,revision:newId(),bookingStatus:"booked",createdAt:old?.createdAt??at,updatedAt:at};
    const proposed={...state,bookings:[...state.bookings.filter(b=>b.bookingId!==id),next],commands:[...(state.commands??[]),{key,fingerprint:fp,bookingId:id,at}]};
    const result=await repository.compareAndSet(snap.version,proposed);
    if(result.status==="conflict")continue;
    if(result.status!=="committed"){
     // Resolve ambiguous writes by reading durable idempotency evidence, never blind retry.
     try{const check=await repository.read(),found=(check.state.commands??[]).find(c=>c.key===key);if(found?.fingerprint===fp&&same(owner,await resolveChild(actor,input.childId)))return {ok:true,status:"ALREADY_COMMITTED",bookingId:found.bookingId};}catch{}
     return fail("COMMIT_UNCONFIRMED");
    }
    if(!same(owner,await resolveChild(actor,input.childId)))return fail("COMMIT_UNCONFIRMED");
    return {ok:true,status:"COMMITTED",bookingId:id};
   }
   return fail("BOOKING_BUSY");
  }catch{return fail("SCHEDULING_UNAVAILABLE");}
 };
}
