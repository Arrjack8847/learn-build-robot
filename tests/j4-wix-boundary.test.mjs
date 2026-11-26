import test from "node:test";
import assert from "node:assert/strict";
import {createJ4WixStore} from "../scripts/staff/j4-wix-store.mjs";
import {createJ4Fixtures} from "../scripts/staff/j4-fixtures.mjs";
import {createJ4Crypto} from "../scripts/staff/j4-crypto.mjs";
import {createJ4Http} from "../scripts/staff/j4-private-http.mjs";
import {randomBytes,scryptSync} from "node:crypto";
const branch="feat/j4-private-staff-admin-20261126",site="09d613aa-3a95-42ff-9ee3-2aa0c706c447",origin="https://j4-test.vercel.app";
const env={VERCEL_ENV:"preview",VERCEL_GIT_COMMIT_REF:branch,VERCEL_URL:"j4-test.vercel.app",J4_PRIVATE_ENABLED:"1",J4_WIX_SITE_ID:site,J4_WIX_DATA_API_KEY:"synthetic-test-transport-only"};
test("J4 HTTP plus Wix adapter: three separate staff roles, persistence, stale-write protection and hostile fixture rejection",async()=>{
 const original={...createJ4Fixtures(),mode:"j4-fixture-v1",stateVersion:"initial"};
 const pack=s=>({stateVersion:s.stateVersion,snapshot:JSON.stringify(s)});
 let data=pack(original),calls=0;
 const response=(status,body)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json"}});
 const fake=async(url,opts)=>{
  calls++;assert.equal(opts.headers["wix-site-id"],site);assert.equal(opts.headers.Authorization,env.J4_WIX_DATA_API_KEY);
  assert.equal(opts.redirect,"error");assert.equal(opts.cache,"no-store");
  const u=new URL(url);assert.equal(u.origin,"https://www.wixapis.com");
  assert.equal(u.pathname,"/wix-data/v2/items/qa-j4-state-v1");
  if(opts.method==="GET"){assert.equal(u.searchParams.get("dataCollectionId"),"J4PrivateState");assert.equal(u.searchParams.get("consistentRead"),"true");}
  else if(opts.method==="PUT"){const b=JSON.parse(opts.body);assert.equal(b.dataCollectionId,"J4PrivateState");if(b.condition.filter.stateVersion.$eq!==data.stateVersion)return response(428,{});data=b.dataItem.data;}
  else throw Error("UNEXPECTED_METHOD");
  return response(200,{dataItem:{id:"qa-j4-state-v1",dataCollectionId:"J4PrivateState",data}});
 };
 for(const bad of [{VERCEL_ENV:"production"},{VERCEL_GIT_COMMIT_REF:"main"},{J4_WIX_SITE_ID:"different"},{J4_PRIVATE_ENABLED:"0"}])assert.throws(()=>createJ4WixStore({...env,...bad},fake));
 assert.equal(calls,0);
 const store=createJ4WixStore(env,fake);
 const first=await store.readStrong();
 assert.equal(await store.compareAndSet(first.stateVersion,{...first,stateVersion:"v2"}),true);
 assert.equal(await store.compareAndSet(first.stateVersion,{...first,stateVersion:"v3"}),false);
 const broken={...first,students:first.students.map((x,i)=>i===0?{...x,studentId:"real-student"}:x),stateVersion:"bad"};
 await assert.rejects(()=>store.compareAndSet("v2",broken),/FIXTURE_ID/);
 const ids=["qa-j4-staff-1","qa-j4-staff-2","qa-j4-staff-3"];
 const passwords=ids.map(()=>randomBytes(24).toString("base64url"));
 const hashes=Object.fromEntries(ids.map((id,i)=>{const salt=randomBytes(16);return [id,"scrypt:"+salt.toString("hex")+":"+scryptSync(passwords[i],salt,64).toString("hex")];}));
 const crypto=createJ4Crypto({...env,J4_SESSION_SECRET:randomBytes(32).toString("hex"),J4_STAFF_PASSWORD_HASHES:JSON.stringify(hashes)});
 const clock={now:()=>Date.parse("2026-11-26T12:00:00+08:00"),localDay:()=>"2026-11-26"};
 // Construct a fresh service and adapter every request, as in a serverless runtime.
 const call=(action,body={},cookie="")=>createJ4Http({makeStore:e=>createJ4WixStore(e,fake),makeCrypto:()=>crypto,makeClock:()=>clock})(new Request(origin+"/api/dev/staff-private/"+action,{method:"POST",headers:{"content-type":"application/json",origin,"sec-fetch-site":"same-origin","x-stem-staff":"1",cookie},body:JSON.stringify(body)}),env);
 const cookies=[];
 for(let i=0;i<3;i++){const res=await call("sign-in",{username:ids[i],password:passwords[i]});assert.equal(res.status,200);cookies.push(res.headers.get("set-cookie").split(";")[0]);const info=await call("session",{},cookies[i]);assert.equal((await info.json()).actor.role,["admin","staff","finance"][i]);}
 const allowed=[["students","memberships","payments","deposits","attendance","checkins","progress","staff","audit"],["students","memberships","attendance","checkins","progress"],["memberships","payments","deposits"]];
 for(let i=0;i<3;i++)for(const resource of allowed[0]){const res=await call("list",{resource,query:{page:1,pageSize:2}},cookies[i]);assert.equal(res.status,allowed[i].includes(resource)?200:403,resource+" role "+i);}
 for(let i=1;i<=7;i++){const res=await call("student",{studentId:"qa-j4-student-"+i},cookies[0]);assert.equal(res.status,200);assert.equal((await res.json()).student.studentId,"qa-j4-student-"+i);}
 assert.equal((await call("student",{studentId:"qa-j4-student-1"},cookies[2])).status,403);
 const code=await call("check-in-code",{action:"issue-code",bookingId:"qa-j4-booking-5"},cookies[1]);assert.equal(code.status,200);
 const issued=await code.json();assert.match(issued.code,/^\d{8}$/);
 assert.equal((await call("check-in-code",{action:"validate-code",bookingId:"qa-j4-booking-5",code:issued.code},cookies[1])).status,200);
 assert.equal((await call("check-in-code",{action:"validate-code",bookingId:"qa-j4-booking-5",code:issued.code},cookies[1])).status,403);
 assert.equal((await call("staff-status",{staffId:ids[2],accountStatus:"inactive",reason:"test revocation"},cookies[0])).status,200);
 assert.equal((await call("session",{},cookies[2])).status,401);
 const saved=await createJ4WixStore(env,fake).readStrong();
 assert.equal(saved.attendance[4].status,"attended");assert.equal(saved.codes[0].status,"used");assert.equal(saved.audit.filter(x=>x.action==="validate-code"&&x.result==="success").length,1);
 assert.equal(saved.payments.every(x=>x.evidenceType==="fixture"&&x.providerPaymentId==null),true);
 const badState={...saved,payments:saved.payments.map((x,i)=>i===0?{...x,status:"verified"}:x)};
 data=pack(badState);assert.equal((await call("overview",{},cookies[0])).status,503);
});
