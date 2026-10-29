/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const rexRobotBank: QuizBank = {
  "projectId": "rex-robot",
  "title": "REX Robot",
  "sourcePdfPath": "public/Level 1/Learning/Characters & Structures/REX robot/REX robot_PowerPoint-R.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "rex-robot-01",
      "topic": "robot-identity",
      "learningSlide": 6,
      "prompt": "What role does the lesson give the REX robot?",
      "choices": [
        "Police officer",
        "Sailboat captain",
        "Gardener",
        "Astronaut"
      ],
      "correctIndex": 0,
      "hint": "Recall the character's profession in the introduction.",
      "explanation": "REX is introduced as a strong police robot."
    },
    {
      "id": "rex-robot-02",
      "topic": "robot-identity",
      "learningSlide": 6,
      "prompt": "What does the name REX signify in the lesson?",
      "choices": [
        "King",
        "Bird",
        "River",
        "Clock"
      ],
      "correctIndex": 0,
      "hint": "The introduction explains the meaning behind this robot's name.",
      "explanation": "The course introduction says REX has a name meaning 'king'."
    },
    {
      "id": "rex-robot-03",
      "topic": "electronic-devices",
      "learningSlide": 8,
      "prompt": "Which item is listed as an electronic component?",
      "choices": [
        "Touch sensor",
        "Plain beam",
        "Unpowered peg",
        "Mechanical axle"
      ],
      "correctIndex": 0,
      "hint": "Think about a part that can sense an input.",
      "explanation": "The electronic components slide includes a touch sensor."
    },
    {
      "id": "rex-robot-04",
      "topic": "electronic-devices",
      "learningSlide": 8,
      "prompt": "Which motor sizes appear in the REX component list?",
      "choices": [
        "Large and medium motors",
        "Only miniature motors",
        "Only hydraulic motors",
        "Only wind-driven motors"
      ],
      "correctIndex": 0,
      "hint": "Recall the two motor categories on the slide.",
      "explanation": "The electronic components include large and medium motors."
    },
    {
      "id": "rex-robot-05",
      "topic": "beam-types",
      "learningSlide": 9,
      "prompt": "How are straight beams named in this lesson?",
      "choices": [
        "By their number of holes",
        "By their paint colour only",
        "By their mass in kilograms",
        "By their shape's temperature"
      ],
      "correctIndex": 0,
      "hint": "Look at the rule for 'n-beam'.",
      "explanation": "Straight beams are described by hole count, such as Beam 7M."
    },
    {
      "id": "rex-robot-06",
      "topic": "beam-types",
      "learningSlide": 9,
      "prompt": "What is a Beam 7M in the lesson's terminology?",
      "choices": [
        "A straight beam identified by its hole count",
        "A gear with seven teeth",
        "A sensor with seven ports",
        "A battery with seven cells"
      ],
      "correctIndex": 0,
      "hint": "Consider the naming scheme for straight beams.",
      "explanation": "The beam lesson uses Beam 7M as a straight-beam example."
    },
    {
      "id": "rex-robot-07",
      "topic": "connectors-and-axles",
      "learningSlide": 10,
      "prompt": "What is the main purpose of peg parts?",
      "choices": [
        "Connecting different parts",
        "Making electronic sounds",
        "Sensing colour",
        "Storing programs"
      ],
      "correctIndex": 0,
      "hint": "Recall how pieces are joined in a structure.",
      "explanation": "The peg slide defines pegs as connectors between parts."
    },
    {
      "id": "rex-robot-08",
      "topic": "connectors-and-axles",
      "learningSlide": 11,
      "prompt": "Which part is described as having a stop?",
      "choices": [
        "Axle with stop",
        "Colour sensor",
        "Screen block",
        "Speaker"
      ],
      "correctIndex": 0,
      "hint": "The lesson distinguishes two related shaft types.",
      "explanation": "It lists both a cross axle and an axle with stop."
    },
    {
      "id": "rex-robot-09",
      "topic": "gears-and-assembly",
      "learningSlide": 13,
      "prompt": "Which part is included in the REX gear list?",
      "choices": [
        "Worm gear",
        "Touch sensor",
        "Battery slot",
        "Display screen"
      ],
      "correctIndex": 0,
      "hint": "Look for a transmission component.",
      "explanation": "The gear slide lists worm gears among gear types."
    },
    {
      "id": "rex-robot-10",
      "topic": "gears-and-assembly",
      "learningSlide": 15,
      "prompt": "What is required when assembling the REX robot?",
      "choices": [
        "Stable structure and matching shape",
        "Loose connections and arbitrary balance",
        "Only decoration with no structure",
        "No consideration of balance"
      ],
      "correctIndex": 0,
      "hint": "Think about the practice checklist.",
      "explanation": "The REX assembly task requires a stable structure, proper gravity and matching shape."
    }
  ]
};
