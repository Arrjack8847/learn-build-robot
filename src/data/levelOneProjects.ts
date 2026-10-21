import type { LevelOneCategoryId } from "./levelOneCategories";

/**
 * Actual Level 1 syllabus entries, transcribed from E:/new_Sylabus_(Sorted)/Level 1.
 * A filename here is metadata ONLY, not an asset bundled into the website.
 */
const entries: Record<LevelOneCategoryId, readonly string[]> = {
  "autonomous-navigation-ranging": [
    "Acceleration car",
  ],
  "biomimicry": [
    "Caged Bird.pdf", "Ferocious snake.pptx", "Funny cat.pptx",
    "Shy penguin.pptx", "Sled dog.pptx",
  ],
  "characters-structures": [
    "Big head robot", "Bird", "First Robot Model", "House", "REX robot",
    "Sled", "Spider", "SpongeBob", "Wali robot",
  ],
  "display-movement": [
    "Clock", "Drawing board", "Hello World", "Mechanical masks", "Primitive robot",
  ],
  "foundational-robots": [
    "Athlete.pptx", "Basic programming.pptx", "Drummer robot.pptx",
    "Propeller Aircraft.pdf", "Sailboat.pptx", "The lawn mower.pptx",
  ],
  "illumination-signals": [
    "Blinking robot", "Color-changing Light", "Corridor lamp",
    "Help light", "Lighthouse", "Little stars", "Traffic light Signal",
  ],
  "interactive-systems": ["Dart", "Responder"],
  "machines-mechanisms": [
    "Balanced Bird.pdf", "Dancing Music Box.pdf", "Hand-cranking Fan.pdf",
    "Old-fashioned Telephone.pdf",
  ],
  "manipulators": [
    "Car.pptx", "Dynamic screen.pptx", "Pendulum ride.pptx",
    "Rotating flying chair.pptx", "Skating.pptx", "The windmill kingdom.pptx",
  ],
  "mechanisms-simulators": [
    "Crawl Slowly", "Mechanical arm", "Shock absorber",
  ],
  "mechanisms-and-concepts": ["Wiper.pdf"],
  "sensor-focused-robots": ["Gyro transmitter"],
  "vehicles-complex-movers": ["Motorcycle", "Pull back car"],
  "vehicles-motion": [
    "Hand-cranking Giant Stride.pdf", "Hermit Crab.pdf", "Little Owl.pdf",
    "Oscillating Fan.pdf", "Pocket Pistol.pdf", "Pullback Bicycle.pdf",
    "Rotating Coffee Cup.pdf",
  ],
};

export type LevelOneSyllabusProject = {
  id: string;
  name: string;
  categoryId: LevelOneCategoryId;
  sourceEntry: string;
  sourceKind: "folder" | "pdf" | "pptx";
  /** Only link a project after its implementation exists in this repository. */
  availableProjectId?: string;
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getLevelOneProjects(categoryId: LevelOneCategoryId): LevelOneSyllabusProject[] {
  return entries[categoryId].map((sourceEntry, index) => {
    const ext = /\.(pdf|pptx)$/i.exec(sourceEntry)?.[1]?.toLowerCase() as "pdf" | "pptx" | undefined;
    const name = ext ? sourceEntry.slice(0, -(ext.length + 1)) : sourceEntry;
    const project: LevelOneSyllabusProject = {
      id: `${categoryId}-${slugify(name)}-${index + 1}`,
      name,
      categoryId,
      sourceEntry,
      sourceKind: ext ?? "folder",
    };
    if (categoryId === "autonomous-navigation-ranging" && sourceEntry === "Acceleration car") {
      project.availableProjectId = "acceleration-car";
    }
    return project;
  });
}

export const LEVEL_ONE_PROJECT_COUNT = Object.values(entries).reduce((n, projects) => n + projects.length, 0);
