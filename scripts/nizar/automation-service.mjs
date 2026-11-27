// N4 trusted server-only event processing. No browser-provided financial/attendance facts.
// The adapter must verify provider events, real staff authority and canonical membership ownership.
import {randomUUID} from "node:crypto";
import {POLICY,HOUR,businessDay,slot,canBookSlot} from "./policy.mjs";
import {isChildId} from "./contract.mjs";
import {n4,emptyN4,digest,monthlyNoShows,depositBalance,effectiveEligibility,reservedOffers,queueNotice,appendLedger} from "./automation-state.mjs";
const fail=status=>({ok:false,status});
const validId=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{16,128}$/.test(x);
const owns=(x,o)=>x.childId===o.childId&&x.parentId===o.parentId;
const validOwner=o=>o&&isChildId(o.childId)&&isChildId(o.parentId)&&typeof o.stateVersion==="string"&&o.stateVersion.length>0;
const active=b=>b.bookingStatus!=="cancelled";
const future=(b,now)=>["booked","held-unpaid"].includes(b.bookingStatus)&&b.startAt>now;
const keyFor=w=>w.activity+"/"+w.startAt;
const eligible=e=>e?.membership==="active"&&e.deposit==="clear";
const exact=(v,ks)=>v&&typeof v==="object"&&!Array.isArray(v)&&Object.keys(v).length===ks.length&&ks.every(k=>Object.hasOwn(v,k));
const hasDaily=(s,w)=>s.bookings.some(b=>active(b)&&b.childId===w.childId&&b.day===w.day);
const upcomingCount=(s,w,now)=>s.bookings.filter(b=>b.childId===w.childId&&future(b,now)).length;
const used=(s,w)=>s.bookings.filter(b=>active(b)&&keyFor(b)===keyFor(w)).length+reservedOffers(s,w);
const updateBooking=(b,status,at,newId)=>({...b,bookingStatus:status,revision:newId(),updatedAt:at});
const viewWait=(w)=>({id:w.id,day:w.day,activity:w.activity,startAt:w.startAt,endAt:w.endAt,status:w.status,expiresAt:w.expiresAt});
function copy(s){return {...structuredClone(s),n4:structuredClone(s.n4??emptyN4())};}
function classify(s,b,now,newId){
 const m=b.day.slice(0,7),a=s.n4;
 const count=monthlyNoShows(s,b.childId,m);
 const ix=s.bookings.findIndex(x=>x.bookingId===b.bookingId);
 s.bookings[ix]=updateBooking(b,"no-show",now,newId);
 if(count===0)queueNotice(a,"no-show-warning",b,b.bookingId,now);
 else if(count===1)queueNotice(a,"deposit-required",b,b.bookingId,now);
 else {
  const balance=depositBalance(s,b.childId,m);
  if(balance.held===POLICY.depositMinor){
   appendLedger(a,b,m,"forfeit",b.bookingId,now);
   queueNotice(a,"deposit-forfeited",b,b.bookingId,now);
  }else queueNotice(a,"deposit-required",b,b.bookingId,now);
 }
}
export function createN4Service({repository,resolveChild,readEligibility,readOwner,readAttendance,verifyEvent,clock=Date.now,newId=randomUUID,closedDays=[],reminderLeadMs=24*HOUR}){
 // All dependencies are trusted server functions; absence or uncertainty refuses mutations.
 async function transact(apply){
  for(let attempt=0;attempt<8;attempt++){
   const snap=await repository.read(),s=copy(snap.state),now=clock();
   if(!Number.isSafeInteger(now)||now<=0)throw Error("INVALID_CLOCK");
   const result=await apply(s,now);
   if(!result.ok||result.noWrite)return result;
   const saved=await repository.compareAndSet(snap.version,s);
   if(saved.status==="conflict")continue;
   if(saved.status!=="committed")return fail("COMMIT_UNCONFIRMED");
   return result;
  }return fail("BOOKING_BUSY");
 }
 async function own(actor,id){const o=await resolveChild(actor,id);return validOwner(o)&&o.childId===id?o:null;}
 async function observed(s,o,now){return effectiveEligibility(s,o,await readEligibility(o),now);}
 async function offerPlaces(s,now){
  const a=s.n4;
  for(const w of a.waitlist){
   if(w.status==="offered"&&now>=w.expiresAt||w.status==="queued"&&now>=w.startAt)w.status="expired";
  }
  const queue=a.waitlist.filter(w=>w.status==="queued").sort((a,b)=>a.joinedAt-b.joinedAt||a.id.localeCompare(b.id));
  const blockedSlots=new Set();
  for(const w of queue){
   if(blockedSlots.has(keyFor(w)))continue;
   if(!canBookSlot(w,now,{closedDays})){w.status="expired";continue;}
   if(used(s,w)>=POLICY.capacityPerActivity)continue;
   const o=await readOwner(w.childId,w.parentId);
   if(!validOwner(o)||!owns(w,o)){blockedSlots.add(keyFor(w));continue;} // unresolved identity: do not skip FIFO
   const e=await observed(s,o,now);
   if(e.membership==="unavailable"||e.deposit==="unavailable"){blockedSlots.add(keyFor(w));continue;}
   if(!eligible(e)||hasDaily(s,w)||upcomingCount(s,w,now)>=POLICY.maxUpcoming){w.status="ineligible";continue;}
   const at=clock();if(at<now||at>=w.startAt)continue;
   w.status="offered";w.offeredAt=at;w.expiresAt=Math.min(at+POLICY.offerMs,w.startAt);
   queueNotice(a,"waitlist-offer",w,w.id,at);
  }
 }
 async function waitlist(input,actor){
  try{
   if(!input||!isChildId(input.childId))return fail("INVALID_INPUT");
   const action=input.action;
   const keys=action==="waitlist-view"?["action","childId"]:action==="waitlist-join"?["action","childId","day","hour","activity","requestId"]:["action","childId","offerId"];
   if(!["waitlist-view","waitlist-join","waitlist-accept","waitlist-decline"].includes(action)||!exact(input,keys)||action==="waitlist-join"&&!validId(input.requestId)||["waitlist-accept","waitlist-decline"].includes(action)&&!validId(input.offerId))return fail("INVALID_INPUT");
   const first=await own(actor,input.childId);if(!first)return fail("NOT_AUTHORIZED");
   return await transact(async(s,now)=>{
    const o=await own(actor,input.childId);if(!o||!owns(o,first)||o.stateVersion!==first.stateVersion)return fail("NOT_AUTHORIZED");
    const a=s.n4,m=businessDay(now).slice(0,7);
    if(action==="waitlist-view"){
     const balance=depositBalance(s,o.childId,m);
     return {ok:true,noWrite:true,status:"READY",entries:a.waitlist.filter(w=>owns(w,o)&&["queued","offered"].includes(w.status)&&w.startAt>now).map(viewWait),noShows:monthlyNoShows(s,o.childId,m),depositHeld:balance.held,notices:a.notices.filter(x=>owns(x,o)).slice(-30).map(x=>({kind:x.kind,at:x.at})),refundDue:a.ledger.filter(x=>owns(x,o)&&x.kind==="refund-due").reduce((sum,x)=>sum+depositBalance(s,o.childId,x.month).due,0)};
    }
    if(action==="waitlist-join"){
     const requestKey=digest([o.parentId,input.requestId]),prior=a.waitlist.find(w=>w.requestKey===requestKey);
     let target;try{target=slot(input.day,input.hour,input.activity);}catch{return fail("INVALID_SLOT");}
     if(prior)return owns(prior,o)&&keyFor(prior)===keyFor(target)?{ok:true,noWrite:true,status:"ALREADY_COMMITTED",entry:viewWait(prior)}:fail("REQUEST_ID_CONFLICT");
     if(!canBookSlot(target,now,{closedDays}))return fail("INVALID_SLOT");
     const e=await observed(s,o,now);if(!eligible(e))return fail(e.membership!=="active"?"MEMBERSHIP_REQUIRED":"DEPOSIT_REQUIRED");
     if(hasDaily(s,o&&{...target,childId:o.childId})||upcomingCount(s,o,now)>=POLICY.maxUpcoming)return fail("BOOKING_LIMIT");
     const old=a.waitlist.find(w=>owns(w,o)&&keyFor(w)===keyFor(target)&&["queued","offered"].includes(w.status));
     if(old)return {ok:true,noWrite:true,status:"ALREADY_JOINED",entry:viewWait(old)};
     if(used(s,target)<POLICY.capacityPerActivity&&!a.waitlist.some(w=>w.status==="queued"&&keyFor(w)===keyFor(target)))return fail("SLOT_AVAILABLE");
     const w={...target,id:newId(),childId:o.childId,parentId:o.parentId,joinedAt:now,status:"queued",offeredAt:null,expiresAt:null,requestKey};
     a.waitlist.push(w);return {ok:true,status:"JOINED",entry:viewWait(w)};
    }
    const w=a.waitlist.find(w=>w.id===input.offerId&&owns(w,o));if(!w)return fail("NOT_AUTHORIZED");
    if(action==="waitlist-decline"){
     if(w.status==="declined")return {ok:true,noWrite:true,status:"ALREADY_COMMITTED"};
     if(!["queued","offered"].includes(w.status))return fail("OFFER_CLOSED");
     w.status="declined";return {ok:true,status:"DECLINED"};
    }
    if(w.status==="accepted")return {ok:true,noWrite:true,status:"ALREADY_COMMITTED",bookingId:w.id};
    if(w.status!=="offered"||now>=w.expiresAt||!canBookSlot(w,now,{closedDays}))return fail("OFFER_CLOSED");
    const e=await observed(s,o,now);if(!eligible(e))return fail(e.membership!=="active"?"MEMBERSHIP_REQUIRED":"DEPOSIT_REQUIRED");
    if(hasDaily(s,w)||upcomingCount(s,w,now)>=POLICY.maxUpcoming)return fail("BOOKING_LIMIT");
    const latest=await own(actor,input.childId),at=clock();
    if(!latest||!owns(latest,o)||latest.stateVersion!==o.stateVersion||at<now||at>=w.expiresAt||!canBookSlot(w,at,{closedDays}))return fail("OFFER_CLOSED");
    if(!eligible(await observed(s,latest,at)))return fail("ELIGIBILITY_UNAVAILABLE");
    if(clock()>=w.expiresAt)return fail("OFFER_CLOSED");
    w.status="accepted";
    s.bookings.push({bookingId:w.id,childId:w.childId,parentId:w.parentId,day:w.day,activity:w.activity,startAt:w.startAt,endAt:w.endAt,bookingStatus:"booked",revision:newId(),createdAt:at,updatedAt:at});
    return {ok:true,status:"ACCEPTED",bookingId:w.id};
   });
  }catch{return fail("SCHEDULING_UNAVAILABLE");}
 }
 async function tick(){
  try{return await transact(async(s,now)=>{
   const a=s.n4,old=digest(s);
   // Holds never penalize an unpaid child whose reserved hour elapsed. This is a conservative provisional rule.
   for(const h of a.holds.filter(h=>h.status==="held")){
    for(const b of s.bookings.filter(b=>owns(b,h)&&b.bookingStatus==="held-unpaid")){
     if(now>=h.deadline||now>=b.endAt){const ix=s.bookings.findIndex(x=>x.bookingId===b.bookingId);s.bookings[ix]=updateBooking(b,"cancelled",now,newId);}
    }
    if(now>=h.deadline){h.status="released";queueNotice(a,"membership-release",h,h.cycleId,now);}
   }
   // Only a confirmed canonical no-attendance observation permits no-show classification.
   for(const b of s.bookings.filter(b=>b.bookingStatus==="booked").sort((x,y)=>x.endAt-y.endAt||x.bookingId.localeCompare(y.bookingId))){
    if(now>=b.endAt){
     const observation=await readAttendance(b);
     if(observation?.bookingId===b.bookingId&&observation.revision===b.revision&&observation.status==="confirmed-no-attendance")classify(s,b,now,newId);
    }else if(b.startAt>now&&b.startAt-now<=reminderLeadMs)queueNotice(a,"reminder",b,b.revision,now);
   }
   const currentMonth=businessDay(now).slice(0,7);
   const accounts=new Map();
   for(const x of a.ledger)if(x.month<currentMonth)accounts.set(x.childId+"/"+x.month,x);
   for(const x of accounts.values())if(depositBalance(s,x.childId,x.month).held===POLICY.depositMinor){
    // Do not close a month with unresolved booked/held sessions; late attendance may affect the deposit.
    if(s.bookings.some(b=>owns(b,x)&&b.day.slice(0,7)===x.month&&["booked","held-unpaid"].includes(b.bookingStatus)))continue;
    const ref=digest(["month-end",x.childId,x.month]);appendLedger(a,x,x.month,"refund-due",ref,now);queueNotice(a,"refund-due",x,ref,now);
   }
   await offerPlaces(s,now);
   return {ok:true,status:"PROCESSED",noWrite:digest(s)===old};
  });}catch{return fail("SCHEDULING_UNAVAILABLE");}
 }
 async function event(raw){
  // verifyEvent is a server-only adapter for signature-verified HitPay observations and verified staff commands.
  // A real implementation is intentionally not mounted in the fixture HTTP boundary.
  try{
   const e=await verifyEvent(raw);
   if(!e||!validId(e.eventId)||!isChildId(e.childId)||!isChildId(e.parentId)||!Number.isSafeInteger(e.at)||e.at<=0)return fail("UNVERIFIED_EVENT");
   return await transact(async(s,now)=>{
    if(e.at>now)return fail("UNVERIFIED_EVENT");
    const o=await readOwner(e.childId,e.parentId);if(!validOwner(o)||!owns(e,o))return fail("NOT_AUTHORIZED");
    const a=s.n4,id=digest(e.kind==="excuse"?["staff-excuse",e.staffId,e.eventId]:[e.eventId]),fingerprint=digest(e.kind==="excuse"&&e.revision!==undefined?{kind:e.kind,eventId:e.eventId,childId:e.childId,parentId:e.parentId,bookingId:e.bookingId,revision:e.revision,staffId:e.staffId,reason:e.reason}:e),previous=a.events.find(x=>x.id===id);
    if(previous)return previous.fingerprint===fingerprint?{ok:true,noWrite:true,status:"ALREADY_COMMITTED"}:fail("EVENT_CONFLICT");
    const m=businessDay(now).slice(0,7),balance=depositBalance(s,e.childId,m);
    if(e.kind==="renewal-failed"){
     if(!validId(e.cycleId))return fail("INVALID_EVENT");
     const old=a.holds.find(x=>x.childId===e.childId);
     if(old?.cycleId===e.cycleId){if(!owns(old,o))return fail("EVENT_CONFLICT");return {ok:true,noWrite:true,status:"ALREADY_COMMITTED"};}
     if(old&&(old.status!=="restored"||e.at<=old.failedAt))return fail("HOLD_RECONCILIATION_REQUIRED");
     const h={childId:e.childId,parentId:e.parentId,cycleId:e.cycleId,failedAt:e.at,deadline:e.at+POLICY.unpaidHoldMs,status:"held"};
     a.holds=a.holds.filter(x=>x.childId!==e.childId);a.holds.push(h);
     s.bookings=s.bookings.map(b=>owns(b,o)&&b.bookingStatus==="booked"&&b.endAt>e.at?updateBooking(b,"held-unpaid",now,newId):b);
     if(Array.isArray(s.checkins))s.checkins=s.checkins.map(c=>owns(c,o)?{...c,status:"revoked",claimId:null,grantRevision:null,sessionDigest:null,validUntil:null,memberUntil:null}:c);
     for(const w of a.waitlist)if(owns(w,o)&&["queued","offered"].includes(w.status))w.status="ineligible";
     queueNotice(a,"membership-hold",o,e.cycleId,now);
    }else if(e.kind==="renewal-paid"){
     const h=a.holds.find(x=>owns(x,o)&&x.cycleId===e.cycleId);
     if(!h||e.at<h.failedAt)return fail("HOLD_RECONCILIATION_REQUIRED");
     if(h.status==="restored")return {ok:true,noWrite:true,status:"ALREADY_COMMITTED"};
     s.bookings=s.bookings.map(b=>owns(b,o)&&b.bookingStatus==="held-unpaid"?updateBooking(b,h.status==="held"&&e.at<h.deadline&&b.startAt>now?"booked":"cancelled",now,newId):b);
     h.status="restored";queueNotice(a,"membership-restored",o,e.cycleId,now);
    }else if(e.kind==="deposit-paid"){
     if(e.currency!=="MYR"||e.amount!==POLICY.depositMinor||businessDay(e.at).slice(0,7)!==m||!validId(e.paymentId)||monthlyNoShows(s,e.childId,m)<POLICY.noShowsBeforeDeposit||balance.held!==0||a.ledger.some(x=>x.kind==="paid"&&x.reference===e.paymentId))return fail("PAYMENT_RECONCILIATION_REQUIRED");
     appendLedger(a,o,m,"paid",e.paymentId,now);
    }else if(e.kind==="refund-recorded"){
     if(!validId(e.staffId)||!validId(e.receiptId)||typeof e.month!=="string"||e.month>=m||e.currency!=="MYR"||e.amount!==POLICY.depositMinor||depositBalance(s,e.childId,e.month).due!==POLICY.depositMinor||a.ledger.some(x=>x.kind==="refund-paid"&&x.reference===e.receiptId))return fail("REFUND_RECONCILIATION_REQUIRED");
     // The verified staff receipt reference is retained; the external audit maps it to staff identity.
     appendLedger(a,o,e.month,"refund-paid",e.receiptId,now);
    }else if(e.kind==="excuse"){
     const b=s.bookings.find(b=>b.bookingId===e.bookingId&&owns(b,o));
     if(!b||(e.revision!==undefined&&e.revision!==b.revision)||!["booked","no-show","held-unpaid"].includes(b.bookingStatus)||!validId(e.staffId)||typeof e.reason!=="string"||e.reason.trim().length<3||e.reason.trim().length>300)return fail("INVALID_EXCUSE");
     // Reversing a forfeiture after another payment or month-end needs explicit financial reconciliation.
     if(a.ledger.some(x=>x.kind==="forfeit"&&x.reference===b.bookingId))return fail("EXCUSE_FINANCIAL_REVIEW_REQUIRED");
     s.bookings=s.bookings.map(x=>x.bookingId===b.bookingId?updateBooking(x,"excused",now,newId):x);
     a.excuses.push({bookingId:b.bookingId,staffId:e.staffId,reason:e.reason.trim(),at:now});queueNotice(a,"excused",o,b.bookingId,now);
    }else return fail("INVALID_EVENT");
    a.events.push({id,fingerprint,at:now});return {ok:true,status:"PROCESSED"};
   });
  }catch{return fail("SCHEDULING_UNAVAILABLE");}
 }
 return {waitlist,tick,event};
}
