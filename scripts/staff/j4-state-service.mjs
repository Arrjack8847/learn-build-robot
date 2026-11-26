// J4 private fixture state transitions. No payment writes or cross-journey operations.
export function createJ4StateService({store,crypto,clock}){
 const roles=["admin","staff","finance"], staffId=/^qa-j4-staff-[1-3]$/, requestId=/^[a-zA-Z0-9_-]{12,100}$/;
 const refused=()=>({ok:false,status:"REFUSED"});
 const now=()=>clock.now();
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
  const session=s.sessions.find(x=>x.sessionDigest===actor?.sessionDigest);
  return a&&session&&a.accountType==="staff-test"&&a.accountStatus==="active"&&roles.includes(a.role)&&a.authVersion===session.authVersion&&session.staffId===a.staffId&&session.accountType==="staff-test"&&session.revokedAt==null&&session.expiresAt>at?a:null;
 }
 async function signIn(input){
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
  if(!actor||!input||!["mark-present","check-out"].includes(input.action)||typeof input.bookingId!=="string"||!/^qa-j4-booking-[1-7]$/.test(input.bookingId)||typeof input.requestId!=="string"||!requestId.test(input.requestId)||typeof input.reason!=="string"||input.reason.trim().length<3||input.reason.length>200)return refused();
  return transaction(s=>{
   const at=now(),a=currentActor(s,actor,at);
   if(!a||!["admin","staff"].includes(a.role))return no(refused());
   const prior=s.audit.find(x=>x.requestId===input.requestId);
   if(prior)return no(prior.staffId===a.staffId&&prior.action===input.action&&prior.targetId===input.bookingId&&prior.reason===input.reason.trim()?{ok:true,status:"ALREADY_COMMITTED",auditId:prior.auditId}:refused());
   const b=s.attendance.find(x=>x.bookingId===input.bookingId);
   const student=s.students.find(x=>x.studentId===b?.studentId);
   if(!b||!student||b.sessionDate!==clock.localDay())return no(refused());
   if(input.action==="mark-present"){
    if(b.status!=="booked"||b.checkInAt!=null||student.membershipStatus!=="active")return no(refused());
    b.status="attended";b.checkInAt=new Date(at).toISOString();b.staffId=a.staffId;student.checkInStatus="checked-in";
   }else{
    if(b.status!=="attended"||!b.checkInAt||b.checkOutAt)return no(refused());
    b.checkOutAt=new Date(at).toISOString();student.checkInStatus="not-checked-in";
   }
   audit(s,a.staffId,input.action,b.bookingId,"success",at);
   const entry=s.audit[s.audit.length-1];entry.requestId=input.requestId;entry.reason=input.reason.trim();
   return yes({ok:true,status:"COMMITTED",auditId:entry.auditId});
  });
 }
 async function manageStaff(request,input){
  const actor=await resolve(request);
  if(!actor||!input||!staffId.test(input.staffId??"")||input.staffId===actor.staffId||!["active","inactive"].includes(input.accountStatus))return refused();
  return transaction(s=>{
   const a=currentActor(s,actor,now()),target=s.staff.find(x=>x.staffId===input.staffId);
   if(a?.role!=="admin"||!target||target.role==="admin")return no(refused());
   if(target.accountStatus===input.accountStatus)return no({ok:true,status:"UNCHANGED"});
   target.accountStatus=input.accountStatus;target.authVersion=crypto.newId();
   for(const session of s.sessions)if(session.staffId===target.staffId&&session.revokedAt==null)session.revokedAt=now();
   audit(s,a.staffId,"staff-status",target.staffId,"success",now());
   return yes({ok:true,status:"COMMITTED"});
  });
 }
 return {signIn,resolve,logout,attendance,manageStaff};
}
