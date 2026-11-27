// J5 shared membership decision and read-only J3 adapter contract.
export function evaluateMembership(row,id,now){
 const stamp=n=>Number.isSafeInteger(n)&&n>=0&&n<=8640000000000000;
 const result=(status,validUntil=null)=>({status,validUntil,eligible:status==="active"});
 if(!stamp(now)||typeof id!=="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(id))return result("unavailable");
 if(row==null)return result("inactive");
 if(row.studentId!==id||row.environment!=="private-preview")return result("unavailable");
 if(["inactive","pending","failed","expired","renewal-required","verification-required"].includes(row.status)){
  if(row.eligible===true)return result("unavailable");
  return result(row.status,["expired","renewal-required"].includes(row.status)&&stamp(row.validUntil)?row.validUntil:null);
 }
 if(row.status!=="active"||!stamp(row.validFrom)||!stamp(row.validUntil)||row.validFrom>=row.validUntil||typeof row.eligible!=="boolean")return result("unavailable");
 if(now>=row.validUntil)return result("expired",row.validUntil);
 if(now<row.validFrom||!row.eligible)return result("inactive");
 return result("active",row.validUntil);
}
export function normalizeJ3Membership({studentId,observation,now}){
 // Server-only bridge: observation must be a fresh trusted J3 status-reader result,
 // not a browser body, redirect, webhook, payment candidate or ledger supplied by a client.
 const stamp=n=>Number.isSafeInteger(n)&&n>0&&n<=8640000000000000;
 if(typeof studentId!=="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(studentId)||!stamp(now)||observation?.studentId!==studentId||typeof observation.verifiedLearningEligibility!=="boolean")throw Error("Invalid J3 membership observation");
 const base={studentId,environment:"private-preview",eligible:false};
 const map={inactive:"inactive",payment_pending:"pending",expired:"expired",verification_required:"verification-required"};
 if(observation.membershipStatus==="active"){
  if(observation.verifiedLearningEligibility!==true||!stamp(observation.activatedAt)||!stamp(observation.validUntil)||observation.activatedAt>now||now>=observation.validUntil)throw Error("Invalid active membership observation");
  // The J3 public projection does not expose validFrom. Its trusted fresh active
  // decision proves eligibility only from observation time, never retroactively.
  return {...base,status:"active",eligible:true,validFrom:now,validUntil:observation.validUntil};
 }
 if(!Object.hasOwn(map,observation.membershipStatus)||observation.verifiedLearningEligibility!==false)throw Error("Invalid membership status");
 const status=map[observation.membershipStatus];
 if(status==="expired"&&(!stamp(observation.validUntil)||observation.validUntil>now))throw Error("Invalid expired membership");
 return {...base,status,...(status==="expired"?{validUntil:observation.validUntil}:{})};
}
