// Durable single unresolved membership reservation per student. Never activates membership.
import {randomUUID,createHash} from "node:crypto";
const collection="SandboxBillingState",scope="j123-checkout-v1";
const valid=x=>typeof x==="string"&&/^qa-j2-[a-f0-9]{64}$/.test(x);
const rowId=child=>scope+"-"+createHash("sha256").update(child).digest("hex");
export function createIntegratedCheckoutStore({db,resolvePayer,request,env,childId,clock=()=>Date.now(),newId=randomUUID}){
 if(!valid(childId))throw Error("INVALID_CHILD");
 const key=rowId(childId);
 const parse=row=>{if(row?.environment!=="sandbox-qa"||typeof row.stateVersion!=="string")throw Error("INVALID_ROW");const s=JSON.parse(row.stateJson);if(s.scope!==scope||s.reservation?.childId!==childId)throw Error("INVALID_BINDING");return s.reservation;};
 const encode=(r)=>({environment:"sandbox-qa",stateVersion:newId(),stateJson:JSON.stringify({scope,reservation:r})});
 async function owned(parentId,selected){const p=await resolvePayer(request,env,selected);return p?.parentId===parentId&&p.childId===childId?{parentId,childId}:null;}
 async function reserveAuthorizedCheckout(expected){
  if(expected.kind!=="membership"||expected.environment!=="sandbox"||expected.currency!=="MYR"||expected.amountMinor!==36000||expected.childId!==childId||!await owned(expected.parentId,childId))throw Error("NOT_AUTHORIZED");
  let old=await db.get(collection,key);
  if(old){const r=parse(old);if(!Object.entries(expected).every(([k,v])=>r[k]===v))throw Error("UNRESOLVED_STUDENT_CHECKOUT");return {created:false,reservation:r};}
  const r={...expected,attemptId:newId(),reference:"j123-"+newId(),status:"reserved",termsVersion:"j123-sandbox-membership-v1",termsAcceptedAt:clock(),startDate:new Date(clock()+86400000+8*3600000).toISOString().slice(0,10)};
  const next=encode(r),created=await db.insert(collection,key,next);old=await db.get(collection,key);const saved=parse(old);
  if(!Object.entries(expected).every(([k,v])=>saved[k]===v))throw Error("RESERVATION_CONFLICT");
  if(created===true&&old.stateVersion!==next.stateVersion)throw Error("RESERVATION_UNCONFIRMED");
  return {created:created===true,reservation:saved};
 }
 async function bindCheckoutOnce({attemptId,reference,providerId,environment,kind}){
  const old=await db.get(collection,key),r=parse(old);if(r.status!=="reserved"||r.attemptId!==attemptId||r.reference!==reference||environment!=="sandbox"||kind!=="membership"||!/^[-a-zA-Z0-9_]{1,128}$/.test(providerId))return false;
  const next=encode({...r,status:"bound",providerId});if(await db.replaceIfVersion(collection,key,old.stateVersion,next)!==true)return false;
  const saved=await db.get(collection,key);return saved?.stateVersion===next.stateVersion&&parse(saved).providerId===providerId;
 }
 async function getStatus(parentId){if(!await owned(parentId,childId))throw Error("NOT_AUTHORIZED");const row=await db.get(collection,key);if(!row)return "NO_CHECKOUT";const r=parse(row);if(r.parentId!==parentId||r.environment!=="sandbox"||r.kind!=="membership"||!["reserved","bound"].includes(r.status))throw Error("INVALID_BINDING");return r.status==="bound"?"PAYMENT_PENDING":"RECONCILIATION_REQUIRED";}
 return {getOwnedActiveChild:owned,reserveAuthorizedCheckout,bindCheckoutOnce,getStatus,getAuthorizedDepositBooking:async()=>null};
}
