import { useEffect,useRef,useState } from "react";
import {j5Session} from "./j5-session";
const privateJ5=import.meta.env["VITE_J5_PRIVATE_UI"]==="true";
import { activitySyncEnabled,recordActivity,LmsError,type ActivityMode } from "./wix-lms";

// Only explicit Finish actions write completion; never migrate existing browser state.
// This feature is off by default until the Wix site and OAuth flow are verified.
export function useActivitySync(projectId:string,mode:ActivityMode,ready:boolean,position?:number){
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const running=useRef(false);
  function message(cause:unknown){
    if(cause instanceof LmsError&&cause.status===401)return "Sign in to save your progress.";
    if(cause instanceof LmsError&&cause.code==="LEVEL_LOCKED")return "This level is locked.";
    if(cause instanceof LmsError&&cause.code==="STUDENT_NOT_INITIALIZED")return "Open your student dashboard to initialize your account, then retry.";
    return "Progress could not be saved. Please retry.";
  }
  useEffect(()=>{
    if(privateJ5||!activitySyncEnabled||!ready)return;
    const ctrl=new AbortController();
    recordActivity(projectId,mode,"start",ctrl.signal).catch(cause=>{
      if(!ctrl.signal.aborted)setError(message(cause));
    });
    return()=>ctrl.abort();
  },[projectId,mode,ready]);
  useEffect(()=>{
    if(!privateJ5||!ready||!position||!Number.isInteger(position))return;
    const ticket=j5Session.begin();
    const timer=window.setTimeout(()=>{if(!ticket.current())return;void (async()=>{try{const r=await fetch("/api/dev/j5/progress",{method:"POST",credentials:"same-origin",cache:"no-store",redirect:"error",headers:{"Content-Type":"application/json","X-STEM-J5":"1"},body:JSON.stringify({kind:"checkpoint",resourceId:projectId,mode,position}),signal:ticket.signal});const v=await r.json();if(ticket.current())setError(r.ok&&v?.ok===true?"":"Learning position not saved.");}catch{if(ticket.current())setError("Learning position not saved.");}finally{ticket.finish();}})();},350);
    return()=>{window.clearTimeout(timer);ticket.cancel();};
  },[projectId,mode,ready,position]);
  async function complete(){
    if(privateJ5){setError("Verified completion is not available yet. Your completion has not been saved.");return false;}
    if(!activitySyncEnabled)return true;
    if(running.current)return false;
    running.current=true;setBusy(true);setError("");
    try{
      // Retry start idempotently; no fabricated timestamps or historical completions.
      await recordActivity(projectId,mode,"start");
      const saved=await recordActivity(projectId,mode,"complete");
      if(saved.status!=="Completed"&&saved.status!=="ReferenceReviewed")throw new Error("Completion not confirmed");
      return true;
    }catch(cause){setError(message(cause));return false;}
    finally{running.current=false;setBusy(false);}
  }
  return {enabled:privateJ5||activitySyncEnabled,busy,error,complete};
}
