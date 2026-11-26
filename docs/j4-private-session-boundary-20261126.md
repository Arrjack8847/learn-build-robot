# J4 preview staff session boundary

Staff sessions are isolated from parent and student sessions. The dedicated host-only cookie is HttpOnly, Secure and SameSite=Strict when cleared. Every read checks the current account type, active status, allowed role and authentication version, and verifies session expiry and revocation. No role is read from browser input. The caller must inject a cryptographic staff-domain token digest and a server-owned durable store. The logout adapter must atomically persist revocation and audit. No shared password or bypass.

This is an application boundary, not an implemented staff sign-in. Trusted authentication/OTP issuance, independently scoped secret, approved staff accounts, rate-limiting, token issuance, Wix session persistence and actual logout transaction are still missing. Do not connect the HTTP service until these are independently verified. Existing J2/J3/J5 modules untouched.

Fixture checks executed against the authored function: production construction rejected; missing, parent and duplicate cookie denied before storage; active individual staff session resolved; parent session, expiry and revoked session denied; account deactivation and role version invalidation; logout revokes and clears cookie; replay denied. The Node test reproduces them but was not run in a repository runner. No database or browser acceptance.
