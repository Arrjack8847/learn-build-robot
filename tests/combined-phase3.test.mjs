import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {COMBINED_BRANCH,COMBINED_SITE} from "../scripts/combined/scope.mjs";
import {createCombinedStaffResolver,staffRoster} from "../scripts/combined/staff-identity.mjs";
import {createCombinedSchedulingHttp} from "../scripts/combined/scheduling-http.mjs";
import {createSchedulingRepository} from "../scripts/nizar/repository.mjs";
import {createBookingService} from "../scripts/nizar/booking-service.mjs";
import {createStaffSchedulingService} from "../scripts/nizar/staff-service.mjs";
import {createN4Service} from "../scripts/nizar/automation-service.mjs";
import {renderNizarStaffPreview} from "../scripts/nizar/staff-page.mjs";
const sha=s=>createHash("sha256").update(s,"utf8").digest("hex");
const keyA=Array.from({length:32},(_,i)=>i.toString(16).padStart(2,"0")).join("");
const keyB=Array.from({length:32},(_,i)=>(i+32).toString(16).padStart(2,"0")).join("");
const roster=[{staffId:"staff-fixture-reader",name:"Fixture reader",keyDigest:sha(keyA),enabled:true,permissions:["schedule:read"]},{staffId:"staff-fixture-desk",name:"Fixture desk",keyDigest:sha(keyB),enabled:true,permissions:["schedule:read","schedule:walk-in","schedule:attendance","schedule:excuse"]}];
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:COMBINED_BRANCH,WIX_DEV_SITE_ID:COMBINED_SITE,VERCEL_URL:"fixture.example.test",COMBINED_RUNTIME_ENABLED:"1",COMBINED_IDENTITY_ENABLED:"1",COMBINED_SCHEDULING_ENABLED:"1",COMBINED_STAFF_ENABLED:"1",COMBINED_STAFF_ROSTER_JSON:JSON.stringify(roster)};
const origin="https://"+env.VERCEL_URL,day="2026-11-27",at=h=>Date.parse(day+"T"+String(h).padStart(2,"0")+":00:00+08:00"),id=n=>"qa-j2-"+n.toString(16).padStart(64,"0");
function req(path,body,key="",cookie="",extra={}){return new Request(origin+"/api/dev/combined/"+path,{method:"POST",headers:{origin,"sec-fetch-site":"same-origin","x-stem-combined":"1","content-type":"application/json",...(key?{"x-stem-combined-staff":key}:{}),...(cookie?{cookie}:{}),...extra},body:JSON.stringify(body)});}
test("staff credentials are individual, role-scoped and fail closed",async()=>{
 const resolve=createCombinedStaffResolver(env);
 const a=await resolve(req("staff",{},keyA)),b=await resolve(req("staff",{},keyB));
 assert.equal(a.staffId,roster[0].staffId);assert.equal(b.staffId,roster[1].staffId);assert.notEqual(a.version,b.version);
 assert.deepEqual(a.permissions,["schedule:read"]);assert.equal(b.permissions.includes("schedule:excuse"),true);assert.equal(Object.hasOwn(b,"keyDigest"),false);
 assert.equal(await resolve(req("staff",{},"f".repeat(64))),null);
 assert.equal(await resolve(req("staff",{},keyA,"__Host-bsr-parent-test=")),null);
 assert.equal(await resolve(req("staff",{},keyB,"__Host-bsr-student=x")),null);
 assert.equal(await createCombinedStaffResolver({...env,COMBINED_STAFF_ROSTER_JSON:JSON.stringify([{...roster[0],enabled:false},roster[1]])})(req("staff",{},keyA)),null);
 for(const changed of [{VERCEL_ENV:"production"},{COMBINED_STAFF_ENABLED:"0"},{COMBINED_RUNTIME_ENABLED:"0"},{COMBINED_STAFF_ROSTER_JSON:""},{COMBINED_STAFF_ROSTER_JSON:JSON.stringify([roster[0],{...roster[1],keyDigest:roster[0].keyDigest}])},{COMBINED_STAFF_KEY:keyA},{COMBINED_AUTH_ROOT:keyB}]){
  const e={...env,...changed};assert.equal(staffRoster(e).length,0);assert.equal(await createCombinedStaffResolver(e)(req("staff",{},keyA)),null);
 }
});
function fixture(){
 let row=null,t=at(8);
 const db={get:async()=>structuredClone(row),insert:async(_c,_k,v)=>{if(row)return false;row=structuredClone(v);return true;},replaceIfVersion:async(_c,_k,expected,v)=>{if(row?.stateVersion!==expected)return false;row=structuredClone(v);return true;}};
 const repository=createSchedulingRepository({env,db,clock:()=>t}),resolveStaff=createCombinedStaffResolver(env);
 const readOwner=async(c,p=null)=>{const parentId=c===id(99)?id(101):id(100);return p===null||p===parentId?{childId:c,parentId,name:"Student "+c.slice(-3),stateVersion:"v1"}:null;};
 const resolveChild=async(request,c)=>request.headers.get("cookie")==="fixture-parent=1"&&c!==id(99)?readOwner(c):null;
 const readEligibility=async o=>({membership:o.childId===id(98)?"inactive":"active",deposit:"clear",validUntil:at(22)+86400000});
 const deps={repository,clock:()=>t,readOwner,resolveChild,readEligibility},booking=createBookingService(deps),staff=createStaffSchedulingService({...deps,resolveStaff,staffName:id=>roster.find(x=>x.staffId===id)?.name}),automation=createN4Service({...deps,readAttendance:async()=>null,verifyEvent:async()=>null});
 const runtime={...deps,booking,staff,automation,resolveStaff,listStudents:async()=>[{id:id(1),name:"Student 001"}],checkin:null};
 const http=createCombinedSchedulingHttp({runtimeFactory:()=>runtime});
 const call=async(path,body,key="",cookie="")=>{const r=await http(req(path,body,key,cookie),env);return {status:r.status,data:await r.json()};};
 const parent=body=>call("booking",body,"","fixture-parent=1"),desk=body=>call("staff",body,keyB),reader=body=>call("staff",body,keyA);
 return {repository,runtime,http,parent,desk,reader,setTime:n=>t=n};
}
const book=(n,activity="robotics",hour=10)=>({action:"book",childId:id(n),day,hour,activity,requestId:"fixture-booking-"+n+"-"+activity+"-"+hour});
test("one canonical schedule, independent capacity and matching parent/staff availability",async()=>{
 const f=fixture(),results=await Promise.all(Array.from({length:6},(_,i)=>f.parent(book(i+1))));
 assert.equal(results.filter(x=>x.data.ok).length,5);
 assert.equal((await f.parent(book(8,"drone"))).data.ok,true);
 assert.equal((await f.parent(book(98))).data.status,"MEMBERSHIP_REQUIRED");
 assert.equal((await f.parent(book(99))).status,403);
 const view=(await f.parent({action:"overview",childId:id(8)})).data,staff=(await f.reader({action:"day",day})).data;
 assert.equal(view.ok,true);assert.equal(staff.ok,true);
 for(const s of view.view.days.find(x=>x.day===day).slots){const v=staff.slots.find(x=>x.activity===s.activity&&x.startAt===s.startAt);assert.equal(v.remaining,s.remaining);}
 assert.equal(staff.totals.bookings,6);assert.equal(view.view.bookings.length,1);
 assert.equal(Object.hasOwn(staff.slots.flatMap(x=>x.bookings)[0],"parentId"),false);
 assert.equal((await f.reader({action:"students"})).data.staff.name,"Fixture reader");
 assert.equal((await f.http(req("staff",{action:"day",day}),env)).status,403);
});
test("read-only staff cannot walk in, excuse or issue codes; audited desk mutations use individual identity",async()=>{
 const f=fixture();await f.parent(book(1));let b=(await f.repository.read()).state.bookings[0];f.setTime(at(10));
 const walk={action:"walk-in",childId:id(2),activity:"drone",reason:"Desk visit",requestId:"fixture-walk-in-0001"};
 assert.equal((await f.reader(walk)).status,403);assert.equal((await f.desk(walk)).data.ok,true);
 const mark={action:"manual-attendance",childId:b.childId,bookingId:b.bookingId,revision:b.revision,reason:"Student arrived",requestId:"fixture-present-0001"};
 assert.equal((await f.reader(mark)).status,403);assert.equal((await f.desk(mark)).data.ok,true);
 assert.equal((await f.reader({action:"issue-code",childId:b.childId,bookingId:b.bookingId,revision:b.revision})).status,403);
 b=(await f.repository.read()).state.bookings.find(x=>x.childId===id(2));
 const excuse={action:"excuse",childId:b.childId,bookingId:b.bookingId,revision:b.revision,reason:"Staff approved absence",requestId:"fixture-excuse-0001"};
 assert.equal((await f.reader(excuse)).status,403);assert.equal((await f.desk(excuse)).data.ok,true);
 const state=(await f.repository.read()).state;assert.equal(state.n5.every(a=>a.actorId===roster[1].staffId),true);assert.equal(state.n4.excuses[0].staffId,roster[1].staffId);
 const v=(await f.reader({action:"day",day})).data;assert.equal(v.slots.flatMap(s=>s.bookings).find(x=>x.childId===id(1)).checkedInBy,"Fixture desk");
 assert.equal(v.slots.flatMap(s=>s.bookings).find(x=>x.childId===id(2)).excuse.by,"Fixture desk");
});
test("overview refuses ownership changes and retries inconsistent booking snapshots",async()=>{
 const owner={childId:id(1),parentId:id(100),stateVersion:"v1"},r={repository:{read:async()=>({version:Math.random().toString()})},resolveChild:async()=>owner,booking:async()=>({ok:true,status:"READY"}),automation:{waitlist:async()=>({ok:true,status:"READY"})}};
 const h=createCombinedSchedulingHttp({runtimeFactory:()=>r}),q=()=>req("booking",{action:"overview",childId:id(1)});
 assert.equal((await h(q(),env)).status,503);
 let n=0;r.resolveChild=async()=>({...owner,stateVersion:String(++n)});assert.equal((await h(q(),env)).status,403);
});
test("private staff shell does not include credentials, roster or raw parent records",async()=>{
 const page=renderNizarStaffPreview({combined:true}),html=await page.text();
 assert.match(html,/Individual staff access key/);assert.match(html,/schedule:excuse/);assert.equal(html.includes(keyA),false);assert.equal(html.includes(roster[0].keyDigest),false);assert.match(page.headers.get("cache-control"),/no-store/);
});
