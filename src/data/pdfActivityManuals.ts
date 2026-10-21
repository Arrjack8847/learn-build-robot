/** Original GitHub-uploaded PDF manuals, with no invented assembly steps. */
import cagedBirdUrl from "../../Caged Bird.pdf?url";
import funnyCatUrl from "../../FUNNY CAT.pdf?url";
import ferociousSnakeUrl from "../../Ferocious snake.pdf?url";
import shyPenguinUrl from "../../Shy penguin.pdf?url";
import sledDogUrl from "../../Sled dog.pdf?url";
import bigHeadRobotUrl from "../../Big head robot_Building.pdf?url";
import birdUrl from "../../Bird.pdf?url";
import firstRobotModelUrl from "../../First Robot Model.pdf?url";
import houseUrl from "../../House_Building.pdf?url";
import rexRobotUrl from "../../REX robot_Building.pdf?url";
import sledUrl from "../../Sled_Building.pdf?url";
import spiderUrl from "../../Spider.pdf?url";
import spongeBobUrl from "../../SpongeBob_Building.pdf?url";
import waliRobotUrl from "../../Wali robot.pdf?url";
import clockPdfUrl from "../../Clock_Building.pdf?url";
import drawingBoardPdfUrl from "../../Drawing board_Building.pdf?url";
import helloWorldPdfUrl from "../../01.Hello World-Building Manual.pdf?url";
import mechanicalMasksPdfUrl from "../../Mechanical masks.pdf?url";
import primitiveRobotPdfUrl from "../../Primitive robot_Building.pdf?url";
import athletePdfUrl from "../../Athlete.pdf?url";
import basicProgrammingPdfUrl from "../../Basic programming.pdf?url";
import drummerRobotPdfUrl from "../../Drummer robot.pdf?url";
import propellerAircraftPdfUrl from "../../Propeller Aircraft.pdf?url";
import sailboatPdfUrl from "../../Sailboat.pdf?url";
import lawnMowerPdfUrl from "../../The lawn mower.pdf?url";
import carPdfUrl from "../../Car.pdf?url";
import dynamicScreenPdfUrl from "../../Dynamic screen.pdf?url";
import pendulumRidePdfUrl from "../../Pendulum ride.pdf?url";
import rotatingFlyingChairPdfUrl from "../../Rotating flying chair.pdf?url";
import skatingPdfUrl from "../../Skating.pdf?url";
import windmillKingdomPdfUrl from "../../The windmill kingdom.pdf?url";
import crawlSlowlyBasicPdfUrl from "../../9. Crawl Slowly - Basic Building Manual.pdf?url";
import crawlSlowlyOptimizedPdfUrl from "../../9. Crawl Slowly - Optimized Building Manual.pdf?url";
import mechanicalArmPdfUrl from "../../Mechanical arm.pdf?url";
import shockAbsorberPdfUrl from "../../Shock absorber_Building.pdf?url";
import blinkingRobotPdfUrl from "../../Blinking robot_Building.pdf?url";
import colorChangingLightPdfUrl from "../../02.Color- changing  Light -Building Manual.pdf?url";
import corridorLampPdfUrl from "../../Corridor lamp_Building.pdf?url";
import helpLightPdfUrl from "../../Help light_Building.pdf?url";
import lighthousePdfUrl from "../../Lighthouse_Building.pdf?url";
import littleStarsPdfUrl from "../../Little stars_Building.pdf?url";
import trafficLightSignalPdfUrl from "../../Traffic light_Building.pdf?url";
import dartPdfUrl from "../../Dart.pdf?url";
import responderPdfUrl from "../../Responder_Building.pdf?url";
import wiperPdfUrl from "../../Wiper.pdf?url";
import gyroTransmitterPdfUrl from "../../Gyro transmitter_Building.pdf?url";
import motorcyclePdfUrl from "../../Motorcycle_Building.pdf?url";
import pullBackCarPdfUrl from "../../Pull back car_Building.pdf?url";
import handCrankingGiantStridePdfUrl from "../../Hand-cranking Giant Stride.pdf?url";
import hermitCrabPdfUrl from "../../Hermit Crab.pdf?url";
import littleOwlPdfUrl from "../../Little Owl.pdf?url";
import oscillatingFanPdfUrl from "../../Oscillating Fan.pdf?url";
import pocketPistolPdfUrl from "../../Pocket Pistol.pdf?url";
import pullbackBicyclePdfUrl from "../../Pullback Bicycle.pdf?url";
import rotatingCoffeeCupPdfUrl from "../../Rotating Coffee Cup.pdf?url";

export interface PdfActivityManual {
  id: string;
  title: string;
  url: string;
  completionStepId: string;
}

