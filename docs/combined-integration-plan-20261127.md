# J1–J5 + N1–N5 integration — 27 November 2026

Source snapshots: J12345 60e044ec9a2b5970afcb8eb1e3c0f33f2db018aa, N12345 9f722a396355be934cd88ee82c8ad63a021191c0. Nizar descends from the J12345 snapshot; start combined branch at Nizar tip with both source sets. Preserve main and independent branches. No automatic deployment or GitHub Actions.

## Phase 1 — isolated foundation
Exact branch integration/j12345-n12345-20261127. Separate canonical schedule record combined-scheduling-preview-v1 in existing development collection NizarSchedulingPreview. No migration or copying fixture data. Strict branch/site/preview flags; fixture flags rejected. Repository verifies separate scope on read/write. Combined server entry returns 404 and build is deliberately blocked until private artifact pipeline and runtime are wired, preventing accidental legacy auth, public curriculum or competing booking writes. New projection maps canonical scheduling statuses and audited attendance to J4/J5 read contract; no pass or eligibility granted. Tests prepared. No live data writes.

## Next phases
2. J2 identity and J3 membership: new combined-only credential root and scoped records; real trusted parent ownership, child profile, verified membership; no fake paid status. Connect parent scheduling routes and pre-membership disclosure. Preserve signed provider evidence and avoid duplicate claims.
3. Canonical booking and staff day view: bind parent create/cancel/move, waitlist and staff walk-ins to one aggregate; replace old J4 test booking projections, ensure same ID/revision and capacity. Confirm individual staff identity/permission adapter.
4. J5 check-in and learning: reviewed original security design, atomic code claim/attendance/pass lifecycle, exact booked hour and zero grace, revocation on checkout/reissue/membership loss, private course and PDF gate. No parallel attendance source. Real identity verification and pass authority required independently of read projection.
5. N4 payments and automation: verified HitPay deposit/failed renewal events, refund receipts, outbox delivery/retry, worker execution, expiry and no-show reconciliation; resolve N4 policy edge cases.
6. Combined interfaces, readiness and private build: parent/student/staff views, protected artifacts, fixture isolation, run full acceptance and regression suite in Codespaces when requested; owner/company approval before any real users.

Source foundation does not establish runtime integration or acceptance. No tests run, no live Wix mutation, no deployment. Existing J1–J5/N1–N5 blockers and formal owner agreement remain. New namespace and six-phase sequencing are development choices.

## Source integration implementation status — 27 Nov 2026
Phases 2–6 have source changes on the combined branch. See combined-phase2-identity-membership.md through combined-phase6-platform.md for exact scope and unresolved provider/acceptance gates. Runtime disabled by default; actual private build and tests not run. Existing branch snapshots and deployment-disabled configuration preserved.
