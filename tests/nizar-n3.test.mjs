import test from "node:test";
import assert from "node:assert/strict";
import {createBookingService} from "../scripts/nizar/booking-service.mjs";
import {createSchedulingRepository} from "../scripts/nizar/repository.mjs";
import {createNizarFixtureHttp} from "../scripts/nizar/fixture-http.mjs";
import {renderNizarPreview} from "../scripts/nizar/preview-page.mjs";
import {NIZAR_BRANCH} from "../scripts/nizar/contract.mjs";
const now=Date.parse("2026-11-27T08:00:00+08:00"),day="2026-11-27";
const id=n=>"qa-j2-"+n.toString(16).padStart(64,"0");
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:NIZAR_BRANCH,NIZAR_SCHEDULING_ENABLED:"1",NIZAR_FIXTURE_ENABLED:"1",NIZAR_FIXTURE_OPERATOR_KEY:"0123456789abcdef".repeat(4),VERCEL_URL:"fixture.invalid"};
function setup(){
 let row=null,t=now;
 const db={get:async()=>structuredClone(row),insert:async(c,k,v)=>{if(row)return false;row=structuredClone(v);return true},replaceIfVersion:async(c,k,e,v)=>{if(row?.stateVersion!==e)return false;row=structuredClone(v);return true}};
 const repository=createSchedulingRepository({env,db,clock:()=>t});
 const execute=createBookingService({repository,clock:()=>t,resolveChild:async(actor,c)=>actor===1&&c!==id(99)?{childId:c,parentId:id(1),stateVersion:"v1"}:null,readEligibility:async o=>({membership:o.childId===id(98)?"inactive":"active",deposit:o.childId===id(97)?"required":"clear"})});
 return {execute,repository,setTime:n=>{t=n}};
}
const book=(n,requestId="request-fixture-"+n,activity="robotics",hour=10,d=day)=>({action:"book",childId:id(n),day:d,hour,activity,requestId});
test("capacity and final place under concurrent CAS; drone independent",async()=>{
 const {execute,repository}=setup();const results=await Promise.all([2,3,4,5,6,7].map(n=>execute(book(n),1)));
 assert.equal(results.filter(r=>r.ok).length,5);assert.equal(results.filter(r=>r.status==="SLOT_FULL").length,1);
 assert.equal((await execute(book(8,"request-drone-0001","drone"),1)).ok,true);
 assert.equal((await repository.read()).state.bookings.length,6);
});
test("identity, payment, deposit, daily and upcoming restrictions",async()=>{
 const {execute}=setup();assert.equal((await execute(book(99),1)).status,"NOT_AUTHORIZED");assert.equal((await execute(book(2),2)).status,"NOT_AUTHORIZED");
 assert.equal((await execute(book(98),1)).status,"MEMBERSHIP_REQUIRED");assert.equal((await execute(book(97),1)).status,"DEPOSIT_REQUIRED");
 assert.equal((await execute(book(2),1)).ok,true);
 assert.equal((await execute(book(2,"request-drone-0002","drone"),1)).status,"DAILY_LIMIT");
 for(let i=1;i<=6;i++)assert.equal((await execute(book(2,"request-future-0"+i,"robotics",10,"2026-"+(i<=3?"11-"+(27+i):"12-0"+(i-3))),1)).ok,true);
 assert.equal((await execute(book(2,"request-future-07","robotics",10,"2026-12-04"),1)).status,"UPCOMING_LIMIT");
});
test("durable idempotency, stale revisions, move and cancellation at exact cutoff",async()=>{
 const {execute,repository,setTime}=setup();const input=book(2);const r=await execute(input,1);assert.equal(r.ok,true);
 assert.equal((await execute(input,1)).status,"ALREADY_COMMITTED");assert.equal((await execute({...input,hour:11},1)).status,"REQUEST_ID_CONFLICT");
 let b=(await repository.read()).state.bookings[0];const move={action:"move",childId:id(2),bookingId:b.bookingId,revision:b.revision,day,hour:11,activity:"drone",requestId:"request-move-0001"};
 assert.equal((await execute(move,1)).ok,true);assert.equal((await execute({...move,requestId:"request-move-0002"},1)).status,"BOOKING_CHANGED");
 b=(await repository.read()).state.bookings[0];assert.equal(b.activity,"drone");
 setTime(b.startAt-7200000);assert.equal((await execute({action:"cancel",childId:id(2),bookingId:b.bookingId,revision:b.revision,requestId:"request-cancel-0001"},1)).ok,true);
 assert.equal((await repository.read()).state.bookings[0].bookingStatus,"cancelled");
});
test("fixture authorization, no browser payment flags, cross-family refusal, no-cache UI",async()=>{
 const {repository}=setup(),handler=createNizarFixtureHttp({repositoryFactory:()=>repository,clock:()=>now});
 const call=(body,extra={},e=env)=>handler(new Request("https://fixture.invalid/api/dev/nizar/booking",{method:"POST",headers:{origin:"https://fixture.invalid","sec-fetch-site":"same-origin","x-stem-nizar":"1","x-stem-nizar-operator":env.NIZAR_FIXTURE_OPERATOR_KEY,"content-type":"application/json",...extra},body:JSON.stringify(body)}),e);
 assert.equal((await call({action:"fixtures"},{},{...env,NIZAR_FIXTURE_ENABLED:"0"})).status,404);
 assert.equal((await call({action:"fixtures"},{"x-stem-nizar-operator":"bad"})).status,403);
 const families=(await (await call({action:"fixtures"})).json()).families;
 assert.equal((await call({action:"view",family:1,childId:families[0].children[0].id})).status,403);
 assert.equal((await call({action:"view",family:0,childId:families[0].children[0].id,paid:true})).status,400);
 const response=renderNizarPreview();assert.match(response.headers.get("content-security-policy"),/frame-ancestors 'none'/);assert.match(await response.text(),/Confirm booking/);
});
