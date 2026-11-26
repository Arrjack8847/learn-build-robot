// Isolated J3 SGD authorization coordinator. No HTTP mount; no real identity or store adapter.
export function createAuthorizedCheckout({config, identity, store, transport, isAllowedCheckoutUrl}) {
  const fail = error => ({ok:false,error});
  const id = x => typeof x === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(x);
  const money = x => Number.isSafeInteger(x) && x > 0;
  if (config?.environment !== "sandbox" || config.currency !== "SGD" || !money(config.membershipMinor) || !money(config.depositMinor) || !id(config.planId)) throw Error("SANDBOX_CONFIG_REQUIRED");
  return async function checkout(context,input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) return fail("INVALID_INPUT");
    const kind=input.kind;
    const keys=kind==="membership"?["kind","childId","requestKey"]:kind==="deposit"?["kind","childId","requestKey","bookingId"]:[];
    if (!keys.length || Object.keys(input).length!==keys.length || !keys.every(k=>Object.hasOwn(input,k)) || !id(input.childId) || !id(input.requestKey) || (kind==="deposit"&&!id(input.bookingId))) return fail("INVALID_INPUT");
    const parent=await identity.resolveParent(context);
    // Remains fictional-only until the J2 identity and approved-recipient adapter is verified.
    if (!parent || parent.accountType!=="parent" || parent.emailVerified!==true || !id(parent.parentId) || typeof parent.email!=="string" || !/^[a-z0-9._+-]+@example\.invalid$/i.test(parent.email)) return fail("NOT_AUTHORIZED");
    const child=await store.getOwnedActiveChild(parent.parentId,input.childId);
    if (!child || child.parentId!==parent.parentId || child.childId!==input.childId) return fail("NOT_AUTHORIZED");
    if (!await identity.hasCurrentConsentAndTerms(parent.parentId,child.childId)) return fail("CONSENT_REQUIRED");
    if (kind==="deposit") {
      // The booking adapter owns the approved deposit policy; never infer it here.
      const booking=await store.getAuthorizedDepositBooking(parent.parentId,child.childId,input.bookingId);
      if (!booking || booking.bookingId!==input.bookingId || booking.parentId!==parent.parentId || booking.childId!==child.childId || booking.depositDue!==true) return fail("DEPOSIT_NOT_AUTHORIZED");
    }
    const expected={kind,environment:"sandbox",parentId:parent.parentId,childId:child.childId,requestKey:input.requestKey,email:parent.email,currency:config.currency,amountMinor:kind==="membership"?config.membershipMinor:config.depositMinor,...(kind==="membership"?{planId:config.planId}:{bookingId:input.bookingId})};
    // Atomic store must recheck entitlement/booking state, enforce one unresolved
    // membership per student or deposit per booking, and generate a unique opaque reference.
    let reserved;
    try {reserved=await store.reserveAuthorizedCheckout(expected);} catch {return fail("CHECKOUT_UNAVAILABLE");}
    const r=reserved?.reservation;
    if (!r || typeof reserved.created!=="boolean" || !id(r.attemptId) || !id(r.reference) || !Object.entries(expected).every(([k,v])=>r[k]===v)) return fail("CHECKOUT_UNAVAILABLE");
    if (!reserved.created) return {ok:true,status:"pending_verification",attemptId:r.attemptId};
    if (r.status!=="reserved") return fail("RECONCILIATION_REQUIRED");
    try {
      const result=kind==="membership"?await transport.createMembership(r):await transport.createDeposit(r);
      if (!id(result?.providerId) || !isAllowedCheckoutUrl(result.url)) return fail("RECONCILIATION_REQUIRED");
      // An uncertain create or failed binding remains locked for reconciliation.
      if (await store.bindCheckoutOnce({attemptId:r.attemptId,reference:r.reference,providerId:result.providerId,environment:"sandbox",kind})!==true) return fail("RECONCILIATION_REQUIRED");
      return {ok:true,status:"pending_verification",attemptId:r.attemptId,checkoutUrl:result.url};
    } catch {return fail("RECONCILIATION_REQUIRED");}
  };
}
