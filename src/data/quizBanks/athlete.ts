/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const athleteBank: QuizBank = {
  "projectId": "athlete",
  "title": "Athlete",
  "sourcePdfPath": "public/Level 1/Learning/Foundational Robots/Athlete.pdf",
  "sourcePageCount": 29,
  "questions": [
    {
      "id": "athlete-01",
      "topic": "gymnastics-motion",
      "learningSlide": 3,
      "prompt": "Which apparatus is the Athlete project based on?",
      "choices": [
        "Horizontal bar",
        "Balance bicycle",
        "Swimming pool",
        "Skating ramp"
      ],
      "correctIndex": 0,
      "hint": "Recall the artistic gymnastics event.",
      "explanation": "The lesson describes the horizontal or high bar."
    },
    {
      "id": "athlete-02",
      "topic": "gymnastics-motion",
      "learningSlide": 3,
      "prompt": "Which movement is central to the horizontal-bar routine?",
      "choices": [
        "Swinging",
        "Underwater paddling",
        "Rolling wheels",
        "Sailing with wind"
      ],
      "correctIndex": 0,
      "hint": "Think about how gymnasts move on the apparatus.",
      "explanation": "The introduction says the horizontal-bar routine consists of swinging movements."
    },
    {
      "id": "athlete-03",
      "topic": "hinged-structures",
      "learningSlide": 5,
      "prompt": "What two shapes are compared in the hinged-connection experiment?",
      "choices": [
        "Triangle and quadrilateral",
        "Circle and sphere",
        "Cone and cylinder",
        "Cube and pyramid"
      ],
      "correctIndex": 0,
      "hint": "Recall the two beam shapes constructed with pins.",
      "explanation": "Experiment 1 compares hinged triangular and quadrilateral frames."
    },
    {
      "id": "athlete-04",
      "topic": "hinged-structures",
      "learningSlide": 6,
      "prompt": "Which hinged shape resists deformation better in the experiment?",
      "choices": [
        "Triangle",
        "Quadrilateral",
        "Open chain",
        "Single loose rod"
      ],
      "correctIndex": 0,
      "hint": "Think about which frame kept its shape.",
      "explanation": "The experiment concludes that a hinged triangle is stable."
    },
    {
      "id": "athlete-05",
      "topic": "rigid-structures",
      "learningSlide": 7,
      "prompt": "Which type of hole is used to test a more rigid quadrilateral connection?",
      "choices": [
        "Cross hole",
        "Round hole only",
        "Charging socket",
        "Screen hole"
      ],
      "correctIndex": 0,
      "hint": "Compare the second experiment with hinged connections.",
      "explanation": "Experiment 2 tests a quadrilateral built with cross holes."
    },
    {
      "id": "athlete-06",
      "topic": "rigid-structures",
      "learningSlide": 8,
      "prompt": "When can a quadrilateral also make a stable horizontal-bar support?",
      "choices": [
        "When its connections are rigid",
        "When all joints are loose",
        "When it has no beams",
        "When one side is removed"
      ],
      "correctIndex": 0,
      "hint": "The second experiment changes how corners are connected.",
      "explanation": "A quadrilateral is stable in the rigid-connection case described."
    },
    {
      "id": "athlete-07",
      "topic": "motors-and-controls",
      "learningSlide": 9,
      "prompt": "How many motors make up the athlete model's body?",
      "choices": [
        "Two",
        "One",
        "Three",
        "Four"
      ],
      "correctIndex": 0,
      "hint": "Look at the construction notes for the body.",
      "explanation": "The lesson's body design uses two motors with five-hole plates between them."
    },
    {
      "id": "athlete-08",
      "topic": "motors-and-controls",
      "learningSlide": 19,
      "prompt": "Which ports connect the athlete's two motors?",
      "choices": [
        "A and B",
        "1 and 2 only",
        "USB-C and headphone",
        "M5 and M6"
      ],
      "correctIndex": 0,
      "hint": "Recall the lettered motor-port labels.",
      "explanation": "The construction instructions connect the motors to controller ports A and B."
    },
    {
      "id": "athlete-09",
      "topic": "repetition-and-extension",
      "learningSlide": 23,
      "prompt": "Which block helps repeat a foot-swing movement continuously?",
      "choices": [
        "Repeat forever",
        "Stop program",
        "Download audio",
        "Clear screen"
      ],
      "correctIndex": 0,
      "hint": "Think about keeping a single movement going.",
      "explanation": "The lesson places repeated movement commands inside a 'repeat forever' block."
    },
    {
      "id": "athlete-10",
      "topic": "repetition-and-extension",
      "learningSlide": 25,
      "prompt": "How can the same program control the athlete's arm instead of its foot?",
      "choices": [
        "Change the motor interface/port in the block",
        "Remove all motor commands",
        "Switch to a light sensor",
        "Replace the controller with a gear"
      ],
      "correctIndex": 0,
      "hint": "Focus on selecting a different actuator.",
      "explanation": "The coding section directs students to change the motor interface to control the arm."
    }
  ]
};
