// Controlled fictional private-preview attendance. One bounded CAS aggregate per student
// and MYT date. Code redemption, attendance and visit marker commit together.
// A visit is historical check-in evidence, NOT a J5 learning entitlement.
import {createHash,createHmac,randomInt,randomUUID,timingSafeEqual} from "node:crypto";
import {createAuthCrypto,previewRecipients} from "../parent-auth/secure-auth-transport.mjs";
import {createFamilyPreview} from "../parent-auth/family-preview.mjs";
import {validStudent} from "../j123/billing-records.mjs";
import {createJ1234IdentityEnv,scopeJ1234StudentCredentials,isJ1234Preview} from "./identity-scope.mjs";
import {readJ1234BillingProjection} from "./billing-projection.mjs";
export const ATTENDANCE_COLLECTION="SandboxBillingState";
const scope="j1234-attendance-v1",stamp=x=>Number.isSafeInteger(x)&&x>0,hex=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const validRequest=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{16,128}$/.test(x);
export const localDay=now=>new Date(now+8*3600000).toISOString().slice(0,10);
export const attendanceKey=(studentId,day)=>{if(!validStudent(studentId)||! /^\d{4}-\d{2}-\d{2}$/.test(day))throw Error("INVALID_ATTENDANCE_KEY");return scope+"-"+createHash("sha256").update(studentId+"/"+day).digest("hex");};
const no=status=>({ok:false,status}),yes=(status,extra={})=>({ok:true,status,...extra});
export const attendanceEnabled=e=>isJ1234Preview(e)&&e.J1234_REGISTRATION_ENABLED==="1"&&e.J1234_STUDENT_READ_ENABLED==="1"&&e.J1234_ATTENDANCE_ENABLED==="1";
const secret=e=>createHmac("sha256",Buffer.from(e.J1234_AUTH_ROOT,"hex")).update("j1234-attendance-code-v1").digest();
const digest=(key,s,code)=>createHmac("sha256",key).update(JSON.stringify([s.studentId,s.bookingId,s.code.codeId,code])).digest("hex");
const equal=(a,b)=>hex(a)&&hex(b)&&timingSafeEqual(Buffer.from(a,"hex"),Buffer.from(b,"hex"));
// Replay the compact audit state before trusting attendance or exposing counts.
function verifyAudit(s,now){
 let status=null,codeStatus=null,attempts=0,issuedAt=null,lastAt=0,checkInAt=null,checkOutAt=null;
 const requests=new Set(),fingerprints=new Set(),issued=[];
 for(const a of s.audit){
  if(!a||!validRequest(a.requestId)||requests.has(a.requestId)||!stamp(a.at)||a.at<lastAt||a.at>now||localDay(a.at)!==s.day||a.actor!==(a.action==="redeem"?"student":"private-preview-operator"))throw Error("INVALID_ATTENDANCE_AUDIT");
  requests.add(a.requestId);lastAt=a.at;
  if(a.action!=="issue"&&Object.hasOwn(a,"fingerprint"))throw Error("INVALID_FINGERPRINT");
  if(a.action==="book"&&status===null&&a.result==="COMMITTED"&&a.at===s.bookedAt)status="booked";
  else if(a.action==="issue"&&status==="booked"&&a.result==="CODE_ISSUED"&&hex(a.fingerprint)&&!fingerprints.has(a.fingerprint)){
   if(issued.filter(t=>t>a.at-900000).length>=3)throw Error("INVALID_ISSUE_LIMIT");
   fingerprints.add(a.fingerprint);issued.push(a.at);issuedAt=a.at;codeStatus="active";attempts=0;
  }else if(a.action==="redeem"&&status==="booked"&&codeStatus==="active"){
   if(a.result==="CODE_EXPIRED"&&a.at>=issuedAt+300000)codeStatus="expired";
   else if(a.result==="CODE_REFUSED"&&a.at<issuedAt+300000){attempts++;if(attempts===3)codeStatus="locked";}
   else if(a.result==="CHECKED_IN"&&a.at<issuedAt+300000){codeStatus="used";status="attended";checkInAt=a.at;}
   else throw Error("INVALID_REDEMPTION");
  }else if(a.action==="revoke"&&status==="booked"&&codeStatus==="active"&&a.result==="COMMITTED")codeStatus="revoked";
  else if(a.action==="no_show"&&status==="booked"&&a.result==="COMMITTED"){status="no_show";if(codeStatus==="active")codeStatus="revoked";}
  else if(a.action==="excuse"&&status==="no_show"&&a.result==="COMMITTED")status="excused";
  else if(a.action==="check_out"&&status==="attended"&&a.result==="COMMITTED"){status="checked_out";checkOutAt=a.at;}
  else throw Error("INVALID_ATTENDANCE_TRANSITION");
 }
 if(status!==s.status||checkInAt!==s.checkInAt||checkOutAt!==s.checkOutAt||JSON.stringify(issued)!==JSON.stringify(s.issued)||codeStatus!==(s.code?.status??null)||s.code&&(s.code.attempts!==attempts||s.code.issuedAt!==issuedAt))throw Error("AUDIT_STATE_MISMATCH");
}
function decode(row,studentId,parentId,day,now){
 if(row?.environment!=="sandbox-qa"||!row.stateVersion||typeof row.stateJson!=="string")throw Error("INVALID_ATTENDANCE");
 const s=JSON.parse(row.stateJson);
 if(s.scope!==scope||s.studentId!==studentId||s.parentId!==parentId||s.day!==day||!validRequest(s.bookingId)||!stamp(s.bookedAt)||localDay(s.bookedAt)!==day||!["booked","attended","checked_out","no_show","excused"].includes(s.status)||!Array.isArray(s.audit)||s.audit.length<1||s.audit.length>80||!Array.isArray(s.issued)||s.issued.length>24||s.issued.some(t=>!stamp(t)||localDay(t)!==day))throw Error("INVALID_ATTENDANCE");
 const c=s.code;
 if(c&&(!validRequest(c.codeId)||!hex(c.digest)||!["active","revoked","expired","used","locked"].includes(c.status)||!stamp(c.issuedAt)||c.expiresAt!==c.issuedAt+300000||!Number.isInteger(c.attempts)||c.attempts<0||c.attempts>3||!s.issued.includes(c.issuedAt)))throw Error("INVALID_CODE");
 const attended=["attended","checked_out"].includes(s.status);
 if(attended?(!stamp(s.checkInAt)||localDay(s.checkInAt)!==day||s.checkInAt<s.bookedAt||s.visit?.studentId!==studentId||s.visit?.bookingId!==s.bookingId||s.visit?.startedAt!==s.checkInAt||s.visit?.status!==(s.status==="attended"?"open":"ended")):(s.checkInAt!=null||s.visit!=null))throw Error("INVALID_VISIT");
 if(s.status==="checked_out"?(!stamp(s.checkOutAt)||s.checkOutAt<s.checkInAt||s.visit.endedAt!==s.checkOutAt):s.checkOutAt!=null)throw Error("INVALID_CHECKOUT");
 if(s.status!=="booked"&&c?.status==="active")throw Error("INVALID_CODE_STATE");
 verifyAudit(s,now);
 return s;
}
const encode=(s,newId)=>({environment:"sandbox-qa",stateVersion:newId(),stateJson:JSON.stringify(s)});
const projection=(s,now)=>({bookingId:s.bookingId,day:s.day,attendanceStatus:s.status,checkInStatus:s.status==="attended"?"checked_in":s.status==="checked_out"?"checked_out":"not_checked_in",codeStatus:s.code?.status==="active"&&s.code.expiresAt<=now?"expired":s.code?.status??"not_issued",expiresAt:s.code?.status==="active"&&s.code.expiresAt>now?s.code.expiresAt:null,checkInAt:s.checkInAt,checkOutAt:s.checkOutAt,visitStatus:s.visit?.status??"none"});
const empty=()=>({bookingId:null,day:null,attendanceStatus:"not_booked",checkInStatus:"not_checked_in",codeStatus:"not_issued",expiresAt:null,checkInAt:null,checkOutAt:null,visitStatus:"none"});
export async function readAttendanceProjection({env,db,studentId,parentId,now=Date.now()}){
 if(!attendanceEnabled(env))return {...empty(),attendanceStatus:"unavailable",checkInStatus:"unavailable"};
 try{createJ1234IdentityEnv(env);const day=localDay(now),row=await db.get(ATTENDANCE_COLLECTION,attendanceKey(studentId,day));return row?projection(decode(row,studentId,parentId,day,now),now):empty();}
 catch{return {...empty(),attendanceStatus:"verification_required",checkInStatus:"unavailable"};}
}
export function createAttendanceService({env,db,clock=()=>Date.now(),newId=randomUUID,newCode=()=>String(randomInt(0,100000000)).padStart(8,"0")}){
 if(!attendanceEnabled(env))throw Error("ATTENDANCE_DISABLED");
 const cfg=createJ1234IdentityEnv(env),auth=createAuthCrypto(cfg),key=secret(env),scoped=scopeJ1234StudentCredentials(db);
 const parents=new Set(previewRecipients(cfg).map(email=>"qa-j2-"+auth.identityDigest("parent-preview-session",email)));
 async function identity(studentId){
  if(!validStudent(studentId))return null;
  const row=await db.get("Children",studentId),parentId=typeof row?.parentId==="string"?row.parentId:row?.parentId?._id??row?.parentId?.id;
  if(row?.childId!==studentId||row.accountStatus!=="preview-test"||!parents.has(parentId))return null;
  const family=createFamilyPreview({db,crypto:auth,clock:{now:clock},resolveSession:async()=>({accountType:"parent-test",accountId:parentId.slice(6)})});
  const result=await family.handle("internal","family-child-get",{childId:studentId});
  if(!result.ok||result.child?.id!==studentId||result.child.version!==row.stateVersion)return null;
  const p=await scoped.get("StudentAuthCredentials",studentId);
  if(p?.studentId!==studentId||p.parentId!==parentId||p.accountType!=="student-test"||typeof p.credentialVersion!=="string"||typeof p.stateVersion!=="string"||! /^([a-f0-9]{32}):([a-f0-9]{64})$/.test(p.pinHash??""))return null;
  return {parentId,credentialVersion:p.credentialVersion};
 }
 const eligible=async(id,parentId)=>(await readJ1234BillingProjection({env,db,studentId:id,parentId,now:clock()})).membershipStatus==="active";
 // Staff is the explicitly enabled protected preview operator, not a client-selected role.
 // Student redemption uses a fresh server-resolved student session on each CAS attempt.
 return {async execute(input,{resolveStudent}={}){
  try{
   const studentId=input.studentId,action=input.action,isStudent=action==="redeem";
   if(!validStudent(studentId)||!validRequest(input.requestId)||!["book","issue","revoke","redeem","check_out","no_show","excuse"].includes(action))return no("REFUSED");
   if(action==="redeem"&&(typeof input.code!=="string"||! /^\d{8}$/.test(input.code)))return no("REFUSED");
   if(action!=="book"&&!validRequest(input.bookingId))return no("REFUSED");
   const authorized=async()=>{
    const i=await identity(studentId);if(!i)return null;
    if(isStudent){const s=await resolveStudent?.();if(s?.role!=="student"||s.environment!=="private-preview"||s.studentId!==studentId)return null;}
    return i;
   };
   if(!isStudent&&env.J1234_ATTENDANCE_OPERATOR_ENABLED!=="1")return no("REFUSED");
   const first=await authorized();if(!first)return no("REFUSED");
   const day=localDay(clock()),id=attendanceKey(studentId,day);
   const needsMembership=["book","issue","redeem"].includes(action);
   for(let retry=0;retry<8;retry++){
    const at=clock();if(localDay(at)!==day)return no("REFUSED");
    const fresh=await authorized();if(fresh?.parentId!==first.parentId||fresh.credentialVersion!==first.credentialVersion)return no("REFUSED");
    const old=await db.get(ATTENDANCE_COLLECTION,id);
    if(!old&&action!=="book")return no("REFUSED");
    let s=old?decode(old,studentId,first.parentId,day,at):{scope,studentId,parentId:first.parentId,day,bookingId:newId(),bookedAt:at,status:"booked",checkInAt:null,checkOutAt:null,code:null,visit:null,issued:[],audit:[]};
    if(old&&action!=="book"&&s.bookingId!==input.bookingId)return no("REFUSED");
    const prior=s.audit.find(a=>a.requestId===input.requestId);
    if(prior)return prior.action===action?no("ALREADY_PROCESSED"):no("REFUSED");
    if(old&&action==="book")return no("ALREADY_BOOKED");
    if(s.audit.length>=80)return no("REVIEW_REQUIRED");
    if(needsMembership&&!await eligible(studentId,first.parentId))return no("MEMBERSHIP_REQUIRED");
    let result=yes("COMMITTED"),plain;
    if(action==="issue"){
     if(s.status!=="booked"||s.issued.length>=24||s.issued.filter(t=>t>at-900000).length>=3)return no("REFUSED");
     plain=newCode();if(!/^\d{8}$/.test(plain))throw Error("BAD_CODE");
     // Never reissue the same numerical code in this booking, even when RNG repeats.
     const fingerprint=createHmac("sha256",key).update(s.bookingId+"/"+plain).digest("hex");
     if(s.audit.some(a=>a.fingerprint===fingerprint))return no("RETRY_ISSUE");
     s.code={codeId:newId(),status:"active",issuedAt:at,expiresAt:at+300000,attempts:0};
     s.code.digest=digest(key,s,plain);s.issued.push(at);
     result=yes("CODE_ISSUED",{expiresAt:s.code.expiresAt});s.pendingFingerprint=fingerprint;
    }else if(action==="revoke"){
     if(s.code?.status!=="active"||s.status!=="booked")return no("REFUSED");s.code.status="revoked";
    }else if(action==="redeem"){
     if(s.status!=="booked"||s.code?.status!=="active")return no("REFUSED");
     if(s.code.expiresAt<=at){s.code.status="expired";result=no("CODE_EXPIRED");}
     else if(!equal(s.code.digest,digest(key,s,input.code))){s.code.attempts++;if(s.code.attempts===3)s.code.status="locked";result=no("CODE_REFUSED");}
     else{s.code.status="used";s.status="attended";s.checkInAt=at;s.visit={studentId,bookingId:s.bookingId,startedAt:at,status:"open"};result=yes("CHECKED_IN");}
    }else if(action==="check_out"){
     if(s.status!=="attended")return no("REFUSED");s.status="checked_out";s.checkOutAt=at;s.visit={...s.visit,status:"ended",endedAt:at};
    }else if(action==="no_show"||action==="excuse"){
     if(s.status!==(action==="no_show"?"booked":"no_show"))return no("REFUSED");s.status=action==="no_show"?"no_show":"excused";if(s.code?.status==="active")s.code.status="revoked";
    }
    s.audit.push({requestId:input.requestId,action,actor:isStudent?"student":"private-preview-operator",at,result:result.status,...(s.pendingFingerprint?{fingerprint:s.pendingFingerprint}:{})});delete s.pendingFingerprint;
    // Last authorization and membership read before conditional commit. Cross-collection
    // membership changes can occur after this read; future access must recheck membership.
    const finalIdentity=await authorized();
    if(finalIdentity?.parentId!==first.parentId||finalIdentity.credentialVersion!==first.credentialVersion||localDay(clock())!==day)return no("REFUSED");
    if(needsMembership&&!await eligible(studentId,first.parentId))return no("MEMBERSHIP_REQUIRED");
    if(action==="redeem"&&result.ok&&clock()>=s.code.expiresAt)return no("CODE_EXPIRED");
    if(action==="issue"&&clock()>=s.code.expiresAt)return no("REFUSED");
    verifyAudit(s,clock());
    const next=encode(s,newId),won=old?await db.replaceIfVersion(ATTENDANCE_COLLECTION,id,old.stateVersion,next):await db.insert(ATTENDANCE_COLLECTION,id,next);
    if(won!==true)continue;
    const saved=await db.get(ATTENDANCE_COLLECTION,id);
    if(saved?.stateVersion!==next.stateVersion||saved.stateJson!==next.stateJson)return no("COMMIT_UNCONFIRMED");
    return {...result,attendance:projection(s,clock()),...(plain?{code:plain}:{})};
   }
   return no("CONFLICT");
  }catch{return no("ATTENDANCE_UNCONFIRMED");}
 }};
}
