// Strong-store rate limit, reserved before expensive PIN verification.
export function createStudentRateLimit({db,crypto,clock}){
 const collection="StudentAuthRateLimits";
 async function reserve(kind,subject,maximum,windowMs){
  if(!["proof","payer","global"].includes(kind)||typeof subject!=="string"||!subject||!Number.isInteger(maximum)||maximum<1||!Number.isInteger(windowMs)||windowMs<1)throw Error("INVALID_RATE_LIMIT");
  const id=crypto.rateDigest(kind,subject);
  for(let i=0;i<12;i++){
   const now=clock.now(),old=await db.get(collection,id);
   if(old&&(old.limitId!==id||old.kind!==kind||!Number.isSafeInteger(old.count)||old.count<1||old.count>maximum||!Number.isSafeInteger(old.windowStart)||old.windowStart>now||typeof old.stateVersion!=="string"))throw Error("INVALID_RATE_RECORD");
   const active=old&&now-old.windowStart<windowMs;
   if(active&&old.count>=maximum)return false;
   const next={limitId:id,kind,count:active?old.count+1:1,windowStart:active?old.windowStart:now,stateVersion:crypto.newVersion()};
   const won=old?await db.replaceIfVersion(collection,id,old.stateVersion,next):await db.insert(collection,id,next);
   if(won===true)return true;
   if(won!==false)throw Error("RATE_RESERVATION_UNCONFIRMED");
  }
  return false;
 }
 return {reserve};
}
