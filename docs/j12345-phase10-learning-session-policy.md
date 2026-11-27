# Phase 10 — Approved learning session policy

Owner response: "one hour". Maximum 60 minutes from the original successful J4 check-in. Interpretation: stop earlier at staff checkout, membership expiry, or MYT midnight, preserving existing daily check-in and membership constraints. Refresh, navigation, assessment retries and sign-in do not reset the clock. Existing J4 attendance behavior remains unchanged; automatic checkout and a second same-day session are not introduced. No grace period is assumed.

Server computes a fixed expiry and checks fresh canonical identity, membership, attendance and committed level state. A second attendance/membership read rejects changes before granting. Browser uses existing expiry timer and 15-second revalidation. Expired sessions have a specific denial message. Profile shows the visit deadline as a projection, not an actual grant. Cross-record races and device behavior remain for acceptance tests.

New J12345_LEARNING_SESSION_ENABLED defaults to 0, independent of course activation. Do not activate until private storage, curriculum, persistence and live acceptance prerequisites are addressed. PDF storage is still disconnected. The one-hour decision is implemented at source level, not live verified. New fixture assertions added but not run. No database, production or deployment change.
