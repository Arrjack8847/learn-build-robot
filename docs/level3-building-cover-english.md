# Level 3 Building PDF English cover replacement

## Investigation (2026-11-19)
- Reference: PR #81, Level 2 Scaling Ladder workflow. Coordinates were re-measured.
- Repository source commit: 521fe7e1fe9829eb811356982a09bb3c4c6cce6a.
- Level 3 Building registry: **42 registrations, 40 unique PDFs, 691 pages**.
- All 40 Wix-hosted PDFs matched their corresponding main Git blob SHA.
- All 40 first pages were rendered, not judged solely by text extraction.
- **One affected cover:** public/Gyro transmitter_Building.pdf.
- The printed Chinese reads 陀螺发射器 and 搭建手册; the cover already prints Gyro transmitter / BUILDING MANUAL in English. English was retained, not duplicated.
- **39 other PDFs unchanged.** Their first pages show no visible Chinese cover titles; many begin with assembly step 1.
- Out of scope: public/Electronic scale.pdf has 40 extractable Chinese characters on non-cover pages. Leave for instructional-page cleanup.

## Local binary QA (completed)
- Original Gyro Transmitter Git blob SHA: 82871820203830b6932c5b314ab7afa70183f215.
- Downloaded the real original and regenerated a **17-page cleaned PDF** in an isolated Python workspace.
- Reconstructed the original striped background over the Chinese artwork at Level 3-specific coordinates.
- The already-English title and diagrams remain visibly intact.
- All **16 non-cover pages render pixel-identically** at 1.4x resolution.
- Original page count and all page dimensions unchanged.
- The generator committed in this PR was separately executed against the SHA-verified source and passed validation.

## Repository binary status: NOT COMMITTED
The GitHub file connector cannot transfer binary PDFs and the isolated workspace has no authenticated Git push credential. This draft intentionally commits only the generator, inventory, helper and report. The cleaned binary PDF is **not** in GitHub's changed-file list yet. **Do not merge or deploy as a completed PDF change.**

## Reproduce and deliver with authenticated local Git (no Actions)
1. Checkout fix/level3-building-english-covers-20261119; ensure public/Gyro transmitter_Building.pdf still matches original SHA.
2. Generate a review copy: python scripts/pdf/generate_level3_building_english_cover.py --source-dir public --output-dir build/level3-building-english
3. Check the review PDF and validation.json.
4. On Windows: powershell -ExecutionPolicy Bypass -File scripts/pdf/commit_level3_building_cover.ps1
5. Verify that public/Gyro transmitter_Building.pdf appears in PR Files Changed as a modified binary and that the committed SHA matches validation.json.

No Learning files, other levels, application logic, GitHub Actions, merge or production deployment were modified or invoked.
