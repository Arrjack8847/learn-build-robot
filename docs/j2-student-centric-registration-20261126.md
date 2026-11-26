# J2 student-centric registration — 26 Nov 2026
Development-only change from 0dcd90cd53e08658d7f9f26f3119d95387ac731d. The normal payer journey now ends at registration/payment selection, not family management. Existing legacy fictional walkthrough remains explicitly opt-in for regression compatibility. The old normal dashboard URL redirects to authenticated registration.
- Existing family-status, family-consent, family-child-create and family-child-get APIs are reused. Ownership and consent are checked again on the server before confirming a selected student.
- Confirmation is a fail-closed integration placeholder, not a J3 checkout intent or payment. No amount, membership activation, or eligibility changes.
- Existing J1 allowlist supports five configured addresses; genuine five-inbox acceptance is pending.
- Student authentication decision required: existing Wix member sign-in is separate from J2 Children; a verified one-to-one mapping to StudentProfiles and student-only session must be designed with J5. Options: staff-issued individual student code plus private PIN with secure recovery; unique Wix member account per student (requires distinct supported credentials); managed device/staff-assisted enrollment and short-lived student sessions. No permanent auth method chosen.
- Membership initialization and J3 server-side checkout contract remain pending; absence of payment must not grant access.
- No main/production changes, company credentials, or real payments. Build, browser, concurrency and genuine multi-account acceptance remain to be verified. Do not mark J2 complete.

## Student authentication decision update
Parent email OTP plus student-specific ID/PIN approved; see [J2 → J5 student identity contract](j2-j5-student-identity-contract-20261126.md). Fixture-tested foundation planned for preview prebuild; live routes not enabled.
