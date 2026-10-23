import { pdfActivityManuals } from "./pdfActivityManuals";
import type { LevelOneLecture } from "./levelOneLectures";

/** Level 3 Learning source registry.
 * Use the original 43 uploaded lecture PDFs for those projects.
 * Five projects without lecture PDFs reuse their exact existing Building PDF
 * URL, without modifying the Building Studio or copying PDF files.
 */
const uploadedLectureFiles = [
  ["level-3-clip-robot", "Action-Oriented/Clip robot/Clip robot_Powerpoint.pdf"],
  ["level-3-cycle-sport-basic", "Action-Oriented/Cycle Sport/3. Cycle Sport - Slides.pdf"],
  ["level-3-cycle-sport-optimized", "Action-Oriented/Cycle Sport/3. Cycle Sport - Slides.pdf"],
  ["level-3-super-trajectory-robot-1", "Advanced Navigation & Control/Super Trajectory Robot 1/13.Super Trajectory Robot 1-update.pdf"],
  ["level-3-automatic-seesaw", "Automation & Security/Automatic Seesaw/24. Automatic Seesaw.pdf"],
  ["level-3-security-door", "Automation & Security/Security door/Security door_Powerpoint-update.pdf"],
  ["level-3-smart-door", "Automation & Security/Smart door/Smart door_Powerpoint.pdf"],
  ["level-3-following-robot", "Autonomous Navigation & Ranging/Following Robot/Following Robot_Powerpoint.pdf"],
  ["level-3-obstacle-avoidance-robot-1", "Autonomous Navigation & Ranging/Obstacle Avoidance Robot 1/Obstacle Avoidance Robot 1_Powerpoint.pdf"],
  ["level-3-sunflower", "Biomimicry & Stimulus Response/Sunflower/09.Sunflower.pdf"],
  ["level-3-stag-beetle", "Biomimicry/Stag beetle.pdf"],
  ["level-3-electric-bulldozer", "Characters & Structures/Electric Bulldozer/23.Electric Bulldozer -Slides.pdf"],
  ["level-3-electric-fan-characters-structures", "Characters & Structures/Electric Fan/05.Electric Fan-Slides.pdf"],
  ["level-3-safe", "Characters & Structures/Safe/15.Safe -Slides.pdf"],
  ["level-3-smart-trash-bin", "Characters & Structures/Smart Trash Bin/20.Smart Trash Bin-Slides.pdf"],
  ["level-3-automated-guided-vehicle", "Display & Movement/Automated Guided Vehicle/24.Automated Guided Vehicle-Slides.pdf"],
  ["level-3-race-walking-basic", "Display & Movement/Race Walking/1. Race Walking - Slides.pdf"],
  ["level-3-race-walking-optimized", "Display & Movement/Race Walking/1. Race Walking - Slides.pdf"],
  ["level-3-race-walking-optimized-ratchet", "Display & Movement/Race Walking/1. Race Walking - Slides.pdf"],
  ["level-3-bumper-car-foundational-robots", "Foundational Robots/Bumper car.pdf"],
  ["level-3-line-patrol-car", "Foundational Robots/Line patrol car.pdf"],
  ["level-3-disinfection-lamp", "Illumination & Signals/Disinfection Lamp/13.Disinfection Lamp-Slides.pdf"],
  ["level-3-flashlight-sensor", "Illumination & Signals/Flashlight Sensor/04.Flashlight -Slides.pdf"],
  ["level-3-light-sensitive-curtains", "Illumination & Signals/Light-sensitive Curtains/14.Light-sensitive Curtains -Slides.pdf"],
  ["level-3-bumper-car-interactive-mechanisms", "Interactive Mechanisms/Bumper car/Bumper car_Powerpoint-update.pdf"],
  ["level-3-anti-fall-robot", "Interactive Systems/Anti-fall Robot/11.Anti-fall Robot-Slides.pdf"],
  ["level-3-automatic-door", "Interactive Systems/Automatic Door/17.Automatic Door -Slides.pdf"],
  ["level-3-juicer-machine", "Interactive Systems/Juicer Machine/06.Juicer Machine-Slides.pdf"],
  ["level-3-washing-machine", "Interactive Systems/Washing Machine/08.Washing Machine-Slides.pdf"],
  ["level-3-money-detector", "Machines & Mechanisms/Money detector.pdf"],
  ["level-3-parking-gate", "Machines & Mechanisms/Parking gate.pdf"],
  ["level-3-blood-bank-centrifuge", "Manipulators/Blood bank Centrifuge.pdf"],
  ["level-3-electronic-scale", "Manipulators/Electronic scale.pdf"],
  ["level-3-gyro-transmitter", "Manipulators/Gyro transmitter.pdf"],
  ["level-3-drawbridge", "Mechanisms and Concepts/Drawbridge.pdf"],
  ["level-3-electric-fan-mechanisms-and-concepts", "Mechanisms and Concepts/Electric fan.pdf"],
  ["level-3-fire-ladder", "Mechanisms and Concepts/Fire ladder.pdf"],
  ["level-3-sign", "Mechanisms and Concepts/Sign.pdf"],
  ["level-3-electric-guitar", "Sound & Voice Interaction/Electric guitar/10.Electric guitar_Powerpoint.pdf"],
  ["level-3-music-box", "Sound & Voice Interaction/Music Box/29.Music Box -Slides.pdf"],
  ["level-3-music-doorbell", "Sound & Voice Interaction/Music Doorbell/07.Music Doorbell- Slides.pdf"],
  ["level-3-smart-audio", "Sound & Voice Interaction/Smart Audio/Smart Audio_Powerpoint.pdf"],
  ["level-3-sonometer", "Sound & Voice Interaction/Sonometer/Sonometer_Powerpoint-update.pdf"],
  ["level-3-sound-level-meter", "Sound & Voice Interaction/Sound Level Meter/16.Sound Level Meter -Slides.pdf"],
  ["level-3-f1-racing-car", "Vehicles & Complex Movers/F1 racing car/F1 racing car_Powerpoint.pdf"],
  ["level-3-long-lived-turtle", "Vehicles & Complex Movers/Long-Lived Turtle/11. The Long-lived Turtle - Slides.pdf"],
] as const;

