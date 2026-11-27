import test from "node:test";
import assert from "node:assert/strict";
import {COMBINED_BRANCH,COMBINED_SITE,COMBINED_RECORD,COMBINED_SCOPE,combinedRepositoryEnabled} from "../scripts/combined/scope.mjs";
import {NIZAR_BRANCH,RECORD_ID} from "../scripts/nizar/contract.mjs";
import {createSchedulingRepository} from "../scripts/nizar/repository.mjs";
import {createCombinedBookingProjection} from "../scripts/combined/booking-projection.mjs";
import {slot} from "../scripts/nizar/policy.mjs";
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:COMBINED_BRANCH,WIX_DEV_SITE_ID:COMBINED_SITE,COMBINED_SCHEDULING_ENABLED:"1"};
const now=Date.parse("2026-11-27T10:30:00+08:00"),id=n=>"qa-j2-"+n.toString(16).padStart(64,"0");
test("exact combined scope refuses production, unrelated branch, fixture flags and disabled settings",()=>{
 assert.equal(combinedRepositoryEnabled(env),true);
 for(const extra of [{VERCEL_ENV:"production"},{VERCEL_TARGET_ENV:"production"},{VERCEL_GIT_COMMIT_REF:NIZAR_BRANCH},{WIX_DEV_SITE_ID:"other"},{COMBINED_SCHEDULING_ENABLED:"0"},{NIZAR_FIXTURE_ENABLED:"1"},{NIZAR_STAFF_FIXTURE_ENABLED:"1"}])assert.equal(combinedRepositoryEnabled({...env,...extra}),false);
});
test("combined record and fixture record are separate; fixture state cannot be read as combined",async()=>{
 const rows=new Map(),db={get:async(c,k)=>structuredClone(rows.get(k)??null),insert:async(c,k,v)=>{if(rows.has(k))return false;rows.set(k,structuredClone(v));return true;},replaceIfVersion:async()=>false};
 const combined=createSchedulingRepository({env,db,clock:()=>now}),fixture=createSchedulingRepository({env:{...env,VERCEL_GIT_COMMIT_REF:NIZAR_BRANCH,NIZAR_SCHEDULING_ENABLED:"1"},db,clock:()=>now});
 const a=await fixture.read();assert.equal((await fixture.compareAndSet(null,a.state)).status,"committed");
 const b=await combined.read();assert.equal(b.version,null);assert.equal(b.state.scope,COMBINED_SCOPE);
 assert.equal((await combined.compareAndSet(null,b.state)).status,"committed");
 assert.notEqual(RECORD_ID,COMBINED_RECORD);assert.equal(rows.size,2);
 rows.set(COMBINED_RECORD,structuredClone(rows.get(RECORD_ID)));await assert.rejects(combined.read(),/INVALID_SCHEDULE/);
});
test("shared projection reads exact scheduled hour without synthesizing attendance or granting course access",async()=>{
 const child={childId:id(1),parentId:id(2),stateVersion:"v1",accountStatus:"preview-test"};
 const booking={...slot("2026-11-27",10,"robotics"),bookingId:"combined-booking-001",revision:"combined-revision-01",childId:child.childId,parentId:child.parentId,bookingStatus:"booked",createdAt:now-7200000,updatedAt:now-7200000};
 let state={bookings:[booking]},version="v1";
 const read=createCombinedBookingProjection({repository:{read:async()=>({state:structuredClone(state),version})},readVerifiedChild:async()=>child,clock:()=>now});
 const p=await read({studentId:child.childId,parentId:child.parentId});assert.equal(p.attendanceStatus,"booked");assert.equal(p.checkInAt,null);assert.equal(p.bookingEndAt,booking.endAt);assert.equal(Object.hasOwn(p,"learningAccess"),false);
 assert.equal((await read({studentId:child.childId,parentId:id(3)})).attendanceStatus,"unavailable");
 state.bookings[0].bookingStatus="attended";assert.equal((await read({studentId:child.childId,parentId:child.parentId})).attendanceStatus,"unavailable");
 state.n5=[{bookingId:booking.bookingId,kind:"verified-check-in",at:now-60000}];
 assert.equal((await read({studentId:child.childId,parentId:child.parentId})).checkInStatus,"checked_in");
});
