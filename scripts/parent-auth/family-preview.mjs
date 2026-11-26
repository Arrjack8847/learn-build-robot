// Isolated development family workflow. No real family information or payment entitlement.
export const NOTICE_VERSION="preview-fictional-v1";
const isAccount=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const isChild=x=>typeof x==="string"&&/^qa-j2-[a-f0-9]{64}$/.test(x);
const exact=(x,keys)=>!!x&&typeof x==="object"&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const ref=x=>typeof x==="string"?x:x?._id??x?.id;
const fail=status=>({ok:false,status});
const normalizeName=x=>x.trim().toLowerCase().replace(/ +/g," ");
const uuid=x=>typeof x==="string"&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(x);
export function createFamilyPreview({db,crypto,clock,resolveSession,noticeVersion=NOTICE_VERSION}){
 if(typeof noticeVersion!=="string"||!/^preview-fictional-v[1-9][0-9]{0,5}$/.test(noticeVersion))throw Error("INVALID_NOTICE_VERSION");
 const date=()=>({$date:new Date(clock.now()).toISOString()});
 const validName=x=>typeof x==="string"&&x===x.trim()&&/^(Test|Sample|Demo)(?: [A-Za-z0-9 -]{1,40})?$/.test(x);
 const validYear=x=>Number.isInteger(x)&&x>=1900&&x<=new Date(clock.now()).getUTCFullYear();
 const parentKey=a=>"qa-j2-"+a;
 const consentKey=p=>noticeVersion==="preview-fictional-v1"?p+"-consent":crypto.identityDigest("j2-consent-"+noticeVersion,p);
 const childView=r=>({id:r.childId,name:r.name,birthYear:r.birthYear,version:r.stateVersion});
 async function identity(token){
  const a=await resolveSession(token);
  return a?.accountType==="parent-test"&&isAccount(a.accountId)?parentKey(a.accountId):null;
 }
 async function parent(p){
  const r=await db.get("Parents",p);
  if(!r)return null;
  if(r.parentId!==p||r.accountStatus!=="preview-test"||r.emailVerified!==true||r.email!==p+"@example.invalid")throw Error("PARENT_FIXTURE_MISMATCH");
  return r;
 }
 async function consent(p){
  const c=await db.get("PrivacyConsents",consentKey(p));
  if(!c)return null;
  if(ref(c.parentId)!==p||c.noticeVersion!==noticeVersion||!Number.isFinite(Date.parse(typeof c.acceptedAt==="string"?c.acceptedAt:c.acceptedAt?.$date))||Date.parse(typeof c.acceptedAt==="string"?c.acceptedAt:c.acceptedAt?.$date)>clock.now())throw Error("CONSENT_FIXTURE_MISMATCH");
  return c;
 }
 async function owned(p,id){
  if(!isChild(id))return null;
  const r=await db.get("Children",id);
  if(!r||r.childId!==id||ref(r.parentId)!==p||r.accountStatus!=="preview-test"||typeof r.stateVersion!=="string"||!validName(r.name)||!validYear(r.birthYear))return null;
  return r;
 }
 async function handle(token,action,input={}){
  const p=await identity(token);
  if(!p)return fail("NOT_AUTHORIZED");
  if(action==="family-consent"){
   if(!exact(input,["accepted","noticeVersion"])||input.accepted!==true||input.noticeVersion!==noticeVersion)return fail("CONSENT_REQUIRED");
   if(!await parent(p)){await db.insert("Parents",p,{parentId:p,email:p+"@example.invalid",emailVerified:true,accountStatus:"preview-test",createdAt:date(),lastLoginAt:date()});if(!await parent(p))throw Error("PARENT_WRITE_UNCONFIRMED");}
   if(!await consent(p)){await db.insert("PrivacyConsents",consentKey(p),{parentId:p,noticeVersion,acceptedAt:date()});if(!await consent(p))throw Error("CONSENT_WRITE_UNCONFIRMED");}
   return {ok:true,status:"CONSENT_RECORDED"};
  }
  if(!await parent(p)||!await consent(p))return action==="family-status"?{ok:true,status:"CONSENT_REQUIRED",noticeVersion}:fail("CONSENT_REQUIRED");
  if(action==="family-status"){
   const rows=await db.listFixtureChildren(p);
   if(rows.some(r=>ref(r.parentId)!==p||r.accountStatus!=="preview-test"||!isChild(r.childId)||typeof r.stateVersion!=="string"||!validName(r.name)||!validYear(r.birthYear)))throw Error("CHILD_LIST_MISMATCH");
   return {ok:true,status:"FAMILY_READY",children:rows.map(childView)};
  }
  if(action==="family-child-get"){
   if(!exact(input,["childId"]))return fail("INVALID_INPUT");
   const r=await owned(p,input.childId);return r?{ok:true,status:"CHILD_READY",child:childView(r)}:fail("NOT_FOUND");
  }
  if(action==="family-child-create"){
   if(!exact(input,["name","birthYear","requestKey"])||!validName(input.name)||!validYear(input.birthYear)||!uuid(input.requestKey))return fail("INVALID_INPUT");
   // The request key binds the first payload; the profile key independently deduplicates identical student details across different requests.
   const matches=r=>r&&normalizeName(r.name)===normalizeName(input.name)&&r.birthYear===input.birthYear;
   const requestDigest=crypto.identityDigest("j2-registration-request-"+p,input.requestKey);
   const inputDigest=crypto.identityDigest("j2-registration-input-"+p,JSON.stringify([normalizeName(input.name),input.birthYear]));
   const canonicalId="qa-j2-"+inputDigest;
   const legacyId="qa-j2-"+crypto.identityDigest("j2-child-"+p,input.requestKey);
   if(!isAccount(requestDigest)||!isChild(canonicalId)||!isChild(legacyId))throw Error("INVALID_CHILD_ID");
   let intent=await db.get("StudentRegistrationRequests",requestDigest);
   if(!intent){
    const legacy=await owned(p,legacyId);
    if(legacy&&!matches(legacy))return fail("REQUEST_CONFLICT");
    const rows=await db.listFixtureChildren(p);
    if(rows.some(r=>ref(r.parentId)!==p||r.accountStatus!=="preview-test"||!isChild(r.childId)||!validName(r.name)||!validYear(r.birthYear)))throw Error("CHILD_LIST_MISMATCH");
    const same=rows.filter(matches);
    if(same.length>1)return fail("DUPLICATE_REVIEW_REQUIRED");
    const childId=legacy?.childId??same[0]?.childId??canonicalId;
    await db.insert("StudentRegistrationRequests",requestDigest,{parentId:p,requestDigest,inputDigest,childId});
    intent=await db.get("StudentRegistrationRequests",requestDigest);
   }
   if(!intent||intent.parentId!==p||intent.requestDigest!==requestDigest||!isChild(intent.childId))throw Error("REGISTRATION_REQUEST_UNCONFIRMED");
   if(intent.inputDigest!==inputDigest)return fail("REQUEST_CONFLICT");
   const existing=await owned(p,intent.childId);
   if(existing)return matches(existing)?{ok:true,status:"CHILD_SAVED",child:childView(existing)}:fail("REQUEST_CONFLICT");
   if(intent.childId!==canonicalId)return fail("REQUEST_CONFLICT");
   await db.insert("Children",canonicalId,{childId:canonicalId,parentId:p,name:input.name,birthYear:input.birthYear,accountStatus:"preview-test",createdAt:date(),stateVersion:crypto.newVersion()});
   const r=await owned(p,canonicalId);
   if(!matches(r))return fail("REQUEST_CONFLICT");
   return {ok:true,status:"CHILD_SAVED",child:childView(r)};
  }
  if(action==="family-child-edit"){
   if(!exact(input,["childId","name","birthYear","version"])||!validName(input.name)||!validYear(input.birthYear)||typeof input.version!=="string")return fail("INVALID_INPUT");
   const r=await owned(p,input.childId);
   if(!r)return fail("NOT_FOUND");
   if(r.stateVersion!==input.version)return fail("EDIT_CONFLICT");
   const next={childId:r.childId,parentId:p,name:input.name,birthYear:input.birthYear,accountStatus:"preview-test",createdAt:r.createdAt,stateVersion:crypto.newVersion()};
   if(!await db.replaceIfVersion("Children",r.childId,r.stateVersion,next))return fail("EDIT_CONFLICT");
   const saved=await owned(p,r.childId);if(!saved||saved.stateVersion!==next.stateVersion)throw Error("EDIT_READBACK_UNCONFIRMED");
   return {ok:true,status:"CHILD_SAVED",child:childView(saved)};
  }
  return fail("NOT_FOUND");
 }
 return {handle};
}
