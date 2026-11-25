// Private development-only trial, using a verified OTP test session.
import {createPreviewOtp} from "../../scripts/parent-auth/preview-otp.mjs";
import {createWixStore} from "../../scripts/parent-auth/wix-store.mjs";
import {createAuthCrypto,createTestOtpMailer} from "../../scripts/parent-auth/secure-auth-transport.mjs";
import {createSandboxTransport} from "../../scripts/hitpay/j3-node-transport.mjs";
import {createSandboxTrial} from "../../scripts/hitpay/sandbox-trial.mjs";
const branch="feat/wix-lms-integration-20261125";
const cookie="__Host-bsr-parent-test=";
export async function handleSandboxCheckout(request:Request,env:NodeJS.ProcessEnv):Promise<Response>{
  const json=(status:number,data:object)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"}});
  if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.VERCEL_GIT_COMMIT_REF!==branch||env.HITPAY_API_BASE_URL!=="https://api.sandbox.hit-pay.com")return json(404,{ok:false,status:"PREVIEW_ONLY"});
  const expected=env.VERCEL_URL?"https://"+env.VERCEL_URL:"";
  const url=new URL(request.url);
  if(request.method!=="POST"||!expected||url.origin!==expected||request.headers.get("origin")!==expected||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-sandbox-checkout")!=="1"||url.search)return json(403,{ok:false,status:"INVALID_REQUEST"});
  const action=url.pathname.split("/").at(-1);
  if(action!=="status"&&action!=="open")return json(404,{ok:false,status:"NOT_FOUND"});
  if(request.body!==null)return json(400,{ok:false,status:"INVALID_REQUEST"});
  try{
    const parts=(request.headers.get("cookie")??"").split(";").map(x=>x.trim()).filter(x=>x.startsWith(cookie));
    const token=parts.length===1?parts[0].slice(cookie.length):"";
    const recipient=env.RESEND_TEST_RECIPIENT?.trim().toLowerCase();
    const planId=env.HITPAY_SANDBOX_PLAN_ID;
    if(!recipient||!planId||!(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(planId)))return json(503,{ok:false,status:"CONFIGURATION_REQUIRED"});
    const store=createWixStore(env),crypto=createAuthCrypto(env);
    const otp=createPreviewOtp({store,crypto,mailer:createTestOtpMailer(env),clock:{now:()=>Date.now()},recipient});
    if((await otp.status(token)).status!=="VERIFIED")return json(401,{ok:false,status:"LOGIN_REQUIRED"});
    const provider=createSandboxTransport({...env,HITPAY_SANDBOX_RETURN_URL:expected+"/parent/payment-return"});
    const trial=createSandboxTrial({store,provider,planId,newVersion:crypto.newVersion,clock:{now:()=>Date.now()}});
    const result=action==="status"?await trial.status():await trial.open();
    return json(result.ok?200:503,result);
  }catch{return json(503,{ok:false,status:"SERVICE_UNAVAILABLE"});}
}
