# Level 2 Building — English cover restoration

## Status: generator ready, binary PDF commit pending

This branch adds the audited, locally tested generator and original-file manifest for the 20 approved Level 2 Building covers. It does **not yet replace** the binary PDFs in `public/`. Their reviewed copies are in an isolated Vercel workspace; the currently connected GitHub file interface cannot upload those binary bytes. Do not merge this as completed PDF delivery.

### Scope

- Twenty Level 2 **Building** PDFs only. No changes to Learning PDFs, Level 1, routing, production or GitHub Actions.
- Replace Chinese cover titles and the Chinese Building Manual label in the approved layout; keep original English headings and robot artwork.
- All remaining assembly pages must stay pixel-identical. Interior Chinese text is outside this cover-only batch.
- `Scaling ladder.pdf` is titled Lift Car internally; do not rename its project identity.
- `Balance_v2.pdf` is duplicate-content with `Teeterboard.pdf` but is independently registered.

### Reproduce and validate (local, no Actions)

Install Python dependencies: `python -m pip install pymupdf pillow numpy opencv-python-headless`.

From the repository root run: `python scripts/pdf/generate_level2_building_english_covers.py --source-dir public --output-dir build/level2-building-english`.

The script generates 20 individual PDFs and a validation.json file. Each PDF's page count, all page sizes, and all non-cover pages are checked against its original. Use `--only "Scaling ladder.pdf"` to run one manual. The script's `--write-public` option is intentionally opt-in; it should only be used by someone with an authenticated Git checkout, after confirming the originals match the manifest.

### Evidence

See `reports/level2-building-cover-sources-20261118.json` for all 20 source Git blob SHAs, PDF sizes, and page counts at main commit `521fe7e1fe9829eb811356982a09bb3c4c6cce6a`.

Independent local QA on the approved reviewed copies covered **346 total pages**, including **326 non-cover pages pixel-identical**. The generator's own 20 rendered covers were compared with the approved review copies and matched pixel-for-pixel at the tested resolution.

### Completion gate

1. Upload all 20 edited PDF binary files to `public/` at their original paths using an authenticated Git session. Do not replace them with URL pointers.
2. Verify committed PDFs' hashes, page counts, and non-cover renders against the manifest and originals.
3. Review the cover images and only then request merge.

This draft is incomplete until that binary upload is done.
