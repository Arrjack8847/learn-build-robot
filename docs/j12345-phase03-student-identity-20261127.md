# J12345 Phase 03 — student identity and profile integration
27 November 2026. Dedicated development branch only. Initial implementation commit faae2df6e3c17d4ee90871ef03b31fa02a957f51.

## Implementation
- New exact-branch identity configuration J12345_REGISTRATION_ENABLED, J12345_AUTH_ROOT and J12345_TEST_EMAILS; explicit profile gate J12345_PROFILE_ENABLED. All example switches off, no secrets supplied. Distinct payer/student HMAC key domains, PIN physical namespace j12345-pin-v1; approved test inboxes only. Reuse existing J2 parent OTP, individual PIN, session and credential revocation. No alternate login service or role elevation.
- Existing J2 runtime resolves verified student cookie and current family ownership. Canonical logical profile uses Children.childId directly; internal adapter reads the same child and validates parent against the derived approved list, current consent and family response/version. No independent StudentProfiles row created, migrated or assumed. Mapping to a separate legacy StudentProfiles collection is unverified and must remain blocked until explicitly reconciled in persistence work. This is a source-level identity projection, not evidence of real Wix records.
- POST /api/dev/j5/profile returns only the student's ID, display name, verified identity status and unavailable learning access. Denies all other branches/production/disabled configuration, cross-origin, arbitrary query/body identity, wrong method, mixed parent/proof cookies, missing/foreign child and session change during read. Re-reads canonical child and J2 session before returning. Private no-store response. Other J5 API routes explicitly 404. No membership, check-in, progress or course privileges granted; existing legacy public curriculum routes unchanged pending Phase 05.
- Exact build-branch UI flag connects student sign-in to private student profile. Legacy Wix login fallback removed on J12345 only; original branches unaffected. Imported unchanged J5 session lifecycle and sign-out components. Profile handles invalidation, request cancellation, focus/visibility/BFCache, polling and failed logout; student/parent sign-in signals other tabs using a nonsecret marker. Browser behavior remains to be tested.
- Added npm run test:j12345:identity to prebuild; no prior test or TypeScript rule removed. Full build remains disabled for automatic deployment.

## Verified focused execution
Node v22.16.0, isolated execution workspace (no live provider). Exact source/test Git blob hashes checked against implementation commit:
- identity-scope.mjs a8af86633f04337740bd8ccd2df24a94af7c2cd6
- profile.mjs 579c92b1850324239c4c178ac914752cf29b0e14
- secure-auth-transport.mjs 68fe862a72d574dffadbc24a48633806c6cf9bac
- j12345-identity-profile.test.mjs bc82ef0bcbf5eff752950bee4d695c47380e17e7
- j5-session-lifecycle.mjs 555f2941c5288e4a0202864a01470bc02d39f675
- j5-session-lifecycle.test.mjs b0e5d9043a9553d6f997391a08ce3e806e6536d6
Ran node --test tests/j12345-identity-profile.test.mjs tests/j5-session-lifecycle.test.mjs: 24 passed, zero failed (11 identity/profile, 13 session lifecycle). Native Request/Response, crypto and AbortController; injected fictional session/child adapters. These tests do not execute the whole J2 runtime or the browser. New parent portal signal and prebuild script are source-reviewed only.

## Remaining completion evidence
Full strict TypeScript, integrated application build, real J2 runtime regression and browser acceptance have not been executed on this branch. Need current runtime/fixture integration verification of the actual J2 session and canonical Wix child reader, separate StudentProfiles mapping for later persistence if required, and live approved fictional inbox/database acceptance. No real emails, payment, DB writes, production changes, Actions or deployment. The implementation is in place and focused tests pass; Phase 03 verification is not fully complete. Keep all feature gates closed pending acceptance.
