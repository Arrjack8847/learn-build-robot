/** Official student-facing Level 1, 3 and 4 Scratch programs.
 * Source: supplied original syllabus tree. Paths preserve the exact original
 * folder and filenames at public/Level N/Programming/.
 * Deliberately excludes unassigned 'unit ... programming' collections:
 * a program is downloadable only on the corresponding verified project.
 * IMPORTANT: publish the referenced files before merging this branch.
 */
import type { PracticalProject } from "@/types/learning";

interface OriginalProgram {
  level: number;
  categoryId: string;
  projectKey: string;
  fileName: string;
  path: string;
}
export interface LegacyProgrammingFile {
  fileName: string;
  url: string;
}

/** Machine-readable, auditable manifest of original project-specific files. */
export const legacyProgrammingSources: readonly OriginalProgram[] = [
  {
    "level": 1,
    "categoryId": "display-movement",
    "projectKey": "hello-world",
    "fileName": "L301_basic_program.sb3",
    "path": "Level 1/Programming/Display & Movement/Hello World/Program Example/L301_basic_program.sb3"
  },
  {
    "level": 1,
    "categoryId": "display-movement",
    "projectKey": "hello-world",
    "fileName": "L301_expansion_program.sb3",
    "path": "Level 1/Programming/Display & Movement/Hello World/Program Example/L301_expansion_program.sb3"
  },
  {
    "level": 1,
    "categoryId": "illumination-signals",
    "projectKey": "color-changing-light",
    "fileName": "L302_basic_program.sb3",
    "path": "Level 1/Programming/Illumination & Signals/Color-changing Light/Program Example/L302_basic_program.sb3"
  },
  {
    "level": 1,
    "categoryId": "illumination-signals",
    "projectKey": "color-changing-light",
    "fileName": "L302_expansion_program.sb3",
    "path": "Level 1/Programming/Illumination & Signals/Color-changing Light/Program Example/L302_expansion_program.sb3"
  },
  {
    "level": 1,
    "categoryId": "mechanisms-simulators",
    "projectKey": "crawl-slowly",
    "fileName": "Lesson9_program.sb3",
    "path": "Level 1/Programming/Mechanisms & Simulators/Crawl Slowly/Lesson9_program.sb3"
  },
  {
    "level": 1,
    "categoryId": "mechanisms-simulators",
    "projectKey": "shock-absorber",
    "fileName": "Shock absorber_program.sb2",
    "path": "Level 1/Programming/Mechanisms & Simulators/Shock absorber/Shock absorber_program.sb2"
  },
  {
    "level": 3,
    "categoryId": "action-oriented",
    "projectKey": "clip-robot",
    "fileName": "Clip robot_program.sb2",
    "path": "Level 3/Programming/Action-Oriented/Clip robot/Clip robot_program.sb2"
  },
  {
    "level": 3,
    "categoryId": "automation-security",
    "projectKey": "automatic-seesaw",
    "fileName": "Lesson24Program.sb3",
    "path": "Level 3/Programming/Automation & Security/Automatic Seesaw/Program Example/Lesson24Program.sb3"
  },
  {
    "level": 3,
    "categoryId": "characters-structures",
    "projectKey": "electric-bulldozer",
    "fileName": "L3_23_basic_program.sb3",
    "path": "Level 3/Programming/Characters & Structures/Electric Bulldozer/Program Example/L3_23_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "characters-structures",
    "projectKey": "electric-bulldozer",
    "fileName": "L3_23_expansion_program.sb3",
    "path": "Level 3/Programming/Characters & Structures/Electric Bulldozer/Program Example/L3_23_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "characters-structures",
    "projectKey": "electric-fan",
    "fileName": "L305_basic_program.sb3",
    "path": "Level 3/Programming/Characters & Structures/Electric Fan/Program Example/L305_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "characters-structures",
    "projectKey": "electric-fan",
    "fileName": "L305_expansion_program.sb3",
    "path": "Level 3/Programming/Characters & Structures/Electric Fan/Program Example/L305_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "characters-structures",
    "projectKey": "safe",
    "fileName": "L3_15_basic_program.sb3",
    "path": "Level 3/Programming/Characters & Structures/Safe/Program Example/L3_15_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "characters-structures",
    "projectKey": "safe",
    "fileName": "L3_15_expansion_program.sb3",
    "path": "Level 3/Programming/Characters & Structures/Safe/Program Example/L3_15_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "characters-structures",
    "projectKey": "smart-trash-bin",
    "fileName": "L3_20_basic_program.sb3",
    "path": "Level 3/Programming/Characters & Structures/Smart Trash Bin/Program Example/L3_20_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "characters-structures",
    "projectKey": "smart-trash-bin",
    "fileName": "L3_20_expansion_program.sb3",
    "path": "Level 3/Programming/Characters & Structures/Smart Trash Bin/Program Example/L3_20_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "display-movement",
    "projectKey": "automated-guided-vehicle",
    "fileName": "L3_24_basic_program.sb3",
    "path": "Level 3/Programming/Display & Movement/Automated Guided Vehicle/Program Example/L3_24_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "display-movement",
    "projectKey": "automated-guided-vehicle",
    "fileName": "L3_24_expansion_program.sb3",
    "path": "Level 3/Programming/Display & Movement/Automated Guided Vehicle/Program Example/L3_24_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "display-movement",
    "projectKey": "race-walking",
    "fileName": "Lesson1_program.sb3",
    "path": "Level 3/Programming/Display & Movement/Race Walking/Lesson1_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "illumination-signals",
    "projectKey": "disinfection-lamp",
    "fileName": "L3_13_basic_program.sb3",
    "path": "Level 3/Programming/Illumination & Signals/Disinfection Lamp/Program Example/L3_13_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "illumination-signals",
    "projectKey": "disinfection-lamp",
    "fileName": "L3_13_expansion_program.sb3",
    "path": "Level 3/Programming/Illumination & Signals/Disinfection Lamp/Program Example/L3_13_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "illumination-signals",
    "projectKey": "flashlight-sensor",
    "fileName": "L304_basic_program.sb3",
    "path": "Level 3/Programming/Illumination & Signals/Flashlight Sensor/Program Example/L304_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "illumination-signals",
    "projectKey": "flashlight-sensor",
    "fileName": "L304_expansion_program.sb3",
    "path": "Level 3/Programming/Illumination & Signals/Flashlight Sensor/Program Example/L304_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "illumination-signals",
    "projectKey": "light-sensitive-curtains",
    "fileName": "L3_14_basic_program.sb3",
    "path": "Level 3/Programming/Illumination & Signals/Light-sensitive Curtains/Program Example/L3_14_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "illumination-signals",
    "projectKey": "light-sensitive-curtains",
    "fileName": "L3_14_expansion_program.sb3",
    "path": "Level 3/Programming/Illumination & Signals/Light-sensitive Curtains/Program Example/L3_14_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "interactive-systems",
    "projectKey": "anti-fall-robot",
    "fileName": "L3_11_basic_program.sb3",
    "path": "Level 3/Programming/Interactive Systems/Anti-fall Robot/Program Example/L3_11_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "interactive-systems",
    "projectKey": "anti-fall-robot",
    "fileName": "L3_11_expansion_program.sb3",
    "path": "Level 3/Programming/Interactive Systems/Anti-fall Robot/Program Example/L3_11_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "interactive-systems",
    "projectKey": "automatic-door",
    "fileName": "L3_17_basic_program.sb3",
    "path": "Level 3/Programming/Interactive Systems/Automatic Door/Program Example/L3_17_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "interactive-systems",
    "projectKey": "automatic-door",
    "fileName": "L3_17_expansion_program.sb3",
    "path": "Level 3/Programming/Interactive Systems/Automatic Door/Program Example/L3_17_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "interactive-systems",
    "projectKey": "juicer-machine",
    "fileName": "L306_basic_program.sb3",
    "path": "Level 3/Programming/Interactive Systems/Juicer Machine/Program Example/L306_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "interactive-systems",
    "projectKey": "juicer-machine",
    "fileName": "L306_expansion_program.sb3",
    "path": "Level 3/Programming/Interactive Systems/Juicer Machine/Program Example/L306_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "interactive-systems",
    "projectKey": "washing-machine",
    "fileName": "L308_basic_program.sb3",
    "path": "Level 3/Programming/Interactive Systems/Washing Machine/Program Example/L308_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "interactive-systems",
    "projectKey": "washing-machine",
    "fileName": "L308_expansion_program.sb3",
    "path": "Level 3/Programming/Interactive Systems/Washing Machine/Program Example/L308_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "sound-voice-interaction",
    "projectKey": "music-box",
    "fileName": "L3_29_basic_program.sb3",
    "path": "Level 3/Programming/Sound & Voice Interaction/Music Box/Program Example/L3_29_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "sound-voice-interaction",
    "projectKey": "music-box",
    "fileName": "L3_29_expansion_program.sb3",
    "path": "Level 3/Programming/Sound & Voice Interaction/Music Box/Program Example/L3_29_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "sound-voice-interaction",
    "projectKey": "music-doorbell",
    "fileName": "L307_basic_program.sb3",
    "path": "Level 3/Programming/Sound & Voice Interaction/Music Doorbell/Program Example/L307_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "sound-voice-interaction",
    "projectKey": "music-doorbell",
    "fileName": "L307_expansion_program.sb3",
    "path": "Level 3/Programming/Sound & Voice Interaction/Music Doorbell/Program Example/L307_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "sound-voice-interaction",
    "projectKey": "sound-level-meter",
    "fileName": "L3_16_basic_program.sb3",
    "path": "Level 3/Programming/Sound & Voice Interaction/Sound Level Meter/Program Example/L3_16_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "sound-voice-interaction",
    "projectKey": "sound-level-meter",
    "fileName": "L3_16_expansion_program.sb3",
    "path": "Level 3/Programming/Sound & Voice Interaction/Sound Level Meter/Program Example/L3_16_expansion_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "vehicles-complex-movers",
    "projectKey": "f1-racing-car",
    "fileName": "F1 racing car_program.sb2",
    "path": "Level 3/Programming/Vehicles & Complex Movers/F1 racing car/F1 racing car_program.sb2"
  },
  {
    "level": 3,
    "categoryId": "vehicles-complex-movers",
    "projectKey": "long-lived-turtle",
    "fileName": "Lesson11_basic_program.sb3",
    "path": "Level 3/Programming/Vehicles & Complex Movers/Long-Lived Turtle/Lesson11_basic_program.sb3"
  },
  {
    "level": 3,
    "categoryId": "vehicles-complex-movers",
    "projectKey": "long-lived-turtle",
    "fileName": "Lesson11_optimized_program.sb3",
    "path": "Level 3/Programming/Vehicles & Complex Movers/Long-Lived Turtle/Lesson11_optimized_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "action-oriented",
    "projectKey": "warrior-with-claws",
    "fileName": "Lesson13_basic_program.sb3",
    "path": "Level 4/Programming/Action-Oriented/Warrior With Claws/Lesson13_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "action-oriented",
    "projectKey": "warrior-with-claws",
    "fileName": "lesson13_optimized_program.sb3",
    "path": "Level 4/Programming/Action-Oriented/Warrior With Claws/lesson13_optimized_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "automation-security",
    "projectKey": "personal-bodyguard",
    "fileName": "Lesson 9-Program Example.sb3",
    "path": "Level 4/Programming/Automation & Security/Personal Bodyguard/Program Example/Lesson 9-Program Example.sb3"
  },
  {
    "level": 4,
    "categoryId": "automation-security",
    "projectKey": "scan-to-open-the-gate",
    "fileName": "Lesson1Program.sb3",
    "path": "Level 4/Programming/Automation & Security/Scan to Open the Gate/Program Example/Lesson1Program.sb3"
  },
  {
    "level": 4,
    "categoryId": "automation-security",
    "projectKey": "scan-to-open-the-gate",
    "fileName": "TestProgram.sb3",
    "path": "Level 4/Programming/Automation & Security/Scan to Open the Gate/Program Example/TestProgram.sb3"
  },
  {
    "level": 4,
    "categoryId": "automation-security",
    "projectKey": "tag-recognition",
    "fileName": "06. Tag Recognition.sb3",
    "path": "Level 4/Programming/Automation & Security/Tag Recognition/06. Tag Recognition.sb3"
  },
  {
    "level": 4,
    "categoryId": "autonomous-navigation-ranging",
    "projectKey": "guide-dogs",
    "fileName": "Lesson10_basic_program.sb3",
    "path": "Level 4/Programming/Autonomous Navigation & Ranging/Guide Dogs/Lesson10_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "autonomous-navigation-ranging",
    "projectKey": "guide-dogs",
    "fileName": "Lesson10_optimized_program.sb3",
    "path": "Level 4/Programming/Autonomous Navigation & Ranging/Guide Dogs/Lesson10_optimized_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "autonomous-navigation-ranging",
    "projectKey": "keeping-distance",
    "fileName": "Lesson 12-Program Example.sb3",
    "path": "Level 4/Programming/Autonomous Navigation & Ranging/Keeping Distance/Program Example/Lesson 12-Program Example.sb3"
  },
  {
    "level": 4,
    "categoryId": "autonomous-navigation-ranging",
    "projectKey": "laser-rangefinder",
    "fileName": "LESSON 10-Program Example.sb3",
    "path": "Level 4/Programming/Autonomous Navigation & Ranging/Laser Rangefinder/Program Example/LESSON 10-Program Example.sb3"
  },
  {
    "level": 4,
    "categoryId": "autonomous-navigation-ranging",
    "projectKey": "magnetically-controlled-door",
    "fileName": "06. Magnetically controlled door-program.sb3",
    "path": "Level 4/Programming/Autonomous Navigation & Ranging/Magnetically Controlled Door/Program Example/06. Magnetically controlled door-program.sb3"
  },
  {
    "level": 4,
    "categoryId": "autonomous-navigation-ranging",
    "projectKey": "obstacle-avoidance-in-snow",
    "fileName": "Lesson4_optimized_program.sb3",
    "path": "Level 4/Programming/Autonomous Navigation & Ranging/Obstacle Avoidance In Snow/Lesson4_optimized_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "autonomous-navigation-ranging",
    "projectKey": "probe-vehicle",
    "fileName": "02.Probe Vehicle.sb3",
    "path": "Level 4/Programming/Autonomous Navigation & Ranging/Probe Vehicle/02.Probe Vehicle.sb3"
  },
  {
    "level": 4,
    "categoryId": "characters-structures",
    "projectKey": "a-timid-mouse",
    "fileName": "Lesson 25 Program Example.sb3",
    "path": "Level 4/Programming/Characters & Structures/A Timid Mouse/Program Example/Lesson 25 Program Example.sb3"
  },
  {
    "level": 4,
    "categoryId": "characters-structures",
    "projectKey": "elf-in-the-tree",
    "fileName": "Lesson12_basic_program.sb3",
    "path": "Level 4/Programming/Characters & Structures/Elf in the Tree/Lesson12_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "characters-structures",
    "projectKey": "elf-in-the-tree",
    "fileName": "Lesson12_optimized_program.sb3",
    "path": "Level 4/Programming/Characters & Structures/Elf in the Tree/Lesson12_optimized_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "characters-structures",
    "projectKey": "parts-sorter",
    "fileName": "L3_22_basic_program.sb3",
    "path": "Level 4/Programming/Characters & Structures/Parts Sorter/Program Example/L3_22_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "characters-structures",
    "projectKey": "parts-sorter",
    "fileName": "L3_22_expansion_program.sb3",
    "path": "Level 4/Programming/Characters & Structures/Parts Sorter/Program Example/L3_22_expansion_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "characters-structures",
    "projectKey": "swimming-plesiosaur",
    "fileName": "Lesson19Program.sb3",
    "path": "Level 4/Programming/Characters & Structures/Swimming Plesiosaur/Program Example/Lesson19Program.sb3"
  },
  {
    "level": 4,
    "categoryId": "characters-structures",
    "projectKey": "tail-wagging-stegosaurus",
    "fileName": "Lesson18Program.sb3",
    "path": "Level 4/Programming/Characters & Structures/Tail-Wagging Stegosaurus/Program Example/Lesson18Program.sb3"
  },
  {
    "level": 4,
    "categoryId": "complex-mechanisms-coordinated-motion",
    "projectKey": "card-machine",
    "fileName": "05.Card Machine-program example.sb2",
    "path": "Level 4/Programming/Complex Mechanisms & Coordinated Motion/Card Machine/05.Card Machine-program example.sb2"
  },
  {
    "level": 4,
    "categoryId": "display-movement",
    "projectKey": "dancing-robot",
    "fileName": "L3_31_basic_program.sb3",
    "path": "Level 4/Programming/Display & Movement/Dancing Robot/Program Example/L3_31_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "display-movement",
    "projectKey": "dancing-robot",
    "fileName": "L3_31_expansion_program.sb3",
    "path": "Level 4/Programming/Display & Movement/Dancing Robot/Program Example/L3_31_expansion_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "display-movement",
    "projectKey": "skiing-robot",
    "fileName": "L3_28_basic_program.sb3",
    "path": "Level 4/Programming/Display & Movement/Skiing Robot/Program Example/L3_28_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "display-movement",
    "projectKey": "skiing-robot",
    "fileName": "L3_28_expansion_program.sb3",
    "path": "Level 4/Programming/Display & Movement/Skiing Robot/Program Example/L3_28_expansion_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "illumination-signals",
    "projectKey": "induction-desk-lamp",
    "fileName": "Lesson 13-Program Example.sb3",
    "path": "Level 4/Programming/Illumination & Signals/Induction Desk Lamp/Program Example/Lesson 13-Program Example.sb3"
  },
  {
    "level": 4,
    "categoryId": "interactive-mechanisms",
    "projectKey": "smart-luggage",
    "fileName": "Lesson 16-Program Example.sb3",
    "path": "Level 4/Programming/Interactive Mechanisms/Smart Luggage/Program Example/Lesson 16-Program Example.sb3"
  },
  {
    "level": 4,
    "categoryId": "interactive-mechanisms",
    "projectKey": "telegraph-machine",
    "fileName": "L4_09_basic_program.sb3",
    "path": "Level 4/Programming/Interactive Mechanisms/Telegraph machine/Program Example/L4_09_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "interactive-mechanisms",
    "projectKey": "telegraph-machine",
    "fileName": "L4_09_expansion_program.sb3",
    "path": "Level 4/Programming/Interactive Mechanisms/Telegraph machine/Program Example/L4_09_expansion_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "interactive-mechanisms",
    "projectKey": "voice-control",
    "fileName": "01.Voice Control.sb3",
    "path": "Level 4/Programming/Interactive Mechanisms/Voice Control/01.Voice Control.sb3"
  },
  {
    "level": 4,
    "categoryId": "interactive-systems",
    "projectKey": "basketball-shooting-machine",
    "fileName": "L3_27_basic_program.sb3",
    "path": "Level 4/Programming/Interactive Systems/Basketball Shooting Machine/Program Example/L3_27_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "interactive-systems",
    "projectKey": "basketball-shooting-machine",
    "fileName": "L3_27_expansion_program.sb3",
    "path": "Level 4/Programming/Interactive Systems/Basketball Shooting Machine/Program Example/L3_27_expansion_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "interactive-systems",
    "projectKey": "obstacle-avoidance-robot",
    "fileName": "L3_18_basic_program.sb3",
    "path": "Level 4/Programming/Interactive Systems/Obstacle Avoidance Robot/Program Example/L3_18_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "interactive-systems",
    "projectKey": "obstacle-avoidance-robot",
    "fileName": "L3_18_expansion_program.sb3",
    "path": "Level 4/Programming/Interactive Systems/Obstacle Avoidance Robot/Program Example/L3_18_expansion_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "interactive-systems",
    "projectKey": "reaction-tester",
    "fileName": "L3_19_basic_program.sb3",
    "path": "Level 4/Programming/Interactive Systems/Reaction Tester/Program Example/L3_19_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "interactive-systems",
    "projectKey": "reaction-tester",
    "fileName": "L3_19_expansion_program.sb3",
    "path": "Level 4/Programming/Interactive Systems/Reaction Tester/Program Example/L3_19_expansion_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "interactive-systems",
    "projectKey": "tumbler",
    "fileName": "1. Tumbler - complete program.sb3",
    "path": "Level 4/Programming/Interactive Systems/Tumbler/Program Example/1. Tumbler - complete program.sb3"
  },
  {
    "level": 4,
    "categoryId": "interactive-systems",
    "projectKey": "tumbler",
    "fileName": "1. Tumbler - reading value program.sb3",
    "path": "Level 4/Programming/Interactive Systems/Tumbler/Program Example/1. Tumbler - reading value program.sb3"
  },
  {
    "level": 4,
    "categoryId": "mechanisms-simulators",
    "projectKey": "biped-robot",
    "fileName": "Lesson20Program.sb3",
    "path": "Level 4/Programming/Mechanisms & Simulators/Biped Robot/Program Example/Lesson20Program.sb3"
  },
  {
    "level": 4,
    "categoryId": "mechanisms-simulators",
    "projectKey": "horizontal-bar",
    "fileName": "Lesson5_basic_program.sb3",
    "path": "Level 4/Programming/Mechanisms & Simulators/Horizontal Bar/Lesson5_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "mechanisms-simulators",
    "projectKey": "horizontal-bar",
    "fileName": "Lesson5_optimized_program.sb3",
    "path": "Level 4/Programming/Mechanisms & Simulators/Horizontal Bar/Lesson5_optimized_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "mechanisms-simulators",
    "projectKey": "oscillating-fan",
    "fileName": "L4_19_program.sb3",
    "path": "Level 4/Programming/Mechanisms & Simulators/Oscillating Fan/Program Example/L4_19_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "mechanisms-simulators",
    "projectKey": "spinning-cups",
    "fileName": "Lesson14Program.sb3",
    "path": "Level 4/Programming/Mechanisms & Simulators/Spinning Cups/Program Example/Lesson14Program.sb3"
  },
  {
    "level": 4,
    "categoryId": "mechanisms-simulators",
    "projectKey": "turbo-drop",
    "fileName": "Lesson28Program.sb3",
    "path": "Level 4/Programming/Mechanisms & Simulators/Turbo Drop/Program Example/Lesson28Program.sb3"
  },
  {
    "level": 4,
    "categoryId": "programming-precise-control",
    "projectKey": "obstacle-avoiding-scorpion",
    "fileName": "L4_01_basic_program.sb3",
    "path": "Level 4/Programming/Programming & Precise Control/Obstacle-avoiding Scorpion/Program Example/L4_01_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "programming-precise-control",
    "projectKey": "obstacle-avoiding-scorpion",
    "fileName": "L4_01_expansion_program.sb3",
    "path": "Level 4/Programming/Programming & Precise Control/Obstacle-avoiding Scorpion/Program Example/L4_01_expansion_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "sensor-focused-robots",
    "projectKey": "energy-detector",
    "fileName": "05.Energy Detector-Program Example.sb3",
    "path": "Level 4/Programming/Sensor-Focused Robots/Energy Detector/Program Example/05.Energy Detector-Program Example.sb3"
  },
  {
    "level": 4,
    "categoryId": "sensor-focused-robots",
    "projectKey": "ranging-robot",
    "fileName": "Ranging robot_program.sb2",
    "path": "Level 4/Programming/Sensor-Focused Robots/Ranging robot/Ranging robot_program.sb2"
  },
  {
    "level": 4,
    "categoryId": "sound-voice-interaction",
    "projectKey": "acoustic-control-lamp",
    "fileName": "06.Acoustic control lamp.sb2",
    "path": "Level 4/Programming/Sound & Voice Interaction/Acoustic control lamp/06.Acoustic control lamp.sb2"
  },
  {
    "level": 4,
    "categoryId": "sound-voice-interaction",
    "projectKey": "electric-piano",
    "fileName": "L3_32_basic_program.sb3",
    "path": "Level 4/Programming/Sound & Voice Interaction/Electric Piano/Program Example/L3_32_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "sound-voice-interaction",
    "projectKey": "electric-piano",
    "fileName": "L3_32_expansion_program.sb3",
    "path": "Level 4/Programming/Sound & Voice Interaction/Electric Piano/Program Example/L3_32_expansion_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "sound-voice-interaction",
    "projectKey": "smart-speaker",
    "fileName": "L3_30_basic_program.sb3",
    "path": "Level 4/Programming/Sound & Voice Interaction/Smart Speaker/Program Example/L3_30_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "sound-voice-interaction",
    "projectKey": "smart-speaker",
    "fileName": "L3_30_expansion_program.sb3",
    "path": "Level 4/Programming/Sound & Voice Interaction/Smart Speaker/Program Example/L3_30_expansion_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "vehicles-complex-movers",
    "projectKey": "dangerous-assassin",
    "fileName": "Lesson15_basic_program.sb3",
    "path": "Level 4/Programming/Vehicles & Complex Movers/Dangerous Assassin/Lesson15_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "vehicles-complex-movers",
    "projectKey": "dangerous-assassin",
    "fileName": "Lesson15_optimized_program.sb3",
    "path": "Level 4/Programming/Vehicles & Complex Movers/Dangerous Assassin/Lesson15_optimized_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "vehicles-complex-movers",
    "projectKey": "lucky-cat",
    "fileName": "L4_13_basic_program.sb3",
    "path": "Level 4/Programming/Vehicles & Complex Movers/Lucky Cat/Program Example/L4_13_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "vehicles-complex-movers",
    "projectKey": "lucky-cat",
    "fileName": "L4_13_expansion_program.sb3",
    "path": "Level 4/Programming/Vehicles & Complex Movers/Lucky Cat/Program Example/L4_13_expansion_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "vehicles-complex-movers",
    "projectKey": "remote-control-car",
    "fileName": "Lesson 4-Program Example.sb3",
    "path": "Level 4/Programming/Vehicles & Complex Movers/Remote Control Car/Program Example/Lesson 4-Program Example.sb3"
  },
  {
    "level": 4,
    "categoryId": "vehicles-complex-movers",
    "projectKey": "transformer-robot",
    "fileName": "L4_06_basic_program.sb3",
    "path": "Level 4/Programming/Vehicles & Complex Movers/Transformer Robot/Program Example/L4_06_basic_program.sb3"
  },
  {
    "level": 4,
    "categoryId": "vehicles-complex-movers",
    "projectKey": "transformer-robot",
    "fileName": "L4_06_expansion_program.sb3",
    "path": "Level 4/Programming/Vehicles & Complex Movers/Transformer Robot/Program Example/L4_06_expansion_program.sb3"
  }
];

const normal = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const byLesson = new Map<string, LegacyProgrammingFile[]>();
for (const source of legacyProgrammingSources) {
  const key = `${source.level}:${source.categoryId}:${source.projectKey}`;
  const url = "/" + source.path.split("/").map(encodeURIComponent).join("/");
  const current = byLesson.get(key) ?? [];
  current.push({ fileName: source.fileName, url });
  byLesson.set(key, current);
}

export function getLegacyProgrammingFiles(
  project: Pick<PracticalProject, "level" | "title" | "categoryId">,
): readonly LegacyProgrammingFile[] {
  if (project.level !== 1 && project.level !== 3 && project.level !== 4) return [];
  if (!project.categoryId) return [];
  // Some official projects offer separate Basic / Optimized lesson cards but
  // a single original program folder for the underlying robot.
  const projectKey = normal(project.title).replace(/-(basic|optimized|ratchet)$/, "");
  return byLesson.get(`${project.level}:${project.categoryId}:${projectKey}`) ?? [];
}
