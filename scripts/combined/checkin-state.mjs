import {isChildId} from "../nizar/contract.mjs";
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{16,128}$/.test(x),hash=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x),time=x=>Number.isSafeInteger(x)&&x>0;
export const codes=s=>s.checkins??[];
export function validateCheckins(s){
 const rows=codes(s),keys=["id","bookingId","bookingRevision","childId","parentId","day","digest","issuedAt","expiresAt","attempts","status","issuerId","grantRevision","sessionDigest","validUntil","memberUntil"];
 if(!Array.isArray(rows)||rows.length>2000||new Set(rows.map(x=>x.id)).size!==rows.length||new Set(rows.map(x=>x.day+"/"+x.digest)).size!==rows.length)throw Error("INVALID_CHECKIN_STATE");
 const active=new Set();
 for(const c of rows){
  if(!c||Object.keys(c).length!==keys.length||!keys.every(k=>Object.hasOwn(c,k))||!id(c.id)||!id(c.bookingId)||!id(c.bookingRevision)||!isChildId(c.childId)||!isChildId(c.parentId)||!/^\d{4}-\d{2}-\d{2}$/.test(c.day)||!hash(c.digest)||!time(c.issuedAt)||!time(c.expiresAt)||c.expiresAt<=c.issuedAt||c.expiresAt-c.issuedAt>300000||!Number.isInteger(c.attempts)||c.attempts<0||c.attempts>3||!id(c.issuerId)||!["issued","locked","revoked","redeemed"].includes(c.status))throw Error("INVALID_CHECKIN");
  const b=s.bookings.find(x=>x.bookingId===c.bookingId&&x.childId===c.childId&&x.parentId===c.parentId);if(!b)throw Error("ORPHAN_CODE");
  if(c.status!=="revoked"){if(active.has(c.bookingId))throw Error("MULTIPLE_ACTIVE_CODES");active.add(c.bookingId);}
  if(c.status==="redeemed"){if(!id(c.grantRevision)||!hash(c.sessionDigest)||!time(c.validUntil)||!time(c.memberUntil)||c.validUntil>c.memberUntil||c.attempts<1)throw Error("INVALID_PASS");}
  else if([c.grantRevision,c.sessionDigest,c.validUntil,c.memberUntil].some(x=>x!==null))throw Error("INVALID_PASS");
  if(c.status==="issued"&&c.attempts===3||c.status==="locked"&&c.attempts!==3)throw Error("INVALID_ATTEMPTS");
 }
}
