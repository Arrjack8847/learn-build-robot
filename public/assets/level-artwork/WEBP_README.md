# Level Selection WebP assets

All eight runtime image references use WebP filenames:

- `level-1.webp` — Little Inventors (light bulb)
- `level-2.webp` — Creative Builders (gears)
- `level-3.webp` — Problem Solvers (rocket)
- `level-4.webp` — Tech Explorers (laptop)
- `level-5.webp` — Innovators (globe)
- `level-6.webp` — Future Makers (robot)
- `header-wave.webp` — sky header background
- `landscape.webp` — bottom pastel hills

To create the WebP binaries, run `npm install` and `npm run assets:webp`
locally. The conversion is also triggered automatically before `npm run dev`,
`npm run build`, and `npm run test:ui`.

Source JPEG and SVG files are intentionally preserved in GitHub so conversion
is reproducible. Renaming a JPEG/SVG extension to .webp without converting its
actual bytes is invalid and is **not** done here. The generated WebP binaries
are currently created locally and not yet tracked as repository binaries.

No Vercel deployment or GitHub Actions are required.
