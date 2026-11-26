// J4 desk application service. Only verified staff can call these operations.
// The store adapter is responsible for atomic capacity, eligibility, duplicate
// prevention, and audit persistence; a read-then-write booking is not acceptable.
const id=v=>typeof v==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(v);
const refuse=()=>({ok:false,status:"REFUSED"});
export function createDeskOperations({identity,store,clock}){
  async function actorFor(context){
    const actor=await identity.resolveStaff(context);
    if(!actor||actor.accountStatus!=="active"||!["staff","admin"].includes(actor.role)||!id(actor.staffId)||typeof actor.displayName!=="string"||!actor.displayName.trim())return null;
    return {staffId:actor.staffId,displayName:actor.displayName,role:actor.role};
  }
  async function walkInOptions(context){
    const actor=await actorFor(context);
    if(!actor)return refuse();
    // Server determines current hour from approved Lab operating hours and capacity.
    // Expose no available slot when rules are unknown, Lab is closed or full.
    const slots=await store.readCurrentWalkInSlots({actor,now:clock.now()});
    if(!Array.isArray(slots))throw Error("WALK_IN_AVAILABILITY_UNCONFIRMED");
    return {ok:true,status:"READY",slots:slots.filter(s=>s&&id(s.slotId)&&Number.isSafeInteger(s.startAt)&&Number.isSafeInteger(s.endAt)&&s.startAt<=clock.now()&&s.endAt>clock.now()&&Number.isSafeInteger(s.remaining)&&s.remaining>0).map(s=>({slotId:s.slotId,startAt:s.startAt,endAt:s.endAt,remaining:s.remaining}))};
  }
  async function createWalkIn(context,input){
    const actor=await actorFor(context);
    if(!actor||!input||!id(input.childId)||!id(input.slotId)||!id(input.requestId)||typeof input.reason!=="string"||input.reason.trim().length<3||input.reason.trim().length>500)return refuse();
    // One transaction must verify staff authorization, membership, current hour,
    // approved walk-in policy, no conflicting booking, shared capacity and request
    // identity. No client-controlled dates, membership state, price or capacity.
    const result=await store.createAuditedWalkIn({actor,childId:input.childId,slotId:input.slotId,requestId:input.requestId,reason:input.reason.trim(),occurredAt:clock.now()});
    if(result?.committed!==true||!id(result.bookingId)||!id(result.auditId))return refuse();
    return {ok:true,status:"BOOKED",bookingId:result.bookingId,auditId:result.auditId};
  }
  async function receipt(context,receiptId){
    const actor=await actorFor(context);
    if(!actor||!id(receiptId))return refuse();
    // Receipts are existing durable records only. Printing never creates a payment
    // or changes a membership. Final receipt numbering and fields need approval.
    const row=await store.readIssuedReceipt({actor,receiptId});
    if(!row||row.receiptId!==receiptId||row.status!=="issued"||typeof row.currency!=="string"||!/^[A-Z]{3}$/.test(row.currency)||!Number.isSafeInteger(row.amountMinor)||row.amountMinor<=0||!id(row.paymentId)||!["desk","hitpay"].includes(row.source)||typeof row.coveredMonth!=="string"||!/^\d{4}-(0[1-9]|1[0-2])$/.test(row.coveredMonth)||typeof row.childName!=="string"||!Number.isSafeInteger(row.issuedAt))return refuse();
    return {ok:true,status:"READY",receipt:{receiptId:row.receiptId,paymentId:row.paymentId,source:row.source,childName:row.childName,coveredMonth:row.coveredMonth,amountMinor:row.amountMinor,currency:row.currency,issuedAt:row.issuedAt}};
  }
  return {walkInOptions,createWalkIn,receipt};
}
