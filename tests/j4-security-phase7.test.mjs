import test from "node:test";
import assert from "node:assert/strict";
import {createJ4Fixtures} from "../scripts/staff/j4-fixtures.mjs";
import {validateFixtureState,createJ4WixStore} from "../scripts/staff/j4-wix-store.mjs";
import {createJ4SimulatedReport} from "../scripts/staff/j4-simulated-report.mjs";
import {createJ4FixtureHttp} from "../scripts/staff/j4-fixture-http.mjs";
import {J4_BRANCH,J4_SITE,createJ4WixExercise} from "../scripts/staff/j4-wix-exercise.mjs";
const fresh=()=>({...createJ4Fixtures(),mode:"j4-fixture-v1",stateVersion:"phase7-start"});
const clone=x=>JSON.parse(JSON.stringify(x));
export function verifyRecordBoundary(seed,check=assert){
 check.equal(validateFixtureState(seed),seed);
 const mutants=[
 ["foreign student",s=>s.students[0].studentId="real-person"],
 ["duplicate identity",s=>s.students[0].studentId=s.students[1].studentId],
 ["missing membership",s=>s.memberships.pop()],
 ["wrong sibling membership",s=>s.memberships[0].studentId=s.students[1].studentId],
 ["membership mismatch",s=>s.memberships[0].status="inactive"],
 ["wrong membership name",s=>s.memberships[0].studentName="Demo Other"],
 ["invalid membership date",s=>s.memberships[0].validUntil="2026-02-30"],
 ["negative progress",s=>s.progress[0].completedLessons=-1],
 ["progress mismatch",s=>s.progress[0].level=6],
 ["unknown booking staff",s=>s.attendance[0].staffId="real-staff"],
 ["unconfirmed attendance",s=>s.attendance[0].checkInAt=null],
 ["checkout before arrival",s=>s.attendance[0].checkOutAt="2026-11-26T08:00:00+08:00"],
 ["student check-in mismatch",s=>s.students[0].checkInStatus="not-checked-in"],
 ["real payment provider",s=>s.payments[0].providerPaymentId="provider-real"],
 ["verified fixture",s=>s.payments[0].status="verified"],
 ["negative amount",s=>s.payments[0].amountMinor=-1],
 ["invalid paid date",s=>s.payments[0].paidAt="2026-11-31"],
 ["failed payment with paid date",s=>s.payments[1].paidAt="2026-11-26"],
 ["deposit cross-student booking",s=>s.deposits[0].bookingId="qa-j4-booking-7"],
 ["deposit amount mismatch",s=>s.deposits[0].amountMinor++],
 ["invalid actor",s=>s.staff[1].role="owner"],
 ["duplicate administrator",s=>s.staff[1].role="admin"],
 ["malformed code key",s=>s.fixtureCodeKey="not-a-key"],
 ["unknown learning visit",s=>s.learningVisits=[{studentId:"qa-j4-student-99",bookingId:"qa-j4-booking-1",status:"learning"}]],
 ["plaintext audit code",s=>s.audit=[{auditId:"audit-1",staffId:"qa-j4-staff-1",action:"issue-code",targetId:"qa-j4-booking-5",result:"success",occurredAt:1,code:"12345678"}]],
 ["duplicate audit request",s=>s.audit=[1,2].map(n=>({auditId:"a"+n,staffId:"qa-j4-staff-1",action:"mark-present",targetId:"qa-j4-booking-5",result:"success",occurredAt:n,requestId:"same-request"}))]
 ];
 for(const [name,mutate] of mutants){const s=clone(seed);mutate(s);check.throws(()=>validateFixtureState(s),/J4_/,name);}
 for(const bad of ["2026-11-31","2026-11-01\n=SUM(1)","2026-11-00","2026-11-02T00:00:00Z"]){const s=clone(seed);s.payments[0].paidAt=bad;check.throws(()=>createJ4SimulatedReport(s,"2026-11"),/INVALID_FIXTURE_PAYMENT_DATE/);}
 return mutants.length+4;
}
test("J4 phase 7: corrupt snapshots, identity relationships, amounts, dates and redaction",()=>{verifyRecordBoundary(fresh());});
test("J4 phase 7: endpoint scope and body allowlists reject before touching Wix",async()=>{
 const env={VERCEL_ENV:"preview",VERCEL_GIT_COMMIT_REF:J4_BRANCH,VERCEL_URL:"j4-fixture.vercel.app",J4_FIXTURE_WIX_ENABLED:"1",WIX_DEV_SITE_ID:J4_SITE,WIX_DEV_DATA_API_KEY:"test-only"};
 const origin="https://"+env.VERCEL_URL;let access=0;
 const fn=createJ4FixtureHttp({makeStore:()=>{access++;throw Error("must not touch store");}});
 const body={simulatedStaffId:"qa-j4-staff-1",input:{}};
 const run=(action,b=body,headers={},override=env,method="POST")=>fn(new Request(origin+"/api/dev/j4-fixture/"+action,{method,headers:{"content-type":"application/json",origin,"sec-fetch-site":"same-origin","x-stem-j4-fixture":"1",...headers},...(method==="GET"?{}:{body:typeof b==="string"?b:JSON.stringify(b)})}),override);
 for(const e of [{VERCEL_ENV:"production"},{VERCEL_GIT_COMMIT_REF:"main"},{VERCEL_TARGET_ENV:"production"},{WIX_DEV_SITE_ID:"other"},{J4_FIXTURE_WIX_ENABLED:"0"},{WIX_DEV_DATA_API_KEY:""}])assert.equal((await run("overview",body,{}, {...env,...e})).status,404);
 assert.equal((await run("overview",body,{},env,"GET")).status,405);
 for(const h of [{origin:"https://untrusted.example"},{"sec-fetch-site":"cross-site"},{"x-stem-j4-fixture":"0"}])assert.equal((await run("overview",body,h)).status,403);
 for(const a of ["sign-in","sign-out","reset","../overview","constructor","raw-write"])assert.equal((await run(a)).status,404);
 for(const b of ["{",JSON.stringify({...body,input:{huge:"x".repeat(4100)}}),{...body,simulatedStaffId:"real-staff"},{...body,token:"fake"},{...body,input:{siteId:"other"}},{...body,input:{collectionId:"other"}},{...body,input:{__bad:"payload"}}])assert.equal((await run("overview",b)).status,400);
 assert.equal((await run("choose-fixture-role",{...body,input:{staffId:"qa-j4-staff-2"}})).status,400);
 assert.equal(access,0);
});
test("J4 phase 7: pinned adapter confirms full writes and rejects hostile responses",async()=>{
 const env={VERCEL_ENV:"preview",VERCEL_GIT_COMMIT_REF:J4_BRANCH,J4_PRIVATE_ENABLED:"1",J4_WIX_SITE_ID:J4_SITE,J4_WIX_DATA_API_KEY:"test-only"};
 let s=fresh(),fault="";
 const store=createJ4WixStore(env,async(url,o)=>{
  assert.equal(new URL(url).origin,"https://www.wixapis.com");assert.equal(o.redirect,"error");assert.equal(o.cache,"no-store");
  if(o.method==="PUT"){const b=JSON.parse(o.body);if(b.condition.filter.stateVersion.$eq!==s.stateVersion)return new Response("{}",{status:428});s=JSON.parse(b.dataItem.data.snapshot);}
  const returned=clone(s);if(fault==="altered")returned.students[0].birthYear++;
  return new Response(JSON.stringify({dataItem:{id:fault==="wrong-id"?"wrong":"qa-j4-state-v1",dataCollectionId:fault==="wrong-collection"?"other":"J4PrivateState",data:{stateVersion:fault==="wrong-version"?"wrong":returned.stateVersion,snapshot:JSON.stringify(returned)}}}),{status:200});
 });
 const initial=await store.readStrong();const next={...initial,stateVersion:"next"};
 assert.equal(await store.compareAndSet(initial.stateVersion,next),true);
 assert.equal(await store.compareAndSet(initial.stateVersion,{...initial,stateVersion:"stale"}),false);
 for(const mode of ["wrong-id","wrong-collection","wrong-version"]){fault=mode;await assert.rejects(()=>store.readStrong(),/J4_/);}
 fault="altered";await assert.rejects(()=>store.compareAndSet("next",{...next,stateVersion:"altered"}),/J4_WRITE_UNCONFIRMED/);
});
