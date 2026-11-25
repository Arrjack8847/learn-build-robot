# J5 course-access readiness audit — 25 November 2026

This is a source inventory and acceptance plan, not a replacement for Shimi's reviewed 24 November lock design. No existing routes have been restricted or passes issued.

## Findings

Repository tree at becabe663798079cb736c11b4063209925804a64 was enumerated without truncation. See j5-course-surface-inventory.json: 18 candidate course route files, 13 other route files requiring review, 590 tracked PDFs under public/ and 8 under curriculum-source/.

- src/data/requireWixPdfUrl.ts validates direct Steam Wix usrfiles PDF URLs. staticPdfUrl.ts and the per-level registries return these URLs. PdfActivityViewer.tsx passes manual.url into PDF.js getDocument. Server-side access control on the application cannot by itself protect a separate public file origin.
- scripts/pdf/remove-all-output-pdfs.mjs is designed to remove generated public PDF copies. This audit confirms source code only, not current deployment output or remote PDF permissions.
- PdfManualPage.tsx retains a bounded cache of rasterized pages for an open document. After revocation/expiry, the reviewed design must account for cached content, outstanding requests and loaded PDF documents as well as navigation.
- Existing practical, project and quiz routes and all relevant JSON/JS data delivery must be covered. The inventory is a starting point; server functions, client bundles, static media and historical deployment access need review. No current course-lock guarantee.

## Acceptance record — all pending

| Rule | Required live acceptance |
|---|---|
| 1 | Code refused outside booked hour and on another local day. |
| 2 | Code never opens another child's booking. |
| 3 | CSPRNG eight-digit codes; daily uniqueness under concurrent issuance. |
| 4 | Inspect database; no plaintext working codes. |
| 5 | Three entries maximum; fourth denied; reissue invalidates old code and pass. |
| 6 | Wrong, expired, exhausted and revoked code refusals are indistinguishable. |
| 7 | Durable limiter reserves attempts before lookup; simultaneous 100-request burst cannot exceed allowed lookups. |
| 8 | New browser without valid pass cannot retrieve protected pages, API/data responses or manual bytes via direct URLs. Test Range requests, static origin and cache paths. |
| 9 | Access ends after approved session duration and grace, on checkout and reissue, including already open viewer. |
| 10 | Successful repeat creates one visit only. |
| 11 | Manual attendance records staff identity/name and reason. |
| 12 | Pass signing secret never present in browser code, repo or logs. |

The brief names a suggested 15-minute grace; confirmation is still required. Downloaded content cannot be retroactively removed from a device; private delivery limits future access rather than promising impossible revocation of already copied bytes.

## Required before implementation

1. Obtain reviewed Nov 24 design and trial notes from Shimi (required by official brief; not found in available files and repository branch/search checks).
2. Agree N3 shared booking record and capacity/attendance transitions with Nizar.
3. Choose/confirm authorized PDF delivery and close direct-origin bypasses. Preserve all course functionality and existing PDFs until approved migration; do not publish source manuals in new builds.
4. Connect company-owned hosting, staff identity, Wix and membership authority. Perform fictional-data acceptance and independent security review before launch.

J4/J2/J3 unchanged. No live testing performed.
