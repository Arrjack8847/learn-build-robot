import {test} from "node:test";
import {evaluateMembership,normalizeJ3Membership} from "../scripts/j5/membership-policy.mjs";
function cases(){
 const eq=(a,b)=>{if(a!==b)throw Error(`Expected ${b}, got ${a}`)};
 const base={studentId:"a",environment:"private-preview",status:"active",eligible:true,validFrom:1000,validUntil:3000},now=2000;
 const check=(row,n=now)=>evaluateMembership(row,"a",n);
 const j3={studentId:"a",membershipStatus:"active",verifiedLearningEligibility:true,activatedAt:1000,validUntil:3000};
 const bridge=o=>normalizeJ3Membership({studentId:"a",observation:o,now});
 const rejects=fn=>{try{fn()}catch{return;}throw Error("Expected rejection");};
 return [
 ["active only inside validity",()=>{eq(check(base).eligible,true);eq(check(base,1000).status,"active");eq(check(base,3000).status,"expired");eq(check(base,999).status,"inactive")}],
 ["missing membership is inactive",()=>eq(check(null).status,"inactive")],
 ["all denied states remain denied",()=>{for(const status of ["inactive","pending","failed","expired","renewal-required","verification-required"]){eq(check({...base,status,eligible:false}).status,status);eq(check({...base,status,eligible:false}).eligible,false)}}],
 ["contradictory flags are unavailable",()=>eq(check({...base,status:"pending"}).status,"unavailable")],
 ["another student denied",()=>eq(check({...base,studentId:"b"}).eligible,false)],
 ["wrong environment denied",()=>eq(check({...base,environment:"production"}).eligible,false)],
 ["invalid validity denied",()=>{for(const patch of [{validFrom:3000},{validUntil:NaN},{validUntil:8640000000000001},{validFrom:1000.5},{eligible:"true"}])eq(check({...base,...patch}).status,"unavailable")}],
 ["ineligible active authority denied",()=>eq(check({...base,eligible:false}).status,"inactive")],
 ["invalid clock denied",()=>eq(check(base,NaN).status,"unavailable")],
 ["fresh committed-status bridge",()=>{const r=bridge(j3);eq(r.validFrom,now);eq(check(r).eligible,true);eq(check(r,now-1).eligible,false);eq(check(r,3000).eligible,false)}],
 ["pending, inactive, review states bridge",()=>{for(const [a,b] of [["payment_pending","pending"],["inactive","inactive"],["verification_required","verification-required"]])eq(check(bridge({...j3,membershipStatus:a,verifiedLearningEligibility:false})).status,b)}],
 ["expired bridge preserves date",()=>{const r=bridge({...j3,membershipStatus:"expired",verifiedLearningEligibility:false,validUntil:now});eq(check(r).validUntil,now);eq(check(r).eligible,false)}],
 ["foreign J3 status denied",()=>rejects(()=>bridge({...j3,studentId:"b"}))],
 ["unverified active denied",()=>rejects(()=>bridge({...j3,verifiedLearningEligibility:false}))],
 ["expired or future active observation denied",()=>{rejects(()=>bridge({...j3,validUntil:now}));rejects(()=>bridge({...j3,activatedAt:now+1}))}],
 ["candidate, webhook, unknown status denied",()=>{for(const status of ["verified_candidate","charge.created","paid","refunded","__proto__"])rejects(()=>bridge({...j3,membershipStatus:status,verifiedLearningEligibility:false}))}],
 ["pending cannot grant access",()=>rejects(()=>bridge({...j3,membershipStatus:"payment_pending"}))],
 ["false expiry not accepted",()=>rejects(()=>bridge({...j3,membershipStatus:"expired",verifiedLearningEligibility:false}))]
 ];
}
for(const [name,run] of cases())test(name,run);
