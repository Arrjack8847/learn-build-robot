// J2 reusable server-side identity composition. No browser-trusted identities.
import {createPreviewOtp} from "../parent-auth/preview-otp.mjs";
import {createFamilyPreview} from "../parent-auth/family-preview.mjs";
import {createStudentIdentity} from "./identity.mjs";
import {createStudentRateLimit} from "./rate-limit.mjs";
const tokenValid=t=>typeof t==="string"&&/^[a-zA-Z0-9_-]{43}$/.test(t);
export function createStudentContext({db,auth,crypto,clock,emails,mailerFor}){
  const svc=(email,student)=>createPreviewOtp({store:db,crypto:auth,clock,recipient:email,accountType:student?"student-email-proof":"parent-test",mailer:mailerFor(email)});
  async function locate(token,student){
   if(!tokenValid(token))return null;
   for(const email of emails){const service=svc(email,student);if(await service.resolveIdentity(token))return {email,service,parentId:"qa-j2-"+auth.identityDigest("parent-preview-session",email)};}
   return null;
  }
  async function payer(token){const found=await locate(token,false);if(!found)return null;const row=await db.get("AuthSessions",auth.sessionDigest(token));const created=Date.parse(typeof row?.createdAt==="string"?row.createdAt:row?.createdAt?.$date);if(row?.accountType!=="parent-test"||row.accountId!==found.parentId.slice(6)||row.sessionDigest!==auth.sessionDigest(token)||row.revokedAt!=null||!Number.isFinite(created)||created>clock.now()||clock.now()-created>600000)return null;return {role:"payer",parentId:found.parentId};}
  async function proof(token){const found=await locate(token,true);if(!found)return null;const row=await db.get("AuthSessions",auth.sessionDigest(token));const created=Date.parse(typeof row?.createdAt==="string"?row.createdAt:row?.createdAt?.$date);if(row?.accountType!=="student-email-proof"||row.accountId!==auth.identityDigest("student-proof/parent-preview-session",found.email)||row.sessionDigest!==auth.sessionDigest(token)||!Number.isFinite(created)||created>clock.now()||clock.now()-created>=300000||row.revokedAt!=null)return null;return {role:"student-email-proof",parentId:found.parentId,stateVersion:row.stateVersion};}
  async function consume(token,expected){const current=await proof(token);if(!current||current.parentId!==expected.parentId||current.stateVersion!==expected.stateVersion)return false;const digest=auth.sessionDigest(token),row=await db.get("AuthSessions",digest);if(!row||row.stateVersion!==expected.stateVersion||row.revokedAt!=null)return false;const next={sessionDigest:row.sessionDigest,accountId:row.accountId,accountType:row.accountType,createdAt:row.createdAt,expiresAt:row.expiresAt,revokedAt:{$date:new Date(clock.now()).toISOString()},stateVersion:auth.newVersion()};return await db.replaceIfVersion("AuthSessions",digest,row.stateVersion,next)===true;}
  const familyFor=(parentId)=>createFamilyPreview({db,crypto:auth,clock,resolveSession:async()=>({accountType:"parent-test",accountId:parentId.slice(6)})});
  const allowedParents=new Set(emails.map(email=>"qa-j2-"+auth.identityDigest("parent-preview-session",email)));
  async function owned(parentId,id){return allowedParents.has(parentId)&&(await familyFor(parentId).handle("internal","family-child-get",{childId:id})).ok===true;}
  const rate=createStudentRateLimit({db,crypto,clock});
  const identity=createStudentIdentity({db,crypto,clock,resolvePayer:payer,resolveEmailProof:proof,consumeEmailProof:consume,getOwnedStudent:owned,
   reservePinAttempt:async(token,parentId)=>await rate.reserve("proof",token,5,300000)&&await rate.reserve("payer",parentId,10,900000)});

 return {identity,svc,locate,proof,payer,familyFor,rate};
}
