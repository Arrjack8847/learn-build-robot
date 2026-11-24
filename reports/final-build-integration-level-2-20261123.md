# BE STEM READY — Level 2 Wix artwork and shared-scanner integration

Date: 2026-11-23
Status: DRAFT — integration data committed; production not approved.
Site: Steam, fe3fa828-9f74-45e8-97f7-8d00cbb7fba0
Worker: PR #109, feat/final-build-level-2
Shared integration: PR #114, integration/final-build-levels-1-6

## Existing verified baseline

- 59 syllabus projects; 60 registered Building-manual variant URLs.
- 30 independently approved PDF-sourced WebP references; 30 blocked variants.
- 30 approved checklists with exactly five page-supported questions each (150).
- Previous worker PDF-byte audit: 60/60 retrieved and hashed, 1,056 pages. See `reports/final-build-level-2-qa-20261123.md` on PR #109.

## Media hosting completed

- Exactly 30 original committed WebPs uploaded as one batch to Steam Wix Media Manager; all returned READY; zero failed.
- A separate Media Manager Search Files query matched every upload by the original GitHub source URL AND exact original filename, independent of bulk-result order.
- All 390/390 media/source metadata checks passed (13 per image), including unique file IDs, CDN URLs, status READY/OK, public access metadata, MIME image/webp, exact original dimensions and byte lengths.
- `src/data/finalBuild/level-2-wix-image-urls.json` contains exactly 30 variant-specific CDN URLs. It contains no blocked variant.
- Complete source/hash-to-Wix media ID and metadata evidence: `reports/final-build-level-2-wix-upload-20261123.json`.
- Independently downloaded and rehashed all 30 *GitHub-committed source* WebP byte streams; 30/30 SHA-256, 30/30 file size, 30/30 WebP RIFF signatures, 30/30 parsed header dimensions matched. Test vector `abc` also matched. Details: `reports/final-build-level-2-webp-rehash-20261123.json`.
- No independent Wix CDN-body SHA-256 comparison, image decode/visual render of the Wix-hosted copies, or mobile browser image test has been claimed.

## Blocked variant recovery investigation

- Queried the current Steam Wix Media Manager for all 30 blocked source filenames; 30 searches completed with no API error.
- 17 variants have at least one other same-name PDF registration, but duplicate PDF registrations do not establish a genuine standalone Building manual.
- The only search results explicitly named Building manuals for a blocked source's search terms were different projects: Tower Crane, Double Beam Crane, and their PowerPoint derivatives under a search for Crane. They cannot be reassigned to Level 2's distinct blocked Crane variant.
- Search-result pagination remains incomplete for broad Hammer Robot and Robot War queries; these broad name results cannot be treated as comprehensive official source proof.
- The previous 30 blocked source hashes and page counts are retained. None of these media metadata findings supplies the independent PDF visual page review, finished model crop, and five approved questions needed for promotion.
- All 30 remain blocked. Zero new candidates promoted, zero synthetic artwork created, zero unsupported questions added.
- Per-variant source name, original SHA-256 and pages, alternative file IDs/URLs, search limitations and blocker reason: `reports/final-build-level-2-blocked-source-discovery-20261123.json` on the worker branch.

## Shared scanner changes

- PR #114 imports Level 2 refs, checklists and 30 Wix URL mappings.
- Adds `src/data/finalBuildLevel2Verified.ts`: enforces registered source URL equality, source/image SHA manifest agreement, dual review, five source-evidenced questions, explicit blocked exclusion and valid Wix WebP URL.
- Shared `src/data/finalBuildVerified.ts` dispatches Level 2 through this adapter. Existing Level 5 logic and 39 Level 5 Wix URLs are not replaced.
- Image-only Level 2 mode fails closed if the approved Wix URL is absent/invalid; it does not fabricate a normalized crop of the absolute PDF coordinates.
- Shared 15-minute persisted deadline, 4/5 scoring requirement, approved-only project selection, scanner choreography, retry and mobile styling remain unchanged.
- Regression file added: `tests/final-build-level-2-integration.test.mjs`.

## QA and release boundaries

Executed:
- 30/30 Wix upload READY responses and 390/390 separately queried metadata checks.
- 30/30 original Github WebP SHA-256 rehashes and header-size checks.
- 583/583 in-connector programmatic static manifest/integration contract assertions: all 30 approved + 150 checklist questions; 30 blocked excluded; unique 30 Wix URLs; Level 5 39-URL map intact; shared timer/scoring source contracts intact.

Not executed in this turn:
- Node/npm test runner in a full isolated repository checkout; the new Node test file is committed but has not been executed.
- TypeScript compilation / Vite production build.
- Browser QA at 320, 375, 390 or 430 px for this integrated PR, or real Safari.
- New PDF source-byte download, visual page-by-page classification or accepted recovered Building-manual crops for the 30 blocked sources.
- CDN image HTTP body download and hosted byte-for-byte SHA-256 comparison.

**Release gate:** keep PR #109 and PR #114 in DRAFT, do not merge or deploy production until full local test/build, integrated browser scanner/assessment/reload/retry QA, and source review are complete.

