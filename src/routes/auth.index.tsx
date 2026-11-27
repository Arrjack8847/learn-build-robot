import { StudentSignIn } from "../components/student-sign-in";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { beginWixLogin, getWixMemberToken, logoutWix, wixConfigured } from "@/lib/wix-auth";

export const Route = createFileRoute("/auth/")({validateSearch:(search:Record<string,unknown>)=>({legacy:search["legacy"]==="1"?"1":undefined}),component:Entry});
declare const __J12345_STUDENT_PREVIEW__:boolean;
function Entry(){const search=Route.useSearch();return !__J12345_STUDENT_PREVIEW__&&search.legacy==="1"?<StudentAccount/>:<StudentSignIn/>;}

function StudentAccount() {
  const [status,setStatus]=useState<"loading"|"guest"|"member">("loading");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{
    let mounted=true;
    getWixMemberToken().then(token=>{if(mounted)setStatus(token?"member":"guest");})
      .catch(()=>{if(mounted){setStatus("guest");setError("Your session expired. Please sign in again.");}});
    return ()=>{mounted=false;};
  },[]);
  async function act(action:()=>Promise<void>) {
    setBusy(true);setError("");
    try {await action();}
    catch {setError("Unable to connect to Wix. Please try again.");setBusy(false);
      const token=await getWixMemberToken().catch(()=>null);setStatus(token?"member":"guest");}
  }
  return <main className="grid min-h-[100dvh] place-items-center bg-[#f3faff] px-4 py-8 text-[#132654]">
    <section className="w-full max-w-md rounded-[30px] border border-sky-100 bg-white p-6 shadow-sm sm:p-9">
      <a href="/" className="text-sm font-bold text-sky-700">← Back to home</a>
      <img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="mx-auto mt-6 h-20 max-w-full object-contain"/>
      <h1 className="mt-6 text-center text-3xl font-black">Student account</h1>
      <p className="mt-3 text-center text-sm leading-6 text-slate-600">Sign in with your Wix member account. New students can register on the Wix sign-in page.</p>
      {!wixConfigured&&<p role="status" className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Student sign-in is not configured for this preview.</p>}
      {error&&<p role="alert" className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      {status==="loading"?<p role="status" className="mt-6 text-center">Checking session…</p>:status==="member"?<>
        <p className="mt-5 text-center text-sm text-slate-600">Open your dashboard to view your saved Wix student records. Activity synchronization is still being developed.</p>
        <a href="/student/dashboard" className="mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 font-bold text-white">Open student dashboard</a>
        <button type="button" disabled={busy} onClick={()=>void act(logoutWix)} className="mt-5 min-h-12 w-full rounded-2xl bg-sky-600 px-4 font-bold text-white disabled:opacity-50">Sign out</button>
      </>:<>
        <button type="button" disabled={!wixConfigured||busy} onClick={()=>void act(beginWixLogin)} className="mt-6 min-h-12 w-full rounded-2xl bg-sky-600 px-4 font-bold text-white disabled:opacity-50">{busy?"Connecting…":"Sign in / Register"}</button>
        <p className="mt-4 text-center text-xs text-slate-500">Password recovery is handled on the Wix sign-in page, subject to site settings.</p>
      </>}
    </section>
  </main>;
}
