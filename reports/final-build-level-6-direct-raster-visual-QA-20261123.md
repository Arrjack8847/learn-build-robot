# Level 6 blocked references — direct original-raster visual QA
**Date:** 2026-11-23 (Malaysia time)  
**Worker branch:** `feat/final-build-level-6`  
**Origin:** Authenticated Steam Wix Media Manager, exact official Building PDFs, extracted JPEG streams

## Method actually performed

Retrieved the full original PDF bytes using Wix's official temporary file-download URL. Located and length-checked PDF `/Subtype /Image` / `/DCTDecode` streams using the actual document byte offsets; independently transferred the original stream in bounded HTTP 206 ranges; verified total JPEG length and SOI bytes; reassembled and visually inspected the JPEG without using generated artwork, fabricated robot features, a PDF screenshot substitute, or another publication.

- Optimized Super Scorpion source: `16. Super Scorpion - Optimized Building Manual.pdf`, 3 page-filling JPEGs, 6736×4768px.
- Rock-paper-scissors Robot source: `BE STEM READY Level 6 - Rock-paper-scissors Robot Building Manual - English.pdf`, 14 page-filling JPEGs, 6736×4768px.
- Independently compared the 14 original historical and English Rock manual embedded JPEG streams: **14/14 are byte-identical**.

## Super Scorpion — Optimized: **blocked confirmed**

**Original page 1:** Shows a full-looking scorpion base assembly with the extended tail, claws, legs and central controller but *without* the final front black square sensor/camera module.

**Original page 3:** Visually verified the black square front sensor module is fitted to the front of the robot via additional connection points. The upper tail/body is **cropped by the official step-3 illustration**. This means the available earlier full-looking page-1 view is **not** the completed optimized configuration, and the final step-3 view is not a complete model reference.

Existing `level-6-super-scorpion-optimized.webp` depicts the earlier non-final front module state. Do **not** promote this WebP. It would teach an incorrect final optimized assembly.

Possible legitimate remedy: an independent full final-model rendering from the original author/project CAD at completion of page 3, an official Building-manual revision that actually shows the whole final assembly, or an accurately registered composite of the *unchanged* authentic Building images with independently verified post-modification geometry. Until independently validated, compositing is at most an **unapproved candidate**, not finished-model approval.

## Rock-paper-scissors Robot: **blocked confirmed**

**Original page 12:** Shows an individual, not-yet-assembled upright mechanical unit with a small parts key. It is not a finished-model reference.

**Original page 14:** The directly extracted underlying original 6736×4768 JPEG is itself a **partial/magnified model view** featuring the controller, camera/sensor, uprights and lever mechanism, with critical robot portions extending beyond its framing. This is not simply a PDF rendering/cropping artifact; the missing overall silhouette is *not contained in the underlying JPEG*. The numeral `14` and mechanical drawing are raster content. Some red leaders/callouts seen in the existing candidate appear in PDF annotation layers and are absent from the raw JPEG; however the authentic JPEG remains **incomplete**.

Therefore simply extracting the raw page-14 JPEG, removing overlay text or widening the existing WebP crop **cannot yield a full genuine robot**. The original and English manuals share the exact same 14 JPEGs; the English alternative has no novel finished-model image.

Legitimate remedy: a separate official complete finished-model source image from its author, or a revised official Building PDF with a full final assembly view. Until then, do not approve the cropped `level-6-rock-paper-scissors-robot.webp`.

## Release gates and verified unaffected work

- Verified approved Level 6 variants: **39/41**.
- Independently source-verified questions: **195**, exactly 5 per approved variant.
- Remaining candidate questions: **10/10 unapproved**.
- Steam Wix publicly hosted WebPs: **39/39** verified READY, expected name, size, source, dimensions.
- Additionally executed full raw-media SHA-256 original-byte verification: **39/39 exact source match**, see `final-build-level-6-wix-byte-integrity-20261123.json`.
- Additionally executed public `static.wixstatic.com` GET/200 and full response SHA-256 source check: **39/39 exact source match**, see `final-build-level-6-wix-cdn-byte-integrity-20261123.json`.
- Two unapproved WebP candidates are listed **only** in `src/data/finalBuild/level-6-wix-candidates.json` and **not** in the student map; selection remains fail-closed.
- No synthetic models, no WebP promotion, no GitHub Actions, no Browser Use, no merge or production deployment.

**Approval conclusion:** Source limitations are now confirmed from direct original-image visual evidence, not merely inferred from a cropped candidate. The fully verified 39-variant subset can proceed to separate UI/browser QA and release assessment without mislabelling either absent final model.

## Additional official Rock manual source-page checks (same-day follow-up)

Independently recovered and visually inspected the entire underlying **original page-1 JPEG** (1,126,285 bytes) and **original page-13 JPEG** (1,586,424 bytes), using authenticated PDF byte-range GET and exact original JPEG stream reassembly (not generated imagery).

- **Page 1:** Shows an exploded/simple early-stage gray motor-and-linkage module with instruction parts key and two-unit diagram. Not a complete robot.
- **Page 13:** Shows an incomplete left-side assembly with black camera/sensor housing, upright finger levers and a separate right-hand arm with insertion arrows. The robot body is visibly cut at left and bottom. The right-hand arm is not yet joined in the illustration. Not a complete robot.
- **Page 14:** Previously inspected original JPEG shows the next assembly detail at larger scale; outer extents and full finger assemblies are still missing, so it also is not an independently usable finished-model silhouette.

The manual's first and penultimate assembly illustrations therefore provide no alternative complete final-model WebP. This supports keeping the Rock variant blocked under the existing authentic **Building-PDF-only** evidence rule. This does not claim a frame-by-frame visual certification of all 14 pages; the source JPEG count/hash parity is 14/14 and direct full-resolution visual checks were made on pages **1, 12, 13 and 14**.
