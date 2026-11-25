# J4 desk implementation handoff

Development branch only. Source: STEM Makers Lab website - task briefs for the team, 25 Nov 2026. This is not a completed acceptance test or production-ready staff system.

## Implemented components
- /staff/admin: bookings, attendance, memberships, payments, audit log and monthly sales tabs; desk registration, walk-in, payment, correction and receipt forms; staff status, search, refresh, printable issued receipt and CSV download when the authorized service supplies real data.
- scripts/staff/admin-core.mjs: verified staff boundary, minimal overview fields, audited corrections and reconciled export.
- scripts/staff/correction-policy.mjs: correction transition planner.
- scripts/staff/desk-operations.mjs: current-slot walk-in contract and existing issued receipt retrieval.
- scripts/staff/desk-registration-payment.mjs: verified-parent registration, approved-policy RM360 desk payment, audit history.
- scripts/staff/sales-export.mjs: validated monthly MYR ledger formatter, exact integer totals, refunds, formula-injection protection.
- scripts/staff/desk-http.mjs: preview-only POST handlers, same-origin checks, bounded input, no-store replies; default resolveServices returns null.

## Connection gates
1. Obtain Shimi's existing desk screens and rules, including receipt numbering, approved methods and evidence, refunds, coverage dates, mall export format, and current privacy notice. Registration requires the parent to verify email and personally accept the notice; staff cannot assert consent.
2. Company-owned environment and verified per-person staff identity. A Vercel preview login or parent OTP is not a staff identity. No real family information in personal previews.
3. Connect the shared booking contract with Nizar, including slot capacity and attendance/no-show transitions. Implement atomic write plus audit and deduplication; never emulate multi-record atomicity with sequential Wix writes. A walk-in must be booked before issuing a code.
4. Implement authoritative Wix/payment ledger adapters and independent approval of desk payment policy. The server fixes RM360 MYR, validates evidence through the store, prevents duplicate payment across desk and HitPay, and issues a durable receipt only on confirmed commit. Do not overwrite verified HitPay evidence.
5. Connect reviewed J5 code issuance and revocation service. Give code currently disabled. Checkout must revoke access atomically, not merely update the UI.
6. Connect resolveServices in desk-http.mjs only after all required authorization, isolation and transaction guarantees are implemented. Existing endpoint responds unavailable and forms refuse input/submission until connected.
7. Acceptance: staff with no coaching checks a child in, sees paid/unpaid, corrects an error; verify audit attribution, walk-in capacity races, receipt idempotency, accurate export, role isolation and failed operations. Test actual company environment with fictional records first.

No live acceptance testing performed, per user's deferral. No J2/J3/J5 functional changes. No production release. Full J4 remains incomplete until integration gates pass.
