/**
 * Level 1 syllabus folder names, transcribed from the user's
 * "new_Sylabus_(Sorted)/Level 1" directory screenshot.
 *
 * This file defines ONLY categories. Robot memberships are added separately
 * when their actual source lessons are available and verified.
 */
export const LEVEL_ONE_CATEGORIES = [
  { id: "autonomous-navigation-ranging", name: "Autonomous Navigation & Ranging", icon: "radar", tone: "blue" },
  { id: "biomimicry", name: "Biomimicry", icon: "paw", tone: "green" },
  { id: "characters-structures", name: "Characters & Structures", icon: "shapes", tone: "pink" },
  { id: "display-movement", name: "Display & Movement", icon: "monitor-play", tone: "yellow" },
  { id: "foundational-robots", name: "Foundational Robots", icon: "bot", tone: "blue" },
  { id: "illumination-signals", name: "Illumination & Signals", icon: "lightbulb", tone: "yellow" },
  { id: "interactive-systems", name: "Interactive Systems", icon: "hand", tone: "pink" },
  { id: "machines-mechanisms", name: "Machines & Mechanisms", icon: "cog", tone: "green" },
  { id: "manipulators", name: "Manipulators", icon: "hand-metal", tone: "blue" },
  { id: "mechanisms-simulators", name: "Mechanisms & Simulators", icon: "orbit", tone: "pink" },
  { id: "mechanisms-and-concepts", name: "Mechanisms and Concepts", icon: "puzzle", tone: "yellow" },
  { id: "sensor-focused-robots", name: "Sensor-Focused Robots", icon: "scan-eye", tone: "green" },
  { id: "vehicles-complex-movers", name: "Vehicles & Complex Movers", icon: "truck", tone: "blue" },
  { id: "vehicles-motion", name: "Vehicles & Motion", icon: "car", tone: "pink" },
] as const;

export type LevelOneCategory = (typeof LEVEL_ONE_CATEGORIES)[number];
export type LevelOneCategoryId = LevelOneCategory["id"];

export const findLevelOneCategory = (id: string) =>
  LEVEL_ONE_CATEGORIES.find((category) => category.id === id);
