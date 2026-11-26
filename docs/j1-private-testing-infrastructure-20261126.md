# J1 private testing infrastructure — 26 Nov 2026

Scope: development branch only. No live provider operations, company domain, main branch, GitHub Actions, or real student data. Existing J2/J3 work is preserved; no new J2/J3 behavior is activated by this audit.

## Verified inventory
- Vercel project learn-build-robot: preview SSO and password protection present. The baseline bec5589cee9fcf834e81425332fcd00780305800 has a READY preview deployment. A READY build is not proof of browser acceptance, all unit tests, or live provider acceptance.
- The Wix development site My Site 1 is published and reachable through the authenticated Wix connector. It is pinned in the server store adapter.
- 37 collections listed, including app-managed collections. AuthenticationChallenges, AuthSessions, Parents, Children, PrivacyConsents, Staff, Memberships, CheckoutAttempts, Payments, PaymentWebhookEvents, PaymentEmailOutbox, SandboxCheckoutTrials, SandboxBillingState, LearningProgress, BuildingProgress, LevelProgress, QuizAttempts and BuildChallenges each report CMS_EDITOR for read, insert, update and remove, no special permission overrides. StudentProfiles and LearningSessions are present; their individual permissions still require verification.
- Do not read or store real student records during private testing. Collection metadata permissions are not proof of app-level authorization or runtime API key scope.
- StudentProfiles and Children need an explicit identity mapping, not duplicate accounts. Memberships already stores subscription references; do not create a redundant subscription collection. Deposit, attendance, check-in and administrative audit persistence still need schema decisions and verification.
- Current legacy HitPay API key, API base URL and salt key are scoped to Preview and Production. Do not modify production-scoped entries. Establish rotated preview-only settings, preferably in a dedicated private project if branch-level overrides cannot guarantee isolation.
- Existing code supports up to five allowlisted inboxes; only the primary is configured. New tests exercise five mocked addresses, sixth-address rejection, wrong-recipient rejection, provider failure, and production restriction. They do not prove real delivery or cross-account OTP acceptance.
- Existing J2 parent dashboard contradicts the updated student-first design. Defer UI changes until J1 acceptance, then remove the dashboard requirement. Parent is payer/consent only; individual student profiles own membership and learning status; staff uses a separate admin role.

## Setup and acceptance
1. Confirm personally controlled sending domain; configure a dedicated subdomain in Resend, use its exact DNS records, verify SPF/DKIM, and preserve any DMARC policy.
2. Configure PARENT_PREVIEW_VERIFIED_SENDER and PARENT_PREVIEW_RECIPIENTS (four additional approved inboxes) only on the development preview, with the existing primary recipient. No secrets or addresses in Git.
3. Rotate exposed sandbox credentials directly in HitPay. Provision the seven canonical settings on Preview only, with SGD and actual test plan/deposit amounts. Confirm endpoint-specific signing salt, merchant identity and plan currency from provider. Preserve legacy MYR evidence.
4. Verify the signed webhook route is reachable without making other private routes publicly accessible; reject forged/duplicate requests and validate merchant, reference, currency and amount.
5. Run the existing prebuild suite and npm test scripts in an authorized development runner, not GitHub Actions. Run five inbox acceptance tests, cross-account isolation, lockout, resend, expiry, session revocation, provider delivery failure, forged/duplicate webhook, and production-route negative tests. Record redacted results and commit SHA. Confirm browser access and existing learning functionality.
6. Verify database permissions for remaining collections and establish missing schema and staff/student authorization boundaries before marking J1 complete. Testing Centre must be preview-only and must never expose keys, OTPs, or session tokens.
7. No company migration until user acceptance of all five journeys and company authorization. Keep configuration migration separate from business logic.

## Status
Audit and incremental configuration documentation/test additions only. J1 remains incomplete; live OTP delivery to five inboxes, SGD sandbox verification, runtime access and full end-to-end acceptance remain unverified.

## Updated recipient policy — 26 Nov 2026
User requested all valid email addresses work without allowlisting. Protected preview only: PARENT_PREVIEW_OPEN_EMAIL=1, verified Resend sender, durable global 25 request/hour and 60 request/day budgets plus existing per-email cooldown, five-attempt lockout and expiry. Sessions resolve by hashed token and verified parent identity, without enumerating emails. Legacy restricted mode remains default. Never disable deployment protection; use only inboxes the tester controls. Actual delivery still requires live testing.
