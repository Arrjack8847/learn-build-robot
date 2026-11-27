// All child IDs and paid status are obtained from J2/J3 server authorities.
import {resolveCombinedParentChild,readJ12345VerifiedChild} from "../j2-runtime.mjs";
import {readJ12345MembershipObservation} from "../j1234/billing-projection.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {isCombinedIdentityPreview} from "../j12345/identity-scope.mjs";
export function createCombinedIdentityMembership({env,db,readChild=readJ12345VerifiedChild,resolveParent=resolveCombinedParentChild,readMembership=readJ12345MembershipObservation,clock=Date.now}){
 if(!isCombinedIdentityPreview(env))throw Error("COMBINED_IDENTITY_DISABLED");
 const store=db??createWixStore(env);
 async function readOwner(childId,parentId=null){const c=await readChild(childId,env);return c?.childId===childId&&(parentId===null||c.parentId===parentId)&&c.accountStatus==="preview-test"?c:null;}
 async function resolveChild(request,childId){const c=await resolveParent(request,env,childId);return c?.childId===childId&&c.accountStatus==="preview-test"?c:null;}
 async function readEligibility(o){
  const c=await readOwner(o.childId,o.parentId);if(!c||c.stateVersion!==o.stateVersion)return {membership:"unavailable",deposit:"unavailable"};
  const now=clock(),m=await readMembership({env,db:store,studentId:c.childId,parentId:c.parentId,now});
  if(m?.studentId!==c.childId)return {membership:"unavailable",deposit:"unavailable"};
  if(m.membershipStatus==="active"&&m.verifiedLearningEligibility===true&&Number.isSafeInteger(m.validUntil)&&m.validUntil>clock())return {membership:"active",deposit:"clear",validUntil:m.validUntil};
  return {membership:["inactive","expired","payment_pending"].includes(m.membershipStatus)?"inactive":"unavailable",deposit:"clear"};
 }
 return {readOwner,resolveChild,readEligibility};
}
