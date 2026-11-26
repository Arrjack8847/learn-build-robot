# J1 private testing infrastructure — acceptance report, 26 November 2026

Scope: J1 only, branch `feat/wix-lms-integration-20261125`. No J2–J5 integration, production changes, live payments, real child data, or GitHub Actions. This report supersedes earlier preliminary estimates and fixed-email/SGD setup assumptions; Git history preserves those notes.

## Release evidence
- Testing Centre implementation: [274312d](https://github.com/Arrjack8847/learn-build-robot/commit/274312d8712e352629ac4f14593f9a2e68ff6de1).
- Real-provider acceptance implementation and tested commit: [db4a638](https://github.com/Arrjack8847/learn-build-robot/commit/db4a638aaccd576beab8775d1dcd869abf1cf62d).
- Ready protected deployment: https://learn-build-robot-ktvbss1c6-soe-min-khants-projects.vercel.app/dev/testing-centre
- Actual unauthenticated access to the earlier Testing Centre deployment returned HTTP 302 to vercel.com. No share token created or protection disabled.

## J1.3 — Wix database
- Development Wix site: My Site 1, 09d613aa-3a95-42ff-9ee3-2aa0c706c447. 42 collections listed; all 26 custom collections have CMS_EDITOR read, insert, update, remove permissions and no special permission overrides.
- Actual configured runtime API key successfully performed a filtered read against a random fictional QA parent ID; no genuine student records returned or inspected.
- One-shot provider acceptance run proved a durable fixture insert/readback, conditional update, rejection of stale write and final evidence readback. The fixture marker qa-j1-provider-acceptance-v1 is retained in SandboxBillingState to prevent repeat sends. OTP challenges use a separate QA identity namespace; their sessions were revoked. No student profiles created.
- Student/account identity mapping and additional business schemas belong to J2–J5; do not create redundant collections during J1. Least-privilege credential scope beyond observed development operations remains a separate security acceptance concern.

## J1.4 — Resend
- mail.bestemready.edu.my verified. Preview sender noreply@mail.bestemready.edu.my. Preview-only open email mode enabled: syntactically valid email addresses are not limited to a five-email list. Test only inboxes the operator controls.
- Primary real inbox previously received two OTP messages; four configured Gmail aliases received one each on 26 Nov at approximately 15:01 MYT. Gmail metadata confirms five distinct recipient identities, using a shared Gmail mailbox. No plaintext codes or recipient addresses are persisted in this report.
- Actual Resend API acceptance 4/4 for the four new aliases; actual OTP verification 4/4, replay rejection 4/4, session revocation 4/4. These are server-side isolated QA round trips, not four independent manual browser sign-ins. The primary account was previously observed in a verified session.
- Mock tests accept other syntactically valid domains; no real delivery to an independent non-Gmail provider has been verified. Provider acceptance does not guarantee delivery to every valid address.

## J1.5 — HitPay sandbox
- Read-only evidence from separate J3 commit [987d6f8](https://github.com/Arrjack8847/learn-build-robot/commit/987d6f81dc19b2e8239caa370dba487400334639): authenticated sandbox plan GET 200, exact MYR 360 monthly two-cycle plan matched; webhook list/detail GET 200, one matching endpoint, 8/8 required events, no extras; signed synthetic ignored-event receiver returned 200 and correct revision.
- Current J3 sandbox is MYR; J1 legacy SGD placeholder/company contract differs. Do not reinterpret old MYR evidence or change payment business logic during J1. Resolve the configuration contract before later integration.
- Credential comparison from [31d9171](https://github.com/Arrjack8847/learn-build-robot/commit/31d9171683823e6ed9df2eaeb107d7ac96dbc8d5) returned same_as_legacy. Legacy HITPAY_API_KEY, HITPAY_SALT_KEY and HITPAY_API_BASE_URL entries are still scoped Preview + Production. No raw credential was exposed, and no production setting changed. Provision a separate sandbox credential privately in the development Wix vault, verify the new key differs from the legacy credential, and assess shared production configuration before any revocation. A genuine provider-generated sandbox webhook is still required; a signed synthetic ignored probe is not equivalent.

## J1.6 — Authentication and security
- Five-minute OTP expiry, 60-second resend cooldown, 5 requests per identity/hour, five failed attempts and 15-minute lock, one-time consumption, HMAC identity and session digests, HttpOnly Secure SameSite=Strict cookies, 12-hour session expiry, revocation, global durable 25/hour and 60/day open-email budget.
- Live QA: four verified, consumed and revoked sessions; three cross-identity session lookups rejected; no budget refusal or failures. Actual stale conditional write rejected. Eight independent fixture negative checks refused wrong site, production flags, missing key, unauthorized collection, malformed ID, non-QA parent and production diagnostics without any network call.
- Final browser-level acceptance across new identities, protection behavior on the intended integration host, and least-privilege credential review remain open. No real production endpoints were exercised.

## J1.7 — Testing Centre
- /dev/testing-centre, with /api/dev/j1/readiness. Exact J1 preview branch only. Page GET makes no upstream calls. Same-origin POST performs only one filtered Wix read; status values only. Production, other branches and unexpected host/origin/header rejected. Cache-Control private no-store, noindex, no-referrer, restrictive CSP. No raw secrets, OTPs, session tokens, student data, payment or email sending from the diagnostics page.
- Five dedicated readiness tests passed. Ready Vercel build; actual build-time authenticated Wix read probe passed. Unauthenticated request redirected to Vercel authentication. Authorized browser visual acceptance not independently performed.

## J1.8 / J1.9 — Documentation and regression evidence
- Exact earlier checkout adf1b32: 47 Node tests and 20 OTP fixture checks passed; four grouped registration/security fixture scenarios passed. With Testing Centre: 52/52 combined Node tests passed. Two additional one-shot acceptance fixture tests passed; latest build reports 7/7 dedicated J1 tests, plus the existing suites and successful build. Eight independent negative boundary checks passed.
- Real-provider run logged: databaseWrite=true, conditionalUpdate=true, staleWriteRejected=true, aliasCount=4, providerAccepted=4, otpVerified=4, replayRejected=4, sessionRevoked=4, crossIdentityRejected=3, budgetRefused=0, failed=0, oneShot=COMPLETE. Gmail metadata confirms all four deliveries.
- Temporary cloud runners stopped. Actual acceptance is distinct from mocked fixture results and metadata. No GitHub Actions used.
- Remaining release blockers: isolate sandbox key from legacy scope; prove genuine HitPay-generated sandbox event; complete authorized browser acceptance and any additional independent email-provider acceptance required by the project. No J2–J5 integration until the individual acceptance gates are approved.
