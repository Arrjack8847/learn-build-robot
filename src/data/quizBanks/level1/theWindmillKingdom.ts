/**
 * Source-text-grounded Level 1 Learning PDF quiz candidate.
 * Diagram and visual-review approval pending; not registered in Quiz Studio.
 */
import type { QuizBank } from "../../quizStudio";

export const theWindmillKingdomBank: QuizBank = {
  "projectId": "the-windmill-kingdom",
  "title": "The Windmill Kingdom",
  "sourcePdfPath": "public/Level 1/Learning/Manipulators/The windmill kingdom.pdf",
  "sourcePageCount": 29,
  "questions": [
    {
      "id": "the-windmill-kingdom-01",
      "topic": "wind-powered-motion",
      "learningSlide": 5,
      "prompt": "What gives a real windmill the energy to turn?",
      "choices": [
        "Sunlight on the roof",
        "Moving air",
        "A computer screen",
        "A battery in the sails"
      ],
      "correctIndex": 1,
      "hint": "Think about the weather that makes the blades move.",
      "explanation": "The lesson explains that a real windmill is driven by wind."
    },
    {
      "id": "the-windmill-kingdom-02",
      "topic": "wind-powered-motion",
      "learningSlide": 5,
      "prompt": "Why does the classroom windmill need a different power source?",
      "choices": [
        "The air in the classroom is too still",
        "It uses only water",
        "Its blades are made of paper",
        "A controller cannot run motors"
      ],
      "correctIndex": 0,
      "hint": "Consider how much wind blows inside a classroom.",
      "explanation": "The lesson says the classroom has too little wind to turn the model."
    },
    {
      "id": "the-windmill-kingdom-03",
      "topic": "model-power-and-control",
      "learningSlide": 6,
      "prompt": "What can turn the classroom windmill when the air is still?",
      "choices": [
        "A colour sensor",
        "A motor",
        "A plastic shield",
        "An alarm speaker"
      ],
      "correctIndex": 1,
      "hint": "Look for the electrical part that can make a shaft spin.",
      "explanation": "The classroom model uses a motor for motion instead of wind."
    },
    {
      "id": "the-windmill-kingdom-04",
      "topic": "model-power-and-control",
      "learningSlide": 20,
      "prompt": "Which RCU port does the lesson use for the windmill motor?",
      "choices": [
        "Port P8",
        "The charging socket",
        "Port A",
        "The sound output"
      ],
      "correctIndex": 2,
      "hint": "Recall the connection cable's lettered port.",
      "explanation": "The motor is connected to controller port A in the project."
    },
    {
      "id": "the-windmill-kingdom-05",
      "topic": "gearing-and-torque",
      "learningSlide": 8,
      "prompt": "How does the lesson make the windmill output gear rotate faster?",
      "choices": [
        "Remove the driving gear entirely",
        "Keep every gear fixed in place",
        "Use a large driving gear to drive a small pinion",
        "Use a small gear to drive a larger output gear"
      ],
      "correctIndex": 2,
      "hint": "Compare the sizes of the driving and driven gears.",
      "explanation": "The gear-acceleration slide describes a large gear driving a smaller pinion."
    },
    {
      "id": "the-windmill-kingdom-06",
      "topic": "gearing-and-torque",
      "learningSlide": 8,
      "prompt": "What trade-off accompanies the increased output speed?",
      "choices": [
        "Output torque becomes infinite",
        "The motor uses no energy",
        "All gears stop turning",
        "Output torque decreases"
      ],
      "correctIndex": 3,
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
      "learningSlide": 10,
      "prompt": "Which building requirement helps the windmill stay steady when it spins?",
      "choices": [
        "Loose supports",
        "Stable overall structure",
        "Unequal blades on one side",
        "Detached motor"
      ],
      "correctIndex": 1,
      "hint": "Think about how to prevent the model from shaking.",
      "explanation": "The building plan asks for stability of the overall windmill."
    },
    {
      "id": "the-windmill-kingdom-09",
      "topic": "motor-programming",
      "learningSlide": 23,
      "prompt": "How can a motor run for two seconds without using a single timed-rotation block?",
      "choices": [
        "Set a random screen image",
        "Reverse every motor immediately",
        "Turn on, wait two seconds, then turn off",
        "Leave it running without a stop command"
      ],
      "correctIndex": 2,
      "hint": "Consider three commands that can give a timed run.",
      "explanation": "The lesson gives start–wait–stop as an alternative to a timed motor block."
    },
    {
      "id": "the-windmill-kingdom-10",
      "topic": "motor-programming",
      "learningSlide": 25,
      "prompt": "How does the lesson indicate reverse rotation in the motor power parameter?",
      "choices": [
        "Use a question mark",
        "Write the motor name twice",
        "Delete the power value",
        "Put a minus sign before the power value"
      ],
      "correctIndex": 3,
      "hint": "Recall the symbol attached to the numerical setting.",
      "explanation": "The lesson uses a negative sign before the power parameter to reverse rotation."
    }
  ]
};
