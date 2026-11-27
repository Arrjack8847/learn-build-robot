// J2 composition only. The typed TypeScript boundary imports this server-only module.
import {createParentAuthHttp} from "./parent-auth/http.mjs";
import {createWixStore} from "./parent-auth/wix-store.mjs";
import {createAuthCrypto,createPortalOtpMailer,previewRecipients,openPreviewRecipients,validPreviewEmail} from "./parent-auth/secure-auth-transport.mjs";
import {createStudentContext} from "./student-auth/session-context.mjs";
import {createStudentAuthHttp} from "./student-auth/http.mjs";
import {reserveIntegratedEmail} from "./parent-auth/preview-email-budget.mjs";
import {createStudentAuthCrypto} from "./student-auth/crypto.mjs";

import {J123_BRANCH,requireJ123Identity,isIntegratedBillingPreview} from "./j123/infrastructure.mjs";
import {scopeJ123StudentCredentials} from "./j123/student-credential-scope.mjs";
import {J1234_BRANCH,createJ1234IdentityEnv,scopeJ1234StudentCredentials} from "./j1234/identity-scope.mjs";

import {J12345_BRANCH,createJ12345IdentityEnv,scopeJ12345StudentCredentials,validJ12345Student} from "./j12345/identity-scope.mjs";

function context(env){
 if(env.VERCEL_GIT_COMMIT_REF===J12345_BRANCH)env=createJ12345IdentityEnv(env);
 if(env.VERCEL_GIT_COMMIT_REF===J1234_BRANCH)env=createJ1234IdentityEnv(env);
 if(env.VERCEL_GIT_COMMIT_REF===J123_BRANCH)requireJ123Identity(env);
 const open=openPreviewRecipients(env);
 if(open&&(!["integration/j1-j2-20261126","integration/j1-j2-j3-20261126"].includes(env.VERCEL_GIT_COMMIT_REF)||!validPreviewEmail(env.PARENT_PREVIEW_VERIFIED_SENDER)||env.PARENT_PREVIEW_VERIFIED_SENDER==="onboarding@resend.dev"))throw Error("INTEGRATION_SCOPE_REQUIRED");
 const db=createWixStore(env),auth=createAuthCrypto(env),clock={now:()=>Date.now()},emails=open?[]:previewRecipients(env);
 const mailerFor=email=>createPortalOtpMailer(env,email);
 const reserveEmail=email=>reserveIntegratedEmail({store:db,crypto:auth,clock,email});
 return {db,auth,clock,emails,mailerFor,open,reserveEmail,runtimeEnv:env};
}
function studentContext(env,base){
 return createStudentContext({...base,db:env.VERCEL_GIT_COMMIT_REF===J12345_BRANCH?scopeJ12345StudentCredentials(base.db):env.VERCEL_GIT_COMMIT_REF===J1234_BRANCH?scopeJ1234StudentCredentials(base.db):env.VERCEL_GIT_COMMIT_REF===J123_BRANCH?scopeJ123StudentCredentials(base.db):base.db,crypto:createStudentAuthCrypto(base.runtimeEnv??env)});
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
 const identityEnv=env.VERCEL_GIT_COMMIT_REF===J12345_BRANCH?createJ12345IdentityEnv(env):env.VERCEL_GIT_COMMIT_REF===J1234_BRANCH?createJ1234IdentityEnv(env):env;
 const recipient=identityEnv.RESEND_TEST_RECIPIENT?.trim().toLowerCase();
 if(!recipient||!validPreviewEmail(recipient)||!identityEnv.WIX_DEV_DATA_API_KEY?.trim()||!identityEnv.PARENT_AUTH_SECRET?.trim())return null;
 const base=context(env);
 const revokeStudent=async(studentToken,proofToken)=>{
  const student=studentContext(env,base);
  await student.identity.logout(studentToken);
  const old=await student.locate(proofToken,true);if(old)await old.service.logout(proofToken);
 };
 return {db:base.db,crypto:base.auth,clock:base.clock,approved:base.emails,recipient,mailerFor:base.mailerFor,open:base.open,reserveEmail:base.reserveEmail,revokeStudent};
}});

// Trusted payment boundary: fresh payer OTP, current consent, selected student's PIN enrollment.
export function createJ123CheckoutPayer({getStudentContext=env=>studentContext(env,context(env))}={}){
 return async function resolveJ123CheckoutPayer(request,env,childId){
 if(!isIntegratedBillingPreview(env)||env.STUDENT_AUTH_ENABLED!=="true")return null;
 if(!/^qa-j2-[a-f0-9]{64}$/.test(childId??""))return null;
 const student=getStudentContext(env),token=read(request,"__Host-bsr-parent-test"),payer=await student.payer(token);
 if(payer?.role!=="payer")return null;
 const child=await student.familyFor(payer.parentId).handle("internal","family-child-get",{childId});
 if(!child.ok||child.child?.id!==childId)return null;
 const enrollment=await student.identity.enrollmentStatus(token,childId);
 if(!enrollment.ok||enrollment.status!=="PIN_ALREADY_SET")return null;
 const fresh=await student.payer(token);
 if(fresh?.role!=="payer"||fresh.parentId!==payer.parentId)return null;
 return {parentId:payer.parentId,childId,email:payer.parentId+"@example.invalid"};
 };
}
export const resolveJ123CheckoutPayer=createJ123CheckoutPayer();

// Internal read-only profile adapter, never a browser-selected student ID.
export async function readJ12345VerifiedChild(studentId,env){
 if(!validJ12345Student(studentId))return null;
 const cfg=createJ12345IdentityEnv(env),base=context(env),student=studentContext(env,base);
 const row=await base.db.get("Children",studentId);
 const parentId=typeof row?.parentId==="string"?row.parentId:row?.parentId?._id??row?.parentId?.id;
 const allowed=new Set(previewRecipients(cfg).map(email=>"qa-j2-"+base.auth.identityDigest("parent-preview-session",email)));
 if(row?.childId!==studentId||row.accountStatus!=="preview-test"||!allowed.has(parentId))return null;
 const result=await student.familyFor(parentId).handle("internal","family-child-get",{childId:studentId});
 if(!result.ok||result.child?.id!==studentId||result.child.version!==row.stateVersion||result.child.name!==row.name)return null;
 return {childId:studentId,parentId,name:row.name,accountStatus:row.accountStatus,stateVersion:row.stateVersion};
}
