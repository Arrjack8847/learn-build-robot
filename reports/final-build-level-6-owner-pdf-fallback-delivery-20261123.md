# Level 6 — owner-authorized PDF fallback delivery (DRAFT, no production release)
**Date:** 2026-11-23 (MYT) · **Worker:** PR #112 · **Shared integration:** PR #114
**Site:** Steam `fe3fa828-9f74-45e8-97f7-8d00cbb7fba0`

## Factual outcome
- **41 registered Building variants represented in the integration adapter:** 39 independently approved, Steam Wix-hosted completed-model WebPs **plus two owner-authorized authentic official Building-PDF construction-page fallbacks**.
- **41 × 5 = 205 student assessment prompts configured:** the original **195 independently verified source-evidenced questions remain unchanged**; the final 10 are explicitly classified as direct official-page observations or **general construction self-assessment**, not falsely certified as independently source-verified.
- **No new finished-model WebP approved** for the two source-limited variants. Their candidate WebPs remain separate from the 39 approved Wix URL mapping.
- No source PDF edited, no original 39 image mapping changed, no merge into main, no production deploy or GitHub Actions.

## Exact source-limited fallbacks
| Variant | Official PDF SHA-256 | Original page | Accurate on-screen disclosure |
|---|---|---|---|
| Super Scorpion — Optimized | `e0c7b137eb0ce340cb334a7a36e4ea90172ae65337d8ffba8937b2839d368600` | **3 of 3**, full page | The final assembly step is a close-up; page 1 predates the front square sensor module. Neither page is falsely presented as a finished-model view. |
| Rock Paper Scissors Robot | `1009562c300be9ec9bb86ea5c9420d8117d4399e848dbb1d1705f2b02db107fd` | **14 of 14**, full page | The final step shows only a partial magnified assembly, with the model extending outside its original illustration. |

Student UI includes a full-page original construction-page preview, source limitations, a link to the **complete official Building PDF** and five appropriate checklist prompts. The link remains accessible even when the PDF preview cannot render. The shared Level 1-style scanner is reused; the timer, 4.2-second scan duration, 15-minute limit, five questions, 4/5 pass threshold, overtime and retry behavior were not intentionally changed.

## Evidence and safeguard policy
`src/data/finalBuild/level-6-owner-authorized-pdf-fallbacks.json` records only the two exact project/variant IDs, canonical Wix PDF URLs, original source hashes, bounded source pages, full-canvas crop, clear partial-image notices, approval basis and question classifications. `getLevelSixEvidence` rejects fallback if the reference/variant/source identity differs, the original blocked standalone WebP is mapped, the exact source SHA differs, or assessment metadata is invalid. Source-limited exceptions must **not** be relabelled as completed images.

Previous independent Wix evidence from the branch remains: **39/39 READY and public, 312/312 metadata checks**, plus **39/39 original Wix stored-file SHA-256 matches** and **39/39 public CDN response SHA-256 matches**. No new media upload was necessary because the two source-limited variants use already-existing official Wix PDF URLs.

## Testing actually performed for this delivery
- **15/15 in-memory source-contract assertions passed**, fetching the live GitHub integration branch and checking full 41-ID coverage, classification, PDF identity, image-map exclusion, previously recorded Wix hashes, core scanner invariants and registered new test suites.
- New `tests/final-build-level-6-owner-fallbacks.test.mjs` committed on both worker and integration branches.
- Existing `tests/final-build-level-6-integration.test.mjs` plus the new owner-fallback suite added to the integration `npm run test:final-build` command.
- **NOT EXECUTED:** current-head Node runner, TypeScript compiler, Vite build, Chromium mobile QA at 320/375/390/430 px, real Safari, PDF page loading in students' browsers, timer reload/expiry behavior in a real browser. Past passing worker tests are not claimed as evidence for the latest integration changes.

## Next release gate
Keep both PRs **DRAFT** and production unchanged. Run the newly wired integration tests/build and actual device/browser checks before any production release. **41/41 is configured at source level, not independently end-to-end certified.**
