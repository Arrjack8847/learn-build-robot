# BE STEM READY — Level 5 owner-authorized PDF fallback completion

**Dated 2026-11-23 · DO NOT MERGE OR DEPLOY · PR #113 worker / PR #114 integration**

## Verified release configuration

| Measure | Result |
|---|---|
| Official syllabus projects | 51 |
| Registered Building-source projects / variants | 43 / **45** |
| Independently approved finished-model WebP references on Steam Wix | **42** (unchanged) |
| Owner-authorized official PDF instructional fallbacks | **3** |
| Total selectable variants in shared scanner | **45** |
| Independently evidence-checked self-assessment questions | **210** (preserved) |
| Owner-authorized general construction self-assessment questions | **15** (5 per fallback) |
| Total student-facing questions | **225** |
| New WebPs / new Wix image uploads / new CDN media identities | **0 / 0 / 0** |

The 3 PDF variants are explicitly marked as incomplete-assembly **instruction references**, not independently reviewed finished-model artwork. The owner has authorized student inclusion, not verification of nonexistent after-assembly imagery. All 42 existing Wix WebP CDN URLs and their media objects are preserved byte-for-byte as strings in `src/data/finalBuild/level-5-wix-image-urls.json`; no retroactive claim that their CDN bodies were reverified in this run.

## Three official PDF fallbacks

| Variant | Original registered official Building PDF | SHA-256 verified on 2026-11-23 | Pages | Page displayed | Incomplete-source caveat |
|---|---|---|---:|---:|---|
| `level-5-crack-shot:optimized` | [Original PDF](https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/7fc4ca_835593144e5f475e995524016c5791d4.pdf) | `cfb54f435a8345ca010a6db10c0c1ed37a5a77f48d3086f25a5a7ae28f4f5dcf` | 4 | 4 | Detached wheel on the final optimized instruction page |
| `level-5-machine-gun` | [Original PDF](https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/78042f_f65e51bc47304554b99de3e3a96109cb.pdf) | `acc9ac20908550895909ac6c73d473301732d15cbbe4f03049c1d4b84f1a60c1` | 29 | 29 | The final manual page shows a rubber-band/connector attachment step, not a fully assembled model |
| `level-5-facial-recognition-time-clock` | [Original PDF](https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/7fc4ca_dfc2fffdf072479282e6a039a228b3e7.pdf) | `d864a564ec020cf36df072b980ca763a133aabbd8d4115e50f564ffb02dca872` | 7 | 7 | The final instruction page shows a camera module detached beside the clock |

All three URLs were **directly downloaded again** during this run into an isolated Vercel Sandbox; each binary SHA-256 was checked with `sha256sum -c` against the committed source record and each was opened with PyMuPDF, confirming PDF page counts **4 / 29 / 7** and image-bearing pages. The existing Level 5 worker's prior page-by-page visual audit records the missing final-assembly views; this run did not independently certify a completed model where its official PDF shows an instruction stage.

The correct **Crack Shot — Optimized** PDF is used. The separate Basic Crack Shot image is never substituted. The Machine Gun PDF still instructs a final rubber-band/connector attachment. Facial Recognition Time Clock still has a detached camera in its last instruction image. No invented components, compositing, substitutions, crop mislabeling or rendered pseudo-final model were introduced.

## Final Build integration

- New owner-authorization source of truth: `src/data/finalBuild/level-5-owner-authorized-pdf-fallbacks.json`, first committed in worker PR #113 and separately to integration PR #114.
- Shared runtime `src/data/finalBuildVerified.ts` gates each PDF fallback by exact variant+project ID, registered official source URL, recorded SHA, page number, absence of any Wix image mapping, owner authorization flag, and exactly five honest self-assessment questions. The 42 WebP reference gates are unchanged.
- Shared `FinalBuildExam.tsx` exposes a labeled PDF reference link and allows student challenge start without falsely requiring a finished-model WebP. The 4.2-second random scanner, 15-minute clock, 4/5 pass requirement, overtime, retry and project-weighted selection remain unchanged.
- **Actual runtime smoke test** using Bun imported `getVerifiedFinalBuildPool(5)`: **43 selectable projects, 45 variants, 225 questions, 0 variants with wrong question count**, precisely the three expected PDF-mode IDs.

