// J2 composition only. The typed TypeScript boundary imports this server-only module.
import {createParentAuthHttp} from "./parent-auth/http.mjs";
import {createWixStore} from "./parent-auth/wix-store.mjs";
import {createAuthCrypto,createPortalOtpMailer,previewRecipients,openPreviewRecipients,validPreviewEmail} from "./parent-auth/secure-auth-transport.mjs";
import {createStudentContext} from "./student-auth/session-context.mjs";
import {createStudentAuthHttp} from "./student-auth/http.mjs";
import {reserveIntegratedEmail} from "./parent-auth/preview-email-budget.mjs";
import {createStudentAuthCrypto} from "./student-auth/crypto.mjs";

import {J123_BRANCH,requireJ123Identity} from "./j123/infrastructure.mjs";

function context(env){
 if(env.VERCEL_GIT_COMMIT_REF===J123_BRANCH)requireJ123Identity(env);
 const open=openPreviewRecipients(env);
 if(open&&(!["integration/j1-j2-20261126","integration/j1-j2-j3-20261126"].includes(env.VERCEL_GIT_COMMIT_REF)||!validPreviewEmail(env.PARENT_PREVIEW_VERIFIED_SENDER)||env.PARENT_PREVIEW_VERIFIED_SENDER==="onboarding@resend.dev"))throw Error("INTEGRATION_SCOPE_REQUIRED");
 const db=createWixStore(env),auth=createAuthCrypto(env),clock={now:()=>Date.now()},emails=open?[]:previewRecipients(env);
 const mailerFor=email=>createPortalOtpMailer(env,email);
 const reserveEmail=email=>reserveIntegratedEmail({store:db,crypto:auth,clock,email});
 return {db,auth,clock,emails,mailerFor,open,reserveEmail};
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
 return {db:base.db,emails:base.emails,open:base.open,reserveEmail:base.reserveEmail,context:studentContext(env,base)};
}});
export const handleParentOtpTest=createParentAuthHttp({resolveContext:async env=>{
 const recipient=env.RESEND_TEST_RECIPIENT?.trim().toLowerCase();
 if(!recipient||!validPreviewEmail(recipient)||!env.WIX_DEV_DATA_API_KEY?.trim()||!env.PARENT_AUTH_SECRET?.trim())return null;
 const base=context(env);
 const revokeStudent=async(studentToken,proofToken)=>{
  const student=studentContext(env,base);
  await student.identity.logout(studentToken);
  const old=await student.locate(proofToken,true);if(old)await old.service.logout(proofToken);
 };
 return {db:base.db,crypto:base.auth,clock:base.clock,approved:base.emails,recipient,mailerFor:base.mailerFor,open:base.open,reserveEmail:base.reserveEmail,revokeStudent};
}});

// Trusted payment boundary: fresh payer OTP, current consent, selected student's PIN enrollment.
export async function resolveJ123CheckoutPayer(request,env,childId){
 if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.VERCEL_GIT_COMMIT_REF!=="integration/j1-j2-j3-20261126"||env.STUDENT_AUTH_ENABLED!=="true")return null;
 const base=context(env),student=studentContext(env,base),token=read(request,"__Host-bsr-parent-test"),payer=await student.payer(token);
 if(payer?.role!=="payer")return null;
 const child=await student.familyFor(payer.parentId).handle("internal","family-child-get",{childId});
 if(!child.ok||child.child?.id!==childId)return null;
 const enrollment=await student.identity.enrollmentStatus(token,childId);
 if(!enrollment.ok||enrollment.status!=="PIN_ALREADY_SET")return null;
 return {parentId:payer.parentId,childId,email:payer.parentId+"@example.invalid"};
}
