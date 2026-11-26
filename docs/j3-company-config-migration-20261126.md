# J3 company setup sheet alignment (26 Nov 2026)

Source: HitPay setup sheet for the Lab website, 25 Nov 2026, supplied by company.
Scope: isolated new server adapter; no live provider call, no configuration change, no automatic checkout.

- Seven canonical settings are validated with no implicit defaults; SGD sandbox, MYR live. New adapter refuses live execution.
- Existing MYR trials and historical evidence are deliberately preserved, with old variable names isolated until migration is verified. Do not reinterpret MYR evidence as SGD.
- Membership: card first, exact configured plan amount/currency, two-cycle sandbox test only. Provider docs currently show JSON for recurring billing; the company sheet requests form encoding. Keep documented JSON for this endpoint pending explicit sandbox verification/confirmation. Deposit uses form encoding per sheet; must verify against the provider before mounting.
- Reference: reserve an opaque unique reference linked durably to parent, child, purpose, currency and amount. This differs from a bare parent ID, to prevent ambiguity with multiple children. Confirm mapping with company.
- HITPAY_SALT must be the actual endpoint signing salt. API-key salt and per-endpoint salt can differ. Do not silently copy one into the other.
- Deposit evidence validator returns a candidate only, never a paid/eligible state. Provider response shape, authenticated charge lookup and atomic ledger implementation still require genuine sandbox evidence.
- Existing webhook receiver checks business_id. The provider payment_request example does not consistently show this field. Do not remove merchant validation globally. Add authenticated request lookup and merchant verification before accepting events without that field. Deposit webhook ingestion and processing are not yet mounted.
- Required next steps: rotate old exposed credentials; configure seven preview-only values privately; verify new SGD plan; connect durable authenticated J2 child/payment reservation and deposit ledger; register required events; verify card checkout, exact period, renewal/failure, deposit, duplicate/refund handling. Confirm cancellation and deposit return rules with booking team. Company privacy notice and hosting approval required. No keys in code or chat.

References:
https://docs.hitpayapp.com/apis/recurring-billing/create-billing
https://docs.hitpayapp.com/apis/guide/online-payments
https://docs.hitpayapp.com/apis/guide/events
