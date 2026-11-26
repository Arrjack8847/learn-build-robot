import {useEffect,useRef,useState} from "react";
export type Attendance={bookingId:string|null;day:string|null;attendanceStatus:string;checkInStatus:string;codeStatus:string;expiresAt:number|null;checkInAt:number|null;checkOutAt:number|null;visitStatus:string};
type Reply={ok:boolean;status:string;attendance?:Attendance;code?:string;expiresAt?:number};
const btn="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold disabled:opacity-40";
const text=(s:string)=>s.toLowerCase().replaceAll("_"," ");
async function call(path:string,body:Record<string,string>,signal?:AbortSignal,operatorKey?:string):Promise<Reply>{
 const r=await fetch("/api/dev/j1234/"+path,{method:"POST",credentials:"same-origin",cache:"no-store",redirect:"error",headers:{"Content-Type":"application/json","X-STEM-J1234":"1",...(operatorKey?{"X-STEM-J1234-Operator":operatorKey}:{})},body:JSON.stringify(body),signal});
 const v=await r.json();if(typeof v?.ok!=="boolean"||typeof v.status!=="string")throw Error("UNAVAILABLE");return v;
}
function useDeadline(until:number|null){const [left,setLeft]=useState(0);useEffect(()=>{const tick=()=>setLeft(until?Math.max(0,Math.ceil((until-Date.now())/1000)):0);tick();const t=window.setInterval(tick,500);return()=>window.clearInterval(t);},[until]);return left;}
export function StaffAttendance({studentId,initial,membership,operatorKey,onSettled}:{studentId:string;initial:Attendance;membership:string;operatorKey:string;onSettled?:()=>void}){
 const [state,setState]=useState(initial),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[issued,setIssued]=useState<{code:string;expiresAt:number}|null>(null);
 const flight=useRef(false),alive=useRef(true);useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 useEffect(()=>{setState(initial);setIssued(old=>old&&initial.codeStatus==="active"&&initial.expiresAt===old.expiresAt?old:null);},[initial]);
 const left=useDeadline(issued?.expiresAt??null);useEffect(()=>{if(issued&&Date.now()>=issued.expiresAt)setIssued(null);},[left,issued]);
 async function act(action:string){
  if(flight.current)return;flight.current=true;setBusy(true);setMessage("");setIssued(null);
  try{const r=await call("attendance",{action,studentId,requestId:crypto.randomUUID(),...(action==="book"?{}:{bookingId:state.bookingId??""})},undefined,operatorKey);if(!alive.current)return;if(r.attendance)setState(r.attendance);setMessage(text(r.status));if(r.ok&&r.code&&r.expiresAt)setIssued({code:r.code,expiresAt:r.expiresAt});}
  catch{if(alive.current)setMessage("Attendance could not be confirmed. Refresh before retrying.");}
  finally{flight.current=false;if(alive.current){setBusy(false);onSettled?.();}}
 }
 const eligible=membership==="active",booked=state.attendanceStatus==="booked";
 return <section className="mt-3 space-y-2 border-t pt-3 text-sm"><p className="font-semibold capitalize">Attendance: {text(state.attendanceStatus)}</p><p className="text-xs capitalize">Code: {text(state.codeStatus)}</p>{state.day&&<p className="text-xs">Session date: {state.day} MYT</p>}
 <div className="flex flex-wrap gap-2">{state.attendanceStatus==="not_booked"&&<button className={btn} disabled={busy||!eligible} onClick={()=>void act("book")}>Book today</button>}{booked&&<><button className={btn} disabled={busy||!eligible} onClick={()=>void act("issue")}>{state.codeStatus==="active"?"Reissue code":"Issue code"}</button>{state.codeStatus==="active"&&<button className={btn} disabled={busy} onClick={()=>void act("revoke")}>Revoke</button>}<button className={btn} disabled={busy} onClick={()=>void act("no_show")}>Mark no-show</button></>}{state.attendanceStatus==="no_show"&&<button className={btn} disabled={busy} onClick={()=>void act("excuse")}>Excuse no-show</button>}{state.attendanceStatus==="attended"&&<button className={btn} disabled={busy} onClick={()=>void act("check_out")}>Check out</button>}</div>
 {issued&&left>0&&<div className="rounded-lg bg-sky-50 p-3" aria-label="One-time code display"><p className="text-xs">Give this to this student only. Expires in {left}s.</p><p className="font-mono text-xl font-bold tracking-widest">{issued.code}</p></div>}
 {message&&<p role="status" className="text-xs capitalize">{message}</p>}{!eligible&&<p className="text-xs text-slate-500">Verified active membership is required to book or issue a code.</p>}</section>;
}
export function StudentCheckIn({studentId}:{studentId:string}){
 const [state,setState]=useState<Attendance|null>(null),[code,setCode]=useState(""),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);
 const flight=useRef(false),alive=useRef(true);
 useEffect(()=>{alive.current=true;const c=new AbortController();setState(null);setCode("");setMessage("");call("check-in",{action:"status"},c.signal).then(r=>{if(!c.signal.aborted){if(r.ok&&r.attendance)setState(r.attendance);else setMessage("Check-in is unavailable.");}}).catch(()=>{if(!c.signal.aborted)setMessage("Check-in is unavailable.");});return()=>{alive.current=false;c.abort();};},[studentId]);
 async function redeem(){if(flight.current||!state?.bookingId||! /^\d{8}$/.test(code))return;flight.current=true;setBusy(true);setMessage("");
  try{const r=await call("check-in",{action:"redeem",bookingId:state.bookingId,code,requestId:crypto.randomUUID()});if(alive.current){setCode("");if(r.attendance)setState(r.attendance);setMessage(r.ok?"Check-in recorded.":text(r.status));}}
  catch{if(alive.current)setMessage("Check-in could not be confirmed. Refresh before retrying.");}
  finally{flight.current=false;if(alive.current)setBusy(false);}
 }
 return <section className="space-y-3 rounded-xl border border-sky-100 p-4"><h2 className="font-bold">Today's check-in</h2>{state?<p className="text-sm capitalize">{text(state.attendanceStatus)}</p>:<p className="text-sm">Check-in status unavailable.</p>}{state?.attendanceStatus==="booked"&&<form className="space-y-2" onSubmit={e=>{e.preventDefault();void redeem();}}><label className="block text-sm font-bold">8-digit code from staff<input className="mt-1 min-h-11 w-full rounded-lg border p-2" inputMode="numeric" autoComplete="off" maxLength={8} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,8))}/></label><button className={btn} disabled={busy||code.length!==8}>Check in</button></form>}{message&&<p role="status" className="text-sm">{message}</p>}<p className="text-xs text-slate-500">Attendance only. Learning access is not connected yet.</p><button className={btn} disabled={busy} onClick={()=>window.location.reload()}>Refresh check-in</button></section>;
}
