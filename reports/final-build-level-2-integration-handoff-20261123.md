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
