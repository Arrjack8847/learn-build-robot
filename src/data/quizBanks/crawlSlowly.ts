/** Source: 28-page Crawl Slowly — Basic Learning PDF. Diagrams await visual QA. */
import type { QuizBank } from "../quizStudio";
export const crawlSlowlyBasicBank: QuizBank = {
  "projectId": "crawl-slowly-basic",
  "title": "Crawl Slowly — Basic",
  "sourcePdfPath": "public/Level 1/Learning/Mechanisms & Simulators/Crawl Slowly/9. Crawl Slowly - Slides.pdf",
  "sourcePageCount": 28,
  "questions": [
    {
      "id": "crawl-slowly-basic-01",
      "topic": "caterpillar",
      "learningSlide": 2,
      "prompt": "What type of robot does the Crawl Slowly lesson build?",
      "choices": [
        "A flying drone",
        "A robotic hand",
        "A caterpillar robot",
        "A submarine"
      ],
      "correctIndex": 2,
      "explanation": "The objectives explicitly describe building a caterpillar robot.",
      "hint": "Think about the slow crawling insect used as inspiration."
    },
    {
      "id": "crawl-slowly-basic-02",
      "topic": "caterpillar",
      "learningSlide": 2,
      "prompt": "What kind of movement does students' program aim to control?",
      "choices": [
        "Crawling and steering",
        "Only vertical jumping",
        "Only spinning a propeller",
        "Only moving a gripper"
      ],
      "correctIndex": 0,
      "explanation": "The objective includes programming crawling and steering.",
      "hint": "Consider the basic movement needed to follow a curved path."
    },
    {
      "id": "crawl-slowly-basic-03",
      "topic": "linkage",
      "learningSlide": 7,
      "prompt": "What can a linkage mechanism do with motor rotation?",
      "choices": [
        "Turn sound into colored light",
        "Change a pressure reading into altitude",
        "Turn a photo into a music file",
        "Turn rotation into back-and-forth leg swinging"
      ],
      "correctIndex": 3,
      "explanation": "The slide explains that linkages change motor rotation to reciprocating leg motion.",
      "hint": "Think about how turning gears can make legs move."
    },
    {
      "id": "crawl-slowly-basic-04",
      "topic": "linkage",
      "learningSlide": 10,
      "prompt": "Which mechanism is named in the caterpillar's building example?",
      "choices": [
        "Hydraulic cylinder",
        "Crank–rocker mechanism",
        "Rack-based steering",
        "Pendulum clock escapement"
      ],
      "correctIndex": 1,
      "explanation": "The building slide identifies a crank–rocker mechanism.",
      "hint": "Recall the linkage that moves the crawler legs."
    },
    {
      "id": "crawl-slowly-basic-05",
      "topic": "gear",
      "learningSlide": 8,
      "prompt": "What happens when a large driving gear turns a smaller driven gear?",
      "choices": [
        "Speed decreases and torque increases",
        "Speed increases and torque decreases",
        "Both speed and torque become zero",
        "Speed stays unchanged regardless of tooth count"
      ],
      "correctIndex": 1,
      "explanation": "The acceleration explanation pairs faster movement with less torque.",
      "hint": "Think about the difference between a big gear and a small gear's turns."
    },
    {
      "id": "crawl-slowly-basic-06",
      "topic": "gear",
      "learningSlide": 8,
      "prompt": "What is a benefit of driving a larger gear with a smaller gear?",
      "choices": [
        "Faster movement with less torque",
        "No change in transmitted motion",
        "Automatic change of motor direction every second",
        "Slower movement with more torque"
      ],
      "correctIndex": 3,
      "explanation": "The deceleration transmission increases torque while reducing speed.",
      "hint": "Think about the stronger turning force used when resistance is high."
    },
    {
      "id": "crawl-slowly-basic-07",
      "topic": "ratchet",
      "learningSlide": 15,
      "prompt": "What does a ratchet mechanism help the caterpillar do?",
      "choices": [
        "Move one way without slipping backward",
        "Measure the distance to a wall",
        "Flash colored lights",
        "Change its sensor port"
      ],
      "correctIndex": 0,
      "explanation": "The lesson adds ratchets to prevent backward rolling.",
      "hint": "Think of a device that allows motion in only one direction."
    },
    {
      "id": "crawl-slowly-basic-08",
      "topic": "ratchet",
      "learningSlide": 17,
      "prompt": "Which everyday tool is shown as a ratchet mechanism application?",
      "choices": [
        "Pressure gauge",
        "Music speaker",
        "Ratchet wrench",
        "Photo frame"
      ],
      "correctIndex": 2,
      "explanation": "Slide 17 presents a ratchet wrench as an application.",
      "hint": "Think of a tool that tightens a fastener in small back-and-forth movements."
    },
    {
      "id": "crawl-slowly-basic-09",
      "topic": "improve",
      "learningSlide": 20,
      "prompt": "Which ratchet detail does the optimization task ask students to consider?",
      "choices": [
        "Lamp color choice",
        "Sound file name",
        "Pawl installation direction",
        "Camera brightness"
      ],
      "correctIndex": 2,
      "explanation": "The slide asks about the direction of the ratchet pawl.",
      "hint": "Remember the small part that catches the ratchet teeth."
    },
    {
      "id": "crawl-slowly-basic-10",
      "topic": "improve",
      "learningSlide": 21,
      "prompt": "Which turning parameter does the optimization task ask students to adjust?",
      "choices": [
        "Controller clock time",
        "Middle motor's rotation angle",
        "Number of music tracks",
        "Color sensor hue"
      ],
      "correctIndex": 1,
      "explanation": "The optimization discussion asks for an appropriate middle motor angle.",
      "hint": "Think about how much the steering mechanism needs to turn."
    }
  ]
};
