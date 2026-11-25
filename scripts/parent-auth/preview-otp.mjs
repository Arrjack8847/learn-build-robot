// Preview OTP policy: durable single-recipient rate limits and isolated server-side sessions.
// No real parent account, child profile, payment or authorization to production resources.
export function createPreviewOtp({store,crypto,mailer,clock,recipient}){
  // One configured recipient only, no real parent account, no production authorization.
  const key=crypto.identityDigest("parent-preview-otp",recipient);
  const accountId=crypto.identityDigest("parent-preview-session",recipient);
  const date=x=>x==null?null:{$date:new Date(x).toISOString()};
  const epoch=x=>x==null?null:Date.parse(typeof x==="string"?x:x.$date);
  const fields=["identityKey","challengeId","codeDigest","failedAttempts","stateVersion","requestWindowCount"];
  const dates=["expiresAt","lockedUntil","consumedAt","lastRequestedAt","requestWindowStart"];
  const read=row=>{
    if(!row)return null;
    if(row.identityKey!==key||typeof row.stateVersion!=="string"||!Number.isInteger(row.failedAttempts)||row.failedAttempts<0||row.failedAttempts>5||!Number.isInteger(row.requestWindowCount)||row.requestWindowCount<0||row.requestWindowCount>5)throw Error("INVALID_CHALLENGE");
    const result={};for(const f of fields)result[f]=row[f];for(const f of dates){result[f]=epoch(row[f]);if(result[f]!==null&&!Number.isFinite(result[f]))throw Error("INVALID_DATE");}
    if(!result.lastRequestedAt||!result.requestWindowStart||!result.expiresAt)throw Error("INVALID_CHALLENGE");
    return result;
  };
  const serialize=row=>{const result={};for(const f of fields)result[f]=row[f];for(const f of dates)result[f]=date(row[f]);return result;};
  async function mutate(transition){
    for(let i=0;i<8;i++){
      const prev=read(await store.get("AuthenticationChallenges",key));
      const action=transition(prev,clock.now());
      if(!action.next)return action.result;
      const next={...action.next,stateVersion:crypto.newVersion()};
      const won=prev?await store.replaceIfVersion("AuthenticationChallenges",key,prev.stateVersion,serialize(next)):await store.insert("AuthenticationChallenges",key,serialize(next));
      if(won===true)return action.result;
      if(won!==false)throw Error("UNCONFIRMED_WRITE");
    }
    throw Error("CONCURRENT_UPDATE");
  }
  async function requestCode(){
    const result=await mutate((old,now)=>{
      if(old?.lockedUntil>now)return {result:{ok:false,status:"LOCKED"}};
      if(old&&old.lastRequestedAt+60000>now)return {result:{ok:false,status:"COOLDOWN"}};
      const sameWindow=old&&old.requestWindowStart+3600000>now;
      if(sameWindow&&old.requestWindowCount>=5)return {result:{ok:false,status:"HOURLY_LIMIT"}};
      const code=crypto.sixDigits(),challengeId=crypto.newVersion();
      return {next:{identityKey:key,challengeId,codeDigest:crypto.codeDigest(key,challengeId,code),failedAttempts:old&&old.lockedUntil&&old.lockedUntil<=now?0:old?.failedAttempts??0,expiresAt:now+300000,lockedUntil:null,consumedAt:null,lastRequestedAt:now,requestWindowStart:sameWindow?old.requestWindowStart:now,requestWindowCount:sameWindow?old.requestWindowCount+1:1},result:{ok:true,status:"RESERVED",code,challengeId}};
    });
    if(!result.ok)return result;
    // Never log or return the plaintext OTP.
    try{await mailer.sendParentCode(recipient,result.code,300000,result.challengeId);return {ok:true,status:"CODE_SENT"};}catch{return {ok:false,status:"DELIVERY_UNCONFIRMED"};}
  }
  async function verifyCode(code){
    if(typeof code!=="string"||!/^\d{6}$/.test(code))return {ok:false,status:"INVALID_OR_EXPIRED"};
    const result=await mutate((old,now)=>{
      const refused={ok:false,status:"INVALID_OR_EXPIRED"};
      if(!old||old.consumedAt!==null||old.expiresAt<=now)return {result:refused};
      if(old.lockedUntil>now||old.failedAttempts>=5)return {result:{ok:false,status:"LOCKED"}};
      if(crypto.constantTimeEqual(crypto.codeDigest(key,old.challengeId,code),old.codeDigest)){
        return {next:{...old,codeDigest:"",consumedAt:now,failedAttempts:0},result:{ok:true}};
      }
      const failures=old.failedAttempts+1;
      return {next:{...old,failedAttempts:failures,lockedUntil:failures>=5?now+900000:null},result:failures>=5?{ok:false,status:"LOCKED"}:refused};
    });
    if(!result.ok)return result;
    const token=crypto.sessionToken(),digest=crypto.sessionDigest(token),now=clock.now();
    const session={sessionDigest:digest,accountId,accountType:"parent-test",createdAt:date(now),expiresAt:date(now+43200000),revokedAt:null,stateVersion:crypto.newVersion()};
    if(await store.insert("AuthSessions",digest,session)!==true)throw Error("SESSION_WRITE_FAILED");
    return {ok:true,status:"VERIFIED",token};
  }
  async function resolve(token){
    if(typeof token!=="string"||!/^[a-zA-Z0-9_-]{43}$/.test(token))return null;
    const digest=crypto.sessionDigest(token),row=await store.get("AuthSessions",digest);
    if(!row||row.accountType!=="parent-test"||row.accountId!==accountId||row.sessionDigest!==digest||row.revokedAt!=null||typeof row.stateVersion!=="string")return null;
    const expires=epoch(row.expiresAt),created=epoch(row.createdAt),now=clock.now();
    if(!Number.isFinite(expires)||!Number.isFinite(created)||created>now||expires<=now||expires-created!==43200000)return null;
    return {digest,row};
  }
  async function status(token){return {ok:true,status:await resolve(token)?"VERIFIED":"NOT_VERIFIED"};}
  async function logout(token){
    const session=await resolve(token);
    if(!session)return {ok:true,status:"SIGNED_OUT"};
    const {row,digest}=session;
    const next={sessionDigest:row.sessionDigest,accountId:row.accountId,accountType:row.accountType,createdAt:row.createdAt,expiresAt:row.expiresAt,revokedAt:date(clock.now()),stateVersion:crypto.newVersion()};
    if(await store.replaceIfVersion("AuthSessions",digest,row.stateVersion,next)!==true&&await resolve(token))throw Error("REVOCATION_UNCONFIRMED");
    return {ok:true,status:"SIGNED_OUT"};
  }
  return {requestCode,verifyCode,status,logout};
}
