// J3.4–J3.7 server-only billing foundation. NOT mounted as a public route.
// No live payment or personal data. Dependencies are explicit release gates.
// Time values are epoch milliseconds; adapters map to Wix DATETIME fields.
// See docs/j3-payment-release-gate-20261125.md.
export function createBillingCore({env,identity,store,provider,clock,ids,signatures}) {
  const fail=error=>({ok:false,error});
  const safe=()=>env.VERCEL_ENV!=="production"&&env.VERCEL_TARGET_ENV!=="production"&&env.HITPAY_API_BASE_URL==="https://api.sandbox.hit-pay.com";
  const id=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
  const month=x=>typeof x==="string"&&/^\d{4}-(0[1-9]|1[0-2])$/.test(x);
  const time=x=>Number.isSafeInteger(x)&&x>0;
  const exact=(o,keys)=>o&&typeof o==="object"&&!Array.isArray(o)&&Object.keys(o).length===keys.length&&keys.every(k=>Object.prototype.hasOwnProperty.call(o,k));
  const goodEmail=x=>typeof x==="string"&&x.length<255&&/^[^\s@]+@example\.invalid$/i.test(x);
  // Sandbox development only. Fixture email cannot be delivered to a real family.
  // A real HTTP adapter must validate CSRF, trusted session, approved terms and consent.
  async function checkout(context,input) {
    if(!safe())return fail("SANDBOX_REQUIRED");
    if(!exact(input,["childId","requestKey"])||!id(input.childId)||!id(input.requestKey))return fail("INVALID_INPUT");
    const parent=await identity.resolveParent(context);
    if(!parent||parent.accountType!=="parent"||!id(parent.parentId)||parent.emailVerified!==true||!goodEmail(parent.email))return fail("NOT_AUTHORIZED");
    const child=await store.getOwnedActiveChild(parent.parentId,input.childId);
    if(!child||child.childId!==input.childId||child.parentId!==parent.parentId)return fail("CHILD_NOT_FOUND");
    if(!await identity.hasCurrentConsentAndTerms(parent.parentId))return fail("CONSENT_REQUIRED");
    // Must validate sandbox plan against provider (amount/currency/cycle/two charges).
    const plan=await provider.getVerifiedFixturePlan();
    if(!plan||!id(plan.planId)||plan.amountMinor!==36000||plan.currency!=="MYR"||plan.cycle!=="monthly"||plan.chargeCount!==2)return fail("PLAN_NOT_VERIFIED");
    // Atomic reservation across BOTH request key and membership: no parallel subscriptions.
    // Must return an existing attempt rather than issuing a second external POST.
    const reserved=await store.reserveCheckout({environment:"sandbox",parentId:parent.parentId,childId:child.childId,requestKey:input.requestKey,planId:plan.planId,expectedAmountMinor:36000,currency:"MYR",providerReference:ids.reference(),createdAt:clock.now()});
    if(!reserved||!reserved.attempt||!id(reserved.attempt.id)||!id(reserved.attempt.providerReference)||reserved.attempt.parentId!==parent.parentId||reserved.attempt.childId!==child.childId||reserved.attempt.environment!=="sandbox")return fail("CHECKOUT_UNAVAILABLE");
    const attempt=reserved.attempt;
    if(!reserved.created)return {ok:true,status:"pending",attemptId:attempt.id};
    // No automatic retry on an ambiguous timeout. Keep reservation for reconciliation.
    try{
      const created=await provider.createHostedSubscription({planId:plan.planId,customerEmail:parent.email,reference:attempt.providerReference});
      if(!created||!id(created.subscriptionId)||!provider.isAllowedCheckoutUrl(created.url))return fail("RECONCILIATION_REQUIRED");
      const bound=await store.bindCheckoutOnce(attempt.id,created.subscriptionId);
      if(bound!==true)return fail("RECONCILIATION_REQUIRED");
      return {ok:true,status:"pending",attemptId:attempt.id,checkoutUrl:created.url};
    }catch{return fail("RECONCILIATION_REQUIRED");}
  }
  // Receives original bytes; no parsed/re-serialized payloads.
  // Signed payload has no trusted event envelope; headers are hints only.
  // Store the digest and minimal event metadata, never raw card/customer fields.
  async function receive(raw,signature,objectHint,typeHint) {
    if(!safe())return fail("SANDBOX_REQUIRED");
    if(typeof env.HITPAY_WEBHOOK_SALT!=="string"||!env.HITPAY_WEBHOOK_SALT.trim())return fail("WEBHOOK_NOT_CONFIGURED");
    if(!raw||!Number.isInteger(raw.byteLength)||raw.byteLength<2||raw.byteLength>262144||typeof signature!=="string"||!/^[a-f0-9]{64}$/i.test(signature))return fail("INVALID_SIGNATURE");
    if(!signatures.verify(raw,signature,env.HITPAY_WEBHOOK_SALT))return fail("INVALID_SIGNATURE");
    let body;
    try{body=JSON.parse(signatures.decode(raw));}catch{return fail("INVALID_PAYLOAD");}
    if(!body||!id(body.id)||!id(env.HITPAY_BUSINESS_ID)||body.business_id!==env.HITPAY_BUSINESS_ID)return fail("UNMATCHED_MERCHANT");
    const hint=String(objectHint)+"."+String(typeHint);
    const allowed=["charge.created","charge.updated","charge.failed","recurring_billing.subscription_updated","recurring_billing.method_attached","recurring_billing.method_detached"];
    if(!allowed.includes(hint))return {ok:true,status:"ignored"};
    const digest=signatures.digest(raw);
    if(typeof digest!=="string"||!/^[a-f0-9]{64}$/.test(digest))return fail("INVALID_DIGEST");
    const entry={environment:"sandbox",providerEventKey:digest,eventType:hint,providerObjectId:body.id,payloadDigest:digest,receivedAt:clock.now(),signatureVerifiedAt:clock.now(),processingStatus:"pending"};
    // Atomic insert by deterministic digest; replay must not re-open a processed event.
    const saved=await store.insertVerifiedEventOnce(entry);
    if(!saved||saved.environment!=="sandbox"||saved.payloadDigest!==digest)return fail("PERSISTENCE_FAILED");
    return {ok:true,status:"accepted",eventKey:digest};
  }
  // Internal worker only. Never accept normalized observations from a browser.
  // Provider adapter must re-fetch authenticated provider records, prove the exact
  // charge -> subscription relationship and billing period; no email-only matching.
  // Official sample charge omits a subscription ID, so unresolved events stay pending.
  async function reconcile(eventKey) {
    if(!safe()||typeof eventKey!=="string"||!/^[a-f0-9]{64}$/.test(eventKey))return fail("INVALID_EVENT");
    const event=await store.getVerifiedEventStrong(eventKey);
    if(!event||event.environment!=="sandbox"||event.payloadDigest!==eventKey||!time(event.signatureVerifiedAt))return fail("UNVERIFIED_EVENT");
    if(event.processingStatus==="processed")return {ok:true,status:"duplicate"};
    const o=await provider.reconcileVerifiedEvent(event);
    if(!o||o.environment!=="sandbox"||o.businessId!==env.HITPAY_BUSINESS_ID||o.eventKey!==eventKey||!id(o.subscriptionId)||!time(o.occurredAt)||!Number.isSafeInteger(o.cycleNumber)||o.cycleNumber<1||o.cycleNumber>2)return fail("RECONCILIATION_REQUIRED");
    if(!["paid","failed","cancelled","refunded"].includes(o.kind))return fail("RECONCILIATION_REQUIRED");
    if(o.kind!=="cancelled"&&(!id(o.paymentId)||o.amountMinor!==36000||o.currency!=="MYR"||!month(o.coveredMonth)||!time(o.periodEndAt)||o.periodEndAt<=o.occurredAt&&o.kind==="paid"))return fail("PAYMENT_MISMATCH");
    // The transaction must commit payment ledger, membership projection, outbox and
    // event completion together (or implement durable replay-safe equivalent).
    // Never implement this as independent unguarded Wix writes.
    return store.transaction(async tx=>{
      const fresh=await tx.getEvent(eventKey);
      if(!fresh||fresh.environment!=="sandbox"||fresh.payloadDigest!==eventKey||!time(fresh.signatureVerifiedAt))return fail("UNVERIFIED_EVENT");
      if(fresh.processingStatus==="processed")return {ok:true,status:"duplicate"};
      const m=await tx.getMembershipBySubscription("sandbox",o.subscriptionId);
      if(!m||m.environment!=="sandbox"||m.providerSubscriptionId!==o.subscriptionId||!id(m.id)||!id(m.childId)||!id(m.parentId))return fail("UNMATCHED_SUBSCRIPTION");
      // Older events cannot change a newer membership projection. Same timestamp
      // conflicting events fail closed for review. Refund only revokes matching cycle.
      if(o.cycleNumber<(m.lastCycle??0)||o.occurredAt<(m.lastProviderOccurredAt??0)){
        return fail("STALE_EVENT_REVIEW_REQUIRED");
      }
      if(o.cycleNumber===(m.lastCycle??0)&&o.occurredAt===(m.lastProviderOccurredAt??0)&&m.lastKind!==o.kind)return fail("ORDER_CONFLICT");
      const key=o.kind==="cancelled"?"cancel:"+o.subscriptionId+":"+o.occurredAt:o.paymentId;
      const existing=await tx.getPayment("sandbox",key);
      if(existing&&(existing.membershipId!==m.id||existing.providerSubscriptionId!==o.subscriptionId||existing.childId!==m.childId||existing.parentId!==m.parentId||existing.amountMinor!==o.amountMinor||existing.currency!==o.currency||existing.coveredMonth!==o.coveredMonth))return fail("PAYMENT_CONFLICT");
      if(existing&&existing.status===o.kind){await tx.completeEvent(eventKey,"duplicate");return {ok:true,status:"duplicate"};}
      if(existing&&existing.status==="refunded")return fail("REFUND_REVIEW_REQUIRED");
      if(o.kind==="refunded"&&(!existing||existing.status!=="paid"))return fail("REFUND_REVIEW_REQUIRED");
      if(o.kind==="paid"&&m.subscriptionStatus==="cancelled")return fail("CANCELLED_REVIEW_REQUIRED");
      if(o.kind==="paid"&&m.lastCycle===o.cycleNumber&&m.lastKind==="paid"&&m.lastPaymentId!==o.paymentId)return fail("DOUBLE_CHARGE_REVIEW_REQUIRED");
      if(o.kind==="cancelled"){
        await tx.patchMembership(m.id,{subscriptionStatus:"cancelled",paymentStatus:"unpaid",nextChargeAt:null,lastCycle:o.cycleNumber,lastProviderOccurredAt:o.occurredAt,lastKind:o.kind});
        await tx.completeEvent(eventKey,"processed");
        return {ok:true,status:"cancelled"};
      }
      const payment={id:key,environment:"sandbox",membershipId:m.id,childId:m.childId,parentId:m.parentId,providerPaymentId:o.paymentId,providerSubscriptionId:o.subscriptionId,amountMinor:o.amountMinor,currency:o.currency,coveredMonth:o.coveredMonth,status:o.kind,providerOccurredAt:o.occurredAt,verifiedAt:clock.now()};
      await tx.putPaymentOnceOrTransition(payment,existing?.status??null);
      const patch={paymentStatus:o.kind==="paid"?"paid":"unpaid",lastCycle:o.cycleNumber,lastProviderOccurredAt:o.occurredAt,lastKind:o.kind,lastPaymentId:o.paymentId};
      if(o.kind==="paid")Object.assign(patch,{paidThroughMonth:o.coveredMonth,paidThroughAt:o.periodEndAt});
      await tx.patchMembership(m.id,patch);
      if(o.kind==="paid"||o.kind==="failed")await tx.insertOutboxOnce({environment:"sandbox",paymentId:key,parentId:m.parentId,childId:m.childId,notificationType:o.kind==="paid"?"payment_confirmed":"payment_failed",deduplicationKey:"sandbox:"+key+":"+o.kind,status:"pending",attemptCount:0,createdAt:clock.now()});
      await tx.completeEvent(eventKey,"processed");
      return {ok:true,status:o.kind};
    });
  }
  // Internal notification worker. Delivery provider must offer an idempotency key
  // or ambiguous sends go to manual review. Never use raw webhook customer fields.
  async function deliverOne() {
    if(!safe())return fail("SANDBOX_REQUIRED");
    const job=await store.claimPendingEmail();
    if(!job)return {ok:true,status:"empty"};
    const data=await store.getCommittedEmailDetails(job);
    const expected=job.notificationType==="payment_confirmed"?"paid":job.notificationType==="payment_failed"?"failed":null;
    if(job.environment!=="sandbox"||!expected||!data||data.environment!=="sandbox"||data.paymentId!==job.paymentId||data.parentId!==job.parentId||data.childId!==job.childId||data.status!==expected||data.amountMinor!==36000||data.currency!=="MYR"||!month(data.coveredMonth)||!goodEmail(data.email)||typeof data.childName!=="string"||!id(data.providerPaymentId)){
      await store.markEmailReview(job.deduplicationKey);
      return fail("EMAIL_REVIEW_REQUIRED");
    }
    // Sandbox transport must be a non-delivering capture sink, not a real mailer.
    const subject=expected==="paid"?"STEM Makers Lab — sandbox payment confirmation":"STEM Makers Lab — sandbox payment failed";
    const text=["SANDBOX — fictional data only","Parent: "+data.email,"Child: "+data.childName,"Membership month: "+data.coveredMonth,"Amount: RM360.00","Payment reference: "+data.providerPaymentId,expected==="paid"?"Payment verified.":"Payment unsuccessful. Membership unpaid."].join("\n");
    try{
      const sent=await provider.captureSandboxEmail({to:data.email,subject,text,idempotencyKey:job.deduplicationKey});
      if(sent!==true)throw Error("uncertain delivery");
      await store.markEmailCaptured(job.deduplicationKey);
      return {ok:true,status:"captured"};
    }catch{await store.markEmailReview(job.deduplicationKey);return fail("EMAIL_REVIEW_REQUIRED");}
  }
  return {checkout,receive,reconcile,deliverOne};
}
