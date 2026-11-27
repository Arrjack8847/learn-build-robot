// Read-only private staff reporting. Report partial evidence explicitly; no manual payment override.
import {businessDay} from "../nizar/policy.mjs";
import {n4,depositBalance,digest} from "../nizar/automation-state.mjs";
import {staffAudit} from "../nizar/staff-state.mjs";
import {deposits} from "./deposit-state.mjs";
import {readJ1234BillingProjection} from "../j1234/billing-projection.mjs";
import {readJ12345Progress} from "../j12345/progress.mjs";
const monthOk=m=>typeof m==="string"&&/^\d{4}-(0[1-9]|1[0-2])$/.test(m);
const same=(a,b)=>a&&b&&a.childId===b.childId&&a.parentId===b.parentId&&a.stateVersion===b.stateVersion;
const date=n=>Number.isSafeInteger(n)&&n>0;
const csvCell=v=>{let s=String(v??"");if(/^[\s\u0000-\u001f]*[=+\-@]/.test(s)||/^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
const csv=(headers,rows)=>[headers,...rows].map(r=>r.map(csvCell).join(",")).join("\r\n")+"\r\n";
const money=n=>(n/100).toFixed(2);
const myt=n=>date(n)?new Date(n+8*3600000).toISOString().replace("T"," ").slice(0,19):"";
const fail=status=>({ok:false,status});
export function createCombinedStaffReports({env,runtime,readBilling=readJ1234BillingProjection,readProgress=readJ12345Progress}){
 return async function report(request,input){
  const month=input.month,kind=input.action,actor=await runtime.resolveStaff(request);
  const perm=kind==="visit-export"?"reports:export":kind==="finance-export"?"finance:read":kind==="desk-overview"?"schedule:read":null;
  if(!perm||!actor?.permissions.includes(perm)||kind==="finance-export"&&!actor.permissions.includes("reports:export"))return fail("NOT_AUTHORIZED");
  if(!monthOk(month)||month>businessDay(runtime.clock()).slice(0,7))return fail("INVALID_INPUT");
  try{
   const now=runtime.clock(),snap=await runtime.repository.read(),s=snap.state,students=await runtime.listStudents(request);
   if(!Array.isArray(students)||students.length>250||new Set(students.map(x=>x.id)).size!==students.length)return fail("DIRECTORY_UNAVAILABLE");
   const owners=new Map(),billingSnapshots=new Map(),members=[],charges=[],visitRows=[],financeRows=[],chargeIds=new Set();
   const finance=actor.permissions.includes("finance:read")&&kind!=="visit-export";
   for(const x of students){
    const o=await runtime.readOwner(x.id);if(!o||o.name!==x.name)return fail("OWNER_UNAVAILABLE");owners.set(o.childId,o);
    const hold=n4(s).holds.find(h=>h.childId===o.childId&&h.parentId===o.parentId&&h.status!=="restored");
    const elig=await runtime.readEligibility(o);
    const row={childId:o.childId,name:o.name,membership:hold?"held-unpaid":elig.membership,validUntil:elig.validUntil??null,holdUntil:hold?.deadline??null,depositHeld:depositBalance(s,o.childId,businessDay(now).slice(0,7)).held,progress:"unavailable"};
    if(kind==="desk-overview"){
     const p=await readProgress(o,env);row.progress=p?.status??"unavailable";row.currentLevel=p?.status==="ready"?p.currentLevel:null;
    }
    if(finance){
     const b=await readBilling({env,db:runtime.store,studentId:o.childId,parentId:o.parentId,now});
     if(!b||!Array.isArray(b.payments))return fail("BILLING_UNAVAILABLE");
     billingSnapshots.set(o.childId,JSON.stringify(b));row.paymentStatus=b.paymentStatus;row.renewalStatus=b.renewalStatus;row.paidUntil=b.validUntil??null;
     for(const p of b.payments){
      if(p.studentId!==o.childId||!date(p.paidAt)||p.paidAt>now||p.amountMinor!==36000||p.currency!=="MYR"||!["verified","review_required"].includes(p.status)||chargeIds.has(p.paymentId))return fail("BILLING_UNAVAILABLE");
      chargeIds.add(p.paymentId);
      if(businessDay(p.paidAt).slice(0,7)===month){const c={student:o.name,childId:o.childId,reference:p.paymentId,type:"membership",status:p.status,at:p.paidAt,amountMinor:36000};charges.push(c);financeRows.push(c);}
     }
    }
    members.push(row);
   }
   for(const b of s.bookings.filter(b=>b.day.startsWith(month+"-"))){
    const o=owners.get(b.childId);if(!o||o.parentId!==b.parentId)return fail("OWNER_UNAVAILABLE");
    const a=staffAudit(s).filter(a=>a.bookingId===b.bookingId),check=a.find(x=>["manual-attendance","verified-check-in"].includes(x.kind)),out=a.find(x=>x.kind==="checkout"),exc=n4(s).excuses.find(x=>x.bookingId===b.bookingId);
    visitRows.push({bookingId:b.bookingId,student:o.name,childId:o.childId,day:b.day,activity:b.activity,status:b.bookingStatus,startAt:b.startAt,endAt:b.endAt,checkInAt:check?.at??null,checkOutAt:out?.at??null,checkInBy:check?check.kind==="verified-check-in"?"student-code":check.actorId:"",checkOutBy:out?.actorId??"",excusedBy:exc?.staffId??"",reason:exc?.reason??out?.reason??check?.reason??""});
   }
   if(finance)for(const l of n4(s).ledger.filter(x=>businessDay(x.at).slice(0,7)===month)){
    const o=owners.get(l.childId);if(!o||o.parentId!==l.parentId)return fail("OWNER_UNAVAILABLE");
    const r=deposits(s).find(d=>d.childId===l.childId&&d.status==="settled"&&d.month===l.month&&d.parentId===l.parentId&&digest(["deposit-charge",d.paymentId])===l.reference&&d.paidAt<=l.at);
    // Deposit balance movements are not membership revenue; actual payment acceptance remains separate.
    financeRows.push({student:o.name,childId:o.childId,reference:l.reference,type:"deposit-"+l.kind,status:l.kind==="paid"&&!r?"review_required":"recorded",at:l.at,amountMinor:l.amount});
   }
   for(const o of owners.values()){
    if(!same(o,await runtime.readOwner(o.childId,o.parentId)))return fail("OWNER_UNAVAILABLE");
    if(finance&&billingSnapshots.get(o.childId)!==JSON.stringify(await readBilling({env,db:runtime.store,studentId:o.childId,parentId:o.parentId,now})))return fail("BILLING_CHANGED");
   }
   const currentStudents=await runtime.listStudents(request);
   if(!Array.isArray(currentStudents)||JSON.stringify(currentStudents.map(x=>x.id).sort())!==JSON.stringify(students.map(x=>x.id).sort()))return fail("DIRECTORY_UNAVAILABLE");
   const fresh=await runtime.resolveStaff(request);if(fresh?.staffId!==actor.staffId||fresh.version!==actor.version||(await runtime.repository.read()).version!==snap.version)return fail("BOOKING_BUSY");
   const visitCsv=()=>csv(["Booking ID","Student","Student ID","Day (MYT)","Activity","Status","Booked start (MYT)","Booked end (MYT)","Check-in (MYT)","Checkout (MYT)","Check-in actor","Checkout actor","Excused by","Note"],visitRows.map(v=>[v.bookingId,v.student,v.childId,v.day,v.activity,v.status,myt(v.startAt),myt(v.endAt),myt(v.checkInAt),myt(v.checkOutAt),v.checkInBy,v.checkOutBy,v.excusedBy,v.reason]));
   if(kind==="visit-export")return {ok:true,status:"READY",filename:"stem-lab-sandbox-visits-"+month+".csv",csv:visitCsv()};
   const unknown=finance?members.filter(x=>!["verified","pending","not_started","not_submitted"].includes(x.paymentStatus)).length:null;
   const verifiedMinor=finance?charges.filter(c=>c.status==="verified").reduce((n,c)=>n+c.amountMinor,0):null;
   const summary={coverage:finance?(unknown||deposits(s).some(x=>x.month===month&&x.status!=="settled")||financeRows.some(x=>x.status==="review_required")?"partial":"known-ledger-only"):"unavailable",knownVerifiedMembershipMinor:verifiedMinor,unknownStudents:unknown,netRevenue:null,depositReceivedMinor:finance?financeRows.filter(x=>x.type==="deposit-paid"&&x.status==="recorded").reduce((n,x)=>n+x.amountMinor,0):null,cashRefundRecordedMinor:finance?financeRows.filter(x=>x.type==="deposit-refund-paid").reduce((n,x)=>n+x.amountMinor,0):null,unresolvedDepositAttempts:finance?deposits(s).filter(x=>x.month===month&&x.status!=="settled").length:null};
   if(kind==="finance-export")return {ok:true,status:"READY",filename:"stem-lab-sandbox-ledger-"+month+".csv",summary,csv:csv(["Student","Student ID","Reference","Type","Evidence status","Recorded date (MYT)","Amount MYR","Environment"],financeRows.map(x=>[x.student,x.childId,x.reference,x.type,x.status,myt(x.at),money(x.amountMinor),"sandbox"]))};
   return {ok:true,status:"READY",month,asOf:now,members,summary,visits:visitRows.length,financeRows:finance?financeRows:[]};
  }catch{return fail("REPORT_UNAVAILABLE");}
 };
}
