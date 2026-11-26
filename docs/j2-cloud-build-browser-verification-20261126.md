# J2 standalone cloud build and responsive browser verification — 26 November 2026

## Scope and exact revision

Tested Git commit: 2083efdb784501f24f0680d57395abb089e5617d. J2 branch only; no integration, new deployment, GitHub Actions, company account, real payments, or genuine student data. The temporary cloud sandbox had no exposed routes or live provider credentials; it was stopped after testing.

## Dependency and application build

A shallow sparse checkout of the exact commit succeeded in a Vercel Sandbox. Installed the existing bun.lock using bun install --frozen-lockfile. Runtime Node 24.22.3, Bun 1.4.5, Vite 8.1.5. Checkout contained src, scripts, tests, root configuration, public/home, the two imported 3D asset directories, and curriculum-source. Unrelated public curriculum assets were excluded, so this is full application source compilation, not a complete production asset packaging/release check.

The initial sparse checkout failed because imported 3D models were missing. Fetching the existing tracked directories resolved that environment issue without any app source edits. npm run build:j2 subsequently exited 0 (75,435 ms); strict J2 API TypeScript check passed, 28 standalone Node tests passed (0 failures), 20 OTP fixture checks passed, and Vite client/SSR/server bundling succeeded (3.35 s / 1.52 s / 2.75 s). Generated .output/server/index.mjs and a 1.2 GB output directory. The router generator updated routeTree.gen.ts in the disposable checkout only; no generated files pushed.

## Responsive end-to-end browser fixtures

The built application served on loopback with a local HTTPS proxy using the exact J2 parent and student HTTP handlers, real hashing/session logic, isolated in-memory persistence and captured fictional OTP emails. External requests blocked by the test browser; no Wix or email-provider network requests used for these tests. Playwright standard Chromium headless shell was installed in the sandbox after resolving missing Linux dependencies.

All three browser fixture runs passed; process exit 0 (20,473 ms).

| Viewport | Parent registration and OTP | Consent | Two siblings and separate PINs | Student sign-in and isolation | Reload/logout | Layout |
|---|---|---|---|---|---|---|
| 390 × 844 | Pass | Pass | Pass | Pass | Pass | Pass |
| 768 × 1024 | Pass | Pass | Pass | Pass | Pass | Pass |
| 1440 × 900 | Pass | Pass | Pass | Pass | Pass | Pass |

Each independent browser context registered two fictional siblings using one fictional parent inbox. The test entered an incorrect then correct OTP; confirmed consent gating; registered both students; set separate PINs; signed out; signed in through student email proof; selected the second sibling; rejected the first sibling's PIN; accepted the second sibling's PIN; verified the student-only HttpOnly, Secure, SameSite=Strict cookie and absence of payer/proof cookies; refreshed and confirmed student identity; signed out and checked cookie removal. Measured document/main horizontal overflow and broken images across key screens, and checked for uncaught page errors (none). These are functional responsive checks, not exhaustive visual approval or Safari/iOS device testing.

## Remaining standalone acceptance

- Genuine OTP delivery to five approved inboxes and confirmation of the runtime's actual Wix API key permissions against the deployed J2 feature. Existing live Wix metadata/concurrency tests are recorded separately.
- Final authorized private acceptance deployment after approved test sender/recipient configuration; the J2 release gate stays disabled and automatic deployments stay off.
- No claim of 100% real-provider or production acceptance. Other journeys remain out of scope. No production or company configuration changes.

The temporary sandbox was explicitly stopped. This report adds documentation only to the tested revision.
