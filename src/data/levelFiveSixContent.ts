/** Verified Level 5 and Level 6 syllabus-to-asset inventory.
 * Generated from the uploaded repository paths. Source files are not modified.
 * Level 5–6 PDFs use individually verified Wix URLs; other levels retain their original resolution.
 */
import type { PdfActivityManual } from "./pdfActivityManuals";
import { levelSixWixPdfUrls } from "./levelSixWixPdfUrls";
import { levelFiveWixPdfUrls } from "./levelFiveWixPdfUrls";
import type { LevelOneLecture } from "./levelOneLectures";

export type AdvancedLessonLevel = 5 | 6;
export interface AdvancedLessonAsset {
  id: string;
  level: AdvancedLessonLevel;
  title: string;
  categoryId: string;
  /** Path relative to public/ (or to public/ on the configured asset host). */
  learningPdf: string;
  buildingBasic: string | null;
  buildingOptimized: string | null;
  /** Repository paths below curriculum-source/. */
  programs: readonly string[];
  videos: readonly string[];
}

export interface AdvancedDownload {
  fileName: string;
  url: string;
}
export interface AdvancedDemoVideo {
  fileName: string;
  url: string;
}

/** The syllabus contains 94 distinct project lessons. */
export const levelFiveSixLessons: readonly AdvancedLessonAsset[] = [
  {
    "id": "level-5-curling-game",
    "level": 5,
    "title": "Curling Game",
    "categoryId": "action-oriented",
    "learningPdf": "Level 5/Learning/Action-Oriented/Curling Game/2. Curling Game - Slides.pdf",
    "buildingBasic": "Level 5/Building/Action-Oriented/Curling Game/2. Curling Game-Basic Building Manual.pdf",
    "buildingOptimized": "Level 5/Building/Action-Oriented/Curling Game/2. Curling Game-Optimized Building Manual.pdf",
    "programs": [
      "Level 5/Action-Oriented/Curling Game/Lesson2_basic_program.sb3",
      "Level 5/Action-Oriented/Curling Game/Lesson2_optimized_program.sb3",
      "Level 5/Action-Oriented/Curling Game/Lesson2_testing_program.sb3"
    ],
    "videos": []
  },
  {
    "id": "level-5-drawing-machine",
    "level": 5,
    "title": "Drawing Machine",
    "categoryId": "action-oriented",
    "learningPdf": "Level 5/Learning/Action-Oriented/Drawing Machine/23. Drawing Machine-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Action-Oriented/Drawing Machine/23. Drawing Machine-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Action-Oriented/Drawing Machine/Program Example/Lesson23Program.sb3"
    ],
    "videos": [
      "Level 5/Action-Oriented/Drawing Machine/23. Drawing Machine-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-firefly",
    "level": 5,
    "title": "Firefly",
    "categoryId": "action-oriented",
    "learningPdf": "Level 5/Learning/Action-Oriented/Firefly/02.Firefly-Slides.pdf",
    "buildingBasic": "Level 5/Building/Action-Oriented/Firefly/02.Firefly-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Action-Oriented/Firefly/Program Example/L4_02_basic_program.sb3",
      "Level 5/Action-Oriented/Firefly/Program Example/L4_02_expansion_program.sb3"
    ],
    "videos": [
      "Level 5/Action-Oriented/Firefly/02.Firefly-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-goalkeeper",
    "level": 5,
    "title": "Goalkeeper",
    "categoryId": "action-oriented",
    "learningPdf": "Level 5/Learning/Action-Oriented/Goalkeeper/23.Goalkeeper-Slides.pdf",
    "buildingBasic": "Level 5/Building/Action-Oriented/Goalkeeper/23.Goalkeeper-Building Manual（with rubber band）.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Action-Oriented/Goalkeeper/Program Example/L4_23_program.sb3"
    ],
    "videos": [
      "Level 5/Action-Oriented/Goalkeeper/23.Goalkeeper-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-spanish-bullfight",
    "level": 5,
    "title": "Spanish Bullfight",
    "categoryId": "action-oriented",
    "learningPdf": "Level 5/Learning/Action-Oriented/Spanish Bullfight/03.Spanish Bullfight-Slides.pdf",
    "buildingBasic": "Level 5/Building/Action-Oriented/Spanish Bullfight/03.Spanish Bullfight-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Action-Oriented/Spanish Bullfight/Program Example/L4_03_basic_program.sb3",
      "Level 5/Action-Oriented/Spanish Bullfight/Program Example/L4_03_expansion_program.sb3"
    ],
    "videos": [
      "Level 5/Action-Oriented/Spanish Bullfight/03.Spanish Bullfight-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-the-warrior",
    "level": 5,
    "title": "The Warrior",
    "categoryId": "action-oriented",
    "learningPdf": "Level 5/Learning/Action-Oriented/The Warrior/22. The Warrior-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Action-Oriented/The Warrior/22. The Warrior-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Action-Oriented/The Warrior/Program Example/Lesson22Program.sb3"
    ],
    "videos": [
      "Level 5/Action-Oriented/The Warrior/22. The Warrior-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-super-trajectory-robot-3",
    "level": 5,
    "title": "Super Trajectory Robot 3",
    "categoryId": "advanced-navigation-control",
    "learningPdf": "Level 5/Learning/Advanced Navigation & Control/Super Trajectory Robot 3/15.Super Trajectory Robot 3.pdf",
    "buildingBasic": null,
    "buildingOptimized": null,
    "programs": [],
    "videos": []
  },
  {
    "id": "level-5-super-trajectory-robot-4",
    "level": 5,
    "title": "Super Trajectory Robot 4",
    "categoryId": "advanced-navigation-control",
    "learningPdf": "Level 5/Learning/Advanced Navigation & Control/Super Trajectory Robot 4/16. Super Trajectory Robot 4.pdf",
    "buildingBasic": null,
    "buildingOptimized": null,
    "programs": [],
    "videos": []
  },
  {
    "id": "level-5-tracking-car",
    "level": 5,
    "title": "Tracking car",
    "categoryId": "advanced-navigation-control",
    "learningPdf": "Level 5/Learning/Advanced Navigation & Control/Tracking car/11.Tracking car-update.pdf",
    "buildingBasic": null,
    "buildingOptimized": null,
    "programs": [
      "Level 5/Advanced Navigation & Control/Tracking car/11.Tracking car-program example.sb2"
    ],
    "videos": []
  },
  {
    "id": "level-5-face-tracking",
    "level": 5,
    "title": "Face tracking",
    "categoryId": "automation-security",
    "learningPdf": "Level 5/Learning/Automation & Security/Face tracking/07. Face tracking.pdf",
    "buildingBasic": null,
    "buildingOptimized": null,
    "programs": [
      "Level 5/Automation & Security/Face tracking/07. Face tracking.sb3"
    ],
    "videos": []
  },
  {
    "id": "level-5-magnetic-anti-theft-cabinet",
    "level": 5,
    "title": "Magnetic Anti-theft Cabinet",
    "categoryId": "automation-security",
    "learningPdf": "Level 5/Learning/Automation & Security/Magnetic Anti-theft Cabinet/08. Magnetic Anti-theft Cabinet_Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Automation & Security/Magnetic Anti-theft Cabinet/08. Magnetic Anti-theft Cabinet_Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Automation & Security/Magnetic Anti-theft Cabinet/Program Example/Lesson 8_Program Example.sb3"
    ],
    "videos": [
      "Level 5/Automation & Security/Magnetic Anti-theft Cabinet/08.磁敏防盗柜-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-please-scan-to-ride",
    "level": 5,
    "title": "Please Scan to Ride",
    "categoryId": "automation-security",
    "learningPdf": "Level 5/Learning/Automation & Security/Please Scan to Ride/03.Please Scan to Ride-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Automation & Security/Please Scan to Ride/03.Please Scan to Ride-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Automation & Security/Please Scan to Ride/Program Example/Lesson3Program.sb3"
    ],
    "videos": [
      "Level 5/Automation & Security/Please Scan to Ride/03.Please Scan to Ride-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-smart-cash-register",
    "level": 5,
    "title": "Smart Cash Register",
    "categoryId": "automation-security",
    "learningPdf": "Level 5/Learning/Automation & Security/Smart Cash Register/02.Smart Cash Register-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Automation & Security/Smart Cash Register/02.Smart Cash Register-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Automation & Security/Smart Cash Register/Program Example/Lesson2Program.sb3"
    ],
    "videos": [
      "Level 5/Automation & Security/Smart Cash Register/02.Smart Cash Register-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-autonomous-driving",
    "level": 5,
    "title": "Autonomous driving",
    "categoryId": "autonomous-navigation-ranging",
    "learningPdf": "Level 5/Learning/Autonomous Navigation & Ranging/Autonomous driving/03. Autonomous Driving.pdf",
    "buildingBasic": null,
    "buildingOptimized": null,
    "programs": [
      "Level 5/Autonomous Navigation & Ranging/Autonomous driving/3. Autonomous Driving.sb3"
    ],
    "videos": []
  },
  {
    "id": "level-5-smart-guiding-car",
    "level": 5,
    "title": "Smart Guiding Car",
    "categoryId": "autonomous-navigation-ranging",
    "learningPdf": "Level 5/Learning/Autonomous Navigation & Ranging/Smart Guiding Car/02. Smart Guiding Car - Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Autonomous Navigation & Ranging/Smart Guiding Car/02. Smart Guiding Car -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Autonomous Navigation & Ranging/Smart Guiding Car/Program Example/Lesson 2 - Program Example.sb3"
    ],
    "videos": [
      "Level 5/Autonomous Navigation & Ranging/Smart Guiding Car/02. Smart Guiding Car -Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-lucky-prize-wheel",
    "level": 5,
    "title": "Lucky Prize Wheel",
    "categoryId": "characters-structures",
    "learningPdf": "Level 5/Learning/Characters & Structures/Lucky Prize Wheel/21. Lucky Prize Wheel -Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Characters & Structures/Lucky Prize Wheel/21. Lucky Prize Wheel-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Characters & Structures/Lucky Prize Wheel/Program Example/Lesson 21-Program Example.sb3"
    ],
    "videos": [
      "Level 5/Characters & Structures/Lucky Prize Wheel/21. Lucky Prize Wheel-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-oil-pumping-unit",
    "level": 5,
    "title": "Oil Pumping Unit",
    "categoryId": "characters-structures",
    "learningPdf": "Level 5/Learning/Characters & Structures/Oil Pumping Unit/21. Oil Pumping Unit -Slides.pdf",
    "buildingBasic": "Level 5/Building/Characters & Structures/Oil Pumping Unit/21.Oil Pumping Unit-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Characters & Structures/Oil Pumping Unit/Program Example/L3_21_basic_program.sb3",
      "Level 5/Characters & Structures/Oil Pumping Unit/Program Example/L3_21_expansion_program.sb3"
    ],
    "videos": [
      "Level 5/Characters & Structures/Oil Pumping Unit/21.Oil Pumping Unit-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-swinging-shark",
    "level": 5,
    "title": "Swinging Shark",
    "categoryId": "characters-structures",
    "learningPdf": "Level 5/Learning/Characters & Structures/Swinging Shark/03. Swinging Shark - Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Characters & Structures/Swinging Shark/03. Swinging Shark - Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Characters & Structures/Swinging Shark/Program Example/03. Swinging Shark-program.sb3"
    ],
    "videos": [
      "Level 5/Characters & Structures/Swinging Shark/03. Swinging Shark -Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-music-box",
    "level": 5,
    "title": "Music box",
    "categoryId": "complex-mechanisms-coordinated-motion",
    "learningPdf": "Level 5/Learning/Complex Mechanisms & Coordinated Motion/Music box/Music box-update.pdf",
    "buildingBasic": null,
    "buildingOptimized": null,
    "programs": [],
    "videos": []
  },
  {
    "id": "level-5-remote-control-car",
    "level": 5,
    "title": "Remote Control Car",
    "categoryId": "display-movement",
    "learningPdf": "Level 5/Learning/Display & Movement/Remote Control Car/12.Remote Control Car-Slides.pdf",
    "buildingBasic": "Level 5/Building/Display & Movement/Remote Control Car/12.Remote Control Car-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Display & Movement/Remote Control Car/Program Example/car_basic_program.sb3",
      "Level 5/Display & Movement/Remote Control Car/Program Example/car_expansion_program.sb3",
      "Level 5/Display & Movement/Remote Control Car/Program Example/remote_controller_basic_program.sb3",
      "Level 5/Display & Movement/Remote Control Car/Program Example/remote_controller_expansion_program.sb3"
    ],
    "videos": [
      "Level 5/Display & Movement/Remote Control Car/12.Remote Control Car-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-runner",
    "level": 5,
    "title": "Runner",
    "categoryId": "display-movement",
    "learningPdf": "Level 5/Learning/Display & Movement/Runner/25.Runner -Slides.pdf",
    "buildingBasic": "Level 5/Building/Display & Movement/Runner/25.Runner -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Display & Movement/Runner/Program Example/L3_25_basic_program.sb3",
      "Level 5/Display & Movement/Runner/Program Example/L3_25_expansion_program.sb3"
    ],
    "videos": [
      "Level 5/Display & Movement/Runner/25.Runner -Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-welcome-sign",
    "level": 5,
    "title": "Welcome Sign",
    "categoryId": "display-movement",
    "learningPdf": "Level 5/Learning/Display & Movement/Welcome Sign/08. Welcome Sign-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Display & Movement/Welcome Sign/08. Welcome Sign-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Display & Movement/Welcome Sign/Program Example/Lesson8Program.sb3"
    ],
    "videos": [
      "Level 5/Display & Movement/Welcome Sign/08. Welcome Sign-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-car-lights",
    "level": 5,
    "title": "Car Lights",
    "categoryId": "illumination-signals",
    "learningPdf": "Level 5/Learning/Illumination & Signals/Car Lights/11. Car Lights-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Illumination & Signals/Car Lights/11. Car Lights-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Illumination & Signals/Car Lights/Program Example/Lesson11Program.sb3"
    ],
    "videos": [
      "Level 5/Illumination & Signals/Car Lights/11. Car Lights-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-direction-indicator",
    "level": 5,
    "title": "Direction Indicator",
    "categoryId": "illumination-signals",
    "learningPdf": "Level 5/Learning/Illumination & Signals/Direction Indicator/06.Direction Indicator-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Illumination & Signals/Direction Indicator/06.Direction Indicator-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Illumination & Signals/Direction Indicator/Program Example/Lesson6Program.sb3"
    ],
    "videos": [
      "Level 5/Illumination & Signals/Direction Indicator/06.Direction Indicator-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-magnetic-object-finder",
    "level": 5,
    "title": "Magnetic Object Finder",
    "categoryId": "interactive-mechanisms",
    "learningPdf": "Level 5/Learning/Interactive Mechanisms/Magnetic Object Finder/07. Magnetic Object Finder-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Interactive Mechanisms/Magnetic Object Finder/07. Magnetic Object Finder-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Interactive Mechanisms/Magnetic Object Finder/Program Example/Lesson 7_Program Example.sb3"
    ],
    "videos": [
      "Level 5/Interactive Mechanisms/Magnetic Object Finder/07. Magnetic Object Finder-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-passenger-counter",
    "level": 5,
    "title": "Passenger Counter",
    "categoryId": "interactive-mechanisms",
    "learningPdf": "Level 5/Learning/Interactive Mechanisms/Passenger Counter/14.Passenger Counter-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Interactive Mechanisms/Passenger Counter/14.Passenger Counter-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Interactive Mechanisms/Passenger Counter/Program Example/lesson 14.sb3"
    ],
    "videos": [
      "Level 5/Interactive Mechanisms/Passenger Counter/Building Manual-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-big-pendulum",
    "level": 5,
    "title": "Big Pendulum",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 5/Learning/Mechanisms & Simulators/Big Pendulum/26. The Big Pendulum-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Mechanisms & Simulators/Big Pendulum/26. The Big Pendulum-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Mechanisms & Simulators/Big Pendulum/Program Example/Lesson26Program.sb3"
    ],
    "videos": [
      "Level 5/Mechanisms & Simulators/Big Pendulum/26. The Big Pendulum-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-chairoplane",
    "level": 5,
    "title": "Chairoplane",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 5/Learning/Mechanisms & Simulators/Chairoplane/27. Chairoplane-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Mechanisms & Simulators/Chairoplane/27. Chairoplane-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Mechanisms & Simulators/Chairoplane/Program Example/Lesson27Program.sb3"
    ],
    "videos": [
      "Level 5/Mechanisms & Simulators/Chairoplane/27. Chairoplane-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-crack-shot",
    "level": 5,
    "title": "Crack Shot",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 5/Learning/Mechanisms & Simulators/Crack Shot/6. Crack Shot -Slides.pdf",
    "buildingBasic": "Level 5/Building/Mechanisms & Simulators/Crack Shot/6. Crack Shot - Basic Building Manual.pdf",
    "buildingOptimized": "Level 5/Building/Mechanisms & Simulators/Crack Shot/6. Crack Shot - Optimized Building Manual.pdf",
    "programs": [
      "Level 5/Mechanisms & Simulators/Crack Shot/Lesson6_basic_program.sb3",
      "Level 5/Mechanisms & Simulators/Crack Shot/Lesson6_optimized_program.sb3"
    ],
    "videos": []
  },
  {
    "id": "level-5-kiddie-ride",
    "level": 5,
    "title": "Kiddie Ride",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 5/Learning/Mechanisms & Simulators/Kiddie Ride/16. Kiddie Ride-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Mechanisms & Simulators/Kiddie Ride/16. Kiddie Ride-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Mechanisms & Simulators/Kiddie Ride/Program Example/Lesson16Program.sb3"
    ],
    "videos": [
      "Level 5/Mechanisms & Simulators/Kiddie Ride/16. Kiddie Ride-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-machine-gun",
    "level": 5,
    "title": "Machine Gun",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 5/Learning/Mechanisms & Simulators/Machine Gun/10.Machine Gun-Slides.pdf",
    "buildingBasic": "Level 5/Building/Mechanisms & Simulators/Machine Gun/10.Machine Gun-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Mechanisms & Simulators/Machine Gun/Program Example/L4_10_basic_program.sb3",
      "Level 5/Mechanisms & Simulators/Machine Gun/Program Example/L4_10_expansion_program.sb3"
    ],
    "videos": [
      "Level 5/Mechanisms & Simulators/Machine Gun/10.Machine Gun-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-revolving-door",
    "level": 5,
    "title": "Revolving Door",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 5/Learning/Mechanisms & Simulators/Revolving Door/15. Revolving Door-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Mechanisms & Simulators/Revolving Door/15. Revolving Door-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Mechanisms & Simulators/Revolving Door/Program Example/Lesson 15-Program Example.sb3"
    ],
    "videos": [
      "Level 5/Mechanisms & Simulators/Revolving Door/15. Revolving Door-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-smart-turnstile",
    "level": 5,
    "title": "Smart Turnstile",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 5/Learning/Mechanisms & Simulators/Smart Turnstile/21.Smart Turnstile-Slides.pdf",
    "buildingBasic": "Level 5/Building/Mechanisms & Simulators/Smart Turnstile/21.Smart Turnstile-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Mechanisms & Simulators/Smart Turnstile/Program Example/L4_21_program.sb3"
    ],
    "videos": [
      "Level 5/Mechanisms & Simulators/Smart Turnstile/21.Smart Turnstile-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-top-scorer",
    "level": 5,
    "title": "Top Scorer",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 5/Learning/Mechanisms & Simulators/Top Scorer/8. Top Scorer -Slides.pdf",
    "buildingBasic": "Level 5/Building/Mechanisms & Simulators/Top Scorer/8. Top Scorer - Basic Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Mechanisms & Simulators/Top Scorer/Lesson8_basic_program.sb3",
      "Level 5/Mechanisms & Simulators/Top Scorer/Lesson8_optimized_program.sb3"
    ],
    "videos": []
  },
  {
    "id": "level-5-clothes-dryer",
    "level": 5,
    "title": "Clothes Dryer",
    "categoryId": "programming-precise-control",
    "learningPdf": "Level 5/Learning/Programming & Precise Control/Clothes Dryer/30. Clothes Dryer-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Programming & Precise Control/Clothes Dryer/30. Clothes Dryer-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Programming & Precise Control/Clothes Dryer/Program Example/Lesson 30-Program Example.sb3"
    ],
    "videos": [
      "Level 5/Programming & Precise Control/Clothes Dryer/30. Clothes Dryer-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-remote-control-fan",
    "level": 5,
    "title": "Remote Control Fan",
    "categoryId": "programming-precise-control",
    "learningPdf": "Level 5/Learning/Programming & Precise Control/Remote Control Fan/26. Remote Control Fan-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Programming & Precise Control/Remote Control Fan/26. Remote Control Fan -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Programming & Precise Control/Remote Control Fan/Program Example/26 fan -program.sb3",
      "Level 5/Programming & Precise Control/Remote Control Fan/Program Example/26 fan- remote control -program.sb3"
    ],
    "videos": [
      "Level 5/Programming & Precise Control/Remote Control Fan/26. Remote Control Fan-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-rescue-robot",
    "level": 5,
    "title": "Rescue Robot",
    "categoryId": "programming-precise-control",
    "learningPdf": "Level 5/Learning/Programming & Precise Control/Rescue Robot/17.Rescue Robot -Slides.pdf",
    "buildingBasic": "Level 5/Building/Programming & Precise Control/Rescue Robot/17.Rescue Robot -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Programming & Precise Control/Rescue Robot/Program Example/L4_17_program.sb3"
    ],
    "videos": [
      "Level 5/Programming & Precise Control/Rescue Robot/17.Rescue Robot -Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-traffic-signs",
    "level": 5,
    "title": "Traffic signs",
    "categoryId": "programming-precise-control",
    "learningPdf": "Level 5/Learning/Programming & Precise Control/Traffic signs/05.traffic signs.pdf",
    "buildingBasic": null,
    "buildingOptimized": null,
    "programs": [
      "Level 5/Programming & Precise Control/Traffic signs/05.traffic signs.sb3"
    ],
    "videos": []
  },
  {
    "id": "level-5-barometric-sensor",
    "level": 5,
    "title": "Barometric Sensor",
    "categoryId": "sensor-automation",
    "learningPdf": "Level 5/Learning/Sensor Automation/Barometric Sensor/17.Barometric Pressure Meter-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Sensor Automation/Barometric Sensor/17.Barometric Pressure Meter-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Sensor Automation/Barometric Sensor/Program Example/Lesson 17-Program Example.sb3"
    ],
    "videos": [
      "Level 5/Sensor Automation/Barometric Sensor/17.Barometric Pressure Meter-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-car-speed-detector",
    "level": 5,
    "title": "Car Speed Detector",
    "categoryId": "sensor-focused-robots",
    "learningPdf": "Level 5/Learning/Sensor-Focused Robots/Car Speed Detector/11. Car Speed Detector-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Sensor-Focused Robots/Car Speed Detector/11. Car Speed Detector-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Sensor-Focused Robots/Car Speed Detector/Program Example/Lesson11-Program Example.sb3"
    ],
    "videos": [
      "Level 5/Sensor-Focused Robots/Car Speed Detector/11. Car Speed Detector-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-facial-recognition-time-clock",
    "level": 5,
    "title": "Facial Recognition Time Clock",
    "categoryId": "sensor-focused-robots",
    "learningPdf": "Level 5/Learning/Sensor-Focused Robots/Facial Recognition Time Clock/28.Facial Recognition Time Clock-Slides.pdf",
    "buildingBasic": "Level 5/Building/Sensor-Focused Robots/Facial Recognition Time Clock/28.Facial Recognition Time Clock-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Sensor-Focused Robots/Facial Recognition Time Clock/Program Example/L4_28_program.sb3"
    ],
    "videos": [
      "Level 5/Sensor-Focused Robots/Facial Recognition Time Clock/28.Facial Recognition Time Clock-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-traffic-robot",
    "level": 5,
    "title": "Traffic Robot",
    "categoryId": "sensor-focused-robots",
    "learningPdf": "Level 5/Learning/Sensor-Focused Robots/Traffic Robot/20.Traffic Robot-Slides.pdf",
    "buildingBasic": "Level 5/Building/Sensor-Focused Robots/Traffic Robot/20.Traffic Robot-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Sensor-Focused Robots/Traffic Robot/Program Example/L4_20_program.sb3"
    ],
    "videos": [
      "Level 5/Sensor-Focused Robots/Traffic Robot/20.Traffic Robot-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-swing-with-rhythm",
    "level": 5,
    "title": "Swing With Rhythm",
    "categoryId": "sound-voice-interaction",
    "learningPdf": "Level 5/Learning/Sound & Voice Interaction/Swing With Rhythm/24. Swing With Rhythm-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Sound & Voice Interaction/Swing With Rhythm/24. Swing With Rhythm-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Sound & Voice Interaction/Swing With Rhythm/Program Example/Lesson 24-Program Example.sb3"
    ],
    "videos": [
      "Level 5/Sound & Voice Interaction/Swing With Rhythm/24. Swing With Rhythm-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-voice-control-snail",
    "level": 5,
    "title": "Voice control snail",
    "categoryId": "sound-voice-interaction",
    "learningPdf": "Level 5/Learning/Sound & Voice Interaction/Voice control snail/Voice control snail_Powerpoint.pdf",
    "buildingBasic": "Level 5/Building/Sound & Voice Interaction/Voice control snail/08.Voice control snail-building.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Sound & Voice Interaction/Voice control snail/Voice control snail_Program.sb2"
    ],
    "videos": []
  },
  {
    "id": "level-5-voice-control-vehicle",
    "level": 5,
    "title": "Voice Control Vehicle",
    "categoryId": "sound-voice-interaction",
    "learningPdf": "Level 5/Learning/Sound & Voice Interaction/Voice Control Vehicle/Voice Control Vehicle_Powerpoint-update.pdf",
    "buildingBasic": "Level 5/Building/Sound & Voice Interaction/Voice Control Vehicle/Voice Control Vehicle_Building.pdf",
    "buildingOptimized": null,
    "programs": [],
    "videos": []
  },
  {
    "id": "level-5-hexapod-robot",
    "level": 5,
    "title": "Hexapod Robot",
    "categoryId": "vehicles-complex-movers",
    "learningPdf": "Level 5/Learning/Vehicles & Complex Movers/Hexapod Robot/21. Hexapod Robot-Teaching Slides.pdf",
    "buildingBasic": "Level 5/Building/Vehicles & Complex Movers/Hexapod Robot/21. Hexapod Robot-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Vehicles & Complex Movers/Hexapod Robot/Program Example/Lesson21Program.sb3"
    ],
    "videos": [
      "Level 5/Vehicles & Complex Movers/Hexapod Robot/21. Hexapod Robot-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-light-chasing-car",
    "level": 5,
    "title": "Light Chasing Car",
    "categoryId": "vehicles-complex-movers",
    "learningPdf": "Level 5/Learning/Vehicles & Complex Movers/Light Chasing Car/08.Light Chasing Car -Slides.pdf",
    "buildingBasic": "Level 5/Building/Vehicles & Complex Movers/Light Chasing Car/08.Light Chasing Car -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Vehicles & Complex Movers/Light Chasing Car/Program Example/L4_08_basic_program.sb3",
      "Level 5/Vehicles & Complex Movers/Light Chasing Car/Program Example/L4_08_expansion_program.sb3"
    ],
    "videos": [
      "Level 5/Vehicles & Complex Movers/Light Chasing Car/08.Light Chasing Car -Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-shopping-guide-robot",
    "level": 5,
    "title": "Shopping Guide Robot",
    "categoryId": "vehicles-complex-movers",
    "learningPdf": "Level 5/Learning/Vehicles & Complex Movers/Shopping Guide Robot/14.Shopping Guide Robot-Slides.pdf",
    "buildingBasic": "Level 5/Building/Vehicles & Complex Movers/Shopping Guide Robot/14.Shopping Guide Robot-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Vehicles & Complex Movers/Shopping Guide Robot/Program Example/L4_14_basic_program.sb3",
      "Level 5/Vehicles & Complex Movers/Shopping Guide Robot/Program Example/L4_14_expansion_program.sb3"
    ],
    "videos": [
      "Level 5/Vehicles & Complex Movers/Shopping Guide Robot/14.Shopping Guide Robot-Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-voice-controlled-frog",
    "level": 5,
    "title": "Voice-controlled Frog",
    "categoryId": "vehicles-complex-movers",
    "learningPdf": "Level 5/Learning/Vehicles & Complex Movers/Voice-controlled Frog/07.Voice-controlled Frog_Slides.pdf",
    "buildingBasic": "Level 5/Building/Vehicles & Complex Movers/Voice-controlled Frog/07.Voice-controlled Frog_Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Vehicles & Complex Movers/Voice-controlled Frog/Program Example/L4_07_basic_program.sb3",
      "Level 5/Vehicles & Complex Movers/Voice-controlled Frog/Program Example/L4_07_expansion_program.sb3"
    ],
    "videos": [
      "Level 5/Vehicles & Complex Movers/Voice-controlled Frog/07.Voice-controlled Frog -Demo Video.mp4",
      "Level 5/Vehicles & Complex Movers/Voice-controlled Frog/07.Voice-controlled Frog-Demo Video 2.mp4"
    ]
  },
  {
    "id": "level-5-wind-up-car",
    "level": 5,
    "title": "Wind-up Car",
    "categoryId": "vehicles-complex-movers",
    "learningPdf": "Level 5/Learning/Vehicles & Complex Movers/Wind-up Car/05.Wind-up Car_Slides.pdf",
    "buildingBasic": "Level 5/Building/Vehicles & Complex Movers/Wind-up Car/05.Wind-up Car_Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 5/Vehicles & Complex Movers/Wind-up Car/Program Example/L4_05_basic_program.sb3",
      "Level 5/Vehicles & Complex Movers/Wind-up Car/Program Example/L4_05_expansion_program.sb3"
    ],
    "videos": [
      "Level 5/Vehicles & Complex Movers/Wind-up Car/05.Wind-up Car_Demo Video.mp4"
    ]
  },
  {
    "id": "level-5-super-patrol-car",
    "level": 5,
    "title": "Super patrol car",
    "categoryId": "vehicles-motion",
    "learningPdf": "Level 5/Learning/Vehicles & Motion/Super patrol car.pdf",
    "buildingBasic": null,
    "buildingOptimized": null,
    "programs": [],
    "videos": []
  },
  {
    "id": "level-6-gorilla",
    "level": 6,
    "title": "Gorilla",
    "categoryId": "action-oriented",
    "learningPdf": "Level 6/Learning/Action-Oriented/Gorilla/04.Gorilla - Slides.pdf",
    "buildingBasic": "Level 6/Building/Action-Oriented/Gorilla/04.Gorilla-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Action-Oriented/Gorilla/Program Example/L4_04_basic_program.sb3",
      "Level 6/Action-Oriented/Gorilla/Program Example/L4_04_expansion_program.sb3"
    ],
    "videos": [
      "Level 6/Action-Oriented/Gorilla/04.Gorilla-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-picture-projector",
    "level": 6,
    "title": "Picture Projector",
    "categoryId": "action-oriented",
    "learningPdf": "Level 6/Learning/Action-Oriented/Picture Projector/28. Picture Projector-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Action-Oriented/Picture Projector/28. Picture Projector-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Action-Oriented/Picture Projector/Program Example/Lesson 28 remote control-Program Example.sb3",
      "Level 6/Action-Oriented/Picture Projector/Program Example/Lesson 28-Program Example.sb3"
    ],
    "videos": [
      "Level 6/Action-Oriented/Picture Projector/28. Picture Projector-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-the-flapping-pterosaur",
    "level": 6,
    "title": "The Flapping Pterosaur",
    "categoryId": "action-oriented",
    "learningPdf": "Level 6/Learning/Action-Oriented/The Flapping Pterosaur/17. The Flapping Pterosaur-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Action-Oriented/The Flapping Pterosaur/17. The Flapping Pterosaur-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Action-Oriented/The Flapping Pterosaur/Program Example/Lesson17Program.sb3"
    ],
    "videos": [
      "Level 6/Action-Oriented/The Flapping Pterosaur/17. The Flapping Pterosaur-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-code-scanning-gate",
    "level": 6,
    "title": "Code-scanning Gate",
    "categoryId": "automation-security",
    "learningPdf": "Level 6/Learning/Automation & Security/Code-scanning Gate/04.Code-scanning Gate-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Automation & Security/Code-scanning Gate/04.Code-scanning Gate-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Automation & Security/Code-scanning Gate/Program Example/Lesson4Program.sb3"
    ],
    "videos": [
      "Level 6/Automation & Security/Code-scanning Gate/04.Code-scanning Gate-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-intelligent-passing-light",
    "level": 6,
    "title": "Intelligent Passing Light",
    "categoryId": "automation-security",
    "learningPdf": "Level 6/Learning/Automation & Security/Intelligent Passing Light/09. Intelligent Passing Light-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Automation & Security/Intelligent Passing Light/09. Intelligent Passing Light -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Automation & Security/Intelligent Passing Light/Program Example/Lesson9Program.sb3"
    ],
    "videos": [
      "Level 6/Automation & Security/Intelligent Passing Light/09. Intelligent Passing Light -Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-gesture-commanding-car",
    "level": 6,
    "title": "Gesture-commanding Car",
    "categoryId": "autonomous-navigation-ranging",
    "learningPdf": "Level 6/Learning/Autonomous Navigation & Ranging/Gesture-commanding Car/23. Gesture-commanding Car-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Autonomous Navigation & Ranging/Gesture-commanding Car/23. Gesture-commanding Car-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Autonomous Navigation & Ranging/Gesture-commanding Car/Program Example/Lesson 23-Program Example.sb3"
    ],
    "videos": [
      "Level 6/Autonomous Navigation & Ranging/Gesture-commanding Car/23. Gesture-commanding Car-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-matador",
    "level": 6,
    "title": "Matador",
    "categoryId": "biomimicry-stimulus-response",
    "learningPdf": "Level 6/Learning/Biomimicry & Stimulus Response/Matador/02.Matador-update.pdf",
    "buildingBasic": null,
    "buildingOptimized": null,
    "programs": [],
    "videos": []
  },
  {
    "id": "level-6-regional-weather-station",
    "level": 6,
    "title": "Regional Weather Station",
    "categoryId": "biomimicry-stimulus-response",
    "learningPdf": "Level 6/Learning/Biomimicry & Stimulus Response/Regional Weather Station/32.Regional Weather Station-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Biomimicry & Stimulus Response/Regional Weather Station/32.Regional Weather Station-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Biomimicry & Stimulus Response/Regional Weather Station/Program Example/Lesson 32-Program Example.sb3"
    ],
    "videos": [
      "Level 6/Biomimicry & Stimulus Response/Regional Weather Station/32.Regional Weather Station-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-super-scorpion",
    "level": 6,
    "title": "Super Scorpion",
    "categoryId": "biomimicry-stimulus-response",
    "learningPdf": "Level 6/Learning/Biomimicry & Stimulus Response/Super Scorpion/16. Super Scorpion - Slides.pdf",
    "buildingBasic": "Level 6/Building/Biomimicry & Stimulus Response/Super Scorpion/16. Super Scorpion - Basic Building Manual.pdf",
    "buildingOptimized": "Level 6/Building/Biomimicry & Stimulus Response/Super Scorpion/16. Super Scorpion - Optimized Building Manual.pdf",
    "programs": [
      "Level 6/Biomimicry & Stimulus Response/Super Scorpion/Lesson16_basic_program.sb3",
      "Level 6/Biomimicry & Stimulus Response/Super Scorpion/Lesson16_optimized_program.sb3"
    ],
    "videos": []
  },
  {
    "id": "level-6-clown",
    "level": 6,
    "title": "Clown",
    "categoryId": "characters-structures",
    "learningPdf": "Level 6/Learning/Characters & Structures/Clown/05.Clown-Teaching slides.pdf",
    "buildingBasic": "Level 6/Building/Characters & Structures/Clown/05.Clown-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Characters & Structures/Clown/Program Example/Lesson5Program.sb3"
    ],
    "videos": [
      "Level 6/Characters & Structures/Clown/05.Clown-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-accurate-shooting",
    "level": 6,
    "title": "Accurate Shooting",
    "categoryId": "complex-mechanisms-coordinated-motion",
    "learningPdf": "Level 6/Learning/Complex Mechanisms & Coordinated Motion/Accurate Shooting/13. Accurate Shooting-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Complex Mechanisms & Coordinated Motion/Accurate Shooting/13. Accurate Shooting-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Complex Mechanisms & Coordinated Motion/Accurate Shooting/Program Example/Lesson13Program.sb3"
    ],
    "videos": [
      "Level 6/Complex Mechanisms & Coordinated Motion/Accurate Shooting/13. Accurate Shooting-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-dancing-robot",
    "level": 6,
    "title": "Dancing Robot",
    "categoryId": "complex-mechanisms-coordinated-motion",
    "learningPdf": "Level 6/Learning/Complex Mechanisms & Coordinated Motion/Dancing Robot/0.3Dancing Robot-update.pdf",
    "buildingBasic": null,
    "buildingOptimized": null,
    "programs": [
      "Level 6/Complex Mechanisms & Coordinated Motion/Dancing Robot/03.Dancing Robot-program example.sb2"
    ],
    "videos": []
  },
  {
    "id": "level-6-digital-countdown",
    "level": 6,
    "title": "Digital Countdown",
    "categoryId": "display-movement",
    "learningPdf": "Level 6/Learning/Display & Movement/Digital Countdown/07.Digital Countdown-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Display & Movement/Digital Countdown/07.Digital Countdown-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Display & Movement/Digital Countdown/Program Example/Lesson7Program.sb3"
    ],
    "videos": [
      "Level 6/Display & Movement/Digital Countdown/07.Digital Countdown-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-red-light-warning-device",
    "level": 6,
    "title": "Red Light Warning Device",
    "categoryId": "illumination-signals",
    "learningPdf": "Level 6/Learning/Illumination & Signals/Red Light Warning Device/12. Red Light Warning Device-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Illumination & Signals/Red Light Warning Device/12. Red Light Warning Device-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Illumination & Signals/Red Light Warning Device/Program Example/Lesson12Program.sb3"
    ],
    "videos": [
      "Level 6/Illumination & Signals/Red Light Warning Device/12. Red Light Warning Device-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-smart-flashlight",
    "level": 6,
    "title": "Smart Flashlight",
    "categoryId": "illumination-signals",
    "learningPdf": "Level 6/Learning/Illumination & Signals/Smart Flashlight/27.Lesson 27 Smart Flashlight-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Illumination & Signals/Smart Flashlight/27.Smart Flashlight-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Illumination & Signals/Smart Flashlight/Program Example/lesson 27-program.sb3"
    ],
    "videos": [
      "Level 6/Illumination & Signals/Smart Flashlight/27.Smart Flashlight-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-traffic-lights-display",
    "level": 6,
    "title": "Traffic Lights Display",
    "categoryId": "illumination-signals",
    "learningPdf": "Level 6/Learning/Illumination & Signals/Traffic Lights Display/10. Traffic Lights-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Illumination & Signals/Traffic Lights Display/10. Traffic Lights-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Illumination & Signals/Traffic Lights Display/Program Example/Lesson10Program.sb3"
    ],
    "videos": [
      "Level 6/Illumination & Signals/Traffic Lights Display/10. Traffic Lights-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-finger-guessing-robot",
    "level": 6,
    "title": "Finger-guessing Robot",
    "categoryId": "interactive-mechanisms",
    "learningPdf": "Level 6/Learning/Interactive Mechanisms/Finger-guessing Robot/04.Finger-guessing Robot.pdf",
    "buildingBasic": null,
    "buildingOptimized": null,
    "programs": [
      "Level 6/Interactive Mechanisms/Finger-guessing Robot/04.Finger-guessing Robot.sb3"
    ],
    "videos": []
  },
  {
    "id": "level-6-pinball-machine",
    "level": 6,
    "title": "Pinball Machine",
    "categoryId": "interactive-mechanisms",
    "learningPdf": "Level 6/Learning/Interactive Mechanisms/Pinball Machine/30. Pinball Machine-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Interactive Mechanisms/Pinball Machine/30. Pinball Machine-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Interactive Mechanisms/Pinball Machine/Program Example/Lesson30Program.sb3"
    ],
    "videos": [
      "Level 6/Interactive Mechanisms/Pinball Machine/30. Pinball Machine-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-smart-fan",
    "level": 6,
    "title": "Smart Fan",
    "categoryId": "interactive-systems",
    "learningPdf": "Level 6/Learning/Interactive Systems/Smart Fan/31.Smart Fan-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Interactive Systems/Smart Fan/31.Smart Fan-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Interactive Systems/Smart Fan/Program Example/Lesson 31. Smart Fan-Program Example.sb3"
    ],
    "videos": [
      "Level 6/Interactive Systems/Smart Fan/31. Smart Fan-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-the-interesting-rotor",
    "level": 6,
    "title": "The Interesting Rotor",
    "categoryId": "interactive-systems",
    "learningPdf": "Level 6/Learning/Interactive Systems/The Interesting Rotor/19. The Interesting Rotor-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Interactive Systems/The Interesting Rotor/19. The Interesting Rotor-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Interactive Systems/The Interesting Rotor/Program Example/Lesson 19-Program Example.sb3"
    ],
    "videos": [
      "Level 6/Interactive Systems/The Interesting Rotor/19. The Interesting Rotor-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-combination-lock",
    "level": 6,
    "title": "Combination Lock",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 6/Learning/Mechanisms & Simulators/Combination Lock/29.Combination Lock -Slides.pdf",
    "buildingBasic": "Level 6/Building/Mechanisms & Simulators/Combination Lock/29.Combination Lock -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Mechanisms & Simulators/Combination Lock/Program Example/L4_29_program.sb3"
    ],
    "videos": [
      "Level 6/Mechanisms & Simulators/Combination Lock/29.Combination Lock -Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-gibbon",
    "level": 6,
    "title": "Gibbon",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 6/Learning/Mechanisms & Simulators/Gibbon/14. Gibbon - Slides.pdf",
    "buildingBasic": "Level 6/Building/Mechanisms & Simulators/Gibbon/14. Gibbon - Basic Building Manual.pdf",
    "buildingOptimized": "Level 6/Building/Mechanisms & Simulators/Gibbon/14. Gibbon - Optimized Building Manual.pdf",
    "programs": [
      "Level 6/Mechanisms & Simulators/Gibbon/Lesson14_basicprogram.sb3",
      "Level 6/Mechanisms & Simulators/Gibbon/Lesson14_optimized_program.sb3"
    ],
    "videos": []
  },
  {
    "id": "level-6-pay-by-card",
    "level": 6,
    "title": "Pay by card",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 6/Learning/Mechanisms & Simulators/Pay by card/16.Pay by card -Slides.pdf",
    "buildingBasic": "Level 6/Building/Mechanisms & Simulators/Pay by card/16.Pay by card -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Mechanisms & Simulators/Pay by card/Program Example/L4_16_basic_program.sb3",
      "Level 6/Mechanisms & Simulators/Pay by card/Program Example/L4_16_expansion_program.sb3"
    ],
    "videos": [
      "Level 6/Mechanisms & Simulators/Pay by card/16.Pay by card -Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-product-search",
    "level": 6,
    "title": "Product Search",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 6/Learning/Mechanisms & Simulators/Product Search/15.Product Search -Slides.pdf",
    "buildingBasic": "Level 6/Building/Mechanisms & Simulators/Product Search/15.Product Search -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Mechanisms & Simulators/Product Search/Program Example/L4_15_basic_program.sb3",
      "Level 6/Mechanisms & Simulators/Product Search/Program Example/L4_15_expansion_program.sb3"
    ],
    "videos": [
      "Level 6/Mechanisms & Simulators/Product Search/15.Product Search -Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-punch-hard",
    "level": 6,
    "title": "Punch Hard",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 6/Learning/Mechanisms & Simulators/Punch Hard/7. Punch Hard - Slides.pdf",
    "buildingBasic": "Level 6/Building/Mechanisms & Simulators/Punch Hard/7. Punch Hard - Basic Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Mechanisms & Simulators/Punch Hard/Lesson7_basic_program.sb3",
      "Level 6/Mechanisms & Simulators/Punch Hard/Lesson7_optimized_program.sb3"
    ],
    "videos": []
  },
  {
    "id": "level-6-rc-airplane",
    "level": 6,
    "title": "RC Airplane",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 6/Learning/Mechanisms & Simulators/RC Airplane/11.RC Airplane - Slides.pdf",
    "buildingBasic": "Level 6/Building/Mechanisms & Simulators/RC Airplane/11.RC Airplane -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Mechanisms & Simulators/RC Airplane/Program Example/L4_11_basic_program.sb3",
      "Level 6/Mechanisms & Simulators/RC Airplane/Program Example/L4_11_expansion_program.sb3"
    ],
    "videos": [
      "Level 6/Mechanisms & Simulators/RC Airplane/11.RC Airplane -Demo Video.mp4",
      "Level 6/Mechanisms & Simulators/RC Airplane/11.RC Airplane 2-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-ring-toss-game",
    "level": 6,
    "title": "Ring Toss Game",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 6/Learning/Mechanisms & Simulators/Ring Toss Game/15. Ring Toss Game-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Mechanisms & Simulators/Ring Toss Game/15. Ring Toss Game-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Mechanisms & Simulators/Ring Toss Game/Program Example/Lesson15Program.sb3"
    ],
    "videos": [
      "Level 6/Mechanisms & Simulators/Ring Toss Game/15. Ring Toss Game-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-robotic-arm",
    "level": 6,
    "title": "Robotic Arm",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 6/Learning/Mechanisms & Simulators/Robotic Arm/32. The Robotic Arm-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Mechanisms & Simulators/Robotic Arm/32. The Robotic Arm-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Mechanisms & Simulators/Robotic Arm/Program Example/Lesson32Program.sb3"
    ],
    "videos": [
      "Level 6/Mechanisms & Simulators/Robotic Arm/32. The Robotic Arm-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-vending-machine",
    "level": 6,
    "title": "Vending Machine",
    "categoryId": "mechanisms-simulators",
    "learningPdf": "Level 6/Learning/Mechanisms & Simulators/Vending Machine/27.Vending Machine-Slides.pdf",
    "buildingBasic": "Level 6/Building/Mechanisms & Simulators/Vending Machine/27.Vending Machine-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Mechanisms & Simulators/Vending Machine/Program Example/L4_27_program.sb3"
    ],
    "videos": [
      "Level 6/Mechanisms & Simulators/Vending Machine/27.Vending Machine-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-autonomous-driving",
    "level": 6,
    "title": "Autonomous Driving",
    "categoryId": "programming-precise-control",
    "learningPdf": "Level 6/Learning/Programming & Precise Control/Autonomous Driving/18.Autonomous Driving -Slides.pdf",
    "buildingBasic": "Level 6/Building/Programming & Precise Control/Autonomous Driving/18.Autonomous Driving -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Programming & Precise Control/Autonomous Driving/Program Example/L4_18_program.sb3"
    ],
    "videos": [
      "Level 6/Programming & Precise Control/Autonomous Driving/18.Autonomous Driving -Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-minesweeper-robot",
    "level": 6,
    "title": "Minesweeper Robot",
    "categoryId": "programming-precise-control",
    "learningPdf": "Level 6/Learning/Programming & Precise Control/Minesweeper Robot/12.Minesweeper Robot -Slides.pdf",
    "buildingBasic": "Level 6/Building/Programming & Precise Control/Minesweeper Robot/12.Minesweeper Robot - Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Programming & Precise Control/Minesweeper Robot/Program Example/L4_12_basic_program.sb3",
      "Level 6/Programming & Precise Control/Minesweeper Robot/Program Example/L4_12_expansion_program.sb3"
    ],
    "videos": [
      "Level 6/Programming & Precise Control/Minesweeper Robot/12.Minesweeper Robot -Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-remote-control-lift",
    "level": 6,
    "title": "Remote Control Lift",
    "categoryId": "programming-precise-control",
    "learningPdf": "Level 6/Learning/Programming & Precise Control/Remote Control Lift/22. Remote Control Lift-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Programming & Precise Control/Remote Control Lift/22. Remote Control Lift -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Programming & Precise Control/Remote Control Lift/Program Example/Lesson 22-Program Example.sb3"
    ],
    "videos": [
      "Level 6/Programming & Precise Control/Remote Control Lift/22. Remote Control Lift-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-saluting-robot",
    "level": 6,
    "title": "Saluting Robot",
    "categoryId": "programming-precise-control",
    "learningPdf": "Level 6/Learning/Programming & Precise Control/Saluting Robot/26.Saluting Robot -Slides.pdf",
    "buildingBasic": "Level 6/Building/Programming & Precise Control/Saluting Robot/26.Saluting Robot -Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Programming & Precise Control/Saluting Robot/Program Example/L4_26_program.sb3"
    ],
    "videos": [
      "Level 6/Programming & Precise Control/Saluting Robot/26.Saluting Robot -Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-smart-electric-drill",
    "level": 6,
    "title": "Smart Electric Drill",
    "categoryId": "programming-precise-control",
    "learningPdf": "Level 6/Learning/Programming & Precise Control/Smart Electric Drill/20. Smart Electric Drill-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Programming & Precise Control/Smart Electric Drill/20. Smart Electric Drill-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Programming & Precise Control/Smart Electric Drill/Program Example/Lesson 20-Program Example.sb3"
    ],
    "videos": [
      "Level 6/Programming & Precise Control/Smart Electric Drill/20. Smart Electric Drill-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-altimeter",
    "level": 6,
    "title": "Altimeter",
    "categoryId": "sensor-automation",
    "learningPdf": "Level 6/Learning/Sensor Automation/Altimeter/18. Altimeter-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Sensor Automation/Altimeter/18. Altimeter-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Sensor Automation/Altimeter/Program Example/Lesson 18-Program Example.sb3"
    ],
    "videos": [
      "Level 6/Sensor Automation/Altimeter/18. Altimeter-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-high-temperature-alarm",
    "level": 6,
    "title": "High Temperature Alarm",
    "categoryId": "sensor-automation",
    "learningPdf": "Level 6/Learning/Sensor Automation/High Temperature Alarm/29. High Temperature Alarm-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Sensor Automation/High Temperature Alarm/29. High Temperature Alarm-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Sensor Automation/High Temperature Alarm/Program Example/Lesson 29-Program Example.sb3"
    ],
    "videos": [
      "Level 6/Sensor Automation/High Temperature Alarm/29. High Temperature Alarm--Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-intelligent-sorting-machine",
    "level": 6,
    "title": "Intelligent Sorting Machine",
    "categoryId": "sensor-automation",
    "learningPdf": "Level 6/Learning/Sensor Automation/Intelligent Sorting Machine/24.Intelligent Sorting Machine-Slides.pdf",
    "buildingBasic": "Level 6/Building/Sensor Automation/Intelligent Sorting Machine/24.Intelligent Sorting Machine-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Sensor Automation/Intelligent Sorting Machine/Program Example/L4_24_basic_program.sb3",
      "Level 6/Sensor Automation/Intelligent Sorting Machine/Program Example/L4_24_expansion_program.sb3"
    ],
    "videos": [
      "Level 6/Sensor Automation/Intelligent Sorting Machine/24.Intelligent Sorting Machine-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-parcel-sorting-machine",
    "level": 6,
    "title": "Parcel Sorting Machine",
    "categoryId": "sensor-automation",
    "learningPdf": "Level 6/Learning/Sensor Automation/Parcel Sorting Machine/31. Parcel Sorting Machine-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Sensor Automation/Parcel Sorting Machine/31. Parcel Sorting Machine-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Sensor Automation/Parcel Sorting Machine/Program Example/Lesson31Program.sb3"
    ],
    "videos": [
      "Level 6/Sensor Automation/Parcel Sorting Machine/31. Parcel Sorting Machine-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-ball-tracking",
    "level": 6,
    "title": "Ball Tracking",
    "categoryId": "sensor-focused-robots",
    "learningPdf": "Level 6/Learning/Sensor-Focused Robots/Ball Tracking/08.Ball Tracking.pdf",
    "buildingBasic": null,
    "buildingOptimized": null,
    "programs": [
      "Level 6/Sensor-Focused Robots/Ball Tracking/08. Ball Tracking.sb3"
    ],
    "videos": []
  },
  {
    "id": "level-6-colorblind-assistant-robot",
    "level": 6,
    "title": "Colorblind Assistant Robot",
    "categoryId": "sensor-focused-robots",
    "learningPdf": "Level 6/Learning/Sensor-Focused Robots/Colorblind Assistant Robot/25.Colorblind Assistant Robot-Slides.pdf",
    "buildingBasic": "Level 6/Building/Sensor-Focused Robots/Colorblind Assistant Robot/25.Colorblind Assistant Robot-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Sensor-Focused Robots/Colorblind Assistant Robot/Program Example/L4_25_program.sb3"
    ],
    "videos": [
      "Level 6/Sensor-Focused Robots/Colorblind Assistant Robot/25.Colorblind Assistant Robot-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-rock-paper-scissors-robot",
    "level": 6,
    "title": "Rock-paper-scissors Robot",
    "categoryId": "sensor-focused-robots",
    "learningPdf": "Level 6/Learning/Sensor-Focused Robots/Rock-paper-scissors Robot/30.Rock-paper-scissors Robot-Slides.pdf",
    "buildingBasic": "Level 6/Building/Sensor-Focused Robots/Rock-paper-scissors Robot/30.Rock-paper-scissors Robot-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Sensor-Focused Robots/Rock-paper-scissors Robot/Program Example/L4_30_program.sb3"
    ],
    "videos": [
      "Level 6/Sensor-Focused Robots/Rock-paper-scissors Robot/30.Rock-paper-scissors Robot-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-smart-camera",
    "level": 6,
    "title": "Smart Camera",
    "categoryId": "sensor-focused-robots",
    "learningPdf": "Level 6/Learning/Sensor-Focused Robots/Smart Camera/22.Smart Camera-Slides.pdf",
    "buildingBasic": "Level 6/Building/Sensor-Focused Robots/Smart Camera/22.Smart Camera-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Sensor-Focused Robots/Smart Camera/Program Example/L4_22_program.sb3"
    ],
    "videos": [
      "Level 6/Sensor-Focused Robots/Smart Camera/22.Smart Camera-Demo Video.mp4"
    ]
  },
  {
    "id": "level-6-tricycle",
    "level": 6,
    "title": "Tricycle",
    "categoryId": "vehicles-complex-movers",
    "learningPdf": "Level 6/Learning/Vehicles & Complex Movers/Tricycle/29. Tricycle-Teaching Slides.pdf",
    "buildingBasic": "Level 6/Building/Vehicles & Complex Movers/Tricycle/29. Tricycle-Building Manual.pdf",
    "buildingOptimized": null,
    "programs": [
      "Level 6/Vehicles & Complex Movers/Tricycle/Program Example/Lesson29Program.sb3"
    ],
    "videos": [
      "Level 6/Vehicles & Complex Movers/Tricycle/29. Tricycle-Demo Video.mp4"
    ]
  }
];

