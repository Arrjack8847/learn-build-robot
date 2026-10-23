import { pdfActivityManuals } from "./pdfActivityManuals";
import type { LevelOneLecture } from "./levelOneLectures";

/** Verified Level 2 lecture PDFs in public/Level 2/Learning.
 * Some projects only have a Building PDF; Learning reuses that exact
 * existing URL without copying the file or changing Building Studio.
 */
const uploadedLectureFiles = [
  ["level-2-axe-robot", "Action-Oriented/Axe robot/Axe robot_Powerpoint.pdf"],
  ["level-2-batting-robot", "Action-Oriented/Batting robot/Batting robot_Powerpoint.pdf"],
  ["level-2-fan-robot", "Action-Oriented/Fan robot/Fan robot_Powerpoint.pdf"],
  ["level-2-pirate-ship", "Action-Oriented/Pirate ship/Pirate ship__Powerpoint.pdf"],
  ["level-2-push-ups", "Action-Oriented/Push ups/Push ups_Powerpoint.pdf"],
  ["level-2-rotating-flying-chair", "Action-Oriented/Rotating flying chair/Rotating flying chair_Powerpoint.pdf"],
  ["level-2-throwing-robot", "Action-Oriented/Throwing robot/Throwing robot_Powerpoint.pdf"],
  ["level-2-bee", "Biomimicry/Bee.pdf"],
  ["level-2-chimpanzees", "Biomimicry/Chimpanzees.pdf"],
  ["level-2-mechanical-dog", "Characters & Structures/Mechanical dog/Mechanical dog_PowerPoint-R.pdf"],
  ["level-2-scaling-ladder", "Characters & Structures/Scaling ladder/Scaling ladder_PowerPoint -R.pdf"],
  ["level-2-tower-crane", "Characters & Structures/Tower crane/Tower crane_Powerpoint.pdf"],
  ["level-2-hammer-robot", "Foundational Robots/Hammer robot.pdf"],
  ["level-2-lucky-turntable", "Foundational Robots/Lucky turntable.pdf"],
  ["level-2-the-treadmill", "Foundational Robots/The treadmill.pdf"],
  ["level-2-tightrope-walk", "Foundational Robots/Tightrope walk.pdf"],
  ["level-2-manual-flashlight", "Illumination & Signals/Manual Flashlight/Flashlight_Powerpoint.pdf"],
  ["level-2-jumping-machine", "Interactive Mechanisms/Jumping machine/Jumping machine_Powerpoint.pdf"],
  ["level-2-see-saw-v1", "Interactive Systems/See Saw/Balance_PowerPoint-R.pdf"],
  ["level-2-see-saw-v2", "Interactive Systems/See Saw/Balance_PowerPoint-R.pdf"],
  ["level-2-tongs", "Interactive Systems/Tongs/Pliers_PowerPoint -R .pdf"],
  ["level-2-automatic-window", "Machines & Mechanisms/Automatic window.pdf"],
  ["level-2-robot-war", "Machines & Mechanisms/Robot war.pdf"],
  ["level-2-car-steering", "Manipulators/Car Steering.pdf"],
  ["level-2-cliff-walk", "Manipulators/Cliff walk.pdf"],
  ["level-2-ferris-wheel", "Manipulators/Ferris wheel.pdf"],
  ["level-2-round-trip-transportation", "Manipulators/Round-trip transportation.pdf"],
  ["level-2-shift-gears", "Manipulators/Shift gears.pdf"],
  ["level-2-bridge", "Mechanisms & Simulators/Bridge/Bridge_Powerpoint.pdf"],
  ["level-2-mechanisms-simulators-crane", "Mechanisms & Simulators/Crane/Crane_Powerpoint.pdf"],
  ["level-2-door", "Mechanisms & Simulators/Door/Door_Powerpoint.pdf"],
  ["level-2-double-beam-crane", "Mechanisms & Simulators/Double Beam Crane/Double beam crane_Building_Powerpoint.pdf"],
  ["level-2-gearbox", "Mechanisms & Simulators/Gearbox/Gearbox_Powerpoint.pdf"],
  ["level-2-hand-crank", "Mechanisms & Simulators/Hand crank/Hand crank_Powerpoint.pdf"],
  ["level-2-spinning-bike", "Mechanisms & Simulators/Spinning bike/Spinning bike_Powerpoint.pdf"],
  ["level-2-swing", "Mechanisms & Simulators/Swing/Swing_powerpoint.pdf"],
  ["level-2-treadmill", "Mechanisms & Simulators/Treadmill/Treadmill_Powerpoint.pdf"],
  ["level-2-animal-trap", "Mechanisms and Concepts/Animal trap.pdf"],
  ["level-2-headlights", "Mechanisms and Concepts/Headlights.pdf"],
  ["level-2-battery-robot", "Programming & Precise Control/Battery robot/Battery robot_Powerpoint.pdf"],
  ["level-2-walking-robot", "Sensor-Focused Robots/Walking robot/Walking robot_PowerPoint -R.pdf"],
  ["level-2-harp", "Sound & Voice Interaction/Harp/Harp_Powerpoint.pdf"],
  ["level-2-helicopter", "Vehicles & Complex Movers/Helicopter/Helicopter_Powerpoint.pdf"],
  ["level-2-lifting-door", "Vehicles & Complex Movers/Lifting door/Lifting door_Powerpoint.pdf"],
  ["level-2-teeterboard", "Vehicles & Complex Movers/Teeterboard/13.Teeterboard_PowerPoint.pdf"],
] as const;

/** These 15 Level 2 projects have no separate uploaded lecture PDF. */
export const LEVEL_TWO_BUILDING_PDF_LEARNING_FALLBACK_IDS = [
  "level-2-crane",
  "level-2-fare-gate",
  "level-2-forklift",
  "level-2-dung-beetle",
  "level-2-mobile-shot",
  "level-2-rolling-shutter",
  "level-2-track-rickshaw",
  "level-2-led-scrolling-screen",
  "level-2-led-signboard",
  "level-2-four-wheel-drive",
  "level-2-pedal-waterwheel",
  "level-2-tank",
  "level-2-reverse-parking",
  "level-2-smart-window",
  "level-2-spirograph",
] as const;

export const LEVEL_TWO_UPLOADED_LECTURE_COUNT =
  new Set(uploadedLectureFiles.map(([, path]) => path)).size;

export const levelTwoLectures: Record<string, LevelOneLecture> = {
  ...Object.fromEntries(uploadedLectureFiles.map(([projectId, relativePath]) => [
    projectId,
    {
      projectId,
      url: "/Level%202/Learning/" + relativePath.split("/").map(encodeURIComponent).join("/"),
      learningOnly: false,
    },
  ])),
  ...Object.fromEntries(LEVEL_TWO_BUILDING_PDF_LEARNING_FALLBACK_IDS.map(projectId => {
    const manual = pdfActivityManuals[projectId];
    if (!manual || manual.sourceKind === "powerpoint") {
      throw new Error("Missing verified Level 2 Building PDF: " + projectId);
    }
    return [projectId, {
      projectId,
      url: manual.url,
      learningOnly: false,
    }];
  })),
};

export const getLevelTwoLecture = (projectId: string): LevelOneLecture | undefined =>
  levelTwoLectures[projectId];
