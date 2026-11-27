import {createFileRoute} from "@tanstack/react-router";
declare const __J12345_STUDENT_PREVIEW__:boolean;
import {useState} from "react";
import {KeyRound,Clock,ShieldAlert} from "lucide-react";
export const Route=createFileRoute("/student/check-in")({component:()=>__J12345_STUDENT_PREVIEW__?<main className="p-6 text-center"><h1 className="text-xl font-bold">Lab check-in</h1><p>Open your verified student profile to enter the code from staff.</p><a className="mt-4 inline-block rounded-xl bg-sky-700 px-4 py-3 font-bold text-white" href="/student/dashboard">My student profile</a></main>:<CheckIn/>,head:()=>({meta:[{title:"Lab check-in | BE STEM READY"},{name:"robots",content:"noindex, nofollow"}]})});
function CheckIn(){
 const [code,setCode]=useState("");
 return <main className="grid h-full place-items-center overflow-y-auto bg-[#f3faff] px-4 py-6 text-[#132654]"><section className="w-full max-w-md space-y-5 rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
 <img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="mx-auto h-14 max-w-full object-contain"/><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-sky-50 text-sky-600"><KeyRound className="size-8"/></div>
 <div className="text-center"><h1 className="text-2xl font-black">Check in to the Lab</h1><p className="mt-2 text-sm leading-6 text-slate-600">Ask a member of staff for your eight-digit code when you arrive for your booking.</p></div>
 <div className="space-y-3"><label htmlFor="lab-code" className="block text-sm font-bold">Your check-in code</label><input id="lab-code" inputMode="numeric" autoComplete="off" maxLength={8} value={code} onChange={e=>setCode(e.target.value.replace(/[^0-9]/g,"").slice(0,8))} className="min-h-14 w-full rounded-xl border border-sky-200 px-3 text-center text-2xl font-bold tracking-widest" placeholder="00000000"/><button type="button" disabled className="min-h-12 w-full cursor-not-allowed rounded-xl bg-slate-200 px-4 font-bold text-slate-600">Check in &amp; open course</button></div>
 <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><ShieldAlert className="size-5 shrink-0"/><p>Development interface only. The server-side code service and course lock are not connected. This screen does not protect existing course pages or files.</p></div>
 <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500"><Clock className="size-4"/> Access will be limited to your booked session.</p>
 </section></main>;
}
