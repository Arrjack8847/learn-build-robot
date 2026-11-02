# Step 2 — PDF branding and Chinese text classification

**Repository:** Arrjack8847/learn-build-robot  
**Branch:** audit/pdf-branding-20261102  
**Date:** 2026-11-02  
**Scope:** 598 PDFs / 12,599 pages across levels 1–6 and other PDF directories.  
**Status:** Automated evidence classification complete. Human verification pending. Original PDFs not changed.

## Executive summary

| Detection category | Unique pages |
| --- | ---: |
| Intelligence Storm, native/extractable text | 183 |
| Graphic logo template matches (five known designs) | 228 |
| Branding OCR-only, not matched to native text or graphical templates | 82 |
| **All branding-flagged pages (non-overlapping)** | **493** |
| Chinese characters, native/extractable text | 244 |
| Additional Chinese multi-character OCR candidates | 112 |
| **All strongly flagged Chinese-text pages** | **356** |
| Chinese OCR isolated glyph candidates deferred | 4,322 |
| **Pages with either branding or stronger Chinese text** | **842** |
| PDFs containing either stronger signal | 376 |

Overlapping branding/Chinese pages are counted only once in the 842-page review queue.

## Brand category definitions

1. **Embedded English wording:** Native PDF text extraction finds “Intelligence Storm” / “Intelligent Storm”; inspect page location and whether this is attribution or instructional text.
2. **Graphical logo:** Page image matches one of five reference logo appearances at similarity >=0.90. High-confidence candidate; still check rendered page before concluding it contains the logo.
3. **OCR-only English wording:** OCR of rendered page finds brand text, but no native wording or known-template match; requires visual confirmation.

## Chinese text category definitions

1. **Embedded Chinese:** Native/extractable Chinese characters, suitable for detailed text-layer review.
2. **Multi-character OCR:** At least two adjacent Han characters detected on a rendered page, with no native Chinese text. Require visual confirmation.
3. **Isolated Han OCR:** Single-character OCR noise on 4,322 pages after excluding stronger native or multi-character evidence; these are **not** confirmed Chinese text.

## Layout patterns observed in representative images

- Dark slide cover with large centrally placed 智能风暴 / INTELLIGENCE STORM mark.
- Dark “Thanks!” closing slide with smaller bottom-right logo.
- White title slide with small black logo.
- Yellow-accent pages with bottom-right brand mark.

## Level classification

| Area | PDFs | High-priority branding pages | Stronger Chinese-text pages | Isolated OCR page candidates |
| --- | ---: | ---: | ---: | ---: |
| Level 1 | 45 | 71 | 46 | 259 |
| Level 2 | 44 | 76 | 31 | 230 |
| Level 3 | 43 | 67 | 32 | 363 |
| Level 4 | 106 | 121 | 50 | 862 |
| Level 5 | 100 | 90 | 55 | 831 |
| Level 6 | 88 | 56 | 42 | 834 |
| Other PDF folders | 172 | 12 | 100 | 943 |

## Review decisions

- P0: Copyright/license/notice documents receive a separate rights review; **do not automatically remove** those statements.
- P1: Embedded text and known graphic template matches are inspected on rendered pages.
- P2: OCR-only brand and Chinese multi-character candidates are manually verified for false positives.
- P3: Isolated-character OCR candidates are deferred and spot-checked, never bulk-removed by OCR alone.

The classification is **not** an instruction to erase publisher branding or legal attribution; republishing/adapting third-party material requires the appropriate rights. This report does not edit source PDFs.

## Deliverables

Downloadable Step 2 classification workbook and CSV review queue were produced in the ChatGPT task. The workbook includes all 598 file records, 842 page review rows, per-level summary, and a reviewer guide.
