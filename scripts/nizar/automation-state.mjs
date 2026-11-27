// N4 state is stored in the same CAS item as bookings, never in a second capacity store.
import {createHash} from "node:crypto";
import {isChildId} from "./contract.mjs";
import {POLICY,slot,dayStart,HOUR,businessDay} from "./policy.mjs";
export const digest=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
export const emptyN4=()=>({holds:[],waitlist:[],ledger:[],notices:[],excuses:[],events:[]});
export const n4=s=>s.n4??emptyN4();
const time=x=>Number.isSafeInteger(x)&&x>0;
const key=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{16,128}$/.test(x);
const hash=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const month=x=>typeof x==="string"&&/^\d{4}-(0[1-9]|1[0-2])$/.test(x);
const identity=x=>isChildId(x.childId)&&isChildId(x.parentId);
const exact=(x,ks)=>x&&typeof x==="object"&&!Array.isArray(x)&&Object.keys(x).length===ks.length&&ks.every(k=>Object.hasOwn(x,k));
const unique=(arr,fn)=>new Set(arr.map(fn)).size===arr.length;
const slotOk=x=>{try{return slot(x.day,(x.startAt-dayStart(x.day))/HOUR,x.activity).endAt===x.endAt;}catch{return false;}};
export function validateN4(s){
 const a=n4(s),names=["holds","waitlist","ledger","notices","excuses","events"];
 if(!exact(a,names)||names.some(k=>!Array.isArray(a[k])||a[k].length>2000))throw Error("INVALID_N4");
 if(!unique(a.holds,x=>x.childId)||a.holds.some(x=>!exact(x,["childId","parentId","failedAt","deadline","status","cycleId"])||!identity(x)||!time(x.failedAt)||x.deadline!==x.failedAt+POLICY.unpaidHoldMs||!key(x.cycleId)||!["held","released","restored"].includes(x.status)))throw Error("INVALID_HOLD");
 if(!unique(a.waitlist,x=>x.id)||a.waitlist.some(x=>!exact(x,["id","childId","parentId","day","activity","startAt","endAt","joinedAt","status","offeredAt","expiresAt","requestKey"])||!key(x.id)||!identity(x)||!slotOk(x)||!time(x.joinedAt)||x.joinedAt>=x.startAt||!hash(x.requestKey)||!["queued","offered","accepted","declined","expired","ineligible"].includes(x.status)||!(x.offeredAt===null&&x.expiresAt===null||time(x.offeredAt)&&x.offeredAt>=x.joinedAt&&x.offeredAt<x.startAt&&x.expiresAt===Math.min(x.offeredAt+POLICY.offerMs,x.startAt))||(x.status==="offered"&&x.offeredAt===null)))throw Error("INVALID_WAITLIST");
 if(!unique(a.waitlist,x=>x.requestKey))throw Error("DUPLICATE_WAIT_REQUEST");
 const active=a.waitlist.filter(x=>["queued","offered"].includes(x.status));
 if(!unique(active,x=>x.childId+"/"+x.activity+"/"+x.startAt))throw Error("DUPLICATE_WAIT");
 if(!unique(a.ledger,x=>x.id)||a.ledger.some(x=>!exact(x,["id","childId","parentId","month","kind","amount","at","reference"])||!hash(x.id)||!identity(x)||!month(x.month)||!["paid","forfeit","refund-due","refund-paid","forfeit-reversed"].includes(x.kind)||x.amount!==POLICY.depositMinor||!time(x.at)||!key(x.reference)))throw Error("INVALID_DEPOSIT");
 const balances=new Map();
 for(const x of a.ledger){const k=x.childId+"/"+x.month,prev=balances.get(k)??{held:0,due:0};if(x.kind==="paid"){if(prev.held!==0)throw Error("DOUBLE_DEPOSIT");prev.held=5000;}else if(x.kind==="forfeit"){if(prev.held!==5000)throw Error("NO_DEPOSIT");prev.held=0;}else if(x.kind==="forfeit-reversed"){if(prev.held!==0)throw Error("DEPOSIT_REVERSAL_CONFLICT");prev.held=5000;}else if(x.kind==="refund-due"){if(prev.held!==5000||prev.due!==0)throw Error("REFUND_CONFLICT");prev.held=0;prev.due=5000;}else{if(prev.due!==5000)throw Error("REFUND_NOT_DUE");prev.due=0;}balances.set(k,prev);}
 if(!unique(a.notices,x=>x.id)||a.notices.some(x=>!exact(x,["id","childId","parentId","kind","reference","at"])||!hash(x.id)||!identity(x)||!["reminder","no-show-warning","deposit-required","deposit-forfeited","refund-due","waitlist-offer","membership-hold","membership-release","membership-restored","excused"].includes(x.kind)||!key(x.reference)||!time(x.at)))throw Error("INVALID_NOTICE");
 if(!unique(a.excuses,x=>x.bookingId)||a.excuses.some(x=>!exact(x,["bookingId","staffId","reason","at"])||!key(x.bookingId)||!key(x.staffId)||typeof x.reason!=="string"||x.reason.trim()!==x.reason||x.reason.length<3||x.reason.length>300||!time(x.at)||!s.bookings.some(b=>b.bookingId===x.bookingId&&b.bookingStatus==="excused")))throw Error("INVALID_EXCUSE");
 if(!unique(a.events,x=>x.id)||a.events.some(x=>!exact(x,["id","fingerprint","at"])||!hash(x.id)||!hash(x.fingerprint)||!time(x.at)))throw Error("INVALID_EVENTS");
 const counts=new Map();
 for(const b of s.bookings.filter(b=>b.bookingStatus!=="cancelled")){const k=b.activity+"/"+b.startAt;counts.set(k,(counts.get(k)??0)+1);}
 for(const w of active.filter(w=>w.status==="offered")){const k=w.activity+"/"+w.startAt,c=(counts.get(k)??0)+1;if(c>POLICY.capacityPerActivity)throw Error("OFFER_CAPACITY");counts.set(k,c);}
}
export const monthlyNoShows=(s,childId,month)=>s.bookings.filter(b=>b.childId===childId&&b.day.slice(0,7)===month&&b.bookingStatus==="no-show").length;
export function depositBalance(s,childId,month){
 let held=0,due=0;
 for(const e of n4(s).ledger.filter(e=>e.childId===childId&&e.month===month)){
  if(e.kind==="paid"||e.kind==="forfeit-reversed")held=POLICY.depositMinor;
  if(e.kind==="forfeit")held=0;
  if(e.kind==="refund-due"){held=0;due=POLICY.depositMinor;}
  if(e.kind==="refund-paid")due=0;
 }return {held,due};
}
export function effectiveEligibility(s,o,e,now){
 const m=businessDay(now).slice(0,7),b=depositBalance(s,o.childId,m);
 const hold=n4(s).holds.find(h=>h.childId===o.childId&&h.status!=="restored");
 return {...e,membership:hold?"inactive":e?.membership??"unavailable",deposit:monthlyNoShows(s,o.childId,m)>=POLICY.noShowsBeforeDeposit&&b.held!==POLICY.depositMinor?"required":e?.deposit??"unavailable"};
}
export const reservedOffers=(s,target,exceptId=null)=>n4(s).waitlist.filter(w=>w.status==="offered"&&w.id!==exceptId&&w.activity===target.activity&&w.startAt===target.startAt).length;
// Expired offers remain capacity-reserved until the worker atomically advances them.
export const hasQueue=(s,target)=>n4(s).waitlist.some(w=>w.status==="queued"&&w.activity===target.activity&&w.startAt===target.startAt);
export function queueNotice(a,kind,o,reference,at){
 const id=digest([kind,o.childId,reference]);
 if(!a.notices.some(x=>x.id===id))a.notices.push({id,childId:o.childId,parentId:o.parentId,kind,reference,at});
}
export function appendLedger(a,o,month,kind,reference,at){
 const id=digest([kind,o.childId,month,reference]);
 if(!a.ledger.some(x=>x.id===id))a.ledger.push({id,childId:o.childId,parentId:o.parentId,month,kind,amount:POLICY.depositMinor,at,reference});
}
