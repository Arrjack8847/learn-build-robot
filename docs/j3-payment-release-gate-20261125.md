# J3 payment release gate — 2026-11-25
Scope: development prototype only. No production data, new deployment, payment creation, real email delivery or company repository change.

## Security incident — credential rotation required
During the final check of .env.example, both HITPAY_API_KEY and HITPAY_SALT_KEY were nonempty and were not recognizable placeholders. The current file was restored to a blank template and verified. Values were not printed or decrypted from hosting. They may remain in Git history; treat as exposed. Rotate/revoke both sandbox credentials at HitPay and update Vercel Preview privately before any runtime test. Do not rewrite shared history without explicit authorization. Check any clones, logs and deployments for exposure. Event webhook salt must also remain private and separate.

## Implemented
- Sandbox diagnostic and dry-run-first RM360 MYR monthly plan provisioning scripts (J3.1–2). Plan not provisioned; actual API connectivity not tested.
- Five admin-only Wix development collections (J3.3), with 62 original custom fields + 4 additional fields now verified: Memberships.lastCycle, lastProviderOccurredAt, lastKind; CheckoutAttempts.providerPlanId. Total 66 custom fields; no rows written.
- J3.4: sandbox checkout transport, fixed plan verification, ownership and approved-consent gates, atomic reservation contract and no retry after ambiguous external creation. Hosted URL allowlist; no card data in our UI. Payment preview and fail-closed return routes.
- J3.5: Node raw-byte HMAC-SHA256, constant-time comparison, endpoint-specific salt, business check, hashed event inbox. Event headers are hints only; never trust them for crediting. HTTP boundary not mounted.
- J3.6: normalized provider reconciliation contract; membership projection handles successful initial/renewal payment, failed renewal, cancellation, matching refund, duplicate and stale event protection. Transaction adapter not yet implemented. Unresolved/stale events remain pending for review. Cancellation blocks eligibility immediately in the conservative fixture only; final cancellation entitlement policy needs business approval.
- J3.7: committed payment/outbox contract; notification capture uses fictional account only, no real email. Paid/failed notifications contain parent, child, month, RM360 and provider reference; no raw provider customer payload.
- J3.8: 25 fixture scenarios passed against fetched core code in JS, 12 Node transport/crypto checks passed on byte-identical transport blob 39ca939958a8b31432dc2e73bbcab2716b84d3ed; test scripts committed. Earlier 9 diagnostic and 10 plan simulated checks. No frontend compile or live E2E.
- UI routes /parent/payment-preview and /parent/payment-return. Actual Pay Now disabled; no browser-side payment authorization.

## Critical blockers for real sandbox run
1. Rotate/revoke exposed credentials first. Vercel variables were configured but previously targeted both preview and production. Restrict sandbox credentials to preview; do not decrypt/copy secrets. HITPAY_WEBHOOK_SALT is separate from HITPAY_SALT_KEY. Configure endpoint salt, business ID, provisioned plan ID and trusted preview return URL. Do not use a real email for current fixture. This fixture assumes tomorrow start date in MY/SG time, card and two cycles; Malaysia-specific card sandbox support is not guaranteed. Verify actual provider acceptance and hosted URL.
2. J2 verified session, privacy version/terms acceptance, child ownership and real identity adapters must be implemented and tested first. No public or unauthenticated payment endpoint. Actual checkout and webhook handlers still not mounted. Preview deploy must be separately controlled; no deployment here.
3. Build durable Wix adapters. Map checkout attempt planId to providerPlanId, reference fields to Wix row IDs; use deterministic IDs and enforce uniqueness. Serialize checkout across child + environment and reconcile ambiguous creates without duplicate subscriptions. Bind exact provider subscription ID to the correct membership and checkout. Store raw-body digest, not raw customer/card data. Prove multi-record atomicity or durable replay-safe equivalent for event/payment/membership/outbox. Wix collection schema alone is not transaction proof. Validate next charge date, paid-through expiry and booking eligibility based on verified provider cycles, not browser or wall-clock guesses.
4. HitPay's published recurrent charge example omits explicit subscription ID. Implement and test authenticated provider reconciliation proving charge ID, merchant, subscription, child binding, amount, currency and exact billing period, plus failed renewal and refund linkage. Do NOT infer by email or customer alone. No normalized provider observation API exposed to a caller. Failed recurring-charge delivery/event semantics must be confirmed against actual sandbox; configure appropriate supported event subscriptions and reconciliation/polling as needed. Only verified signed events may advance payment. Unknown event type stays unpaid. Older events need ledger reconciliation, not discarded.
5. Real sender/provider, reliable outbox lease/idempotency and delivery reconciliation. Capture sink only until approved sender available. No notification on unverified redirects or checkout abandonment.
6. Execute live sandbox acceptance tests from company brief: paid, abandoned checkout, forged notification, duplicate notification, successful and failed renewal, cancellation, correct child, receipts, no card info, no real funds. Verify refund/expiry, race conditions, transport failures and independent review. Do not claim J3 complete until these pass.

