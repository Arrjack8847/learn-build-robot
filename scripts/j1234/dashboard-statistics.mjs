// Aggregate only the complete approved directory, never a filtered page or J4 fixture.
import {membershipProcessingEnabled} from "../j123/membership-provider.mjs";
import {attendanceEnabled,localDay} from "./attendance.mjs";
import {validStudent,validProvider} from "../j123/billing-records.mjs";
const memberStates=["active","payment_pending","inactive","expired","verification_required","unavailable"];
const paymentStates=["verified","review_required","verification_required","pending","not_started","not_submitted","unavailable"];
const attendanceStates=["not_booked","booked","attended","checked_out","no_show","excused","verification_required","unavailable"];
const count=(keys,rows,key)=>Object.fromEntries(keys.map(k=>[k,rows.filter(r=>key(r)===k).length]));
const coverage=(enabled,unknown)=>!enabled?"unavailable":unknown?"partial":"complete";
export function buildDashboardStatistics({env,rows,asOf}){
 if(!Number.isSafeInteger(asOf)||asOf<=0||!Array.isArray(rows)||rows.length>250)throw Error("INVALID_DASHBOARD_SNAPSHOT");
 const day=localDay(asOf),month=day.slice(0,7),ids=new Set(),charges=new Set();
 const billingReady=env.J1234_BILLING_READ_ENABLED==="1"&&membershipProcessingEnabled(env),attendanceReady=attendanceEnabled(env);
 let verifiedCount=0,verifiedMinor=0,monthCount=0,monthMinor=0,heldCount=0,heldMinor=0,attended=0,bookings=0,open=0;
 for(const r of rows){
  if(!validStudent(r.studentId)||ids.has(r.studentId)||!["ready","pin-setup-required"].includes(r.registrationStatus)||!memberStates.includes(r.membershipStatus)||!paymentStates.includes(r.paymentStatus)||!attendanceStates.includes(r.attendance?.attendanceStatus)||!Array.isArray(r.payments)||r.payments.length>2)throw Error("INVALID_DASHBOARD_ROW");
  ids.add(r.studentId);
  if(!billingReady&&(r.membershipStatus!=="unavailable"||r.paymentStatus!=="unavailable"||r.payments.length))throw Error("BILLING_GATE_MISMATCH");
  if(!attendanceReady&&r.attendance.attendanceStatus!=="unavailable")throw Error("ATTENDANCE_GATE_MISMATCH");
  if(r.payments.length&& !["verified","review_required"].includes(r.paymentStatus))throw Error("PAYMENT_STATUS_MISMATCH");
  for(const p of r.payments){
   if(!validProvider(p.paymentId)||charges.has(p.paymentId)||p.studentId!==r.studentId||p.currency!=="MYR"||p.amountMinor!==36000||p.evidenceType!=="hitpay-sandbox"||p.paymentMethod!=="touch_n_go"||!Number.isSafeInteger(p.paidAt)||p.paidAt<=0||p.paidAt>asOf||p.status!==r.paymentStatus)throw Error("INVALID_DASHBOARD_PAYMENT");
   charges.add(p.paymentId);
   if(p.status==="review_required"){heldCount++;heldMinor+=p.amountMinor;continue;}
   verifiedCount++;verifiedMinor+=p.amountMinor;
   if(localDay(p.paidAt).slice(0,7)===month){monthCount++;monthMinor+=p.amountMinor;}
  }
  const a=r.attendance;
  if(["booked","attended","checked_out","no_show","excused"].includes(a.attendanceStatus)){
   if(a.day!==day||!validProvider(a.bookingId))throw Error("INVALID_DASHBOARD_BOOKING");
   bookings++;
   if(["attended","checked_out"].includes(a.attendanceStatus)){attended++;if(a.attendanceStatus==="attended")open++;}
  }
 }
 const membership=count(memberStates,rows,r=>r.membershipStatus),payment=count(paymentStates,rows,r=>r.paymentStatus),attendance=count(attendanceStates,rows,r=>r.attendance.attendanceStatus);
 const memberUnknown=membership.verification_required+membership.unavailable;
 const paymentUnknown=payment.verification_required+payment.unavailable+payment.review_required;
 const attendanceUnknown=attendance.verification_required+attendance.unavailable;
 const ms=coverage(billingReady,memberUnknown),ps=coverage(billingReady,paymentUnknown),ats=coverage(attendanceReady,attendanceUnknown);
 return {scope:"approved_j1234_test_dataset",asOf,day,month,timeZone:"Asia/Kuala_Lumpur",registration:{total:rows.length,pinReady:rows.filter(r=>r.registrationStatus==="ready").length,pinSetupRequired:rows.filter(r=>r.registrationStatus==="pin-setup-required").length},
 membership:{coverage:ms,counts:billingReady?membership:null,activeTotal:ms==="complete"?membership.active:null,unknownStudents:billingReady?memberUnknown:null},
 payments:{coverage:ps,currency:"MYR",evidenceType:"hitpay-sandbox",studentCounts:billingReady?payment:null,unknownStudents:billingReady?paymentUnknown:null,knownVerifiedCount:billingReady?verifiedCount:null,knownVerifiedMinor:billingReady?verifiedMinor:null,knownMonthVerifiedCount:billingReady?monthCount:null,knownMonthVerifiedMinor:billingReady?monthMinor:null,heldCount:billingReady?heldCount:null,heldMinor:billingReady?heldMinor:null,totalVerifiedMinor:ps==="complete"?verifiedMinor:null,monthVerifiedMinor:ps==="complete"?monthMinor:null,netRevenue:null,depositMinor:null},
 attendance:{coverage:ats,counts:attendanceReady?attendance:null,unknownStudents:attendanceReady?attendanceUnknown:null,knownBookings:attendanceReady?bookings:null,knownAttended:attendanceReady?attended:null,knownCheckedIn:attendanceReady?open:null,totalBookings:ats==="complete"?bookings:null,totalAttended:ats==="complete"?attended:null,currentCheckedIn:ats==="complete"?open:null,attendanceRate:ats==="complete"&&bookings>0?attended/bookings:null},
 learning:{coverage:"unavailable",currentlyLearning:null,completedProjects:null,levelDistribution:null}};
}
