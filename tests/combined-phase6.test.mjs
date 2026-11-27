import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createCombinedStaffReports} from "../scripts/combined/staff-reports.mjs";
import {emptyN4} from "../scripts/nizar/automation-state.mjs";
import {COMBINED_BRANCH} from "../scripts/combined/scope.mjs";
const childId="qa-j2-"+"a".repeat(64),parentId="qa-j2-"+"b".repeat(64),name="=Fixture student",now=Date.parse("2026-11-27T10:30:00+08:00"),month="2026-11";
function fixture(permissions){
 const owner={childId,parentId,stateVersion:"v1",accountStatus:"preview-test",name};let version="v1",paymentStatus="verified",reads=0,change=false;
 const state={bookings:[],n4:emptyN4()},actor={staffId:"staff-fixture-reader",version:"v1",permissions};
 const runtime={clock:()=>now,repository:{read:async()=>({version,state:structuredClone(state)})},resolveStaff:async()=>actor,listStudents:async()=>[{id:childId,name}],readOwner:async()=>owner,readEligibility:async()=>({membership:"active",deposit:"clear",validUntil:now+86400000}),store:{}};
 const readBilling=async()=>{reads++;if(change&&reads>1)paymentStatus="review_required";return {membershipStatus:"active",paymentStatus,renewalStatus:"second_cycle_unverified",validUntil:now+86400000,payments:[{studentId:childId,paymentId:"charge-fixture-1",currency:"MYR",amountMinor:36000,status:paymentStatus,paidAt:now-1000}]};};
 return {run:createCombinedStaffReports({env:{},runtime,readBilling,readProgress:async()=>({status:"ready",currentLevel:1})}),actor,state,change:()=>change=true,setVersion:v=>version=v};
}
test("staff permission is required for finance and exports; schedule-only view omits financial records",async()=>{
 const f=fixture(["schedule:read"]);
 const v=await f.run(null,{action:"desk-overview",month});assert.equal(v.ok,true);assert.equal(v.summary.coverage,"unavailable");assert.deepEqual(v.financeRows,[]);
 assert.equal((await f.run(null,{action:"finance-export",month})).status,"NOT_AUTHORIZED");
 assert.equal((await f.run(null,{action:"visit-export",month})).status,"NOT_AUTHORIZED");
});
test("sandbox ledger exports only known amounts and neutralizes spreadsheet formulas",async()=>{
 const f=fixture(["schedule:read","finance:read","reports:export"]);
 const v=await f.run(null,{action:"finance-export",month});assert.equal(v.ok,true);assert.equal(v.summary.knownVerifiedMembershipMinor,36000);assert.equal(v.summary.netRevenue,null);
 assert.match(v.csv,/"'=Fixture student"/);assert.match(v.filename,/sandbox-ledger-2026-11\.csv$/);
 assert.equal((await f.run(null,{action:"finance-export",month:"2026-12"})).ok,false);
 f.change();assert.equal((await f.run(null,{action:"finance-export",month})).ok,false);
});
test("combined role shell and protected dispatch source preserve isolation; deployment remains disabled",()=>{
 const source=readFileSync(new URL("../src/server.ts",import.meta.url),"utf8");
 const cfg=JSON.parse(readFileSync(new URL("../vercel.json",import.meta.url),"utf8"));
 const root=readFileSync(new URL("../src/routes/index.tsx",import.meta.url),"utf8");
 assert.equal(cfg.git.deploymentEnabled[COMBINED_BRANCH],false);
 assert.match(root,/__COMBINED_PREVIEW__/);for(const path of ["/parent/sign-in","/auth/","/staff/admin"])assert.ok(root.includes(path));
 const block=source.slice(source.indexOf("if(__COMBINED_PREVIEW__||"),source.indexOf('if(path==="/api/dev/nizar/booking")'));
 for(const path of ["/api/dev/combined/booking","/api/dev/combined/staff","/api/dev/combined/check-in","/api/dev/combined/worker","/api/dev/j5/progress","/api/dev/j5/assessment","/api/dev/j5/pdf/"])assert.ok(block.includes(path));
 assert.ok(!block.includes("handleJ1234Attendance("));assert.ok(!block.includes("handleStaffDesk("));
});
