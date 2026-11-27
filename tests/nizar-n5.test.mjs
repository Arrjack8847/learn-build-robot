import test from "node:test";
import assert from "node:assert/strict";
import {createSchedulingRepository} from "../scripts/nizar/repository.mjs";
import {createBookingService} from "../scripts/nizar/booking-service.mjs";
import {createStaffSchedulingService,createSharedAttendanceAdapter} from "../scripts/nizar/staff-service.mjs";
import {createN4Service} from "../scripts/nizar/automation-service.mjs";
import {createStaffFixtureHttp,staffFixtureEnabled} from "../scripts/nizar/staff-http.mjs";
import {renderNizarStaffPreview} from "../scripts/nizar/staff-page.mjs";
import {NIZAR_BRANCH} from "../scripts/nizar/contract.mjs";
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:NIZAR_BRANCH,NIZAR_SCHEDULING_ENABLED:"1",NIZAR_FIXTURE_ENABLED:"1",NIZAR_FIXTURE_OPERATOR_KEY:"0123456789abcdef".repeat(4),NIZAR_STAFF_FIXTURE_ENABLED:"1",NIZAR_STAFF_FIXTURE_KEY:"fedcba9876543210".repeat(4),VERCEL_URL:"example.test"};
const day="2026-11-27",at=(h,m=0)=>Date.parse(day+"T"+String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":00+08:00");
const id=n=>"qa-j2-"+n.toString(16).padStart(64,"0");
function setup(){
 let row=null,t=at(8);const db={get:async()=>structuredClone(row),insert:async(c,k,v)=>{if(row)return false;row=structuredClone(v);return true},replaceIfVersion:async(c,k,e,v)=>{if(row?.stateVersion!==e)return false;row=structuredClone(v);return true}};
 const repository=createSchedulingRepository({env,db,clock:()=>t});
 const owner=c=>({childId:c,parentId:id(100),name:"Student "+c.slice(-3),stateVersion:"v1"});
 const readOwner=async(c,p)=>p===null||p===id(100)?owner(c):null;
 const readEligibility=async o=>({membership:o.childId===id(99)?"inactive":"active",deposit:"clear"});
 const resolveChild=async(a,c)=>a==="parent"?owner(c):null;
 const resolveStaff=async a=>a==="staff"?{staffId:"fixture-staff-001",version:"v1",permissions:["schedule:read","schedule:walk-in","schedule:attendance"]}:a==="reader"?{staffId:"fixture-reader-001",version:"v1",permissions:["schedule:read"]}:null;
 const deps={repository,clock:()=>t,readOwner,readEligibility,resolveChild};
 const booking=createBookingService(deps),staff=createStaffSchedulingService({...deps,resolveStaff}),adapter=createSharedAttendanceAdapter(deps);
 return {repository,booking,staff,adapter,setTime:x=>t=x,deps,resolveStaff};
}
const book=(n,activity="robotics",hour=10)=>({action:"book",childId:id(n),day,hour,activity,requestId:"fixture-book-"+n+"-"+activity+"-"+hour});
const walk=(n,activity="robotics")=>({action:"walk-in",childId:id(n),activity,reason:"Fixture desk visit",requestId:"fixture-walk-"+n+"-"+activity});
test("day view matches parent availability, separates pools, omits parent identifiers",async()=>{
 const s=setup();
 for(let n=1;n<=5;n++)assert.equal((await s.booking(book(n),"parent")).ok,true);
 assert.equal((await s.booking(book(6,"drone"),"parent")).ok,true);
 const parent=await s.booking({action:"view",childId:id(7)},"parent");
 const staff=await s.staff.dayView("staff",day);assert.equal(staff.ok,true);
 assert.equal(staff.slots.length,20);assert.equal(staff.totals.bookings,6);
 for(const slot of parent.days.find(d=>d.day===day).slots){const other=staff.slots.find(x=>x.startAt===slot.startAt&&x.activity===slot.activity);assert.equal(other.remaining,slot.remaining);}
 const b=staff.slots.flatMap(x=>x.bookings)[0];assert.equal(Object.hasOwn(b,"parentId"),false);
 assert.equal((await s.staff.dayView("parent",day)).status,"NOT_AUTHORIZED");
 assert.equal((await s.staff.mutate(walk(7),"reader")).status,"NOT_AUTHORIZED");
});
test("walk-in uses current hour, rejects breaks, unpaid and full pools; duplicate is idempotent",async()=>{
 const s=setup();for(let n=1;n<=4;n++)assert.equal((await s.booking(book(n),"parent")).ok,true);
 assert.equal((await s.staff.mutate(walk(8),"staff")).status,"LAB_CLOSED");s.setTime(at(10,10));
 assert.equal((await s.staff.mutate(walk(99),"staff")).status,"MEMBERSHIP_REQUIRED");
 assert.equal((await s.staff.mutate(walk(1,"drone"),"staff")).status,"DAILY_LIMIT");
 const results=await Promise.all([s.staff.mutate(walk(5),"staff"),s.staff.mutate(walk(6),"staff")]);
 assert.equal(results.filter(x=>x.ok).length,1);assert.equal(results.filter(x=>x.status==="SLOT_FULL").length,1);
 const won=results[0].ok?5:6;assert.equal((await s.staff.mutate(walk(won),"staff")).status,"ALREADY_COMMITTED");
 const b=(await s.repository.read()).state.bookings.find(b=>b.childId===id(won));
 assert.equal(b.startAt,at(10));assert.equal(b.endAt,at(11));assert.equal(b.createdAt,at(10,10));
 assert.equal((await s.staff.mutate(walk(7,"drone"),"staff")).ok,true);
 s.setTime(at(12));assert.equal((await s.staff.mutate(walk(8),"staff")).status,"LAB_CLOSED");
});
test("attendance is audited once, exact booked-hour cutoff, checkout revokes projection",async()=>{
 const s=setup(),r=await s.booking(book(1),"parent");assert.equal(r.ok,true);
 const b=(await s.repository.read()).state.bookings[0];
 const check={action:"manual-attendance",childId:b.childId,bookingId:b.bookingId,revision:b.revision,reason:"Staff confirms arrival",requestId:"fixture-present-001"};
 assert.equal((await s.staff.mutate(check,"staff")).status,"OUTSIDE_BOOKED_HOUR");
 s.setTime(at(10,15));assert.equal((await s.adapter.currentBooking(b.childId,b.parentId)).checkInAt,null);
 const c=await s.staff.mutate(check,"staff");assert.equal(c.ok,true);
 assert.equal((await s.staff.mutate(check,"staff")).status,"ALREADY_COMMITTED");
 const current=await s.adapter.currentBooking(b.childId,b.parentId);
 assert.equal(current.bookingStatus,"attended");assert.equal(current.checkInAt,at(10,15));
 assert.equal(current.bookingEndAt,at(11));assert.equal(await s.adapter.currentBooking(b.childId,id(101)),null);
 s.setTime(at(10,30));const out=await s.staff.mutate({...check,action:"checkout",revision:c.revision,reason:"Student departed",requestId:"fixture-checkout-001"},"staff");assert.equal(out.ok,true);
 assert.equal(await s.adapter.currentBooking(b.childId,b.parentId),null);
 const state=(await s.repository.read()).state;assert.equal(state.n5.length,2);
 assert.equal(state.bookings[0].bookingStatus,"checked-out");
});
test("verified check-in requires trusted proof and no-attendance default is disabled",async()=>{
 const s=setup();await s.booking(book(1),"parent");const b=(await s.repository.read()).state.bookings[0];
 const proof={evidenceId:"fixture-evidence-001",childId:b.childId,parentId:b.parentId,bookingId:b.bookingId,revision:b.revision};
 const staff=createStaffSchedulingService({...s.deps,resolveStaff:s.resolveStaff,verifyCheckIn:async p=>p===proof?proof:null});
 const cmd={action:"verified-check-in",childId:b.childId,bookingId:b.bookingId,revision:b.revision,requestId:proof.evidenceId};
 s.setTime(at(10));assert.equal((await staff.mutate(cmd,null,null)).status,"NOT_AUTHORIZED");
 assert.equal((await staff.mutate(cmd,null,proof)).ok,true);
 s.setTime(at(11));assert.equal(await s.adapter.currentBooking(b.childId,b.parentId),null);
 assert.equal(await s.adapter.noAttendance(b),null);assert.equal(await s.adapter.noAttendance(b,{canonicalAttendanceEnabled:true}),null);
 const a=createN4Service({...s.deps,readAttendance:x=>s.adapter.noAttendance(x,{canonicalAttendanceEnabled:true}),verifyEvent:async()=>null});
 assert.equal((await a.tick()).ok,true);assert.equal((await s.repository.read()).state.bookings[0].bookingStatus,"attended");
});
test("staff fixture refuses parent key, production and mixed sessions; page is non-cacheable",async()=>{
 assert.equal(staffFixtureEnabled(env),true);assert.equal(staffFixtureEnabled({...env,NIZAR_STAFF_FIXTURE_KEY:env.NIZAR_FIXTURE_OPERATOR_KEY}),false);
 const s=setup(),handle=createStaffFixtureHttp({repositoryFactory:()=>s.repository,clock:s.deps.clock});
 const req=(key,cookie="")=>new Request("https://example.test/api/dev/nizar/staff",{method:"POST",headers:{origin:"https://example.test","sec-fetch-site":"same-origin","x-stem-nizar":"1","content-type":"application/json","x-stem-nizar-staff":key,cookie},body:JSON.stringify({action:"day",day})});
 assert.equal((await handle(req(env.NIZAR_FIXTURE_OPERATOR_KEY),env)).status,403);
 assert.equal((await handle(req(env.NIZAR_STAFF_FIXTURE_KEY),{...env,VERCEL_ENV:"production"})).status,404);
 assert.equal((await handle(req(env.NIZAR_STAFF_FIXTURE_KEY,"__Host-bsr-student=x"),env)).status,403);
 assert.equal((await handle(req(env.NIZAR_STAFF_FIXTURE_KEY),env)).status,200);
 const page=renderNizarStaffPreview();assert.match(page.headers.get("cache-control"),/no-store/);assert.match(await page.text(),/Staff scheduling dashboard/);
});
