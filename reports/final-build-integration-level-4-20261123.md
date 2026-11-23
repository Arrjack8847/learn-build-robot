# Level 4 Final Build — shared PR #114 integration (2026-11-23)

## Source and content

- Imported the exact Level 4 worker's official PDF registry and 48 approved, already READY Steam Wix WebP records. None of the previously approved 48 image mappings have been rewritten or re-uploaded.
- 50 registered Level 4 variants are assigned five practical self-assessment checks each (250 total). Exactly 240 questions retain the original independently reviewed source-visible static geometry approval status.
- The remaining two variants have five **owner-authorized but not independently completed-model-verified** checks each, held apart in `level-4-source-limited-fallbacks.json`.
- **Dangerous Assassin — Basic** uses the real original PDF page 25 showing a detached side assembly. **Horizontal Bar** uses real original PDF page 13 with the lower support feet cropped. Neither limitation has been synthetically repaired. Students see a conspicuous source-limitation note and can open the full original Building PDF.
- Existing 48 WebPs use unchanged URLs under `static.wixstatic.com`; the two exceptions use the original Wix-hosted PDFs without inventing a WebP or uploading duplicate files.

## Shared integration

- `src/data/finalBuildLevel4Verified.ts` validates exact official PDF hashes and IDs and reuses the approved content adapter for the original 48.
- `src/data/finalBuildVerified.ts` dispatches Level 4 alongside existing Level 2/5/6 integrations.
- `FinalBuildExam.tsx` supports the same explicit original PDF construction-stage renderer used in Level 6, and marks the PDF-only reference as incomplete. The original scanner design, countdown, 4.2-second scan, 4-of-5 self-assessment threshold, retry, and Level 1 artwork are unchanged.
- Added `tests/final-build-level-4-integration.test.mjs` and `tests/final-build-level-4-source-fallbacks.test.mjs` to the package's final-build regression runner.

## QA limits

The new test sources have been committed. A full isolated Node test invocation, TypeScript/Vite production compile, actual Wix PDF browser loading, and 320/375/390/430 CSS-pixel functional device tests were **not executed in this connector-only run**. Do not claim that they passed. Prior worker source audits recorded 50/50 official PDF identities, 48/48 independently checked Wix WebPs, and 11 existing shared TypeScript errors in an older snapshot; latest current-branch typecheck is still needed.

No merge, no production deployment, no GitHub Actions, and no Vercel.
