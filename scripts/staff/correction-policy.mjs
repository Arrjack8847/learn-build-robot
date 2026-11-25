// J4 pure server-side correction planner. Never commit its output without a
// serializable transaction over the authoritative target, audit and ledger.
// The caller must resolve the actor from the verified individual staff account,
// the current target from storage, and now from the server clock.
const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
const reject=()=>({ok:false,status:"REFUSED"});
const goodTime=x=>Number.isSafeInteger(x)&&x>0;
export function planStaffCorrection({actor,action,requestId,reason,now,target,existingAudit}){
  if(!actor||!id(actor.staffId)||!["staff","admin"].includes(actor.role)||typeof actor.displayName!=="string"||!actor.displayName.trim()||!id(requestId)||typeof reason!=="string"||reason.trim().length<3||reason.trim().length>500||!goodTime(now)||!target||!id(target.id)||!id(target.childId)||typeof target.stateVersion!=="string"||!target.stateVersion)return reject();
  const audit={requestId,staffId:actor.staffId,staffName:actor.displayName,reason:reason.trim(),action,targetId:target.id,childId:target.childId,occurredAt:now,expectedVersion:target.stateVersion};
  if(existingAudit){
    // A retry can return a committed result only if it is the same operation.
    if(existingAudit.committed===true&&existingAudit.staffId===actor.staffId&&existingAudit.action===action&&existingAudit.targetId===target.id&&existingAudit.childId===target.childId&&existingAudit.reason===reason.trim()&&id(existingAudit.auditId))return {ok:true,status:"ALREADY_COMMITTED",auditId:existingAudit.auditId};
    return reject();
  }
  switch(action){
    case "mark-present":
      if(target.kind!=="booking"||!["booked","no-show"].includes(target.status)||!goodTime(target.startAt)||!goodTime(target.endAt)||target.endAt<=target.startAt||now<target.startAt||target.attendedAt!=null)return reject();
      return {ok:true,status:"PLAN_ONLY",audit,changes:{status:"attended",attendedAt:now,attendanceSource:"staff",attendanceStaffId:actor.staffId,attendanceStaffName:actor.displayName},requires:["unique-visit-per-booking","preserve-no-show-history","atomic-audit"]};
    case "excuse-no-show":
      if(target.kind!=="booking"||target.status!=="no-show"||target.excusedAt!=null)return reject();
      return {ok:true,status:"PLAN_ONLY",audit,changes:{status:"excused",excusedAt:now,excusedBy:actor.staffId},requires:["reconcile-no-show-policy","atomic-audit"]};
    case "check-out":
      if(target.kind!=="booking"||target.status!=="attended"||!goodTime(target.attendedAt)||now<target.attendedAt||target.checkedOutAt!=null)return reject();
      return {ok:true,status:"PLAN_ONLY",audit,changes:{checkedOutAt:now,checkedOutBy:actor.staffId},requires:["atomic-pass-revocation","atomic-audit"]};
    case "mark-paid-at-desk":
      // Do not activate membership until the approved covered-month, receipt,
      // payment evidence and reconciliation rules are supplied by the desk owner.
      // Never mint a HitPay transaction ID or mutate provider status here.
      if(target.kind!=="membership"||target.paymentStatus!=="unpaid")return reject();
      return {ok:false,status:"DESK_PAYMENT_POLICY_REQUIRED",audit};
    default:return reject();
  }
}
