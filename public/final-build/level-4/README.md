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

There are exactly 250 draft questions (five per variant), but none has passed independent manual-by-manual mechanism sign-off. A file's presence or hash verification must **never** implicitly change its status to `approved`.

Do not use unapproved candidates in the student random-discovery pool. Any shared scanner/UI integration change belongs to PR #108's integration owner; no shared files were modified in this Level 4 worker.

## Supplemental source-based repairs, 2026-11-23

Five candidate WebPs were re-extracted from the verified PDF originals: Architectural Design, Drop-proof Robot, Nocturnal Beetle, Telegraph, and Remote Control Car. All five were decoded, hashed and compared with their source renders. They remain candidate-only: student approval and Wix upload both blocked. Horizontal Bar has a source-level bottom cut-off. Details in reports/final-build-level-4-semantic-triage-20261123.json.
