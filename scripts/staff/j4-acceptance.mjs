// Shared read-only J4 acceptance; never writes real data or uses any other journey.
import {createJ4FixtureHttp} from "./j4-fixture-http.mjs";
import {createJ4WixStore,validateFixtureState} from "./j4-wix-store.mjs";
import {J4_BRANCH,J4_SITE} from "./j4-wix-exercise.mjs";
import assert from "node:assert/strict";
const host="https://j4-fixture.vercel.app";
const env={VERCEL_ENV:"preview",VERCEL_GIT_COMMIT_REF:J4_BRANCH,VERCEL_URL:"j4-fixture.vercel.app",J4_FIXTURE_WIX_ENABLED:"1",WIX_DEV_SITE_ID:J4_SITE,WIX_DEV_DATA_API_KEY:"injected-transport-only"};
const admin="qa-j4-staff-1",staff="qa-j4-staff-2",finance="qa-j4-staff-3";
export function createAcceptanceClient({store,clock}){
 const handler=createJ4FixtureHttp({makeStore:()=>store,makeClock:()=>clock});
 return async(action,input={},id=admin,expected=200)=>{
  const response=await handler(new Request(host+"/api/dev/j4-fixture/"+action,{method:"POST",headers:{"content-type":"application/json",origin:host,"sec-fetch-site":"same-origin","x-stem-j4-fixture":"1"},body:JSON.stringify({simulatedStaffId:id,input})}),env);
  const result=await response.json();
  assert.equal(response.status,expected,action+" "+id+" "+result.status);
  assert.equal(response.headers.get("cache-control"),"no-store");
  assert.equal(response.headers.get("x-content-type-options"),"nosniff");
  assert.equal(result.ok,expected===200);
  const safe=(v)=>{if(!v||typeof v!=="object")return;for(const [k,x] of Object.entries(v)){assert.equal(["fixtureCodeKey","digest","dailyFingerprint","sessionDigest","password","authVersion","payerId"].includes(k),false,"private field "+k);safe(x);}};
  safe(result);
  return result;
 };
}
export async function verifyReadOnlyAcceptance({initial,clock,call}){
 validateFixtureState(initial);
 const allowed={admin:["students","memberships","payments","deposits","attendance","checkins","progress","staff","audit"],staff:["students","memberships","attendance","checkins","progress"],finance:["memberships","payments","deposits"]};
 const counts={students:7,memberships:7,payments:5,deposits:1,attendance:7,checkins:7,progress:7,staff:3,audit:initial.audit.length};
 const completed=[];
 for(const role of ["admin","staff","finance"]){
  const account=initial.staff.find(a=>a.role===role&&a.accountStatus==="active");
  if(!account)continue;
  const id=account.staffId;
  const session=await call("session",{},id);assert.equal(session.actor.role,role);assert.equal(session.storage,"wix-fixture");
  assert.equal((await call("choose-fixture-role",{staffId:id},id)).actor.staffId,id);
  const metrics=(await call("overview",{},id)).metrics;
  assert.equal(metrics.activeMemberships,initial.memberships.filter(m=>m.status==="active").length);
  assert.equal(Object.hasOwn(metrics,"students"),role!=="finance");
  assert.equal(Object.hasOwn(metrics,"simulatedPayments"),role!=="staff");
  for(const resource of Object.keys(counts)){
   const canRead=allowed[role].includes(resource);
   const res=await call("list",{resource,query:{page:1,pageSize:5}},id,canRead?200:403);
   if(canRead){assert.equal(res.total,counts[resource]);assert.equal(res.rows.length,Math.min(5,counts[resource]));if(counts[resource]>5){const second=await call("list",{resource,query:{page:2,pageSize:5}},id);assert.equal(second.rows.length,Math.min(5,counts[resource]-5));}}
  }
  for(const s of initial.students){
   const profile=await call("student-profile",{studentId:s.studentId},id,role==="finance"?403:200);
   if(role!=="finance"){assert.equal(profile.student.studentId,s.studentId);assert.equal(profile.student.membershipStatus,s.membershipStatus);assert.equal(Object.values(profile.related).flat().every(x=>x.studentId===s.studentId),true);assert.equal(Object.hasOwn(profile.related,"payments"),role==="admin");}
  }
  const report=await call("simulated-report",{month:initial.payments.find(p=>p.paidAt).paidAt.slice(0,7)},id,role==="staff"?403:200);
  if(role!=="staff"){assert.equal(report.report.fixture,true);assert.match(report.report.csv,/SIMULATED_ONLY/);assert.equal(report.report.count,4);}
  completed.push(role);
 }
 assert.equal(completed.includes("admin"),true);
 const filtered=await call("list",{resource:"students",query:{filters:{name:"Demo",membershipStatus:"active",level:3}}},admin);
 assert.equal(filtered.total,1);assert.equal(filtered.rows[0].studentId,"qa-j4-student-7");
 await call("list",{resource:"students",query:{pageSize:51}},admin,400);
 await call("list",{resource:"payments",query:{filters:{payerId:"qa-j4-payer-1"}}},admin,400);
 await call("student-profile",{studentId:"unknown"},admin,403);
 return {roles:completed,students:initial.students.length,resources:Object.keys(counts).length};
}
export function createAcceptanceTransport(initial){
 let state=structuredClone(initial),writes=0,stale=0;
 const transport=async(url,options)=>{
  const u=new URL(url);assert.equal(u.origin,"https://www.wixapis.com");assert.equal(u.pathname,"/wix-data/v2/items/qa-j4-state-v1");assert.equal(options.headers["wix-site-id"],J4_SITE);
  if(options.method==="GET"){assert.equal(u.searchParams.get("dataCollectionId"),"J4PrivateState");assert.equal(u.searchParams.get("consistentRead"),"true");}
  else if(options.method==="PUT"){const b=JSON.parse(options.body);assert.equal(b.dataCollectionId,"J4PrivateState");if(b.condition.filter.stateVersion.$eq!==state.stateVersion){stale++;return new Response("{}",{status:428});}state=validateFixtureState(JSON.parse(b.dataItem.data.snapshot));writes++;}
  else throw Error("unapproved method");
  return new Response(JSON.stringify({dataItem:{id:"qa-j4-state-v1",dataCollectionId:"J4PrivateState",data:{stateVersion:state.stateVersion,snapshot:JSON.stringify(state)}}}),{status:200});
 };
 const store=createJ4WixStore({...env,J4_PRIVATE_ENABLED:"1",J4_WIX_SITE_ID:J4_SITE,J4_WIX_DATA_API_KEY:env.WIX_DEV_DATA_API_KEY},transport);
 return {store,inspect:()=>structuredClone(state),stats:()=>({writes,stale})};
}
