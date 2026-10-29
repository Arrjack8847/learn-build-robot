/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const firstRobotModelBank: QuizBank = {
  "projectId": "first-robot-model",
  "title": "First Robot Model",
  "sourcePdfPath": "public/Level 1/Learning/Characters & Structures/First Robot Model/First Robot Model.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "first-robot-model-01",
      "topic": "robot-introduction",
      "learningSlide": 6,
      "prompt": "Which type of robot receives special attention in the lesson introduction?",
      "choices": [
        "Humanoid robots",
        "Underwater submarines",
        "Space telescopes",
        "Wind turbines"
      ],
      "correctIndex": 0,
      "hint": "Recall which human-like design is discussed.",
      "explanation": "The lesson highlights humanoid robots in educational settings."
    },
    {
      "id": "first-robot-model-02",
      "topic": "robot-introduction",
      "learningSlide": 6,
      "prompt": "What does the lesson say helps students become familiar with robot parts?",
      "choices": [
        "Consistent practice",
        "Avoiding all assembly",
        "Changing the robot name",
        "Using only pictures"
      ],
      "correctIndex": 0,
      "hint": "Think about how skills improve between lessons.",
      "explanation": "The lesson emphasizes repeated practice and memorization of components."
    },
    {
      "id": "first-robot-model-03",
      "topic": "robot-components",
      "learningSlide": 1,
      "prompt": "Which of these is listed as a sensor in the robot kit?",
      "choices": [
        "Touch sensor",
        "Cardboard ruler",
        "Rubber eraser",
        "Notebook paper"
      ],
      "correctIndex": 0,
      "hint": "Look for an electronic sensing component named in the introduction.",
      "explanation": "The kit introduction lists touch sensors among its components."
    },
    {
      "id": "first-robot-model-04",
      "topic": "robot-components",
      "learningSlide": 1,
      "prompt": "How can students control a built robot according to the introduction?",
      "choices": [
        "With graphical programming software",
        "Only by moving every part by hand",
        "Only with a paper instruction card",
        "By leaving out the controller"
      ],
      "correctIndex": 0,
      "hint": "Think about the tool used after assembly.",
      "explanation": "The introduction explains that graphical programming software can program the robot."
    },
    {
      "id": "first-robot-model-05",
      "topic": "building-connections",
      "learningSlide": 8,
      "prompt": "Which pair of parts is explicitly shown as a building connection?",
      "choices": [
        "Beam and peg",
        "Paper and glue",
        "Cloth and ribbon",
        "Magnet and tape"
      ],
      "correctIndex": 0,
      "hint": "Review the examples of connections taught in the lesson.",
      "explanation": "The parts-building slide lists beam-and-peg connections."
    },
    {
      "id": "first-robot-model-06",
      "topic": "building-connections",
      "learningSlide": 8,
      "prompt": "Which pair is another connection method shown in the lesson?",
      "choices": [
        "Gear and axle",
        "Battery and wooden stick",
        "Screen and marker pen",
        "Wheel and paper fan"
      ],
      "correctIndex": 0,
      "hint": "Look for the other mechanical joining example on the slide.",
      "explanation": "The same slide lists gear-and-axle as a way of connecting parts."
    },
    {
      "id": "first-robot-model-07",
      "topic": "mechanical-parts",
      "learningSlide": 9,
      "prompt": "Which two mechanical parts can mesh with one another according to the slide?",
      "choices": [
        "Gear and gear",
        "Battery and beam",
        "Touchscreen and peg",
        "Cable and sticker"
      ],
      "correctIndex": 0,
      "hint": "Think about two toothed rotating pieces.",
      "explanation": "The parts-building lesson explicitly includes gear-to-gear joining."
    },
    {
      "id": "first-robot-model-08",
      "topic": "mechanical-parts",
      "learningSlide": 9,
      "prompt": "Which additional part is named in the building-method lesson?",
      "choices": [
        "Block",
        "Fan belt only",
        "Plastic straw only",
        "Paint brush only"
      ],
      "correctIndex": 0,
      "hint": "Recall another piece besides gears and pegs.",
      "explanation": "The slide includes a block among the parts used for building."
    },
    {
      "id": "first-robot-model-09",
      "topic": "assembly-quality",
      "learningSlide": 11,
      "prompt": "Which condition is listed for the first robot model's assembly?",
      "choices": [
        "Stable structure",
        "Loose structure",
        "Unbalanced weight",
        "Random shape"
      ],
      "correctIndex": 0,
      "hint": "Choose a quality goal from the assembly checklist.",
      "explanation": "The task lists a stable structure as a requirement."
    },
    {
      "id": "first-robot-model-10",
      "topic": "assembly-quality",
      "learningSlide": 11,
      "prompt": "What should the builder consider along with stability and matching shape?",
      "choices": [
        "Proper gravity/balance",
        "Adding the most decorations possible",
        "Removing connecting pieces",
        "Using mismatched pieces"
      ],
      "correctIndex": 0,
      "hint": "Recall the middle item in the three-part assembly checklist.",
      "explanation": "The lesson's assembly requirements include proper gravity or balance."
    }
  ]
};
