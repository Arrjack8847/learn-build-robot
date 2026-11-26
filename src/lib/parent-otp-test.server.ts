// Vercel-protected private J2 preview. No payment or learning privileges.
import {createParentAuthHttp} from "../../scripts/parent-auth/http.mjs";
import {createWixStore} from "../../scripts/parent-auth/wix-store.mjs";
import {createAuthCrypto,createPortalOtpMailer,previewRecipients} from "../../scripts/parent-auth/secure-auth-transport.mjs";
import {createStudentContext} from "../../scripts/student-auth/session-context.mjs";
import {createStudentAuthCrypto} from "../../scripts/student-auth/crypto.mjs";

export const handleParentOtpTest=createParentAuthHttp({resolveContext:async(env:NodeJS.ProcessEnv)=>{
 const recipient=env.RESEND_TEST_RECIPIENT?.trim().toLowerCase();
 if(!recipient||!env.WIX_DEV_DATA_API_KEY?.trim()||!env.PARENT_AUTH_SECRET?.trim())return null;
 const db=createWixStore(env),auth=createAuthCrypto(env),clock={now:()=>Date.now()},approved=previewRecipients(env);
 const mailerFor=(email:string)=>createPortalOtpMailer(env,email);
 const revokeStudent=async(studentToken:string,proofToken:string)=>{
  const student=createStudentContext({db,auth,crypto:createStudentAuthCrypto(env),clock,emails:approved,mailerFor});
  await student.identity.logout(studentToken);
  const old=await student.locate(proofToken,true);if(old)await old.service.logout(proofToken);
 };
 return {db,crypto:auth,clock,approved,recipient,mailerFor,revokeStudent};
}});
