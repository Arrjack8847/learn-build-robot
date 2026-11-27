// All child IDs and paid status are obtained from J2/J3 server authorities.
import {resolveCombinedParentChild,readJ12345VerifiedChild} from "../j2-runtime.mjs";
import {readJ12345MembershipObservation} from "../j1234/billing-projection.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {isCombinedIdentityPreview,validJ12345Student} from "../j12345/identity-scope.mjs";
const unavailable=()=>({membership:"unavailable",deposit:"unavailable"});
const validOwner=(c,id)=>c?.childId===id&&validJ12345Student(c.childId)&&validJ12345Student(c.parentId)&&c.accountStatus==="preview-test"&&typeof c.stateVersion==="string"&&c.stateVersion.length>0;
const same=(a,b)=>a&&b&&a.childId===b.childId&&a.parentId===b.parentId&&a.stateVersion===b.stateVersion;
export function createCombinedIdentityMembership({env,db,readChild=readJ12345VerifiedChild,resolveParent=resolveCombinedParentChild,readMembership=readJ12345MembershipObservation,clock=Date.now}){
 if(!isCombinedIdentityPreview(env))throw Error("COMBINED_IDENTITY_DISABLED");
 const store=db??createWixStore(env);
 async function readOwner(childId,parentId=null){if(!validJ12345Student(childId)||parentId!==null&&!validJ12345Student(parentId))return null;try{const c=await readChild(childId,env);return validOwner(c,childId)&&(parentId===null||c.parentId===parentId)?c:null;}catch{return null;}}
 async function resolveChild(request,childId){if(!validJ12345Student(childId))return null;try{const c=await resolveParent(request,env,childId);return validOwner(c,childId)?c:null;}catch{return null;}}
 async function readEligibility(o){
  try{
   if(!validOwner(o,o?.childId))return unavailable();
   const c=await readOwner(o.childId,o.parentId);if(!same(c,o))return unavailable();
   const now=clock(),m=await readMembership({env,db:store,studentId:c.childId,parentId:c.parentId,now});
   const again=await readOwner(c.childId,c.parentId),at=clock();
   if(!same(c,again)||!Number.isSafeInteger(now)||!Number.isSafeInteger(at)||at<now||m?.studentId!==c.childId)return unavailable();
   if(m.membershipStatus==="active"&&m.verifiedLearningEligibility===true&&Number.isSafeInteger(m.activatedAt)&&m.activatedAt<=now&&Number.isSafeInteger(m.validUntil)&&m.validUntil>at)return {membership:"active",deposit:"clear",validUntil:m.validUntil};
   if(m.verifiedLearningEligibility===true)return unavailable();
   return ["inactive","expired","payment_pending"].includes(m.membershipStatus)?{membership:"inactive",deposit:"clear"}:unavailable();
  }catch{return unavailable();}
 }
 return {readOwner,resolveChild,readEligibility};
}
