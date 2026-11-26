// Fictional reporting only. Never classify these amounts as actual, settled or reconciled sales.
export function createJ4SimulatedReport(snapshot,month){
 if(snapshot?.mode!=="j4-fixture-v1"||typeof month!=="string"||!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))return {ok:false,status:"INVALID_INPUT"};
 const totals={},rows=[],ids=new Set();
 const date=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+"T00:00:00Z"))&&new Date(v+"T00:00:00Z").toISOString().slice(0,10)===v;
 for(const p of snapshot.payments){
  if(p.evidenceType!=="fixture"||typeof p.paymentId!=="string"||!/^qa-j4-payment-[0-9]+$/.test(p.paymentId)||ids.has(p.paymentId)||!Number.isSafeInteger(p.amountMinor)||p.amountMinor<0||!["membership","deposit"].includes(p.purpose)||!["SGD","MYR"].includes(p.currency)||p.providerPaymentId!=null)throw Error("INVALID_FIXTURE_PAYMENT");
  ids.add(p.paymentId);
  if(!["simulated-success","failed","pending"].includes(p.status)||(p.status==="simulated-success"?!date(p.paidAt):p.paidAt!==null))throw Error("INVALID_FIXTURE_PAYMENT_DATE");
  if(p.status!=="simulated-success"||p.paidAt.slice(0,7)!==month)continue;
  if(p.refundStatus!=="none")throw Error("UNSUPPORTED_FIXTURE_REFUND");
  const key=p.currency;
  totals[key]??={currency:key,membershipMinor:0,depositMinor:0};
  const field=p.purpose==="membership"?"membershipMinor":"depositMinor";
  totals[key][field]+=p.amountMinor;
  if(!Number.isSafeInteger(totals[key][field]))throw Error("TOTAL_OVERFLOW");
  rows.push({paymentId:p.paymentId,purpose:p.purpose,currency:p.currency,amountMinor:p.amountMinor,date:p.paidAt.slice(0,10)});
 }
 const csv=["environment,payment_id,purpose,currency,amount_minor,date",...rows.map(p=>["SIMULATED_ONLY",p.paymentId,p.purpose,p.currency,p.amountMinor,p.date].map(x=>'"'+String(x).replaceAll('"','""')+'"').join(","))].join("\r\n");
 return {ok:true,status:"READY",report:{month,fixture:true,totals:Object.values(totals),count:rows.length,csv,filename:"j4-SIMULATED-"+month+".csv"}};
}
