# Level 6 — two-robot source recovery and safe unblock assessment
Date: 2026-11-23 (Asia/Kuala_Lumpur)  
Scope: ONLY the two blocked Level 6 reference variants. No student release changes.

## Outcome
**Both variants remain blocked.** The source PDFs are accessible from the connected Steam Wix Media Manager, but there is not yet an independently verified clean completed-model illustration for either one.

### New source access and forensic evidence
Used the official Wix Media Manager's Generate File Download URL API to retrieve the actual official Building PDF **bytes** within the authenticated Wix service. No Browser Use, GitHub Actions, production deploy or merge.

| Source | Wix media ID | Observed PDF bytes | Page-filling JPEG streams |
|---|---|---:|---:|
| Super Scorpion — Optimized | `7fc4ca_2f7bfe9ee7224047b06209ce59a55165.pdf` | 4,871,492 | 3/3 pages |
| Rock-paper-scissors — English Building | `78042f_ee943e948c6f4141b53d9d3e90481801.pdf` | 16,305,651 | 14/14 pages |
| Rock-paper-scissors — Historical original Building | `7fc4ca_44cb70234f1c45f4aac978b3560314d3.pdf` | 16,315,903 | 14/14 pages |

All 17 current PDF page images are high-resolution **6736 × 4768** `/DCTDecode` page-filling JPEGs. The optimized PDF contains exactly 3 image streams, and the English Rock PDF contains 14. These are **complete slide rasters**, not isolated mechanical robot images. Simply extracting the stream yields a page-sized image and must not automatically receive finished-model approval.

#### Independent original-vs-English Rock PDF check
Retrieved both original and English Building PDFs in one read-only comparison and compared the 14 embedded DCT JPEG byte streams, page for page. Result: **14/14 JPEG page streams are byte-identical**, including the final assembly image on page 14.

The differences introduced by the English restoration therefore do not provide a new, distinct underlying robot raster. However, replacing vector/text overlays may leave an annotation-free base JPEG underneath; **its suitability as a full finished-model reference remains visually unverified**. It should be examined before any crop, and no artwork content may be invented.

## Visually inspected existing WebP candidates
Two unapproved existing source-extracted candidates were transferred to Steam Wix *separately* for image-level forensic review. These are **NOT** in the approved URL map, and are **NOT** student selectable. Re-queried their official Wix file descriptors and verified exact filenames, GitHub source URLs, expected dimensions, READY/public status, and dedicated media IDs.

1. **Super Scorpion — Optimized**: `level-6-super-scorpion-optimized.webp`, **530 × 414**, source `7b9327616f92c5654540e294cf1366af4ebb1510c78887765677751ee4dec8ce`. The candidate shows a complete scorpion shape different from the approved Basic screenshot, notably lacking the Basic forward twin circular sensor housings. **These visible differences do not prove that every post-optimization construction step is present**. The three-page manual's later detail changes remain to be correlated to the final completed configuration.
2. **Rock-paper-scissors Robot**: `level-6-rock-paper-scissors-robot.webp`, **500 × 349**, source `580dad96839b36de5369a2005c596b5b26986472528247284a78bdadb739be3e`. The candidate visibly clips mechanical pieces along the **top and left** boundaries, and red leader lines plus explanatory labels appear inside the image. It is not a suitable complete-model reference.

Unapproved Wix candidate URLs and mechanical provenance are recorded in `src/data/finalBuild/level-6-wix-candidates.json`. These URL records must NEVER be imported into `level-6-wix-image-urls.json` until the standard evidence and question gates pass.

### The new recovery tool
`scripts/final-build/recover-level-6-embedded-images.py`

- Requires both exact current Building PDFs and cryptographically verifies their registered SHA-256, or accepts the historical original Rock Building PDF with its exact recorded full Git blob SHA-1 using `--rock-original`.
- Renders all source pages into a separate QA directory.
- Extracts authentic JPEG/image streams and records PDF page number, image object xref, normalized placement, raw image SHA-256 and source-document hash.
- Treats full-page raster streams as **unapproved source material**, does **not** convert them into fake "finished robot" WebPs.
- Creates a lossless WebP candidate only when the PDF contains an actually isolated smaller embedded image, and still leaves it unapproved until mechanical identity is reviewed.
- Does not alter source PDFs, shared scanner, existing 39 approved images, timer, Level 5 or production.
- The extraction method passed a local synthetic PDF test that overlaid separate text on an underlying image; raw embedded-image extraction excluded the text while preserving original pixel values and dimensions. Wrong source SHA-256 was correctly rejected. **The two real source PDFs were not run through the committed Python script in a local filesystem due to lack of a transferable PDF binary in this runtime; actual source JPEG counts and byte equivalence above were verified within the connected Wix service instead.**

## Exact route to remove each block

**Optimized Scorpion:** Compare all three official page images at full resolution. Identify every changed/added/removed linkage, controller/sensor attachment and leg/claw position after the optimized steps. A reference is valid only if the complete final assembly corresponding to those steps exists *in an authentic Building PDF illustration*. Never substitute or relabel the Basic reference. If the final complete view does not exist, keep blocked.

**Rock Paper Scissors:** Extract page 14's **underlying raster JPEG** before PDF vector/text overlays. Visually verify whether explanatory arrows/labels occur only in PDF overlays or are baked into the JPEG. If the original JPEG is clean and a crop can contain all upper/left mechanical parts without instruction text, crop and preserve unchanged robot geometry, verify 500px+ resolution and source-page identity, then review five questions. If annotations intersect the only intact model pixels, keep blocked.

**Question approval:** Both variants have five existing authored checklist questions, but all ten remain unverified until an image is authenticated and each question independently cross-checked to official construction pages.

## Safe release interpretation
The other **39/41** Level 6 variants already have approved, hosted, validated Wix WebP URLs and 195 approved checklist questions. Integration PR #114 uses fail-closed verified-only filtering and therefore neither of the two blocked candidates enters the student draw. Once the separately outstanding *integrated* Node/TypeScript/build, timer/reload, mobile Chromium/Safari at 320/375/390/430px, and CDN delivery checks are completed successfully, the 39-variant subset can be assessed for release **without promoting unreliable images**.

No merges or production deployments performed.
