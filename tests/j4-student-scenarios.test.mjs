import test from "node:test";
import assert from "node:assert/strict";
import {createJ4Fixtures} from "../scripts/staff/j4-fixtures.mjs";
import {createJ4WixExercise} from "../scripts/staff/j4-wix-exercise.mjs";
const admin="qa-j4-staff-1",staff="qa-j4-staff-2",finance="qa-j4-staff-3";
const id=n=>"qa-j4-student-"+n;
const booking=n=>"qa-j4-booking-"+n;
export async function verifySevenScenarios(initial,check=assert){
 // A copy of the persisted snapshot; destructive scenario operations NEVER touch Wix.
 let snapshot=structuredClone(initial),writes=0;
 const store={readStrong:async()=>structuredClone(snapshot),compareAndSet:async(expected,next)=>{if(snapshot.stateVersion!==expected)return false;snapshot=structuredClone(next);writes++;return true;}};
 const day=snapshot.attendance[0].sessionDate;
 const clock={now:()=>Date.parse(day+"T12:00:00+08:00"),localDay:()=>day};
 const call=(a,b={},who=admin)=>createJ4WixExercise({store,clock})(a,b,who);
 const profiles=[];
 const expected=["active","inactive","pending","expired","active","inactive","active"];
 for(let n=1;n<=7;n++){
  const p=await call("student-profile",{studentId:id(n)});
  check.equal(p.ok,true);check.equal(p.student.studentId,id(n));check.equal(p.student.membershipStatus,expected[n-1]);check.equal(p.related.memberships.length,1);check.equal(p.related.memberships[0].status,expected[n-1]);check.equal(p.related.attendance.length,1);check.equal(p.related.attendance[0].bookingId,booking(n));check.equal(p.related.progress.length,1);check.equal(p.related.checkins.length,1);
  check.equal(Object.values(p.related).flat().every(row=>row.studentId===id(n)),true);
  check.equal(Object.hasOwn(p.student,"payerId"),false);
  check.equal(p.related.payments.every(x=>x.evidenceType==="fixture"&&x.providerPaymentId===null&&x.status!=="verified"),true);
  profiles.push(p);
 }
 const [a,b,c,d,e,f,g]=profiles;
 const good=a.related.payments[0];check.equal(good.purpose,"membership");check.equal(good.status,"simulated-success");check.equal(a.student.checkInStatus,"checked-in");
 check.equal(b.related.payments.length,0);check.equal(initial.students.find(s=>s.studentId===id(1)).payerId,initial.students.find(s=>s.studentId===id(2)).payerId);
 check.equal(c.related.payments[0].status,"failed");check.equal(c.related.payments[0].paidAt,null);check.equal(c.related.memberships[0].renewalStatus,"failed");
 check.equal(d.related.payments.length,0);check.equal(d.related.memberships[0].validUntil<day,true);
 check.equal(e.related.memberships[0].renewalStatus,"simulated-renewal");check.equal(e.related.payments[0].purpose,"membership");check.equal(e.related.payments[0].status,"simulated-success");check.equal(e.related.memberships[0].validUntil>=day,true);
 check.equal(f.related.deposits.length,1);check.equal(f.related.deposits[0].bookingId,booking(6));check.equal(f.related.deposits[0].disposition,"policy-not-approved");check.equal(f.related.payments.every(x=>x.purpose==="deposit"),true);
 check.equal(g.student.level,3);check.equal(g.related.progress[0].completedLessons,24);check.equal(g.related.progress[0].completedBuilds,18);check.equal(g.related.progress[0].quizCompleted,8);check.equal(g.related.progress[0].levelCompletion,"2 of 6");
 check.equal(initial.students.find(s=>s.studentId===id(6)).payerId,initial.students.find(s=>s.studentId===id(7)).payerId);
 check.equal(new Set(initial.students.map(s=>s.payerId)).size,5);
 const cmd=(action,n)=>({action,bookingId:booking(n),reason:"Fictional phase 4 scenario",requestId:"phase4-"+action+"-"+n});
 for(const n of [2,3,4,6]){
  check.equal((await call("attendance",cmd("mark-present",n),staff)).ok,false);
  check.equal((await call("check-in-code",{action:"issue-code",bookingId:booking(n)},staff)).ok,false);
 }
 check.equal((await call("attendance",cmd("check-out",1),staff)).ok,true);
 check.equal((await call("student-profile",{studentId:id(1)})).student.checkInStatus,"not-checked-in");
 for(const n of [5,7]){
  const code=await call("check-in-code",{action:"issue-code",bookingId:booking(n)},staff);check.equal(code.ok,true);
  check.equal((await call("check-in-code",{action:"validate-code",bookingId:booking(n),code:code.code},staff)).ok,true);
  check.equal((await call("check-in-code",{action:"validate-code",bookingId:booking(n),code:code.code},staff)).ok,false);
  check.equal((await call("student-profile",{studentId:id(n)})).student.checkInStatus,"checked-in");
 }
 check.equal((await call("student-profile",{studentId:id(6)})).student.checkInStatus,"not-checked-in");
 check.equal((await call("student-profile",{studentId:id(2)})).student.checkInStatus,"not-checked-in");
 check.equal((await call("student-profile",{studentId:"qa-j4-student-99"})).ok,false);
 check.equal((await call("student-profile",{studentId:id(1)},finance)).ok,false);
 const limited=await call("student-profile",{studentId:id(1)},staff);check.equal(Object.hasOwn(limited.related,"payments"),false);check.equal(Object.hasOwn(limited.related,"deposits"),false);
 check.deepEqual(snapshot.payments,initial.payments);check.deepEqual(snapshot.memberships,initial.memberships);check.deepEqual(snapshot.deposits,initial.deposits);check.deepEqual(snapshot.progress,initial.progress);check.equal(snapshot.sessions.length,0);
 check.equal(snapshot.audit.filter(x=>x.action==="validate-code"&&x.result==="success").length,2);
 check.equal(writes>0,true);
 return {scenarios:7,restricted:4,siblingPairs:2,fictionalPayers:5,financeUnchanged:true,progressUnchanged:true,isolatedWrites:writes};
}
test("J4 phase 4: all seven student scenarios, five payer identities, sibling isolation and protected role projections",async()=>{
 await verifySevenScenarios({...createJ4Fixtures(),mode:"j4-fixture-v1",stateVersion:"phase4-test"});
});
