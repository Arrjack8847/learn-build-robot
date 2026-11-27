# Phase 2 — combined parent identity and membership
Updated on 27 Nov 2026. Source work only; not a production acceptance report.

## Implemented
- Exact combined branch/site/runtime boundary, independent auth root and derived parent/student credentials. Disabled combined identity cannot fall back to an older preview. Fictional Nizar flags rejected.
- Reuse the verified J2 parent session, current consent, individual child profile and PIN enrollment for checkout. Scheduling resolves the selected child through the same J2 family and rechecks profile/version/session before returning; foreign child, mixed actor cookies and revoked sessions denied.
- Separate combined checkout aggregate namespace, global immutable provider ownership indexes, signed inbox + independently verified billing-period evidence required. Parent checkout status must agree with verified ledger before showing active. Scheduling verifies the same child, owner/version, active membership and exclusive expiry; missing or uncertain evidence denies new booking.
- Versioned combined sandbox membership and booking notice: combined-sandbox-membership-booking-v1. Parent must accept before checkout, version and timestamp persist on reservation, all membership reconciliations and reads use the same version. Older version is not silently migrated. The text covers approved no-show/deposit/hold/cancellation/booking/waitlist rules; owner approval of the actual combined notice still required.
- Combined provider acceptance, terms and confirmed period schema are separate release gates. Membership worker capability distinct from parent/student/staff and other environments. All combined feature flags default off.

## Verification and activation
Prepared tests: npm run test:combined:phase2 (phase 1 and phase 2 fixtures; no real provider requests). Run in Codespaces later as requested. Existing test:combined includes the same new suite. The code has not been executed or typechecked in this turn.
Owner/company prerequisites: company-controlled Wix preview and schema access, distinct combined auth root + controlled Resend inboxes, genuine signed HitPay event and independently verified billing-period mapping, approval of the combined notice version, separate worker secret. Set flags only after acceptance, not as a substitute for it. Genuine email and payment proof must be obtained in the private environment; no credentials or acceptance flags set by this commit. No real records or charges created. Phase 5 failed-renewal/deposit and Phase 3 individual staff identity are separate work.

## Remaining acceptance
Confirm OTP and registration for two test families, reject cross-family read, verify one sandbox member and unpaid sibling, reject forged/mismatched/duplicate payment evidence, expire coverage and confirm new booking denied. Verify the actual notice with owner before any checkout. The two-cycle sandbox plan is preserved; no claim of ongoing production recurring billing.
