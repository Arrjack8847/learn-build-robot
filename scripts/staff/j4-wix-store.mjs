// Dedicated J4 private-test store. No shared LMS collections are accessed.
const ROOT="https://www.wixapis.com/wix-data/v2/items";
const SITE="09d613aa-3a95-42ff-9ee3-2aa0c706c447";
const COLLECTION="J4PrivateState", ID="qa-j4-state-v1";
export function createJ4WixStore(env,request=fetch){
 if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.J4_PRIVATE_ENABLED!=="1"||env.J4_WIX_SITE_ID!==SITE||!env.J4_WIX_DATA_API_KEY?.trim())throw Error("J4_NOT_CONFIGURED");
 async function call(url,method,body){
  const r=await request(url,{method,headers:{Authorization:env.J4_WIX_DATA_API_KEY,"wix-site-id":SITE,"Content-Type":"application/json",Accept:"application/json"},...(body===undefined?{}:{body:JSON.stringify(body)}),cache:"no-store",redirect:"error",signal:AbortSignal.timeout(10000)});
  return r.ok?{status:r.status,payload:await r.json()}:{status:r.status};
 }
 function state(response){
  const row=response.payload?.dataItem;
  if(row?.id!==ID||row.dataCollectionId!==COLLECTION||typeof row.data?.stateVersion!=="string"||typeof row.data?.snapshot!=="string")throw Error("J4_INVALID_WIX_RESPONSE");
  const parsed=JSON.parse(row.data.snapshot);
  if(parsed.mode!=="j4-fixture-v1"||parsed.stateVersion!==row.data.stateVersion||!["students","memberships","payments","deposits","attendance","progress","staff","audit","sessions","attempts","codes"].every(k=>Array.isArray(parsed[k])))throw Error("J4_INVALID_STATE");
  return parsed;
 }
 function data(next){
  if(next.mode!=="j4-fixture-v1"||typeof next.stateVersion!=="string")throw Error("J4_INVALID_STATE");
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
