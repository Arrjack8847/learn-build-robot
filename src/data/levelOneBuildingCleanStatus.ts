/**
 * November 19 Level 1 Building restoration verification.
 *
 * These 19 source PDF binaries still match the pre-repair Git blob hashes on
 * main. The approved cleaner outputs were generated and verified separately,
 * but the replacement PDF binaries have not been committed to the repository.
 *
 * Final Build must not serve the older Wix originals for these projects while
 * claiming they are cleaned. Only update this list after checking the exact
 * published PDF hashes and the final route.
 */
export const LEVEL_ONE_BUILDING_CLEAN_UPLOAD_PENDING = new Set<string>([
  "funny-cat",
  "ferocious-snake",
  "shy-penguin",
  "sled-dog",
  "athlete",
  "basic-programming",
  "drummer-robot",
  "sailboat",
  "the-lawn-mower",
  "car",
  "dynamic-screen",
  "pendulum-ride",
  "rotating-flying-chair",
  "skating",
  "the-windmill-kingdom",
  "little-owl",
  "hand-cranking-fan",
  "oscillating-fan",
  "first-robot-model",
]);