/** Five projects without dedicated Level 3 lecture PDFs. */
export const LEVEL_THREE_BUILDING_PDF_LEARNING_FALLBACK_IDS = [
  "level-3-lifting-maintenance-vehicle",
  "level-3-biting-monster",
  "level-3-electric-gyro-launcher",
  "level-3-responder",
  "level-3-lunar-rover",
] as const;

export const LEVEL_THREE_UPLOADED_LECTURE_COUNT =
  new Set(uploadedLectureFiles.map(([, path]) => path)).size;

export const levelThreeLectures: Record<string, LevelOneLecture> = {
  ...Object.fromEntries(uploadedLectureFiles.map(([projectId, relativePath]) => [
    projectId,
    {
      projectId,
      url: "/Level%203/Learning/" + relativePath.split("/").map(encodeURIComponent).join("/"),
      // Preserve the current presentation-only projects' unavailable Building mode.
      learningOnly: pdfActivityManuals[projectId]?.sourceKind === "powerpoint",
    },
  ])),
  ...Object.fromEntries(LEVEL_THREE_BUILDING_PDF_LEARNING_FALLBACK_IDS.map(projectId => {
    const manual = pdfActivityManuals[projectId];
    if (!manual || manual.sourceKind === "powerpoint") {
      throw new Error("Missing verified Level 3 Building PDF: " + projectId);
    }
    return [projectId, {
      projectId,
      url: manual.url,
      learningOnly: false,
    }];
  })),
};

export const getLevelThreeLecture = (projectId: string): LevelOneLecture | undefined =>
  levelThreeLectures[projectId];
