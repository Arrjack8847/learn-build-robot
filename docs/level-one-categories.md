# Level 1 robotics syllabus categories

These 14 names and their order come from the screenshot of the `new_Sylabus_(Sorted)/Level 1` folder provided by the user.

The categories are registered in `src/data/levelOneCategories.ts`. They are available at `/practical/level-1` and `/practical/level-1/{categoryId}`.

The application is planned for six levels, but only Level 1's folder names have been supplied. Do **not** assume Level 2–6 use the same categories or mark levels as completed/unlocked without supporting syllabus data.

## Navigation

- `/choose` → Build a Robot → `/practical/level-1`
- Tap a category card → `/practical/level-1/{categoryId}`
- Categories with no verified associated lessons display an informative empty state with a link to available robot builds.
- `/practical` remains the existing robot picker; Marksman and Acceleration Car remain usable.

## Associating a future syllabus robot

When its source folder and PDF/manual are available, add the robot to `src/data/practical.ts` and set:

```ts
level: 1,
categoryId: "biomimicry", // example ONLY, not assigned to a current project
```

The Category Detail view will populate automatically. Do not guess an existing robot's category based only on its name. Projects continue using the Universal Building Studio lesson components.