/** Remote assets follow repo-relative paths: public/... and curriculum-source/...
 * A runtime configuration is intentionally optional until external hosting is selected.
 * Set window.__BSR_ASSET_BASE_URL__ before app bootstrap once media is hosted.
 * This module also runs under Node's existing Level 4 data-registry tests.
 */
function assetBase(): string | null {
  const config = globalThis as typeof globalThis & { __BSR_ASSET_BASE_URL__?: string };
  const value = config.__BSR_ASSET_BASE_URL__?.trim();
  return value ? value.replace(/\/+$/, "") : null;
}
function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}
function publicUrl(path: string): string {
  // Use the individually uploaded Wix document for Level 6 PDF lessons.
  // Keep Level 5 and non-PDF asset hosting behavior unchanged.
  const wixUrl = levelFiveWixPdfUrls[path] ?? levelSixWixPdfUrls[path];
  if (wixUrl) return wixUrl;
  const base = assetBase();
  return base ? base + "/" + encodePath("public/" + path) : "/" + encodePath(path);
}
function curriculumUrl(path: string): string {
  // Scratch resources are small enough to use their existing public GitHub URL
  // until the external asset host is configured. Do not use raw GitHub for LFS video playback.
  const base = assetBase() ?? "https://raw.githubusercontent.com/Arrjack8847/learn-build-robot/main";
  return base + "/" + encodePath("curriculum-source/" + path);
}
const byId = new Map(levelFiveSixLessons.map(lesson => [lesson.id, lesson]));

