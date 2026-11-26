# J2 standalone priority functions — verification record

Scope: registration/consent, parent email OTP, multiple student registration, student PIN, account isolation/session security only. Other journeys, integration, deployment, company accounts and payments excluded.

## Implemented and verified
- Current privacy acceptance is recorded once per verified parent and notice version; an updated test notice requires new acceptance and preserves the old timestamp and version. Concurrent consent requests do not create extra records. No company-approved privacy notice implied.
- Student registration reserves the request ID with immutable input binding, deduplicates normalized name plus birth year within the same verified payer, preserves legacy student IDs, and rejects ambiguous historical duplicates. A refreshed or different request key does not create a second copy of the same student. Different students with identical normalized name and birth year are treated as duplicates in this two-field test model; do not merge historical duplicates or create a second identity without a reviewed distinguishing process.
- Created StudentRegistrationRequests on the confirmed development Wix site with four fields (parentId, requestDigest, inputDigest, childId), all operations CMS_EDITOR only, no special permission overrides. Live disposable test: five concurrent inserts, one success/four 409 duplicate conflicts, strong readback of winning row, removal and 404 cleanup verified. No real family data.
- OTP core owns its purpose namespace; parent and student email proof cannot substitute for each other. Successful OTP verification requires strong session readback; failed persistence is not reported as sign-in.
- Student PIN enrollment rechecks fresh payer authorization after hashing. Payer and student HTTP handlers can be tested without a deployment. Changing to payer authentication revokes prior student session and proof, and clears their cookies; student sign-in already revokes payer session. No new student or payer management dashboard.
- Existing normal payer UI reuses matching record on retry instead of rejecting legitimate retry; the request key is renewed for a changed payload, not repeated identical submissions.

## Test evidence
Node 22.16.0, executed on exact repository files corresponding to commit 29f29afbf9fc6c6f7536dda1efaaba616c454988: 17 focused Node tests passed, 0 failed, plus 20 OTP scenario checks passed. Test files: parent-portal-email, j2-parent-http, j2-registration-hardening, j2-five-payer-fixture, j2-student-context, j2-student-http, j2-student-identity and j2-student-rate-limit, plus parent-preview-otp standalone script. All 17 test cases use fictional identities and injected memory persistence/email transport; live Wix concurrency is separate. New UI and strict HTTP path/UTF-8 input changes in this commit need final regression execution. No browser or actual inbox claims.

## Outstanding
Standalone backend functionality is implemented and focused fixture tests pass. Full application build, browser/mobile checks, deployed runtime credentials and actual inbox acceptance remain necessary for 100% real-world verification. No preview deployed; STUDENT_AUTH_ENABLED remains false. No changes to other journeys.
