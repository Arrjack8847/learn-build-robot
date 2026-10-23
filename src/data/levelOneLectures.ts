/** Level 1 lecture PDFs under public/Level 1/Learning (45 original presentations). */
export type LevelOneLecture = {
  projectId: string;
  url: string;
  /** The syllabus contains slides only, not a separately verified building manual. */
  learningOnly: boolean;
};

const lectureFiles = [
  ["acceleration-car", "Autonomous Navigation & Ranging/Acceleration car/Acceleration car_Powerpoint.pdf"],
  ["ferocious-snake", "Biomimicry/Ferocious snake.pdf"],
  ["funny-cat", "Biomimicry/Funny cat.pdf"],
  ["shy-penguin", "Biomimicry/Shy penguin.pdf"],
  ["sled-dog", "Biomimicry/Sled dog.pdf"],
  ["big-head-robot", "Characters & Structures/Big head robot/Big head robot_Powerpoint.pdf"],
  ["bird", "Characters & Structures/Bird/Bird_PowerPoint-R.pdf"],
  ["first-robot-model", "Characters & Structures/First Robot Model/First Robot Model.pdf"],
  ["house", "Characters & Structures/House/House_Powerpoint.pdf"],
  ["rex-robot", "Characters & Structures/REX robot/REX robot_PowerPoint-R.pdf"],
  ["sled", "Characters & Structures/Sled/Sled_Powerpoint.pdf"],
  ["spider", "Characters & Structures/Spider/Spider_PowerPoint- R.pdf"],
  ["spongebob", "Characters & Structures/SpongeBob/SpongeBob_Powerpoint.pdf"],
  ["wali-robot", "Characters & Structures/Wali robot/Wali robot_PowerPoint-R.pdf"],
  ["clock", "Display & Movement/Clock/Clock_Powerpoint.pdf"],
  ["drawing-board", "Display & Movement/Drawing board/Drawing board_Powerpoint.pdf"],
  ["hello-world", "Display & Movement/Hello World/01.Hello World-Slides.pdf"],
  ["mechanical-masks", "Display & Movement/Mechanical masks/Mechanical masks_PowerPoint-R.pdf"],
  ["primitive-robot", "Display & Movement/Primitive robot/Primitive robot_PowerPoint-.pdf"],
  ["athlete", "Foundational Robots/Athlete.pdf"],
  ["basic-programming", "Foundational Robots/Basic programming.pdf"],
  ["drummer-robot", "Foundational Robots/Drummer robot.pdf"],
  ["sailboat", "Foundational Robots/Sailboat.pdf"],
  ["the-lawn-mower", "Foundational Robots/The lawn mower.pdf"],
  ["blinking-robot", "Illumination & Signals/Blinking robot/Blinking robot_Powerpoint.pdf"],
  ["color-changing-light", "Illumination & Signals/Color-changing Light/02.Color- changing Light -Slides.pdf"],
  ["corridor-lamp", "Illumination & Signals/Corridor lamp/Corridor lamp_Powerpoint.pdf"],
  ["help-light", "Illumination & Signals/Help light/Help light_Powerpoint.pdf"],
  ["lighthouse", "Illumination & Signals/Lighthouse/Lighthouse_Powerpoint.pdf"],
  ["little-stars", "Illumination & Signals/Little stars/Little stars_Powerpoint.pdf"],
  ["traffic-light-signal", "Illumination & Signals/Traffic light Signal/Traffic light_Powerpoint.pdf"],
  ["dart", "Interactive Systems/Dart/Dart_PowerPoint-R.pdf"],
  ["responder", "Interactive Systems/Responder/Responder_Powerpoint.pdf"],
  ["car", "Manipulators/Car.pdf"],
  ["dynamic-screen", "Manipulators/Dynamic screen.pdf"],
  ["pendulum-ride", "Manipulators/Pendulum ride.pdf"],
  ["rotating-flying-chair", "Manipulators/Rotating flying chair.pdf"],
  ["skating", "Manipulators/Skating.pdf"],
  ["the-windmill-kingdom", "Manipulators/The windmill kingdom.pdf"],
  ["crawl-slowly-basic", "Mechanisms & Simulators/Crawl Slowly/9. Crawl Slowly - Slides.pdf"],
  ["crawl-slowly-optimized", "Mechanisms & Simulators/Crawl Slowly/9. Crawl Slowly - Slides.pdf"],
  ["mechanical-arm", "Mechanisms & Simulators/Mechanical arm/Mechanical arm_PowerPoint-R.pdf"],
  ["shock-absorber", "Mechanisms & Simulators/Shock absorber/Shock absorber_Powerpoint.pdf"],
  ["gyro-transmitter", "Sensor-Focused Robots/Gyro transmitter/Gyro transmitter_Powerpoint.pdf"],
  ["motorcycle", "Vehicles & Complex Movers/Motorcycle/Motorcycle_Powerpoint.pdf"],
  ["pull-back-car", "Vehicles & Complex Movers/Pull back car/Pull back car_Powerpoint.pdf"],
] as const;

const learningOnlyIds = new Set<string>([
  "ferocious-snake",
  "funny-cat",
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
]);

export const LEVEL_ONE_LECTURE_COUNT = new Set(lectureFiles.map(([, path]) => path)).size;
export const levelOneLectures: Record<string, LevelOneLecture> = Object.fromEntries(
  lectureFiles.map(([projectId, relativePath]) => [
    projectId,
    {
      projectId,
      url: "/Level%201/Learning/" + relativePath.split("/").map(encodeURIComponent).join("/"),
      learningOnly: learningOnlyIds.has(projectId),
    },
  ]),
);
export const getLevelOneLecture = (projectId: string): LevelOneLecture | undefined => levelOneLectures[projectId];
