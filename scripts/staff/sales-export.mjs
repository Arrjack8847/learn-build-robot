// J4 export formatter: accepts a reconciled authoritative ledger only.
// The mall's final column format and refund convention require approval.
const isMonth=v=>typeof v==="string"&&/^\d{4}-(0[1-9]|1[0-2])$/.test(v);
const csvCell=value=>{
  let s=String(value);
  // Protect against formula injection, including whitespace before a formula.
  if(/^[\s\u0000-\u001f]*[=+\-@]/.test(s)||/^[\t\r\n]/.test(s))s="'"+s;
  return '"'+s.replace(/"/g,'""')+'"';
};
const money=n=>(n<0?"-":"")+Math.floor(Math.abs(n)/100)+"."+String(Math.abs(n)%100).padStart(2,"0");
export function formatMonthlySales(ledger,period){
  if(!isMonth(period)||ledger?.currency!=="MYR"||ledger.period!==period||ledger.reconciled!==true||!Array.isArray(ledger.rows))throw Error("UNRECONCILED_LEDGER");
  const ids=new Set();let gross=0,refunds=0;const lines=[["Receipt ID","Transaction date (MYT)","Source","Type","Amount (MYR)","Currency"].map(csvCell).join(",")];
  for(const row of ledger.rows){
    if(!row||typeof row.receiptId!=="string"||!row.receiptId.trim()||row.receiptId.length>128||ids.has(row.receiptId)||!["hitpay","desk"].includes(row.source)||!["sale","refund"].includes(row.type)||row.status!=="settled"||!Number.isSafeInteger(row.amountMinor)||row.amountMinor<=0||typeof row.localDate!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(row.localDate)||!row.localDate.startsWith(period+"-"))throw Error("INVALID_LEDGER_ROW");
    const d=new Date(row.localDate+"T00:00:00Z");
    if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==row.localDate)throw Error("INVALID_DATE");
    ids.add(row.receiptId);
    if(row.type==="sale")gross+=row.amountMinor;else refunds+=row.amountMinor;
    if(!Number.isSafeInteger(gross)||!Number.isSafeInteger(refunds))throw Error("UNSAFE_TOTAL");
    const sign=row.type==="refund"?-1:1;
    lines.push([csvCell(row.receiptId),csvCell(row.localDate),csvCell(row.source),csvCell(row.type),money(sign*row.amountMinor),csvCell("MYR")].join(","));
  }
  return {filename:"stem-lab-sales-"+period+".csv",currency:"MYR",grossMinor:gross,refundMinor:refunds,netMinor:gross-refunds,rows:ids.size,csv:lines.join("\r\n")+"\r\n"};
}
