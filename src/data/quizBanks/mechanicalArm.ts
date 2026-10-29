/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const mechanicalArmBank: QuizBank = {
  "projectId": "mechanical-arm",
  "title": "Mechanical Arm",
  "sourcePdfPath": "public/Level 1/Learning/Mechanisms & Simulators/Mechanical arm/Mechanical arm_PowerPoint-R.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "mechanical-arm-01",
      "topic": "robot-generations",
      "learningSlide": 5,
      "prompt": "How does the lesson describe a first-generation robot?",
      "choices": [
        "An intelligent decision-making system",
        "A self-repairing machine",
        "A robot that uses many sensors for planning",
        "A remote-controlled operator"
      ],
      "correctIndex": 3,
      "hint": "Recall the simplest generation in the lesson's list.",
      "explanation": "The first generation is described as a remote-control operator."
    },
    {
      "id": "mechanical-arm-02",
      "topic": "robot-generations",
      "learningSlide": 5,
      "prompt": "What distinguishes the second generation of robots in the lesson?",
      "choices": [
        "Automatic repeated actions following a pre-programmed program",
        "Only remote manual operation",
        "Planning every action from live sensor analysis",
        "No instructions or control at all"
      ],
      "correctIndex": 0,
      "hint": "Think about stored instructions and repeated work.",
      "explanation": "The second generation performs repeated operations under a pre-programmed program."
    },
    {
      "id": "mechanical-arm-03",
      "topic": "autonomous-intelligence",
      "learningSlide": 5,
      "prompt": "Which generation is described as using sensors and intelligent technology to plan decisions?",
      "choices": [
        "Second generation exclusively",
        "Third generation",
        "First generation",
        "Only mechanical tools"
      ],
      "correctIndex": 1,
      "hint": "Compare the three generations by their control methods.",
      "explanation": "The third generation uses environmental information and intelligent processing."
    },
    {
      "id": "mechanical-arm-04",
      "topic": "autonomous-intelligence",
      "learningSlide": 5,
      "prompt": "Why do third-generation robots use sensors?",
      "choices": [
        "To fasten pegs without tools",
        "To replace the power supply with paper",
        "To acquire information about their environment",
        "To paint beams a new colour"
      ],
      "correctIndex": 2,
      "hint": "Consider the information needed to decide what to do.",
      "explanation": "The source describes sensors and gauges gathering environmental information."
    },
    {
      "id": "mechanical-arm-05",
      "topic": "arm-functions",
      "learningSlide": 6,
      "prompt": "What can the mechanical arm's gears help increase in the project?",
      "choices": [
        "Screen brightness",
        "Battery charging speed",
        "Sound volume",
        "Clipping or gripping power"
      ],
      "correctIndex": 3,
      "hint": "Think about the gripper at the end of the arm.",
      "explanation": "The introduction says the arm uses gears to increase the power of its clips."
    },
    {
      "id": "mechanical-arm-06",
      "topic": "arm-functions",
      "learningSlide": 6,
      "prompt": "Why does the project use a long telescopic arm?",
      "choices": [
        "To grip objects farther away",
        "To display a larger picture",
        "To make a louder speaker",
        "To detect colours without a sensor"
      ],
      "correctIndex": 0,
      "hint": "Think about the object's distance from the robot.",
      "explanation": "The lesson describes a telescopic arm reaching to clip more distant objects."
    },
    {
      "id": "mechanical-arm-07",
      "topic": "construction-methods",
      "learningSlide": 8,
      "prompt": "Which part is shown as being fixed with a bushing?",
      "choices": [
        "Battery case",
        "Axle",
        "Touchscreen",
        "Sound speaker"
      ],
      "correctIndex": 1,
      "hint": "Recall the 'bushing fixed' building method.",
      "explanation": "The teaching slide includes a bushing used to fix an axle."
    },
    {
      "id": "mechanical-arm-08",
      "topic": "construction-methods",
      "learningSlide": 8,
      "prompt": "Which mechanical part does the building-method lesson show being fixed?",
      "choices": [
        "Sound sensor window",
        "Power button",
        "Gear",
        "Motor display"
      ],
      "correctIndex": 2,
      "hint": "Look at the building method involving a rotating transmission part.",
      "explanation": "The slide includes a gear-fixing example with an axle and bushing."
    },
    {
      "id": "mechanical-arm-09",
      "topic": "building-and-application",
      "learningSlide": 10,
      "prompt": "Which condition is part of the mechanical arm's assembly requirements?",
      "choices": [
        "Loose structure",
        "Poor gravity balance",
        "Any shape without matching",
        "Stable structure"
      ],
      "correctIndex": 3,
      "hint": "Think about the practical-task checklist.",
      "explanation": "The task requires stable structure, proper gravity and matching shape."
    },
    {
      "id": "mechanical-arm-10",
      "topic": "building-and-application",
      "learningSlide": 13,
      "prompt": "What extension task does the lesson suggest for the mechanical arm?",
      "choices": [
        "Explain which robot generation it belongs to and how it could improve",
        "Remove every connecting pin",
        "Avoid discussing applications",
        "Build only an unrelated drawing board"
      ],
      "correctIndex": 0,
      "hint": "Recall the homework prompt about generations and use cases.",
      "explanation": "The homework asks students to identify the generation and imagine second- or third-generation improvements."
    }
  ]
};
