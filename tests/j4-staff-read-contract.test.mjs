import test from "node:test";
import {createStaffReadService} from "../scripts/staff/read-service.mjs";
async function runStaffReadContractTests(create){
 const assert=(v,msg)=>{if(!v)throw Error(msg);};
 const now=10000, clock={now:()=>now};
 const valid={staffId:"staff-1",subjectType:"staff",role:"admin",accountStatus:"active",expiresAt:20000};
 const seen=[];
 const students=[{studentId:"student-a",name:"Fictional A",birthYear:2015,parentEmail:"private",sessionToken:"secret"},{studentId:"student-b",name:"Fictional B",birthYear:2016}];
 const store={async list(q){seen.push(q);let rows=q.resource==="students"?students:q.resource==="payments"?[{paymentId:"p1",studentId:"student-a",purpose:"deposit",amountMinor:5000,currency:"SGD",status:"simulated",evidenceType:"fixture",rawWebhook:"secret"}]:[];if(q.filters.studentId)rows=rows.filter(r=>r.studentId===q.filters.studentId);return {total:rows.length,rows:rows.slice((q.page-1)*q.pageSize,q.page*q.pageSize)};},async getStudent({studentId}){return students.find(s=>s.studentId===studentId);}};
 const service=create({identity:{resolveStaff:async ctx=>ctx},store,clock});
 const results=[];
 async function t(name,fn){await fn();results.push(name);}
 await t("anonymous, parent, student, expired, revoked and inactive denied",async()=>{for(const ctx of [null,{...valid,subjectType:"parent"},{...valid,subjectType:"student"},{...valid,expiresAt:now},{...valid,revokedAt:1},{...valid,accountStatus:"inactive"},{...valid,role:"__proto__"}])assert(!(await service.list(ctx,"students")).ok,"unauthorized");assert(seen.length===0,"unauthorized store access");});
 await t("least privilege",async()=>{assert(!(await service.list({...valid,role:"staff"},"payments")).ok,"staff payment access");assert(!(await service.list({...valid,role:"finance"},"students")).ok,"finance student access");assert((await service.list({...valid,role:"finance"},"payments")).ok,"finance payment denied");});
 await t("pagination and explicit projection",async()=>{const res=await service.list(valid,"students",{page:2,pageSize:1});assert(res.total===2&&res.rows[0].studentId==="student-b","bad paging");const a=await service.student(valid,"student-a");assert(a.ok&&!Object.hasOwn(a.student,"parentEmail")&&!Object.hasOwn(a.student,"sessionToken"),"PII leak");});
 await t("invalid filters and dates rejected",async()=>{for(const q of [{pageSize:51},{filters:{parentEmail:"x"}},{filters:{studentId:"a/b"}},{sort:"sessionToken"},{page:0}])assert(!(await service.list(valid,"students",q)).ok,"invalid accepted");assert(!(await service.list(valid,"payments",{filters:{from:"2026-02-31"}})).ok,"bad date");});
 await t("student isolation",async()=>{const a=await service.list(valid,"students",{filters:{studentId:"student-a"}});assert(a.rows.length===1&&a.rows[0].studentId==="student-a","scope mismatch");assert(!(await service.student(valid,"missing")).ok,"missing accepted");});
 await t("currency, deposit and evidence preserved",async()=>{const a=await service.list(valid,"payments");const p=a.rows[0];assert(p.currency==="SGD"&&p.purpose==="deposit"&&p.evidenceType==="fixture"&&!Object.hasOwn(p,"rawWebhook"),"payment misrepresented");});
 await t("adapter scope and verified fixture rejected",async()=>{const bad=create({identity:{resolveStaff:async()=>valid},clock,store:{list:async()=>({total:1,rows:[{paymentId:"p1",studentId:"student-b",purpose:"membership",amountMinor:10,currency:"SGD",status:"verified",evidenceType:"fixture"}]})}});let rejected=false;try{await bad.list(valid,"payments",{filters:{studentId:"student-a"}});}catch{rejected=true;}assert(rejected,"unsafe adapter accepted");});
 return results;
}
test("J4 staff read contract",async()=>{await runStaffReadContractTests(createStaffReadService);});
