# Level 6 Final Build — verified source-delivery signoff and outstanding release gates
**Date:** 2026-11-23, Asia/Kuala_Lumpur  
**Shared integration branch:** `integration/final-build-levels-1-6`  
**Worker PR:** #112 | **Shared PR:** #114  
**Status:** Source/media integration complete for **39 approved variants**. Full 41/41 content **not** complete. Production readiness remains gated by unrun build/browser QA.

## Independently executed checks

| Verification | Actual execution | Outcome |
|---|---|---|
| Official Building PDF provenance, supplied WebP content and per-reference evidence | Prior Level 6 worker verification preserved | 39 approved / 2 blocked |
| Steam Wix Media Manager file metadata | Queried full 39-file descriptors | 39 READY and public, 312/312 metadata checks |
| Original stored Wix media bytes | Generated signed original-file download URLs, downloaded all 39 original WebPs, SHA-256-digested each file in connected Wix runtime | **39/39 exact SHA-256 + byte-size matches** |
| Public `https://static.wixstatic.com/media/...` bytes | Independently downloaded each public CDN URL and SHA-256-digested HTTP 200 response | **39/39 exact SHA-256 + byte-size matches**, same as GitHub source |
| 5-question source-evidenced checklists | Checked source-aligned manifest, approval, five verified questions per reference | **195 verified / 10 blocked** |
| Existing Level 1-style scanner/timer/assessment invariants | Audited current integration code; 15-minute limit, 4/5 pass, fail-closed Level 6 source/media mapping | No changed scanner timing/scoring semantics |
| Current GitHub data/source contract | Executed 731 independent in-memory JS assertions against **current** integration branch files | **731/731 passed, zero errors** |
| Actual Node integration suite/TypeScript build | New Node test source committed with 5 tests, but no runnable connected local checkout available for new suite | **NOT RUN** |
| Actual narrow viewport, touch and mobile Safari tests | Prior Chromium discovery clipping reported; root scroll CSS changed. Not rerun on browser | **NOT VERIFIED** |

Evidence source files:
- `reports/final-build-level-6-wix-upload-20261123.json` — metadata and immutable GitHub commit
- `reports/final-build-level-6-wix-byte-integrity-20261123.json` — actual original stored bytes
- `reports/final-build-level-6-wix-cdn-byte-integrity-20261123.json` — actual independently downloaded CDN bytes
- `reports/final-build-level-6-direct-raster-visual-QA-20261123.md` — directly inspected original JPEG images underlying two blocked Building PDF variants
- `tests/final-build-level-6-integration.test.mjs` — regression suite requiring SHA evidence
- `src/data/finalBuildLevel6Verified.ts` — approved-only gating

## Two blocked variants — now root-caused

1. **Super Scorpion Optimized**: Official Building PDF page 1 looks like a complete scorpion but omits a front square sensor module. Authentic original page 3 *adds the module* to a now-partially cropped overall illustration. Previously cropped WebP therefore depicts a genuinely earlier assembly, not the final optimized robot.
2. **Rock Paper Scissors Robot**: Official page-14 original embedded JPEG is already a magnified, incomplete model view with parts outside the drawing. Extracting JPEG without optional PDF callout overlays cannot reveal missing robot pieces. Historical original and cleaned English Building PDFs have **byte-identical underlying JPEG streams on all 14 pages**. Earlier page 12 depicts a separate mechanism subassembly, not a complete finished robot.

**No authentic unannotated, uncropped complete finished-model illustration for either blocked robot has been independently established.** Both blocked WebPs and 10 questions remain excluded from the student randomized challenge. This is a genuine official-source evidence gap, not a WebP hosting issue; do not relabel prior-stage or partial images as approved.

## Available safe Level 6 content
- **39/41** authentic finished-model WebPs with exact SHA-256 verified original/media/CDN identity.
- **195** independently verified five-question checks.
- The same shared Level 1-inspired scanner, random selection, 15-minute timer, 4/5 passing criterion.
- No GitHub Actions, Browser Use, production merge, production deploy or source alteration.

## Remaining gates before marking release-ready

1. Execute the existing Node integration suite plus `npm run build` in an actual repo checkout, and record their exact outputs/commit SHA.
2. Render and interact with the scanner at 320, 375, 390 and 430px and a mobile Safari device/simulator. Confirm Discover CTA visible/reachable and scroll works on every stage, including result, after scrolling and refreshing.
3. Check timer continuing through reload and expiry, 4/5 pass, under-4/5 fail, and blocked variants never entering draw.
4. Obtain a new official complete finished-model view for the two blocked robots and independently verify all ten questions **only if** 41/41 coverage remains a hard requirement. Otherwise treat 39/41 as the verified safe student pool.

**Do not merge or deploy based on source checks alone.** The current draft may be reviewed for the 39-variant source data integration, but the new unexecuted build/browser checks must not be reported as passed.
