import {z} from "zod";
import {useEffect,useState} from "react";

const stamp=z.number().int().nonnegative().max(8640000000000000);
const level=z.object({level:z.number().int().min(1).max(6),status:z.enum(["locked","unlocked","in-progress","completed"]),completed:z.number().int().nonnegative(),required:z.number().int().nonnegative(),available:z.boolean(),reason:z.enum(["level-locked","membership-required","check-in-required"]).nullable()}).refine(l=>l.completed<=l.required&&l.available===(l.reason===null)&&(!l.available||l.status!=="locked"));
const overview=z.object({ok:z.literal(true),profile:z.object({displayName:z.string().min(1).max(120),studentCode:z.string().min(1),accountStatus:z.literal("active"),membership:z.enum(["active","inactive","pending","failed","expired","renewal-required"]),validUntil:stamp.nullable(),checkIn:z.enum(["required","verified","expired"]),checkInUntil:stamp.nullable()}),levels:z.array(level).length(6).refine(rows=>new Set(rows.map(r=>r.level)).size===6)}).superRefine((d,ctx)=>{
 if(d.levels.some(l=>l.available)&&d.profile.membership!=="active")ctx.addIssue({code:"custom",message:"Inconsistent eligibility"});
 if(d.profile.membership==="active"&&d.profile.validUntil===null)ctx.addIssue({code:"custom",message:"Missing validity"});
 if(d.profile.checkIn==="verified"&&d.profile.checkInUntil===null)ctx.addIssue({code:"custom",message:"Missing check-in validity"});
});
export type J5Overview=z.infer<typeof overview>;
export type J5Level=J5Overview["levels"][number];
export const j5PrivateUI=import.meta.env.VITE_J5_PRIVATE_UI==="true";
export const membershipCopy:Record<J5Overview["profile"]["membership"],{title:string;detail:string}>={
 active:{title:"Active membership",detail:"Your membership is ready."},
 inactive:{title:"Membership required",detail:"Ask your parent or guardian to arrange your membership. Your learning progress is safe."},
 pending:{title:"Payment pending",detail:"Your membership is waiting for payment verification."},
 failed:{title:"Payment not confirmed",detail:"Ask your parent or guardian for help. Your progress is safe."},
 expired:{title:"Membership expired",detail:"Ask your parent or guardian to renew your membership. Your progress is safe."},
 "renewal-required":{title:"Renewal required",detail:"Ask your parent or guardian to renew your membership. Your progress is safe."}
};
type State={kind:"loading"}|{kind:"unauthorized"}|{kind:"unavailable"}|{kind:"ready";data:J5Overview};
export function useJ5Overview(enabled:boolean){
 const [state,setState]=useState<State>({kind:"loading"});
 const [version,reload]=useState(0);
 useEffect(()=>{
  if(!enabled)return;
  const ctrl=new AbortController();setState({kind:"loading"});
  const load=async()=>{
   try{
    const response=await fetch("/api/dev/j5/overview",{credentials:"same-origin",cache:"no-store",redirect:"error",signal:ctrl.signal});
    if(ctrl.signal.aborted)return;
    if(response.status===401){setState({kind:"unauthorized"});return;}
    if(!response.ok){setState({kind:"unavailable"});return;}
    const data=overview.parse(await response.json());
    if(!ctrl.signal.aborted)setState({kind:"ready",data});
   }catch{if(!ctrl.signal.aborted)setState({kind:"unavailable"});}
  };
  void load();
  return()=>ctrl.abort();
 },[enabled,version]);
 useEffect(()=>{
  if(!enabled||state.kind!=="ready")return;
  const times=[state.data.profile.membership==="active"?state.data.profile.validUntil:null,state.data.profile.checkIn==="verified"?state.data.profile.checkInUntil:null].filter((v):v is number=>v!==null);
  if(!times.length)return;
  const delay=Math.min(2147483647,Math.max(1000,Math.min(...times)-Date.now()));
  const timer=window.setTimeout(()=>{setState({kind:"loading"});reload(v=>v+1);},delay);
  return()=>window.clearTimeout(timer);
 },[enabled,state]);
 useEffect(()=>{
  if(!enabled)return;
  const refresh=()=>{if(document.visibilityState==="visible"){setState({kind:"loading"});reload(v=>v+1);}};
  window.addEventListener("pageshow",refresh);document.addEventListener("visibilitychange",refresh);
  return()=>{window.removeEventListener("pageshow",refresh);document.removeEventListener("visibilitychange",refresh);};
 },[enabled]);
 return {state,refresh:()=>{setState({kind:"loading"});reload(v=>v+1);}};
}
export function levelLabel(l:J5Level){
 return l.reason==="membership-required"?"Membership required":l.reason==="check-in-required"?"Check in first":l.reason==="level-locked"?"Locked":l.status==="completed"?"Completed":l.status==="in-progress"?"In progress":"Ready";
}
export function levelHref(n:number){return n===1?"/practical/level-1":"/practical/levels/"+n;}
