# J5 independent student learning — 26 November 2026

Baseline 09c1487a9816dca7ea7322e2693deb3a273f06e9. Dedicated branch only; J1–J4 are not merged or changed. The prior AGENTS.md preserves the Home → Level → Category → Project → Learning/Building flow; the requested individual student profile is an extension, not a retired generic learning dashboard.

## Source findings
- Existing student.dashboard.tsx renders Wix dashboard totals, level readiness, quiz/challenge history; it is not yet compatible with J2's separate student sessions. No membership/check-in display or eligible resume is established.
- student.check-in.tsx is a disabled eight-digit interface. The reviewed Nov 24 code/pass design and shared N3 booking agreement are outstanding (see j5-course-access-readiness.md). No replacement code policy chosen.
- wix-lms.ts uses browser Wix OAuth and disabled-by-default activity/quiz/challenge sync. ProgressContext uses shared legacy localStorage. Neither is an authoritative J2 student progress store.
- Existing six-level, quiz, Final Build and Wix PDF routing tests are present; not executed here. Direct Wix PDF origins remain a release blocker; route protection alone is insufficient.
- Existing readiness disables automatic unlocking; challenge schema uses five checks whereas the requested Level 1 rule is 3/4. Do not silently generalize either.
- J2 contract read from its dedicated branch: resolveJ2Student(request, env) returns {role:"student",studentId,environment:"private-preview"} or null. No cross-journey code imported.
 
## Implemented independent foundation
scripts/j5/student-access.mjs has injected trusted session, profile, membership, check-in, curriculum and level adapters. It rejects mismatched student IDs, non-preview environments, unavailable/expired membership, missing/revoked/expired check-in, locked levels, bad activities, and provider failure. It re-resolves session after reads and returns only a whitelisted profile projection; expired members can see their profile without access to protected activities. Adapter field names are proposed J5 internal normalization, not a change to J2/J3/J4 or Wix schema. Membership/check-in adapters must derive records from actual verified authorities; this core never creates payment or attendance records. No endpoints are mounted, no security guarantee for existing public routes, no transactional write enforcement yet.

## Verification
21 isolated JavaScript fixture assertions executed against the exact function and test-case definitions used to generate these source files; all passed. Run the Node test wrapper independently with:
```sh
node --test tests/j5-student-access.test.mjs
```
Node wrapper, full build, actual Wix persistence, browser, real sandbox payments, direct PDF origin and integration acceptance have not been executed here. This is not an independent completion gate pass. Automatic Vercel Git deployment disabled specifically for the J5 branch. No manual deployment or GitHub Actions requested.

## Remaining dependencies and tasks
- Obtain reviewed check-in trial/design, confirm grace and booking contract; build atomic durable code validation and revocation adapter after agreement.
- Confirm one-to-one Children.childId / StudentProfiles mapping and actual Wix adapter ownership/permissions, consistency and CAS.
- Approve or obtain exact curriculum completion/weighting and challenge policy by level; preserve approved Level 1 3/4 and 15-minute overtime requirement.
- Private PDF and course data delivery (including answer keys, direct origins, public build assets and cache revocation); do not claim access security until tested.
- Implement authorized profile/navigation, membership and check-in states, resume, progress persistence and assessment/advancement; verify all six levels and materials; browser and development database testing.
- J4 read-only staff projection and actual cross-journey acceptance are separate. No production or real-company modifications.
