// J1 only: redacted, read-only infrastructure diagnostics. No emails, payments or mutations.
import {randomBytes} from "node:crypto";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {createAuthCrypto,openPreviewRecipients} from "../parent-auth/secure-auth-transport.mjs";
import {createStudentAuthCrypto} from "../student-auth/crypto.mjs";
import {isJ123Preview,j123InfrastructureStatus} from "../j123/infrastructure.mjs";
import {membershipProcessingEnabled} from "../j123/membership-provider.mjs";
const BRANCH="integration/j1-j2-20261126";
const PAGE="/dev/testing-centre",API="/api/dev/j1/readiness";
export function isJ1Preview(env){return env.VERCEL_ENV==="preview"&&env.VERCEL_TARGET_ENV!=="production"&&[BRANCH,"integration/j1-j2-j3-20261126"].includes(env.VERCEL_GIT_COMMIT_REF);}
const configured=v=>typeof v==="string"&&v.trim().length>0;
const states=new Set(["CONFIGURED","NOT_CONFIGURED","NOT_RUN","VERIFIED_READ_ONLY","READ_UNCONFIRMED","NOT_VERIFIED"]);
export async function getJ1Readiness(env,{probe=false,request=fetch}={}){
 if(!isJ1Preview(env))return null;
 const state=v=>v?"CONFIGURED":"NOT_CONFIGURED";
 const integrated=isJ123Preview(env),membershipGate=integrated&&membershipProcessingEnabled(env);
 let auth=false,db=false,studentAuth=false;
 try{createStudentAuthCrypto(env);studentAuth=true;}catch{}
 try{createAuthCrypto(env);auth=true;}catch{}
 let store;
 try{store=createWixStore(env,request);db=true;}catch{}
 let wixRead="NOT_RUN";
 if(probe&&db){
  try{
   // Random nonexistent QA parent ID. Never select real records, emit row values, or perform a write.
   const rows=await store.listFixtureChildren("qa-j2-"+randomBytes(32).toString("hex"));
   wixRead=rows.length===0?"VERIFIED_READ_ONLY":"READ_UNCONFIRMED";
  }catch{wixRead="READ_UNCONFIRMED";}
 }else if(!db)wixRead="NOT_CONFIGURED";
 return {
  preview:"CONFIGURED",
  wixConfiguration:state(db),wixRead,
  resendKey:state(configured(env.RESEND_API_KEY)),
  verifiedSenderConfiguration:state(env.PARENT_PREVIEW_VERIFIED_SENDER==="noreply@mail.bestemready.edu.my"),
  openEmailMode:state(openPreviewRecipients(env)),
  authSecret:state(auth),
  studentAuthSecret:state(studentAuth),
  studentAuthEnabled:state(env.STUDENT_AUTH_ENABLED==="true"),
  sandboxOrigin:state(env.HITPAY_API_URL==="https://api.sandbox.hit-pay.com"),
  sandboxCredentialIsolation:"NOT_VERIFIED",
  realEmailDelivery:"NOT_VERIFIED",
  genuineWebhookDelivery:"NOT_VERIFIED",
  ...(isJ123Preview(env)?{integratedIdentityConfiguration:state(j123InfrastructureStatus(env).authReady),integratedSandboxConfiguration:state(j123InfrastructureStatus(env).providerConfigured),integratedCheckoutConfiguration:state(j123InfrastructureStatus(env).checkoutReady),integratedMembershipGate:state(membershipGate),integratedWorkerGate:state(membershipGate&&env.J123_MEMBERSHIP_WORKER_ENABLED==="true"&&/^[a-f0-9]{64}$/.test(env.J123_MEMBERSHIP_WORKER_SECRET??"")&&![env.PARENT_AUTH_SECRET,env.STUDENT_AUTH_SECRET].some(v=>typeof v==="string"&&v.toLowerCase()===env.J123_MEMBERSHIP_WORKER_SECRET)),integratedReceiptGate:state(membershipGate&&env.J123_PAYMENT_EMAIL_ENABLED==="true"),integratedPeriodMapping:"NOT_VERIFIED",integratedLiveAcceptance:"NOT_VERIFIED"}:{})
 };
}
const labels={preview:"Development branch guard",wixConfiguration:"Wix development configuration",wixRead:"Wix authenticated runtime read probe",resendKey:"Resend API key present",verifiedSenderConfiguration:"Verified-domain sender configured",openEmailMode:"Open valid-email mode",authSecret:"Independent authentication secret",studentAuthSecret:"Independent student PIN/session secret",studentAuthEnabled:"Student authentication enabled",sandboxOrigin:"HitPay sandbox origin configured",sandboxCredentialIsolation:"HitPay credential isolation",realEmailDelivery:"New real inbox delivery acceptance",genuineWebhookDelivery:"Genuine sandbox webhook acceptance",integratedIdentityConfiguration:"J123 complete identity configuration",integratedSandboxConfiguration:"J123 sandbox and legacy-isolation configuration",integratedCheckoutConfiguration:"J123 checkout acceptance gates",integratedMembershipGate:"Membership reconciliation gate",integratedWorkerGate:"Trusted membership worker configuration",integratedReceiptGate:"Payment confirmation email gate",integratedPeriodMapping:"Genuine provider billing-period mapping",integratedLiveAcceptance:"End-to-end live acceptance"};
const captions={CONFIGURED:"Configured",NOT_CONFIGURED:"Missing / invalid",NOT_RUN:"Not run",VERIFIED_READ_ONLY:"Verified read-only",READ_UNCONFIRMED:"Read unconfirmed",NOT_VERIFIED:"Separate evidence required"};
const headers={"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex, nofollow","Referrer-Policy":"no-referrer","Content-Security-Policy":"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"};
const json=(status,data)=>new Response(JSON.stringify(data),{status,headers:{...headers,"Content-Type":"application/json; charset=utf-8"}});
function page(checks){
 const integrated=Object.hasOwn(checks,"integratedIdentityConfiguration");
 const heading=integrated?"J1 + J2 + J3 Private Testing Centre":"J1 + J2 Private Testing Centre";
 const note=integrated?"Live acceptance is deferred. Verify controlled inboxes, fictional students, signed sandbox events and billing evidence before enabling payment, membership or receipt gates. J4 and J5 are not integrated.":"Use student registration and student sign-in for live acceptance. Test only inboxes you control and fictional student details. Payments and learning access remain disconnected.";
 const rows=Object.entries(labels).filter(([key])=>Object.hasOwn(checks,key)).map(([key,label])=>{const value=states.has(checks[key])?checks[key]:"NOT_VERIFIED";return '<div class="row"><span>'+label+'</span><strong class="'+(value==="CONFIGURED"||value==="VERIFIED_READ_ONLY"?"ok":"pending")+'">'+captions[value]+'</strong></div>';}).join("");
 return new Response('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>J1 + J2 Private Testing Centre | BE STEM READY</title><style>*{box-sizing:border-box}body{margin:0;background:#f3faff;color:#132654;font:16px system-ui,sans-serif}main{max-width:850px;margin:auto;padding:28px 16px 48px}h1{font-size:clamp(26px,5vw,38px);margin:8px 0}p{line-height:1.6;color:#475569}.eyebrow{font-weight:800;color:#0369a1}.card{background:white;border:1px solid #dbeafe;border-radius:18px;padding:20px;margin:20px 0}.row{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:13px 0;border-bottom:1px solid #e2e8f0}.row:last-child{border:0}.row strong{text-align:right;font-size:14px}.ok{color:#047857}.pending{color:#92400e}button{width:100%;padding:14px;border:0;border-radius:12px;background:#087dcc;color:white;font:700 16px system-ui;cursor:pointer}a{color:#0369a1;font-weight:700}.notice{background:#fef3c7;padding:12px;border-radius:10px;color:#78350f;font-size:14px}@media(max-width:450px){.row{align-items:flex-start}.row strong{max-width:43%}}</style></head><body><main><p class="eyebrow">BE STEM READY · STEM Makers Lab</p><h1>'+heading+'</h1><p>Read-only checks for private testing infrastructure. Configuration is not proof of live delivery or provider acceptance.</p><div class="notice">Preview only. No real student data, payment, emails, secrets or tokens are exposed or sent by this page.</div><section class="card" aria-label="Infrastructure status">'+rows+'</section><form method="post" action="/dev/testing-centre"><button type="submit">Run safe Wix read and configuration checks</button></form><section class="card"><h2>Manual acceptance</h2><p>'+note+'</p><p><a href="/parent/sign-in">Create Your Account</a></p><p><a href="/auth/">Student sign-in</a></p></section></main></body></html>',{headers:{...headers,"Content-Type":"text/html; charset=utf-8"}});
}
export async function handleJ1Readiness(request,env,requestFn=fetch){
 const url=new URL(request.url),isPage=url.pathname===PAGE,isApi=url.pathname===API;
 const expected=env.VERCEL_URL?"https://"+env.VERCEL_URL:"";
 if(!isJ1Preview(env)||!expected||url.origin!==expected||(!isPage&&!isApi))return json(404,{ok:false,status:"NOT_FOUND"});
 if(request.method==="GET"&&isPage)return page(await getJ1Readiness(env));
 if(request.method!=="POST")return json(405,{ok:false,status:"METHOD_NOT_ALLOWED"});
 if(request.headers.get("origin")!==expected||request.headers.get("sec-fetch-site")!=="same-origin"||(isApi&&request.headers.get("x-stem-j1-readiness")!=="1"))return json(403,{ok:false,status:"INVALID_REQUEST"});
 const checks=await getJ1Readiness(env,{probe:true,request:requestFn});
 return isPage?page(checks):json(200,{ok:true,checks});
}
