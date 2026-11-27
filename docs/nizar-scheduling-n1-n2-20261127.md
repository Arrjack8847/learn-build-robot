# Nizar scheduling — N1 and N2 foundation

Source: STEM Makers Lab website: task briefs for the team, 25 November 2026. User has elected to work on Nizar's tasks now. Isolated branch based on J12345 60e044ec9a2b5970afcb8eb1e3c0f33f2db018aa; no modifications to main or existing integration branch. No automatic deployment, GitHub Actions, Wix mutation or provider call.

## N1 — Rules register

Recorded in brief:
- Opening hours written as 10–10 with lunch 12–1 and dinner 6–7; interpreted provisionally as 10:00–22:00 MYT with 12:00–13:00 and 18:00–19:00 closed. Days of operation still require confirmation.
- Capacity written as "5 slot drone and robot"; do not assume whether five shared places or five for each activity.
- One hour per child per day; paid membership required.
- Cancellation/move cutoff two hours before the booking.
- No-shows counted by calendar month; first warning, after second RM50 deposit before further bookings, missed booking forfeits deposit, unused deposit returned in cash at month's end. Staff can excuse with note; no-show not counted for timely cancellation.
- Waiting list, offer cancelled place to next eligible parent.
- Failed monthly charge: hold upcoming bookings for a still-undecided period, then release.
- J5 latest confirmed: fixed booked hour, zero grace. Earlier checkout or membership loss ends access. Walk-ins must use the same scheduling authority, capacity and opening-hour checks.

Pending owner approval: operating days; shared vs separate five-place capacity; how far ahead and how many future bookings per child; unpaid hold period; waitlist offer lifetime; whether a returned/held deposit carries across multiple bookings per existing brief (clarify per-booking wording vs retained account balance). No guessed defaults for production. N1 cannot be called complete until Shimi agrees.

## N2 — Wix Bookings evaluation (documentation review, not a configured live trial)

Wix Bookings classes support scheduled sessions, capacity, booking policies, attendance and waitlists. See:
- https://dev.wix.com/docs/api-reference/business-solutions/bookings/architecture
- https://support.wix.com/en/article/wix-bookings-setting-up-your-booking-policies
- https://dev.wix.com/docs/api-reference/business-solutions/bookings/bookings/introduction
- https://dev.wix.com/docs/api-reference/business-solutions/bookings/bookings/waitlist/api-overview
- https://support.wix.com/en/article/wix-bookings-adding-and-setting-up-waitlists

Recommendation: evaluate class sessions in private company-owned Wix copy; use custom React parent scheduling page/server adapter for J2 child ownership, J3 verified external HitPay membership, one booking per child per MYT day, monthly deposit ledger, browser waitlist UX and J4/J5 shared booking handoff. Wix's standard waitlist enrollment UX is mobile-app oriented; API exists, verify applicability. Do not create a second sign-in or independent source of booking truth. No live service creation or provider decision confirmed; concurrent last-place acceptance and cancellation/move semantics need proof. If native class API cannot enforce the one-per-child invariant and shared atomic capacity, evaluate a single canonical custom Wix-backed booking aggregate rather than duplicate authorities.

## Implementation sequence

N1 confirm policies and handoff; N2 validate provider choice and documented limitations; N3 parent scheduling page and server-authoritative availability/booking/cancel/reschedule, concurrency and sibling isolation; N4 warnings, no-shows, deposits, waitlist and unpaid-hold release; N5 staff day view and exact canonical data integration. Then combined private acceptance. Keep feature disabled until prerequisites and tests pass.

Proposed handoff: shared bookingId, childId, parentId (server only), local day, startAt/endAt in UTC epoch milliseconds (MYT business day), bookingStatus, activity/capacity pool, revision. Scheduling owns booking capacity and cancellation/move; J2 owns family access, J3 owns eligibility, J4/J5 owns attended transition, N4 owns no-show after the hour, staff excuses audited. No separate fabricated booking ID in J4 once actual shared adapter is connected. Review docs/j5-booking-handoff.md; zero grace supersedes its earlier suggested grace. Existing J12345 test walk-in records are not the canonical scheduling provider.

Status: rules register and provider documentation analysis prepared; no owner confirmation, provider prototype, booking implementation, tests, deployment or Wix changes yet.
