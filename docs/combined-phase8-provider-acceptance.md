# Phase 8 — Combined provider acceptance (sandbox only)
27 November 2026. Phase 7 recorded developmentVerified=true at e564fb7f692b30575fdce015f939c081899226aa. This change adds a separate diagnostic and synthetic test; new HEAD must be reverified before release.
## Operator commands in existing Codespaces
- Fetch and switch to combined branch, without touching prior stash or production.
- `node --test tests/combined-phase8.test.mjs`
- `node scripts/combined/phase8-provider-check.mjs` (configuration only; no network)
- `node scripts/combined/phase8-provider-check.mjs --probe` (explicit read-only provider checks, approved development credentials already in environment).
No secrets should be pasted into chat or committed. No runtime/acceptance flags should be set merely to make diagnostics green. The check expects the exact dev Wix site, existing sandbox plan/currency/amount/method and legacy sentinel settings. Restricted Resend keys may not list domains; this is unconfirmed, not proof of delivery failure. Missing combined row and collection cannot be distinguished by a 404 alone. No automatic collection creation or test account writes.
## Evidence still required
- Wix: authenticated exact combined row and scoped collections, isolated fictional registration and conditional-write/stale-rejection proof; no real family data.
- Resend: approved inboxes, actual OTP received and replay denied, booking notice delivery and idempotency; do not log OTP, tokens or addresses.
- HitPay: read sandbox plan and registered Wix webhook; actual signed test events and independent charge/subscription reconciliation, exact period, successful/failed renewal, RM50 deposit and refund record. No real payments, no alternative payment method without approval. Official Malaysia API page https://hitpayapp.com/my/paymentapis lists Touch 'n Go as unavailable in standard sandbox. Request dedicated provider test capability or leave blocked. Do not set provider flags until genuine evidence.
- Company-owned private document gateway: approved policy + pinned manifest, 590 assigned documents, exact bytes, deny anonymous and expired access. No public fallback.
- Individually provisioned staff permissions, explicit worker scheduling/delivery verification, privacy review of all static curriculum assets, original independent security review, dependency vulnerability review. No deployment or launch.
The diagnostic output cannot establish release readiness; real user acceptance remains Phase 9.

## Interactive identity acceptance
Run `node scripts/combined/phase8-identity-live.mjs` only in a clean combined Codespace with persistent independent `COMBINED_AUTH_ROOT`, a single operator-approved `COMBINED_TEST_EMAILS` inbox and existing development Wix/Resend secrets. The process sets private identity flags only for itself; does not deploy, enable payments or expose a server. Confirm YES; choose two distinct fictional PINs; enter real received OTPs in hidden terminal prompts. Creates two fictional profiles and retains durable test records. Existing nonempty family refused; do not rerun automatically on partial failure. No credentials or identifiers in report. Cross-family isolation, notice delivery, actual browser and release acceptance remain separate. Keep the auth root stable; rotating it strands existing test identities.
