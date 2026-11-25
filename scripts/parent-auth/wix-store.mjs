// J2 private server-only Wix REST adapter, scoped to the development site.
// Not mounted to a browser endpoint; requires a least-privileged Wix API key.
// Conditional update semantics were checked with a temporary Wix QA record.
const SITE="09d613aa-3a95-42ff-9ee3-2aa0c706c447";
const ROOT="https://www.wixapis.com/wix-data/v2/items";
const allowed=new Set(["AuthenticationChallenges","Parents","AuthSessions","PrivacyConsents","Children","SandboxCheckoutTrials","PaymentWebhookEvents"]);
export function createWixStore(env,request=fetch){
  if(env.VERCEL_ENV==="production"||env.VERCEL_TARGET_ENV==="production"||env.WIX_DEV_SITE_ID!==SITE||!env.WIX_DEV_DATA_API_KEY?.trim())throw Error("DEV_DATABASE_NOT_CONFIGURED");
  const validate=(collection,id)=>{
    if(!allowed.has(collection)||typeof id!=="string"||!/^[a-zA-Z0-9_-]{1,128}$/.test(id))throw Error("INVALID_RECORD_ID");
  };
  async function call(url,method,body){
    const r=await request(url,{method,headers:{Authorization:env.WIX_DEV_DATA_API_KEY,"wix-site-id":SITE,"Content-Type":"application/json",Accept:"application/json"},...(body===undefined?{}:{body:JSON.stringify(body)}),cache:"no-store",redirect:"error",signal:AbortSignal.timeout(10000)});
    if(!r.ok)return {ok:false,status:r.status}; // no raw error bodies or credentials
    return {ok:true,payload:await r.json()};
  }
  function validateResponse(r,collection,id){
    const row=r.payload?.dataItem;
    if(row?.id!==id||row?.dataCollectionId!==collection||!row.data||typeof row.data!=="object")throw Error("INVALID_WIX_RESPONSE");
    return row.data;
  }
  async function get(collection,id){
    validate(collection,id);
    const r=await call(ROOT+"/"+encodeURIComponent(id)+"?dataCollectionId="+encodeURIComponent(collection)+"&consistentRead=true","GET");
    if(r.status===404)return null;
    if(!r.ok)throw Error("WIX_READ_FAILED");
    return validateResponse(r,collection,id);
  }
  async function insert(collection,id,data){
    validate(collection,id);
    const r=await call(ROOT,"POST",{dataCollectionId:collection,dataItem:{id,data}});
    if(!r.ok){if(r.status===409)return false;throw Error("WIX_INSERT_UNCONFIRMED");}
    validateResponse(r,collection,id);
    return true;
  }
  async function replaceIfVersion(collection,id,expectedVersion,data){
    validate(collection,id);
    if(typeof expectedVersion!=="string"||!expectedVersion||typeof data.stateVersion!=="string"||data.stateVersion===expectedVersion)throw Error("INVALID_VERSION");
    const r=await call(ROOT+"/"+encodeURIComponent(id),"PUT",{dataCollectionId:collection,dataItem:{data},condition:{filter:{stateVersion:{$eq:expectedVersion}}}});
    if(!r.ok){if(r.status===409||r.status===412)return false;throw Error("WIX_UPDATE_UNCONFIRMED");}
    const row=validateResponse(r,collection,id);
    if(row.stateVersion!==data.stateVersion)throw Error("WIX_UPDATE_UNCONFIRMED");
    return true;
  }
  const date=x=>x==null?null:{$date:new Date(x).toISOString()};
  function epoch(x){
    if(x==null)return null;
    const t=Date.parse(typeof x==="string"?x:x.$date);
    if(!Number.isFinite(t))throw Error("INVALID_WIX_TIMESTAMP");
    return t;
  }
  const dateFields=["expiresAt","lockedUntil","consumedAt","lastRequestedAt"];
  const serialize=record=>{const row={...record};for(const k of dateFields)row[k]=date(row[k]);return row;};
  const deserialize=record=>{const row={...record};for(const k of dateFields)row[k]=epoch(row[k]);return row;};
  return {
    get,insert,replaceIfVersion,
    challengeStore:{
      async readStrong(key){
        const row=await get("AuthenticationChallenges",key);
        if(!row)return null;
        if(row.identityKey!==key||typeof row.stateVersion!=="string"||!Number.isSafeInteger(row.failedAttempts))throw Error("INVALID_CHALLENGE");
        return deserialize(row);
      },
      async compareAndSet(key,expected,next){
        if(next.identityKey!==key)throw Error("INVALID_CHALLENGE");
        return expected===null?insert("AuthenticationChallenges",key,serialize(next)):replaceIfVersion("AuthenticationChallenges",key,expected,serialize(next));
      }
    }
  };
}
