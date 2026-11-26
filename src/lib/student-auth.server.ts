// Private-preview student sign-in. No paid learning access or Wix member token issuance.
import {createWixStore} from "../../scripts/parent-auth/wix-store.mjs";
import {createAuthCrypto,createPortalOtpMailer,previewRecipients} from "../../scripts/parent-auth/secure-auth-transport.mjs";
import {createStudentContext} from "../../scripts/student-auth/session-context.mjs";
import {createStudentAuthHttp} from "../../scripts/student-auth/http.mjs";
import {createStudentAuthCrypto} from "../../scripts/student-auth/crypto.mjs";
const studentCookie="__Host-bsr-student";
const read=(request:Request,name:string)=>{const parts=(request.headers.get("cookie")??"").split(";").map(p=>p.trim()).filter(p=>p.startsWith(name+"="));return parts.length===1?parts[0].slice(name.length+1):"";};
// J5 server handlers call this with the incoming request. Never return the raw token.
export async function resolveJ2Student(request:Request,env:NodeJS.ProcessEnv){
 if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.STUDENT_AUTH_ENABLED!=="true")return null;
 try{
  const db=createWixStore(env),auth=createAuthCrypto(env),crypto=createStudentAuthCrypto(env),clock={now:()=>Date.now()},emails=previewRecipients(env);
  const {identity}=createStudentContext({db,auth,crypto,clock,emails,mailerFor:(email:string)=>createPortalOtpMailer(env,email)});
  return await identity.resolveStudentSession(read(request,studentCookie));
 }catch{return null;}
}
export const handleStudentAuth=createStudentAuthHttp({resolveContext:async(env:NodeJS.ProcessEnv)=>{
 const db=createWixStore(env),auth=createAuthCrypto(env),crypto=createStudentAuthCrypto(env),clock={now:()=>Date.now()},emails=previewRecipients(env);
 const context=createStudentContext({db,auth,crypto,clock,emails,mailerFor:(email:string)=>createPortalOtpMailer(env,email)});
 return {db,emails,context};
}});
