import test from "node:test";
import assert from "node:assert/strict";
import {createCombinedCheckin} from "../scripts/combined/checkin-service.mjs";
import {validateCheckins} from "../scripts/combined/checkin-state.mjs";
const childId="qa-j2-"+"a".repeat(64),parentId="qa-j2-"+"b".repeat(64),day="2026-11-27",start=Date.parse(day+"T10:00:00+08:00"),end=start+3600000;
const booking={bookingId:"booking-fixture-0001",revision:"revision-fixture-001",childId,parentId,day,activity:"robotics",startAt:start,endAt:end,bookingStatus:"booked",createdAt:start-1000,updatedAt:start-1000};
function fixture(){
 let now=start+60000,version=0,state={bookings:[structuredClone(booking)]},seq=0,eligible=true;const issued=["12345678","87654321","24681357"];let codeIndex=0;
 const repo={read:async()=>({state:structuredClone(state),version:String(version)}),compareAndSet:async(expected,next)=>{if(expected!==String(version))return {status:"conflict"};validateCheckins(next);state=structuredClone(next);version++;return {status:"committed"};}};
 const service=createCombinedCheckin({repository:repo,resolveStaff:async actor=>actor==="staff"?{staffId:"fixture-staff-0001",version:"v1",permissions:["schedule:attendance"]}:null,resolveStudent:async actor=>actor==="student"||actor==="other-session"?{childId,sessionToken:(actor==="student"?"a":"b").repeat(43)}:null,readOwner:async(c,p)=>c===childId&&p===parentId?{childId,parentId,stateVersion:"v1"}:null,readEligibility:async()=>({membership:eligible?"active":"inactive",deposit:"clear",validUntil:end+86400000}),secret:"ab".repeat(32),clock:()=>now,newId:()=>"fixture-id-"+String(++seq).padStart(12,"0"),newCode:()=>issued[codeIndex++]});
 return {service,repo,setNow:n=>now=n,setPaid:v=>eligible=v};
}
test("three wrong attempts lock code, reissue grants exact-hour session only once",async()=>{
 const x=fixture(),i={bookingId:booking.bookingId,revision:booking.revision,childId};
 assert.equal((await x.service.issue("student",i)).ok,false);const first=await x.service.issue("staff",i);assert.equal(first.code,"12345678");
 for(let j=0;j<3;j++)assert.equal((await x.service.redeem("student",{bookingId:i.bookingId,code:"00000000"})).ok,false);
 assert.equal((await x.service.redeem("student",{bookingId:i.bookingId,code:first.code})).ok,false);
 const second=await x.service.issue("staff",i);assert.equal(second.code,"87654321");assert.equal((await x.service.redeem("student",{bookingId:i.bookingId,code:second.code})).ok,true);
 assert.equal((await x.service.redeem("student",{bookingId:i.bookingId,code:second.code})).ok,false);
 assert.equal((await x.service.verifyPass("student")).validUntil,end);assert.equal(await x.service.verifyPass("other-session"),null);
 const s=(await x.repo.read()).state;assert.equal(s.bookings[0].bookingStatus,"attended");assert.equal(s.n5.length,1);assert.equal(JSON.stringify(s).includes(first.code),false);
 x.setPaid(false);assert.equal(await x.service.verifyPass("student"),null);x.setPaid(true);x.setNow(end);assert.equal(await x.service.verifyPass("student"),null);
});