export const levelFiveSixLearningLectures: Record<string, LevelOneLecture> =
  Object.fromEntries(levelFiveSixLessons.map(lesson => [
    lesson.id,
    { projectId: lesson.id, url: publicUrl(lesson.learningPdf), learningOnly: false },
  ]));

export const levelFiveSixLearningManuals: Record<string, PdfActivityManual> =
  Object.fromEntries(levelFiveSixLessons.map(lesson => [
    lesson.id,
    {
      id: lesson.id,
      title: lesson.title,
      url: publicUrl(lesson.learningPdf),
      completionStepId: lesson.id + "-slides-complete",
      sourceKind: "powerpoint",
    },
  ]));

function buildManual(lesson: AdvancedLessonAsset, path: string, variant: "basic" | "optimized"): PdfActivityManual {
  return {
    id: lesson.id,
    title: lesson.title,
    url: publicUrl(path),
    completionStepId: lesson.id + "-" + variant + "-building-complete",
  };
}

export function getLevelFiveSixBuildingManual(
  id: string,
  variant: "basic" | "optimized" = "basic",
): PdfActivityManual | undefined {
  const lesson = byId.get(id);
  if (!lesson) return undefined;
  const effectiveVariant = variant === "optimized" && lesson.buildingOptimized
    ? "optimized" : "basic";
  const path = effectiveVariant === "optimized"
    ? lesson.buildingOptimized
    : lesson.buildingBasic ?? lesson.buildingOptimized;
  if (path) return buildManual(lesson, path, effectiveVariant);
  return {
    id: lesson.id,
    title: lesson.title,
    url: publicUrl(lesson.learningPdf),
    completionStepId: lesson.id + "-building-reference-reviewed",
    learningFallback: true,
  };
}

