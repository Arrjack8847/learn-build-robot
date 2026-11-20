# BE STEM READY — Final Build Exams Levels 1–6 · Source and Delivery Audit

Date: 2026-11-20 (Asia/Kuala_Lumpur)

## Source snapshot

- GitHub main inspected at `11a276babc30fdf41bd6508daf777b11b2aaeee7`.
- Level 1 scanner reference branch inspected at `5123cf3a6487114576f7613ed751a501e9337327`.
- This report is for the isolated integration branch `feat/final-build-exams-levels-1-6` only. No production merge was performed.
- Counts below are derived from official syllabus registrations, canonical project IDs, registered Building-manual paths and Wix URL dictionaries. They are **not** live PDF byte/hash verification counts.
- Only *official Building* PDF registrations are included as scanner source projects; Learning slides and PowerPoint conversions alone do not qualify.

## Project and PDF registration inventory

| Level | Official syllabus projects | Registered Building projects in pool | Wix-mapped Building manual variants | Projects without a separate registered Building manual | Approved finished-model crops |
|---|---:|---:|---:|---:|---:|
| 1 | 59 | 59 | 60 candidate manual crops | 0 | 0 |
| 2 | 59 | 59 | 60 | 0 | 0 |
| 3 | 48 | 39 | 42 | 9 | 0 |
| 4 | 56 | 48 | 50 | 8 | 0 |
| 5 | 51 | 43 | 45 | 8 | 0 |
| 6 | 43 | 39 | 41 | 4 | 0 |
| **Total** | **316** | **287** | **298** | **29** | **0** |

Level 1 has 60 unapproved reference-crop candidates in `levelOnePrototypeCrops.json`. The dedicated newer cleaned Building Wix override map has 35 entries; its remaining old links require review against restored sources. A candidate crop is not a verified image.

For Levels 2–6, all Wix-mapped counts above are **registered URL counts**, not proof that the hosted files are English-cleaned, hash-matched or visually correct. The all-unreviewed manifest in `finalBuildApprovals.json` deliberately prevents student exams from unlocking.

## Level 3 syllabus projects excluded from source pool

Nine projects are represented by presentation/slide sources rather than an independently registered, verified Building manual: Super Trajectory Robot 1, Stag beetle, Line patrol car, Money detector, Parking gate, Blood bank Centrifuge, Drawbridge, Fire ladder, and Sign. They are not substituted with Learning slides in the Final Build scanner.

## Implemented on integration branch

- Existing Level 1 scanner and crop review UI preserved; random selection updated to unbiased `crypto.getRandomValues` rejection sampling.
- Shared standalone Levels 2–6 exam UI with routes `/practical/level-{2..6}/final-build`.
- Correct level-only selection, Basic/Optimized variant grouping and separate variant choice after project selection.
- 4.2-second scanner, skip, reduced-motion behavior and dynamic per-level project count.
- Wix PDF source resolver accepts only mapped remote Building URLs; render path clips a single PDF page.
- Persistent absolute 15-minute deadlines, 5-item checklist, pass threshold 4/5, retry and reset.
- Student start is strictly disabled without exact approved project/variant/URL/crop/reviewer and successful reference image render.
- Reviewer-only source-image inspection and explicitly labeled nonstudent test flow.
- Final Build entry point on each level overview page.
- No additional PDF binaries, no GitHub Actions, no production merges.

## Outstanding acceptance blockers

1. Inspect each actual Wix-hosted Building PDF, confirm English-only cleaned identity/hash and source version.
2. Produce and individually review per-project and per-variant finished-model page crops; populate approval manifest **only after** verification. Current approved count is zero.
3. Validate all six routes with client hydration, interactive scanner/timer/reload and representative 320–widescreen viewport tests. SSR HTTP 200 and build success alone do not establish browser-visual QA.
4. Check static deployment output for redundant PDFs after building, inspect all build/test logs and exact Vercel preview state.
5. Review project-specific manual checklists, replace provisional title heuristics where actual mechanics differ.

**Production-ready:** No. **Merge-ready:** No, pending approved visual references and end-to-end QA.
