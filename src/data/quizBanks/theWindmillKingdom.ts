/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const theWindmillKingdomBank: QuizBank = {
  "projectId": "the-windmill-kingdom",
  "title": "The Windmill Kingdom",
  "sourcePdfPath": "public/Level 1/Learning/Manipulators/The windmill kingdom.pdf",
  "sourcePageCount": 29,
  "questions": [
    {
      "id": "the-windmill-kingdom-01",
      "topic": "windmill-setting",
      "learningSlide": 3,
      "prompt": "Which country is the lesson's windmill setting?",
      "choices": [
        "Netherlands",
        "Brazil",
        "Japan",
        "Canada"
      ],
      "correctIndex": 0,
      "hint": "Recall the country associated with tulips and windmills.",
      "explanation": "The lesson introduces Dutch windmills in the Netherlands."
    },
    {
      "id": "the-windmill-kingdom-02",
      "topic": "windmill-setting",
      "learningSlide": 3,
      "prompt": "Which flower is mentioned along with windmills in the country introduction?",
      "choices": [
        "Tulips",
        "Lotus flowers",
        "Sunflowers",
        "Orchids"
      ],
      "correctIndex": 0,
      "hint": "Think of the landscape described in the introduction.",
      "explanation": "The Netherlands is described as famous for windmills and tulips."
    },
    {
      "id": "the-windmill-kingdom-03",
      "topic": "motor-vs-wind",
      "learningSlide": 5,
      "prompt": "What ordinarily drives a real windmill?",
      "choices": [
        "Wind",
        "A colour screen",
        "An infrared sensor",
        "A drawing pen"
      ],
      "correctIndex": 0,
      "hint": "Consider the natural energy source.",
      "explanation": "The lesson says real windmills are driven by wind."
    },
    {
      "id": "the-windmill-kingdom-04",
      "topic": "motor-vs-wind",
      "learningSlide": 6,
      "prompt": "What drives the classroom windmill when there is too little wind?",
      "choices": [
        "Motor",
        "Magnetic compass",
        "Sound speaker",
        "A touch sensor"
      ],
      "correctIndex": 0,
      "hint": "Recall the substitute for natural wind.",
      "explanation": "The class uses a motor because indoor wind is too weak."
    },
    {
      "id": "the-windmill-kingdom-05",
      "topic": "gearing-and-torque",
      "learningSlide": 8,
      "prompt": "How does the lesson make the windmill output gear rotate faster?",
      "choices": [
        "Use a large driving gear to drive a small pinion",
        "Use a small gear to drive a larger output gear",
        "Remove the driving gear entirely",
        "Keep every gear fixed in place"
      ],
      "correctIndex": 0,
      "hint": "Compare the sizes of the driving and driven gears.",
      "explanation": "The gear-acceleration slide describes a large gear driving a smaller pinion."
    },
    {
      "id": "the-windmill-kingdom-06",
      "topic": "gearing-and-torque",
      "learningSlide": 8,
      "prompt": "What trade-off accompanies the increased output speed?",
      "choices": [
        "Output torque decreases",
        "Output torque becomes infinite",
        "The motor uses no energy",
        "All gears stop turning"
      ],
      "correctIndex": 0,
      "hint": "The lesson contrasts speed with another mechanical quantity.",
      "explanation": "The source says increasing pinion speed this way reduces output torque."
    },
    {
      "id": "the-windmill-kingdom-07",
      "topic": "construction-rules",
      "learningSlide": 10,
      "prompt": "Which property should the windmill blades have?",
      "choices": [
        "Centrosymmetry",
        "Uneven random placement",
        "Only one blade pointing down",
        "No common centre"
      ],
      "correctIndex": 0,
      "hint": "Think about balanced blade arrangement.",
      "explanation": "The construction notes call for centrosymmetric windmill blades."
    },
    {
      "id": "the-windmill-kingdom-08",
      "topic": "construction-rules",
      "learningSlide": 20,
      "prompt": "Which controller port is used for the windmill's motor?",
      "choices": [
        "Port A",
        "Port 1 for the sensor only",
        "Audio port",
        "Power button"
      ],
      "correctIndex": 0,
      "hint": "Recall the motor cable instruction.",
      "explanation": "The source connects the windmill motor to controller port A."
    },
    {
      "id": "the-windmill-kingdom-09",
      "topic": "motor-programming",
      "learningSlide": 23,
      "prompt": "How can a motor run for two seconds without using a single timed-rotation block?",
      "choices": [
        "Turn on, wait two seconds, then turn off",
        "Leave it running without a stop command",
        "Set a random screen image",
        "Reverse every motor immediately"
      ],
      "correctIndex": 0,
      "hint": "Consider three commands that can give a timed run.",
      "explanation": "The lesson gives start–wait–stop as an alternative to a timed motor block."
    },
    {
      "id": "the-windmill-kingdom-10",
      "topic": "motor-programming",
      "learningSlide": 25,
      "prompt": "How does the lesson indicate reverse rotation in the motor power parameter?",
      "choices": [
        "Put a minus sign before the power value",
        "Use a question mark",
        "Write the motor name twice",
        "Delete the power value"
      ],
      "correctIndex": 0,
      "hint": "Recall the symbol attached to the numerical setting.",
      "explanation": "The lesson uses a negative sign before the power parameter to reverse rotation."
    }
  ]
};
