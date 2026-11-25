import { createFileRoute } from "@tanstack/react-router";
import { useEffect,useState } from "react";
import { completeWixLogin } from "@/lib/wix-auth";
export const Route=createFileRoute("/auth/callback")({component:Callback});
function Callback(){
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    let active=true;
    completeWixLogin().then(()=>{if(active)window.location.replace("/auth/");})
      .catch(()=>{if(active)setFailed(true);});
    return ()=>{active=false;};
  },[]);
  return <main className="grid min-h-[100dvh] place-items-center bg-[#f3faff] px-4 text-center text-[#132654]">
    <section className="w-full max-w-md rounded-3xl border border-sky-100 bg-white p-8">
      <h1 className="text-2xl font-black">{failed?"Sign-in unsuccessful":"Finishing sign-in"}</h1>
      <p role="status" className="mt-3 text-sm text-slate-600">{failed?"Your sign-in was cancelled, expired, or could not be verified.":"Verifying your Wix session…"}</p>
      {failed&&<a href="/auth/" className="mt-6 inline-block rounded-xl bg-sky-600 px-5 py-3 font-bold text-white">Try again</a>}
    </section>
  </main>;
}
