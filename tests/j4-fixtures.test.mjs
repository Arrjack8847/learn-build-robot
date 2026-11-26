import test from "node:test";
import {createJ4Fixtures,createFixtureReadStore,calculateFixtureOverview} from "../scripts/staff/j4-fixtures.mjs";
async function fixtureTests(seed,read,overview){
 const s=seed(), store=read(s);
 const assert=(v,m)=>{if(!v)throw Error(m);};
 const results=[];
 assert(s.students.length===7&&new Set(s.students.map(x=>x.payerId)).size===5,"fixture count");results.push("seven students and five fictional payers");
 assert(s.students[0].payerId===s.students[1].payerId&&s.students[0].studentId!==s.students[1].studentId&&s.memberships[0].status!==s.memberships[1].status,"sibling separation");results.push("sibling identities and memberships independent");
 const q={resource:"students",page:1,pageSize:2,filters:{name:"demo"},sort:"name",direction:"asc"};
 const a=await store.list(q),b=await store.list({...q,page:2});assert(a.total===7&&a.rows.length===2&&b.rows.length===2&&a.rows[1].studentId!==b.rows[0].studentId,"pagination");results.push("stable filtered pagination");
 const p=await store.list({resource:"payments",page:1,pageSize:25,filters:{purpose:"deposit"},sort:"paymentId",direction:"asc"});assert(p.total===1&&p.rows[0].evidenceType==="fixture"&&p.rows[0].providerPaymentId===null,"deposit");results.push("deposit distinct from membership and provider evidence");
 const d=await store.list({resource:"payments",page:1,pageSize:25,filters:{from:"2026-11-26",to:"2026-11-26"},sort:"paymentId",direction:"asc"});assert(d.total===4,"date filtering");results.push("date filtering excludes unpaid timestamps");
 const admin=overview(s,"admin","2026-11-26"),staff=overview(s,"staff","2026-11-26"),finance=overview(s,"finance","2026-11-26");assert(admin.students===7&&admin.activeMemberships===3&&admin.todayAttendance===1&&admin.failedPayments===1&&!Object.hasOwn(staff,"failedPayments")&&!Object.hasOwn(finance,"students"),"metrics");results.push("role-scoped calculated metrics");
 return results;
}
test("J4 fictional dataset and dashboard",async()=>{await fixtureTests(createJ4Fixtures,createFixtureReadStore,calculateFixtureOverview);});
