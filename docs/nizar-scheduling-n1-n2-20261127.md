# Nizar scheduling — N1 and N2 foundation

Source: STEM Makers Lab website: task briefs for the team, 25 November 2026. User has elected to work on Nizar's tasks now. Isolated branch based on J12345 60e044ec9a2b5970afcb8eb1e3c0f33f2db018aa; no modifications to main or existing integration branch. No automatic deployment, GitHub Actions, Wix mutation or provider call.

## N1 — Rules register

Recorded in brief:
- Operating schedule confirmed by user on 27 November 2026: Monday to Sunday, 10:00–22:00 MYT (Asia/Kuala_Lumpur); no bookable slots 12:00–13:00 (lunch) or 18:00–19:00 (dinner). Exactly ten one-hour sessions per operating day: 10, 11, 13, 14, 15, 16, 17, 19, 20, 21 local start hours. Nominal capacity 100 places/day, 700/week; exceptional closures remain an operational requirement.
- Capacity confirmed by user on 27 November 2026: five robotics places and five drone places independently per booked hour (ten total). Do not borrow capacity between pools. One booking per child per MYT day across both pools; activity-specific availability and waiting lists. Capacity is subject to server-side atomic enforcement in N3.
- One hour per child per day; paid membership required.
- Advance booking confirmed by user on 27 November 2026: seven calendar days in advance (MYT business dates; today through today + 7 inclusive, proposed boundary interpretation). No bookings for elapsed hours. Maximum simultaneous upcoming reservations confirmed by user on 27 November 2026: seven per child across both activity pools, with the separate one-booking-per-MYT-day restriction. A successfully cancelled reservation releases its place in the upcoming-booking count. Rescheduling must preserve both limits.
- Cancellation/move cutoff two hours before the booking.
- Deposit policy A approved by user 27 November 2026: one RM50 refundable balance per child per MYT calendar month, not separate deposits per booking. First no-show triggers warning; second blocks further bookings until verified online RM50 deposit payment. Further unexcused no-show forfeits held balance once and requires replenishment before new bookings. Remaining refundable balance returned in cash at month end with staff audit and reconciliation; do not mark refund paid until recorded. Monthly no-show counts reset; prior outstanding refunds remain payable. Timely cancellations and staff-excused absences do not count. Duplicate payment/no-show/refund events must not double-credit or debit.
- Waiting list: user approved a 30-minute offer expiry on 27 November 2026. Maintain separate queues by activity and booked hour; offer a released place in first-come-first-served order to the next eligible child. Reserve offered capacity until acceptance, decline or expiry (never after session start); revalidate membership, deposit requirements, child ownership, one-per-day and seven-upcoming-booking limits at acceptance. Declined/expired offers release capacity to the next eligible entry. Prevent duplicate offers and overbooking with atomic state changes; retries do not extend the deadline.
- Failed monthly charge: user approved a 24-hour hold on 27 November 2026. Preserve upcoming reservations for 24 elapsed hours from the verified failed renewal, block new reservations and learning access while membership is unpaid, notify parent, restore eligibility on verified payment, otherwise release remaining future reservations at expiry and offer places to eligible waiting-list members. Retries/duplicate notices must not restart the original deadline. Past or elapsed bookings are never reinstated. Exact treatment of an unpaid held booking whose hour elapses during the hold requires reconciliation with the no-show policy.
- J5 latest confirmed: fixed booked hour, zero grace. Earlier checkout or membership loss ends access. Walk-ins must use the same scheduling authority, capacity and opening-hour checks.

N1 principal policy decisions confirmed by user. Remaining acceptance dependencies: Shimi's formal agreement and Jack/Nizar shared contract agreement; treatment of already-reserved sessions after deposit forfeiture or unpaid hold expiry during the reserved hour; payment/refund reconciliation and exceptional closures. No guessed production defaults.

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

Status: user-confirmed principal N1 policy decisions recorded; formal owner/team agreement and provider prototype, booking implementation, tests, deployment and Wix changes remain pending.
