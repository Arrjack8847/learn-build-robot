# J4 private read contract v1 — 26 November 2026

Branch-only incremental implementation; no production deployment or shared merge.

The existing staff HTTP service deliberately returns 503: resolveServices is null. Existing desk screens and correction planners are retained. The new read service is an independently testable application boundary, not a connected runtime. No real records accessed.

## Proposed least-privilege fixture roles
| Resource | admin | staff | finance |
|---|---|---|---|
| Students and progress | read | read | no |
| Memberships | read | read | read |
| Payments and deposits | read | no | read |
| Attendance | read | read | no |
| Staff and audit | read | no | no |

This is a proposed private-test model; no company permissions were changed. No write capability follows from these read permissions.

## Adapter contract
identity.resolveStaff(context) must verify an individual staff session against authoritative current account state; returns subjectType=staff, staffId, role, accountStatus, expiresAt epoch ms, revokedAt. Never accept this object from HTTP request data. No parent/student session may resolve to staff.
store.list({actor,resource,page,pageSize,filters,sort,direction}) returns a server-filtered, permission-scoped page {rows,total}. store.getStudent({actor,studentId}) returns the exact authorized record or null. Stable sort tie-break by record ID required. No raw provider payload or payer email in projections. Canonical studentId is an application field: map to J2 childId/StudentProfiles only after their identity contract is settled. Aggregate and detail queries need authoritative adapters; do not derive totals from partial pages.
Payment evidenceType must distinguish fixture, hitpay-sandbox and desk-sandbox. Only J3 may establish genuine provider verification or activate membership. Currency and amounts are from authoritative records, not inferred. No fixture marked verified.
 
## Test evidence
Seven fixture contract checks executed against the same function source during this change: anonymous, parent, student, expired, revoked and inactive denied; least privilege; pagination and explicit projection; invalid filters and dates rejected; student isolation; currency, deposit and evidence preserved; adapter scope and verified fixture rejected. The committed Node test reproduces those checks. No deployed browser, Wix data, actual staff login, provider or cross-journey tests performed.

## Remaining gates
Connect verified staff sign-in/session revocation, rate limits, staff roles and audit persistence; build the real Wix read adapter with development-only identity and collection isolation; agree J1/J2/J3/J5/N3 mappings and booking/check-in atomicity. Existing desk payment/registration and code issuance must remain unavailable pending approved business rules. Implement complete responsive staff screens, pagination, detail, overview, check-in and audited operations; then run actual build, integration contracts, development DB and security acceptance. This branch is NOT independently complete.
