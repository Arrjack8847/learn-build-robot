# Level 2 uploaded original-source learning materials

## Audit (GitHub upload, 21 October 2026)

- Original upload base: `45b5c4be47f5139799d125493d3ff22ebf0a91c6`; additional 14 manuals in GitHub upload commit `834afb342fee1d11fc12a29fc07141dbea57bb1f`.
- Official Level 2 syllabus: **18 categories and 59 original activities**, unchanged
- Uploads now total **54 source files** for Level 2 (49 named PDFs and 5 PowerPoints), including the latest 20 PDFs.
- **44 original nonempty PDFs** mapped to matching Level 2 syllabus activities and connected to the existing responsive PDF Building Studio with isolated completion IDs (24 previously integrated + 5 Manipulators + 9 Mechanisms & Simulators + 2 Mechanisms and Concepts + Battery robot + Walking robot + 2 Sensors)
- **5 original nonempty PowerPoints** under Manipulators are available for download alongside their now-registered PDF Building Studio lessons
- **3 zero-byte placeholder PDFs** cannot be loaded: `Automatic window.pdf`, `Robot war.pdf`, `The treadmill.pdf`
- **2 PDFs with ambiguous syllabus matches** are intentionally unassigned: `Balance.pdf` (no exact matching syllabus title) and `Pliers.pdf` (not confirmed equivalent to Interactive Systems / Tongs)
- 15 of 59 Level 2 syllabus entries still need valid original materials or an approved mapping (including those three empty placeholders). The two unmatched PDF files are not counted toward the 59 activities.

## Registered PDF categories
- Action-Oriented: 7 PDF manual(s)
- Biomimicry: 2 PDF manual(s)
- Characters & Structures: 3 PDF manual(s)
- Construction & Industry: 3 PDF manual(s)
- Foundational Robots: 3 PDF manual(s)
- Illumination & Signals: 1 PDF manual(s)
- Interactive Mechanisms: 1 PDF manual(s)
- Machines & Mechanisms: 4 PDF manual(s)
- Manipulators: 5 PDF manuals with the original PowerPoints available separately
- Mechanisms & Simulators: 9 PDF manuals (including its own Crane, different from Construction & Industry / Crane)
- Mechanisms and Concepts: 2 PDF manuals
- Programming & Precise Control: 1 PDF manual
- Sensor-Focused Robots: 1 PDF manual
- Sensors: 2 PDF manuals

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
- PowerPoints remain original `.pptx` files available via native browser download even when their cards also offer PDF Building Studio.
- Blank, missing and ambiguous sources remain unlinked until valid manuals and titles are confirmed.
- Marksmanship, Acceleration Car, both Crawl Slowly variants, Level 1's 59 entries, and Levels 3–6 remain unchanged.

## Validation
Static source and tree checks were done before committing. `tests/level-two-uploaded-manuals.test.mjs` loads each nonempty original PDF and checks PPTX ZIP signatures, category placement, distinct progress keys, and source mappings when run on a complete local checkout. Production build and real-browser rendering must be verified locally.
