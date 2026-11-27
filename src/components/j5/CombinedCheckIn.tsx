import {useEffect,useRef,useState} from "react";
import {j5Session} from "../../lib/j5-session";
export function CombinedCheckIn({bookingId,start,end,onSettled}:{bookingId:string|null;start:number|null;end:number|null;onSettled:()=>void}){
 const [code,setCode]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const lock=useRef(false);const [now,setNow]=useState(Date.now());
 useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),1000);return()=>window.clearInterval(timer);},[]);
 async function redeem(){
  if(!bookingId||!/^[0-9]{8}$/.test(code)||lock.current)return;
  lock.current=true;setBusy(true);setMessage("");const t=j5Session.begin();
  try{const r=await fetch("/api/dev/combined/check-in",{method:"POST",credentials:"same-origin",cache:"no-store",redirect:"error",headers:{"Content-Type":"application/json","X-STEM-Combined":"1"},body:JSON.stringify({bookingId,code}),signal:t.signal});const v=await r.json();if(!t.current())return;setCode("");setMessage(r.ok&&v.ok?"Check-in confirmed for this booked hour.":"Code refused. Ask staff for a valid code.");onSettled();}catch{if(t.current()){setCode("");setMessage("Check-in could not be confirmed. Ask staff to verify.");}}finally{t.finish();lock.current=false;setBusy(false);}
 }
 if(!bookingId||start===null||end===null)return <p className="text-sm">No verified booking for today.</p>;
 return <section className="space-y-2 rounded-xl border border-sky-200 p-3"><h3 className="font-bold">Lab check-in</h3><p className="text-sm">Reserved session: {new Date(start).toLocaleTimeString("en-MY",{timeZone:"Asia/Kuala_Lumpur"})} – {new Date(end).toLocaleTimeString("en-MY",{timeZone:"Asia/Kuala_Lumpur"})} MYT</p><label className="block text-sm" htmlFor="combined-code">Eight-digit code from staff</label><input id="combined-code" type="text" inputMode="numeric" autoComplete="off" value={code} maxLength={8} disabled={busy} onChange={e=>setCode(e.target.value.replace(/[^0-9]/g,""))} className="w-full rounded-lg border p-3 tracking-widest"/><button type="button" disabled={busy||code.length!==8||now<start||now>=end} onClick={()=>void redeem()} className="w-full rounded-xl bg-sky-700 p-3 font-bold text-white disabled:opacity-40">Check in</button>{message&&<p role="status" className="text-sm">{message}</p>}</section>;
}
