# BE STEM READY — Level 5 independent recovery and draft integration QA

**Date:** 23 November 2026 (Malaysia)  
**Tested integration commit:** `0f60dd16294dd3d959eb72be216d63ed87aacb88`  
**Status:** DRAFT ONLY. No merge to main, Vercel deployment, GitHub Actions, or Browser Use.

## What is independently verified

- 45 registered exact-variant official Building PDF sources, including the six originally blocked PDFs. The six PDF SHA-256 values and all 82 source pages were independently audited in the six-variant recovery.
- **42 of 45** registered Level 5 Building variants have source-backed completed-model WebPs and five independently source-verified checklist questions per variant. That is **210 approved source-visible checklist questions**.
- Three newly recovered and student-eligible draft variants: **Remote Control Car**, **Voice Control Snail**, and **Voice Control Vehicle**. The other 39 were previously approved and their 39 hosted Wix URL values were verified **unchanged** relative to the original 39-image Git blob `a91003d468226e4bf29f05ebf6342cb0bc9c04f1`.
- Three exact-variant manuals **do not contain an independently identifiable completely assembled model**: Crack Shot **Optimized** (page 4 includes an unattached wheel), Machine Gun (page 29 requires uninstalled rubber band/connector), and Facial Recognition Time Clock (page 7 depicts camera module detached). The basic Crack Shot image is not an acceptable substitute. **Keep these three blocked.**

## Final three Wix media references (real, re-queried and publicly accessible)

| Level 5 variant | Source page | Finished WebP dimensions | Image SHA-256 | Actual Wix media |
|---|---:|---|---|---|
| Remote Control Car | 20 | 550×528 | `6183ecc26f4162f548873a4d66c0df168762b4744d1d9800343cc49d8a04cf01` | `https://static.wixstatic.com/media/78042f_852c62df18ec40ee83c9ccb7e25f7460~mv2.webp` |
| Voice Control Snail | 12 | 550×397 | `268a5d6a2fbb244da5871cd080bd7f4109980b731028f6aa87d1fce440fe503d` | `https://static.wixstatic.com/media/78042f_72ced3ae25a54a45b1815b9590380b6f~mv2.webp` |
| Voice Control Vehicle | 10 | 550×361 | `f627ccbb70fd03647d2135f0719fbea736ad9938b3c4397a1ef472f07a84b138` | `https://static.wixstatic.com/media/78042f_d36f964af5eb46b39673760192b53422~mv2.webp` |

**Verified actual media:** All three mapped Wix CDN URLs returned HTTP **200**, MIME **image/webp**, bytes equal to expected source sizes, and SHA-256 equal to exact authentic WebP binaries. Wix Media Manager showed **READY / OK / public** and source-correlated filenames/dimensions. The final Remote Control Car image is the **annotation-free** source-derived 550×528 crop, not the earlier 550×669 crop that included the printed page number.

**Remote Control Car crop and edit provenance:** Original exact PDF SHA `2affa29cfe3d529eb02f37b61a4a0f7a5b308709736ed2d468b77f6fd1eb458b`, source page 20. Final normalized crop (x,y,width,height) `[0.065,0.08,0.605,0.82]`. Only two regions were blank-background masked: the printed page number (normalized XYXY `[0.038,0.06,0.15,0.185]`) and the separate remote-controller illustration (polygon documented in `reports/final-build-level-5-remote-clean-second-pass-20261123.json`). No vehicle pixels were modified or synthesized. An isolated second source/PDF re-download confirmed all pixels outside those masks unchanged; clean WebP independently decoded at 550×528 and compared with the rendered PDF-derived crop at mean absolute error **0.929**. Canonical mapped hosted image is `78042f_852c62df18ec40ee83c9ccb7e25f7460~mv2.webp`. Duplicate earlier uploads were **not** selected in the canonical reference map.

## Local test execution evidence (not deployment)

A new isolated Vercel sandbox was used **only as a cloud CLI test environment**, with no deployment. A filtered sparse Git checkout was pinned to commit `0f60dd16294dd3d959eb72be216d63ed87aacb88`. It downloaded the sources and only the extra Level 2 Learning/Level 4 Building test-data folders required by existing tests; a generated WebP asset script produced the eight Level Selection WebPs locally for testing.

**Executed, passed:**
- `npm run test:final-build` — **50 / 50 tests passed, 0 failed**.
- `npm run build` — **success**, including local asset conversion, the same 50 tests, Vite client/server output, and Wix-backed PDF prune postbuild. There was **no Vercel production/preview deploy**.
- `find .output -path '*/final-build/level-5/*.webp'` — **zero local Level 5 WebPs in deployment output**. Robot media comes from actual Wix URLs.
- Independent CDN HTTP GET + SHA-256 — **3/3 exact matching authentic WebPs**; all three READY/OK/public.

**Browser/device tests:** Not performed: no real mobile Safari/Chrome testing at 320/375/390/430px, and no direct interactive manual testing on the actual deployed website. The scanner source-level tests verify its 15-minute deadline, previous animation choreography, source gating, and its Level 5 approved-only eligibility, but do not certify real-device behavior.

## Safe release boundaries

- The original **39 URL values** are unchanged. The approved mapping now has **42 entries** because three further variants satisfied both independent source-image and five-question verification. This necessarily changes the *file* blob SHA; it does **not** change any original approved URL value.
- The three incomplete official sources remain entirely excluded from the selectable student pool; do not generate artificial reference images or map basic Crack Shot to optimized.
- `src/data/finalBuildVerified.ts` has an additional strict candidate gate: check five questions, exact source URL/PDF SHA, WebP source SHA, Wix READY/public/CDN identity and dimensions before new variants become selectable. Existing 39 approved behavior unchanged.
- PR #113 (worker) and PR #114 (integration) remain **drafts**; no merge, production deploy or GitHub Actions.
- 42/45 **source-covered Level 5 Building variants** does not mean 42/51 full syllabus activities have independent manuals: eight syllabus-only projects remain excluded by their own lack of independent Building source.

## Exact unresolved requirements

The only responsible way to reach 45/45 is to obtain **official completed-model artwork or corrected exact-variant Building manuals** for **Crack Shot Optimized, Machine Gun, Facial Recognition Time Clock**, then independently verify source image, five final-model questions, Wix READY/canonical image, and regression tests. All attempted source-inspection steps are complete; any missing robot assemblies must remain blocked until genuine official evidence exists.


## Latest integration-head revalidation

**Verified code commit:** `80abeeb7f13af008fae1a7772f77bab20bbbfd40`, checked after the coordinated integration branch advanced from the first pinned `0f60dd1` QA snapshot. In the same isolated sandbox, fetched and hard-reset the sparse checkout to this exact head (no source writes) and reran `npm run build`.

- **PASS** — `npm run test:final-build`: **50 tests, 50 passed, 0 failed**.
- **PASS** — full Vite client and server build, plus prebuild eight Level Selection WebPs and postbuild output pruning.
- **PASS** — actual Wix CDN revalidation for the three newly approved Level 5 variants: HTTP 200, image/webp, matching complete source-file bytes and SHA-256.
- **PASS** — scanner's explicit `SCAN_MS = 4200` and `LIMIT_MS = 15 * 60 * 1000` remain unchanged. These are code/source checks, not real-device interactive QA.
- **No** GitHub Actions, Browser Use, PR merge or production/preview deployment.

This revalidation supersedes the earlier pinned `0f60dd1` code test snapshot for the same Level 5 behavior. The three missing exact official completed-model images remain blocked.