export function hasLevelFiveSixOptimizedManual(id: string): boolean {
  return Boolean(byId.get(id)?.buildingOptimized);
}
export function isLevelFiveSixBuildingReference(id: string): boolean {
  const lesson = byId.get(id);
  return Boolean(lesson && !lesson.buildingBasic && !lesson.buildingOptimized);
}
export function getLevelFiveSixProgrammingFiles(id: string): readonly AdvancedDownload[] {
  return byId.get(id)?.programs.map(path => ({
    fileName: path.split("/").at(-1) ?? path,
    url: curriculumUrl(path),
  })) ?? [];
}
export function getLevelFiveSixDemoVideos(id: string): readonly AdvancedDemoVideo[] {
  const lesson = byId.get(id);
  if (!lesson) return [];

  // Production video playback stays disabled until a proper media host exists.
  // In local Vite development only, videos can be copied to
  // public/local-demos/<Level N>/<category>/<project>/<file>.mp4
  // and VITE_BSR_DEMO_VIDEO_BASE_URL=/local-demos set in .env.local.
  // This does not turn the Git LFS raw URL into a streaming endpoint.
  const localVideoBase = import.meta.env.DEV
    ? import.meta.env["VITE_BSR_DEMO_VIDEO_BASE_URL"]?.trim().replace(/\/+$/, "")
    : undefined;
  if (!assetBase() && !localVideoBase) return [];
  return lesson.videos.map(path => ({
    fileName: path.split("/").at(-1) ?? path,
    url: localVideoBase
      ? localVideoBase + "/" + encodePath(path)
      : curriculumUrl(path),
  }));
}
