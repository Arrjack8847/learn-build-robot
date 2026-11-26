// J2 private student identity foundation. No browser routes or learning entitlement.
// Adapter contract: strong reads, unique insert, atomic compare-and-set; no browser-supplied identities.
const C="StudentAuthCredentials",S="StudentAuthSessions";
const validId=id=>typeof id==="string"&&/^qa-j2-[a-f0-9]{64}$/.test(id);
const validPin=pin=>typeof pin==="string"&&/^[0-9]{6}$/.test(pin)&&!/^([0-9])\1{5}$/.test(pin)&&!["123456","654321","012345","987654","111222"].includes(pin);
const denied=()=>({ok:false,status:"SIGN_IN_REFUSED"});
const validToken=t=>typeof t==="string"&&/^[a-zA-Z0-9_-]{43}$/.test(t);
const validCredential=(r,id,parent)=>r&&r.studentId===id&&r.parentId===parent&&r.accountType==="student-test"&&typeof r.credentialVersion==="string"&&typeof r.stateVersion==="string"&&typeof r.pinHash==="string"&&Number.isInteger(r.attempts)&&r.attempts>=0&&r.attempts<=5&&Number.isFinite(r.lockUntil)&&r.lockUntil>=0;
export function createStudentIdentity({db,crypto,clock,resolvePayer,resolveEmailProof,consumeEmailProof,getOwnedStudent}){
 async function enroll(payerToken,studentId,pin){
  if(!validId(studentId)||!validPin(pin))return {ok:false,status:"INVALID_INPUT"};
  const payer=await resolvePayer(payerToken);
  if(payer?.role!=="payer"||!validId(payer.parentId)||!await getOwnedStudent(payer.parentId,studentId))return denied();
  if(await db.get(C,studentId))return {ok:false,status:"ALREADY_ENROLLED"};
  const row={studentId,parentId:payer.parentId,accountType:"student-test",pinHash:await crypto.hashPin(studentId,pin),credentialVersion:crypto.newVersion(),stateVersion:crypto.newVersion(),attempts:0,lockUntil:0};
  if(await db.insert(C,studentId,row)!==true)return {ok:false,status:"ALREADY_ENROLLED"};
  const saved=await db.get(C,studentId);
  if(!validCredential(saved,studentId,payer.parentId)||saved.credentialVersion!==row.credentialVersion||saved.pinHash!==row.pinHash)throw Error("STUDENT_ENROLLMENT_UNCONFIRMED");
  return {ok:true,status:"ENROLLED"};
 }
 async function signIn(proofToken,studentId,pin){
  if(!validId(studentId)||typeof pin!=="string"||!/^\d{6}$/.test(pin))return denied();
  const proof=await resolveEmailProof(proofToken);
  if(proof?.role!=="student-email-proof"||!validId(proof.parentId)||!await getOwnedStudent(proof.parentId,studentId))return denied();
  let reservation=null;
  for(let i=0;i<8;i++){
   const old=await db.get(C,studentId),now=clock.now();
   if(!validCredential(old,studentId,proof.parentId)||old.lockUntil>now)return denied();
   const attempts=(old.lockUntil&&old.lockUntil<=now?0:old.attempts)+1;
   if(attempts>5)return denied();
   const next={...old,attempts,lockUntil:attempts===5?now+900000:0,stateVersion:crypto.newVersion()};
   if(await db.replaceIfVersion(C,studentId,old.stateVersion,next)===true){reservation=next;break;}
  }
  if(!reservation||!await crypto.verifyPin(studentId,pin,reservation.pinHash))return denied();
  const reset={...reservation,attempts:0,lockUntil:0,stateVersion:crypto.newVersion()};
  if(await db.replaceIfVersion(C,studentId,reservation.stateVersion,reset)!==true)return denied();
  if(await consumeEmailProof(proofToken,proof)!==true)return denied();
  const token=crypto.sessionToken();if(!validToken(token))throw Error("INVALID_SESSION_TOKEN");
  const digest=crypto.sessionDigest(token),now=clock.now();
  const session={sessionDigest:digest,accountType:"student-test",studentId,parentId:proof.parentId,credentialVersion:reset.credentialVersion,createdAt:now,expiresAt:now+14400000,revokedAt:null,stateVersion:crypto.newVersion()};
  if(await db.insert(S,digest,session)!==true)throw Error("STUDENT_SESSION_UNCONFIRMED");
  const saved=await db.get(S,digest);
  if(!saved||saved.sessionDigest!==digest||saved.studentId!==studentId||saved.stateVersion!==session.stateVersion)throw Error("STUDENT_SESSION_UNCONFIRMED");
  return {ok:true,status:"VERIFIED",token};
 }
 async function readSession(token){
  if(!validToken(token))return null;
  const digest=crypto.sessionDigest(token),r=await db.get(S,digest),now=clock.now();
  if(!r||r.sessionDigest!==digest||r.accountType!=="student-test"||!validId(r.studentId)||!validId(r.parentId)||r.revokedAt!==null||!Number.isFinite(r.createdAt)||r.createdAt>now||r.expiresAt!==r.createdAt+14400000||r.expiresAt<=now||typeof r.stateVersion!=="string")return null;
  const c=await db.get(C,r.studentId);
  if(!validCredential(c,r.studentId,r.parentId)||c.credentialVersion!==r.credentialVersion||!await getOwnedStudent(r.parentId,r.studentId))return null;
  return r;
 }
 // J5 uses this server-side boundary only. No parent identity or permission in result.
 async function resolveStudentSession(token){const r=await readSession(token);return r?{role:"student",studentId:r.studentId,environment:"private-preview"}:null;}
 async function logout(token){
  const r=await readSession(token);if(!r)return {ok:true,status:"SIGNED_OUT"};
  const next={...r,revokedAt:clock.now(),stateVersion:crypto.newVersion()};
  if(await db.replaceIfVersion(S,r.sessionDigest,r.stateVersion,next)!==true&&await readSession(token))throw Error("STUDENT_REVOCATION_UNCONFIRMED");
  return {ok:true,status:"SIGNED_OUT"};
 }
 return {enroll,signIn,resolveStudentSession,logout};
}
