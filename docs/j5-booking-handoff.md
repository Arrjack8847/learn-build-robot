# J5 / N3 shared booking handoff — draft for agreement

Source: STEM Makers Lab website - task briefs for the team, 25 November 2026, "Where the parts meet" and J5. This records a proposed integration boundary only. No Wix collections or booking policy changes are made, and this is not a substitute for the reviewed 24 November security design.

## Shared authoritative booking

The brief requires one shared list, written by Nizar's scheduling system and read/updated by J4 and J5:

| Required meaning | Proposed application field |
|---|---|
| Unique booking identity | bookingId |
| Child profile reference | childId |
| Local day (Malaysia) | day |
| Start instant | startAt |
| End instant | endAt |
| Status | bookingStatus: booked, cancelled, attended, no-show |

These names match the existing J4 application projection where possible. Timestamp serialization and provider-specific IDs must be agreed; this is not a new database schema. All timestamps are server-authoritative and the day/hour checks use Asia/Kuala_Lumpur. Do not trust child IDs, date, membership or attendance flags from a student browser.

## Shared responsibilities

- J2 supplies authenticated parent identity and owned children; no second parent identity system.
- J3 supplies authoritative child membership eligibility, not a client-side payment flag.
- N3 owns slot capacity, booking and move/cancel transitions; walk-ins must create a legitimate current-hour booking first through the shared service.
- J5 uses the exact reviewed code/pass design; successful redemption must commit attendance once for the same booking and child before returning access.
- N4 owns no-show transitions and deposit/reminder consequences. Staff excuses must be attributed and reconciled with that policy; final representation of an excuse is open.
- J4 reads the same records, supplies verified staff identity, and records manual corrections with staff name, reason and audit history. Checkout and code reissue must revoke access as specified by the reviewed design.

## Integration guarantees to establish

- Agree atomic attendance and pass issuance, reissue and revocation boundaries with the reviewed design; no sequential writes presented as an atomic transaction.
- One visit per booking even if redemption is repeated or concurrent.
- End of hour, revocation, and status change semantics; suggested 15-minute grace awaits approval.
- Scheduling and admin day view must match exactly.
- A server-verified pass and protected file delivery are both required. A public direct Wix URL or an exposed static PDF is a release blocker.

## Public artifact check

An opt-in audit script is available at scripts/security/audit-j5-public-output.mjs. Supply the actual deployment's public build directory, for example:

    node scripts/security/audit-j5-public-output.mjs .vercel/output/static

It flags PDF filenames/magic bytes, recognizable direct Wix-origin strings in common public text/wasm files, source maps and entries requiring review. A missing directory or empty artifact set is an error. This diagnostic does not prove the absence of dynamically assembled URLs, alternate origins, CDN copies, or authorization bypasses. Do not run against private server output. It is not wired into the standard build or run against a deployed artifact yet.

## Outstanding source and approvals

The reviewed 24 November design and trial notes are required by the original brief. Searches of available project files, conversation/email context and repository references did not locate them. No code-generation algorithm, rate limiter, access-pass scheme, or new course lock is implemented here. Agreement with Nizar and approved private delivery also remain outstanding. Wix credentials and live acceptance testing are deferred. Existing J2/J3/J4 behavior and production untouched.
