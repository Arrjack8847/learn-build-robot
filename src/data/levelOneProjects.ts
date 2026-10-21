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
  /** Multiple verified source manuals for one syllabus activity (e.g. Crawl Slowly). */
  availableProjectVariants?: readonly { label: string; projectId: string }[];
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
    if (categoryId === "biomimicry") {
      // Keep original syllabus filenames, even when the uploaded building manual is a PDF.
      const matchingPdfProjects: Record<string, string> = {
        "Caged Bird.pdf": "caged-bird",
        "Ferocious snake.pptx": "ferocious-snake",
        "Funny cat.pptx": "funny-cat",
        "Shy penguin.pptx": "shy-penguin",
        "Sled dog.pptx": "sled-dog",
      };
      const matchingProjectId = matchingPdfProjects[sourceEntry];
      if (matchingProjectId) project.availableProjectId = matchingProjectId;
    }
    if (categoryId === "illumination-signals") {
      // Match the existing Level 1 syllabus entry to its verified uploaded PDF.
      const matchingPdfProjects: Record<string, string> = {
        "Blinking robot": "blinking-robot",
        "Color-changing Light": "color-changing-light",
        "Corridor lamp": "corridor-lamp",
        "Help light": "help-light",
        "Lighthouse": "lighthouse",
        "Little stars": "little-stars",
        "Traffic light Signal": "traffic-light-signal",
      };
      const matchingProjectId = matchingPdfProjects[sourceEntry];
      if (matchingProjectId) project.availableProjectId = matchingProjectId;
    }
    if (categoryId === "interactive-systems") {
      // Match the existing Level 1 syllabus entry to its verified uploaded PDF.
      const matchingPdfProjects: Record<string, string> = {
        "Dart": "dart",
        "Responder": "responder",
      };
      const matchingProjectId = matchingPdfProjects[sourceEntry];
      if (matchingProjectId) project.availableProjectId = matchingProjectId;
    }
    if (categoryId === "mechanisms-and-concepts") {
      // Match the existing Level 1 syllabus entry to its verified uploaded PDF.
      const matchingPdfProjects: Record<string, string> = {
        "Wiper.pdf": "wiper",
      };
      const matchingProjectId = matchingPdfProjects[sourceEntry];
      if (matchingProjectId) project.availableProjectId = matchingProjectId;
    }
    if (categoryId === "sensor-focused-robots") {
      // Match the existing Level 1 syllabus entry to its verified uploaded PDF.
      const matchingPdfProjects: Record<string, string> = {
        "Gyro transmitter": "gyro-transmitter",
      };
      const matchingProjectId = matchingPdfProjects[sourceEntry];
      if (matchingProjectId) project.availableProjectId = matchingProjectId;
    }
    if (categoryId === "vehicles-complex-movers") {
      // Match the existing Level 1 syllabus entry to its verified uploaded PDF.
      const matchingPdfProjects: Record<string, string> = {
        "Motorcycle": "motorcycle",
        "Pull back car": "pull-back-car",
      };
      const matchingProjectId = matchingPdfProjects[sourceEntry];
      if (matchingProjectId) project.availableProjectId = matchingProjectId;
    }
    if (categoryId === "vehicles-motion") {
      // Match the existing Level 1 syllabus entry to its verified uploaded PDF.
      const matchingPdfProjects: Record<string, string> = {
        "Hand-cranking Giant Stride.pdf": "hand-cranking-giant-stride",
        "Hermit Crab.pdf": "hermit-crab",
        "Little Owl.pdf": "little-owl",
        "Oscillating Fan.pdf": "oscillating-fan",
        "Pocket Pistol.pdf": "pocket-pistol",
        "Pullback Bicycle.pdf": "pullback-bicycle",
        "Rotating Coffee Cup.pdf": "rotating-coffee-cup",
      };
      const matchingProjectId = matchingPdfProjects[sourceEntry];
      if (matchingProjectId) project.availableProjectId = matchingProjectId;
    }
    if (categoryId === "machines-mechanisms") {
      // Every Machines & Mechanisms syllabus lesson now has its own uploaded PDF.
      const matchingPdfProjects: Record<string, string> = {
        "Balanced Bird.pdf": "balanced-bird",
        "Dancing Music Box.pdf": "dancing-music-box",
        "Hand-cranking Fan.pdf": "hand-cranking-fan",
        "Old-fashioned Telephone.pdf": "old-fashioned-telephone",
      };
      const matchingProjectId = matchingPdfProjects[sourceEntry];
      if (matchingProjectId) project.availableProjectId = matchingProjectId;
    }
    if (categoryId === "mechanisms-simulators") {
      if (sourceEntry === "Crawl Slowly") {
        // The syllabus has one activity, but GitHub contains two distinct official versions.
        // Preserve both manuals and their separate completion records.
        project.availableProjectVariants = [
          { label: "Basic", projectId: "crawl-slowly-basic" },
          { label: "Optimized", projectId: "crawl-slowly-optimized" },
        ];
      } else {
        const matchingPdfProjects: Record<string, string> = {
          "Mechanical arm": "mechanical-arm",
          "Shock absorber": "shock-absorber",
        };
        const matchingProjectId = matchingPdfProjects[sourceEntry];
        if (matchingProjectId) project.availableProjectId = matchingProjectId;
      }
    }
    if (categoryId === "manipulators") {
      // Preserve original syllabus names while viewing uploaded PDF equivalents.
      const matchingPdfProjects: Record<string, string> = {
        "Car.pptx": "car",
        "Dynamic screen.pptx": "dynamic-screen",
        "Pendulum ride.pptx": "pendulum-ride",
        "Rotating flying chair.pptx": "rotating-flying-chair",
        "Skating.pptx": "skating",
        "The windmill kingdom.pptx": "the-windmill-kingdom",
      };
      const matchingProjectId = matchingPdfProjects[sourceEntry];
      if (matchingProjectId) project.availableProjectId = matchingProjectId;
    }
    if (categoryId === "foundational-robots") {
      // Map the existing syllabus filenames to their corresponding uploaded PDF manuals.
      const matchingPdfProjects: Record<string, string> = {
        "Athlete.pptx": "athlete",
        "Basic programming.pptx": "basic-programming",
        "Drummer robot.pptx": "drummer-robot",
        "Propeller Aircraft.pdf": "propeller-aircraft",
        "Sailboat.pptx": "sailboat",
        "The lawn mower.pptx": "the-lawn-mower",
      };
      const matchingProjectId = matchingPdfProjects[sourceEntry];
      if (matchingProjectId) project.availableProjectId = matchingProjectId;
    }
    if (categoryId === "display-movement") {
      const matchingPdfProjects: Record<string, string> = {
        "Clock": "clock",
        "Drawing board": "drawing-board",
        "Hello World": "hello-world",
        "Mechanical masks": "mechanical-masks",
        "Primitive robot": "primitive-robot",
      };
      const matchingProjectId = matchingPdfProjects[sourceEntry];
      if (matchingProjectId) project.availableProjectId = matchingProjectId;
    }
    if (categoryId === "characters-structures") {
      const matchingPdfProjects: Record<string, string> = {
        "Big head robot": "big-head-robot",
        "Bird": "bird",
        "First Robot Model": "first-robot-model",
        "House": "house",
        "REX robot": "rex-robot",
        "Sled": "sled",
        "Spider": "spider",
        "SpongeBob": "spongebob",
        "Wali robot": "wali-robot",
      };
      const matchingProjectId = matchingPdfProjects[sourceEntry];
      if (matchingProjectId) project.availableProjectId = matchingProjectId;
    }
    return project;
  });
}

export const LEVEL_ONE_PROJECT_COUNT = Object.values(entries).reduce((n, projects) => n + projects.length, 0);
