import {useEffect,useState,type ReactNode} from "react";
import {useRouterState} from "@tanstack/react-router";
import {classifyCoursePath} from "@/lib/j5-course-path.mjs";
import {attachJ5SessionSignals,j5Session} from "@/lib/j5-session";
type GateState={kind:"loading"}|{kind:"allowed";until:number}|{kind:"denied";code:string};
export function J5CourseGate({children}:{children:ReactNode}){
 const pathname=useRouterState({select:s=>s.location.pathname});
 if(import.meta.env["VITE_J5_PRIVATE_UI"]!=="true")return <>{children}</>;
 const route=classifyCoursePath(pathname);
 if(route.scope==="outside"||route.scope==="shell")return <>{children}</>;
 return <ProtectedCourse key={pathname} path={pathname}>{children}</ProtectedCourse>;
}
function ProtectedCourse({path,children}:{path:string;children:ReactNode}){
 const [state,setState]=useState<GateState>({kind:"loading"}),[version,refresh]=useState(0);
 useEffect(()=>{
  const detach=attachJ5SessionSignals();
  const unsub=j5Session.subscribe(({blocked})=>{setState(blocked?{kind:"denied",code:"STUDENT_AUTH_REQUIRED"}:{kind:"loading"});refresh(v=>v+1);});
  // Routine revalidation must not abort unrelated requests or unmount a valid lesson.
  const poll=window.setInterval(()=>{if(document.visibilityState==="visible"&&!j5Session.isBlocked())refresh(v=>v+1);},15000);
  return()=>{detach();unsub();window.clearInterval(poll);};
 },[]);
 useEffect(()=>{
  if(j5Session.isBlocked()){setState({kind:"denied",code:"STUDENT_AUTH_REQUIRED"});return;}
  if(document.visibilityState!=="visible")return;
  const ticket=j5Session.begin();
  const timeout=window.setTimeout(()=>{if(ticket.current()){setState({kind:"denied",code:"COURSE_UNAVAILABLE"});ticket.cancel();}},5000);
  void (async()=>{
   try{
    const response=await fetch("/api/dev/j5/course-access?path="+encodeURIComponent(path),{credentials:"same-origin",cache:"no-store",redirect:"error",headers:{"X-STEM-J5":"1"},signal:ticket.signal});
    const data=await response.json();
    if(!ticket.current())return;
    if(response.ok&&data?.ok===true&&data.code==="COURSE_AUTHORIZED"&&Number.isSafeInteger(data.validUntil)&&data.validUntil>Date.now()){setState({kind:"allowed",until:data.validUntil});return;}
    setState({kind:"denied",code:response.status===401?"STUDENT_AUTH_REQUIRED":typeof data?.code==="string"?data.code:"COURSE_UNAVAILABLE"});
   }catch{if(ticket.current())setState({kind:"denied",code:"COURSE_UNAVAILABLE"});}
   finally{window.clearTimeout(timeout);ticket.finish();}
  })();
  return()=>{window.clearTimeout(timeout);ticket.cancel();};
 },[path,version]);
 useEffect(()=>{
  if(state.kind!=="allowed")return;
  const timer=window.setTimeout(()=>j5Session.invalidate(),Math.min(2147483647,Math.max(0,state.until-Date.now())));
  return()=>window.clearTimeout(timer);
 },[state]);
 if(state.kind==="allowed")return <>{children}</>;
 const code=state.kind==="denied"?state.code:"";
 const text=code==="LEARNING_SESSION_EXPIRED"?"Your one-hour learning session has ended. Please speak to staff.":code==="LEARNING_POLICY_REQUIRED"?"Learning access is not activated yet.":code==="STUDENT_AUTH_REQUIRED"?"Sign in to continue.":code==="MEMBERSHIP_REQUIRED"?"Ask your parent or guardian about your membership.":code==="CHECK_IN_REQUIRED"?"Please check in at the Lab.":code==="LEVEL_LOCKED"?"This level is not available yet.":"Learning access is unavailable right now.";
 return <main className="grid h-full place-items-center overflow-y-auto bg-[#f3faff] p-5 text-[#132654]"><section className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 text-center shadow-sm"><h1 className="text-2xl font-black">Learning access</h1><p role="status">{state.kind==="loading"?"Checking your learning access…":text}</p><div className="flex flex-wrap justify-center gap-3">{code==="STUDENT_AUTH_REQUIRED"?<a href="/auth/" className="rounded-xl bg-sky-700 px-4 py-3 font-bold text-white">Sign in</a>:code==="CHECK_IN_REQUIRED"?<a href="/student/dashboard" className="rounded-xl bg-sky-700 px-4 py-3 font-bold text-white">Check in</a>:null}<a href="/student/dashboard" className="rounded-xl border border-sky-200 px-4 py-3 font-bold">My profile</a><a href="/practical/levels" className="rounded-xl border border-sky-200 px-4 py-3 font-bold">Learning levels</a><button type="button" onClick={()=>j5Session.invalidate()} className="rounded-xl border border-sky-200 px-4 py-3 font-bold">Check again</button></div></section></main>;
}
