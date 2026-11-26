// Protected preview only. Durable, shared budget prevents rotating recipients from bypassing per-email limits.
// Reuses the existing restricted SandboxBillingState collection; no schema migration or raw email storage.
export async function reservePreviewEmailBudget({store,crypto,clock}){
 const id="qa-j1-open-email-budget-v1",collection="SandboxBillingState";
 const hourLimit=25,dayLimit=60;
 for(let i=0;i<8;i++){
  const now=clock.now(),hour=Math.floor(now/3600000),day=Math.floor(now/86400000);
  if(!Number.isSafeInteger(hour)||!Number.isSafeInteger(day))throw Error("INVALID_BUDGET_CLOCK");
  const old=await store.get(collection,id);
  let prev=null;
  if(old){
   prev=JSON.parse(old.stateJson);
   if(old.environment!=="sandbox-qa"||typeof old.stateVersion!=="string"||prev.kind!=="j1-open-email-budget"||!Number.isSafeInteger(prev.hour)||!Number.isSafeInteger(prev.day)||!Number.isInteger(prev.hourCount)||!Number.isInteger(prev.dayCount)||prev.hourCount<0||prev.hourCount>hourLimit||prev.dayCount<0||prev.dayCount>dayLimit||prev.hour>hour||prev.day>day)throw Error("INVALID_EMAIL_BUDGET");
  }
  const hourCount=prev?.hour===hour?prev.hourCount:0,dayCount=prev?.day===day?prev.dayCount:0;
  if(hourCount>=hourLimit||dayCount>=dayLimit)return false;
  const next={environment:"sandbox-qa",stateVersion:crypto.newVersion(),stateJson:JSON.stringify({kind:"j1-open-email-budget",hour,day,hourCount:hourCount+1,dayCount:dayCount+1})};
  const won=old?await store.replaceIfVersion(collection,id,old.stateVersion,next):await store.insert(collection,id,next);
  if(won===true)return true;
  if(won!==false)throw Error("EMAIL_BUDGET_WRITE_UNCONFIRMED");
 }
 throw Error("EMAIL_BUDGET_CONFLICT");
}
