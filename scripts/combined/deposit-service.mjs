// Reserve before provider POST; uncertain requests are never automatically recreated.
import {randomUUID} from "node:crypto";
import {businessDay} from "../nizar/policy.mjs";
import {digest,depositBalance,monthlyNoShows,effectiveEligibility} from "../nizar/automation-state.mjs";
import {deposits} from "./deposit-state.mjs";
import {isChildId} from "../nizar/contract.mjs";
import {isAllowedSandboxCheckoutUrl} from "../hitpay/checkout-url.mjs";
const fail=status=>({ok:false,status}),id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
const same=(a,b)=>a&&b&&a.childId===b.childId&&a.parentId===b.parentId&&a.stateVersion===b.stateVersion;
export function createDepositService({repository,resolveChild,readEligibility,transport,clock=Date.now,newId=randomUUID}){
 async function checkout(actor,{childId,requestId}){
  if(!isChildId(childId)||!id(requestId))return fail("INVALID_INPUT");
  try{
   const owner=await resolveChild(actor,childId);if(owner?.childId!==childId)return fail("NOT_AUTHORIZED");
   const key=digest([owner.parentId,requestId]);let reserved=null;
   for(let i=0;i<8;i++){
    const snap=await repository.read(),s=snap.state,now=clock(),month=businessDay(now).slice(0,7);
    if(!same(owner,await resolveChild(actor,childId)))return fail("NOT_AUTHORIZED");
    const prior=deposits(s).find(r=>r.requestKey===key);
    if(prior)return prior.childId===childId&&prior.parentId===owner.parentId?{ok:true,status:prior.status==="settled"?"DEPOSIT_VERIFIED":"DEPOSIT_RECONCILIATION_PENDING"}:fail("REQUEST_ID_CONFLICT");
    if(deposits(s).some(r=>r.childId===childId&&r.status!=="settled"))return {ok:true,status:"DEPOSIT_RECONCILIATION_PENDING"};
    const e=effectiveEligibility(s,owner,await readEligibility(owner),now);
    if(e.membership!=="active"||e.deposit!=="required"||monthlyNoShows(s,childId,month)<2||depositBalance(s,childId,month).held!==0)return fail("DEPOSIT_NOT_REQUIRED");
    if(!same(owner,await resolveChild(actor,childId))||businessDay(clock()).slice(0,7)!==month)return fail("NOT_AUTHORIZED");
    const r={id:newId(),requestKey:key,childId,parentId:owner.parentId,month,createdAt:now,currency:"MYR",amountMinor:5000,status:"dispatching",providerId:null,paymentId:null,eventKey:null,paidAt:null};
    const result=await repository.compareAndSet(snap.version,{...s,deposits:[...deposits(s),r]});
    if(result.status==="conflict")continue;if(result.status!=="committed")return fail("DEPOSIT_RECONCILIATION_PENDING");reserved=r;break;
   }
   if(!reserved)return fail("BOOKING_BUSY");
   if(!same(owner,await resolveChild(actor,childId)))return fail("DEPOSIT_RECONCILIATION_PENDING");
   const snap=await repository.read(),e=effectiveEligibility(snap.state,owner,await readEligibility(owner),clock());
   if(e.membership!=="active"||e.deposit!=="required"||businessDay(clock()).slice(0,7)!==reserved.month)return fail("DEPOSIT_RECONCILIATION_PENDING");
   const p=await transport.create(reserved);
   if(!id(p?.providerId)||!isAllowedSandboxCheckoutUrl(p.url))return fail("DEPOSIT_RECONCILIATION_PENDING");
   for(let i=0;i<8;i++){
    const snap=await repository.read(),r=deposits(snap.state).find(x=>x.id===reserved.id);
    if(!r||r.status!=="dispatching"||deposits(snap.state).some(x=>x.providerId===p.providerId))return fail("DEPOSIT_RECONCILIATION_PENDING");
    const saved=await repository.compareAndSet(snap.version,{...snap.state,deposits:deposits(snap.state).map(x=>x.id===r.id?{...x,status:"pending",providerId:p.providerId}:x)});
    if(saved.status==="conflict")continue;if(saved.status!=="committed")return fail("DEPOSIT_RECONCILIATION_PENDING");
    if(!same(owner,await resolveChild(actor,childId)))return fail("NOT_AUTHORIZED");
    return {ok:true,status:"DEPOSIT_PAYMENT_PENDING",checkoutUrl:p.url};
   }
  }catch{}
  return fail("DEPOSIT_RECONCILIATION_PENDING");
 }
 return {checkout};
}
