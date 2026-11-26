# J3 → J5 verified membership contract (isolated)

Internal candidate validator requires a verified signed charge event, authenticated provider observation, configured SGD amount, merchant, exact subscription/reference/plan binding and independently verified coverage. It rejects deposits, attachment-only events, failed/refunded payments and unverified coverage. Provider observation and coverage adapter are not implemented by this change; no genuine payment is credited.

Durable processor must atomically commit payment ledger, membership state, event completion and outbox, enforce global payment and period uniqueness, and reconcile stale events. Only its committed result may feed the status reader. The J5 student session adapter must authorize the student before reading this record; J5 still enforces check-in. No payer details or card data are returned. Renewal eligibility and cancellation/refund/grace policies are deliberately unverified until approved. No live or historical MYR evidence is reclassified.

19 isolated fixture assertions executed in JavaScript before commit. Node test file included. No runtime provider, Wix transaction, actual email or browser acceptance claimed.
