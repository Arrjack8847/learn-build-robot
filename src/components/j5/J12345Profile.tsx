import {useEffect,useState} from "react";
import {attachJ5SessionSignals,j5Session} from "../../lib/j5-session";
import {J5SignOut} from "./J5SignOut";
import {StudentCheckIn} from "../j1234-attendance";
type Access={membership:string;membershipValidUntil:number|null;membershipEligible:boolean;attendance:string;checkInAt:number|null;learningAccess:"unavailable";reason:string};
type Progress={status:"unavailable"|"not-initialized"}|{status:"ready";currentLevel:number;overallCompleted:number;overallRequired:number;learningCompleted:number;buildingCompleted:number;quizzesPassed:number;challengesPassed:number;latest:{title:string;mode:string;updatedAt:number}|null;history:{title:string;mode:string;level:number;status:string;updatedAt:number;position?:number}[];levels:{level:number;status:string;completed:number;required:number}[]};
type Profile={studentId:string;displayName:string;identityStatus:"verified";learningAccess:"unavailable";access?:Access;progress?:Progress};
type State={kind:"loading"|"unauthorized"|"unavailable"}|{kind:"ready";profile:Profile};
function parse(value:unknown):Profile{
 if(!value||typeof value!=="object")throw Error("Invalid profile");
 const data=value as {ok?:unknown;profile?:Partial<Profile>};
 const p=data.profile;
 if(data.ok!==true||!p||typeof p.studentId!=="string"||!/^qa-j2-[a-f0-9]{64}$/.test(p.studentId)||typeof p.displayName!=="string"||!p.displayName.trim()||p.displayName.length>48||p.identityStatus!=="verified"||p.learningAccess!=="unavailable")throw Error("Invalid profile");
 const a=p.access;
 if(a&&(!["active","inactive","pending","failed","expired","renewal-required","verification-required"].includes(a.membership)||!["not-booked","booked","checked-in","checked-out","no-show","excused","unavailable"].includes(a.attendance)||a.learningAccess!=="unavailable"||a.membershipEligible!==(a.membership==="active")||!(a.membershipValidUntil===null||Number.isSafeInteger(a.membershipValidUntil))||!(a.checkInAt===null||Number.isSafeInteger(a.checkInAt))||!["verification-required","membership-required","check-in-required","learning-policy-required"].includes(a.reason)))throw Error("Invalid access");
 const progress=p.progress;
 if(progress&&(!["ready","not-initialized","unavailable"].includes(progress.status)||progress.status==="ready"&&(!Array.isArray(progress.levels)||progress.levels.length!==6||!Array.isArray(progress.history)||progress.history.length>20||!Number.isSafeInteger(progress.overallCompleted)||!Number.isSafeInteger(progress.overallRequired)||progress.overallCompleted<0||progress.overallRequired<1||progress.overallCompleted>progress.overallRequired)))throw Error("Invalid progress");
 return {studentId:p.studentId,displayName:p.displayName,identityStatus:p.identityStatus,learningAccess:p.learningAccess,...(a?{access:a}:{}),...(p.progress?{progress:p.progress}:{})};
}
function ProgressPanel({progress,onRefresh}:{progress:Progress;onRefresh:()=>void}){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function initialize(){if(busy)return;setBusy(true);setMessage("");const t=j5Session.begin();try{const r=await fetch("/api/dev/j5/progress",{method:"POST",credentials:"same-origin",cache:"no-store",redirect:"error",headers:{"Content-Type":"application/json","X-STEM-J5":"1"},body:JSON.stringify({kind:"initialize"}),signal:t.signal});const v=await r.json();if(t.current()){if(r.ok&&v?.ok===true)onRefresh();else setMessage("Progress setup is not available.");}}catch{if(t.current())setMessage("Progress setup could not be confirmed.");}finally{t.finish();setBusy(false);}}
 if(progress.status!=="ready")return <section className="rounded-xl border p-3 text-sm"><h3 className="font-bold">My learning progress</h3><p>{progress.status==="not-initialized"?"Set up your individual learning record.":"Verified progress is unavailable."}</p>{progress.status==="not-initialized"&&<button type="button" disabled={busy} onClick={()=>void initialize()} className="mt-2 rounded-lg border px-3 py-2 font-bold">Set up progress</button>}{message&&<p role="status">{message}</p>}</section>;
 return <section className="space-y-3 rounded-xl border p-3 text-sm"><h3 className="font-bold">My learning progress</h3><p>Current level: {progress.currentLevel} · {progress.overallCompleted}/{progress.overallRequired} requirements</p><progress className="w-full" value={progress.overallCompleted} max={progress.overallRequired}/><p>Learning {progress.learningCompleted} · Building {progress.buildingCompleted} · Quizzes {progress.quizzesPassed} · Challenges {progress.challengesPassed}</p>{progress.latest&&<p>Latest: {progress.latest.title} · {progress.latest.mode}</p>}<ul>{progress.levels.map(l=><li key={l.level}>Level {l.level}: {l.status} · {l.completed}/{l.required}</li>)}</ul><h4 className="font-bold">Recent learning history</h4>{progress.history.length?<ul className="space-y-1">{progress.history.map((entry,i)=><li key={i} className="rounded-lg bg-sky-50 p-2"><p className="font-semibold">{entry.title}</p><p className="capitalize">{entry.mode} · {entry.status.replaceAll("-"," ")}{entry.position!==undefined?` · Page ${entry.position}`:""}</p><p className="text-xs">{new Date(entry.updatedAt).toLocaleString("en-MY",{timeZone:"Asia/Kuala_Lumpur"})} MYT</p></li>)}</ul>:<p>No committed activity yet.</p>}<p className="text-xs text-slate-500">Resume remains unavailable until course access is enabled.</p></section>;
}
export function J12345Profile(){
 const [state,setState]=useState<State>({kind:"loading"});
 const [version,reload]=useState(0);
 useEffect(()=>{
  const detach=attachJ5SessionSignals();
  const unsubscribe=j5Session.subscribe(({blocked})=>{setState({kind:blocked?"unauthorized":"loading"});reload(v=>v+1);});
  const timer=window.setInterval(()=>{if(document.visibilityState==="visible"&&!j5Session.isBlocked())reload(v=>v+1);},15000);
  return()=>{detach();unsubscribe();window.clearInterval(timer);};
 },[]);
 useEffect(()=>{
  if(j5Session.isBlocked()){setState({kind:"unauthorized"});return;}
  if(document.visibilityState!=="visible"){setState({kind:"loading"});return;}
  const t=j5Session.begin();
  const timeout=window.setTimeout(()=>{if(t.current()){setState({kind:"unavailable"});t.cancel();}},12000);
  async function load(){
   try{
    const r=await fetch("/api/dev/j5/profile",{method:"POST",credentials:"same-origin",cache:"no-store",redirect:"error",headers:{"X-STEM-Student-Profile":"1"},signal:t.signal});
    if(!t.current())return;
    if(r.status===401){setState({kind:"unauthorized"});return;}
    if(!r.ok){setState({kind:"unavailable"});return;}
    const p=parse(await r.json());
    if(t.current())setState({kind:"ready",profile:p});
   }catch{if(t.current())setState({kind:"unavailable"});}
   finally{window.clearTimeout(timeout);t.finish();}
  }
  void load();
  return()=>{window.clearTimeout(timeout);t.cancel();};
 },[version]);
 return <main className="h-full overflow-y-auto bg-[#f3faff] p-4 text-[#132654]"><section className="mx-auto max-w-lg space-y-4 rounded-3xl border border-sky-100 bg-white p-6 shadow-sm"><img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="mx-auto h-14"/><h1 className="text-xl font-black">My student profile</h1><p className="text-xs text-amber-900">Private development preview · fictional students only.</p>
 {state.kind==="loading"?<p role="status">Checking your identity…</p>:state.kind==="ready"?<><h2 className="text-2xl font-black">Welcome, {state.profile.displayName}</h2><p className="text-sm font-bold text-emerald-700">Individual student identity verified</p>{state.profile.access?<><section className="rounded-xl bg-sky-50 p-3 text-sm space-y-2"><h3 className="font-bold">Membership</h3><p className="capitalize">{state.profile.access.membership.replaceAll("-"," ")}</p>{state.profile.access.membershipValidUntil!==null&&<p>Valid until {new Date(state.profile.access.membershipValidUntil).toLocaleString("en-MY",{timeZone:"Asia/Kuala_Lumpur"})} MYT</p>}<h3 className="font-bold">Attendance</h3><p className="capitalize">{state.profile.access.attendance.replaceAll("-"," ")}</p></section>{state.profile.access.membershipEligible&&<StudentCheckIn key={state.profile.studentId} studentId={state.profile.studentId} onSettled={()=>reload(v=>v+1)}/>}<p className="rounded-xl bg-amber-50 p-3 text-sm">{state.profile.access.reason==="learning-policy-required"?"Attendance confirmed. Learning remains locked until the access policy is approved.":state.profile.access.reason==="membership-required"?"Ask your parent to arrange verified membership.":state.profile.access.reason==="check-in-required"?"Check in with staff before learning.":"Access could not be verified. Please contact staff."}</p></>:<p className="rounded-xl bg-sky-50 p-3 text-sm">Access status unavailable. No progress is assumed.</p>}{state.profile.progress&&<ProgressPanel key={state.profile.studentId} progress={state.profile.progress} onRefresh={()=>reload(v=>v+1)}/>}</>:<p role="alert">{state.kind==="unauthorized"?"Your student session is unavailable. Sign in again.":"Your profile could not be verified. Please retry."}</p>}
 <a href="/practical/levels" className="block rounded-xl border border-sky-200 p-3 text-center font-bold">Browse learning levels</a><button type="button" onClick={()=>j5Session.invalidate()} className="rounded-xl border px-3 py-2 text-sm font-bold">Refresh profile</button><J5SignOut/></section></main>;
}
