import {createFileRoute} from "@tanstack/react-router";
import {useState} from "react";
import {Mail,ArrowLeft,ShieldCheck,CheckCircle2,LoaderCircle} from "lucide-react";
export const Route=createFileRoute("/parent/email-test")({component:EmailTest,head:()=>({meta:[{title:"Email delivery test | BE STEM READY"},{name:"robots",content:"noindex, nofollow"}]})});
function EmailTest(){
  const [state,setState]=useState<"idle"|"sending"|"accepted"|"error">("idle");
  const [message,setMessage]=useState("");
  async function send(){
    if(state==="sending"||state==="accepted")return;
    setState("sending");setMessage("");
    try{
      const r=await fetch("/api/dev/email-test",{method:"POST",headers:{"X-STEM-Email-Test":"1"},credentials:"same-origin",cache:"no-store",redirect:"error"});
      const data=await r.json();
      if(r.ok&&data.ok===true&&data.status==="ACCEPTED_BY_RESEND"){
        setState("accepted");setMessage("Resend accepted the delivery request. Check your configured test inbox and spam folder. Repeated requests within 24 hours may refer to the same email.");return;
      }
      setState("error");
      setMessage(data.status==="CONFIGURATION_REQUIRED"?"Preview email settings are incomplete.":data.status==="INVALID_REQUEST"?"Use the exact Vercel deployment URL and try again.":data.status==="PREVIEW_ONLY"?"Email testing is available only in the development preview.":"The email request could not be confirmed. No account was created.");
    }catch{setState("error");setMessage("Email service could not be reached. No account was created.");}
  }
  return <main className="h-full overflow-y-auto bg-[#f3faff] text-[#132654]"><div className="mx-auto max-w-xl space-y-5 p-4 sm:p-8">
    <header className="flex items-center justify-between gap-3"><a href="/parent/sign-in" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-sky-700"><ArrowLeft className="size-4"/> Registration</a><img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="h-12 max-w-[48%] object-contain"/></header>
    <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-sky-50 text-sky-600"><Mail className="size-8"/></div>
      <p className="mt-5 text-center text-xs font-black uppercase tracking-widest text-sky-700">STEM Makers Lab · J2</p>
      <h1 className="mt-2 text-center text-2xl font-black">Real email delivery test</h1>
      <p className="mt-3 text-center text-sm leading-6 text-slate-600">Send one controlled test message through Resend to the recipient configured privately in Vercel. No login code, account or payment will be created.</p>
      <div className="mt-5 rounded-xl bg-sky-50 p-3 text-sm text-sky-900"><ShieldCheck className="mr-2 inline size-4"/> The address and API key stay on the server. Duplicate test requests are deduplicated by Resend for 24 hours.</div>
      <button type="button" disabled={state==="sending"||state==="accepted"} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#168eea] px-4 py-3 font-bold text-white disabled:opacity-60" onClick={send}>{state==="sending"?<LoaderCircle className="size-5 animate-spin"/>:state==="accepted"?<CheckCircle2 className="size-5"/>:<Mail className="size-5"/>}{state==="sending"?"Requesting delivery…":state==="accepted"?"Accepted by Resend":"Send real test email"}</button>
      {message&&<p role="status" className={"mt-4 rounded-xl p-3 text-sm leading-6 "+(state==="error"?"bg-rose-50 text-rose-900":"bg-emerald-50 text-emerald-900")}>{message}</p>}
    </section>
    <p className="text-center text-xs text-slate-500">Private development test. Full email OTP and Wix account persistence are separate release gates.</p>
  </div></main>;
}
