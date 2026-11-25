// Isolated, one-shot sandbox checkout. This is NOT a family membership checkout.
const collection="SandboxCheckoutTrials";
const trialId="stem-lab-checkout-v1";
const reference="stem-lab-checkout-v1";
export function createSandboxTrial({store,provider,planId,newVersion,clock}){
  const fail=status=>({ok:false,status});
  function valid(row){
    return row?.planId===planId&&row.providerReference===reference&&typeof row.stateVersion==="string"&&row.stateVersion.length>0;
  }
  function present(row){
    if(!valid(row))return fail("RECONCILIATION_REQUIRED");
    if(row.status==="hosted"&&typeof row.providerSubscriptionId==="string"&&/^[0-9a-f-]{36}$/i.test(row.providerSubscriptionId)&&provider.isAllowedCheckoutUrl(row.checkoutUrl)){
      return {ok:true,status:"HOSTED",checkoutUrl:row.checkoutUrl};
    }
    return fail("RECONCILIATION_REQUIRED");
  }
  async function status(){
    const row=await store.get(collection,trialId);
    if(row)return present(row);
    const plan=await provider.getVerifiedFixturePlan();
    if(!plan||plan.planId!==planId||plan.amountMinor!==36000||plan.currency!=="MYR"||plan.cycle!=="monthly")return fail("PLAN_NOT_VERIFIED");
    return {ok:true,status:"READY"};
  }
  async function open(){
    const existing=await store.get(collection,trialId);
    if(existing)return present(existing);
    const plan=await provider.getVerifiedFixturePlan();
    if(!plan||plan.planId!==planId||plan.amountMinor!==36000||plan.currency!=="MYR"||plan.cycle!=="monthly"||plan.chargeCount!==2)return fail("PLAN_NOT_VERIFIED");
    const reservation={planId,providerReference:reference,status:"reserved",stateVersion:newVersion(),createdAt:{$date:new Date(clock.now()).toISOString()}};
    // Only the winner of a durable insert may call the external POST.
    // Ambiguous inserts, timeouts or failed binds never permit automatic retry.
    if(await store.insert(collection,trialId,reservation)!==true){
      const winner=await store.get(collection,trialId);
      return present(winner);
    }
    try{
      const result=await provider.createHostedSubscription({planId,customerEmail:"stem-lab-sandbox@example.invalid",reference});
      if(!result||!provider.isAllowedCheckoutUrl(result.url)||!(/^[0-9a-f-]{36}$/i.test(result.subscriptionId)))return fail("RECONCILIATION_REQUIRED");
      const next={...reservation,stateVersion:newVersion(),status:"hosted",providerSubscriptionId:result.subscriptionId,checkoutUrl:result.url};
      if(await store.replaceIfVersion(collection,trialId,reservation.stateVersion,next)!==true)return fail("RECONCILIATION_REQUIRED");
      return present(next);
    }catch{return fail("RECONCILIATION_REQUIRED");}
  }
  return {status,open};
}
