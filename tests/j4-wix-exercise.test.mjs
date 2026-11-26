import test from "node:test";
import assert from "node:assert/strict";
import {createJ4Fixtures} from "../scripts/staff/j4-fixtures.mjs";
import {createJ4FixtureHttp} from "../scripts/staff/j4-fixture-http.mjs";
import {createJ4WixStore} from "../scripts/staff/j4-wix-store.mjs";
import {J4_BRANCH,J4_SITE} from "../scripts/staff/j4-wix-exercise.mjs";
const origin="https://j4-fixture.vercel.app",env={VERCEL_ENV:"preview",VERCEL_GIT_COMMIT_REF:J4_BRANCH,VERCEL_URL:"j4-fixture.vercel.app",J4_FIXTURE_WIX_ENABLED:"1",WIX_DEV_SITE_ID:J4_SITE,WIX_DEV_DATA_API_KEY:"synthetic-transport-key"};
test("J4 isolated Wix fixture HTTP: direct dashboard, persistent changes across requests and fail-closed scope",async()=>{
 let stored={...createJ4Fixtures(),mode:"j4-fixture-v1",stateVersion:"seed"},reads=0,writes=0;
 const pack=s=>({stateVersion:s.stateVersion,snapshot:JSON.stringify(s)});
 let data=pack(stored);
 const fake=async(url,o)=>{const u=new URL(url);assert.equal(u.origin,"https://www.wixapis.com");assert.equal(u.pathname,"/wix-data/v2/items/qa-j4-state-v1");assert.equal(o.headers["wix-site-id"],J4_SITE);assert.equal(o.headers.Authorization,env.WIX_DEV_DATA_API_KEY);
 if(o.method==="GET"){reads++;assert.equal(u.searchParams.get("dataCollectionId"),"J4PrivateState");assert.equal(u.searchParams.get("consistentRead"),"true");}
 else if(o.method==="PUT"){const b=JSON.parse(o.body);assert.equal(b.dataCollectionId,"J4PrivateState");if(b.condition.filter.stateVersion.$eq!==data.stateVersion)return new Response("{}",{status:428});data=b.dataItem.data;writes++;}
 else throw Error("unexpected method");
 return new Response(JSON.stringify({dataItem:{id:"qa-j4-state-v1",dataCollectionId:"J4PrivateState",data}}),{status:200});};
 const clock={now:()=>Date.parse("2026-11-26T12:00:00+08:00"),localDay:()=>"2026-11-26"};
 const request=(action,input={},id="qa-j4-staff-1",extra={})=>new Request(origin+"/api/dev/j4-fixture/"+action,{method:"POST",headers:{"content-type":"application/json",origin,"sec-fetch-site":"same-origin","x-stem-j4-fixture":"1",...extra},body:JSON.stringify({simulatedStaffId:id,input})});
 const run=(action,input={},id="qa-j4-staff-1",override=env,extra={})=>createJ4FixtureHttp({makeStore:e=>createJ4WixStore(e,fake),makeClock:()=>clock})(request(action,input,id,extra),override);
 for(const bad of [{VERCEL_ENV:"production"},{VERCEL_TARGET_ENV:"production"},{VERCEL_GIT_COMMIT_REF:"main"},{J4_FIXTURE_WIX_ENABLED:"0"},{WIX_DEV_SITE_ID:"another-site"}])assert.equal((await run("overview",{},"qa-j4-staff-1",{...env,...bad})).status,404);
 assert.equal((await run("overview",{},"qa-j4-staff-1",env,{origin:"https://evil.example"})).status,403);
 assert.equal((await run("overview",{},"real-staff")).status,400);
 assert.equal((await run("sign-in")).status,404);assert.equal(reads,0);assert.equal(writes,0);
 const s=await run("session");assert.equal(s.status,200);assert.equal((await s.json()).storage,"wix-fixture");assert.equal(writes,1);
 const ov=await run("overview");assert.equal((await ov.json()).metrics.currentlyLearning,1);
 const profile=await run("student-profile",{studentId:"qa-j4-student-1"});const p=await profile.json();assert.equal(p.student.studentId,"qa-j4-student-1");assert.equal(Object.hasOwn(p,"fixtureCodeKey"),false);
 assert.equal((await run("list",{resource:"students"},"qa-j4-staff-3")).status,403);
 assert.equal((await run("attendance",{action:"mark-present",bookingId:"qa-j4-booking-2",reason:"Fictional test",requestId:"phase3-test-123"})).status,403);
 const issued=await run("check-in-code",{action:"issue-code",bookingId:"qa-j4-booking-5"},"qa-j4-staff-2");assert.equal(issued.status,200);const code=(await issued.json()).code;
 assert.equal((await run("check-in-code",{action:"validate-code",bookingId:"qa-j4-booking-5",code},"qa-j4-staff-2")).status,200);
 assert.equal((await run("check-in-code",{action:"validate-code",bookingId:"qa-j4-booking-5",code},"qa-j4-staff-2")).status,403);
 const after=await run("student-profile",{studentId:"qa-j4-student-5"});assert.equal((await after.json()).student.checkInStatus,"checked-in");
 const audit=await run("list",{resource:"audit"});assert.equal((await audit.json()).total,2);
 const state=JSON.parse(data.snapshot);assert.equal(state.sessions.length,0);assert.equal(state.attempts.length,0);assert.equal(state.codes[0].status,"used");assert.equal(state.payments.every(p=>p.evidenceType==="fixture"&&p.providerPaymentId==null),true);
 assert.equal((await run("staff-status",{staffId:"qa-j4-staff-3",accountStatus:"inactive",reason:"Simulated role disabled"})).status,200);
 assert.equal((await run("session",{},"qa-j4-staff-3")).status,403);
});
