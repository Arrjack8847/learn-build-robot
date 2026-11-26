import test from "node:test";
import assert from "node:assert/strict";
import {DatabaseSync} from "node:sqlite";
import {createIndependentOverviewHttp} from "../scripts/j5/overview-services.mjs";
import {createCourseAuthority,resolveCourseResource} from "../scripts/j5/course-authority.mjs";
import {createCourseHttp} from "../scripts/j5/course-http.mjs";
import {createPrivatePdfHttp} from "../scripts/j5/pdf-http.mjs";
import {evaluateLevelOneFinalBuild} from "../scripts/j5/level-one-final-build.mjs";
const env={VERCEL_ENV:"preview",J5_PRIVATE_ENABLED:"true"},origin="https://fixture.invalid",overviewPath="/api/dev/j5/overview",pdfPath="/api/dev/j5/pdf/pdf-0001";
const scenarios=[
 ["A","P1","active",0,true,1], ["B","P1","inactive",0,true,1],
 ["C","P2","active",6,true,1], ["D","P3","expired",4,true,1],
 ["E","P3","pending",1,true,1], ["F","P4","active",2,false,1],
 ["G","P5","active",10,true,2], ["H","P5","active",3,true,1]
];
function setup(t){
 const db=new DatabaseSync(":memory:");t.after(()=>db.close());
 db.exec("CREATE TABLE snapshots (id TEXT PRIMARY KEY, data TEXT NOT NULL)");
 const write=(id,row)=>db.prepare("INSERT INTO snapshots VALUES (?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data").run(id,JSON.stringify(row));
 const readSnapshot=async id=>{const row=db.prepare("SELECT data FROM snapshots WHERE id=?").get(id);return row?JSON.parse(row.data):null;};
 for(const [id,parent,membership,completed,checkedIn,currentLevel] of scenarios){
  const base={studentId:id,environment:"private-preview"};
  write(id,{...base,profile:{...base,accountStatus:"active",displayName:"Fictional "+id,studentCode:"QA-"+id,parentId:parent},membership:{...base,status:membership,eligible:membership==="active",validFrom:1000,validUntil:membership==="expired"?2000:4000},checkIn:checkedIn?{...base,status:"verified",revoked:false,bookingId:"booking-"+id,validFrom:1000,validUntil:3000}:null,levels:Array.from({length:6},(_,i)=>({...base,level:i+1,allowed:i<currentLevel,status:i>=currentLevel?"locked":i===0&&completed===10?"completed":"in-progress",checkInRequired:true,completed:i===0?completed:0,required:10})),learning:{...base,currentLevel,overallCompleted:completed,overallRequired:60,learningCompleted:completed,buildingCompleted:0,quizzesPassed:0,challengesPassed:0,latest:null}});
 }
 const state={now:2000,revoked:new Set(),renders:0,reads:0};
 const resolveStudent=async request=>{const id=request.headers.get("cookie")?.match(/^fixture=([A-H])$/)?.[1];return id&&!state.revoked.has(id)?{studentId:id,role:"student",environment:"private-preview"}:null;};
 const clock={now:()=>state.now};
 const overview=createIndependentOverviewHttp({resolveStudent,readSnapshot,clock});
 const authorize=createCourseAuthority({resolveStudent,readSnapshot,clock,resolveResource:r=>resolveCourseResource(r,{getProjectLevel:id=>id==="robot-a"?1:id==="robot-b"?2:undefined,hasCategory:()=>false})});
 const course=createCourseHttp({getAuthority:async()=>authorize});
 const bytes=new TextEncoder().encode("%PDF-1.7\nfictional acceptance data");
 const pdf=createPrivatePdfHttp({lookupDocument:id=>id==="pdf-0001"?{id,coursePaths:["/projects/robot-a"]}:null,getServices:async()=>({authorize,describe:async()=>({documentId:"pdf-0001",private:true,verified:true,version:"fixture-v1",sha256:"a".repeat(64),size:bytes.length}),readChunk:async({start,end})=>{state.reads++;return {version:"fixture-v1",bytes:bytes.slice(start,end+1)};}}),now:clock.now});
 const request=(id,path)=>new Request(origin+path,{headers:id?{cookie:"fixture="+id}:{}});
 return {state,readSnapshot,write,overview:(id,query="")=>overview(request(id,overviewPath+query),env,overviewPath),course:(id,path="/projects/robot-a")=>course(request(id,path),env,async()=>{state.renders++;return new Response("fixture course");}),pdf:id=>pdf(request(id,pdfPath),env)};
}
for(const [id,parent,membership,completed,checkedIn,currentLevel] of scenarios){
 test("student "+id+" / "+parent+": consistent isolated profile, course and PDF access",async t=>{
  const f=setup(t),r=await f.overview(id,"?studentId=A"),body=await r.json();
  assert.equal(r.status,200);assert.equal(body.profile.studentCode,"QA-"+id);assert.equal(body.profile.membership,membership);assert.equal(body.profile.learning.overallCompleted,completed);assert.equal(body.profile.learning.currentLevel,currentLevel);assert.equal("parentId" in body.profile,false);
  const allowed=membership==="active"&&checkedIn;assert.equal(body.levels[0].available,allowed);
  assert.equal((await f.course(id)).status,allowed?200:403);
  assert.equal((await f.course(id,"/projects/robot-b")).status,allowed&&currentLevel===2?200:403);
  const p=await f.pdf(id);assert.equal(p.status,allowed?200:403);if(allowed)assert.match(await p.text(),/^%PDF-/);else assert.equal(f.state.reads,0);
 });
}
test("membership changes on one sibling never alter the other sibling",async t=>{const f=setup(t);const a=await f.readSnapshot("A");a.membership.eligible=false;a.membership.status="failed";f.write("A",a);assert.equal((await f.course("A")).status,403);assert.equal((await (await f.overview("B")).json()).profile.membership,"inactive");assert.equal((await f.course("C")).status,200);});
test("checkout and session revocation deny subsequent course and PDF requests",async t=>{const f=setup(t);const c=await f.readSnapshot("C");c.checkIn.revoked=true;f.write("C",c);assert.equal((await f.course("C")).status,403);assert.equal((await f.pdf("C")).status,403);f.state.revoked.add("A");assert.equal((await f.overview("A")).status,401);assert.equal((await f.course("A")).status,401);assert.equal((await f.pdf("A")).status,401);});
test("Level 1 assessment overtime and retry evaluation remain separate from persisted unlock",async t=>{const f=setup(t);const first=evaluateLevelOneFinalBuild({startedAt:1000,finishedAt:902000,checks:[true,false,false,true],acknowledgedFinish:true});const retry=evaluateLevelOneFinalBuild({startedAt:1000,finishedAt:950000,checks:[true,true,false,true],acknowledgedFinish:true});assert.equal(first.passed,false);assert.equal(retry.passed,true);assert.equal(retry.overtimeSeconds,49);assert.equal((await f.course("H","/projects/robot-b")).status,403);});
