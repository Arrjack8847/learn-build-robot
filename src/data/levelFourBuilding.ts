import { levelFourLearningManuals } from "./levelFourLearning";
import type { PdfActivityManual } from "./pdfActivityManuals";

/** Verified static Building files under public/Level 4/Building. */
const uploadedBuildingFiles = [
  ["level-4-warrior-with-claws", "Action-Oriented/Warrior With Claws/13. Warrior With Claws - Basic Building Manual.pdf", "basic"],
  ["level-4-warrior-with-claws", "Action-Oriented/Warrior With Claws/13. Warrior With Claws - Optimized Building Manual.pdf", "optimized"],
  ["level-4-drop-proof-robot", "Advanced Navigation & Control/Drop-proof Robot/Drop-proof Robot.pdf", "basic"],
  ["level-4-personal-bodyguard", "Automation & Security/Personal Bodyguard/09. Personal Bodyguard-Building Manual.pdf", "basic"],
  ["level-4-scan-to-open-the-gate", "Automation & Security/Scan to Open the Gate/01. Scan to Open the Gate- Building Manual.pdf", "basic"],
  ["level-4-smart-curtain", "Automation & Security/Smart curtain/Smart curtain_Building.pdf", "basic"],
  ["level-4-guide-dogs", "Autonomous Navigation & Ranging/Guide Dogs/10. Guide Dogs - Basic Building Manual.pdf", "basic"],
  ["level-4-keeping-distance", "Autonomous Navigation & Ranging/Keeping Distance/12. Keeping Distance-Building Manual.pdf", "basic"],
  ["level-4-laser-rangefinder", "Autonomous Navigation & Ranging/Laser Rangefinder/10. Laser Rangefinder - Building Manual.pdf", "basic"],
  ["level-4-magnetically-controlled-door", "Autonomous Navigation & Ranging/Magnetically Controlled Door/06. Magnetically controlled door-Building Manual.pdf", "basic"],
  ["level-4-obstacle-avoidance-in-snow", "Autonomous Navigation & Ranging/Obstacle Avoidance In Snow/4. Obstacle Avoidance In Snow-Basic Building Manual.pdf", "basic"],
  ["level-4-obstacle-avoidance-robot-2", "Autonomous Navigation & Ranging/Obstacle Avoidance Robot 2/Obstacle Avoidance Robot 2_Building.pdf", "basic"],
  ["level-4-radar-vehicle", "Autonomous Navigation & Ranging/Radar vehicle/Radar vehicle_Building.pdf", "basic"],
  ["level-4-nocturnal-beetle", "Biomimicry & Stimulus Response/Nocturnal beetle/Nocturnal beetle.pdf", "basic"],
  ["level-4-a-timid-mouse", "Characters & Structures/A Timid Mouse/Lesson 25. A Timid Mouse-Building Manual.pdf", "basic"],
  ["level-4-elf-in-the-tree", "Characters & Structures/Elf in the Tree/12. Elf in the Tree - Basic Building Manual.pdf", "basic"],
  ["level-4-parts-sorter", "Characters & Structures/Parts Sorter/22.Parts Sorter-Building Manual.pdf", "basic"],
  ["level-4-swimming-plesiosaur", "Characters & Structures/Swimming Plesiosaur/19. Swimming Plesiosaur-Building Manual.pdf", "basic"],
  ["level-4-tail-wagging-stegosaurus", "Characters & Structures/Tail-Wagging Stegosaurus/18. Tail-Wagging Stegosaurus-Building Manual.pdf", "basic"],
  ["level-4-architectural-design", "Complex Mechanisms & Coordinated Motion/Architectural design/Architectural design.pdf", "basic"],
  ["level-4-card-machine", "Complex Mechanisms & Coordinated Motion/Card Machine/Card Machine.pdf", "basic"],
  ["level-4-dancing-robot", "Display & Movement/Dancing Robot/31.Dancing Robot-Building Manual.pdf", "basic"],
  ["level-4-skiing-robot", "Display & Movement/Skiing Robot/28.Skiing Robot -Building Manual.pdf", "basic"],
  ["level-4-induction-desk-lamp", "Illumination & Signals/Induction Desk Lamp/13. Induction Desk Lamp-Building Manual.pdf", "basic"],
  ["level-4-scorpion", "Interactive Mechanisms/Scorpion/Scorpion_Building.pdf", "basic"],
  ["level-4-smart-luggage", "Interactive Mechanisms/Smart Luggage/16. Smart Luggage-Building Manual.pdf", "basic"],
  ["level-4-telegraph-machine", "Interactive Mechanisms/Telegraph machine/Telegraph machine_Building.pdf", "basic"],
  ["level-4-basketball-shooting-machine", "Interactive Systems/Basketball Shooting Machine/27.Basketball Shooting Machine-Building Manual.pdf", "basic"],
  ["level-4-obstacle-avoidance-robot", "Interactive Systems/Obstacle Avoidance Robot/18.Obstacle Avoidance Robot-Building Manual.pdf", "basic"],
  ["level-4-reaction-tester", "Interactive Systems/Reaction Tester/19.Reaction Tester-Building Manual.pdf", "basic"],
  ["level-4-tumbler", "Interactive Systems/Tumbler/01. Tumbler - Building Manual.pdf", "basic"],
  ["level-4-biped-robot", "Mechanisms & Simulators/Biped Robot/20. Biped Robot-Building Manual.pdf", "basic"],
  ["level-4-horizontal-bar", "Mechanisms & Simulators/Horizontal Bar/5. Horizontal Bar-Basic Building Manual.pdf", "basic"],
  ["level-4-oscillating-fan", "Mechanisms & Simulators/Oscillating Fan/19.Oscillating Fan -Building Manual.pdf", "basic"],
  ["level-4-spinning-cups", "Mechanisms & Simulators/Spinning Cups/14. Spinning Cups-Building Manual.pdf", "basic"],
  ["level-4-telegraph", "Mechanisms & Simulators/Telegraph/09.Telegraph -Building Manual.pdf", "basic"],
  ["level-4-turbo-drop", "Mechanisms & Simulators/Turbo Drop/28. Turbo Drop-Building Manual.pdf", "basic"],
  ["level-4-obstacle-avoiding-scorpion", "Programming & Precise Control/Obstacle-avoiding Scorpion/01.Obstacle-avoiding Scorpion_Building Manual.pdf", "basic"],
  ["level-4-card-reader", "Sensor Automation/Card reader/Card reader.pdf", "basic"],
  ["level-4-password-box", "Sensor Automation/Password box/Password box.pdf", "basic"],
  ["level-4-energy-detector", "Sensor-Focused Robots/Energy Detector/05. Energy Detector--Building Manual.pdf", "basic"],
  ["level-4-ranging-robot", "Sensor-Focused Robots/Ranging robot/Ranging robot_Building.pdf", "basic"],
  ["level-4-acoustic-control-lamp", "Sound & Voice Interaction/Acoustic control lamp/Acoustic control lamp_Building.pdf", "basic"],
  ["level-4-electric-piano", "Sound & Voice Interaction/Electric Piano/32.Electric Piano-Building Manual.pdf", "basic"],
  ["level-4-smart-speaker", "Sound & Voice Interaction/Smart Speaker/30.Smart Speaker-Building Manual.pdf", "basic"],
  ["level-4-dangerous-assassin", "Vehicles & Complex Movers/Dangerous Assassin/15. Dangerous Assassin - Basic Building Manual.pdf", "basic"],
  ["level-4-dangerous-assassin", "Vehicles & Complex Movers/Dangerous Assassin/15. Dangerous Assassin - Optimized Building Manual.pdf", "optimized"],
  ["level-4-lucky-cat", "Vehicles & Complex Movers/Lucky Cat/13.Lucky Cat-Building Manual.pdf", "basic"],
  ["level-4-remote-control-car", "Vehicles & Complex Movers/Remote Control Car/04. Remote Control Car-Building Manual.pdf", "basic"],
  ["level-4-transformer-robot", "Vehicles & Complex Movers/Transformer Robot/06.Transformer Robot-Building Manual.pdf", "basic"],
] as const;

