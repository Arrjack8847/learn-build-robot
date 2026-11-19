# Vercel PDF Exclusion Audit — 2026-11-19

Project: **BE STEM READY**, repo `Arrjack8847/learn-build-robot`, feature branch `feat/level1-final-build-local-20261119`.

## Verified

The exact 590 original PDFs tracked under `public/` have corresponding Wix URL mapping entries across `levelOneToThreeWixPdfUrls`, `levelFourWixPdfUrls`, `levelFiveWixPdfUrls`, and `levelSixWixPdfUrls`.

- **489** already-Wix-served PDFs: **2,794.4 MB** of source files can be excluded from future Vercel deployment output (excluding `public/Level 1/Learning` and local Level 4 Learning slides).
- **101** local cleaned Learning PDFs: **122.4 MB** remain available in Vercel to preserve the existing user-approved content.
- The `curriculum-source/` PDFs are **outside the Vite public directory**, so they are not part of Vite's automatic public static file copy.
- None of the original tracked PDF binaries are modified or removed from GitHub.

## Safeguards

- `.vercelignore` excludes the six known Wix-backed path groups at deployment source upload.
- `scripts/prune-vercel-wix-pdfs.mjs` performs a fail-closed audit and strips any remaining Wix-served PDFs from generated deployment output after `vite build`.
- The build test checks exact Wix mappings and exceptions; no GitHub Actions are used.
- Later replace the local exceptions only **after** confirming the Wix content is the cleaned/approved version, not the older original.

**Scope:** Feature branch and preview project only; not production.
