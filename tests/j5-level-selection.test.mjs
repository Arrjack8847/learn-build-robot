import {test} from "node:test";
import {projectLevelRows,validLevelProjection,levelCardState} from "../src/lib/j5-level-selection.mjs";
function cases(){
 const eq=(a,b)=>{if(a!==b)throw Error(`Expected ${b}, got ${a}`)};
 const id="qa-a",base={studentId:id,environment:"private-preview"};
 const rows=()=>Array.from({length:6},(_,i)=>({...base,level:i+1,status:i===0?"in-progress":"locked",allowed:i===0,checkInRequired:true,completed:i===0?3:0,required:10}));
 const p=(r=rows(),m="active",c="verified")=>projectLevelRows(r,id,m,c);
 const state=(m="active",c="verified",r=rows())=>({kind:"ready",data:{profile:{membership:m,checkIn:c,learning:{currentLevel:1}},levels:p(r,m,c)}});
 return [
 ["six sorted rows and only level one open",()=>{const r=p(rows().reverse());eq(r.length,6);eq(r.map(x=>x.level).join(","),"1,2,3,4,5,6");eq(r.filter(x=>x.available).length,1)}],
 ["server-projected unlocked later level respected without inferred progression",()=>{const r=rows();r[4].allowed=true;r[4].status="unlocked";eq(levelCardState(5,state("active","verified",r),true).open,true);eq(levelCardState(2,state("active","verified",r),true).open,false)}],
 ["all restricted membership states retain actual progress",()=>{for(const m of ["inactive","pending","failed","expired","renewal-required","verification-required"]){const v=levelCardState(1,state(m),true);eq(v.open,false);eq(v.label,"Membership required");eq(v.progress.completed,3)}}],
 ["check-in required even if stale row advertises exemption",()=>{const r=rows();r[0].checkInRequired=false;eq(p(r,"active","required")[0].reason,"check-in-required");eq(levelCardState(1,state("active","expired",r),true).open,false)}],
 ["completion not equivalent to authorization",()=>{const r=rows();r[0].status="completed";r[0].completed=10;eq(levelCardState(1,state("active","verified",r),true).label,"Completed");eq(levelCardState(1,state("expired","verified",r),true).open,false)}],
 ["zero requirements do not invent progress or unlock",()=>{const r=rows();r[0].required=0;r[0].completed=0;eq(levelCardState(1,state("active","verified",r),true).progress,null);eq(levelCardState(2,state("active","verified",r),true).open,false)}],
 ["current level indication independent from entitlement",()=>{eq(levelCardState(1,state("expired"),true).current,true);eq(levelCardState(2,state(),true).current,false)}],
 ["unauthorized loading unavailable never render active links or stale progress",()=>{for(const kind of ["loading","unauthorized","unavailable"]){const v=levelCardState(1,{kind,data:state().data},true);eq(v.open,false);eq(v.progress,null);eq(v.current,false)}}],
 ["legacy mode remains unchanged",()=>eq(levelCardState(6,{kind:"loading"},false).open,true)],
 ["sibling, duplicate, missing, unsafe and contradictory rows rejected",()=>{for(const patch of [{studentId:"qa-b"},{environment:"production"},{level:2},{completed:11},{required:Number.MAX_SAFE_INTEGER+1},{status:"completed"},{allowed:false},{checkInRequired:"yes"}]){const r=rows();Object.assign(r[0],patch);eq(p(r),null)}eq(p(rows().slice(1)),null)}],
 ["forged overview availability fails closed for all six cards",()=>{const s=state();s.data.levels[1].available=true;s.data.levels[1].reason=null;eq(validLevelProjection(s.data.levels,"active","verified"),false);eq(levelCardState(1,s,true).open,false);eq(levelCardState(2,s,true).open,false)}],
 ["active without verified check-in cannot be advertised",()=>{const s=state();s.data.profile.checkIn="expired";eq(validLevelProjection(s.data.levels,"active","expired"),false);eq(levelCardState(1,s,true).open,false)}],
 ["unknown progress and invalid completion fail closed",()=>{const s=state();s.data.levels[0].completed=NaN;eq(levelCardState(1,s,true).progress,null);const r=rows();r[0].required=0;r[0].completed=0;r[0].status="completed";eq(p(r),null)}],
 ["every valid state consistent across both projection and client",()=>{for(const m of ["active","inactive","pending","failed","expired","renewal-required","verification-required"])for(const c of ["required","verified","expired"]){const s=state(m,c);eq(validLevelProjection(s.data.levels,m,c),true);eq(levelCardState(1,s,true).open,m==="active"&&c==="verified")}}]
 ];
}
for(const [name,run] of cases())test(name,run);
