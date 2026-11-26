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

// Cross-purpose recipient cooldown and hourly window; no email address stored.
export async function reserveIntegratedRecipient({store,crypto,clock,email}){
 const id="qa-j12-email-"+crypto.identityDigest("j12-shared-email-budget",email),collection="SandboxBillingState";
 for(let i=0;i<8;i++){
  const now=clock.now(),old=await store.get(collection,id);
  if(!Number.isSafeInteger(now)||now<=0)throw Error("INVALID_BUDGET_CLOCK");
  let prior=null;if(old){
   prior=JSON.parse(old.stateJson);
   if(old.environment!=="sandbox-qa"||typeof old.stateVersion!=="string"||prior.kind!=="j12-recipient-budget"||!Number.isSafeInteger(prior.start)||!Number.isSafeInteger(prior.last)||prior.start>prior.last||prior.last>now||!Number.isInteger(prior.count)||prior.count<1||prior.count>5)throw Error("INVALID_RECIPIENT_BUDGET");
  }
  if(prior&&now-prior.last<60000)return "COOLDOWN";
  const same=prior&&now-prior.start<3600000;
  if(same&&prior.count>=5)return "HOURLY_LIMIT";
  const next={environment:"sandbox-qa",stateVersion:crypto.newVersion(),stateJson:JSON.stringify({kind:"j12-recipient-budget",start:same?prior.start:now,last:now,count:same?prior.count+1:1})};
  const won=old?await store.replaceIfVersion(collection,id,old.stateVersion,next):await store.insert(collection,id,next);
  if(won===true)return null;
  if(won!==false)throw Error("RECIPIENT_BUDGET_UNCONFIRMED");
 }
 throw Error("RECIPIENT_BUDGET_CONFLICT");
}
export async function reserveIntegratedEmail({store,crypto,clock,email}){
 // Shared global J1 quota for both login purposes and the old J1 preview.
 if(!await reservePreviewEmailBudget({store,crypto,clock}))return "PREVIEW_EMAIL_BUDGET";
 return await reserveIntegratedRecipient({store,crypto,clock,email});
}
