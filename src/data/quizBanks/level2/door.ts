/** Level 2 question bank drafted from the original teaching slides (19 pages). */
import type { QuizBank } from "../../quizStudio";
export const doorBank: QuizBank = {
  "projectId": "level-2-door",
  "title": "Door",
  "sourcePdfPath": "public/Level 2/Learning/Mechanisms & Simulators/Door/Door_Powerpoint.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "doo01",
      "topic": "worm-purpose",
      "learningSlide": 6,
      "prompt": "What transmission is central to the Door lesson?",
      "choices": [
        "A worm gear",
        "A hydraulic fan",
        "A belt only",
        "A speaker diaphragm"
      ],
      "correctIndex": 0,
      "explanation": "The lesson on slide 6 explains a worm gear.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "doo02",
      "topic": "worm-purpose",
      "learningSlide": 6,
      "prompt": "Why is strong speed reduction useful for the Door?",
      "choices": [
        "It makes the door fly",
        "It removes all friction",
        "It blocks the motor from turning",
        "It helps the door move slowly and steadily"
      ],
      "correctIndex": 3,
      "explanation": "The lesson on slide 6 explains it helps the door move slowly and steadily.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "doo03",
      "topic": "gear-ratio",
      "learningSlide": 9,
      "prompt": "What ratio is given as a common worm-gear reduction?",
      "choices": [
        "1:20 acceleration only",
        "About 2:3 only",
        "About 20:1",
        "Exactly 1:1"
      ],
      "correctIndex": 2,
      "explanation": "The lesson on slide 9 explains about 20:1.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "doo04",
      "topic": "gear-ratio",
      "learningSlide": 9,
      "prompt": "Can a worm gear provide much higher reductions than 20:1?",
      "choices": [
        "It cannot reduce speed",
        "Yes, the lesson mentions 300:1 or more",
        "No, all worm gears are fixed at 1:1",
        "Only if the wheel is made of paper"
      ],
      "correctIndex": 1,
      "explanation": "The lesson on slide 9 explains yes, the lesson mentions 300:1 or more.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "doo05",
      "topic": "self-lock",
      "learningSlide": 10,
      "prompt": "What direction of driving is easy in the lesson's typical worm gear?",
      "choices": [
        "The worm drives the wheel",
        "The wheel always drives the worm",
        "The controller drives a camera",
        "The door drives an LED"
      ],
      "correctIndex": 0,
      "explanation": "The lesson on slide 10 explains the worm drives the wheel.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "doo06",
      "topic": "self-lock",
      "learningSlide": 10,
      "prompt": "What helps prevent the gear from turning the worm backward?",
      "choices": [
        "Brighter light",
        "Wheel color",
        "A loose axle",
        "Friction and the shallow screw angle"
      ],
      "correctIndex": 3,
      "explanation": "The lesson on slide 10 explains friction and the shallow screw angle.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "doo07",
      "topic": "smoothness",
      "learningSlide": 11,
      "prompt": "Which characteristic does the lesson list for worm drives?",
      "choices": [
        "Perfect efficiency with no loss",
        "Only straight-line movement",
        "Steady transmission with large gear ratios",
        "No contact between teeth"
      ],
      "correctIndex": 2,
      "explanation": "The lesson on slide 11 explains steady transmission with large gear ratios.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "doo08",
      "topic": "smoothness",
      "learningSlide": 11,
      "prompt": "Why is worm gearing suitable for a compact reduction drive?",
      "choices": [
        "It has no gear teeth",
        "It can achieve a large ratio in a compact arrangement",
        "It requires no rotating elements",
        "It never uses a shaft"
      ],
      "correctIndex": 1,
      "explanation": "The lesson on slide 11 explains it can achieve a large ratio in a compact arrangement.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "doo09",
      "topic": "trade-offs",
      "learningSlide": 12,
      "prompt": "What is meant by self-locking in the worm-drive example?",
      "choices": [
        "The worm wheel cannot readily drive the worm backward",
        "The motor always turns at double speed",
        "The worm wheel spins freely both directions",
        "The door cannot ever move"
      ],
      "correctIndex": 0,
      "explanation": "The lesson on slide 12 explains the worm wheel cannot readily drive the worm backward.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "doo10",
      "topic": "trade-offs",
      "learningSlide": 13,
      "prompt": "Which disadvantage does the lesson warn about?",
      "choices": [
        "No power is transmitted",
        "No friction exists",
        "The gear ratio never changes",
        "Lower efficiency and significant wear"
      ],
      "correctIndex": 3,
      "explanation": "The lesson on slide 13 explains lower efficiency and significant wear.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    }
  ]
};
