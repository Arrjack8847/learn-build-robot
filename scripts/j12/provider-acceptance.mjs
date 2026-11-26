// Explicit one-shot, private integration QA. Only previously approved Gmail aliases.
// No payment/profile creation, no secret, OTP, address or session-token logging.
import {createAuthCrypto,createPortalOtpMailer,openPreviewRecipients,validPreviewEmail} from "../parent-auth/secure-auth-transport.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {createPreviewSessionAccess} from "../parent-auth/preview-otp.mjs";
import {createParentAuthHttp} from "../parent-auth/http.mjs";
import {createStudentAuthHttp} from "../student-auth/http.mjs";
import {createStudentAuthCrypto} from "../student-auth/crypto.mjs";
import {createStudentContext} from "../student-auth/session-context.mjs";
import {reserveIntegratedEmail} from "../parent-auth/preview-email-budget.mjs";

export const selectedMessage="J1 J2: integrate student-centric auth and verified open email [skip ci]";
export function permitted(env){
 return env.VERCEL_ENV==="preview"&&env.VERCEL_TARGET_ENV!=="production"&&env.VERCEL_GIT_COMMIT_REF==="integration/j1-j2-20261126"&&env.VERCEL_GIT_COMMIT_MESSAGE===selectedMessage&&openPreviewRecipients(env)&&env.PARENT_PREVIEW_VERIFIED_SENDER==="noreply@mail.bestemready.edu.my"&&env.STUDENT_AUTH_ENABLED==="true"&&env.WIX_DEV_SITE_ID==="09d613aa-3a95-42ff-9ee3-2aa0c706c447"&&/^[a-z0-9.]+@gmail\.com$/.test(env.RESEND_TEST_RECIPIENT??"")&&validPreviewEmail(env.RESEND_TEST_RECIPIENT)&&/^[a-z0-9.-]+\.vercel\.app$/.test(env.VERCEL_URL??"");
}
export async function runProviderAcceptance(env,{db,baseAuth,studentCrypto,clock,request}){
 const out={scope:"REFUSED",oneShot:"NOT_RUN",emailsAccepted:0,parentVerified:false,proofVerified:false,roleIsolation:false,replaysRejected:0,sessionsRevoked:0,failed:false};
 if(!permitted(env))return out;
 out.scope="PRIVATE_QA";
 const collection="SandboxBillingState",id="qa-j12-open-auth-provider-v1",version=baseAuth.newVersion();
 const state=(v,stage)=>({environment:"sandbox-qa",stateVersion:v,stateJson:JSON.stringify({kind:"j12-provider-qa",stage,summary:out})});
 if(await db.get(collection,id)||await db.insert(collection,id,state(version,"reserved"))!==true){out.oneShot="ALREADY_RESERVED";return out;}
 out.oneShot="RESERVED";
 const auth={...baseAuth,identityDigest:(kind,value)=>baseAuth.identityDigest("j12-provider-qa:"+kind,value)};
 const primary=env.RESEND_TEST_RECIPIENT;
 const aliases=[2,3].map(n=>primary.replace("@gmail.com","+stemlab-parent"+n+"@gmail.com"));
 const mailerFor=recipient=>{if(!aliases.includes(recipient))throw Error("UNAPPROVED_TEST_RECIPIENT");const transport=createPortalOtpMailer(env,recipient,request);return {async sendParentCode(email,code,ttl,id){await transport.sendParentCode(email,code,ttl,id);codes.set(recipient,code);out.emailsAccepted++;}};};
 const codes=new Map(),emails=[],open=true;
 const reserveEmail=email=>reserveIntegratedEmail({store:db,crypto:baseAuth,clock,email});
 const context=createStudentContext({db,auth,crypto:studentCrypto,clock,emails,mailerFor,open});
 const revokeStudent=async(s,p)=>{await context.identity.logout(s);const prior=await context.locate(p,true);if(prior)await prior.service.logout(p);};
 const parent=createParentAuthHttp({resolveContext:async()=>({db,crypto:auth,clock,approved:[],recipient:primary,mailerFor,revokeStudent,open,reserveEmail})});
 const student=createStudentAuthHttp({resolveContext:async()=>({db,emails,context,open,reserveEmail})});
 const call=async(kind,action,body,cookie="")=>{
  const origin="https://"+env.VERCEL_URL,prefix=kind==="parent"?"parent-otp":"student-auth",header=kind==="parent"?"x-stem-otp-test":"x-stem-student-auth";
  const response=await (kind==="parent"?parent:student)(new Request(origin+"/api/dev/"+prefix+"/"+action,{method:"POST",headers:{origin,"sec-fetch-site":"same-origin",[header]:"1",...(cookie?{cookie}:{}),...(body?{"content-type":"application/json"}:{})},...(body?{body:JSON.stringify(body)}:{})}),env);
  return {http:response.status,body:await response.json(),cookies:response.headers.getSetCookie()};
 };
 const token=(r,name)=>r.cookies.find(c=>c.startsWith(name+"="))?.split(";")[0]?.split("=")[1];
 const parentAccess=createPreviewSessionAccess({store:db,crypto:auth,clock});
 const proofAccess=createPreviewSessionAccess({store:db,crypto:auth,clock,accountType:"student-email-proof-v2"});
 let p=null,v=null;
 try{
  const a=aliases[0],b=aliases[1];
  let r=await call("parent","request-email",{email:a});
  if(r.body.status!=="CODE_SENT"||!codes.has(a))throw Error("PARENT_SEND_FAILED");
  const ac=codes.get(a);codes.delete(a);
  r=await call("parent","verify-email",{email:a,code:ac});
  p=token(r,"__Host-bsr-parent-test");
  out.parentVerified=r.body.status==="VERIFIED"&&!!(await parentAccess.resolveIdentity(p));
  if(!out.parentVerified)throw Error("PARENT_VERIFY_FAILED");
  if((await call("parent","verify-email",{email:a,code:ac})).body.ok===false)out.replaysRejected++;
  r=await call("student","request",{email:b});
  if(r.body.status!=="CODE_SENT"||!codes.has(b))throw Error("PROOF_SEND_FAILED");
  const bc=codes.get(b);codes.delete(b);
  r=await call("student","verify",{email:b,code:bc});
  v=token(r,"__Host-bsr-student-proof");
  const proof=await context.proof(v);
  out.proofVerified=r.body.status==="EMAIL_VERIFIED"&&proof?.parentId==="qa-j2-"+auth.identityDigest("parent-preview-session",b);
  if(!out.proofVerified)throw Error("PROOF_VERIFY_FAILED");
  if((await call("student","verify",{email:b,code:bc})).body.ok===false)out.replaysRejected++;
  out.roleIsolation=!(await parentAccess.resolveIdentity(v))&&!(await proofAccess.resolveIdentity(p))&&await context.payer(v)===null&&await context.proof(p)===null;
  if(!out.roleIsolation)throw Error("ROLE_ISOLATION_FAILED");
 }catch{out.failed=true;}
 finally{
  codes.clear();
  if(p){try{await call("parent","logout",null,"__Host-bsr-parent-test="+p);if(!(await parentAccess.resolveIdentity(p)))out.sessionsRevoked++;else out.failed=true;}catch{out.failed=true;}}
  if(v){try{await call("student","logout",null,"__Host-bsr-student-proof="+v);if(!(await proofAccess.resolveIdentity(v)))out.sessionsRevoked++;else out.failed=true;}catch{out.failed=true;}}
 }
 out.oneShot="COMPLETE";
 const next=baseAuth.newVersion();
 if(await db.replaceIfVersion(collection,id,version,state(next,"complete"))!==true||(await db.get(collection,id))?.stateVersion!==next){out.failed=true;out.oneShot="WRITE_UNCONFIRMED";}
 return out;
}
if(permitted(process.env)){
 try{
  const env=process.env;
  const r=await runProviderAcceptance(env,{db:createWixStore(env),baseAuth:createAuthCrypto(env),studentCrypto:createStudentAuthCrypto(env),clock:{now:()=>Date.now()},request:fetch});
  console.log("[J12 provider acceptance] "+JSON.stringify(r));
 }catch{console.log("[J12 provider acceptance] "+JSON.stringify({failed:true,status:"UNCONFIRMED_NO_RETRY"}));}
}
