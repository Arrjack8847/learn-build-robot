// Shared J5 level projection and fail-closed display model. No progression rule is inferred.
export function projectLevelRows(rows,studentId,membership,checkIn){
 const states=["locked","unlocked","in-progress","completed"];
 const count=x=>Number.isSafeInteger(x)&&x>=0;
 if(!Array.isArray(rows)||rows.length!==6||!["active","inactive","pending","failed","expired","renewal-required","verification-required"].includes(membership)||!["required","verified","expired"].includes(checkIn))return null;
 const projected=[],seen=new Set();
 for(const l of rows){
  if(!l||l.studentId!==studentId||l.environment!=="private-preview"||!Number.isInteger(l.level)||l.level<1||l.level>6||seen.has(l.level)||!states.includes(l.status)||typeof l.allowed!=="boolean"||l.allowed===(l.status==="locked")||typeof l.checkInRequired!=="boolean"||!count(l.completed)||!count(l.required)||l.completed>l.required||(l.status==="completed"&&(l.required===0||l.completed!==l.required)))return null;
  seen.add(l.level);
  // Phase 6 protects every deeper course route. No exemption is approved.
  const reason=!l.allowed?"level-locked":membership!=="active"?"membership-required":checkIn!=="verified"?"check-in-required":null;
  projected.push({level:l.level,status:l.status,completed:l.completed,required:l.required,available:reason===null,reason});
 }
 return projected.sort((a,b)=>a.level-b.level);
}
export function validLevelProjection(rows,membership,checkIn){
 if(!Array.isArray(rows)||rows.length!==6)return false;
 const seen=new Set();
 for(const l of rows){
  if(!l||!Number.isInteger(l.level)||l.level<1||l.level>6||seen.has(l.level)||!["locked","unlocked","in-progress","completed"].includes(l.status)||!Number.isSafeInteger(l.completed)||!Number.isSafeInteger(l.required)||l.completed<0||l.required<0||l.completed>l.required||(l.status==="completed"&&(l.required===0||l.completed!==l.required)))return false;
  seen.add(l.level);
  const reason=l.status==="locked"?"level-locked":membership!=="active"?"membership-required":checkIn!=="verified"?"check-in-required":null;
  if(l.reason!==reason||l.available!==(reason===null))return false;
 }
 return true;
}
export function levelCardState(level,state,privateUI){
 if(!privateUI)return {open:true,label:null,progress:null,current:false};
 if(!Number.isInteger(level)||level<1||level>6||state?.kind!=="ready")return {open:false,label:state?.kind==="loading"?"Checking…":state?.kind==="unauthorized"?"Sign in required":"Unavailable",progress:null,current:false};
 const {profile,levels}=state.data??{};
 if(!profile||!validLevelProjection(levels,profile.membership,profile.checkIn))return {open:false,label:"Unavailable",progress:null,current:false};
 const row=levels.find(l=>l.level===level);
 if(!row)return {open:false,label:"Unavailable",progress:null,current:false};
 const label=row.reason==="level-locked"?"Locked":row.reason==="membership-required"?"Membership required":row.reason==="check-in-required"?"Check in first":row.status==="completed"?"Completed":row.status==="in-progress"?"In progress":"Ready";
 return {open:row.available,label,progress:row.required>0?{completed:row.completed,required:row.required}:null,current:profile.learning?.currentLevel===level&&row.status!=="locked"};
}
