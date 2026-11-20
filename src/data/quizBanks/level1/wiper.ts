/**
 * Level 1 official Building-PDF-as-Learning source-text question candidate.
 * Diagram-dependent claims and pedagogical review remain blocked pending visuals.
 * Unregistered content only; does not change shared quiz functionality.
 */
import type { QuizBank } from "../../quizStudio";

export const wiperBank: QuizBank = {
  "projectId": "wiper",
  "title": "Wiper",
  "sourcePdfPath": "public/Wiper.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "wiper-01",
      "topic": "rain-safety-context",
      "prompt": "What problem makes a car wiper important in the lesson story?",
      "choices": [
        "The car radio stops working",
        "The headlights change colour",
        "Heavy rain reduces the driver's visibility",
        "The engine runs out of fuel"
      ],
      "correctIndex": 2,
      "learningSlide": 4,
      "explanation": "The story describes a downpour that makes it hard for the driver to see ahead.",
      "hint": "Think about what the driver cannot see in the story."
    },
    {
      "id": "wiper-02",
      "topic": "rain-safety-context",
      "prompt": "Which car component is the model based on?",
      "choices": [
        "The steering wheel",
        "The door handle",
        "The side mirror",
        "The windshield wiper"
      ],
      "correctIndex": 3,
      "learningSlide": 4,
      "explanation": "The project explicitly asks students to build a wiper.",
      "hint": "The story involves removing rain from the view ahead."
    },
    {
      "id": "wiper-03",
      "topic": "linkage-mechanism",
      "prompt": "Which mechanism does the wiper lesson identify as a key learning topic?",
      "choices": [
        "An eccentric linkage",
        "A buoyancy tank",
        "A solar cell array",
        "A fixed tripod"
      ],
      "correctIndex": 0,
      "learningSlide": 3,
      "explanation": "The manual names link mechanisms and eccentric links as core concepts.",
      "hint": "Look for the special type of link in the learning objectives."
    },
    {
      "id": "wiper-04",
      "topic": "linkage-mechanism",
      "prompt": "Which mechanism does the lesson ask students to recognize as moving the wiper?",
      "choices": [
        "A springless fixed rod",
        "A linkage",
        "A sail",
        "A light beam"
      ],
      "correctIndex": 1,
      "learningSlide": 6,
      "explanation": "The assessment asks whether the wiper moves through a linkage.",
      "hint": "Consider the mechanism named in the outcome review."
    },
    {
      "id": "wiper-05",
      "topic": "assembly",
      "prompt": "Which construction detail is emphasized for the eccentric link?",
      "choices": [
        "Using no connectors",
        "Skipping all assembly steps",
        "Keeping the intended fixed distance and build sequence",
        "Changing all dimensions at random"
      ],
      "correctIndex": 2,
      "learningSlide": 3,
      "explanation": "The lesson stresses the fixed distance and correct building sequence of an eccentric link.",
      "hint": "Think about two assembly checks stated in the key points."
    },
    {
      "id": "wiper-06",
      "topic": "assembly",
      "prompt": "During hands-on practice, what mechanism does the teacher also explain?",
      "choices": [
        "A boat rudder",
        "A telephone keypad",
        "A photo display",
        "Gearing in the wiper model"
      ],
      "correctIndex": 3,
      "learningSlide": 5,
      "explanation": "The hands-on step explicitly asks the teacher to explain the wiper's gearing.",
      "hint": "Recall the mechanical explanation included in the building activity."
    },
    {
      "id": "wiper-07",
      "topic": "motor-speed",
      "prompt": "Which component is controlled through the programming module?",
      "choices": [
        "The motor",
        "A paper label",
        "The seat cushion",
        "The computer mouse"
      ],
      "correctIndex": 0,
      "learningSlide": 5,
      "explanation": "The lesson teaches students to set the motor module.",
      "hint": "Think about which part makes the wiper move."
    },
    {
      "id": "wiper-08",
      "topic": "motor-speed",
      "prompt": "What value is adjusted to change how fast the wiper runs?",
      "choices": [
        "Seat height",
        "Speed value",
        "Print font size",
        "Cage colour"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "explanation": "The hands-on instructions direct students to debug the speed value.",
      "hint": "Think about the debugging instruction that changes motion."
    },
    {
      "id": "wiper-09",
      "topic": "programming",
      "prompt": "Which programming structure is included in the wiper learning objectives?",
      "choices": [
        "No instructions",
        "Image-only sequencing",
        "Sequential programming",
        "Random sequencing"
      ],
      "correctIndex": 2,
      "learningSlide": 3,
      "explanation": "The teaching objectives require understanding sequential programming.",
      "hint": "Recall the stated skill about command order."
    },
    {
      "id": "wiper-10",
      "topic": "programming",
      "prompt": "How does the lesson instruct students to connect the controller to a computer?",
      "choices": [
        "With a rubber band",
        "With a gear alone",
        "With a paper hinge",
        "With a USB cable"
      ],
      "correctIndex": 3,
      "learningSlide": 5,
      "explanation": "The manual describes using a USB cable to connect the controller to the computer.",
      "hint": "The connection method is named alongside programming instructions."
    }
  ]
};
