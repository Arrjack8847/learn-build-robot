import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, KeyRound, Mail, ShieldCheck, UsersRound, UserRound } from "lucide-react";

export const Route = createFileRoute("/parent/sign-in")({ component: ParentSignInPreview });

const steps = ["Email", "Verify", "Privacy", "Child"] as const;
const example = { email: "parent@example.invalid", code: "123456", name: "Sample Child", birthYear: "2018" };
const button = "flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#168eea] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#0c77c8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-40";
const field = "mt-2 min-h-12 w-full rounded-xl border border-sky-200 bg-white px-4 text-base text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 read-only:bg-slate-50";

function ParentSignInPreview() {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  // This is an isolated fictional-data UI walkthrough, not authentication.
  // Never issue a session, make network calls or store parent/child data here.
  function reset() {
    setStep(0); setCode(""); setAccepted(false); setComplete(false); setError(""); setResent(false);
  }
  function back() {
    setError(""); setStep(previous => Math.max(0, previous - 1));
  }
  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (step === 1 && code !== example.code) {
      setError("For this walkthrough, enter the example code shown below.");
      return;
    }
    if (step === 2 && !accepted) {
      setError("Tick the example checkbox to continue.");
      return;
    }
    if (step === 3) { setComplete(true); return; }
    setStep(previous => previous + 1);
  }
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#effaff] via-white to-[#f0f6ff] text-[#132654]">
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-4 pb-8 pt-4 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <a href="/auth/" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-sky-700"><ArrowLeft className="size-4" aria-hidden="true"/> Account</a>
          <img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="h-12 max-w-[50%] object-contain"/>
        </header>
        <div className="my-auto grid gap-6 py-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14">
          <aside className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-sky-800"><UsersRound className="size-4"/> STEM Makers Lab</div>
            <h1 className="mt-5 text-5xl font-black leading-tight">One account.<br/>Your family's STEM journey.</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-600">A parent account brings child profiles, membership and future bookings together.</p>
            <div className="mt-7 flex items-center gap-3 text-sm font-bold text-sky-800"><ShieldCheck className="size-6"/> Passwordless sign-in design</div>
          </aside>
          <section className="mx-auto w-full max-w-lg rounded-[30px] border border-sky-100 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="parent-heading">
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold leading-5 text-amber-900" role="status">Development walkthrough · fictional data only. No email is sent, no account is created, and no session or consent is saved.</p>
            {!complete && <ol className="my-6 grid grid-cols-4 gap-2" aria-label="Registration steps">
              {steps.map((label,index) => <li key={label} aria-current={index===step?"step":undefined} className="flex flex-col items-center gap-2 text-center">
                <span className={"grid size-9 place-items-center rounded-full text-sm font-black "+(index<=step?"bg-[#168eea] text-white":"bg-sky-50 text-slate-500")}>{index<step?<CheckCircle2 className="size-5"/>:index+1}</span>
                <span className="text-[11px] font-bold text-slate-600">{label}</span>
              </li>)}
            </ol>}
            {complete ? <div className="mt-6 text-center">
              <CheckCircle2 className="mx-auto size-14 text-emerald-600" aria-hidden="true"/>
              <h2 id="parent-heading" className="mt-4 text-2xl font-black">Walkthrough complete</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">In the connected system, your verified parent account would now have a child profile. This preview has not created one.</p>
              <div className="my-5 flex items-center gap-3 rounded-2xl bg-sky-50 p-4 text-left"><UserRound className="size-7 text-sky-700"/><div><p className="font-bold">{example.name}</p><p className="text-xs text-slate-600">Birth year: {example.birthYear} · Example only</p></div></div>
              <a href="/parent/dashboard" className={button}>Open example parent dashboard <ArrowRight className="size-4" aria-hidden="true"/></a>
              <button className="mt-3 min-h-11 w-full text-sm font-bold text-sky-700" type="button" onClick={reset}>Restart walkthrough</button>
            </div> : <form onSubmit={next} className="space-y-5">
              <div className="text-center">
                <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-sky-50 text-[#168eea]">
                  {step===0?<Mail className="size-8"/>:step===1?<KeyRound className="size-8"/>:step===2?<ShieldCheck className="size-8"/>:<UserRound className="size-8"/>}
                </div>
                <h2 id="parent-heading" className="mt-4 text-2xl font-black sm:text-3xl">{["Welcome, parents","Verify your email","Privacy notice","Add your child"][step]}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{["Sign in or create one account using your email.","Enter the six-digit code in the example below.","Review the approved privacy notice before registering.","Only the child's name and birth year are needed."][step]}</p>
              </div>
              {step===0 && <div><label htmlFor="parent-email" className="text-sm font-bold">Email address</label><input id="parent-email" type="email" value={example.email} readOnly className={field}/><p className="mt-2 text-xs text-slate-500">A fictional address is fixed for this preview.</p></div>}
              {step===1 && <div>
                <label htmlFor="parent-code" className="text-sm font-bold">Verification code</label>
                <input id="parent-code" value={code} onChange={e=>{setCode(e.target.value.replace(/[^0-9]/g,"").slice(0,6));setError("");}} inputMode="numeric" maxLength={6} autoComplete="off" aria-describedby="demo-code" className={field+" text-center text-2xl font-black tracking-[0.35em]"} placeholder="000000"/>
                <p id="demo-code" className="mt-3 rounded-xl bg-sky-50 p-3 text-center text-sm">Example code: <strong>{example.code}</strong>. Not a real login code.</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><button type="button" onClick={()=>{setCode("");setError("");setResent(true);}} className="min-h-11 text-sm font-bold text-sky-700 underline">Preview resend</button><span className="text-xs text-slate-500">Live cooldown: 60 seconds</span></div>
                {resent&&<p role="status" className="text-xs text-slate-600">Resend screen previewed. No email was sent.</p>}
              </div>}
              {step===2 && <div className="space-y-3">
                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-slate-700"><p className="font-bold">Privacy notice placeholder</p><p className="mt-2">The company-approved notice must explain information collected, where it is stored and its retention period. This text is not an approved notice and cannot be used to collect real consent.</p></div>
                <label className="flex items-start gap-3 rounded-xl border border-sky-100 p-3 text-sm font-semibold"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} className="mt-1 size-5 shrink-0 accent-sky-600"/> I understand this is an example consent step.</label>
              </div>}
              {step===3 && <div className="space-y-4"><div><label htmlFor="child-name" className="text-sm font-bold">Child's name</label><input id="child-name" value={example.name} readOnly className={field}/></div><div><label htmlFor="birth-year" className="text-sm font-bold">Birth year</label><input id="birth-year" value={example.birthYear} readOnly className={field}/></div><p className="text-xs text-slate-500">Example information only. No additional child details are requested.</p></div>}
              {error&&<p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-800">{error}</p>}
              <button type="submit" className={button} disabled={(step===1&&code.length!==6)||(step===2&&!accepted)}>{["Preview send code","Preview verify email","Continue walkthrough","Preview create child"][step]} <ArrowRight className="size-4" aria-hidden="true"/></button>
              {step>0&&<button type="button" onClick={back} className="min-h-11 w-full text-center text-sm font-bold text-sky-700">Previous step</button>}
            </form>}
            <div className="mt-6 border-t border-sky-100 pt-4 text-center text-xs text-slate-500"><a href="/auth/" className="inline-flex min-h-11 items-center gap-1 font-bold text-sky-700">Return to existing student account <ChevronRight className="size-3"/></a></div>
          </section>
        </div>
      </div>
    </div>
  );
}
