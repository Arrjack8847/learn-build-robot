// Preview-only, real email delivery diagnostic. No auth/session is granted.
// Only server-side environment variables are used. Never expose recipient or key.
type Config = { VERCEL_ENV?: string; VERCEL_TARGET_ENV?: string; VERCEL_URL?: string; RESEND_API_KEY?: string; RESEND_FROM_EMAIL?: string; RESEND_TEST_RECIPIENT?: string };
export async function sendTestEmail(env:Config, request:typeof fetch=fetch):Promise<{ok:boolean;status:string}> {
  if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production")return {ok:false,status:"PREVIEW_ONLY"};
  const recipient=env.RESEND_TEST_RECIPIENT?.trim();
  if(!env.RESEND_API_KEY?.trim()||env.RESEND_FROM_EMAIL!=="onboarding@resend.dev"||!recipient||recipient.length>254||! /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(recipient))return {ok:false,status:"CONFIGURATION_REQUIRED"};
  // Identical body and a fixed idempotency key across deployments for this diagnostic.
  // Resend retains the key for 24 hours; duplicate clicks do not send more emails.
  // Preview access is restricted by the existing Vercel project protection.
  try {
    const response=await request("https://api.resend.com/emails",{
      method:"POST",headers:{Authorization:"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json","Idempotency-Key":"stem-makers-lab-preview-delivery-check-v1"},
      body:JSON.stringify({from:"BE STEM READY <onboarding@resend.dev>",to:[recipient],subject:"BE STEM READY — email delivery test",text:"Your STEM Makers Lab development email delivery is working. This is a controlled test from the preview, not a login verification code or a payment confirmation. No account or membership was created."}),
      redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)
    });
    if(!response.ok)return {ok:false,status:"DELIVERY_REQUEST_FAILED"};
    const data=await response.json();
    if(typeof data?.id!=="string"||!data.id)return {ok:false,status:"DELIVERY_UNCONFIRMED"};
    return {ok:true,status:"ACCEPTED_BY_RESEND"};
  }catch{return {ok:false,status:"DELIVERY_REQUEST_FAILED"};}
}
export async function handleEmailTest(request:Request,env:Config):Promise<Response> {
  const json=(status:number,data:object)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
  if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production")return json(404,{ok:false,status:"PREVIEW_ONLY"});
  if(request.method!=="POST")return json(405,{ok:false,status:"METHOD_NOT_ALLOWED"});
  const expected=env.VERCEL_URL?"https://"+env.VERCEL_URL:"";
  if(!expected||new URL(request.url).origin!==expected||request.headers.get("origin")!==expected||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-email-test")!=="1")return json(403,{ok:false,status:"INVALID_REQUEST"});
  const result=await sendTestEmail(env);
  return json(result.ok?200:503,result);
}
