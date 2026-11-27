import test from "node:test";
import assert from "node:assert/strict";
import {POLICY,slot,canBookSlot,canCancel,businessDay,HOUR} from "../scripts/nizar/policy.mjs";
import {NIZAR_BRANCH,attendanceBooking,parentBooking,validateBooking} from "../scripts/nizar/contract.mjs";
import {createSchedulingRepository} from "../scripts/nizar/repository.mjs";
const now=Date.parse("2026-11-27T10:00:00+08:00"),day=businessDay(now);
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:NIZAR_BRANCH,NIZAR_SCHEDULING_ENABLED:"1"};
const child=n=>"qa-j2-"+n.toString(16).padStart(64,"0");
const booking=(n,activity="robotics")=>({...slot(day,11,activity),bookingId:"booking-fixture-"+n,childId:child(n),parentId:child(99),revision:"revision-fixture-"+n,bookingStatus:"booked",createdAt:now,updatedAt:now});
test("approved slots, breaks and seven-day inclusive MYT horizon",()=>{
 assert.equal(POLICY.openHours.length,10);assert.equal(POLICY.capacityPerActivity,5);
 for(const h of [9,12,18,22])assert.throws(()=>slot(day,h,"robotics"));
 assert.equal(canBookSlot(slot("2026-12-04",10,"drone"),now),true);
 assert.equal(canBookSlot(slot("2026-12-05",10,"drone"),now),false);
 assert.equal(canBookSlot(slot(day,10,"drone"),now),false);
 assert.equal(canBookSlot(slot(day,10,"drone"),now,{walkIn:true}),true);
 assert.equal(canCancel(now+2*HOUR,now),true);assert.equal(canCancel(now+2*HOUR-1,now),false);
});
test("attendance binding expires precisely at booking end",()=>{
 const b=booking(1);
 assert.equal(attendanceBooking(b,b.childId,b.parentId,b.startAt-1),null);
 assert.equal(attendanceBooking(b,b.childId,b.parentId,b.endAt),null);
 assert.equal(attendanceBooking(b,child(2),b.parentId,b.startAt),null);
 assert.equal(attendanceBooking(b,b.childId,b.parentId,b.startAt).bookingEndAt,b.endAt);
});
test("one aggregate, separate activity pools, conditional conflict, cross-activity daily limit",async()=>{
 let row=null,version=0;const db={get:async()=>structuredClone(row),insert:async(c,k,v)=>{if(row)return false;row=structuredClone(v);return true;},replaceIfVersion:async(c,k,e,v)=>{if(row?.stateVersion!==e)return false;row=structuredClone(v);return true;}};
 const r=createSchedulingRepository({env,db,newId:()=>String(++version),clock:()=>now});
 const initial=await r.read(),five=Array.from({length:5},(_,i)=>booking(i+1));
 const state={...initial.state,bookings:[...five,...Array.from({length:5},(_,i)=>booking(i+6,"drone"))]};
 assert.equal((await r.compareAndSet(null,state)).status,"committed");
 assert.equal((await r.compareAndSet(null,initial.state)).status,"conflict");
 const latest=await r.read();assert.equal(latest.state.bookings.length,10);
 await assert.rejects(r.compareAndSet(latest.version,{...latest.state,bookings:[...five,booking(11)]}),/CAPACITY/);
 await assert.rejects(r.compareAndSet(latest.version,{...latest.state,bookings:[booking(1),{...booking(2,"drone"),childId:child(1)}]}),/DAILY_LIMIT/);
 assert.throws(()=>createSchedulingRepository({env:{...env,NIZAR_SCHEDULING_ENABLED:"0"},db}),/DISABLED/);
 assert.throws(()=>createSchedulingRepository({env:{...env,VERCEL_ENV:"production"},db}),/DISABLED/);
});

test("booking projections reject extra private fields and cross-parent reads",()=>{
 const b=booking(1);assert.equal(validateBooking({...b,secret:"private"}),false);
 assert.equal(parentBooking(b,child(2)),null);assert.equal(Object.hasOwn(parentBooking(b,b.parentId),"parentId"),false);
});
test("seven-upcoming invariant and uncertain provider response remain fail-closed",async()=>{
 const db={get:async()=>null,insert:async()=>{throw Error("unconfirmed provider response");}};
 const r=createSchedulingRepository({env,db,clock:()=>now,newId:()=>"version1"});
 const {state}=await r.read();
 const eight=Array.from({length:8},(_,i)=>({...booking(i+1),...slot(new Date(now+8*HOUR+i*24*HOUR).toISOString().slice(0,10),11,"robotics"),childId:child(1)}));
 await assert.rejects(r.compareAndSet(null,{...state,bookings:eight}),/UPCOMING_LIMIT/);
 assert.equal((await r.compareAndSet(null,{...state,bookings:[booking(1)]})).status,"unconfirmed");
});
