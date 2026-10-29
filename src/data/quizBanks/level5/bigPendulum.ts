/** Ten questions checked against the official 20-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const bigPendulumBank: QuizBank = {
  "projectId": "level-5-big-pendulum",
  "title": "Big Pendulum",
  "sourcePdfPath": "public/Level 5/Learning/Mechanisms & Simulators/Big Pendulum/26. The Big Pendulum-Teaching Slides.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "level-5-big-pendulum-01",
      "topic": "pendulum-motion",
      "learningSlide": 7,
      "prompt": "Which movement of the boom makes the big pendulum ride swing?",
      "choices": [
        "The boom swings back and forth like a pendulum",
        "The boom stays fixed while the base moves",
        "The boom moves only vertically",
        "The boom travels in a straight horizontal path"
      ],
      "correctIndex": 0,
      "hint": "Think about the long arm of the ride.",
      "explanation": "Slide 7 identifies the boom's swinging pendulum motion as the source of the ride's movement."
    },
    {
      "id": "level-5-big-pendulum-02",
      "topic": "pendulum-motion",
      "learningSlide": 7,
      "prompt": "In the lesson's simple pendulum model, which two main elements are described?",
      "choices": [
        "Two conveyor belts",
        "A pendulum ball and a suspending line",
        "A wheel and a steering rack",
        "Two electric motors"
      ],
      "correctIndex": 1,
      "hint": "Look for what hangs and what holds it.",
      "explanation": "Slide 7 describes the idealized simple pendulum with a ball and suspending line (called a cycloid in the slides)."
    },
    {
      "id": "level-5-big-pendulum-03",
      "topic": "ride-safety",
      "learningSlide": 5,
      "prompt": "A big-pendulum seat belt is damaged. What does the lesson say to do?",
      "choices": [
        "Ride carefully without fastening it",
        "Try to repair it during the ride",
        "Tell the staff and refuse to ride",
        "Ask another rider to hold the belt"
      ],
      "correctIndex": 2,
      "hint": "Which action prevents a dangerous ride?",
      "explanation": "Slide 5 instructs riders to inform staff and refuse the ride if the belt is damaged or the seat cannot be secured."
    },
    {
      "id": "level-5-big-pendulum-04",
      "topic": "ride-safety",
      "learningSlide": 19,
      "prompt": "According to the lesson, what serves as the usual main restraint on a big-pendulum ride?",
      "choices": [
        "The rider's hands",
        "The footrest alone",
        "The seat belt alone",
        "A shoulder restraint, with a seat belt as secondary protection"
      ],
      "correctIndex": 3,
      "hint": "The slide distinguishes the main restraint from secondary protection.",
      "explanation": "Slide 19 says the shoulder restraint is usually primary, with the seat belt as secondary protection."
    },
    {
      "id": "level-5-big-pendulum-05",
      "topic": "model-mechanism",
      "learningSlide": 10,
      "prompt": "Which two motions does the classroom big-pendulum model demonstrate?",
      "choices": [
        "A swinging boom and a rotating seat cabin",
        "A rising platform and a rolling wheel",
        "A stationary seat and a moving floor",
        "A fixed boom and a sliding base"
      ],
      "correctIndex": 0,
      "hint": "Find the two parts that move.",
      "explanation": "Slide 10 instructs students to build a model whose boom swings and whose seat cabin rotates."
    },
    {
      "id": "level-5-big-pendulum-06",
      "topic": "model-mechanism",
      "learningSlide": 10,
      "prompt": "Why does the model use 2-by-4 building blocks connected to the large motor?",
      "choices": [
        "To make the cockpit lights blink",
        "To move the boom to its lowest starting position",
        "To count passengers",
        "To measure atmospheric pressure"
      ],
      "correctIndex": 1,
      "hint": "Think about what must happen before the swing starts.",
      "explanation": "Slide 10 describes these blocks as an initialization handle to lower and initialize the boom position."
    },
    {
      "id": "level-5-big-pendulum-07",
      "topic": "initialization",
      "learningSlide": 11,
      "prompt": "Which part of the boom's planned swing does the flowchart discussion treat as initialization?",
      "choices": [
        "From one highest side to the other highest side repeatedly",
        "Only rotating the seat cabin",
        "From the lowest point toward the highest point",
        "A complete stop after every swing"
      ],
      "correctIndex": 2,
      "hint": "The lesson separates the first movement from the repeating loop.",
      "explanation": "Slide 11 treats the movement from the lowest to the highest position as initialization before the repeated side-to-side swing."
    },
    {
      "id": "level-5-big-pendulum-08",
      "topic": "initialization",
      "learningSlide": 12,
      "prompt": "Which motor direction values are used in the initialization instructions?",
      "choices": [
        "100 for clockwise and 80 for counterclockwise",
        "10 for clockwise and 20 for counterclockwise",
        "0 for clockwise and 2 for counterclockwise",
        "1 for clockwise and -1 for counterclockwise"
      ],
      "correctIndex": 3,
      "hint": "The two direction values have opposite signs.",
      "explanation": "Slide 12 assigns 1 to clockwise steering and -1 to counterclockwise steering."
    },
    {
      "id": "level-5-big-pendulum-09",
      "topic": "speed-control",
      "learningSlide": 14,
      "prompt": "The program decreases a speed value by 2 every 0.02 seconds. Starting at 100, what is the value after three decreases?",
      "choices": [
        "94",
        "90",
        "98",
        "96"
      ],
      "correctIndex": 0,
      "hint": "Subtract two three times.",
      "explanation": "Slide 14 specifies a decrease of 2 every 0.02 seconds: 100 - 2 - 2 - 2 = 94."
    },
    {
      "id": "level-5-big-pendulum-10",
      "topic": "speed-control",
      "learningSlide": 18,
      "prompt": "Which idea does the lesson suggest for improving how the boom returns to its starting position?",
      "choices": [
        "Keep motor power at its maximum continuously",
        "Use motor position information or a sensor to find the lowest point",
        "Remove the boom from the model",
        "Ignore the starting position"
      ],
      "correctIndex": 1,
      "hint": "How could the robot recognize where its boom is?",
      "explanation": "Slide 18 suggests recording motor position or using a sensor to detect the lowest boom position during initialization."
    }
  ]
};
