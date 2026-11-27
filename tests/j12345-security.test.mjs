import test from "node:test";
import assert from "node:assert/strict";
import {getJ12345Readiness,j12345Labels} from "../scripts/j12345/readiness.mjs";
import {getJ1Readiness,handleJ1Readiness} from "../scripts/j1/readiness.mjs";
import {J12345_BRANCH} from "../scripts/j12345/identity-scope.mjs";
import {createJ12345CourseAuthority} from "../scripts/j12345/course.mjs";
const origin="https://fixture.invalid",env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:J12345_BRANCH,VERCEL_URL:"fixture.invalid",WIX_DEV_DATA_API_KEY:"not-a-real-secret",RESEND_API_KEY:"another-fixture-secret"};
test("J12345 Testing Centre exact branch, no live acceptance inference or secret leakage",async()=>{
 const checks=getJ12345Readiness(env);assert.ok(checks);assert.deepEqual(Object.keys(checks).sort(),Object.keys(j12345Labels).sort());
 for(const k of ["j12345Typecheck","j12345Regression","j12345Build","j12345Live","j12345Storage","j12345LearningEntitlement"])assert.equal(checks[k],"NOT_VERIFIED");
 const r=await handleJ1Readiness(new Request(origin+"/dev/testing-centre"),env,()=>{throw Error("Unexpected provider call");});
 assert.equal(r.status,200);const html=await r.text();assert.match(html,/J1 \+ J2 \+ J3 \+ J4 \+ J5 Private Testing Centre/);assert.match(html,/Live acceptance is deferred/);assert.doesNotMatch(html,/not-a-real-secret|another-fixture-secret/);assert.equal(r.headers.get("cache-control"),"private, no-store");assert.equal(r.headers.get("x-robots-tag"),"noindex, nofollow");
});
test("production, wrong branch, wrong host and query string refused",async()=>{
 for(const e of [{...env,VERCEL_ENV:"production"},{...env,VERCEL_TARGET_ENV:"production"},{...env,VERCEL_GIT_COMMIT_REF:"main"}]){assert.equal(getJ12345Readiness(e),null);assert.equal((await handleJ1Readiness(new Request(origin+"/dev/testing-centre"),e)).status,404);}
 for(const u of ["https://elsewhere.invalid/dev/testing-centre",origin+"/dev/testing-centre?probe=1"])assert.equal((await handleJ1Readiness(new Request(u),env)).status,404);
});
test("configuration does not imply access, even with all feature flags on",async()=>{
 const e={...env,J12345_REGISTRATION_ENABLED:"1",J12345_PROFILE_ENABLED:"1",STUDENT_AUTH_ENABLED:"true",J12345_COURSE_ENABLED:"1",J12345_PROGRESS_ENABLED:"1",J12345_ASSESSMENT_ENABLED:"1",J12345_STAFF_LEARNING_ENABLED:"1",J12345_PROVIDER_ACCEPTED:"1"};
 const c=await getJ1Readiness(e);assert.equal(c.j12345LearningEntitlement,"NOT_VERIFIED");assert.equal(c.j12345Live,"NOT_VERIFIED");assert.equal(c.j12345Identity,"NOT_CONFIGURED");
 const id="qa-j2-"+"a".repeat(64),child={childId:id,parentId:"qa-j2-"+"b".repeat(64),accountStatus:"preview-test",stateVersion:"v1"};
 const deps={resolveStudent:async()=>({role:"student",environment:"private-preview",studentId:id}),readVerifiedChild:async()=>child,readAccess:async()=>({membershipEligible:true,attendance:"checked-in"}),resolveResource:()=>({kind:"project",level:1})};
 const r=new Request(origin+"/projects/robot-1");
 assert.equal((await createJ12345CourseAuthority(deps)(r,e,"/projects/robot-1")).code,"COURSE_UNAVAILABLE");
 const progress={status:"ready",levels:Array.from({length:6},(_,i)=>({level:i+1,status:i===0?"unlocked":"locked"}))};
 assert.equal((await createJ12345CourseAuthority({...deps,readProgress:async()=>progress})(r,e,"/projects/robot-1")).code,"LEARNING_POLICY_REQUIRED");
});

import {reviewStaticAssets} from "../scripts/security/review-j12345-static-assets.mjs";
import {mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
test("static curriculum candidates flagged without deleting approved source files",t=>{const root=mkdtempSync(join(tmpdir(),"j12345-static-"));t.after(()=>rmSync(root,{recursive:true,force:true}));writeFileSync(join(root,"program.sb2"),"fixture");writeFileSync(join(root,"robot.stl"),"fixture");writeFileSync(join(root,"art.webp"),"fixture");const r=reviewStaticAssets([root]);assert.equal(r.reviewRequired,true);assert.deepEqual(r.entries.map(e=>e.kind).sort(),["sb2","stl"]);assert.match(r.scope,/separate review/);});
