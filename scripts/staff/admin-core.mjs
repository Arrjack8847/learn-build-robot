// J4 server-only application boundary. Adapters must use the shared authoritative
// booking, visit, membership and payment stores. Do not wire to a browser fixture.
import {formatMonthlySales} from "./sales-export.mjs";
const actions=new Set(["mark-present","mark-paid-at-desk","excuse-no-show","check-out"]);
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
const month=x=>typeof x==="string"&&/^\d{4}-(0[1-9]|1[0-2])$/.test(x);
const date=x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x);
const deny=()=>({ok:false,status:"REFUSED"});
export function createStaffAdmin({identity,store,clock}){
  async function staff(context){
    const a=await identity.resolveStaff(context);
    if(!a||a.accountStatus!=="active"||!["staff","admin"].includes(a.role)||!id(a.staffId)||typeof a.displayName!=="string"||!a.displayName.trim())return null;
    return {staffId:a.staffId,displayName:a.displayName,role:a.role};
  }
  async function overview(context,day){
    const actor=await staff(context);
    if(!actor||!date(day)||day!==clock.localDay())return deny();
    // Adapter returns only approved minimal projections, never codes or pass secrets.
    const data=await store.readDeskOverview({day,actor});
    if(!data||!["bookings","visits","memberships","payments"].every(k=>Array.isArray(data[k])))throw Error("DESK_READ_UNCONFIRMED");
    // Explicit allowlists avoid returning parent emails, birth years, auth data,
    // code digests or provider payloads if an adapter selects too many columns.
    const fields={
      bookings:["bookingId","childId","childName","startAt","endAt","membershipStatus","bookingStatus","attendedAt","checkedOutAt"],
      visits:["bookingId","childName","attendedAt","checkedOutAt","attendanceSource","staffName"],
      memberships:["membershipId","childId","childName","paidThroughMonth","nextChargeAt","paymentStatus","subscriptionStatus"],
      payments:["paymentId","childName","amountMinor","currency","coveredMonth","status","source","providerPaymentId","receiptId"]
    };
    const dataView=Object.fromEntries(Object.entries(fields).map(([k,keys])=>[k,data[k].map(row=>{
      if(!row||typeof row!=="object"||Array.isArray(row))throw Error("INVALID_DESK_ROW");
      return Object.fromEntries(keys.filter(field=>Object.hasOwn(row,field)).map(field=>{
        const value=row[field];
        if(value!==null&&typeof value!=="string"&&typeof value!=="number"&&typeof value!=="boolean")throw Error("INVALID_DESK_FIELD");
        return [field,value];
      }));
    })]));
    return {ok:true,status:"READY",actor,data:dataView};
  }
  async function correct(context,input){
    const actor=await staff(context);
    if(!actor||!input||input.action==="mark-paid-at-desk"||!actions.has(input.action)||!id(input.targetId)||!id(input.requestId)||typeof input.reason!=="string")return deny();
    const reason=input.reason.trim();if(reason.length<3||reason.length>500)return deny();
    // The adapter must atomically check target eligibility and current state, dedupe
    // requestId, apply the change, append audit history, and return a durable receipt.
    // Desk payment must never impersonate a HitPay payment or a verified webhook.
    // Check-out must revoke course access in the same authoritative transition.
    const result=await store.applyAuditedCorrection({actor,action:input.action,targetId:input.targetId,requestId:input.requestId,reason,occurredAt:clock.now()});
    if(result?.committed!==true||!id(result.auditId))return deny();
    return {ok:true,status:"COMMITTED",auditId:result.auditId};
  }
  async function monthlySales(context,period){
    const actor=await staff(context);
    if(!actor||!month(period))return deny();
    // Adapter must supply a reconciled ledger (no pending/failed charges; refunds
    // explicit; unique receipts). Do not infer sales from booking or membership counts.
    const ledger=await store.readReconciledSales({period,actor});
    if(!ledger||!Array.isArray(ledger.rows)||ledger.currency!=="MYR")throw Error("SALES_NOT_RECONCILED");
    return {ok:true,status:"READY",export:formatMonthlySales(ledger,period)};
  }
  return {overview,correct,monthlySales};
}
