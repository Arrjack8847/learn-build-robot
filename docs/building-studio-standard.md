# BE STEM READY — Universal Building Studio Standard

## Scope
Applies to **every robot building project**, across the planned **6 levels and 14 categories**.
This is a shared **building-screen standard**, not a redesign of the Home, Level,
Category, or Robot selection pages. Do not invent or populate level/category
data when those curricula are not defined.

## The one layout
1. Small header: back to robot list, robot title, step position, **Steps** drawer.
2. Large content-first viewer: a 3D interactive assembly or the original PDF.
3. Compact **floating dock**, expandable on demand; same placement for every lesson.
4. Simple completion screen with review and next-adventure actions.

## Shared components
- `src/components/practical/BuildingStudio.tsx`
  - `BuildingStudioHeader`: receives title, current step and total as props.
  - `BuildingStepDrawer`: receives dynamic step items; no static step/level counts.
  - `BuildingFloatingDock`: compact by default, expanded on request.
  - `BuildingStudioCompletion`: common completion pattern.
- `AssemblyLessonUI.tsx`: retains 3D action playback, now with expand/collapse.
- `AccelerationCarPdfViewer.tsx`: same outer layout for a PDF-only manual.

## Behavioral rules
- **Step** is a build milestone. **Action** is one sub-operation/animation within a step.
  Preserve both navigations independently.
- **Done & Next** explicitly records a completed build step; viewing an animation,
  flipping a PDF page, or selecting a step does not mark it complete.
- Never block Previous, Step list, or Help behind unavailable WebGL.
- Keep the PDF original and unchanged. Build text must come from verified manual content.
  Generic viewer hints (zoom, pan, inspect page) are UI help, not assembly instructions.
- Long instructions belong in expanded guidance, never permanent side panels.
- The floating dock cannot cover required assembly visuals. Reserve viewer space for it.
- Use blue/white/light-blue and sparing green/yellow/pink accents. No deep-navy panels.
- All icon controls need accessible labels. Buttons need >=44 px hit targets;
  reduced-motion settings must be respected; step drawer must be keyboard accessible.

## Adding another project
Create or register its project data and step count as usual. Pass its step array to
`BuildingStepDrawer`, use `BuildingStudioHeader` with dynamic counts, and select
the appropriate viewer (3D, PDF, or future supported viewer). Reuse `BuildingFloatingDock`
for reference-only steps, or `AssemblyStage` for 3D action lessons. Do not
copy an entirely new building page per category or level.

## Safeguards
- Existing Marksman geometry, motion, action handlers, and legacy source images remain unchanged.
- Acceleration Car continues using `Acceleration car_Building.pdf` exclusively for
  assembly illustrations, with existing 19-page / 18-step mapping.
- This branch intentionally does **not** modify the 6-level / 14-category curriculum contents.
