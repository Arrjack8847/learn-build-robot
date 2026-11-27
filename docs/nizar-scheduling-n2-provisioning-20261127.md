# N2 — Development provisioning and acceptance handoff

27 November 2026. Existing repository-pinned Wix development site: My Site 1 (09d613aa-3a95-42ff-9ee3-2aa0c706c447). No change to other sites or collections. Created collection NizarSchedulingPreview with fields environment (TEXT), stateVersion (TEXT), stateJson (TEXT). Readback confirmed ID and all three fields, legacy permissions read/insert/update/remove ADMIN, granular permission roles CMS_EDITOR for all four operations, specialPermissions empty. The granular result means CMS editors can access this collection; do not describe it as exclusively site administrators. No booking items inserted. Collection is on the development site, not the production domain. No live user data or deployment. Keep NIZAR_SCHEDULING_ENABLED=0.

## N2 verification deferred as requested during development

- Check the runtime's least-privilege development credential can get/insert/conditional-update only allowed collections, and a visitor/member cannot read or write the scheduling collection. Confirm company authorization for CMS-editor access; tighten if required.
- Run npm run test:nizar:n2 in Codespaces at the latest branch commit.
- Use fictional test records only and verify two parallel inserts, conditional-update loser, stale readback, timeout/unknown outcome, rejection of production and wrong branch.
- Check safe JSON payload size under actual provider limit. Wix's CMS introduction specifies 500 KB per item; application conservatively bounds its JSON to 200000 bytes. Current single aggregate is for a bounded pilot only, not full-capacity long-term production. Do not prune historical rows without an approved archival/idempotency strategy.
- Verify that N3 revalidates parent identity and ownership and J3 membership on each mutation; add durable request IDs and replay resolution before exposing any API. No native Wix booking records in parallel.

## N3/N4/N5 integration contract
Parent browser sends requested child/slot only; server derives canonical parent ID, fresh ownership and verified membership. All capacity counts, daily and upcoming limits, current-hour walk-ins and cancellations must use the same authoritative scheduling snapshot. No client override. Staff check-in and J5 must revalidate current booking ID, revision, canonical identity, fixed hour, membership, attendance and revocations. No second sign-in or source of capacity truth. Existing J4 provisional test attendance aggregate not an authoritative real booking; actual handoff in N5/integration. Deposit and waitlist states remain to implement in N4; do not claim they're connected. N3 needs to recheck full rules and use same CAS on every retry. No automatic deployment or GitHub Actions. No production activation.

Status: infrastructure code, empty collection, schema/permission readback complete. Fixture execution and live acceptance deferred; formal owner agreement and native/provider comparison limitations unchanged.
