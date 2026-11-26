// J4 desk registration, payments and audit history.
// Never use a browser identity or a browser-supplied paid flag.
// The durable transaction adapter and approved desk policies are mandatory.
const id=v=>typeof v==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(v);
const period=v=>typeof v==="string"&&/^\d{4}-(0[1-9]|1[0-2])$/.test(v);
const note=v=>typeof v==="string"&&v.trim().length>=3&&v.trim().length<=500;
const refuse=()=>({ok:false,status:"REFUSED"});
const unavailable=()=>({ok:false,status:"POLICY_REQUIRED"});
export function createDeskRegistrationPayment({identity,store,clock,policy}){
  async function actor(context){
    const a=await identity.resolveStaff(context);
    if(!a||a.accountStatus!=="active"||!["staff","admin"].includes(a.role)||!id(a.staffId)||typeof a.displayName!=="string"||!a.displayName.trim())return null;
    return {staffId:a.staffId,displayName:a.displayName,role:a.role};
  }
  async function registerChild(context,input){
    const a=await actor(context);
    if(!a||!input||!id(input.parentId)||!id(input.requestId)||!note(input.reason)||typeof input.name!=="string"||!input.name.trim()||input.name.trim().length>100||!Number.isInteger(input.birthYear)||input.birthYear<1900||input.birthYear>Number(clock.localDay().slice(0,4)))return refuse();
    if(policy?.deskRegistrationApproved!==true||typeof policy.noticeVersion!=="string"||!policy.noticeVersion)return unavailable();
    // Store must verify that parent email is verified and the parent personally
    // accepted the current privacy notice; staff cannot manufacture consent.
    // Atomically check duplicate/request identity, create child and append audit.
    const r=await store.registerAuditedChild({actor:a,parentId:input.parentId,name:input.name.trim(),birthYear:input.birthYear,requestId:input.requestId,reason:input.reason.trim(),noticeVersion:policy.noticeVersion,occurredAt:clock.now()});
    if(r?.committed!==true||!id(r.childId)||!id(r.auditId))return refuse();
    return {ok:true,status:"REGISTERED",childId:r.childId,auditId:r.auditId};
  }
  async function recordDeskPayment(context,input){
    const a=await actor(context);
    if(!a||!input||!id(input.membershipId)||!id(input.requestId)||!period(input.coveredMonth)||!note(input.reason)||typeof input.evidenceRef!=="string"||input.evidenceRef.trim().length<3||input.evidenceRef.trim().length>128||typeof input.method!=="string")return refuse();
    // No default payment methods, covered-month or receipt policy until approved.
    // Never accept card details, an amount override, a HitPay ID or proof from client.
    if(policy?.deskPaymentsApproved!==true||!Number.isSafeInteger(policy.amountMinor)||policy.amountMinor<=0||typeof policy.currency!=="string"||!/^[A-Z]{3}$/.test(policy.currency)||typeof policy.version!=="string"||!policy.version||!Array.isArray(policy.allowedDeskMethods)||!policy.allowedDeskMethods.includes(input.method))return unavailable();
    // Atomic durable adapter must verify payment evidence, membership eligibility,
    // period, duplicate payments (including HitPay), and receipt sequence under
    // approved policy. Write desk ledger + membership + receipt + audit once.
    // No forged HitPay webhook, provider ID or mutation of provider evidence.
    const r=await store.recordAuditedDeskPayment({actor:a,membershipId:input.membershipId,coveredMonth:input.coveredMonth,requestId:input.requestId,reason:input.reason.trim(),evidenceRef:input.evidenceRef.trim(),method:input.method,currency:policy.currency,amountMinor:policy.amountMinor,source:"desk",policyVersion:policy.version,occurredAt:clock.now()});
    if(r?.committed!==true||!id(r.paymentId)||!id(r.receiptId)||!id(r.auditId))return refuse();
    return {ok:true,status:"RECORDED",paymentId:r.paymentId,receiptId:r.receiptId,auditId:r.auditId};
  }
  async function auditHistory(context,day){
    const a=await actor(context);
    if(!a||typeof day!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(day))return refuse();
    const d=new Date(day+"T00:00:00Z");
    if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==day||day>clock.localDay())return refuse();
    const rows=await store.readDeskAudit({actor:a,day});
    if(!Array.isArray(rows))throw Error("AUDIT_UNAVAILABLE");
    const entries=rows.map(r=>{
      if(!r||!id(r.auditId)||!id(r.staffId)||!id(r.targetId)||typeof r.staffName!=="string"||typeof r.action!=="string"||typeof r.reason!=="string"||!Number.isSafeInteger(r.occurredAt))throw Error("INVALID_AUDIT_RECORD");
      return {auditId:r.auditId,staffId:r.staffId,staffName:r.staffName,targetId:r.targetId,action:r.action,reason:r.reason,occurredAt:r.occurredAt};
    });
    return {ok:true,status:"READY",entries};
  }
  return {registerChild,recordDeskPayment,auditHistory};
}
