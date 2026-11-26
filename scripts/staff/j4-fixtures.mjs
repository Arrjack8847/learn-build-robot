// J4 only. Fictional records; no dependency on any other journey or provider.
export function createJ4Fixtures(day="2026-11-26"){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(day))throw Error("INVALID_DAY");
 const names=["Demo Ada","Demo Ben","Demo Cora","Demo Dan","Demo Eva","Demo Finn","Demo Gia"];
 const states=["active","inactive","pending","expired","active","inactive","active"];
 const students=names.map((name,i)=>({studentId:`qa-j4-student-${i+1}`,payerId:`qa-j4-payer-${[1,1,2,3,4,5,5][i]}`,name,birthYear:2014+i%5,registeredAt:"2026-10-01",membershipStatus:states[i],checkInStatus:i===0?"checked-in":"not-checked-in",level:i===6?3:1,latestActivity:i===6?day:null}));
 const memberships=students.map((s,i)=>({membershipId:`qa-j4-member-${i+1}`,studentId:s.studentId,studentName:s.name,status:s.membershipStatus,activatedAt:[0,3,4,6].includes(i)?"2026-10-01":null,validUntil:i===3?"2026-10-31":[0,4,6].includes(i)?"2026-12-31":null,renewalStatus:i===4?"simulated-renewal":i===2?"failed":"not-due",subscriptionStatus:i===3?"expired":i===2?"failed":"fixture"}));
 const payments=[0,2,4,5,6].map((n,i)=>({paymentId:`qa-j4-payment-${i+1}`,providerPaymentId:null,studentId:students[n].studentId,purpose:n===5?"deposit":"membership",amountMinor:n===5?5000:4200,currency:"SGD",status:n===2?"failed":"simulated-success",paidAt:n===2?null:day,billingPeriod:n===5?null:"2026-11",subscriptionRef:null,refundStatus:"none",evidenceType:"fixture"}));
 const deposits=payments.filter(p=>p.purpose==="deposit").map(p=>({paymentId:p.paymentId,studentId:p.studentId,bookingId:"qa-j4-booking-6",amountMinor:p.amountMinor,currency:p.currency,status:p.status,refundStatus:p.refundStatus,disposition:"policy-not-approved",evidenceType:"fixture",paidAt:p.paidAt}));
 const attendance=students.map((s,i)=>({bookingId:`qa-j4-booking-${i+1}`,studentId:s.studentId,sessionDate:day,status:i===0?"attended":"booked",checkInAt:i===0?day+"T09:00:00+08:00":null,checkOutAt:null,staffId:i===0?"qa-j4-staff-2":null}));
 const progress=students.map((s,i)=>({studentId:s.studentId,level:s.level,completedLessons:i===6?24:0,completedBuilds:i===6?18:0,quizCompleted:i===6?8:0,quizResults:i===6?"8 completed, 7 passed":"None",challengeResults:i===6?"Levels 1–2 passed":"None",levelCompletion:i===6?"2 of 6":"0 of 6",latestActivity:s.latestActivity}));
 const staff=["admin","staff","finance"].map((role,i)=>({staffId:`qa-j4-staff-${i+1}`,displayName:`Demo ${role}`,role,accountStatus:"active",accountType:"staff-test",authVersion:"v1"}));
 return {students,memberships,payments,deposits,attendance,progress,staff,audit:[],sessions:[],attempts:[],codes:[]};
}

