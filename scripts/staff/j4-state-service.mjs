// J4 private fixture state transitions. No payment writes or cross-journey operations.
export function createJ4StateService({store,crypto,clock,fixtureActorId}){
 const roles=["admin","staff","finance"], staffId=/^qa-j4-staff-[1-3]$/, requestId=/^[a-zA-Z0-9_-]{12,100}$/;
 const refused=()=>({ok:false,status:"REFUSED"});
 const now=()=>clock.now();
 const validDay=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+"T00:00:00Z"))&&new Date(v+"T00:00:00Z").toISOString().slice(0,10)===v;
 function activeMembership(s,student){const day=clock.localDay(),matches=s.memberships.filter(m=>m.studentId===student.studentId);if(matches.length!==1||student.membershipStatus!=="active")return false;const m=matches[0];return m.status==="active"&&validDay(day)&&validDay(m.activatedAt)&&validDay(m.validUntil)&&m.activatedAt<=day&&m.validUntil>=day;}
 const cleanReason=v=>typeof v==="string"&&v.trim().length>=3&&v.length<=200&&!/[\x00-\x1f\x7f]/.test(v);
 const audit=(s,actor,action,target,result,at)=>{s.audit.push({auditId:crypto.newId(),staffId:actor,action,targetId:target,result,occurredAt:at});};
 async function transaction(work){
  for(let attempt=0;attempt<6;attempt++){
   const current=await store.readStrong();
   if(!current||typeof current.stateVersion!=="string"||current.mode!=="j4-fixture-v1")throw Error("J4_STATE_UNAVAILABLE");
   const next=JSON.parse(JSON.stringify(current));
   const result=await work(next);
   if(!result.write)return result.reply;
   next.stateVersion=crypto.newId();
   if(await store.compareAndSet(current.stateVersion,next))return result.reply;
  }
  return {ok:false,status:"RETRY_REQUIRED"};
 }
 const no=reply=>({write:false,reply}), yes=reply=>({write:true,reply});
 function currentActor(s,actor,at){
  const a=s.staff.find(x=>x.staffId===actor?.staffId);
  // This is an explicitly synthetic actor, only injected by the isolated exercise dispatcher.
  // It is never a real staff identity and may not be used by a production service.
  if(fixtureActorId!==undefined)return a&&a.staffId===fixtureActorId&&staffId.test(fixtureActorId)&&a.accountType==="staff-test"&&a.accountStatus==="active"&&roles.includes(a.role)?a:null;
  const session=s.sessions.find(x=>x.sessionDigest===actor?.sessionDigest);
  return a&&session&&a.accountType==="staff-test"&&a.accountStatus==="active"&&roles.includes(a.role)&&a.authVersion===session.authVersion&&session.staffId===a.staffId&&session.accountType==="staff-test"&&session.revokedAt==null&&session.expiresAt>at?a:null;
 }
 async function signIn(input){
  if(fixtureActorId!==undefined)return refused();
  if(!input||typeof input.username!=="string"||!staffId.test(input.username)||typeof input.password!=="string"||input.password.length<12||input.password.length>256)return refused();
  const at=now();
  // Reserve an attempt atomically before password verification; no reset on success.
  const reserved=await transaction(s=>{
   s.attempts=s.attempts.filter(x=>x.at>at-15*60*1000);
   if(s.attempts.length>=30||s.attempts.filter(x=>x.staffId===input.username).length>=5)return no(refused());
   s.attempts.push({staffId:input.username,at});
   return yes({ok:true});
  });
  if(!reserved.ok)return refused();
  const initial=await store.readStrong();
  const account=initial.staff.find(a=>a.staffId===input.username);
  const passwordOK=await crypto.verifyPassword(input.username,input.password);
  if(!passwordOK||!account||account.accountStatus!=="active"||account.accountType!=="staff-test")return transaction(s=>{audit(s,input.username,"sign-in",input.username,"refused",now());return yes(refused());});
  const token=crypto.newToken(),digest=crypto.staffSessionDigest(token);
  return transaction(s=>{
   const at=now(),a=s.staff.find(x=>x.staffId===input.username);
   if(!a||a.authVersion!==account.authVersion||a.accountStatus!=="active"||!roles.includes(a.role))return no(refused());
   // Bounded live sessions. Keep revoked/expired entries out of the active set.
   s.sessions=s.sessions.filter(x=>x.expiresAt>at&&x.revokedAt==null);
   if(s.sessions.filter(x=>x.staffId===a.staffId).length>=5||s.sessions.some(x=>x.sessionDigest===digest))return no(refused());
   s.sessions.push({sessionDigest:digest,staffId:a.staffId,accountType:"staff-test",authVersion:a.authVersion,expiresAt:at+8*3600000,revokedAt:null});
   audit(s,a.staffId,"sign-in",a.staffId,"success",at);
   return yes({ok:true,status:"SIGNED_IN",cookie:"__Host-stem-staff="+token+"; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=28800"});
  });
 }
 async function resolve(request){
  if(fixtureActorId!==undefined){const s=await store.readStrong();const a=currentActor(s,{staffId:fixtureActorId},now());return a?{subjectType:"staff",staffId:a.staffId,displayName:a.displayName,role:a.role,accountStatus:"active",expiresAt:now()+60000,revokedAt:null}:null;}
  const value=request?.headers?.get("cookie")??"";
  if(value.length>8192)return null;
  const cookies=value.split(";").map(x=>x.trim()).filter(x=>x.startsWith("__Host-stem-staff="));
  if(cookies.length!==1)return null;
  const token=cookies[0].slice("__Host-stem-staff=".length);
  if(!/^[A-Za-z0-9_-]{43}$/.test(token))return null;
  const digest=crypto.staffSessionDigest(token),s=await store.readStrong();
  const session=s.sessions.find(x=>x.sessionDigest===digest);
  const actor=currentActor(s,{staffId:session?.staffId,sessionDigest:digest},now());
  if(!actor)return null;
  return {subjectType:"staff",staffId:actor.staffId,displayName:actor.displayName,role:actor.role,accountStatus:"active",expiresAt:session.expiresAt,revokedAt:null,sessionDigest:digest};
 }
 async function logout(request){
  if(fixtureActorId!==undefined)return refused();
  const actor=await resolve(request);
  const cookie="__Host-stem-staff=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0";
  if(!actor)return {ok:true,status:"SIGNED_OUT",cookie};
  return transaction(s=>{
   const a=currentActor(s,actor,now());
   if(!a)return no({ok:true,status:"SIGNED_OUT",cookie});
   const session=s.sessions.find(x=>x.sessionDigest===actor.sessionDigest);
   session.revokedAt=now();audit(s,a.staffId,"sign-out",a.staffId,"success",now());
   return yes({ok:true,status:"SIGNED_OUT",cookie});
  });
 }
 async function attendance(request,input){
  const actor=await resolve(request);
  if(!actor||!input||!["mark-present","check-out","mark-no-show","excuse-no-show"].includes(input.action)||typeof input.bookingId!=="string"||!/^qa-j4-booking-[1-7]$/.test(input.bookingId)||typeof input.requestId!=="string"||!requestId.test(input.requestId)||!cleanReason(input.reason))return refused();
  return transaction(s=>{
   const at=now(),a=currentActor(s,actor,at);
   if(!a||!["admin","staff"].includes(a.role))return no(refused());
   const prior=s.audit.find(x=>x.requestId===input.requestId);
   if(prior)return no(prior.staffId===a.staffId&&prior.action===input.action&&prior.targetId===input.bookingId&&prior.reason===input.reason.trim()?{ok:true,status:"ALREADY_COMMITTED",auditId:prior.auditId}:refused());
   const b=s.attendance.find(x=>x.bookingId===input.bookingId);
   const student=s.students.find(x=>x.studentId===b?.studentId);
   if(!b||!student||b.sessionDate!==clock.localDay())return no(refused());
   const before=b.status+(b.checkOutAt?" / checked out":"");
   if(input.action==="mark-present"){
    if(b.status!=="booked"||b.checkInAt!=null||!activeMembership(s,student))return no(refused());
    b.status="attended";b.checkInAt=new Date(at).toISOString();b.staffId=a.staffId;student.checkInStatus="checked-in";
    for(const code of s.codes??[])if(code.bookingId===b.bookingId&&code.status==="active")code.status="revoked";
   }else if(input.action==="mark-no-show"||input.action==="excuse-no-show"){
    // Explicitly simulated staff correction, with no deposit or financial effects.
    const expected=input.action==="mark-no-show"?"booked":"no-show";
    if(b.status!==expected||b.checkInAt!=null||b.checkOutAt!=null)return no(refused());
    b.status=input.action==="mark-no-show"?"no-show":"excused";
    b.staffId=a.staffId;
    for(const code of s.codes??[])if(code.bookingId===b.bookingId&&code.status==="active")code.status="revoked";
   }else{
    if(b.status!=="attended"||!b.checkInAt||b.checkOutAt||!Number.isFinite(Date.parse(b.checkInAt))||Date.parse(b.checkInAt)>at)return no(refused());
    b.checkOutAt=new Date(at).toISOString();student.checkInStatus="not-checked-in";
    for(const visit of s.learningVisits??[])if(visit.bookingId===b.bookingId&&visit.status==="learning")visit.status="ended";
   }
   audit(s,a.staffId,input.action,b.bookingId,"success",at);
   const entry=s.audit[s.audit.length-1];entry.requestId=input.requestId;entry.reason=input.reason.trim();entry.before=before;entry.after=b.status+(b.checkOutAt?" / checked out":"");
   return yes({ok:true,status:"COMMITTED",auditId:entry.auditId});
  });
 }
 async function manageStaff(request,input){
  const actor=await resolve(request);
  if(!actor||!input||!staffId.test(input.staffId??"")||input.staffId===actor.staffId||!["active","inactive"].includes(input.accountStatus)||!cleanReason(input.reason)||("role" in input&&!["staff","finance"].includes(input.role)))return refused();
  return transaction(s=>{
   const a=currentActor(s,actor,now()),target=s.staff.find(x=>x.staffId===input.staffId);
   if(a?.role!=="admin"||!target||target.role==="admin")return no(refused());
   if(target.accountStatus===input.accountStatus&&(!input.role||target.role===input.role))return no({ok:true,status:"UNCHANGED"});
   const previousRole=target.role,previousStatus=target.accountStatus;target.accountStatus=input.accountStatus;if(input.role)target.role=input.role;target.authVersion=crypto.newId();
   for(const session of s.sessions)if(session.staffId===target.staffId&&session.revokedAt==null)session.revokedAt=now();
   audit(s,a.staffId,previousRole!==target.role?"staff-role":"staff-status",target.staffId,"success",now());Object.assign(s.audit[s.audit.length-1],{reason:input.reason.trim(),before:previousRole+" / "+previousStatus,after:target.role+" / "+target.accountStatus});
   return yes({ok:true,status:"COMMITTED"});
  });
 }
 async function checkInCode(request,input){
  const actor=await resolve(request);
  if(!actor||!input||!["issue-code","revoke-code","validate-code"].includes(input.action)||typeof input.bookingId!=="string"||!/^qa-j4-booking-[1-7]$/.test(input.bookingId))return refused();
  if(input.action==="validate-code"&&(typeof input.code!=="string"||!/^\d{8}$/.test(input.code)))return refused();
  if(input.requestId!==undefined&&(typeof input.requestId!=="string"||!requestId.test(input.requestId)))return refused();
  if(input.reason!==undefined&&!cleanReason(input.reason))return refused();
  return transaction(s=>{
   const at=now(),a=currentActor(s,actor,at);
   if(!a||!["admin","staff"].includes(a.role))return no(refused());
   const b=s.attendance.find(x=>x.bookingId===input.bookingId),student=s.students.find(x=>x.studentId===b?.studentId);
   if(!b||!student||b.sessionDate!==clock.localDay())return no(refused());
   // Never issue a second code on retry of an already committed command. Plaintext is not persisted.
   if(input.requestId){const prior=s.audit.find(x=>x.requestId===input.requestId);if(prior)return no(prior.staffId===a.staffId&&prior.action===input.action&&prior.targetId===b.bookingId&&prior.reason===(input.reason?.trim()??null)?{ok:false,status:"ALREADY_PROCESSED"}:refused());}
   function codeAudit(result,before,after){audit(s,a.staffId,input.action,b.bookingId,result,at);Object.assign(s.audit.at(-1),{before,after,reason:input.reason?.trim()??null,...(input.requestId?{requestId:input.requestId}:{})});}
   // Only the latest issued code can be active for one booking. No real booking or learning entitlement is changed.
   const current=s.codes.find(x=>x.bookingId===b.bookingId&&x.status==="active");
   if(input.action==="revoke-code"){
    if(!current)return no(refused());
    const before=current.status;current.status="revoked";codeAudit("success",before,"revoked");return yes({ok:true,status:"COMMITTED"});
   }
   if(b.status!=="booked"||b.checkInAt!=null||!activeMembership(s,student))return no(refused());
   if(input.action==="issue-code"){
    // Bound issuance, including reissues, to protect the isolated fixture service.
    if(s.codes.filter(x=>x.bookingId===b.bookingId&&x.issuedAt>at-15*60000).length>=3)return no(refused());
    let code,unique=false;
    for(let i=0;i<12;i++){code=crypto.newCheckInCode();if(!/^\d{8}$/.test(code))throw Error("BAD_CODE_GENERATOR");const fingerprint=crypto.checkInDigest("daily:"+clock.localDay(),code);if(!s.codes.some(x=>x.dailyFingerprint===fingerprint)){unique=true;break;}}
    if(!unique)return no(refused());
    if(current)current.status="revoked";
    const codeId=crypto.newId(),expiresAt=at+5*60000;
    s.codes.push({codeId,bookingId:b.bookingId,studentId:b.studentId,status:"active",issuedAt:at,expiresAt,attempts:0,digest:crypto.checkInDigest(codeId,code),dailyFingerprint:crypto.checkInDigest("daily:"+clock.localDay(),code)});
    codeAudit("success",current?"active":"not-active","active");
    return yes({ok:true,status:"CODE_ISSUED",code,expiresAt});
   }
   if(!current)return no(refused());
   if(current.expiresAt<=at){current.status="expired";codeAudit("refused","active","expired");return yes(refused());}
   if(current.attempts>=3)return no(refused());
   current.attempts++;
   if(!crypto.equalDigest(current.digest,crypto.checkInDigest(current.codeId,input.code))){
    if(current.attempts===3)current.status="locked";
    codeAudit("refused","active",current.status);
    return yes(refused());
   }
   current.status="used";b.status="attended";b.checkInAt=new Date(at).toISOString();b.staffId=a.staffId;student.checkInStatus="checked-in";
   codeAudit("success","active","used");
   return yes({ok:true,status:"COMMITTED"});
  });
 }
 return {signIn,resolve,logout,attendance,manageStaff,checkInCode};
}
