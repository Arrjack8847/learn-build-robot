// Standalone J3 test centre: process-local fictional data only. No network or persistent store.
// Never mount these simulated payment controls in a real student, payer, or production route.
export function createJ3FixtureCentre({clock=()=>Date.now()}={}){
 const payers=Array.from({length:5},(_,i)=>Object.freeze({id:"fixture-payer-"+(i+1),email:"payer"+(i+1)+"@example.invalid"}));
 const students=payers.flatMap(p=>[1,2].map(n=>Object.freeze({id:p.id+"-student-"+n,payerId:p.id,name:"Test student "+p.id.slice(-1)+"."+n})));
 const sessions=new WeakMap(),attempts=new Map(),events=new Map(),ledger=new Map(),memberships=new Map(),outbox=new Map();
 const fail=error=>({ok:false,error});
 const safeId=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,80}$/.test(x);
 const now=()=>{const t=clock();if(!Number.isSafeInteger(t)||t<=0)throw Error("INVALID_FIXTURE_CLOCK");return t};
 const copy=x=>JSON.parse(JSON.stringify(x));
 const own=(session,studentId)=>{const s=sessions.get(session);return s&&s.kind==="payer"&&students.some(c=>c.id===studentId&&c.payerId===s.id)?s:null};
 const amount={membership:36000,deposit:5000};
 function openSession(kind,id){
  if(!["payer","student"].includes(kind)||!(kind==="payer"?payers:students).some(x=>x.id===id))throw Error("UNKNOWN_FIXTURE");
  const token=Object.freeze({});sessions.set(token,{kind,id});return token;
 }
 function closeSession(token){return sessions.delete(token)}
 function listStudents(token){const s=sessions.get(token);if(!s||s.kind!=="payer")return fail("UNAUTHORIZED");return {ok:true,students:copy(students.filter(x=>x.payerId===s.id))}}
 function startCheckout(token,input){
  if(!input||typeof input!=="object"||Array.isArray(input)||Object.keys(input).some(k=>!["studentId","kind","requestKey","bookingId"].includes(k)))return fail("INVALID_REQUEST");
  const {studentId,kind,requestKey,bookingId}=input;
  const p=own(token,studentId);if(!p)return fail("UNAUTHORIZED");
  if(!Object.hasOwn(amount,kind)||!safeId(requestKey)||(kind==="deposit"&&!safeId(bookingId))||(kind==="membership"&&bookingId!==undefined))return fail("INVALID_REQUEST");
  const key=[p.id,studentId,kind,requestKey].join(":");
  const scope=[p.id,studentId,kind,kind==="deposit"?bookingId:"monthly"].join(":");
  if(attempts.has(key)){const a=attempts.get(key);return a.scope===scope?{ok:true,attempt:copy(a),duplicate:true}:fail("REQUEST_CONFLICT")}
  const previous=[...attempts.values()].find(a=>a.scope===scope&&["pending","paid","renewal_failed"].includes(a.status));
  if(previous)return {ok:true,attempt:copy(previous),duplicate:true};
  const a={id:key,scope,payerId:p.id,studentId,kind,bookingId:bookingId??null,amountMinor:amount[kind],currency:"MYR",method:"touch_n_go",mode:"fixture_only",status:"pending",createdAt:now()};
  attempts.set(key,a);return {ok:true,attempt:copy(a),duplicate:false};
 }
 // Internal simulation only. No claim of provider verification, no real entitlement.
 function simulate(token,input){
  if(!input||typeof input!=="object"||Array.isArray(input)||Object.keys(input).some(k=>!["attemptId","eventId","paymentId","outcome","cycle"].includes(k)))return fail("INVALID_FIXTURE_EVENT");
  const {attemptId,eventId,paymentId,outcome,cycle=1}=input;
  const a=attempts.get(attemptId);
  if(!a||!own(token,a.studentId))return fail("UNAUTHORIZED");
  if(!safeId(eventId)||!safeId(paymentId)||!["paid","failed"].includes(outcome)||![1,2].includes(cycle)||(a.kind==="deposit"&&cycle!==1))return fail("INVALID_FIXTURE_EVENT");
  const fp=JSON.stringify([attemptId,paymentId,outcome,cycle]);
  if(events.has(eventId))return events.get(eventId)===fp?{ok:true,duplicate:true}:fail("EVENT_CONFLICT");
  const existing=ledger.get(paymentId);
  if(existing)return existing.fingerprint===fp?{ok:true,duplicate:true}:fail("PAYMENT_CONFLICT");
  const prior=[...ledger.values()].filter(x=>x.attemptId===attemptId&&x.outcome==="paid");
  if(prior.some(x=>x.cycle===cycle))return fail("DUPLICATE_CYCLE");
  if(cycle===1&&a.status!=="pending")return fail("ATTEMPT_CLOSED");
  if(cycle===2&&(a.kind!=="membership"||!prior.some(x=>x.cycle===1)))return fail("INITIAL_PAYMENT_REQUIRED");
  const t=now(),current=memberships.get(a.studentId);
  if(cycle===2&&t<(current?.validUntil??Infinity))return fail("RENEWAL_NOT_DUE");
  const row={attemptId,paymentId,eventId,payerId:a.payerId,studentId:a.studentId,kind:a.kind,amountMinor:a.amountMinor,currency:"MYR",outcome,cycle,mode:"fixture_only",at:t,fingerprint:fp};
  const endDate=new Date(t);const day=endDate.getUTCDate();endDate.setUTCDate(1);endDate.setUTCMonth(endDate.getUTCMonth()+1);const limit=new Date(Date.UTC(endDate.getUTCFullYear(),endDate.getUTCMonth()+1,0)).getUTCDate();endDate.setUTCDate(Math.min(day,limit));
  events.set(eventId,fp);ledger.set(paymentId,row);a.status=outcome==="paid"?"paid":cycle===2?"renewal_failed":"failed";
  if(a.kind==="membership"&&outcome==="paid")memberships.set(a.studentId,{studentId:a.studentId,validFrom:t,validUntil:endDate.getTime(),cycle,mode:"fixture_only"});
  outbox.set(paymentId,{paymentId,studentId:a.studentId,kind:a.kind,outcome,mode:"fixture_only",delivery:"not_sent"});
  return {ok:true,duplicate:false,attempt:copy(a)};
 }
 function studentProfile(token){
  const s=sessions.get(token);if(!s||s.kind!=="student")return fail("UNAUTHORIZED");
  const m=memberships.get(s.id),t=now();
  return {ok:true,student:copy(students.find(x=>x.id===s.id)),membershipStatus:m?(t<m.validUntil&&t>=m.validFrom?"simulated_active":"simulated_expired"):"inactive",membership:m?copy(m):null,verifiedLearningEligibility:false,mode:"fixture_only"};
 }
 function payerReceipts(token,studentId){
  if(!own(token,studentId))return fail("UNAUTHORIZED");
  return {ok:true,receipts:copy([...ledger.values()].filter(x=>x.studentId===studentId).map(({fingerprint,...x})=>x)),notifications:copy([...outbox.values()].filter(x=>x.studentId===studentId))};
 }
 return Object.freeze({fixtures:()=>copy({payers,students}),openSession,closeSession,listStudents,startCheckout,simulate,studentProfile,payerReceipts});
}