export const LEVEL_FOUR_UPLOADED_BUILDING_PDF_COUNT = uploadedBuildingFiles.length;

/** No official Building PDF was supplied for these projects. */
export const LEVEL_FOUR_LEARNING_AS_BUILDING_IDS = [
  "level-4-super-trajectory-robot-2",
  "level-4-tag-recognition",
  "level-4-probe-vehicle",
  "level-4-vending-machine",
  "level-4-voice-control",
  "level-4-safe-box",
  "level-4-back-up-buzzer",
  "level-4-counting-system",
] as const;

function buildingPdfUrl(relativePath: string): string {
  return "/Level%204/Building/" + relativePath.split("/").map(encodeURIComponent).join("/");
}

function originalBuildingManual(id: string, path: string, variant: "basic" | "optimized"): PdfActivityManual {
  const learning = levelFourLearningManuals[id];
  if (!learning) throw new Error("Unknown Level 4 project: " + id);
  return {
    id,
    title: learning.title,
    url: buildingPdfUrl(path),
    completionStepId: id + "-" + variant + "-building-complete",
  };
}

export const levelFourBuildingManuals: Record<string, PdfActivityManual> = {
  ...Object.fromEntries(uploadedBuildingFiles.filter(([, , variant]) => variant === "basic").map(
    ([id, path, variant]) => [id, originalBuildingManual(id, path, variant)],
  )),
  ...Object.fromEntries(LEVEL_FOUR_LEARNING_AS_BUILDING_IDS.map(id => {
    const learning = levelFourLearningManuals[id];
    if (!learning) throw new Error("No Level 4 Learning PDF to reuse: " + id);
    return [id, {
      id,
      title: learning.title,
      url: learning.url,
      completionStepId: id + "-building-reference-complete",
      learningFallback: true,
    }];
  })),
};

const levelFourOptimizedManuals: Record<string, PdfActivityManual> = Object.fromEntries(
  uploadedBuildingFiles.filter(([, , variant]) => variant === "optimized").map(
    ([id, path, variant]) => [id, originalBuildingManual(id, path, variant)],
  ),
);

export function getLevelFourBuildingManual(
  id: string,
  variant?: "basic" | "optimized",
): PdfActivityManual | undefined {
  return (variant === "optimized" ? levelFourOptimizedManuals[id] : undefined) ??
    levelFourBuildingManuals[id];
}

export function hasLevelFourOptimizedManual(id: string): boolean {
  return Boolean(levelFourOptimizedManuals[id]);
}

export function isLevelFourBuildingFallback(id: string): boolean {
  return Boolean(levelFourBuildingManuals[id]?.learningFallback);
}
