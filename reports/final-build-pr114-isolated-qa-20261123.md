# BE STEM READY — Final Build draft PR #114 isolated QA

Date: 2026-11-23 (Asia/Kuala_Lumpur)  
Source revision: `2225045ae5ebe26aae53e3b096ea50f46a696b63`  
Scope: `Arrjack8847/learn-build-robot`, draft integration PR #114  
Environment: temporary Vercel Sandbox; testing only, **no deployment or GitHub Actions**.

## Executed test evidence

| Check | Actual result |
|---|---|
| `bun install --frozen-lockfile` | PASS; 465 packages installed |
| `npm run assets:webp` | PASS; eight original Level Selection assets regenerated **in temporary sandbox only** |
| `npm run test:final-build` | **80 passed, 0 failed** |
| `bunx vite build` | PASS; client/SSR/server and Nitro bundles generated |
| `bunx tsc --noEmit` | PASS; 0 errors **after source fixes and Vite-generated route typings** |
| `npm run build` | PASS; reran **80/80 tests** and generated Vite/Nitro bundles |
| `git diff --check` | PASS |

The initial sparse checkout lacked canonical PDFs and generated Level Selection assets; initial tests failed solely on missing test-fixture files. Adding the required original PDF directories and running the repository's existing `assets:webp` generation made all 80 tests pass. Missing imported 3D STL files in the sparse checkout likewise caused an initial Vite resolution failure; adding their existing source directory made Vite build pass. No application workaround or fixture falsification was used.

## Focused source corrections

- Checked crop-index accesses in Level 2's reference guard (existing length/finiteness validation remains).
- Guarded filtered Level 3 record lookup and optional source filename parsing.
- Made shared final-build registry URL splitting and one-element crypto-array indexing safe for TypeScript's strict index checking. Random selection remains unchanged.
- Clarified index safety for four-value normalized PDF crops in the shared verification adapter.
- Added only a nullish default to Level 1's PDF filename parser for standalone type safety. **Level 1 PDF reference URLs, image rendering, 4.2-second scanner animation, 15-minute clock, assessment logic and visual interface remain unchanged.**

Vite's TanStack Router plugin regenerated `src/routeTree.gen.ts` in the temporary checkout before the final TypeScript check. The regenerated `src/routeTree.gen.ts` has now been committed separately as `0593fa7ac1ad0fbca67668c39a4c3ead22a0d0f9` (verified Git blob SHA-1 `42c602a57b1c44adb22fa11ab5257bec36298e0b`), so standalone `tsc --noEmit` has current typings on a fresh checkout. The isolated TypeScript check passed with this exact generated file.

## Remaining release checks

- An end-to-end mobile-browser test at 320/375/390/430 CSS pixels and real Safari/iOS testing were **not performed**.
- Live PDF canvas-render failures, timer expiry/reload persistence, and touch interaction are not certified by static Node tests.
- Owner-authorized PDF reference fallbacks are not independently verified finished-model photographs; existing provenance labels remain.
- Vercel's Git-connected preview checks have reported build-rate-limit failures; a successful isolated Vite build does not resolve external deployment quotas.
- **Do not merge or deploy production** until these remaining user-experience and release checks are completed.

## Follow-up HTTP and browser QA attempt

- The built application served a Vite development HTML shell with HTTP 200 on `/practical/level-{2,3,4,5,6}/final-build`. This is **not** confirmation that the React UI hydrated or that the scanner worked in a browser.
- Playwright/Chromium was installed in an isolated sandbox, but launching the browser failed because the image lacked `libglib-2.0.so.0`. Installing Linux browser dependencies encountered an existing package-manager lock. **No mobile browser pass is claimed**; this remains an explicit release gate.