## QA performed

- **Full shared test suite:** `npm run assets:webp` then `npm run test:final-build` at integration commit `d0097e31d04deea8d443be4bed4a62eb568ca037`: **80 passed, 0 failed** (including new Level 5 fallback tests, Level 2 and pre-existing level suites).
- **Production-mode isolated compilation:** `npm run build` at integration commit `87803f22982becb25a00f1d036006918018c72df` after sparse checkout included original artwork, Building assets and 3D references: **success** with test run and client/SSR/server bundles. Build not re-executed after the subsequent strictly type-safety guard adjustments.
- **Strict TypeScript diagnostic:** `bunx tsc --noEmit --pretty false` on integration SHA `d0097e31d04deea8d443be4bed4a62eb568ca037` returned **26 errors** (not clean), primarily existing cross-level adapters/registry and remaining inherited `finalBuildVerified.ts` strict-nullability issues. These are an outstanding integration-wide quality gate, not concealed as success.
- **Real mobile browser/Safari QA:** not executed. No deployed preview generated.
- **GitHub Actions:** not run. **Main merge:** none. **Production / Vercel deployment:** none.

## All 42 preserved Steam Wix WebP references

| Registered variant ID | Existing canonical Wix WebP URL |
|---|---|
| `level-5-curling-game` | https://static.wixstatic.com/media/78042f_e24113c5bfda443a9b94cf62d1ca8f1b~mv2.webp |
| `level-5-curling-game:optimized` | https://static.wixstatic.com/media/78042f_94e1c77557e9455eb8bb3bfc699ec225~mv2.webp |
| `level-5-drawing-machine` | https://static.wixstatic.com/media/78042f_36ed80a994434d6891381215cd3bfe06~mv2.webp |
| `level-5-firefly` | https://static.wixstatic.com/media/78042f_ed8d4d3addeb49f1ac628ab64e96ae05~mv2.webp |
| `level-5-goalkeeper` | https://static.wixstatic.com/media/78042f_e8cd1be466f04d209e3293eccd662f0d~mv2.webp |
| `level-5-spanish-bullfight` | https://static.wixstatic.com/media/78042f_551642956d70493ca120386e4012a369~mv2.webp |
| `level-5-the-warrior` | https://static.wixstatic.com/media/78042f_7456cf1890e9405086c8ad6cfdf7609a~mv2.webp |
| `level-5-magnetic-anti-theft-cabinet` | https://static.wixstatic.com/media/78042f_49df27dad03643f0936a423fb96661c7~mv2.webp |
| `level-5-please-scan-to-ride` | https://static.wixstatic.com/media/78042f_9975fd4b097b448e8807d7dc5e9391a8~mv2.webp |
| `level-5-smart-cash-register` | https://static.wixstatic.com/media/78042f_bf3426b7c88b4736afe9e2711200af94~mv2.webp |
| `level-5-smart-guiding-car` | https://static.wixstatic.com/media/78042f_d6e126af73a3461db0bff7c8f80bfb87~mv2.webp |
| `level-5-lucky-prize-wheel` | https://static.wixstatic.com/media/78042f_218c126c701e41c09af20adf03186387~mv2.webp |
| `level-5-oil-pumping-unit` | https://static.wixstatic.com/media/78042f_8de3f5ce74b54c21a32ec7885bf5ba18~mv2.webp |
| `level-5-swinging-shark` | https://static.wixstatic.com/media/78042f_b51df103bd8c41b68929d62c9676cbe9~mv2.webp |
| `level-5-runner` | https://static.wixstatic.com/media/78042f_aab5afda845f44f692041f5591fd5230~mv2.webp |
| `level-5-welcome-sign` | https://static.wixstatic.com/media/78042f_5672764d041d4df8ba9693d285ccd265~mv2.webp |
| `level-5-car-lights` | https://static.wixstatic.com/media/78042f_49536cc4dd6c401a90b677fd1fae2878~mv2.webp |
| `level-5-direction-indicator` | https://static.wixstatic.com/media/78042f_8ffff24a37f249b5857bf419b40b5e7a~mv2.webp |
| `level-5-magnetic-object-finder` | https://static.wixstatic.com/media/78042f_4547d9dbe48a411393aa366dda1168b7~mv2.webp |
| `level-5-passenger-counter` | https://static.wixstatic.com/media/78042f_8c02a5ea7450486fa829e856b286c765~mv2.webp |
| `level-5-big-pendulum` | https://static.wixstatic.com/media/78042f_abfc617aaa18400482f2384090f64b51~mv2.webp |
| `level-5-chairoplane` | https://static.wixstatic.com/media/78042f_cf167070f5a1466186fe2e3f882aa148~mv2.webp |
| `level-5-crack-shot` | https://static.wixstatic.com/media/78042f_51ffb03cdc3346f8b575a67ebae6f35e~mv2.webp |
| `level-5-kiddie-ride` | https://static.wixstatic.com/media/78042f_8ce05720af564c74bb8233863b79f44a~mv2.webp |
| `level-5-revolving-door` | https://static.wixstatic.com/media/78042f_e38da8fcd7b84535b7fd37177e8a3ee5~mv2.webp |
| `level-5-smart-turnstile` | https://static.wixstatic.com/media/78042f_5415400a6c5a45ddadfe67d6c250b4a1~mv2.webp |
| `level-5-top-scorer` | https://static.wixstatic.com/media/78042f_63b13f422fae468194c7ecc408c74b25~mv2.webp |
| `level-5-clothes-dryer` | https://static.wixstatic.com/media/78042f_c273183a4b5a4c2d9c3dfdb4000b5eb8~mv2.webp |
| `level-5-remote-control-fan` | https://static.wixstatic.com/media/78042f_3dcb0a18b65040dfba8821c9683c8adb~mv2.webp |
| `level-5-rescue-robot` | https://static.wixstatic.com/media/78042f_9b17a2c7fd55448b8de730c56012f8d3~mv2.webp |
| `level-5-barometric-sensor` | https://static.wixstatic.com/media/78042f_545f8036d43a4c47995489c711cb3432~mv2.webp |
| `level-5-car-speed-detector` | https://static.wixstatic.com/media/78042f_030520f2f7a2422fb17c21fe153fc8f6~mv2.webp |
| `level-5-traffic-robot` | https://static.wixstatic.com/media/78042f_9b221d3b2d0e404ca5fd2a63586cc09c~mv2.webp |
| `level-5-swing-with-rhythm` | https://static.wixstatic.com/media/78042f_352fd6dcb839427d989290feb7556831~mv2.webp |
| `level-5-hexapod-robot` | https://static.wixstatic.com/media/78042f_9579c314d0f349e284058cebdadae3af~mv2.webp |
| `level-5-light-chasing-car` | https://static.wixstatic.com/media/78042f_1fef652fd1de4735aa5523124aace493~mv2.webp |
| `level-5-shopping-guide-robot` | https://static.wixstatic.com/media/78042f_904ceeff89cc4a468f91076726c3b373~mv2.webp |
| `level-5-voice-controlled-frog` | https://static.wixstatic.com/media/78042f_c713f67e0c62440ab36cea54491f33e0~mv2.webp |
| `level-5-wind-up-car` | https://static.wixstatic.com/media/78042f_e6ce32837a8143ee84eea65aab9246ec~mv2.webp |
| `level-5-remote-control-car` | https://static.wixstatic.com/media/78042f_852c62df18ec40ee83c9ccb7e25f7460~mv2.webp |
| `level-5-voice-control-snail` | https://static.wixstatic.com/media/78042f_72ced3ae25a54a45b1815b9590380b6f~mv2.webp |
| `level-5-voice-control-vehicle` | https://static.wixstatic.com/media/78042f_d36f964af5eb46b39673760192b53422~mv2.webp |

## Release decision

**Owner-authorized scanner coverage achieved: 45/45 and 225 self-assessment questions**. **Independent finished-model image verification remains 42/45 by design**; the remaining 3 intentionally use authentic full-PDF instructional fallbacks, labeled with limitations. PRs #113 and #114 remain draft/unmerged; do not confuse content availability with readiness for production while standalone TypeScript errors and mobile manual QA remain open.

