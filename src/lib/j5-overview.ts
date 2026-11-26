import {z} from "zod";
import {validLevelProjection} from "./j5-level-selection.mjs";
import {useEffect,useState} from "react";
import {attachJ5SessionSignals,j5Session} from "./j5-session";

const stamp=z.number().int().nonnegative().max(8640000000000000);
const level=z.object({level:z.number().int().min(1).max(6),status:z.enum(["locked","unlocked","in-progress","completed"]),completed:z.number().int().nonnegative(),required:z.number().int().nonnegative(),available:z.boolean(),reason:z.enum(["level-locked","membership-required","check-in-required"]).nullable()}).refine(l=>l.completed<=l.required&&l.available===(l.reason===null)&&(!l.available||l.status!=="locked"));
const count=z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const learning=z.object({currentLevel:z.number().int().min(1).max(6),overallCompleted:count,overallRequired:count,learningCompleted:count,buildingCompleted:count,quizzesPassed:count,challengesPassed:count,latest:z.object({title:z.string().trim().min(1).max(160),mode:z.enum(["learning","building","quiz","challenge"]),updatedAt:stamp}).nullable()}).refine(s=>s.overallCompleted<=s.overallRequired);
const overview=z.object({ok:z.literal(true),profile:z.object({displayName:z.string().min(1).max(120),studentCode:z.string().min(1),accountStatus:z.literal("active"),membership:z.enum(["active","inactive","pending","failed","expired","renewal-required","verification-required"]),validUntil:stamp.nullable(),checkIn:z.enum(["required","verified","expired"]),checkInUntil:stamp.nullable(),learning:learning.optional()}),levels:z.array(level).length(6).refine(rows=>new Set(rows.map(r=>r.level)).size===6)}).superRefine((d,ctx)=>{
 if(!validLevelProjection(d.levels,d.profile.membership,d.profile.checkIn))ctx.addIssue({code:"custom",message:"Inconsistent level eligibility"});
 if(d.profile.membership==="active"&&d.profile.validUntil===null)ctx.addIssue({code:"custom",message:"Missing validity"});
 if(d.profile.checkIn==="verified"&&d.profile.checkInUntil===null)ctx.addIssue({code:"custom",message:"Missing check-in validity"});
 if(d.profile.learning&&d.levels.find(l=>l.level===d.profile.learning?.currentLevel)?.status==="locked")ctx.addIssue({code:"custom",message:"Current level is locked"});
});
export type J5Overview=z.infer<typeof overview>;
export type J5Level=J5Overview["levels"][number];
export const j5PrivateUI=import.meta.env["VITE_J5_PRIVATE_UI"]==="true";
export const membershipCopy:Record<J5Overview["profile"]["membership"],{title:string;detail:string}>={
 active:{title:"Active membership",detail:"Your membership is ready."},
 inactive:{title:"Membership required",detail:"Ask your parent or guardian to arrange your membership. Your learning progress is safe."},
 pending:{title:"Payment pending",detail:"Your membership is waiting for payment verification."},
 failed:{title:"Payment not confirmed",detail:"Ask your parent or guardian for help. Your progress is safe."},
 expired:{title:"Membership expired",detail:"Ask your parent or guardian to renew your membership. Your progress is safe."},
 "renewal-required":{title:"Renewal required",detail:"Ask your parent or guardian to renew your membership. Your progress is safe."},
 "verification-required":{title:"Membership needs verification",detail:"Ask your parent or guardian to contact staff. Your progress is safe."}
};
type State={kind:"loading"}|{kind:"unauthorized"}|{kind:"unavailable"}|{kind:"ready";data:J5Overview};
export function useJ5Overview(enabled:boolean){
 const [state,setState]=useState<State>({kind:"loading"});
 const [version,reload]=useState(0);
 useEffect(()=>{
  if(!enabled)return;
  const detach=attachJ5SessionSignals();
  const unsubscribe=j5Session.subscribe(({blocked})=>{setState({kind:blocked?"unauthorized":"loading"});reload(v=>v+1);});
  // Poll only this read model; do not clear an in-progress check-in form or abort writes.
  const timer=window.setInterval(()=>{if(document.visibilityState==="visible"&&!j5Session.isBlocked())reload(v=>v+1);},30000);
  return()=>{detach();unsubscribe();window.clearInterval(timer);};
 },[enabled]);
 useEffect(()=>{
  if(!enabled)return;
  if(j5Session.isBlocked()){setState({kind:"unauthorized"});return;}
  if(document.visibilityState!=="visible"){setState({kind:"loading"});return;}
  const ticket=j5Session.begin();
  const timeout=window.setTimeout(()=>{if(ticket.current()){setState({kind:"unavailable"});ticket.cancel();}},5000);
  const load=async()=>{
   try{
    const response=await fetch("/api/dev/j5/overview",{credentials:"same-origin",cache:"no-store",redirect:"error",signal:ticket.signal});
    if(!ticket.current())return;
    if(response.status===401){setState({kind:"unauthorized"});return;}
    if(!response.ok){setState({kind:"unavailable"});return;}
    const data=overview.parse(await response.json());
    if(ticket.current())setState({kind:"ready",data});
   }catch{if(ticket.current())setState({kind:"unavailable"});}
   finally{window.clearTimeout(timeout);ticket.finish();}
  };
  void load();
  return()=>{window.clearTimeout(timeout);ticket.cancel();};
 },[enabled,version]);
 useEffect(()=>{
  if(!enabled||state.kind!=="ready")return;
  const times=[state.data.profile.membership==="active"?state.data.profile.validUntil:null,state.data.profile.checkIn==="verified"?state.data.profile.checkInUntil:null].filter((v):v is number=>v!==null);
  if(!times.length)return;
  const delay=Math.min(2147483647,Math.max(1000,Math.min(...times)-Date.now()));
  const timer=window.setTimeout(()=>j5Session.invalidate(),delay);
  return()=>window.clearTimeout(timer);
 },[enabled,state]);
 return {state,refresh:()=>j5Session.invalidate()};
}
export function levelLabel(l:J5Level){
 return l.reason==="membership-required"?"Membership required":l.reason==="check-in-required"?"Check in first":l.reason==="level-locked"?"Locked":l.status==="completed"?"Completed":l.status==="in-progress"?"In progress":"Ready";
}
export function levelHref(n:number){return n===1?"/practical/level-1":"/practical/levels/"+n;}
