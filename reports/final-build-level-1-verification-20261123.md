# Level 1 Final Build — isolated source-verification and production-safety audit

Audit date: 2026-11-23 (Asia/Kuala_Lumpur)
Repository: Arrjack8847/learn-build-robot
Exact coordinated master baseline: `1fe5c5336d45295e6e3252d0450b662337a1db50` (PR #108)
Level 5 integration observed, NOT modified: PR #114, `7c2d84e39bd09b89820f3f8242e9efc25e1e3a08`
Worker branch: `feat/final-build-level-1-verification`
Wix destination: Steam, `fe3fa828-9f74-45e8-97f7-8d00cbb7fba0` (site ownership/context confirmed in Wix)

## Actual verified inventory

- 59 Level 1 syllabus projects / 60 candidate manual variants (Crawl Slowly Basic + Optimized).
- 60 unique source PDF filenames mapped to existing registered Wix URLs and canonical project/variant IDs in `src/data/finalBuild/level-1-review-queue.json`; zero unresolved URL registrations.
- 35 URLs are from the newer Level 1 English-cleaned mapping; 25 retain older registered URLs requiring original-version confirmation.
- Source manifest: `src/data/levelOnePrototypeCrops.json`. Exactly 26 cover crops, 30 final-step/challenge crops, one lesson-photo crop, three requiring distinct model confirmation.
- 15 records use identical default normalized crop coordinates, which must be individually checked (not assumed correct).
- Low-confidence model identities: Basic programming.pdf (proposed page 26), Dynamic screen.pdf (page 8), Skating.pdf (page 5).
- `src/data/finalBuild/level-1-verified-references.json`: zero independently approved.
- Source PDF SHA-256 hashes verified in THIS worker session: **0/60**. Existing historical Wix metadata checks are not substitutes for downloading each current source and examining its bytes.
- Independently signed-off completed-model visuals: **0/60**.
- Manual-specific approved five-question checklists: **0/60** (0 of a potential 300 items approved).
- New authentic finished-robot WebPs extracted in this session: **0**.
- New WebPs uploaded to Wix: **0**. Mapping is intentionally empty.

## Engineering changes — preserve existing user-facing design

1. Added `src/data/levelOneReferenceGate.ts`: explicit opt-in approvals require matching syllabus project ID, manual variant ID, PDF filename and official URL, real 64-character SHA-256, matching validated page/crop, independent reviewer evidence and signoff, and **exactly five distinct source-evidenced questions**. Any Wix WebP also requires the exact mapped CDN URL, artwork path, SHA-256 and native dimensions.
2. Added `src/data/finalBuild/level-1-verified-references.json` and `level-1-wix-image-urls.json`. Neither has invented approvals or CDN links.
3. Preserved `src/data/levelOnePrototypeCrops.json` unchanged as the review candidate source. Its `approved:false` flag must also be updated *after* genuine signoff; it cannot authorize a student by itself.
4. Updated only the Level 1 route: its student discovery pool now contains **only** approved projects, chooses uniformly with the unchanged crypto RNG, restores only approved project+variant sessions, hides provisional image crops from normal students and allows provisional review only in local development. With zero approved references the student scanner is disabled rather than revealing unapproved artwork.
5. Added `LevelOneVerifiedWebp.tsx`: if a source-extracted Wix WebP is independently approved, show it in the existing model-image slot; reject dimension mismatch or load error and fall back to the existing *approved* PDF crop renderer. No scanner animation, color, backdrop, timing, or pass/retry UX was redesigned.
6. Added `scripts/final-build/level1-collect-evidence.py`: downloads actual registered Wix PDFs, checks PDF page bounds, calculates source SHA-256 and derives full-page PNG, provisional crop PNG and authentic PDF-rasterized WebP evidence. It intentionally **never** approves or uploads; all images are named unapproved.
7. Added `tests/level-one-final-build-verification.test.mjs`: independent Node structural regression tests for source registration, fail-closed approvals, originality, timer, scoring, crop bounds and Wix fallback.

The original `FinalBuildScanner.tsx` SHA is unchanged (`c4a6da3f7cc2eb7b73213cd8588db1e6141ccbc1`).
The original `FinalBuildPrototype.tsx` SHA is unchanged (`10f064b755d7531ba16624705c22c753efe1084e`).
The existing 15-minute timer, 4/5 pass threshold, scan duration and retry flow remain at their original source constants.

## Executed checks vs. not executed

**Executed:** 27/27 read-only structural assertions against the actual branch files passed: correct counts, unique PDF mappings, bounded provisional crops, zero phantom approvals and hashes, strict reference gate, approved-only pool, reduced exposure of provisional crops, unchanged scanner/render component SHAs, source text preserving time/score/retry logic and WebP dimension/fallback checks. These are static assertions, NOT a TypeScript build or user-device test.

**Not executed:** `node --test`, `npm run test:final-build`, `npm run build`, PyMuPDF extraction over 60 PDFs, independent source bytes/hash comparison, real camera/scanner execution, mobile browser test at 320/375/390/430 CSS px, overflow and interactive timeout/reload tests. This session had no accessible full local repository checkout; the browser PDF retrieval endpoint also rejected three targeted official Wix PDF URLs. No PDF visual inspection approval is claimed.

## Exact blockers and required release gates

1. Run `python scripts/final-build/level1-collect-evidence.py --output /tmp/level1-review` from an isolated checkout with PyMuPDF and Pillow. Independently inspect every full source page and crop and compare the recorded SHA-256 to the exact CURRENT official Building PDF version.
2. For each candidate: distinguish completed vs partially constructed, confirm variant, every structural element and source page; correct the original provisional page/crop only with source evidence. Investigate especially the 15 repeated generic crops and the three low-confidence identities.
3. Keep authentic PDF crops that are already suitable; extract and approve an original-PDF WebP only when the crop is unsuitable. Verify hash, dimensions, public Wix READY media, exact filename and CDN URL before populating `level-1-wix-image-urls.json`. Never upload unapproved evidence.
4. Produce five non-generic, manual-evidenced questions per approved variant. Record each question's source page and visible part/operation. Only then add signoff to `level-1-verified-references.json`, and update that candidate's legacy `approved` flag.
5. In a proper checkout, run `node --test tests/level-one-final-build-verification.test.mjs`, `npm run test:final-build`, `npm run build` and local mobile browser checks at 320, 375, 390 and 430px; check overflow, scanner, Wix PDF/WebP failure, late reload, 15-minute expiration, 4-of-5 pass and retry.
6. Reconcile separately in PR #114 without overwriting Level 5 code. No deployment, merge or GitHub Actions before complete QA.

**Outcome:** Level 1 safety gate and reviewer evidence tooling have been implemented; original visuals and animation source remain intact. Full original PDF / artwork verification and student release are BLOCKED until independent source checks and local end-to-end QA are actually completed.
