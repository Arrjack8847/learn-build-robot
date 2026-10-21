# Level 2 uploaded original-source learning materials

## Audit (GitHub upload, 21 October 2026)

- Base: `main` commit `45b5c4be47f5139799d125493d3ff22ebf0a91c6`
- Official Level 2 syllabus: **18 categories and 59 original activities**, unchanged
- Uploaded in 16 commits: **34 new source files** (29 named PDFs and 5 PowerPoints)
- **24 original nonempty PDFs** mapped to matching Level 2 syllabus activities and connected to the existing responsive PDF Building Studio with isolated completion IDs
- **5 original nonempty PowerPoints** under Manipulators are offered as direct downloadable source files, not misrepresented as PDFs or interactive lessons
- **3 zero-byte placeholder PDFs** cannot be loaded: `Automatic window.pdf`, `Robot war.pdf`, `The treadmill.pdf`
- **2 PDFs with ambiguous syllabus matches** are intentionally unassigned: `Balance.pdf` (no exact matching syllabus title) and `Pliers.pdf` (not confirmed equivalent to Interactive Systems / Tongs)
- 30 of 59 Level 2 syllabus entries still need valid original materials or an approved mapping (including those three empty placeholders). The two unmatched PDF files are not counted toward the 59 activities.

## Registered PDF categories
- Action-Oriented: 7 PDF manual(s)
- Biomimicry: 2 PDF manual(s)
- Characters & Structures: 3 PDF manual(s)
- Construction & Industry: 3 PDF manual(s)
- Foundational Robots: 3 PDF manual(s)
- Illumination & Signals: 1 PDF manual(s)
- Interactive Mechanisms: 1 PDF manual(s)
- Machines & Mechanisms: 4 PDF manual(s)

## Original PowerPoint uploads
- `Car Steering.pptx`
- `Cliff walk.pptx`
- `Ferris wheel.pptx`
- `Round-trip transportation.pptx`
- `Shift gears.pptx`

## Rules
- The `pdfActivityManuals` registry uses the exact source PDF file with `?url`, no inferred assembly steps.
- `pdfManualProject` supports Level 2 registrations without changing existing Level 1 defaults.
- Level 2 category cards match by source syllabus title and category; a registered PDF opens `/practical/$projectId`, using the existing shared PDF viewer.
- PowerPoints remain original `.pptx` files available via native browser download.
- Blank, missing and ambiguous sources remain unlinked until valid manuals and titles are confirmed.
- Marksmanship, Acceleration Car, both Crawl Slowly variants, Level 1's 59 entries, and Levels 3–6 remain unchanged.

## Validation
Static source and tree checks were done before committing. `tests/level-two-uploaded-manuals.test.mjs` loads each nonempty original PDF and checks PPTX ZIP signatures, category placement, distinct progress keys, and source mappings when run on a complete local checkout. Production build and real-browser rendering must be verified locally.
