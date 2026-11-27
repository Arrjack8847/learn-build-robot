// Manual, bounded live authentication acceptance. Real OTP to one operator-approved test inbox.
// No server, deployment, payment, real student information or printed OTP/PIN/session.
import {execFileSync} from "node:child_process";
import {randomUUID} from "node:crypto";
import {createInterface} from "node:readline/promises";
import {Writable} from "node:stream";
import {handleParentOtpTest,handleStudentAuth,resolveJ2Student} from "../j2-runtime.mjs";
import {createJ12345IdentityEnv} from "../j12345/identity-scope.mjs";
import {NOTICE_VERSION} from "../parent-auth/family-preview.mjs";
import {COMBINED_BRANCH,COMBINED_SITE} from "./scope.mjs";
const git=(...a)=>execFileSync("git",a,{encoding:"utf8",stdio:["ignore","pipe","ignore"]}).trim();
const P="__Host-bsr-parent-test",V="__Host-bsr-student-proof",S="__Host-bsr-student";
let env,rl,p="",v="",s="",stage="PREFLIGHT";
const results=[];
const expect=(condition,label)=>{if(!condition)throw Error(label);results.push(label);console.log("PASS: "+label);};
const token=(r,n)=>r.cookies.find(c=>c.startsWith(n+"="))?.split(";")[0].slice(n.length+1)??"";
const checkToken=x=>/^[a-zA-Z0-9_-]{43}$/.test(x);
const origin="https://combined-auth-test.invalid";
async function call(kind,action,body,cookie=""){
 const parent=kind==="parent",handler=parent?handleParentOtpTest:handleStudentAuth;
 const r=await handler(new Request(origin+"/api/dev/"+(parent?"parent-otp":"student-auth")+"/"+action,{method:"POST",headers:{origin,"sec-fetch-site":"same-origin",[parent?"x-stem-otp-test":"x-stem-student-auth"]:"1",...(cookie?{cookie}:{}),...(body?{"content-type":"application/json"}:{})},...(body?{body:JSON.stringify(body)}:{})}),env);
 return {http:r.status,body:await r.json(),cookies:r.headers.getSetCookie()};
}
const c=(name,value)=>name+"="+value;
async function code(prompt){
 process.stdout.write(prompt+" (input hidden): ");
 const value=await rl.question("");
 process.stdout.write("\n");
 if(!/^\d{6}$/.test(value))throw Error("INVALID_SIX_DIGIT_INPUT");
 return value;
}
const validPin=x=>/^\d{6}$/.test(x)&&!/^([0-9])\1{5}$/.test(x)&&!["123456","654321","012345","987654","111222"].includes(x);
try{
 const e=process.env;
 if(!process.stdin.isTTY||e.CODESPACES!=="true"||e.VERCEL_ENV==="production"||e.VERCEL_TARGET_ENV==="production"||e.WIX_DEV_SITE_ID!==COMBINED_SITE||git("rev-parse","--show-toplevel")!==process.cwd()||git("status","--porcelain")||git("rev-parse","HEAD")!==git("rev-parse","refs/remotes/origin/"+COMBINED_BRANCH)||e.NIZAR_FIXTURE_ENABLED==="1"||e.NIZAR_STAFF_FIXTURE_ENABLED==="1")throw Error("PREFLIGHT_REFUSED");
 env={...e,VERCEL_ENV:"preview",VERCEL_GIT_COMMIT_REF:COMBINED_BRANCH,VERCEL_URL:"combined-auth-test.invalid",COMBINED_SCHEDULING_ENABLED:"1",COMBINED_IDENTITY_ENABLED:"1",COMBINED_RUNTIME_ENABLED:"1",J12345_REGISTRATION_ENABLED:"1",STUDENT_AUTH_ENABLED:"true",PARENT_PREVIEW_VERIFIED_SENDER:"noreply@mail.bestemready.edu.my",PARENT_PREVIEW_OPEN_EMAIL:"0"};
 const cfg=createJ12345IdentityEnv(env),email=cfg.RESEND_TEST_RECIPIENT;
 // Require a single controlled inbox for this first run; no automated retry.
 if(env.COMBINED_TEST_EMAILS.split(",").length!==1)throw Error("ONE_APPROVED_TEST_INBOX_REQUIRED");
 const muted=new Writable({write(_chunk,_enc,cb){cb();}});
 rl=createInterface({input:process.stdin,output:muted,terminal:true});
 process.stdout.write("This sends up to three test OTP emails and creates two fictional student records in the development Wix site. Type YES to authorize: ");
 if(await rl.question("")!=="YES")throw Error("NOT_AUTHORIZED");
 process.stdout.write("\n");
 const pins=[await code("Choose fictional student A PIN"),await code("Choose fictional student B PIN")];
 if(!pins.every(validPin)||pins[0]===pins[1])throw Error("DISTINCT_NONTRIVIAL_PINS_REQUIRED");
 stage="PARENT_OTP";
 let r=await call("parent","request-email",{email});
 expect(r.http===200&&r.body.status==="CODE_SENT","Parent OTP accepted by email provider");
 const otp=await code("Enter parent OTP from your inbox");
 r=await call("parent","verify-email",{email,code:otp});p=token(r,P);
 expect(r.http===200&&r.body.status==="VERIFIED"&&checkToken(p),"Parent inbox OTP verified");
 expect((await call("parent","verify-email",{email,code:otp})).body.ok===false,"Consumed parent OTP rejected");
 stage="REGISTRATION";
 const parent=c(P,p);
 const prior=await call("parent","family-status",null,parent);
 if(prior.body.status!=="CONSENT_REQUIRED"&&!(prior.body.status==="FAMILY_READY"&&Array.isArray(prior.body.children)&&prior.body.children.length===0))throw Error("TEST_INBOX_ALREADY_HAS_STUDENTS_OR_UNCONFIRMED");
 r=await call("parent","family-consent",{accepted:true,noticeVersion:NOTICE_VERSION},parent);
 expect(r.body.ok&&r.body.status==="CONSENT_RECORDED","Fictional privacy consent persisted");
 const children=[];
 for(const [i,name] of ["Test Phase Eight Alpha","Test Phase Eight Beta"].entries()){
  const input={name,birthYear:i===0?2014:2016,requestKey:randomUUID()};
  r=await call("parent","family-child-create",input,parent);
  if(!r.body.ok||!r.body.child?.id)throw Error("CHILD_CREATE_UNCONFIRMED");
  const id=r.body.child.id;children.push(id);
  expect((await call("parent","family-child-get",{childId:id},parent)).body.child?.id===id,"Student "+(i+1)+" persisted");
  expect((await call("parent","family-child-create",input,parent)).body.child?.id===id,"Student "+(i+1)+" duplicate request idempotent");
  r=await call("student","enroll",{studentId:id,pin:pins[i]},parent);
  expect(r.body.ok&&r.body.status==="ENROLLED","Student "+(i+1)+" individual PIN enrolled");
 }
 expect(children[0]!==children[1],"Two separate student profiles");
 r=await call("parent","logout",null,parent);
 expect(r.body.status==="SIGNED_OUT"&&(await call("parent","status",null,parent)).body.status==="NOT_VERIFIED","Parent session revoked");p="";
 stage="STUDENT_SIGN_IN";
 for(let i=0;i<2;i++){
  r=await call("student","request",{email});
  expect(r.http===200&&r.body.status==="CODE_SENT","Student "+(i+1)+" email proof sent");
  const otp=await code("Enter student "+(i+1)+" OTP from your inbox");
  r=await call("student","verify",{email,code:otp});v=token(r,V);
  expect(r.http===200&&r.body.status==="EMAIL_VERIFIED"&&checkToken(v),"Student "+(i+1)+" inbox proof verified");
  const proof=c(V,v);
  const list=await call("student","list",null,proof);
  expect(list.body.students?.length===2&&children.every(id=>list.body.students.some(x=>x.id===id)),"Student selection is family-scoped");
  if(i===0)expect((await call("student","sign-in",{studentId:children[1],pin:pins[0]},proof)).body.ok===false,"Sibling PIN cannot authenticate other student");
  r=await call("student","sign-in",{studentId:children[i],pin:pins[i]},proof);s=token(r,S);
  expect(r.body.ok&&r.body.status==="VERIFIED"&&checkToken(s),"Student "+(i+1)+" PIN sign-in verified");
  const req=new Request(origin+"/student/dashboard",{headers:{cookie:c(S,s)}});
  expect((await resolveJ2Student(req,env))?.studentId===children[i],"Student "+(i+1)+" scoped session verified");
  expect((await call("student","sign-in",{studentId:children[i],pin:pins[i]},proof)).body.ok===false,"Consumed student proof rejected");v="";
  r=await call("student","logout",null,c(S,s));
  expect(r.body.status==="SIGNED_OUT"&&await resolveJ2Student(req,env)===null,"Student "+(i+1)+" session revoked");s="";
 }
 console.log(JSON.stringify({status:"SINGLE_FAMILY_VERIFIED",passed:results.length,crossFamily:"NOT_RUN",providerAcceptance:"PARTIAL",releaseReady:false}));
}catch{
 console.error(JSON.stringify({status:"STOPPED_UNCONFIRMED",stage,passed:results.length,releaseReady:false,automaticRetry:false}));
 process.exitCode=1;
}finally{
 // Best-effort revoke only the sessions created by this invocation. Never delete durable test records.
 for(const [kind,name,value] of [["parent",P,p],["student",V,v],["student",S,s]])if(env&&checkToken(value)){try{const r=await call(kind,"logout",null,c(name,value));if(r.body.status!=="SIGNED_OUT")throw Error("REVOKE_UNCONFIRMED");}catch{console.error("Session revocation unconfirmed; do not retry automatically.");process.exitCode=1;}}
 rl?.close();
}