export const pdfActivityManuals: Record<string, PdfActivityManual> = {
  "caged-bird": {
    id: "caged-bird", title: "Caged Bird", url: cagedBirdUrl,
    completionStepId: "caged-bird-manual-complete",
  },
  "funny-cat": {
    id: "funny-cat", title: "Funny Cat", url: funnyCatUrl,
    completionStepId: "funny-cat-manual-complete",
  },
  "ferocious-snake": {
    id: "ferocious-snake", title: "Ferocious Snake", url: ferociousSnakeUrl,
    completionStepId: "ferocious-snake-manual-complete",
  },
  "shy-penguin": {
    id: "shy-penguin", title: "Shy Penguin", url: shyPenguinUrl,
    completionStepId: "shy-penguin-manual-complete",
  },
  "sled-dog": {
    id: "sled-dog", title: "Sled Dog", url: sledDogUrl,
    completionStepId: "sled-dog-manual-complete",
  },
  "big-head-robot": {
    id: "big-head-robot", title: "Big Head Robot", url: bigHeadRobotUrl,
    completionStepId: "big-head-robot-manual-complete",
  },
  "bird": {
    id: "bird", title: "Bird", url: birdUrl,
    completionStepId: "bird-manual-complete",
  },
  "first-robot-model": {
    id: "first-robot-model", title: "First Robot Model", url: firstRobotModelUrl,
    completionStepId: "first-robot-model-manual-complete",
  },
  "house": {
    id: "house", title: "House", url: houseUrl,
    completionStepId: "house-manual-complete",
  },
  "rex-robot": {
    id: "rex-robot", title: "REX Robot", url: rexRobotUrl,
    completionStepId: "rex-robot-manual-complete",
  },
  "sled": {
    id: "sled", title: "Sled", url: sledUrl,
    completionStepId: "sled-manual-complete",
  },
  "spider": {
    id: "spider", title: "Spider", url: spiderUrl,
    completionStepId: "spider-manual-complete",
  },
  "spongebob": {
    id: "spongebob", title: "SpongeBob", url: spongeBobUrl,
    completionStepId: "spongebob-manual-complete",
  },
  "wali-robot": {
    id: "wali-robot", title: "Wali Robot", url: waliRobotUrl,
    completionStepId: "wali-robot-manual-complete",
  },
  "clock": {
    id: "clock", title: "Clock", url: clockPdfUrl,
    completionStepId: "clock-manual-complete",
  },
  "drawing-board": {
    id: "drawing-board", title: "Drawing Board", url: drawingBoardPdfUrl,
    completionStepId: "drawing-board-manual-complete",
  },
  "hello-world": {
    id: "hello-world", title: "Hello World", url: helloWorldPdfUrl,
    completionStepId: "hello-world-manual-complete",
  },
  "mechanical-masks": {
    id: "mechanical-masks", title: "Mechanical Masks", url: mechanicalMasksPdfUrl,
    completionStepId: "mechanical-masks-manual-complete",
  },
  "primitive-robot": {
    id: "primitive-robot", title: "Primitive Robot", url: primitiveRobotPdfUrl,
    completionStepId: "primitive-robot-manual-complete",
  },
  "athlete": {
    id: "athlete", title: "Athlete", url: athletePdfUrl,
    completionStepId: "athlete-manual-complete",
  },
  "basic-programming": {
    id: "basic-programming", title: "Basic Programming", url: basicProgrammingPdfUrl,
    completionStepId: "basic-programming-manual-complete",
  },
  "drummer-robot": {
    id: "drummer-robot", title: "Drummer Robot", url: drummerRobotPdfUrl,
    completionStepId: "drummer-robot-manual-complete",
  },
  "propeller-aircraft": {
    id: "propeller-aircraft", title: "Propeller Aircraft", url: propellerAircraftPdfUrl,
    completionStepId: "propeller-aircraft-manual-complete",
  },
  "sailboat": {
    id: "sailboat", title: "Sailboat", url: sailboatPdfUrl,
    completionStepId: "sailboat-manual-complete",
  },
  "the-lawn-mower": {
    id: "the-lawn-mower", title: "The Lawn Mower", url: lawnMowerPdfUrl,
    completionStepId: "the-lawn-mower-manual-complete",
  },
  "car": {
    id: "car", title: "Car", url: carPdfUrl,
    completionStepId: "car-manual-complete",
  },
  "dynamic-screen": {
    id: "dynamic-screen", title: "Dynamic Screen", url: dynamicScreenPdfUrl,
    completionStepId: "dynamic-screen-manual-complete",
  },
  "pendulum-ride": {
    id: "pendulum-ride", title: "Pendulum Ride", url: pendulumRidePdfUrl,
    completionStepId: "pendulum-ride-manual-complete",
  },
  "rotating-flying-chair": {
    id: "rotating-flying-chair", title: "Rotating Flying Chair", url: rotatingFlyingChairPdfUrl,
    completionStepId: "rotating-flying-chair-manual-complete",
  },
  "skating": {
    id: "skating", title: "Skating", url: skatingPdfUrl,
    completionStepId: "skating-manual-complete",
  },
  "the-windmill-kingdom": {
    id: "the-windmill-kingdom", title: "The Windmill Kingdom", url: windmillKingdomPdfUrl,
    completionStepId: "the-windmill-kingdom-manual-complete",
  },
  "crawl-slowly-basic": {
    id: "crawl-slowly-basic", title: "Crawl Slowly — Basic", url: crawlSlowlyBasicPdfUrl,
    completionStepId: "crawl-slowly-basic-manual-complete",
  },
  "crawl-slowly-optimized": {
    id: "crawl-slowly-optimized", title: "Crawl Slowly — Optimized", url: crawlSlowlyOptimizedPdfUrl,
    completionStepId: "crawl-slowly-optimized-manual-complete",
  },
  "mechanical-arm": {
    id: "mechanical-arm", title: "Mechanical Arm", url: mechanicalArmPdfUrl,
    completionStepId: "mechanical-arm-manual-complete",
  },
  "shock-absorber": {
    id: "shock-absorber", title: "Shock Absorber", url: shockAbsorberPdfUrl,
    completionStepId: "shock-absorber-manual-complete",
  },
  "blinking-robot": {
    id: "blinking-robot", title: "Blinking Robot", url: blinkingRobotPdfUrl,
    completionStepId: "blinking-robot-manual-complete",
  },
  "color-changing-light": {
    id: "color-changing-light", title: "Color-Changing Light", url: colorChangingLightPdfUrl,
    completionStepId: "color-changing-light-manual-complete",
  },
  "corridor-lamp": {
    id: "corridor-lamp", title: "Corridor Lamp", url: corridorLampPdfUrl,
    completionStepId: "corridor-lamp-manual-complete",
  },
  "help-light": {
    id: "help-light", title: "Help Light", url: helpLightPdfUrl,
    completionStepId: "help-light-manual-complete",
  },
  "lighthouse": {
    id: "lighthouse", title: "Lighthouse", url: lighthousePdfUrl,
    completionStepId: "lighthouse-manual-complete",
  },
  "little-stars": {
    id: "little-stars", title: "Little Stars", url: littleStarsPdfUrl,
    completionStepId: "little-stars-manual-complete",
  },
  "traffic-light-signal": {
    id: "traffic-light-signal", title: "Traffic Light Signal", url: trafficLightSignalPdfUrl,
    completionStepId: "traffic-light-signal-manual-complete",
  },
  "dart": {
    id: "dart", title: "Dart", url: dartPdfUrl,
    completionStepId: "dart-manual-complete",
  },
  "responder": {
    id: "responder", title: "Responder", url: responderPdfUrl,
    completionStepId: "responder-manual-complete",
  },
  "wiper": {
    id: "wiper", title: "Wiper", url: wiperPdfUrl,
    completionStepId: "wiper-manual-complete",
  },
  "gyro-transmitter": {
    id: "gyro-transmitter", title: "Gyro Transmitter", url: gyroTransmitterPdfUrl,
    completionStepId: "gyro-transmitter-manual-complete",
  },
  "motorcycle": {
    id: "motorcycle", title: "Motorcycle", url: motorcyclePdfUrl,
    completionStepId: "motorcycle-manual-complete",
  },
  "pull-back-car": {
    id: "pull-back-car", title: "Pull Back Car", url: pullBackCarPdfUrl,
    completionStepId: "pull-back-car-manual-complete",
  },
  "hand-cranking-giant-stride": {
    id: "hand-cranking-giant-stride", title: "Hand-Cranking Giant Stride", url: handCrankingGiantStridePdfUrl,
    completionStepId: "hand-cranking-giant-stride-manual-complete",
  },
  "hermit-crab": {
    id: "hermit-crab", title: "Hermit Crab", url: hermitCrabPdfUrl,
    completionStepId: "hermit-crab-manual-complete",
  },
  "little-owl": {
    id: "little-owl", title: "Little Owl", url: littleOwlPdfUrl,
    completionStepId: "little-owl-manual-complete",
  },
  "oscillating-fan": {
    id: "oscillating-fan", title: "Oscillating Fan", url: oscillatingFanPdfUrl,
    completionStepId: "oscillating-fan-manual-complete",
  },
  "pocket-pistol": {
    id: "pocket-pistol", title: "Pocket Pistol", url: pocketPistolPdfUrl,
    completionStepId: "pocket-pistol-manual-complete",
  },
  "pullback-bicycle": {
    id: "pullback-bicycle", title: "Pullback Bicycle", url: pullbackBicyclePdfUrl,
    completionStepId: "pullback-bicycle-manual-complete",
  },
  "rotating-coffee-cup": {
    id: "rotating-coffee-cup", title: "Rotating Coffee Cup", url: rotatingCoffeeCupPdfUrl,
    completionStepId: "rotating-coffee-cup-manual-complete",
  },
};

export function isPdfActivityProject(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(pdfActivityManuals, id);
}
