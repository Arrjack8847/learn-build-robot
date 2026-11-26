import {createAuthCrypto,previewRecipients} from "../parent-auth/secure-auth-transport.mjs";
import {createFamilyPreview} from "../parent-auth/family-preview.mjs";
import {validStudent} from "../j123/billing-records.mjs";
import {readJ1234BillingProjection} from "./billing-projection.mjs";
import {readAttendanceProjection,localDay} from "./attendance.mjs";
import {buildDashboardStatistics} from "./dashboard-statistics.mjs";
import {createJ1234IdentityEnv,scopeJ1234StudentCredentials} from "./identity-scope.mjs";
const ref=x=>typeof x==="string"?x:x?._id??x?.id;
export function parseDirectoryQuery(v){
 if(!v||typeof v!=="object"||Array.isArray(v)||Object.keys(v).some(k=>!["page","pageSize","search","studentId"].includes(k)))return null;
 const {page=1,pageSize=10,search="",studentId}=v;
 if(!Number.isSafeInteger(page)||page<1||page>250||!Number.isSafeInteger(pageSize)||pageSize<1||pageSize>50||typeof search!=="string"||search.length>100||/[\x00-\x1f]/.test(search)||studentId!==undefined&&!validStudent(studentId))return null;
 return {page,pageSize,search:search.trim().toLowerCase(),studentId};
}
export function createStudentDirectory({env,db,clock={now:()=>Date.now()}}){
 const cfg=createJ1234IdentityEnv(env);if(env.J1234_STUDENT_READ_ENABLED!=="1")throw Error("DIRECTORY_DISABLED");
 const auth=createAuthCrypto(cfg),scoped=scopeJ1234StudentCredentials(db);
 const parents=previewRecipients(cfg).map(e=>"qa-j2-"+auth.identityDigest("parent-preview-session",e));
 return {async list(query){
  const q=parseDirectoryQuery(query);if(!q)throw Error("INVALID_INPUT");
  const rows=[],seen=new Set(),asOf=clock.now();
  if(!Number.isSafeInteger(asOf)||asOf<=0)throw Error("INVALID_SNAPSHOT_TIME");
  for(const parentId of parents){
   const family=createFamilyPreview({db,crypto:auth,clock,resolveSession:async()=>({accountType:"parent-test",accountId:parentId.slice(6)})});
   const data=await family.handle("internal","family-status");
   if(data.ok&&data.status==="CONSENT_REQUIRED")continue;
   if(!data.ok||data.status!=="FAMILY_READY"||!Array.isArray(data.children)||data.children.length>50)throw Error("DIRECTORY_UNCONFIRMED");
   for(const child of data.children){
    if(!validStudent(child.id)||seen.has(child.id))throw Error("DUPLICATE_ID");seen.add(child.id);
    const row=await db.get("Children",child.id),t=Date.parse(typeof row?.createdAt==="string"?row.createdAt:row?.createdAt?.$date);
    if(!row||row.childId!==child.id||ref(row.parentId)!==parentId||row.accountStatus!=="preview-test"||row.name!==child.name||row.birthYear!==child.birthYear||row.stateVersion!==child.version||!Number.isFinite(t)||t<=0||t>clock.now())throw Error("DIRECTORY_STALE");
    const pin=await scoped.get("StudentAuthCredentials",child.id);
    if(pin&&(pin.studentId!==child.id||pin.parentId!==parentId||pin.accountType!=="student-test"||typeof pin.credentialVersion!=="string"||typeof pin.stateVersion!=="string"||!/^([a-f0-9]{32}):([a-f0-9]{64})$/.test(pin.pinHash??"")))throw Error("DIRECTORY_CREDENTIAL_MISMATCH");
    const billing=await readJ1234BillingProjection({env,db,studentId:child.id,parentId,now:asOf});
    const attendance=await readAttendanceProjection({env,db,studentId:child.id,parentId,now:asOf});
    const fresh=await family.handle("internal","family-child-get",{childId:child.id});if(!fresh.ok||fresh.child.version!==child.version)throw Error("DIRECTORY_STALE");
    rows.push({studentId:child.id,name:child.name,birthYear:child.birthYear,registeredAt:new Date(t+8*3600000).toISOString().slice(0,10),registrationStatus:pin?"ready":"pin-setup-required",...billing,attendance,checkInStatus:attendance.checkInStatus,level:null,latestActivity:null});
   }
  }
  if(localDay(clock.now())!==localDay(asOf))throw Error("SNAPSHOT_DAY_CHANGED");
  const statistics=buildDashboardStatistics({env,rows,asOf});
  const filtered=rows.filter(r=>(!q.studentId||q.studentId===r.studentId)&&(!q.search||r.name.toLowerCase().includes(q.search)||r.studentId.includes(q.search))).sort((a,b)=>a.name.localeCompare(b.name)||a.studentId.localeCompare(b.studentId));
  return {ok:true,status:"READY",total:filtered.length,page:q.page,pageSize:q.pageSize,statistics,rows:filtered.slice((q.page-1)*q.pageSize,q.page*q.pageSize)};
 }};
}
