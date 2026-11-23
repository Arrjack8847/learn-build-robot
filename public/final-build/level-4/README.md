# Level 4 Final Build artwork — candidate set

**Audit date:** 2026-11-23  
**Source:** 50 actual, downloaded Wix-hosted official Level 4 Building PDFs, **not** Learning fallback slides.  
**Files:** 50 individually optimized `.webp` files, including two Basic/Optimized variant pairs. Eight reference images were recropped to the original PDF's completed-model image blocks, excluding neighboring intermediate construction figures.

All images are **faithful source-derived raster crops**; no artificial illustration, stage compositing or reconstructed robot parts were used. Every file passed an independent Pillow decode, WebP SHA-256 check, and a pixel-fidelity comparison to its exact verified PDF source page.

**Student approval status: 0/50.** These are **candidates, not released references**. All source URL, source PDF SHA-256, source PDF page, crop coordinates, rendered width and height, WebP SHA-256 and review status are traceable in:

- `src/data/finalBuild/level-4-references.json`
- `src/data/finalBuild/level-4-checklists.json`
- `src/data/finalBuild/level-4-audit.json`
- `reports/final-build-level-4-independent-verification-20261123.json`

There are exactly 250 draft questions (five per variant), and one (A Timid Mouse) has passed an assistant-led full-PDF visual/manual review; the other 49 remain blocked. A file's presence or hash verification must **never** implicitly change its status to `approved`.

Do not use unapproved candidates in the student random-discovery pool. Any shared scanner/UI integration change belongs to PR #108's integration owner; no shared files were modified in this Level 4 worker.

## Supplemental source-based repairs, 2026-11-23

Five candidate WebPs were re-extracted from the verified PDF originals: Architectural Design, Drop-proof Robot, Nocturnal Beetle, Telegraph, and Remote Control Car. All five were decoded, hashed and compared with their source renders. They remain candidate-only: student approval and Wix upload both blocked. Horizontal Bar has a source-level bottom cut-off. Details in reports/final-build-level-4-semantic-triage-20261123.json.

## First verified Level 4 upload — 2026-11-23

A Timid Mouse is the sole Level 4 variant with approved static assembly artwork and five independently source-reviewed questions (official PDF pages 6, 13–19; all 19 manual pages visually opened). Its existing WebP is 490×468, SHA-256 97dc96cbffc9c275b94daec097041cc6d39644b11381dbc6d221c12b5d992609, and was uploaded to Steam Wix at https://static.wixstatic.com/media/78042f_6fd316e164634e8aabdf5797118e32dd~mv2.webp. Wix returned READY; a public HTTP 200 fetch returned identical 14,072 image bytes and image/webp. This is an AI-assisted page-by-page source check, not an external human/physical operating test. The other 49 variants remain blocked, including all five newly repaired candidates. Shared scanner integration remains with PR #114.
