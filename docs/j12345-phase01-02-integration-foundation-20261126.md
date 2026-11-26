# J12345 — Phase 01 source audit and Phase 02 branch foundation
Date: 26 November 2026. Development only; no live acceptance, deployment, provider requests or production changes.

## Pinned source references
- J1234: 00d7e25ac8ab857e38a543ec6775e536bfd84ff0, integration/j1-j2-j3-j4-20261126.
- J5: 19636d581d6d6b1ce2be0b676c8db9e7a1a1344e, feat/j5-student-learning-20261126.
- Common ancestor: 0dcd90cd53e08658d7f9f26f3119d95387ac731d.
- Main observed at 444ef548d5372ed2baf9de4aa48d02b331869cd3.
- GitHub compare: J1234 56 divergent commits and 172 changed paths; J5 46 divergent commits and 90 changed paths; 71 J5-only changed paths, 19 shared changed paths. This is path inventory, not a full semantic merge audit.

## Shared-path reconciliation
- .env.example, docs/j1-private-testing-infrastructure-20261126.md, scripts/j1/readiness.mjs, tests/j1-readiness.test.mjs: retain J1234 readiness, add explicit J12345 gates and distinguish configured, fixture-tested and live-accepted.
- scripts/parent-auth/{family-preview,preview-email-budget,preview-otp,secure-auth-transport}.mjs, src/lib/{parent-otp-test.server.ts,parent-portal.ts}, src/routes/parent.sign-in.tsx, tests/parent-portal-email.test.mjs: preserve purpose separation, OTP abuse controls, payer versus student sessions, consent and PIN ownership; review J5 diffs before selective adoption.
- src/lib/{wix-auth,wix-lms}.ts, src/routes/quiz.$projectId.tsx: preserve strict type fixes; private learning must not depend on legacy browser OAuth or trust client grades, localStorage or claimed student IDs.
- src/server.ts: preserve all J1234 endpoints; introduce J5 endpoints and course access guards only with exact branch and explicit feature gates. Missing adapters deny access. Never treat browser preflight as server authorization.
- package.json, vite.config.ts, vercel.json: retain both required checks, strict TypeScript, private PDF and build restrictions. Disable automatic Git deployment for the new branch before its creation. No GitHub Actions.

## Authority contracts reviewed
- J2: resolveJ2Student(request, env) is the sole student identity source. Parent email OTP + separate student PIN, multiple students per payer; no parent learning dashboard or separate student email. Exact one-to-one Children.childId / StudentProfiles mapping required, no implicit account creation.
- J3: existing canonical checkout, verified signed inbox, subscription/charge ownership, coverage and review hold determine membership; normalize only authoritative fresh status. No student checkout or staff payment override.
- J4: owns same-day booking, eight-digit code, durable attempts, CAS attendance and checkout/revocation. J5 must use it, not its independent proposed booking provider. J4 visit marker is not learning authorization. Membership and attendance are separate CAS records; access rechecks both. No invented grace interval.
- J5: course authority requires exact student, active profile, verified membership, current unrevoked check-in and committed level access. Overview, course and PDF handlers default fail-closed; no adapter configured. Progress projection requires explicit approved policy, committed attempts and level states. Never infer level advancement. Current Level 1 approved 3/4 self-assessment, 15 minutes with recorded overtime; existing backend 4/5/no overtime conflict must be reconciled. Other levels require verified policies.
- Exact branch guards in J123/J1234 must be extended deliberately for J12345 with isolated secrets/namespaces and denial tests, not relaxed to arbitrary previews. Do not reuse secrets or migrate real records.

## J5 readiness gap (source report)
J5 Phase 10 reports 234 native fixture cases passed; nine PDF inventory cases not rerun in that suite. Earlier full private build and Chromium fixture smoke predate Phase 10. Full typecheck, Safari, Wix permissions and persistence, secure educational writes, server grading, final-build persistence, progression, exact resume and private PDF storage/origin revocation remain open. The independent completion gate is explicitly NOT met. J1234 reports 215 regression tests, 20 OTP tests, four family groups, strict TypeScript and build pass; live acceptance deferred. These are prior reports, not tests rerun by this audit.

## Integration sequence
1. Inventory and contract audit: initial audit recorded here; complete semantic reconciliation of shared paths before importing code.
2. Dedicated branch: base on pinned J1234, preserve source branches, disable auto deployment; no merge to main.
3. Student identity, profile and session isolation.
4. Verified membership, J4 attendance and course authorization.
5. Six-level routes, artwork-preserving UI, protected materials and PDF delivery.
6. Durable student-owned progress, resume and server-owned assessment/progression; no shared legacy state.
7. Server quiz and Final Build enforcement, retry, overtime and approved unlock policy.
8. Staff read-only learning projection and reconciliation with existing attendance/membership.
9. Security, strict typecheck, full build, regression, private-artifact and production-denial checks; Testing Centre recognizes separate J12345 gates.
10. Live acceptance deferred until authorized private testing with fictional accounts, controlled inboxes, sandbox money and development Wix only; owner approval before rollout.

## Current state
This commit records an initial source audit and establishes deployment-disabled branch configuration only. No J5 implementation imported, no exact branch guards widened, no tests rerun, no provider configuration changed. Further semantic audit and integration are open. Do not mark J12345 development or independent J5 acceptance complete.
