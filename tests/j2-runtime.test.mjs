import test from "node:test";
import assert from "node:assert/strict";
import {handleParentOtpTest,handleStudentAuth,resolveJ2Student} from "../scripts/j2-runtime.mjs";
test("real J2 server composition denies production and missing configuration without contacting providers",async()=>{
 const base="https://j2.invalid",env={VERCEL_ENV:"preview",VERCEL_URL:"j2.invalid"};
 const p=new Request(base+"/api/dev/parent-otp/status",{method:"POST",headers:{origin:base,"sec-fetch-site":"same-origin","x-stem-otp-test":"1"}});
 const s=new Request(base+"/api/dev/student-auth/status",{method:"POST",headers:{origin:base,"sec-fetch-site":"same-origin","x-stem-student-auth":"1"}});
 for(const [handler,req] of [[handleParentOtpTest,p],[handleStudentAuth,s]]){
  const blocked=await handler(req,{...env,VERCEL_ENV:"production"});assert.equal(blocked.status,404);
  const response=await handler(req,env);assert.equal(response.status,503);assert.equal((await response.json()).status,"CONFIGURATION_REQUIRED");
 }
 assert.equal(await resolveJ2Student(s,env),null);
 assert.equal(await resolveJ2Student(s,{...env,STUDENT_AUTH_ENABLED:"true"}),null);
});
