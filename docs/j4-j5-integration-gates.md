# J4/J5 development handoff — 2026-11-25

Source: STEM Makers Lab website - task briefs for the team.docx, 25 Nov 2026.
Scope: development only. J2 OTP/Wix credentials and J3 live sandbox acceptance deferred by request. No real families or payment records in personal infrastructure. No production changes.

## J4 staff admin

Implemented: /staff/admin navigation and unavailable-data states; server-side staff application boundary in scripts/staff/admin-core.mjs. All buttons that would access or change actual records remain disabled.

Required adapters:
- Verified individual staff login from the J2 staff access implementation; reject parent, child, expired, disabled and unauthorized sessions.
- Today in Asia/Kuala_Lumpur: bookings with child, hour, membership and attendance; visit history; membership paid-through and next charge; payments with real provider status.
- Shared booking identity and slot timestamps agreed with Nizar. Walk-in creates booking before code issuance; capacity check and booking insert must be atomic.
- Manual presence, paid-at-desk, no-show excuse and checkout require durable actor identity, staff display name at time of action, reason, target, timestamp and idempotency. Preserve history; do not overwrite HitPay evidence or fabricate webhook events.
- Cash/desk payment is a separate ledger source. Confirm existing RM360 receipt numbering, refunds, daily reconciliation and mall monthly export format with Shimi. Reconciled ledger only; no sales inferred from memberships.
- Obtain existing desk UI/rules before replacing desk sign-up, walk-in, check-in/out, receipts, visit log and export.
- Acceptance: staff can check a child in, identify whether paid and correct a mistake without coaching.

## J5 check-in and protected course access

Implemented: /student/check-in, eight-digit numeric input, no code verification or pass issuance.
The 24 Nov reviewed design and trial are required by the brief. They were not located in available files or default-branch repository search. Do not create a substitute security design or expose an unreviewed code-issuing endpoint. Obtain them before wiring the lock. Booking integration (N3) is also a prerequisite.

Acceptance gates from brief (all unverified):
1. Code valid only on its day and within booked hour.
2. Bound to exactly one booking and child.
3. Cryptographically random eight digits, unique daily.
4. No plaintext codes stored.
5. Three entries allowed; fourth refused; new code cancels old.
6. Generic refusal, no reason leakage.
7. Durable rate limit BEFORE code lookup; test 100 simultaneous wrong codes.
8. Server denies course pages AND files without valid pass, including pasted manual URL in fresh browser.
9. Expire at booked-hour end plus approved grace, on checkout, or reissue; revoke access even mid-page.
10. One attendance entry per booking; successful repeat does not duplicate visit.
11. Manual attendance stores staff name.
12. Server-only pass signing secret.

Important: current student pages/PDF access are NOT locked by adding a UI. Existing public Wix PDF links may be directly accessible and cannot be protected by a frontend redirect alone. Identify every route, API, data source, cached resource and direct file URL; use authorized delivery with no public alternate origin before release. Obtain approval of proposed 15-minute grace and no-show policy. Server checks are mandatory on every protected request. Client countdown is not the security boundary.

## Before live integration

Confirm company-owned hosting and Wix database; configure credentials privately; complete J2/J3 real acceptance; obtain N3 shared booking contract and the Nov 24 reviewed J5 design; reconcile desk UI and rules with Shimi. Then implement adapters and acceptance checks in the company's private copy. No live testing performed in this change.