## References
https://docs.hitpayapp.com/apis/guide/recurring-billing
https://docs.hitpayapp.com/apis/recurring-billing/create-billing
https://docs.hitpayapp.com/apis/recurring-billing/get-plan-details
https://docs.hitpayapp.com/apis/guide/events

## Test commands (fictional only)
node tests/hitpay-j3.test.mjs
node tests/hitpay-j3-transport.test.mjs

J3 status: prototype code and database ready for adapter integration; actual sandbox acceptance NOT PASSED. J4/J5 may be developed against fixtures but never activate real booking/course access until J2/J3/J5 acceptance and company approval.

## Evidence update — sandbox acceptance (2026-11-25, MYT)

This section supersedes earlier test-status statements above; all unresolved security and release gates remain in effect.

| Acceptance evidence | Result | Preview commit |
| --- | --- | --- |
| Signed webhook inbox rejects unsigned/forged requests; genuine signed sandbox charge delivery | Five signed charge.created records received | 0c522838 |
| Authenticated saved-wallet charge lookup | Five distinct successful MYR 360 charges, matched to exact sandbox subscription, no unconfirmed records | 0c522838 |
| Wix evidence ledger | Five charges and signed inbox keys, total 180000 minor units; readback confirmed; no eligibility changes | 0c390ddd |
| Atomic synthetic payment/membership/outbox, concurrency and rollback | 11 fixture scenarios and 5 conditional conflict checks passed | a4e3ba4d |
| Confirmation email, fictional successful payment | One provider acceptance recorded, matching message found in designated Gmail inbox | 258cae8a |
| Failure email and unpaid membership projection | Fictional renewal marks unpaid, preserves previous paid-through month, one provider acceptance and Gmail receipt | 350c51e8 |
| Actual monthly plan and subscription | RM360 MYR monthly, two configured cycles, scheduled, zero charges, no verified period; charge-history audit complete for returned query | 753e3968 |

The five successful wallet charges belong to a save_card fixture, NOT five monthly renewals. Never infer coverage periods from them. Original signed inbox entries remain pending; the evidence ledger is a separate QA record, not the production membership store. Both email sends used fictional membership observations, not a real HitPay monthly charge. No genuine charge.failed event has been verified yet.

### Remaining mandatory release gates
- Credential incident: project metadata still shows HITPAY_API_KEY, HITPAY_SALT_KEY and HITPAY_API_BASE_URL targeted to both Preview and Production. Rotation/revocation of exposed credentials is not independently confirmed. Project owner must rotate sandbox credentials in HitPay and update preview-only variables privately, preserving unrelated production configuration. Do not request keys in chat. No live launch or further provider mutations until resolved.
- Obtain verified first monthly charge and exact coverage period, including provider subscription and approved parent/child binding. Scheduled trial currently has zero charges. Verify wallet attachment and authorization separately.
- Verify genuine failure and recovery events from provider, renewal/cancellation/refund and entitlement expiry. Fictional tests alone are insufficient.
- Implement authorized J2/J3 runtime adapters, durable processing and notification dispatch for real eligible membership records; secure routes, session/consent/ownership and production approval remain mandatory. No build-time fixture may be used as a production worker.
- Verify recipient/sender approval, monitoring, retry policy and delivery status for the operational mailer.

Status: partial sandbox acceptance passed; production release BLOCKED. No production settings modified by this audit.
