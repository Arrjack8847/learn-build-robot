// Server-only Resend transport for a verified fictional payment outbox entry.
// Not mounted or scheduled. Caller must obtain committed ledger/outbox records
// from the authoritative transaction adapter, then persist delivery outcome.
import {createHash} from "node:crypto";
export function createSandboxPaymentMailer(env,request=fetch){
  if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.VERCEL_GIT_COMMIT_REF!=="feat/wix-lms-integration-20261125"||!env.RESEND_API_KEY?.trim()||env.RESEND_FROM_EMAIL!=="onboarding@resend.dev")throw Error("PREVIEW_MAILER_REQUIRED");
  const recipient=env.RESEND_TEST_RECIPIENT?.trim().toLowerCase();
  if(!recipient||recipient.length>254||!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(recipient))throw Error("TEST_RECIPIENT_REQUIRED");
  const id=v=>typeof v==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(v);
  async function sendCommitted({job,payment,child,parent}){
    const failed=job?.notificationType==="payment_failed";
    const expected=failed?"failed":"paid";
    if(!job||!["payment_confirmed","payment_failed"].includes(job.notificationType)||job.environment!=="sandbox"||job.status!=="sending"||!payment||payment.environment!=="sandbox"||payment.status!==expected||payment.amountMinor!==36000||payment.currency!=="MYR"||!id(payment.id)||!id(payment.providerPaymentId)||payment.id!==job.paymentId||payment.childId!==job.childId||payment.parentId!==job.parentId||!Number.isSafeInteger(payment.verifiedAt)||payment.verifiedAt<=0||!/^\d{4}-(0[1-9]|1[0-2])$/.test(payment.coveredMonth??"")||job.deduplicationKey!=="sandbox:"+payment.id+":"+expected||!child||child.id!==job.childId||child.parentId!==job.parentId||typeof child.name!=="string"||child.name.length<1||child.name.length>100||!parent||parent.id!==job.parentId||typeof parent.email!=="string"||!/^[^\s@]+@example\.invalid$/i.test(parent.email))throw Error("UNVERIFIED_NOTIFICATION");
    const key="stem-sandbox-payment-"+createHash("sha256").update(job.deduplicationKey).digest("hex");
    const subject=failed?"SANDBOX — STEM Makers Lab payment failed":"SANDBOX — STEM Makers Lab payment confirmed";
    const text=["Private sandbox test — no real payment or family membership","Fictional parent: "+parent.email,"Child: "+child.name,"Membership month: "+payment.coveredMonth,"Amount: RM360.00","HitPay reference: "+payment.providerPaymentId,failed?"Payment unsuccessful.":"Sandbox payment verified."].join("\n");
    const r=await request("https://api.resend.com/emails",{method:"POST",headers:{Authorization:"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json","Idempotency-Key":key},body:JSON.stringify({from:"BE STEM READY <onboarding@resend.dev>",to:[recipient],subject,text}),redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});
    if(!r.ok)throw Error("DELIVERY_UNCONFIRMED");
    const result=await r.json();
    if(typeof result?.id!=="string"||!result.id)throw Error("DELIVERY_UNCONFIRMED");
    return {accepted:true,providerMessageId:result.id};
  }
  return {sendCommitted};
}
