// Private shared record keys and create-only provider ownership indexes.
import {createHash,randomUUID} from "node:crypto";
export const BILLING_COLLECTION="SandboxBillingState",CHECKOUT_SCOPE="j123-checkout-v1";
export const validStudent=x=>typeof x==="string"&&/^qa-j2-[a-f0-9]{64}$/.test(x);
export const validProvider=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
const hash=x=>createHash("sha256").update(x).digest("hex");
export const checkoutKey=student=>{if(!validStudent(student))throw Error("INVALID_STUDENT");return CHECKOUT_SCOPE+"-"+hash(student);};
export const providerKey=(kind,id)=>{if(!["subscription","charge"].includes(kind)||!validProvider(id))throw Error("INVALID_PROVIDER");return "j123-"+kind+"-v1-"+hash(id);};
export function decodeCheckout(row,student){
 if(row?.environment!=="sandbox-qa"||typeof row.stateVersion!=="string")throw Error("INVALID_ROW");
 const state=JSON.parse(row.stateJson);
 if(state.scope!==CHECKOUT_SCOPE||state.reservation?.childId!==student)throw Error("INVALID_BINDING");
 return state;
}
export function encodeCheckout(state,newId=randomUUID){return {environment:"sandbox-qa",stateVersion:newId(),stateJson:JSON.stringify(state)};}
function expectedBinding(kind,id,r){return {scope:"j123-provider-binding-v1",kind,providerId:id,parentId:r.parentId,childId:r.childId,attemptId:r.attemptId,reference:r.reference};}
export async function checkProviderBinding(db,kind,id,r,{reserve=false,newId=randomUUID}={}){
 if(!validStudent(r?.childId)||!validStudent(r?.parentId)||!validProvider(r?.attemptId)||!validProvider(r?.reference))return false;
 const key=providerKey(kind,id),expected=expectedBinding(kind,id,r);
 let row=await db.get(BILLING_COLLECTION,key);
 if(!row&&reserve){
  const result=await db.insert(BILLING_COLLECTION,key,encodeCheckout(expected,newId));
  if(result!==true&&result!==false)throw Error("PROVIDER_INDEX_UNCONFIRMED");
  row=await db.get(BILLING_COLLECTION,key);
 }
 if(row?.environment!=="sandbox-qa"||typeof row.stateVersion!=="string")return false;
 const value=JSON.parse(row.stateJson);
 return Object.keys(value).length===Object.keys(expected).length&&Object.entries(expected).every(([k,v])=>value[k]===v);
}
