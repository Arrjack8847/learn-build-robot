# Level 5 — six finished-robot WebP recovery attempt (2026-11-23)

**Scope:** exactly the six previously blocked Level 5 variants. **No student approvals are granted in this report.**

## Verified repository context
- Worker: draft PR #113, branch `feat/final-build-level-5`.
- Integration: draft PR #114, branch `integration/final-build-levels-1-6`.
- The existing 39 approved WebPs and `src/data/finalBuild/level-5-wix-image-urls.json` were not edited.
- Steam Wix destination confirmed by connected Wix site context: `fe3fa828-9f74-45e8-97f7-8d00cbb7fba0`.

## Source metadata from the *previous* audit (NOT recomputed in this attempt)

| Variant | Previously recorded Wix PDF SHA-256 | Page count | First page to investigate | Required WebP |
|---|---|---:|---:|---|
| Remote Control Car | `2affa29cfe3d529eb02f37b61a4a0f7a5b308709736ed2d468b77f6fd1eb458b` | 20 | 20 | `level-5-remote-control-car-basic.webp` |
| Crack Shot — Optimized | `cfb54f435a8345ca010a6db10c0c1ed37a5a77f48d3086f25a5a7ae28f4f5dcf` | 4 | 4 | `level-5-crack-shot-optimized.webp` |
| Machine Gun (officially repaired PDF) | `acc9ac20908550895909ac6c73d473301732d15cbbe4f03049c1d4b84f1a60c1` | 29 | 29 | `level-5-machine-gun-basic.webp` |
| Facial Recognition Time Clock | `d864a564ec020cf36df072b980ca763a133aabbd8d4115e50f564ffb02dca872` | 7 | 7 | `level-5-facial-recognition-time-clock-basic.webp` |
| Voice Control Snail | `68cfb4cac29244e11d009267522c09cf152c92f6804606c534794c73ab749d19` | 12 | 12 | `level-5-voice-control-snail-basic.webp` |
| Voice Control Vehicle | `99735dbeeee27192956732cba7e81deea00cac2c66acdb4b025639ecb80d744e` | 10 | 10 | `level-5-voice-control-vehicle-basic.webp` |

The page numbers are investigation hints, not approved crops. Each normalized crop remains **unknown**.

## Execution performed and actual results

1. Read the two current draft PRs and the worker source manifests via the GitHub connector; confirmed the six are still blocked with zero approved questions per variant.
2. Confirmed Steam site identity through the connected Wix integration.
3. Attempted direct download of the Remote Control Car PDF from its exact official URL using the container download facility: **failed**, source bytes unavailable. Also attempted HTTPS through the local Python runtime: DNS resolution failed for both Wix PDF and raw GitHub domains.
4. Attempted opening all six exact official PDF URLs through public document retrieval: each returned `DisabledError`. A PDF-page screenshot was unavailable because the PDF response could not be opened.
5. Searched connected conversation/Library files for the six original Building manuals: no usable original PDFs were located.
6. Implemented and locally syntax-checked an isolated PyMuPDF + Pillow recovery utility (delivered separately as a sandbox artifact). Its **synthetic one-page smoke test** created and decoded a 550 px WebP, with a provenance record; **this is not a test against any official PDF or evidence that a robot image exists**.
7. Ran the utility in fail-closed mode for all six with no source files: **0/6 official source files validated, 0/6 actual WebPs extracted, 6/6 blocked**. This dry-run checks error handling, not source artwork.
8. **No Wix media upload attempted**; uploading without an authentic image would be misleading.

## Blocker
Official source PDFs were not accessible to the image-processing runtime during this attempt. Earlier audit metadata does **not** substitute for a current PDF hash check or visual inspection of all source pages. Source-image bounds, new WebP hashes, dimensions, and Wix hosted URLs cannot be truthfully supplied.

## Safe continuation
In a runtime with access to the official PDF bytes, rehash against the values above, render and inspect every page, isolate a genuinely complete exact-variant model, document normalized crop coordinates, and perform independent side-by-side validation. Only then upload each WebP to the confirmed Steam site. Record the actual Wix media ID, READY status, MIME, dimensions, public CDN URL, and source correlation in the separate candidate manifest. Do **not** amend the 39-image approved mapping and do **not** make these six student-selectable until five independently sourced questions also pass.

**No GitHub Actions, Browser Use, production deploy, merge, synthetic robot imagery, or changes to the 39 approved references.**
