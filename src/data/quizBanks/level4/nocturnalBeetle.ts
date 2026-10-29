/** Level 4 — Nocturnal beetle. Questions checked against the 21-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const nocturnalBeetleBank: QuizBank = {
  "projectId": "level-4-nocturnal-beetle",
  "title": "Nocturnal beetle",
  "sourcePdfPath": "public/Level 4/Biomimicry & Stimulus Response/Nocturnal beetle/10.Nocturnal beetle-update.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "l4-nocturnalbeetle-01",
      "topic": "beetle-response",
      "learningSlide": 6,
      "prompt": "What kind of stimulus do beetles often respond to in the lesson?",
      "choices": [
        "Magnetic fields",
        "Light",
        "Sound only",
        "Pressure only"
      ],
      "correctIndex": 1,
      "explanation": "Slide 6 describes beetles as sensitive to light.",
      "hint": "Think about a behavior caused by brightness."
    },
    {
      "id": "l4-nocturnalbeetle-02",
      "topic": "beetle-response",
      "learningSlide": 7,
      "prompt": "Which robot behavior does the Nocturnal Beetle model imitate?",
      "choices": [
        "Following a barcode",
        "Counting people",
        "Opening a gate",
        "Moving toward light"
      ],
      "correctIndex": 3,
      "explanation": "Slide 7 makes the model light-loving using its sensor.",
      "hint": "Think about how an insect might react to a lamp."
    },
    {
      "id": "l4-nocturnalbeetle-03",
      "topic": "light-thresholds",
      "learningSlide": 2,
      "prompt": "Which measurement does the lesson ask students to compare with a threshold?",
      "choices": [
        "Light value",
        "Motor color",
        "Water level",
        "Wheel weight"
      ],
      "correctIndex": 0,
      "explanation": "Slide 2 focuses on measuring light and understanding thresholds.",
      "hint": "Think about a number returned by a sensor."
    },
    {
      "id": "l4-nocturnalbeetle-04",
      "topic": "light-thresholds",
      "learningSlide": 9,
      "prompt": "What happens to the lesson's light value when light intensity grows?",
      "choices": [
        "It becomes smaller",
        "It stays zero",
        "It becomes larger",
        "It changes to a letter"
      ],
      "correctIndex": 2,
      "explanation": "Slide 9 states that a stronger light gives a greater measured light value.",
      "hint": "Compare a bright and dim area."
    },
    {
      "id": "l4-nocturnalbeetle-05",
      "topic": "subroutine-basics",
      "learningSlide": 10,
      "prompt": "What is a subroutine?",
      "choices": [
        "A robot wheel",
        "A color of light",
        "A saved reusable part of a program",
        "A broken motor"
      ],
      "correctIndex": 2,
      "explanation": "Slide 10 describes combining program modules into a reusable subroutine.",
      "hint": "Think about using the same instructions again."
    },
    {
      "id": "l4-nocturnalbeetle-06",
      "topic": "subroutine-basics",
      "learningSlide": 13,
      "prompt": "What can students do with a saved subroutine?",
      "choices": [
        "Reuse it in another program",
        "Turn it into a battery",
        "Delete all sensors",
        "Make the robot heavier"
      ],
      "correctIndex": 0,
      "explanation": "Slide 13 describes saving a subroutine and importing it elsewhere.",
      "hint": "Think about avoiding repeated work."
    },
    {
      "id": "l4-nocturnalbeetle-07",
      "topic": "assembly-checks",
      "learningSlide": 15,
      "prompt": "Which rule should be followed when building the beetle?",
      "choices": [
        "Leave the frame loose",
        "Remove all support",
        "Ignore the model's shape",
        "Keep its structure stable"
      ],
      "correctIndex": 3,
      "explanation": "Slide 15 lists a stable structure.",
      "hint": "The finished robot needs to move without falling apart."
    },
    {
      "id": "l4-nocturnalbeetle-08",
      "topic": "assembly-checks",
      "learningSlide": 15,
      "prompt": "What should the model's final shape match?",
      "choices": [
        "The light bulb color",
        "The intended design",
        "The classroom wall",
        "The teacher's computer"
      ],
      "correctIndex": 1,
      "explanation": "Slide 15 includes matching the model's intended shape.",
      "hint": "Compare the model with the planned build."
    },
    {
      "id": "l4-nocturnalbeetle-09",
      "topic": "sensor-decisions",
      "learningSlide": 17,
      "prompt": "Which programming ideas appear in the Beetle robot's program diagram?",
      "choices": [
        "Variables and logical relationships",
        "Only drawing tools",
        "GPS navigation only",
        "Music composition"
      ],
      "correctIndex": 0,
      "explanation": "Slide 17 labels variables and logical relationships.",
      "hint": "The robot needs to remember readings and choose actions."
    },
    {
      "id": "l4-nocturnalbeetle-10",
      "topic": "sensor-decisions",
      "learningSlide": 18,
      "prompt": "What should program debugging help the Beetle robot achieve?",
      "choices": [
        "A louder speaker",
        "Automatic ticket printing",
        "Its response to light",
        "A stronger magnet"
      ],
      "correctIndex": 2,
      "explanation": "Slide 18 asks students to debug until the beetle's phototaxis behavior works.",
      "hint": "Think about the main behavior this robot models."
    }
  ]
};
