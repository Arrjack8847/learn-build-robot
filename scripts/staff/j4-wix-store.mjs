// Dedicated J4 private-test store. No shared LMS collections are accessed.
const ROOT="https://www.wixapis.com/wix-data/v2/items";
const SITE="09d613aa-3a95-42ff-9ee3-2aa0c706c447";
const COLLECTION="J4PrivateState", ID="qa-j4-state-v1";
// Validate persisted identity relationships before any state is returned or written.
// Dedicated fixture collection is a second boundary, not permission to read arbitrary rows.
function validateFixtureState(s){
 if(s?.mode!=="j4-fixture-v1"||typeof s.stateVersion!=="string"||!s.stateVersion||s.stateVersion.length>128)throw Error("J4_INVALID_STATE");
 const resources=["students","memberships","payments","deposits","attendance","progress","staff","audit","sessions","attempts","codes"];
 if(!resources.every(k=>Array.isArray(s[k])))throw Error("J4_INVALID_STATE");
 const check=(rows,key,pattern,exact)=>{if(exact!=null&&rows.length!==exact)throw Error("J4_FIXTURE_COUNT");const ids=new Set();for(const row of rows){if(!row||typeof row[key]!=="string"||!pattern.test(row[key])||ids.has(row[key]))throw Error("J4_FIXTURE_ID");ids.add(row[key]);}return ids;};
 const students=check(s.students,"studentId",/^qa-j4-student-[1-7]$/,7);
 const staff=check(s.staff,"staffId",/^qa-j4-staff-[1-3]$/,3);
 const bookings=check(s.attendance,"bookingId",/^qa-j4-booking-[1-7]$/,7);
 const payments=check(s.payments,"paymentId",/^qa-j4-payment-[1-5]$/,5);
 check(s.memberships,"membershipId",/^qa-j4-member-[1-7]$/,7);
 check(s.progress,"studentId",/^qa-j4-student-[1-7]$/,7);
 check(s.deposits,"paymentId",/^qa-j4-payment-[1-5]$/,1);
 if(s.students.some(x=>!/^qa-j4-payer-[1-5]$/.test(x.payerId??"")||typeof x.name!=="string"||!x.name.startsWith("Demo ")||!["active","inactive","expired","pending"].includes(x.membershipStatus)))throw Error("J4_FIXTURE_STUDENT");
 if(new Set(s.students.map(x=>x.payerId)).size!==5||s.staff.some(x=>x.accountType!=="staff-test"||!["admin","staff","finance"].includes(x.role)||!["active","inactive"].includes(x.accountStatus)||typeof x.authVersion!=="string")||s.staff.filter(x=>x.role==="admin"&&x.accountStatus==="active").length!==1)throw Error("J4_FIXTURE_ACTOR");
 for(const k of ["memberships","payments","deposits","attendance","progress","codes"])if(s[k].some(x=>!students.has(x.studentId)))throw Error("J4_FIXTURE_STUDENT_SCOPE");
 const singleStudent=rows=>new Set(rows.map(x=>x.studentId)).size===students.size;
 if(!singleStudent(s.memberships)||!singleStudent(s.attendance)||!singleStudent(s.progress))throw Error("J4_FIXTURE_STUDENT_SCOPE");
 if(s.payments.some(x=>x.evidenceType!=="fixture"||x.providerPaymentId!=null||!["membership","deposit"].includes(x.purpose)||!["simulated-success","failed","pending"].includes(x.status)||!Number.isSafeInteger(x.amountMinor)||x.amountMinor<0||!["SGD","MYR"].includes(x.currency)))throw Error("J4_FIXTURE_PAYMENT");
 if(s.deposits.some(x=>!payments.has(x.paymentId)||!bookings.has(x.bookingId)||x.evidenceType!=="fixture"||x.status==="verified"||!s.payments.some(p=>p.paymentId===x.paymentId&&p.studentId===x.studentId&&p.purpose==="deposit"&&p.currency===x.currency&&p.amountMinor===x.amountMinor&&p.status===x.status)||!s.attendance.some(b=>b.bookingId===x.bookingId&&b.studentId===x.studentId)))throw Error("J4_FIXTURE_DEPOSIT");
 if(s.sessions.some(x=>!staff.has(x.staffId)||x.accountType!=="staff-test"||!/^([a-f0-9]{64})$/.test(x.sessionDigest??"")||!Number.isSafeInteger(x.expiresAt))||s.attempts.some(x=>!staff.has(x.staffId)||!Number.isSafeInteger(x.at))||s.audit.some(x=>!staff.has(x.staffId)||typeof x.auditId!=="string"||!Number.isSafeInteger(x.occurredAt)))throw Error("J4_FIXTURE_SESSION");
 if(s.codes.some(x=>!bookings.has(x.bookingId)||!s.attendance.some(b=>b.bookingId===x.bookingId&&b.studentId===x.studentId)||!["active","revoked","locked","used","expired"].includes(x.status)||!/^([a-f0-9]{64})$/.test(x.digest??"")||!/^([a-f0-9]{64})$/.test(x.dailyFingerprint??"")||!Number.isSafeInteger(x.expiresAt)||!Number.isSafeInteger(x.attempts)))throw Error("J4_FIXTURE_CODE");
 if(s.fixtureCodeKey!==undefined&&(typeof s.fixtureCodeKey!=="string"||!/^[a-f0-9]{64}$/.test(s.fixtureCodeKey)))throw Error("J4_FIXTURE_KEY");
 if(s.learningVisits!==undefined&&(!Array.isArray(s.learningVisits)||s.learningVisits.some(v=>!students.has(v.studentId)||!bookings.has(v.bookingId)||!["learning","ended"].includes(v.status)||!s.attendance.some(b=>b.bookingId===v.bookingId&&b.studentId===v.studentId))))throw Error("J4_FIXTURE_LEARNING");
 return s;
}
export function createJ4WixStore(env,request=fetch){
 if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.VERCEL_GIT_COMMIT_REF!=="feat/j4-private-staff-admin-20261126"||env.J4_PRIVATE_ENABLED!=="1"||env.J4_WIX_SITE_ID!==SITE||!env.J4_WIX_DATA_API_KEY?.trim())throw Error("J4_NOT_CONFIGURED");
 async function call(url,method,body){
  const r=await request(url,{method,headers:{Authorization:env.J4_WIX_DATA_API_KEY,"wix-site-id":SITE,"Content-Type":"application/json",Accept:"application/json"},...(body===undefined?{}:{body:JSON.stringify(body)}),cache:"no-store",redirect:"error",signal:AbortSignal.timeout(10000)});
  return r.ok?{status:r.status,payload:await r.json()}:{status:r.status};
 }
 function state(response){
  const row=response.payload?.dataItem;
  if(row?.id!==ID||row.dataCollectionId!==COLLECTION||typeof row.data?.stateVersion!=="string"||typeof row.data?.snapshot!=="string")throw Error("J4_INVALID_WIX_RESPONSE");
  const parsed=JSON.parse(row.data.snapshot);
  if(parsed.stateVersion!==row.data.stateVersion)throw Error("J4_INVALID_STATE");
  return validateFixtureState(parsed);
 }
 function data(next){
  validateFixtureState(next);
  const snapshot=JSON.stringify(next);
  if(new TextEncoder().encode(snapshot).length>350000)throw Error("J4_STATE_CAPACITY");
  return {stateVersion:next.stateVersion,snapshot};
 }
 async function readStrong(){
  const r=await call(ROOT+"/"+ID+"?dataCollectionId="+COLLECTION+"&consistentRead=true","GET");
  if(r.status===404)return null;
  if(r.status!==200)throw Error("J4_READ_FAILED");
  return state(r);
 }
 async function initialize(initial){
  const r=await call(ROOT,"POST",{dataCollectionId:COLLECTION,dataItem:{id:ID,data:data(initial)}});
  if(r.status===409)return false;
  return state(r).stateVersion===initial.stateVersion;
 }
 async function compareAndSet(expected,next){
  if(typeof expected!=="string"||next.stateVersion===expected)throw Error("J4_BAD_VERSION");
  const r=await call(ROOT+"/"+ID,"PUT",{dataCollectionId:COLLECTION,dataItem:{data:data(next)},condition:{filter:{stateVersion:{$eq:expected}}}});
  if([409,412,428].includes(r.status))return false;
  if(state(r).stateVersion!==next.stateVersion)throw Error("J4_WRITE_UNCONFIRMED");
  return true;
 }
 return {readStrong,initialize,compareAndSet};
}
