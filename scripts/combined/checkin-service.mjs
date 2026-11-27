import {createHmac,randomInt,randomUUID,timingSafeEqual} from "node:crypto";
import {businessDay} from "../nizar/policy.mjs";
import {isChildId} from "../nizar/contract.mjs";
import {effectiveEligibility,digest} from "../nizar/automation-state.mjs";
import {staffAudit} from "../nizar/staff-state.mjs";
import {codes} from "./checkin-state.mjs";
const fail=()=>({ok:false,status:"REFUSED"});
const validId=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{16,128}$/.test(x);
const matches=(a,b)=>typeof a==="string"&&typeof b==="string"&&/^[a-f0-9]{64}$/.test(a)&&/^[a-f0-9]{64}$/.test(b)&&timingSafeEqual(Buffer.from(a,"hex"),Buffer.from(b,"hex"));
const inHour=(b,now)=>b&&now>=b.startAt&&now<b.endAt&&b.day===businessDay(now)&&["booked","attended"].includes(b.bookingStatus);
export const revokeCheckin=c=>({...c,status:"revoked",claimId:null,grantRevision:null,sessionDigest:null,validUntil:null,memberUntil:null});
const revoke=revokeCheckin;
const sameOwner=(a,b)=>a&&b&&a.childId===b.childId&&a.parentId===b.parentId&&a.stateVersion===b.stateVersion;
export function createCombinedCheckin({repository,resolveStaff,resolveStudent,readOwner,readEligibility,secret,clock=Date.now,newId=randomUUID,newCode=()=>String(randomInt(100000000)).padStart(8,"0")}){
 if(typeof secret!=="string"||! /^[a-f0-9]{64}$/.test(secret))throw Error("CHECKIN_DISABLED");
 const mac=(purpose,...v)=>createHmac("sha256",Buffer.from(secret,"hex")).update(JSON.stringify([purpose,...v])).digest("hex");
 const codeDigest=(day,code)=>mac("code-v1",day,code);
 const student=async actor=>{const a=await resolveStudent(actor);return a&&isChildId(a.childId)&&typeof a.sessionToken==="string"&&/^[a-zA-Z0-9_-]{43}$/.test(a.sessionToken)?{childId:a.childId,sessionDigest:mac("pass-session-v1",a.sessionToken)}:null;};
 const staff=async actor=>{const a=await resolveStaff(actor);return a&&validId(a.staffId)&&a.permissions?.includes("schedule:attendance")?a:null;};
 const paid=async(s,o,now)=>{const e=effectiveEligibility(s,o,await readEligibility(o),now);return e.membership==="active"&&Number.isSafeInteger(e.validUntil)&&e.validUntil>now?e:null;};
 async function issue(actor,{bookingId,revision,childId}){
  if(!validId(bookingId)||!validId(revision)||!isChildId(childId))return fail();
  try{for(let retry=0;retry<8;retry++){
   const a=await staff(actor);if(!a)return fail();
   const snap=await repository.read(),s=structuredClone(snap.state),now=clock(),b=s.bookings.find(x=>x.bookingId===bookingId&&x.childId===childId&&x.revision===revision);
   if(!inHour(b,now))return fail();
   const o=await readOwner(childId,b.parentId);if(o?.childId!==childId||o.parentId!==b.parentId||!await paid(s,o,now))return fail();
   const fresh=await staff(actor);if(fresh?.staffId!==a.staffId||fresh.version!==a.version||!sameOwner(o,await readOwner(childId,b.parentId)))return fail();
   const finalEligibility=await paid(s,o,clock()),at=clock();if(!inHour(b,at)||!finalEligibility||at>=finalEligibility.validUntil)return fail();
   let plain,d;for(let n=0;n<50;n++){plain=newCode();if(!/^\d{8}$/.test(plain))return fail();d=codeDigest(b.day,plain);if(!codes(s).some(c=>c.day===b.day&&c.digest===d))break;plain=null;}
   if(!plain)return fail();
   const row={id:newId(),bookingId:b.bookingId,bookingRevision:b.revision,childId:b.childId,parentId:b.parentId,day:b.day,digest:d,issuedAt:at,expiresAt:Math.min(at+300000,b.endAt),attempts:0,status:"issued",claimId:null,issuerId:a.staffId,grantRevision:null,sessionDigest:null,validUntil:null,memberUntil:null};
   s.checkins=[...codes(s).map(c=>c.bookingId===b.bookingId?revoke(c):c),row];
   const saved=await repository.compareAndSet(snap.version,s);if(saved.status==="conflict")continue;if(saved.status!=="committed")return fail();
   return {ok:true,status:"ISSUED",code:plain,expiresAt:row.expiresAt};
  }}catch{}return fail();
 }
 // Claim the attempt durably BEFORE any code comparison. Concurrent requests cannot
 // observe correctness or consume another attempt while a claim is in flight.
 // An interrupted/unconfirmed claim is fail-closed; staff must issue a new code.
 async function redeem(actor,{bookingId,code}){
  if(!validId(bookingId)||typeof code!=="string"||code.length>32)return fail();
  try{
   const a=await student(actor);if(!a)return fail();
   let claim=null;
   for(let retry=0;retry<8;retry++){
    const snap=await repository.read(),s=structuredClone(snap.state),now=clock(),b=s.bookings.find(x=>x.bookingId===bookingId&&x.childId===a.childId);
    if(!inHour(b,now))return fail();
    const c=codes(s).find(c=>c.bookingId===b.bookingId&&c.bookingRevision===b.revision&&c.status==="issued");
    if(!c||now>=c.expiresAt||c.attempts>=3)return fail();
    const o=await readOwner(b.childId,b.parentId),e=o&&await paid(s,o,now);
    if(!e||o.childId!==b.childId||o.parentId!==b.parentId)return fail();
    const fresh=await student(actor);
    if(fresh?.childId!==a.childId||fresh.sessionDigest!==a.sessionDigest||!sameOwner(o,await readOwner(b.childId,b.parentId)))return fail();
    const at=clock();if(!inHour(b,at)||at>=c.expiresAt||at>=e.validUntil)return fail();
    const claimId=newId();
    s.checkins=codes(s).map(x=>x.id===c.id?{...x,attempts:x.attempts+1,status:"checking",claimId}:x);
    const saved=await repository.compareAndSet(snap.version,s);
    if(saved.status==="conflict")continue;
    if(saved.status!=="committed")return fail();
    claim={id:c.id,claimId,bookingRevision:b.revision,owner:o};break;
   }
   if(!claim)return fail();
   for(let retry=0;retry<8;retry++){
    const snap=await repository.read(),s=structuredClone(snap.state),now=clock(),b=s.bookings.find(x=>x.bookingId===bookingId&&x.childId===a.childId&&x.revision===claim.bookingRevision);
    const c=codes(s).find(x=>x.id===claim.id&&x.status==="checking"&&x.claimId===claim.claimId);
    if(!c||!inHour(b,now)||now>=c.expiresAt)return fail();
    const fresh=await student(actor),o=await readOwner(b.childId,b.parentId),e=o&&await paid(s,o,now);
    if(fresh?.childId!==a.childId||fresh.sessionDigest!==a.sessionDigest||!sameOwner(o,claim.owner)||!e)return fail();
    const at=clock();if(!inHour(b,at)||at>=c.expiresAt||at>=e.validUntil)return fail();
    const correct=/^\d{8}$/.test(code)&&matches(codeDigest(c.day,code),c.digest);
    let next={...c,claimId:null,status:c.attempts===3?"locked":"issued"};
    if(correct){
     const revision=newId(),audit=staffAudit(s);
     if(b.bookingStatus==="booked")s.n5=[...audit,{key:digest(["combined-code",c.id]),fingerprint:digest([c.id,b.bookingId,b.childId]),bookingId:b.bookingId,childId:b.childId,actorId:c.id,kind:"verified-check-in",at,revision,reason:""}];
     else if(!audit.some(x=>x.bookingId===b.bookingId&&["manual-attendance","verified-check-in"].includes(x.kind)))return fail();
     s.bookings=s.bookings.map(x=>x.bookingId===b.bookingId?{...x,bookingStatus:"attended",revision,updatedAt:at}:x);
     next={...next,status:"redeemed",grantRevision:revision,sessionDigest:a.sessionDigest,validUntil:Math.min(b.endAt,e.validUntil),memberUntil:e.validUntil};
    }
    s.checkins=codes(s).map(x=>x.id===c.id?next:x);
    const saved=await repository.compareAndSet(snap.version,s);if(saved.status==="conflict")continue;
    return saved.status==="committed"&&correct?{ok:true,status:"CHECKED_IN",bookingId:b.bookingId,validUntil:next.validUntil}:fail();
   }
  }catch{}return fail();
 }
 async function verifyPass(actor){
  try{
   const a=await student(actor);if(!a)return null;
   const snap=await repository.read(),s=snap.state,now=clock(),b=s.bookings.find(x=>x.childId===a.childId&&x.bookingStatus==="attended"&&inHour(x,now));
   if(!b)return null;
   const c=codes(s).find(x=>x.bookingId===b.bookingId&&x.status==="redeemed"&&x.grantRevision===b.revision&&matches(x.sessionDigest,a.sessionDigest));
   if(!c||now>=c.validUntil)return null;
   const o=await readOwner(b.childId,b.parentId),e=o&&await paid(s,o,now);
   if(!e||e.validUntil!==c.memberUntil){
    // Once membership loss or a changed billing period is observed, retire the grant.
    // Do not revive an old grant after recovery; require a newly issued code.
    try{await repository.compareAndSet(snap.version,{...s,checkins:codes(s).map(x=>x.id===c.id?revoke(x):x)});}catch{}
    return null;
   }
   const fresh=await student(actor);
   if(fresh?.childId!==a.childId||fresh.sessionDigest!==a.sessionDigest||!sameOwner(o,await readOwner(b.childId,b.parentId))||(await repository.read()).version!==snap.version||clock()>=c.validUntil)return null;
   return {bookingId:b.bookingId,revision:b.revision,validUntil:c.validUntil};
  }catch{return null;}
 }
 return {issue,redeem,verifyPass};
}
