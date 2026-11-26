// One-shot infrastructure QA: only the preconfigured aliases of the designated Gmail inbox.
// No profile creation, payment, or raw addresses, codes, session tokens in logs.
import {isJ1Preview} from "./readiness.mjs";
import {createPortalOtpMailer,openPreviewRecipients} from "../parent-auth/secure-auth-transport.mjs";
import {createPreviewOtp,createPreviewSessionAccess} from "../parent-auth/preview-otp.mjs";
import {reservePreviewEmailBudget} from "../parent-auth/preview-email-budget.mjs";
export function approvedAliases(env){
 const primary=typeof env.RESEND_TEST_RECIPIENT==="string"?env.RESEND_TEST_RECIPIENT.trim().toLowerCase():"";
 if(!/^[a-z0-9.]+@gmail\.com$/.test(primary))return [];
 const expected=[2,3,4,5].map(n=>primary.replace("@gmail.com","+stemlab-parent"+n+"@gmail.com"));
 const supplied=(env.PARENT_PREVIEW_RECIPIENTS??"").split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);
 return supplied.length===4&&new Set(supplied).size===4&&expected.every(x=>supplied.includes(x))?expected:[];
}
export async function runJ1ProviderAcceptance({env,store,crypto,clock,request=fetch}){
 const out={scope:"REFUSED",databaseWrite:false,conditionalUpdate:false,staleWriteRejected:false,aliasCount:0,providerAccepted:0,otpVerified:0,replayRejected:0,sessionRevoked:0,crossIdentityRejected:0,budgetRefused:0,failed:0,oneShot:"NOT_RUN"};
 if(!isJ1Preview(env)||!openPreviewRecipients(env)||env.PARENT_PREVIEW_VERIFIED_SENDER!=="noreply@mail.bestemready.edu.my")return out;
 const aliases=approvedAliases(env);if(aliases.length!==4)return out;
 out.scope="PRIVATE_QA";out.aliasCount=aliases.length;
 const collection="SandboxBillingState",id="qa-j1-provider-acceptance-v1";
 const row=(version,stage)=>({environment:"sandbox-qa",stateVersion:version,stateJson:JSON.stringify({kind:"j1-provider-acceptance",stage,summary:out})});
 let version=crypto.newVersion();
 try{
  if(await store.get(collection,id)||await store.insert(collection,id,row(version,"reserved"))!==true){out.oneShot="ALREADY_RESERVED";return out;}
  out.oneShot="RESERVED";
  const initial=await store.get(collection,id);out.databaseWrite=initial?.stateVersion===version&&initial.environment==="sandbox-qa";
  if(!out.databaseWrite)throw Error("WRITE_UNCONFIRMED");
  out.staleWriteRejected=await store.replaceIfVersion(collection,id,crypto.newVersion(),row(crypto.newVersion(),"must-not-write"))===false;
  if(!out.staleWriteRejected)throw Error("STALE_WRITE_ACCEPTED");
  const next=crypto.newVersion();out.conditionalUpdate=await store.replaceIfVersion(collection,id,version,row(next,"running"))===true;
  if(!out.conditionalUpdate)throw Error("UPDATE_UNCONFIRMED");version=next;
  if((await store.get(collection,id))?.stateVersion!==version)throw Error("READBACK_UNCONFIRMED");
  const scoped={...crypto,identityDigest:(kind,value)=>crypto.identityDigest("j1-provider-qa-v1:"+kind,value)};
  const sessionAccess=createPreviewSessionAccess({store,crypto:scoped,clock});
  let previous=null;
  for(const recipient of aliases){
   let code=null,token=null,service=null;
   try{
    if(!await reservePreviewEmailBudget({store,crypto,clock})){out.budgetRefused++;continue;}
    const transport=createPortalOtpMailer(env,recipient,request);
    service=createPreviewOtp({store,crypto:scoped,clock,recipient,mailer:{async sendParentCode(email,value,ttl,challenge){await transport.sendParentCode(email,value,ttl,challenge);code=value;}}});
    const sent=await service.requestCode();
    if(sent.status!=="CODE_SENT"||typeof code!=="string")throw Error("SEND_UNCONFIRMED");
    out.providerAccepted++;
    const verified=await service.verifyCode(code);
    if(verified.status!=="VERIFIED"||!verified.token)throw Error("OTP_UNCONFIRMED");
    token=verified.token;out.otpVerified++;
    if((await service.verifyCode(code)).ok===false)out.replayRejected++;
    if(!(await sessionAccess.resolveIdentity(token)))throw Error("SESSION_UNCONFIRMED");
    if(previous&&!(await previous.resolveIdentity(token)))out.crossIdentityRejected++;
    previous=service;
   }catch{out.failed++;}
   finally{
    code=null;
    if(token&&service){try{await service.logout(token);if(!(await sessionAccess.resolveIdentity(token)))out.sessionRevoked++;else out.failed++;}catch{out.failed++;}}
    token=null;
   }
  }
  const final=crypto.newVersion();out.oneShot="COMPLETE";
  if(await store.replaceIfVersion(collection,id,version,row(final,"complete"))!==true)out.oneShot="FINAL_WRITE_UNCONFIRMED";
  else if((await store.get(collection,id))?.stateVersion!==final)out.oneShot="FINAL_READ_UNCONFIRMED";
 }catch{out.failed++;out.oneShot="BLOCKED_NO_RETRY";}
 return out;
}
