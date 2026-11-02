# BE STEM READY

A responsive robotics learning platform with six levels and official project categories. Students browse **Home → Level → Category → Project**, then open the relevant Learning or Building experience.

## Tech stack

TanStack Start, React 19, TypeScript, Vite 8, Tailwind CSS 4, PDF.js and Three.js.

## Vercel deployment

The GitHub repository is already connected to the existing [BE STEM READY Vercel project](https://vercel.com/soe-min-khants-projects/learn-build-robot).

- **Current production website:** https://learn-build-robot.vercel.app (deployed from `main`; does not yet include the six-level quiz integration).
- **321-quiz integration preview:** https://learn-build-robot-adxh0vifi-soe-min-khants-projects.vercel.app (protected Vercel preview from `feat/quiz-all-levels-integrated-20261101`).
- **Integration pull request:** https://github.com/Arrjack8847/learn-build-robot/pull/65 (draft; requires end-to-end quiz testing before merging into `main`).

The local `.vercel/` directory created by the Vercel CLI and local `.env*` configuration are ignored by Git; excluding those local files does not establish or disconnect the hosted Git integration.

## Local development

```bash
npm install
npm run dev
```

To check the build and focused UI tests:

```bash
npm run build
npm run test:ui
```

The app preserves building-step progress locally in the browser. The Building Studio supports interactive 3D steps, original PDF building manuals, and presentation-based lesson content where available.

The mobile homepage and original BE STEM READY branding are maintained. The old onboarding wizard, generic theory catalogue, robot carousel, progress dashboard, placeholder quiz gateway and mock practical grading screens are not part of the current MVP.
