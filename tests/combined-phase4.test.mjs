import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {COMBINED_BRANCH,COMBINED_SITE} from "../scripts/combined/scope.mjs";
import {createCombinedPrivateDocuments} from "../scripts/combined/private-document-provider.mjs";
import {createPrivatePdfHttp} from "../scripts/j5/pdf-http.mjs";
import {createJ12345CourseAuthority} from "../scripts/j12345/course.mjs";
const start=Date.parse("2026-11-27T10:00:00+08:00"),end=start+3600000;
const studentId="qa-j2-"+"a".repeat(64),parentId="qa-j2-"+"b".repeat(64),bookingId="fixture-booking-001",revision="fixture-revision-001";
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:COMBINED_BRANCH,WIX_DEV_SITE_ID:COMBINED_SITE,VERCEL_URL:"fixture.example.test",COMBINED_RUNTIME_ENABLED:"1",COMBINED_IDENTITY_ENABLED:"1",COMBINED_SCHEDULING_ENABLED:"1",J12345_COURSE_ENABLED:"1",J12345_PROFILE_ENABLED:"1",J12345_REGISTRATION_ENABLED:"1",STUDENT_AUTH_ENABLED:"true",J12345_LEARNING_SESSION_ENABLED:"1",J5_PRIVATE_ENABLED:"true"};
const digest=b=>createHash("sha256").update(b).digest("hex");
test("combined course must match canonical booking revision and valid session grant",async()=>{
 let now=start+60000,grant={bookingId,revision,validUntil:end},member=true;
 const access={membership:"active",membershipEligible:true,membershipValidUntil:end+86400000,attendance:"checked-in",reason:"learning-policy-required",bookingId,bookingRevision:revision,bookingStartAt:start,bookingEndAt:end,checkInAt:start+1000};
 const authority=createJ12345CourseAuthority({resolveStudent:async()=>({role:"student",studentId,environment:"private-preview"}),readVerifiedChild:async()=>({childId:studentId,parentId,accountStatus:"preview-test",stateVersion:"v1"}),readAccess:async()=>({...access,membershipEligible:member}),resolveResource:r=>({kind:r.kind,level:1}),readProgress:async()=>({status:"ready",revision:"progress-fixture-v1",policyVersion:"policy-fixture-v1",policyHash:"a".repeat(64),levels:Array.from({length:6},(_,i)=>({level:i+1,status:"unlocked"}))}),verifyVisit:async()=>grant,clock:()=>now});
 const request=new Request("https://fixture.example.test/projects/robot"),run=()=>authority(request,env,"/projects/robot");
 assert.equal((await run()).validUntil,end);
 grant={...grant,revision:"other-revision"};assert.equal((await run()).ok,false);
 grant={bookingId,revision,validUntil:now+5000};assert.equal((await run()).validUntil,now+5000);
 grant=null;assert.equal((await run()).ok,false);
 grant={bookingId,revision,validUntil:end};member=false;assert.equal((await run()).ok,false);member=true;
 now=end;assert.equal((await run()).ok,false);
});
function pdfFixture(){
 let now=start+1000,allowed=true,calls=0,corrupt=false;
 const bytes=Buffer.concat([Buffer.from("%PDF-1.7\n"),Buffer.alloc(300000,65)]);
 const manifest=Buffer.from(JSON.stringify({scope:"combined-private-pdf-v1",documents:[{documentId:"pdf-0001",version:"v1",sha256:digest(bytes),size:bytes.length}]}));
 const e={...env,COMBINED_PRIVATE_PDF_ENABLED:"1",COMBINED_PRIVATE_PDF_ACCEPTED:"1",COMBINED_PRIVATE_PDF_ORIGIN:"https://private.example.test",COMBINED_PRIVATE_PDF_TOKEN:"fixture-only-not-real-credential-1234",COMBINED_PRIVATE_PDF_MANIFEST_SHA256:digest(manifest)};
 const authorize=async()=>allowed&&now<end?{ok:true,status:200,code:"COURSE_AUTHORIZED",validUntil:end}:{ok:false,status:403};
 const request=async(url,opt)=>{calls++;assert.equal(opt.redirect,"error");assert.equal(opt.headers.Authorization,"Bearer "+e.COMBINED_PRIVATE_PDF_TOKEN);const body=url.endsWith("/v1/manifest.json")?manifest:corrupt?Buffer.from(bytes.map((v,i)=>i===10?v+1:v)):bytes;return new Response(body,{headers:{"content-type":url.endsWith(".json")?"application/json":"application/pdf","cache-control":"private, no-store","content-length":String(body.length)}});};
 const service=()=>createCombinedPrivateDocuments({env:e,authorize,request});
 const http=createPrivatePdfHttp({lookupDocument:async id=>id==="pdf-0001"?{id,coursePaths:["/projects/robot"]}:null,getServices:async()=>service(),now:()=>now});
 const run=(method="GET",headers={})=>http(new Request("https://fixture.example.test/api/dev/j5/pdf/pdf-0001",{method,headers}),e);
 return {e,service,run,calls:()=>calls,deny:()=>{allowed=false},expire:()=>{now=end},corrupt:()=>{corrupt=true}};
}
test("private PDF gateway requires approved manifest and verifies full content",async()=>{
 const x=pdfFixture();assert.equal(createCombinedPrivateDocuments({env:{...x.e,COMBINED_PRIVATE_PDF_ACCEPTED:"0"},authorize:async()=>({})}),null);
 const r=await x.run("GET",{range:"bytes=0-15"});assert.equal(r.status,206);assert.match(r.headers.get("cache-control"),/no-store/);assert.equal((await r.arrayBuffer()).byteLength,16);assert.equal(x.calls(),2);
 const y=pdfFixture();y.corrupt();assert.equal((await y.run()).status,503);
 const z=pdfFixture();z.deny();assert.equal((await z.run()).status,403);assert.equal(z.calls(),0);
});
test("PDF stream cannot deliver another chunk after booked-hour expiration",async()=>{
 const x=pdfFixture(),r=await x.run();assert.equal(r.status,200);
 const reader=r.body.getReader(),first=await reader.read();assert.equal(first.value.byteLength,256*1024);
 x.expire();await assert.rejects(reader.read(),/PDF access unavailable/);
});
