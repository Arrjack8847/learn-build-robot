import {isChildId} from "../nizar/contract.mjs";
import {n4,digest} from "../nizar/automation-state.mjs";
export const deposits=s=>s.deposits??[];
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x),hash=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x),time=x=>Number.isSafeInteger(x)&&x>0,month=x=>typeof x==="string"&&/^\d{4}-(0[1-9]|1[0-2])$/.test(x),owner=x=>isChildId(x.childId)&&isChildId(x.parentId);
export function validateDeposits(s){
 const rows=deposits(s),audit=s.refunds??[],open=new Set(),ids=new Set(),providers=new Set(),payments=new Set(),keys=new Set();
 if(!Array.isArray(rows)||rows.length>1000||!Array.isArray(audit)||audit.length>1000)throw Error("INVALID_FINANCE_STATE");
 for(const r of rows){
  if(!r||!owner(r)||!id(r.id)||ids.has(r.id)||!hash(r.requestKey)||keys.has(r.requestKey)||!month(r.month)||!time(r.createdAt)||!["dispatching","pending","settled"].includes(r.status)||r.amountMinor!==5000||r.currency!=="MYR")throw Error("INVALID_DEPOSIT_RESERVATION");
  ids.add(r.id);keys.add(r.requestKey);
  if(r.status!=="settled"){if(open.has(r.childId))throw Error("DUPLICATE_OPEN_DEPOSIT");open.add(r.childId);}
  if(r.status==="dispatching"?r.providerId!==null:!id(r.providerId)||providers.has(r.providerId))throw Error("INVALID_DEPOSIT_PROVIDER");
  if(r.providerId)providers.add(r.providerId);
  if(r.status==="settled"){
   if(!id(r.paymentId)||payments.has(r.paymentId)||!hash(r.eventKey)||!time(r.paidAt)||r.paidAt<r.createdAt||!n4(s).ledger.some(l=>l.kind==="paid"&&l.childId===r.childId&&l.parentId===r.parentId&&l.month===r.month&&l.reference===digest(["deposit-charge",r.paymentId])))throw Error("INVALID_DEPOSIT_SETTLEMENT");
   payments.add(r.paymentId);
  }else if(r.paymentId!==null||r.eventKey!==null||r.paidAt!==null)throw Error("INVALID_DEPOSIT_SETTLEMENT");
 }
 const receipts=new Set();
 for(const a of audit){
  if(!a||!owner(a)||!month(a.month)||!id(a.staffId)||!id(a.receiptId)||receipts.has(a.receiptId)||!hash(a.eventKey)||!time(a.at)||typeof a.note!=="string"||a.note.length<3||a.note.length>300||!n4(s).ledger.some(l=>l.kind==="refund-paid"&&l.childId===a.childId&&l.parentId===a.parentId&&l.month===a.month&&l.reference===a.receiptId))throw Error("INVALID_REFUND_AUDIT");receipts.add(a.receiptId);
 }
}
