# Phase 9 — Combined J5 test evidence (2026-11-26)
Audited source commit: d3d37e02fdeaf7ffefbe4fa884c53bdae1dbeda3. No deployment or integration. Node 22.16.0. Test workspace reconstructed using exact committed source/test bytes from prior phases and GitHub; no real student, payer, credentials, payment or booking records.

## Executed
- First combined 11-file regression: 147 pass, 0 fail.
- Added the four previously unexecuted in this combined run legacy J5 test files: 206 pass, 0 fail, 15 files. Reconstructed both missing source modules and verified Git blob hashes.
- Added 11 independent acceptance cases with eight fictional students from five fictional payer identities. Combined native run: 217 pass, 0 fail, 16 test files. SQLite memory database, native Request/Response, injected student session resolver, course authority, PDF streaming fixture. Test SHA d116d1363dbd5cc14ac003057a9d82a78b662868. This is an independent service acceptance fixture, not actual browser or J2/J3/J4 integration. G has a pre-authorized Level 2 fixture, not demonstrated automatic progression. H assessment retry/overtime evaluates separate attempts, not durable attempt persistence.
- Prior Phase 7 exact source verification covers 598 PDF source URL rewrites and matching catalog. The inventory Node test file requires the 309301-byte manifest and full catalog, which were not materialized in this workspace. It is excluded from the executed 217; do not claim all 17 test files ran.
- Chromium launch using Python Playwright succeeded, but navigation to the local HTTP fixture returned net::ERR_BLOCKED_BY_ADMINISTRATOR. Zero browser assertions passed. Session TypeScript transpileModule reported no syntax diagnostics; not a typecheck or full compile.
- Git checkout attempt failed: Could not resolve host github.com. No full application source checkout or npm dependencies available; full Vite compile, route regeneration and actual private artifact build not executed. Do not bypass browser policy or use Actions. No actual Wix database permission testing, real sessions, payment, booking, or private PDF storage.
- Full browser viewport matrix (portrait/landscape/tablet/laptop/desktop, Chrome/Safari), quiz/persistence, exact resume, secure challenge selection and writes, real progression, staff handoff and live private-origin denial still outstanding. J5.1–11 not 100% accepted; Phase 9 only isolated regression completed.

## Reproducibility
npm run test:j5:all (requires complete repository checkout, Node 22.13+ for node:sqlite). This command includes the PDF inventory tests that were not run in the reconstructed workspace. No CI trigger, deployment or other journey changes.