## Additional independently executed registry reconciliation and preview checks

- Reconstructed the current Level 2 eligible registry from the committed `advancedSyllabus.ts`, `practical.ts`, `pdfActivityManuals.ts` and `levelOneToThreeWixPdfUrls.ts` source: **59 syllabus projects / 60 practical registrations / 60 URL variants**; distinct See Saw V1 and V2 confirmed.
- All **30 approved variant IDs** exist in that registry and the registered Wix PDF URL equals each approved manifest source URL. The other exact **30** registry variant IDs equal the blocked set. **0** manifest-to-registry URL mismatches.
- Independently executed **584/584** source/data contract assertions against current integrated files (not a Node/Vite invocation). Exact source GitHub WebP checks were separately 30/30 SHA-256, dimensions, and bytes.
- Added `tests/final-build-level-2-integration.test.mjs` to the actual `npm run test:final-build` command in `package.json` (commit `a9c5a1e966f34b77bb7adc96418b2cf8b2af7cfb`). This test is now enforced in subsequent builds, but **the updated npm command was not successfully executed in this turn**.
- Independently inspected Vercel build events for the earlier existing preview deployment `dpl_FDWwQrR8JbeW8a9zPyUvvnnhpqkL` at commit `91e73386ac25fcb73ed0f449b8614a0294072870` (after Level 2 integration, before the new package test command): 39/39 then-configured Node tests passed, 0 failures, and the Vite production build completed. It does **not** prove the newly added Level 2 test or current-HEAD build passes.
- Fresh non-production preview build for the current PR #114 commit could not run: Vercel returned HTTP 402 `api-deployments-free-per-day`, exceeding 100 API deployments/day, retry-after 86400 seconds. Do not describe this as a build pass or as Level 2 mobile QA.
- Source PDF inspection: `.usrfiles.com` downloads were rejected by the connected Wix runtime (403 forbidden for that host), web PDF access also failed, and no authenticated alternate building-manual PDF/crop was visually approved. The 30 blocked remain excluded.

**Current status:** uploaded artwork verified, integrated Level 2 source adapter and tests committed, draft PR maintained. Production and current-commit browser/TypeScript release gates are still unmet.


## 2026-11-23 continuation — full blocked-search pagination and recheck

- Worker PR #109, commit `f60ec44ec6740c494f972fe25bb9dee3764886f7`, completes the two previously outstanding Media Manager cursor searches: **Hammer Robot 142/142 matches (2 pages)** and **Robot War 152/152 matches (2 pages)**. The worker report now marks all 30 blocked search trails fully paginated.
- Additional Level 2-labelled PDFs were identified, `BSR-L2--Foundational-Robots--Hammer robot.pdf` and `BSR-L2--Machines-Mechanisms--Robot war.pdf`. These are only PDF registration candidates. No new Building manual source provenance, finished-model visual acceptance or supported 5-question checklist has been established; no blocked variant was promoted.
- A new independent, read-only connector-side audit of the **current branch files** executed **947/947 manifest/source-contract assertions** with zero failures: 30 approved references, 150 source-evidenced questions, 30 READY mappings, 30 blocked exclusions, unique hosted URL/media IDs, Level 2 eligible dispatch, 15-minute / 4-of-5 source contracts, and preservation of all 39 Level 5 Wix URLs.
- This is **not** a full Node test, TypeScript compilation, Vite build, native mobile/Safari functional run or CDN-body SHA-256 comparison. Those release gates remain open.
- Continue to keep PR #109 and PR #114 **DRAFT**, retain all 30 blocked variants outside student discovery, and do not merge or deploy production.


## 2026-11-23 independent live Wix CDN byte-verification

- Independently fetched all **30/30 approved Level 2 hosted WebPs** directly from their actual `static.wixstatic.com` URLs. Every GET returned HTTP 200. The response bodies were decoded and hashed using WebCrypto SHA-256; an `abc` known-answer digest test also passed.
- **30/30 exact hosted-vs-original SHA-256 matches**; **30/30 exact byte-length matches**; **30/30 RIFF/WEBP signatures and header dimensions matched**. **Zero failures.** This resolves the previously open live-CDN byte-integrity gate for approved Level 2 media.
- Machine-readable evidence: `reports/final-build-level-2-wix-cdn-sha256-20261123.json`, added to both worker and integration branches.
- Preserve the original Wix upload report as its historical snapshot; its old `cdnhostedSha256Verified=false` describes evidence at upload time only, not the later verification outcome.
- The two additional Level 2-labelled PDF candidates for Hammer Robot and Robot War remain **unapproved**: independent PDF-body access/visual Building-manual classification was unavailable, and direct download via the Wix API returned a URL access restriction. Do not promote based on filename or metadata.
- **30 approved / 30 blocked** still applies. The remaining release gates are a full isolated Node/TypeScript/Vite run, integrated mobile/browser functional and image-render QA, and source-authentic recovery for the blocked variants. No merging or production deployment.
