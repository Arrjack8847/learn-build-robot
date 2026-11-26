import {createFileRoute} from "@tanstack/react-router";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {KeyRound,Clock,CheckCircle2} from "lucide-react";
import {j5Session} from "@/lib/j5-session";
import type {J5RequestTicket} from "@/lib/j5-session-lifecycle.mjs";
import {J5SignOut} from "@/components/j5/J5SignOut";
import {J5MembershipRestriction} from "@/components/j5/J5MembershipRestriction";
import {useJ5Overview} from "@/lib/j5-overview";

export const Route=createFileRoute("/student/check-in")({component:CheckIn,head:()=>({meta:[{title:"Lab check-in | BE STEM READY"},{name:"robots",content:"noindex, nofollow"}]})});
function CheckIn(){
 const [code,setCode]=useState("");
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [signedOut,setSignedOut]=useState(false);
 const pending=useRef<J5RequestTicket|null>(null);
 const enabled=import.meta.env["VITE_J5_PRIVATE_UI"]==="true";
 const {state:membershipState,refresh}=useJ5Overview(enabled);
 const eligible=membershipState.kind==="ready"&&membershipState.data.profile.membership==="active";
 const verifiedUntil=membershipState.kind==="ready"&&eligible&&membershipState.data.profile.checkIn==="verified"?membershipState.data.profile.checkInUntil:null;
 useEffect(()=>{
  if(!enabled)return;
  if(j5Session.isBlocked())setSignedOut(true);
  const unsubscribe=j5Session.subscribe(({blocked})=>{pending.current?.cancel();pending.current=null;setBusy(false);setCode("");setSignedOut(blocked);setMessage(blocked?"Please sign in again.":"");});
  return()=>{pending.current?.cancel();unsubscribe();};
 },[enabled]);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  if(!enabled||!eligible||verifiedUntil!==null||j5Session.isBlocked()||signedOut||pending.current||!/^\d{8}$/.test(code))return;
  const ctrl=j5Session.begin();pending.current=ctrl;setBusy(true);setMessage("");setSignedOut(false);
  try{
   const response=await fetch("/api/dev/j5/check-in",{method:"POST",credentials:"same-origin",cache:"no-store",redirect:"error",headers:{"Content-Type":"application/json","X-STEM-J5":"1"},body:JSON.stringify({code}),signal:ctrl.signal});
   const data=await response.json().catch(()=>null);
   if(!ctrl.current())return;
   if(response.ok&&data?.ok===true&&data.code==="CHECK_IN_VERIFIED"&&Number.isSafeInteger(data.validUntil)&&data.validUntil>Date.now()){
    setCode("");refresh();return;
   }
   if(response.status===401){setSignedOut(true);setMessage("Please sign in before checking in.");}
   else if(response.status===400||response.status===403)setMessage("We couldn't verify that code. Check it or ask staff for a new code.");
   else setMessage("Check-in is not available right now. Please ask a member of staff.");
   setCode("");
  }catch{if(ctrl.current())setMessage("We couldn't connect. Please try again.");}
  finally{ctrl.finish();if(pending.current===ctrl){pending.current=null;setBusy(false);}}
 }
 return <main className="grid h-full place-items-center overflow-y-auto bg-[#f3faff] px-4 py-6 text-[#132654]"><section className="w-full max-w-md space-y-5 rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
 <div className="flex flex-wrap items-center justify-between gap-2"><a href="/student/dashboard" className="inline-flex min-h-11 items-center text-sm font-bold text-sky-700">← My profile</a>{enabled&&<J5SignOut/>}</div>
 <img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="mx-auto h-14 max-w-full object-contain"/><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-sky-50 text-sky-600"><KeyRound className="size-8"/></div>
 <div className="text-center"><h1 className="text-2xl font-black">Check in to the Lab</h1><p className="mt-2 text-sm leading-6 text-slate-600">Ask a member of staff for your eight-digit code when you arrive for your booking.</p></div>
 {enabled&&!eligible?<div>{membershipState.kind==="ready"?<J5MembershipRestriction membership={membershipState.data.profile.membership} refresh={refresh}/>:membershipState.kind==="unauthorized"?<p role="status">Sign in to check in.</p>:membershipState.kind==="loading"?<p role="status">Checking membership…</p>:<button type="button" onClick={refresh} className="min-h-11 rounded-xl border border-sky-200 px-4 font-bold">Membership unavailable. Try again</button>}{membershipState.kind==="unauthorized"&&<a href="/auth/" className="mt-2 inline-flex min-h-11 items-center font-bold text-sky-700">Sign in</a>}</div>:verifiedUntil!==null?<div role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-800"><CheckCircle2 className="size-6"/><p className="mt-2 font-bold">Check-in verified</p><p className="mt-1 text-sm">Your booking is checked in. Your learning access is subject to your membership and available levels.</p><a href="/practical/levels" className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-4 font-bold text-white">Continue to learning</a></div>:<form onSubmit={submit} className="space-y-3"><label htmlFor="lab-code" className="block text-sm font-bold">Your check-in code</label><input id="lab-code" inputMode="numeric" autoComplete="off" aria-describedby="code-help" maxLength={8} disabled={busy||!enabled||signedOut} value={code} onChange={e=>setCode(e.target.value.replace(/[^0-9]/g,"").slice(0,8))} className="min-h-14 w-full rounded-xl border border-sky-200 px-3 text-center text-2xl font-bold tracking-widest" placeholder="00000000"/><p id="code-help" className="text-xs text-slate-600">Enter the eight digits staff gave you. If a code is refused, ask staff for help.</p><button type="submit" disabled={!enabled||busy||signedOut||code.length!==8} className="min-h-12 w-full rounded-xl bg-sky-700 px-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-600">{busy?"Verifying…":"Verify check-in"}</button></form>}
 {!enabled&&<p role="status" className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">Check-in is not available in this development environment.</p>}
 {message&&<p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{message}</p>}
 {signedOut&&<a href="/auth/" className="flex min-h-11 items-center justify-center rounded-xl border border-sky-200 font-bold">Sign in</a>}
 <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500"><Clock className="size-4"/> Access is limited to your authorized session.</p>
 </section></main>;
}
