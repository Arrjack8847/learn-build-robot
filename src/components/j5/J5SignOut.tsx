import {useRef,useState} from "react";
import {j5Session} from "@/lib/j5-session";
export function J5SignOut(){
 const [busy,setBusy]=useState(false),[error,setError]=useState(false);
 const pending=useRef(false);
 async function signOut(){
  if(pending.current)return;
  pending.current=true;setBusy(true);setError(false);
  const confirmed=await j5Session.logout();
  if(confirmed){window.location.replace("/auth/");return;}
  pending.current=false;setError(true);setBusy(false);
 }
 return <div className="flex flex-wrap items-center gap-2"><button type="button" disabled={busy} onClick={()=>void signOut()} className="min-h-11 rounded-xl border border-sky-200 bg-white px-3 text-sm font-bold disabled:opacity-50">{busy?"Signing out…":error?"Retry sign out":"Sign out / switch student"}</button>{error&&<p role="alert" className="text-xs text-rose-800">Sign-out could not be confirmed. Your profile is hidden in this tab. Retry before switching students.</p>}</div>;
}
