import {createFileRoute} from "@tanstack/react-router";
import {useEffect,useState} from "react";
import {Mail,KeyRound,ShieldCheck,LogOut,ArrowLeft} from "lucide-react";
export const Route=createFileRoute("/parent/otp-test")({component:OtpTest,head:()=>({meta:[{title:"Secure OTP test | BE STEM READY"},{name:"robots",content:"noindex, nofollow"}]})});
const button="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#168eea] px-4 py-3 font-bold text-white disabled:opacity-40";
const messages:Record<string,string>={CODE_SENT:"A verification code was requested. Check your configured inbox.",VERIFIED:"Your inbox was verified. The private test session survives refresh.",SIGNED_OUT:"Test session revoked.",COOLDOWN:"Wait 60 seconds before requesting another code.",LOCKED:"Too many incorrect codes. Try again after 15 minutes.",HOURLY_LIMIT:"Five requests per hour allowed. Try again later.",INVALID_OR_EXPIRED:"Incorrect, expired or already used code.",CONFIGURATION_REQUIRED:"Secure OTP setup is incomplete. The server will not send a login code until configured.",INVALID_REQUEST:"Open the exact preview deployment URL.",DELIVERY_UNCONFIRMED:"Email delivery request could not be confirmed. Wait before retrying.",AUTH_UNAVAILABLE:"Secure authentication service is unavailable.",PREVIEW_ONLY:"Available only in the private development preview."};
async function call(action:string,code?:string){
  const r=await fetch("/api/dev/parent-otp/"+action,{method:"POST",headers:{"X-STEM-OTP-Test":"1",...(code!==undefined?{"Content-Type":"application/json"}:{})},...(code!==undefined?{body:JSON.stringify({code})}:{}),credentials:"same-origin",cache:"no-store",redirect:"error"});
  return await r.json() as {ok:boolean;status:string};
}
function OtpTest(){
  const [code,setCode]=useState("");
  const [sent,setSent]=useState(false);
  const [verified,setVerified]=useState(false);
  const [busy,setBusy]=useState(true);
  const [blocked,setBlocked]=useState(false);
  const [message,setMessage]=useState("");
  useEffect(()=>{let active=true;call("status").then(r=>{if(!active)return;setVerified(r.status==="VERIFIED");if(!r.ok){setBlocked(true);setMessage(messages[r.status]??"Authentication unavailable.");}}).catch(()=>{if(active){setBlocked(true);setMessage("Could not reach the authentication service.");}}).finally(()=>{if(active)setBusy(false);});return()=>{active=false;};},[]);
  async function act(action:string){
    if(busy||blocked)return;setBusy(true);setMessage("");
    try{const r=await call(action,action==="verify"?code:undefined);setMessage(messages[r.status]??"Request not confirmed.");if(r.status==="CODE_SENT"){setSent(true);setCode("");}if(r.status==="VERIFIED"){setVerified(true);setCode("");}if(r.status==="SIGNED_OUT"){setVerified(false);setSent(false);setCode("");}if(r.status==="CONFIGURATION_REQUIRED")setBlocked(true);}catch{setMessage("Request could not be confirmed.");}finally{setBusy(false);}
  }
  return <main className="h-full overflow-y-auto bg-[#f3faff] text-[#132654]"><div className="mx-auto max-w-xl space-y-5 p-4 sm:p-8"><header className="flex items-center justify-between gap-3"><a href="/parent/email-test" className="inline-flex items-center gap-2 text-sm font-bold text-sky-700"><ArrowLeft className="size-4"/> Email test</a><img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="h-12 max-w-[48%] object-contain"/></header><section className="space-y-5 rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
  <p className="text-xs font-black uppercase tracking-widest text-sky-700">STEM Makers Lab · Private test</p><h1 className="text-2xl font-black">Real email verification</h1><p className="text-sm leading-6 text-slate-600">Send a six-digit one-time code to the configured Resend inbox. Successful verification creates a revocable test session only. No real parent account, child record or payment is authorized.</p>
  {verified?<><p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 font-bold text-emerald-800"><ShieldCheck className="size-5"/> Verified test session</p><button disabled={busy||blocked} className={button} onClick={()=>act("logout")}><LogOut className="size-4"/> Sign out</button></>:<><button disabled={busy||blocked} className={button} onClick={()=>act("request")}><Mail className="size-4"/> {sent?"Request a new code":"Send verification code"}</button>{sent&&<form className="space-y-3" onSubmit={e=>{e.preventDefault();act("verify");}}><label htmlFor="otp-code" className="block text-sm font-bold">Six-digit code</label><input id="otp-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/[^0-9]/g,"").slice(0,6))} className="min-h-12 w-full rounded-xl border border-sky-200 px-3 text-center text-2xl tracking-widest" placeholder="000000"/><button className={button} disabled={busy||blocked||code.length!==6} type="submit"><KeyRound className="size-4"/> Verify code</button></form>}</>}
  {message&&<p className="rounded-xl bg-sky-50 p-3 text-sm leading-6" role="status">{message}</p>}
  <p className="text-xs text-slate-500">Five wrong attempts lock verification for 15 minutes. Codes expire after five minutes. Test session expires after 12 hours.</p></section></div></main>;
}
