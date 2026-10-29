/** Derived from the supplied Level 2 Building PDF used as Learning fallback. Source uses a teacher guide plus illustrated construction steps. */
import type { QuizBank } from "../../quizStudio";
export const fareGateBank: QuizBank = {
  "projectId": "level-2-fare-gate",
  "title": "Fare Gate",
  "sourcePdfPath": "public/Fare Gate.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "fareGate-01",
      "topic": "ticket-system",
      "learningSlide": 4,
      "prompt": "What must a subway passenger do at the fare gate in the lesson?",
      "choices": [
        "Remove the motor",
        "Climb over the gate",
        "Open the gear case",
        "Swipe the fare or ticket"
      ],
      "correctIndex": 3,
      "explanation": "The Fare Gate teaching manual identifies this in its ticket system lesson (page 4): swipe the fare or ticket.",
      "hint": "Think about the role of ticket system in the model."
    },
    {
      "id": "fareGate-02",
      "topic": "ticket-system",
      "learningSlide": 4,
      "prompt": "What is the fare gate designed to control?",
      "choices": [
        "Room heating",
        "Passenger entry",
        "Water flow",
        "Bridge height"
      ],
      "correctIndex": 1,
      "explanation": "The Fare Gate teaching manual identifies this in its ticket system lesson (page 4): passenger entry.",
      "hint": "Think about the role of ticket system in the model."
    },
    {
      "id": "fareGate-03",
      "topic": "grayscale",
      "learningSlide": 3,
      "prompt": "Which sensor is a main learning focus?",
      "choices": [
        "A barometer",
        "A humidity sensor",
        "A sound-only microphone",
        "A grayscale integrated sensor"
      ],
      "correctIndex": 3,
      "explanation": "The Fare Gate teaching manual identifies this in its grayscale lesson (page 3): a grayscale integrated sensor.",
      "hint": "Think about the role of grayscale in the model."
    },
    {
      "id": "fareGate-04",
      "topic": "grayscale",
      "learningSlide": 5,
      "prompt": "What should learners tune to improve gate accuracy?",
      "choices": [
        "The ticket's weight",
        "The grayscale sensor's value or threshold",
        "The frame's color",
        "The number of train windows"
      ],
      "correctIndex": 1,
      "explanation": "The Fare Gate teaching manual identifies this in its grayscale lesson (page 5): the grayscale sensor's value or threshold.",
      "hint": "Think about the role of grayscale in the model."
    },
    {
      "id": "fareGate-05",
      "topic": "closed-loop",
      "learningSlide": 3,
      "prompt": "Which motor type is listed in the lesson objectives?",
      "choices": [
        "Wind-only motor",
        "Hydraulic pump",
        "Solar lamp",
        "Closed-loop motor"
      ],
      "correctIndex": 3,
      "explanation": "The Fare Gate teaching manual identifies this in its closed loop lesson (page 3): closed-loop motor.",
      "hint": "Think about the role of closed loop in the model."
    },
    {
      "id": "fareGate-06",
      "topic": "closed-loop",
      "learningSlide": 3,
      "prompt": "Which system is used to move the gate according to control instructions?",
      "choices": [
        "A rope with no drive",
        "A controlled motor",
        "A fixed poster",
        "A glass window"
      ],
      "correctIndex": 1,
      "explanation": "The Fare Gate teaching manual identifies this in its closed loop lesson (page 3): a controlled motor.",
      "hint": "Think about the role of closed loop in the model."
    },
    {
      "id": "fareGate-07",
      "topic": "led-display",
      "learningSlide": 3,
      "prompt": "Which display component is named alongside the grayscale sensor?",
      "choices": [
        "Paper map",
        "Mechanical clock",
        "Compass",
        "LED lattice screen"
      ],
      "correctIndex": 3,
      "explanation": "The Fare Gate teaching manual identifies this in its led display lesson (page 3): lED lattice screen.",
      "hint": "Think about the role of led display in the model."
    },
    {
      "id": "fareGate-08",
      "topic": "led-display",
      "learningSlide": 3,
      "prompt": "Which type of display is taught for showing gate information?",
      "choices": [
        "A pliers handle",
        "An LED matrix/lattice",
        "A magnifying lens",
        "A fan blade"
      ],
      "correctIndex": 1,
      "explanation": "The Fare Gate teaching manual identifies this in its led display lesson (page 3): an LED matrix/lattice.",
      "hint": "Think about the role of led display in the model."
    },
    {
      "id": "fareGate-09",
      "topic": "programming",
      "learningSlide": 5,
      "prompt": "What type of programming interface does the guide introduce?",
      "choices": [
        "Handwritten machine code only",
        "A camera filter",
        "Manual paint patterns",
        "Graphical programming blocks"
      ],
      "correctIndex": 3,
      "explanation": "The Fare Gate teaching manual identifies this in its programming lesson (page 5): graphical programming blocks.",
      "hint": "Think about the role of programming in the model."
    },
    {
      "id": "fareGate-10",
      "topic": "programming",
      "learningSlide": 5,
      "prompt": "Which motor-related task should students learn?",
      "choices": [
        "Keep the gate permanently unpowered",
        "Set the motor module correctly",
        "Remove all instructions",
        "Use the motor as a light bulb"
      ],
      "correctIndex": 1,
      "explanation": "The Fare Gate teaching manual identifies this in its programming lesson (page 5): set the motor module correctly.",
      "hint": "Think about the role of programming in the model."
    }
  ]
};
