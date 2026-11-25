# Wix LMS integration — development release gate

Audit: 2026-11-25. Development only. Do not merge to main, publish Wix, transfer to company, or deploy without owner authorization.

## Verified snapshot

- Frontend audited commit: d516490504d89391da5f47d2354fdb29aad3b2ad (17 commits ahead of main 444ef548d5372ed2baf9de4aa48d02b331869cd3 before this report).
- Private backend: Arrjack8847/bestemready-wix-backend, feat/lms-backend-foundation, audited commit 4e12137447d8302b64c628be87af5ee5807e5824 (12 commits ahead of main 57e57f54f959ab4fb3b6e4055c7cfb93ac0a2af4).
- Wix development site: My Site 1, 09d613aa-3a95-42ff-9ee3-2aa0c706c447. Draft, free plan, Velo enabled, Members Area installed.
- All eight collections have ADMIN insert/update/remove/read permissions (verified via Wix API).
- Correct development OAuth client: BE STEM READY, 8b252965-4a16-43ff-a709-098f5e7e9875. Redirect URI and domain lists both empty; custom login URL not configured.
- 15 exported HTTP handlers, not yet running on the draft site.
- Admin management uses Wix CMS; no public admin endpoint or separate login.

## Configuration (never add client secrets or API keys to the frontend)

VITE_WIX_CLIENT_ID is the confirmed public OAuth client identifier, supplied through the chosen development host configuration. Hosted sign-in needs the published development site and exact callback /auth/callback on an approved HTTPS origin. The login and logout redirect destinations must be allowed. Do not change the production site's client. The target preview origin still requires owner approval.

Keep the following OFF until their individual integration gates pass:
- VITE_WIX_ACTIVITY_SYNC=false
- VITE_WIX_QUIZ_SYNC=false
- VITE_WIX_CHALLENGE_SYNC=false

## Blocking gaps

1. Complete and validate export of all 321 quiz banks (6 imported / 60 questions; expected 3,210). Verify against personal curriculum, remove answer keys from production browser bundles; historical public commits cannot be made secret by removing files.
2. Import full approved Final Build candidate registries for all levels. Current pilot: 29 Level 2 projects / 30 variants. Level 1 uses separate local component. Confirm variant URLs and evidence against the active personal frontend.
3. Confirm completion thresholds and implement safe sequential unlocking. Current readiness endpoint is intentionally read-only; unlocking disabled.
4. Move persistent member sessions to a server-managed secure session design. Current sessionStorage is tab-scoped and accessible to page JavaScript.
5. Complete member-scoped recovery, activity status hydration, page/step/time synchronization and remaining non-PDF flows. Do not upload historical local progress. Test same-device account switching; existing demo local state is not a member database.
6. Verify Wix Data custom IDs, query limits, actual membership status, CORS, response contract, duplicate writes, profile isolation, and CMS free-plan capacity. Four immutable challenge phase rows and two quiz/activity milestone rows increase storage usage. No runtime test has been performed.
7. Build both projects using an authorized remote development environment; no GitHub Actions or new Vercel deployment. Regenerate route tree via existing build tooling. Verify static build and tests, including legacy Final Build source-pattern tests after new guards are added.

## Acceptance tests (not yet executed)

- Anonymous or unapproved account cannot read or write private student data.
- Two independent approved members cannot read, submit or overwrite one another's activity.
- Registration, login, callback state mismatch, token refresh, logout and expired sessions.
- Learning and Building start/finish, reference-only versus completed builds, invalid project IDs, locked-level rejection and duplicate requests.
- Quiz uses selected questions, five distinct topics, exact answer validation, 4/5 pass, repeat submission and retry.
- Final Build selects eligible project uniformly, keeps selected variant, uses server start/finish timestamps, 4/5 within 900 seconds, records overtime, repeat submission, retry, refresh recovery.
- Dashboard reports actual CMS counts and recent attempts, not fake values.
- Level 1 initially available; higher levels fail closed until prerequisites and approved unlock logic pass.
- Existing PDF routing and animations, mobile/desktop layout, no regressions.
- All eight collections retain administrator-only direct access, no public admin API.

Only after passing the above and owner approval, merge personal branches and plan a separate controlled transfer to the company repository. No student records have been reset as part of this audit.
