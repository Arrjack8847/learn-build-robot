// Durable notification delivery, isolated to the combined private test environment.
import {randomUUID} from "node:crypto";
import {digest,n4} from "../nizar/automation-state.mjs";
import {createJ12345IdentityEnv} from "../j12345/identity-scope.mjs";
import {approvedReceiptRecipient} from "../j123/payment-receipts.mjs";
const lease=60000,windowMs=23*3600000;
const time=x=>Number.isSafeInteger(x)&&x>0,hash=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
export function validateDeliveries(s){
 const rows=s.noticeDelivery??[];
 if(!Array.isArray(rows)||rows.length>2000||new Set(rows.map(x=>x.id)).size!==rows.length)throw Error("INVALID_NOTICE_DELIVERY");
 for(const x of rows){
  if(!x||!hash(x.id)||!n4(s).notices.some(n=>n.id===x.id)||!["claimed","pending","accepted","review","obsolete"].includes(x.status)||!Number.isInteger(x.attempts)||x.attempts<1||x.attempts>3||!time(x.firstAt)||!time(x.leaseUntil)||!hash(x.payloadDigest)||typeof x.claimId!=="string"||!x.claimId||x.status==="accepted"&&(typeof x.providerId!=="string"||!x.providerId||!time(x.acceptedAt)))throw Error("INVALID_NOTICE_DELIVERY");
 }
}
const text={
 "no-show-warning":"A missed session has been recorded. A second missed session in this calendar month requires an RM50 refundable deposit before further bookings.",
 "deposit-required":"Further bookings require an RM50 refundable deposit. Please check the parent portal.",
 "deposit-forfeited":"A further unexcused absence has forfeited the held RM50 deposit. Please check the parent portal before booking again.",
 "refund-due":"An unused deposit is refundable in cash. Please contact the Lab desk.",
 "membership-hold":"A verified failed renewal has placed upcoming reservations on a 24-hour hold. Check membership status in the parent portal.",
 "membership-release":"The unpaid membership hold has ended. Check the parent portal for released reservations.",
 "membership-restored":"Membership payment has been verified. Check the parent portal for remaining reservations.",
 "excused":"A staff member has excused an absence. Check the parent portal for the updated record."
};
const myt=t=>new Date(t+8*3600000).toISOString().slice(0,16).replace("T"," ")+" MYT";
function messageFor(state,n,now){
 if(n.kind==="waitlist-offer"){const w=n4(state).waitlist.find(x=>x.id===n.reference&&x.childId===n.childId&&x.status==="offered");return w&&now<w.expiresAt?"A "+w.activity+" session is offered for "+myt(w.startAt)+". Accept in the parent portal before "+myt(w.expiresAt)+".":null;}
 if(n.kind==="reminder"){const b=state.bookings.find(b=>b.childId===n.childId&&b.revision===n.reference&&b.bookingStatus==="booked");return b&&now<b.startAt?"Your "+b.activity+" session begins "+myt(b.startAt)+". Please arrive on time.":null;}
 return text[n.kind]??null;
}
export async function flushCombinedNotices({env,runtime,request=fetch,clock=Date.now,newId=randomUUID,limit=10}){
 if(env.COMBINED_NOTICE_ENABLED!=="1")return {status:"disabled",sent:0};
 const cfg=createJ12345IdentityEnv(env),repo=runtime.repository;
 let sent=0,pending=0;
 async function write(snap,row){return (await repo.compareAndSet(snap.version,{...snap.state,noticeDelivery:[...(snap.state.noticeDelivery??[]).filter(x=>x.id!==row.id),row]})).status==="committed";}
 const snapshot=await repo.read();
 for(const n of n4(snapshot.state).notices.filter(n=>!["accepted","obsolete","review"].includes(snapshot.state.noticeDelivery?.find(x=>x.id===n.id)?.status)).slice(0,limit)){
  const snap=await repo.read(),j=snap.state.noticeDelivery?.find(x=>x.id===n.id),now=clock();
  if(j&&(["accepted","review","obsolete"].includes(j.status)||j.leaseUntil>now))continue;
  const owner=await runtime.readOwner(n.childId,n.parentId),recipient=approvedReceiptRecipient(cfg,n.parentId);
  if(!owner||!recipient){pending++;continue;}
  const content=messageFor(snap.state,n,now);
  const body=JSON.stringify({from:"BE STEM READY <"+cfg.PARENT_PREVIEW_VERIFIED_SENDER+">",to:[recipient],subject:"STEM Makers Lab — booking notice",text:"PRIVATE DEVELOPMENT TEST\nStudent: "+owner.name+"\n"+(content??"Notice no longer applicable.")+"\nNo real family information should be entered in this preview."});
  const firstAt=j?.firstAt??now,payloadDigest=digest(body),base={id:n.id,attempts:j?.attempts??1,firstAt,leaseUntil:now+lease,payloadDigest:j?.payloadDigest??payloadDigest,claimId:newId()};
  if(!content||now-firstAt>=windowMs||(j?.attempts??0)>=3||j&&j.payloadDigest!==payloadDigest){await write(snap,{...base,status:!content&&!j?"obsolete":"review"});continue;}
  const claim={...base,status:"claimed",attempts:(j?.attempts??0)+1};
  if(!await write(snap,claim)){pending++;continue;}
  const current=await repo.read(),c=current.state.noticeDelivery?.find(x=>x.id===n.id),fresh=await runtime.readOwner(n.childId,n.parentId);
  if(c?.claimId!==claim.claimId||c.status!=="claimed"||clock()>=claim.leaseUntil||!fresh||fresh.stateVersion!==owner.stateVersion||messageFor(current.state,n,clock())!==content){pending++;continue;}
  let result;
  try{const res=await request("https://api.resend.com/emails",{method:"POST",headers:{Authorization:"Bearer "+cfg.RESEND_API_KEY,"Content-Type":"application/json","Idempotency-Key":"combined-notice-"+n.id},body,redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});if(!res.ok)throw Error("UNCONFIRMED");const p=await res.json();if(typeof p.id!=="string"||!p.id)throw Error("UNCONFIRMED");result={...claim,status:"accepted",providerId:p.id,acceptedAt:clock()};}catch{result={...claim,status:"pending"};}
  const after=await repo.read();if(after.state.noticeDelivery?.find(x=>x.id===n.id)?.claimId!==claim.claimId||!await write(after,result)){pending++;continue;}
  if(result.status==="accepted")sent++;else pending++;
 }
 return {status:pending?"pending":"processed",sent,pending};
}
