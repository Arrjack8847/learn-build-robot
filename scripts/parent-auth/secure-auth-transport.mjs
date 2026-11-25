// Private server-only helpers for J2. No public OTP endpoint in this module.
// Requires durable challenge CAS, abuse limits and verified session persistence.
// Never substitute the Resend API key for the independent authentication secret.
import {createHmac,randomBytes,randomInt,timingSafeEqual} from "node:crypto";
const normalizedEmail=x=>typeof x==="string"?x.trim().toLowerCase():"";
export function createAuthCrypto(env){
  if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production")throw Error("PREVIEW_ONLY");
  const secret=env.PARENT_AUTH_SECRET;
  if(typeof secret!=="string"||!/^[a-fA-F0-9]{64}$/.test(secret))throw Error("AUTH_SECRET_REQUIRED");
  const key=Buffer.from(secret,"hex");
  if(new Set(key).size<8)throw Error("WEAK_AUTH_SECRET");
  const digest=(purpose,parts)=>createHmac("sha256",key).update(JSON.stringify([purpose,...parts])).digest("hex");
  return {
    identityDigest:(kind,email)=>digest("identity/v1",[kind,normalizedEmail(email)]),
    codeDigest:(identity,challenge,code)=>digest("otp/v1",[identity,challenge,code]),
    sessionDigest:token=>digest("session/v1",[token]),
    sixDigits:()=>String(randomInt(0,1000000)).padStart(6,"0"),
    newVersion:()=>randomBytes(16).toString("hex"),
    sessionToken:()=>randomBytes(32).toString("base64url"),
    constantTimeEqual:(a,b)=>typeof a==="string"&&typeof b==="string"&&/^[a-f0-9]{64}$/.test(a)&&/^[a-f0-9]{64}$/.test(b)&&timingSafeEqual(Buffer.from(a,"hex"),Buffer.from(b,"hex"))
  };
}
export function createTestOtpMailer(env,request=fetch){
  if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||!env.RESEND_API_KEY?.trim()||env.RESEND_FROM_EMAIL!=="onboarding@resend.dev")throw Error("TEST_MAILER_NOT_CONFIGURED");
  const recipient=normalizedEmail(env.RESEND_TEST_RECIPIENT);
  if(!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(recipient)||recipient.length>254)throw Error("TEST_RECIPIENT_REQUIRED");
  return {async sendParentCode(email,code,ttlMs,challengeId){
    // Never send to an address supplied by a client unless it matches the
    // explicitly configured development recipient. Do not mount before rate limits.
    if(normalizedEmail(email)!==recipient||typeof code!=="string"||!/^\d{6}$/.test(code)||ttlMs!==300000||typeof challengeId!=="string"||!/^[a-f0-9]{32}$/.test(challengeId))throw Error("TEST_OTP_NOT_ALLOWED");
    try{
      const r=await request("https://api.resend.com/emails",{
        method:"POST",headers:{Authorization:"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json","Idempotency-Key":"stem-parent-otp-"+challengeId},
        body:JSON.stringify({from:"BE STEM READY <onboarding@resend.dev>",to:[recipient],subject:"Your STEM Makers Lab test verification code",text:"Your development verification code is "+code+". It expires in five minutes. Do not share it. This is a private test account, not a live family account."}),
        redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)
      });
      if(!r.ok)throw Error("DELIVERY_UNCONFIRMED");
      const body=await r.json();
      if(typeof body?.id!=="string"||!body.id)throw Error("DELIVERY_UNCONFIRMED");
      return true;
    }catch{throw Error("DELIVERY_UNCONFIRMED");}
  }};
}
