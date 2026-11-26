import test from "node:test";
import assert from "node:assert/strict";
import {createJ4Fixtures} from "../scripts/staff/j4-fixtures.mjs";
import {createAcceptanceClient,createAcceptanceTransport,verifyReadOnlyAcceptance} from "../scripts/staff/j4-acceptance.mjs";
const day="2026-11-26",clock={now:()=>Date.parse(day+"T12:00:00+08:00"),localDay:()=>day};
const initial=()=>({...createJ4Fixtures(day),mode:"j4-fixture-v1",stateVersion:"phase8-seed"});
test("J4 phase 8: all dashboard API resources and individual profiles, three roles, filters, reports and redaction",async()=>{
 const source=initial(),q=createAcceptanceTransport(source),call=createAcceptanceClient({store:q.store,clock});
 const result=await verifyReadOnlyAcceptance({initial:source,clock,call});
 assert.deepEqual(result,{roles:["admin","staff","finance"],students:7,resources:9});
 assert.equal(q.stats().writes,1);assert.deepEqual(q.inspect().payments,source.payments);assert.deepEqual(q.inspect().students,source.students);
});
test("J4 phase 8: complete persistent fixture workflow across fresh request contexts and concurrency",async()=>{
 const source=initial(),q=createAcceptanceTransport(source),call=createAcceptanceClient({store:q.store,clock});
 const staff="qa-j4-staff-2",admin="qa-j4-staff-1",finance="qa-j4-staff-3";
 const cmd=(action,n)=>({action,bookingId:"qa-j4-booking-"+n,requestId:"phase8-"+action+"-"+n,reason:"Fictional acceptance"});
 await call("session");
 for(const n of [2,3,4,6]){await call("attendance",cmd("mark-present",n),staff,403);await call("check-in-code",{action:"issue-code",bookingId:"qa-j4-booking-"+n},staff,403);}
 await call("attendance",cmd("check-out",1),staff);
 const i=await call("check-in-code",{action:"issue-code",bookingId:"qa-j4-booking-5",requestId:"phase8-issue-code-5",reason:"Fictional acceptance"},staff);
 assert.match(i.code,/^\d{8}$/);
 const validate={action:"validate-code",bookingId:"qa-j4-booking-5",code:i.code,requestId:"phase8-validate-code-5"};
 await call("check-in-code",validate,staff);await call("check-in-code",validate,staff,403);
 await call("attendance",cmd("mark-no-show",6),staff);await call("attendance",cmd("excuse-no-show",6),staff);
 await call("attendance",cmd("mark-present",7),finance,403);
 const pair=await Promise.all([call("attendance",cmd("mark-present",7),staff),call("attendance",cmd("mark-present",7),staff)]);assert.equal(pair[0].auditId,pair[1].auditId);
 const p=await call("student-profile",{studentId:"qa-j4-student-7"},admin);assert.equal(p.student.checkInStatus,"checked-in");assert.equal(p.related.progress[0].completedLessons,24);
 await call("staff-status",{staffId:finance,accountStatus:"inactive",reason:"Fictional acceptance"},admin);
 await call("session",{},finance,403);
 await call("staff-status",{staffId:finance,accountStatus:"active",role:"staff",reason:"Fictional acceptance"},admin);
 assert.equal((await call("session",{},finance)).actor.role,"staff");await call("list",{resource:"payments"},finance,403);
 const after=q.inspect();
 for(const key of ["payments","memberships","deposits","progress"])assert.deepEqual(after[key],source[key]);
 assert.equal(after.sessions.length,0);assert.equal(after.codes[0].status,"used");assert.equal(after.learningVisits[0].status,"ended");
 assert.equal(after.audit.filter(a=>a.requestId==="phase8-mark-present-7").length,1);assert.equal(after.attendance[5].status,"excused");
 assert.equal(q.stats().stale>0,true);
 assert.equal((await call("list",{resource:"audit",query:{pageSize:50}},admin)).total,after.audit.length);
});
