// Isolated development family workflow. No real family information or payment entitlement.
export const NOTICE_VERSION="preview-fictional-v1";
const isAccount=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const isChild=x=>typeof x==="string"&&/^qa-j2-[a-f0-9]{64}$/.test(x);
const exact=(x,keys)=>!!x&&typeof x==="object"&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const ref=x=>typeof x==="string"?x:x?._id??x?.id;
const fail=status=>({ok:false,status});
export function createFamilyPreview({db,crypto,clock,resolveSession}){
 const date=()=>({$date:new Date(clock.now()).toISOString()});
 const validName=x=>typeof x==="string"&&x===x.trim()&&/^(Test|Sample|Demo)(?: [A-Za-z0-9 -]{1,40})?$/.test(x);
 const validYear=x=>Number.isInteger(x)&&x>=1900&&x<=new Date(clock.now()).getUTCFullYear();
 const parentKey=a=>"qa-j2-"+a;
 const consentKey=p=>p+"-consent";
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
  if(ref(c.parentId)!==p||c.noticeVersion!==NOTICE_VERSION||!Number.isFinite(Date.parse(typeof c.acceptedAt==="string"?c.acceptedAt:c.acceptedAt?.$date)))throw Error("CONSENT_FIXTURE_MISMATCH");
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
   if(!exact(input,["accepted","noticeVersion"])||input.accepted!==true||input.noticeVersion!==NOTICE_VERSION)return fail("CONSENT_REQUIRED");
   if(!await parent(p)){await db.insert("Parents",p,{parentId:p,email:p+"@example.invalid",emailVerified:true,accountStatus:"preview-test",createdAt:date(),lastLoginAt:date()});if(!await parent(p))throw Error("PARENT_WRITE_UNCONFIRMED");}
   if(!await consent(p)){await db.insert("PrivacyConsents",consentKey(p),{parentId:p,noticeVersion:NOTICE_VERSION,acceptedAt:date()});if(!await consent(p))throw Error("CONSENT_WRITE_UNCONFIRMED");}
   return {ok:true,status:"CONSENT_RECORDED"};
  }
  if(!await parent(p)||!await consent(p))return action==="family-status"?{ok:true,status:"CONSENT_REQUIRED",noticeVersion:NOTICE_VERSION}:fail("CONSENT_REQUIRED");
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
   if(!exact(input,["name","birthYear","requestKey"])||!validName(input.name)||!validYear(input.birthYear)||typeof input.requestKey!=="string"||!/^[a-f0-9-]{36}$/.test(input.requestKey))return fail("INVALID_INPUT");
   const id="qa-j2-"+crypto.identityDigest("j2-child-"+p,input.requestKey);
   if(!isChild(id))throw Error("INVALID_CHILD_ID");
   const existing=await owned(p,id);
   if(existing)return existing.name===input.name&&existing.birthYear===input.birthYear?{ok:true,status:"CHILD_SAVED",child:childView(existing)}:fail("REQUEST_CONFLICT");
   await db.insert("Children",id,{childId:id,parentId:p,name:input.name,birthYear:input.birthYear,accountStatus:"preview-test",createdAt:date(),stateVersion:crypto.newVersion()});
   const r=await owned(p,id);
   if(!r||r.name!==input.name||r.birthYear!==input.birthYear)return fail("REQUEST_CONFLICT");
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
