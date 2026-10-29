/**
 * Development-only unreviewed bank loader. Never import into the published registry.
 * The quiz route imports this module ONLY when Vite is in development mode
 * and ?preview=1 is explicitly requested for a pending Level 1 project.
 */
import { validateQuizBank, type QuizBank } from "./quizStudio";

const unpublishedIds = new Set<string>([
  "ferocious-snake",
  "shy-penguin",
  "first-robot-model",
  "rex-robot",
  "spider",
  "drawing-board",
  "hello-world",
  "mechanical-masks",
  "athlete",
  "basic-programming",
  "drummer-robot",
  "sailboat",
  "dynamic-screen",
  "pendulum-ride",
  "the-windmill-kingdom",
  "mechanical-arm",
  "color-changing-light",
  "corridor-lamp",
  "motorcycle",
  "caged-bird",
  "propeller-aircraft",
  "wiper",
  "hand-cranking-giant-stride",
  "hermit-crab",
  "little-owl",
  "oscillating-fan",
  "pocket-pistol",
  "pullback-bicycle",
  "rotating-coffee-cup",
  "balanced-bird",
  "dancing-music-box",
  "hand-cranking-fan",
  "old-fashioned-telephone"
]);
const modules = import.meta.glob<Record<string, QuizBank>>("./quizBanks/*.ts", { eager: true });

export function getUnreviewedQuizBank(projectId: string): QuizBank | undefined {
  if (!import.meta.env.DEV || !unpublishedIds.has(projectId)) return undefined;
  const name = projectId.replace(/-([a-z0-9])/g, (_, letter: string) => letter.toUpperCase());
  const bank = modules[`./quizBanks/${name}.ts`]?.[`${name}Bank`];
  return bank?.projectId === projectId && validateQuizBank(bank).length === 0 ? bank : undefined;
}
