// J2 server-side adapter for the existing J3 checkout identity contract.
// No provider calls, prices, membership mutation, or browser-trusted payer/student IDs.
export function createJ2CheckoutIdentity({resolveVerifiedPayer,readOwnedStudent,readCurrentConsent,readApprovedTerms,readMembership}){
 const valid=id=>typeof id==="string"&&/^qa-j2-[a-f0-9]{64}$/.test(id);
 async function resolveParent(context){
  const payer=await resolveVerifiedPayer(context);
  if(payer?.role!=="payer"||payer.environment!=="private-preview"||!valid(payer.parentId)||payer.emailVerified!==true)return null;
  return {accountType:"parent",parentId:payer.parentId,email:payer.parentId+"@example.invalid",emailVerified:true};
 }
 async function hasCurrentConsentAndTerms(parentId){
  return valid(parentId)&&await readCurrentConsent(parentId)===true&&await readApprovedTerms(parentId)===true;
 }
 async function authorizeCheckout(context,input){
  if(!input||Object.keys(input).length!==2||!valid(input.childId)||typeof input.requestKey!=="string"||!/^[-a-zA-Z0-9_]{1,128}$/.test(input.requestKey))return {ok:false,status:"INVALID_INPUT"};
  const payer=await resolveParent(context);if(!payer)return {ok:false,status:"NOT_AUTHORIZED"};
  const child=await readOwnedStudent(payer.parentId,input.childId);
  if(!child||child.childId!==input.childId||child.parentId!==payer.parentId)return {ok:false,status:"NOT_AUTHORIZED"};
  if(!await hasCurrentConsentAndTerms(payer.parentId))return {ok:false,status:"CONSENT_REQUIRED"};
  const membership=await readMembership(child.childId);
  if(!membership||membership.studentId!==child.childId||!["unpaid","active","expired","pending","cancelled"].includes(membership.status))return {ok:false,status:"MEMBERSHIP_UNVERIFIED"};
  if(["active","pending"].includes(membership.status))return {ok:false,status:"MEMBERSHIP_ALREADY_ACTIVE_OR_PENDING"};
  return {ok:true,status:"AUTHORIZED",intent:{environment:"sandbox",parentId:payer.parentId,childId:child.childId,requestKey:input.requestKey}};
 }
 return {resolveParent,hasCurrentConsentAndTerms,authorizeCheckout};
}
