// J2 composition only. The typed TypeScript boundary imports this server-only module.
import {createParentAuthHttp} from "./parent-auth/http.mjs";
import {createWixStore} from "./parent-auth/wix-store.mjs";
import {createAuthCrypto,createPortalOtpMailer,previewRecipients} from "./parent-auth/secure-auth-transport.mjs";
import {createStudentContext} from "./student-auth/session-context.mjs";
import {createStudentAuthHttp} from "./student-auth/http.mjs";
import {createStudentAuthCrypto} from "./student-auth/crypto.mjs";

function context(env){
 const db=createWixStore(env),auth=createAuthCrypto(env),clock={now:()=>Date.now()},emails=previewRecipients(env);
 const mailerFor=email=>createPortalOtpMailer(env,email);
 return {db,auth,clock,emails,mailerFor};
}
function studentContext(env,base){
 return createStudentContext({...base,crypto:createStudentAuthCrypto(env)});
}
const studentCookie="__Host-bsr-student";
const read=(request,name)=>{const parts=(request.headers.get("cookie")??"").split(";").map(p=>p.trim()).filter(p=>p.startsWith(name+"="));return parts.length===1?parts[0].slice(name.length+1):"";};
export async function resolveJ2Student(request,env){
 if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.STUDENT_AUTH_ENABLED!=="true")return null;
 try{return await studentContext(env,context(env)).identity.resolveStudentSession(read(request,studentCookie));}
 catch{return null;}
}
export const handleStudentAuth=createStudentAuthHttp({resolveContext:async env=>{
 const base=context(env);
 return {db:base.db,emails:base.emails,context:studentContext(env,base)};
}});
export const handleParentOtpTest=createParentAuthHttp({resolveContext:async env=>{
 const recipient=env.RESEND_TEST_RECIPIENT?.trim().toLowerCase();
 if(!recipient||!env.WIX_DEV_DATA_API_KEY?.trim()||!env.PARENT_AUTH_SECRET?.trim())return null;
 const base=context(env);
 const revokeStudent=async(studentToken,proofToken)=>{
  const student=studentContext(env,base);
  await student.identity.logout(studentToken);
  const old=await student.locate(proofToken,true);if(old)await old.service.logout(proofToken);
 };
 return {db:base.db,crypto:base.auth,clock:base.clock,approved:base.emails,recipient,mailerFor:base.mailerFor,revokeStudent};
}});
