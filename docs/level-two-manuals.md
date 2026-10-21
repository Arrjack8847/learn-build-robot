# Level 2 uploaded original-source learning materials

## Audit (GitHub upload, 21 October 2026)

- Earlier Level 2 upload batch through `45b5c4be47f5139799d125493d3ff22ebf0a91c6`; additional PDF uploads followed from `295d91789dffa47e45c9fa8b76eaa781df684909` through `908def72a0f0a82a3b5fac0d0cd400945451544e`.
- Official Level 2 syllabus: **18 categories and 59 original activities**, unchanged
- Uploaded Level 2 sources include the newly registered `Reverse Parking.pdf`, `Smart Window.pdf` and `Spirograph.pdf`, all present and nonempty in the repository.
- **57 PDF Building Studio registrations** covering **56 of the 59 Level 2 syllabus activities**. This includes two selectable See Saw manuals under one activity and five available Sensors lessons.
- **5 original nonempty PowerPoints** under Manipulators are available for download alongside their now-registered PDF Building Studio lessons
- **3 zero-byte placeholder PDFs** cannot be loaded: `Automatic window.pdf`, `Robot war.pdf`, `The treadmill.pdf`
- Confirmed user mappings: **See Saw = Balance.pdf (Version 1) + Balance_v2.pdf (Version 2)**; **Tongs = Pliers.pdf**.
- ⚠️ `Balance_v2.pdf` and `Teeterboard.pdf` have identical GitHub blob SHA `21df7860ba63c17acc720bc69381d4cf41d34e76` (byte-for-byte identical content). Their separate lesson completion keys do **not** imply independently verified instruction contents. Replace `Balance_v2.pdf` if this duplication was unintended.
- **3 of 59 Level 2 syllabus entries** still need usable original files: `The treadmill.pdf`, `Automatic window.pdf`, and `Robot war.pdf`. All three files exist on GitHub but have 0 bytes, so they cannot yet be opened in Building Studio.

## Registered PDF categories
- Action-Oriented: 7 PDF manual(s)
- Biomimicry: 2 PDF manual(s)
- Characters & Structures: 3 PDF manual(s)
- Construction & Industry: 3 PDF manual(s)
- Foundational Robots: 3 PDF manual(s)
- Illumination & Signals: 1 PDF manual(s)
- Interactive Mechanisms: 1 PDF manual(s)
- Interactive Systems: 3 PDF registrations across 2 activities (two See Saw versions and one Tongs manual)
- Machines & Mechanisms: 4 PDF manual(s)
- Manipulators: 5 PDF manuals with the original PowerPoints available separately
- Mechanisms & Simulators: 9 PDF manuals (including its own Crane, different from Construction & Industry / Crane)
- Mechanisms and Concepts: 2 PDF manuals
- Programming & Precise Control: 1 PDF manual
- Sensor-Focused Robots: 1 PDF manual
- Sensors: 5 PDF manuals
- Sound & Voice Interaction: 1 PDF manual
- Vehicles & Complex Movers: 3 PDF manuals
- Vehicles & Motion: 3 PDF manuals

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
- Blank and missing sources remain unlinked until valid source files are available; the duplicated Balance_v2 source is explicitly disclosed.
- Marksmanship, Acceleration Car, both Crawl Slowly variants, Level 1's 59 entries, and Levels 3–6 remain unchanged.

## Validation
GitHub source/tree checks verify the new assets are present and nonempty, all expected imports and distinct progress keys exist, and the Sensors category maps to five registered projects. `tests/level-two-uploaded-manuals.test.mjs` is extended to load each PDF using pdf.js and verify its pages. The Node test suite, production build and browser/mobile rendering must still be run locally.