export function createFixtureReadStore(snapshot,now=Date.now()){
 const keys={students:"studentId",memberships:"membershipId",payments:"paymentId",deposits:"paymentId",attendance:"bookingId",checkins:"bookingId",progress:"studentId",staff:"staffId",audit:"auditId"};
 const dateFields={payments:"paidAt",deposits:"paidAt",attendance:"sessionDate",audit:"occurredAt"};
 return {
  async list({resource,page,pageSize,filters,sort,direction}){
   if(!Object.hasOwn(keys,resource))throw Error("UNKNOWN_RESOURCE");
   const students=new Map(snapshot.students.map(s=>[s.studentId,s]));
   const source=resource==="checkins"?snapshot.attendance.map(b=>{const latest=snapshot.codes.filter(c=>c.bookingId===b.bookingId).at(-1);return {bookingId:b.bookingId,studentId:b.studentId,studentName:students.get(b.studentId)?.name??null,membershipStatus:students.get(b.studentId)?.membershipStatus??null,bookingStatus:b.status,sessionDate:b.sessionDate,status:latest?(latest.status==="active"&&latest.expiresAt<=now?"expired":latest.status):"not-issued",issuedAt:latest?.issuedAt??null,expiresAt:latest?.expiresAt??null,attempts:latest?.attempts??0};}):snapshot[resource].map(row=>["attendance","payments","deposits","progress"].includes(resource)?{...row,studentName:students.get(row.studentId)?.name??null,...(resource==="attendance"?{membershipStatus:students.get(row.studentId)?.membershipStatus??null}:{})}:row);
   const rows=source.filter(row=>Object.entries(filters).every(([key,value])=>{
    if(key==="name")return row.name.toLowerCase().includes(value.toLowerCase());
    if(key==="from"||key==="to"){const raw=row[dateFields[resource]];if(raw==null)return false;const date=typeof raw==="number"?new Date(raw+8*3600000).toISOString().slice(0,10):String(raw).slice(0,10);return key==="from"?date>=value:date<=value;}
    return row[key]===value;
   }));
   const cmp=(a,b)=>a===b?0:a==null?1:b==null?-1:typeof a==="number"&&typeof b==="number"?a-b:String(a).localeCompare(String(b));
   rows.sort((a,b)=>(direction==="desc"?-1:1)*cmp(a[sort],b[sort])||cmp(a[keys[resource]],b[keys[resource]]));
   return {total:rows.length,rows:rows.slice((page-1)*pageSize,page*pageSize)};
  },
  async getStudent({studentId}){return snapshot.students.find(s=>s.studentId===studentId)??null;}
 };
}

export function calculateFixtureOverview(snapshot,role,day){
 if(!["admin","staff","finance"].includes(role))throw Error("INVALID_ROLE");
 const result={};
 if(role!=="finance"){
  result.students=snapshot.students.length;
  result.todayAttendance=snapshot.attendance.filter(a=>a.sessionDate===day&&a.status==="attended").length;
  result.checkedIn=snapshot.attendance.filter(a=>a.sessionDate===day&&a.status==="attended"&&!a.checkOutAt).length;
  result.currentlyLearning=Array.isArray(snapshot.learningVisits)?snapshot.learningVisits.filter(v=>v.sessionDate===day&&v.status==="learning"&&snapshot.attendance.some(b=>b.bookingId===v.bookingId&&b.studentId===v.studentId&&b.status==="attended"&&!b.checkOutAt)).length:null;
  result.todayBookings=snapshot.attendance.filter(a=>a.sessionDate===day&&a.status==="booked").length;
  result.todayNoShows=snapshot.attendance.filter(a=>a.sessionDate===day&&a.status==="no-show").length;
 }
 result.activeMemberships=snapshot.memberships.filter(m=>m.status==="active").length;
 result.inactiveMemberships=snapshot.memberships.filter(m=>m.status==="inactive").length;
 result.expiredMemberships=snapshot.memberships.filter(m=>m.status==="expired").length;
 result.pendingMemberships=snapshot.memberships.filter(m=>m.status==="pending").length;
 const horizon=new Date(day+"T00:00:00Z");horizon.setUTCDate(horizon.getUTCDate()+30);const last=horizon.toISOString().slice(0,10);result.upcomingRenewals=snapshot.memberships.filter(m=>m.status==="active"&&m.validUntil>=day&&m.validUntil<=last).length;
 if(role!=="staff"){
  result.failedPayments=snapshot.payments.filter(p=>p.status==="failed").length;
  result.pendingPayments=snapshot.payments.filter(p=>p.status==="pending").length;
  result.simulatedPayments=snapshot.payments.filter(p=>p.status==="simulated-success").length;
  result.simulatedDeposits=snapshot.deposits.filter(p=>p.status==="simulated-success").length;
 }
 return result;
}
