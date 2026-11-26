// J4 v1 read-only service. Adapter and identity are server-owned; no fixture is mounted to HTTP.
export function createStaffReadService({identity,store,clock}){
  const roles={
    admin:["students","memberships","payments","deposits","attendance","checkins","progress","staff","audit"],
    staff:["students","memberships","attendance","checkins","progress"],
    finance:["memberships","payments","deposits"]
  };
  const fields={
    students:["studentId","name","birthYear","registeredAt","membershipStatus","checkInStatus","level","latestActivity"],
    memberships:["membershipId","studentId","studentName","status","activatedAt","validUntil","renewalStatus","subscriptionStatus"],
    payments:["paymentId","providerPaymentId","studentId","purpose","amountMinor","currency","status","paidAt","billingPeriod","subscriptionRef","refundStatus","evidenceType"],
    deposits:["paymentId","studentId","bookingId","amountMinor","currency","status","refundStatus","disposition","evidenceType"],
    attendance:["bookingId","studentId","sessionDate","status","checkInAt","checkOutAt","staffId"],
    checkins:["bookingId","studentId","status","issuedAt","expiresAt","attempts"],
    progress:["studentId","level","completedLessons","completedBuilds","quizCompleted","quizResults","challengeResults","levelCompletion","latestActivity"],
    staff:["staffId","displayName","role","accountStatus"],
    audit:["auditId","staffId","action","targetId","occurredAt","result"]
  };
  const filters={
    students:["studentId","name","membershipStatus","level","checkInStatus"],
    memberships:["studentId","status","renewalStatus"],
    payments:["studentId","paymentId","status","purpose","from","to"],
    deposits:["studentId","bookingId","status","from","to"],
    attendance:["studentId","status","from","to"],
    checkins:["studentId","bookingId","status"],
    progress:["studentId","level"],
    staff:["role","accountStatus"],
    audit:["staffId","from","to"]
  };
  const deny=()=>({ok:false,status:"REFUSED"});
  const id=v=>typeof v==="string"&&/^[A-Za-z0-9_-]{1,128}$/.test(v);
  const own=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
  const date=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+"T00:00:00Z"))&&new Date(v+"T00:00:00Z").toISOString().slice(0,10)===v;
  async function actor(ctx){
    const a=await identity.resolveStaff(ctx);
    if(!a||a.subjectType!=="staff"||a.accountStatus!=="active"||a.revokedAt!=null||!id(a.staffId)||!own(roles,a.role)||!Number.isSafeInteger(a.expiresAt)||a.expiresAt<=clock.now())return null;
    return {staffId:a.staffId,role:a.role};
  }
  function query(resource,input){
    if(!input||typeof input!=="object"||Array.isArray(input)||Object.keys(input).some(k=>!["page","pageSize","filters","sort","direction"].includes(k)))return null;
    const {page=1,pageSize=25,filters:f={},sort=fields[resource][0],direction="asc"}=input;
    if(!Number.isSafeInteger(page)||page<1||page>10000||!Number.isSafeInteger(pageSize)||pageSize<1||pageSize>50||!fields[resource].includes(sort)||!["asc","desc"].includes(direction)||!f||typeof f!=="object"||Array.isArray(f))return null;
    const clean={};
    for(const [k,v] of Object.entries(f)){
      if(!filters[resource].includes(k))return null;
      if(k==="level"){if(!Number.isInteger(v)||v<1||v>6)return null;}
      else if(k==="from"||k==="to"){if(!date(v))return null;}
      else if(/Id$/.test(k)){if(!id(v))return null;}
      else if(typeof v!=="string"||!v.trim()||v.length>100||/[\x00-\x1f]/.test(v))return null;
      clean[k]=typeof v==="string"?v.trim():v;
    }
    if(clean.from&&clean.to&&clean.from>clean.to)return null;
    return {page,pageSize,filters:clean,sort,direction};
  }
  function project(resource,row){
    if(!row||typeof row!=="object"||Array.isArray(row))throw Error("INVALID_ROW");
    const result={};
    for(const k of fields[resource]){
      if(!own(row,k))continue;
      const v=row[k];
      if(v===null||typeof v==="string"||typeof v==="boolean"||(typeof v==="number"&&Number.isFinite(v)))result[k]=v;
      else throw Error("INVALID_PROJECTION");
    }
    if(!id(result[fields[resource][0]]))throw Error("INVALID_ROW_ID");
    if(resource==="payments"||resource==="deposits"){
      if(!Number.isSafeInteger(result.amountMinor)||result.amountMinor<0||!/^[A-Z]{3}$/.test(result.currency??"")||!["fixture","hitpay-sandbox","desk-sandbox"].includes(result.evidenceType))throw Error("INVALID_PAYMENT_PROJECTION");
      if(resource==="payments"&&!["membership","deposit"].includes(result.purpose))throw Error("INVALID_PAYMENT_PURPOSE");
      if(result.evidenceType==="fixture"&&result.status==="verified")throw Error("FIXTURE_NOT_VERIFIED");
    }
    return result;
  }
  async function list(ctx,resource,input={}){
    const a=await actor(ctx);
    if(!a||!own(fields,resource)||!roles[a.role].includes(resource))return deny();
    const q=query(resource,input);
    if(!q)return {ok:false,status:"INVALID_INPUT"};
    const result=await store.list({actor:a,resource,...q});
    if(!result||!Array.isArray(result.rows)||result.rows.length>q.pageSize||!Number.isSafeInteger(result.total)||result.total<0||result.rows.length!==Math.min(q.pageSize,Math.max(0,result.total-(q.page-1)*q.pageSize)))throw Error("INVALID_PAGE");
    const rows=result.rows.map(row=>project(resource,row));
    if(q.filters.studentId&&rows.some(row=>row.studentId!==q.filters.studentId))throw Error("STUDENT_SCOPE_MISMATCH");
    return {ok:true,status:"READY",resource,page:q.page,pageSize:q.pageSize,total:result.total,rows};
  }
  async function student(ctx,studentId){
    const a=await actor(ctx);
    if(!a||!roles[a.role].includes("students")||!id(studentId))return deny();
    const row=await store.getStudent({actor:a,studentId});
    if(!row||row.studentId!==studentId)return deny();
    return {ok:true,status:"READY",student:project("students",row)};
  }
  return {list,student};
}
