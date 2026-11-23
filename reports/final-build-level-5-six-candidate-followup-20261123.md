# Level 5 Six-Variant Recovery — Verified Follow-up, 2026-11-23

**Scope:** PR #113, worker `feat/final-build-level-5`, current inspected PR head `38a178290c248b68a4030f374964e7af6b7cfbab`; integration draft PR #114 is separately owned and was not modified. No merge or production deployment.

## Verified outcome

- **39 existing Level 5 variants remain approved and Wix-mapped.** No existing WebP or mapping was altered.
- **6 blocked variants remain excluded.** No new WebP image, source crop, Wix upload, Wix READY media ID, or five-question checklist was created in this pass.
- Registered official PDF URLs and previously recorded SHA-256 values were read from current GitHub audit JSON. **These recorded hashes were not recomputed in this pass.**
- The PDF downloading environment returned DNS failures for Wix and GitHub; all six public PDF document retrieval attempts were inaccessible. Full-page official artwork could not be freshly inspected.
- Exact Steam Wix Media Manager inventory scan completed with an authenticated read-only paginated search: **335/335 image records across four pages**, containing **39 existing Level 5 WebPs** and **zero exact-filename matches** for the six unresolved assets. An earlier targeted query returned full first pages and was insufficient; the exhaustive inventory is the authoritative check.
- The worker branch gained: `src/data/finalBuild/level-5-wix-candidates.json`, `scripts/level5_recover_official_webps.py`, and `tests/final-build-level-5-wix-candidates.test.mjs`.
- The new utility requires official PDF bytes, checks SHA-256 and page count, renders **every** page to inspection PNG/contact sheets, and only exports a WebP when an explicit verified source page and normalized crop are provided. It never modifies approved mappings or authorizes selection.
- The new Node test asserts the six blocked records remain unmapped/unapproved and 39 approvals remain unchanged. **Not executed against a full local repository checkout** because the source repository is inaccessible to this runtime; do not count it as a passed regression.
- No GitHub Actions, Browser Use, artificial robot image generation, production deploy, PR merge, or new Wix media import.

## Per-variant evidence and blockers

The PDF SHA-256 column is **a prior-audit value**, not a fresh download hash. A candidate page number is a review starting point only, not an approved finished-model page or crop.

| Variant | Required WebP | PDF pages | Review page hint | Prior PDF SHA-256 | WebP dims/hash | Wix URL / READY | Artwork / questions | Remaining blocker |
|---|---|---:|---:|---|---|---|---|---|
| Remote Control Car | `level-5-remote-control-car-basic.webp` | 20 | 20 | `2affa29cfe3d529eb02f37b61a4a0f7a5b308709736ed2d468b77f6fd1eb458b` | Not created / unknown | None / NOT_UPLOADED | Blocked / 0 approved questions | Official PDF bytes and unambiguous completed-model evidence unavailable |
| Crack Shot (optimized) | `level-5-crack-shot-optimized.webp` | 4 | 4 | `cfb54f435a8345ca010a6db10c0c1ed37a5a77f48d3086f25a5a7ae28f4f5dcf` | Not created / unknown | None / NOT_UPLOADED | Blocked / 0 approved questions | Official PDF bytes and unambiguous completed-model evidence unavailable |
| Machine Gun | `level-5-machine-gun-basic.webp` | 29 | 29 | `acc9ac20908550895909ac6c73d473301732d15cbbe4f03049c1d4b84f1a60c1` | Not created / unknown | None / NOT_UPLOADED | Blocked / 0 approved questions | Official PDF bytes and unambiguous completed-model evidence unavailable |
| Facial Recognition Time Clock | `level-5-facial-recognition-time-clock-basic.webp` | 7 | 7 | `d864a564ec020cf36df072b980ca763a133aabbd8d4115e50f564ffb02dca872` | Not created / unknown | None / NOT_UPLOADED | Blocked / 0 approved questions | Official PDF bytes and unambiguous completed-model evidence unavailable |
| Voice control snail | `level-5-voice-control-snail-basic.webp` | 12 | 12 | `68cfb4cac29244e11d009267522c09cf152c92f6804606c534794c73ab749d19` | Not created / unknown | None / NOT_UPLOADED | Blocked / 0 approved questions | Official PDF bytes and unambiguous completed-model evidence unavailable |
| Voice Control Vehicle | `level-5-voice-control-vehicle-basic.webp` | 10 | 10 | `99735dbeeee27192956732cba7e81deea00cac2c66acdb4b025639ecb80d744e` | Not created / unknown | None / NOT_UPLOADED | Blocked / 0 approved questions | Official PDF bytes and unambiguous completed-model evidence unavailable |

## Source-locked recovery procedure

1. Obtain each authentic PDF byte-for-byte, ideally from the registered Wix URL, and verify its SHA-256 against the prior audit. Stop on mismatch.
2. Name each file by sanitized exact variant ID (e.g. `level-5-crack-shot-optimized.pdf`) in a local source folder and run:
   `python scripts/level5_recover_official_webps.py --pdf-dir /absolute/path/to/official-pdfs --out /absolute/path/to/candidates`
3. Examine the generated **full resolution page PNGs for all pages** (not just the candidate page). Compare assembly stages and identify complete exact-variant views without cropping components; Crack Shot Optimized must not inherit the basic model.
4. Supply a separate vetted crop-map JSON keyed by exact variant ID with `page`, `normalizedCrop: [x,y,w,h]`, and `sourcePdfSha256`; rerun with `--crops reviewed-crops.json`. Extracted WebPs remain **unapproved candidates**.
5. Require a separate independent visual assessor, crop fidelity check and five questions with independently checked official PDF page evidence for each variant.
6. Only then upload authentic candidate WebPs via the dedicated Wix media upload connector, verify READY and metadata, record actual ID and URL in `level-5-wix-candidates.json`. Do not re-upload the 39 originals.
7. Only after both independent gates pass, coordinate approved entry changes into PR #114; run Node, scanner/timer regression and mobile checks. Never enable a variant with incomplete evidence.

## Release accounting

Previously approved: **39/45**. New recovered: **0/6**. Independently approved additional questions: **0/30**. Uploaded new Wix WebPs: **0/6**. PR #113 remains draft, PR #114 remains draft, and production remains untouched.


## Additional isolated component smoke check

A standalone local **synthetic one-page PDF** (simple geometric shapes and explicit NON-ROBOT text) was rendered with PyMuPDF, cropped, encoded as a 550 × 654 WebP with Pillow and reopened/decoded successfully (3,352 WebP bytes). This verifies only the installed PDF raster/WebP encoder component path. **It does not prove the committed extraction script has passed end-to-end tests, does not involve any official robot manual, and does not approve an asset.**

A direct connector-side comparison of all six new registry rows against the GitHub audit, references and checklist manifests found **0 metadata/approval-gate inconsistencies**. No complete repository checkout was available for running the new Node suite or mobile scanner tests.

Current PR #114 integration head may advance independently; the integration branch itself was not modified in this work.
