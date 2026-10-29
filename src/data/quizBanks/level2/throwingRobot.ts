/** Source text validated against the official Level 2 Throwing robot PDF (18 pages). */
import type { QuizBank } from "../../quizStudio";

export const throwingRobotBank: QuizBank = {
  "projectId": "level-2-throwing-robot",
  "title": "Throwing robot",
  "sourcePdfPath": "public/Level 2/Learning/Action-Oriented/Throwing robot/Throwing robot_Powerpoint.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "thr01",
      "topic": "throwing-physics",
      "learningSlide": 6,
      "prompt": "Which sporting activity is listed as an example of throwing?",
      "choices": [
        "Throwing a javelin",
        "Swimming freestyle",
        "Cycling uphill",
        "Climbing a rope"
      ],
      "correctIndex": 0,
      "hint": "Think of sports where an object leaves the athlete's hand.",
      "explanation": "Slide 6 lists throwing javelins and rugby among examples of throwing movements."
    },
    {
      "id": "thr02",
      "topic": "throwing-physics",
      "learningSlide": 6,
      "prompt": "What shape does the lesson associate with the trajectory of a thrown object?",
      "choices": [
        "Straight vertical line",
        "Parabola",
        "Perfect square",
        "Closed circle"
      ],
      "correctIndex": 1,
      "hint": "Imagine tracing the path of an object after it is released.",
      "explanation": "Slide 6 explicitly describes the throwing trajectory as a parabola."
    },
    {
      "id": "thr03",
      "topic": "throwing-robot-parts",
      "learningSlide": 7,
      "prompt": "What part powers the Throwing Robot's imitation of an ancient slinger?",
      "choices": [
        "Large motor used as a servo",
        "An ultrasonic microphone",
        "An infrared distance sensor",
        "A passive wheel with no motor"
      ],
      "correctIndex": 0,
      "hint": "Look for the powered part connected to the throwing arm.",
      "explanation": "Slide 7 describes using a large motor as the servo motor with an elastic rod attached."
    },
    {
      "id": "thr04",
      "topic": "throwing-robot-parts",
      "learningSlide": 7,
      "prompt": "Why is the RCU positioned in the center of the Throwing Robot?",
      "choices": [
        "To hold a camera",
        "To maintain the model's balance",
        "To collect thrown objects",
        "To replace the elastic rod"
      ],
      "correctIndex": 1,
      "hint": "Consider how the central placement affects the center of gravity.",
      "explanation": "Slide 7 says the RCU is placed in the middle to keep the center of gravity balanced."
    },
    {
      "id": "thr05",
      "topic": "angle-types",
      "learningSlide": 9,
      "prompt": "What is the measure of a right angle in the lesson?",
      "choices": [
        "45 degrees",
        "90 degrees",
        "180 degrees",
        "360 degrees"
      ],
      "correctIndex": 1,
      "hint": "Think about one quarter of a complete rotation.",
      "explanation": "Slide 9 identifies the right angle as 90 degrees."
    },
    {
      "id": "thr06",
      "topic": "angle-types",
      "learningSlide": 9,
      "prompt": "Which angle range is classified as obtuse in the lesson?",
      "choices": [
        "Greater than 0 and less than 90 degrees",
        "Exactly 90 degrees",
        "Greater than 90 and less than 180 degrees",
        "Exactly 360 degrees"
      ],
      "correctIndex": 2,
      "hint": "Compare the angle with a right angle and a flat angle.",
      "explanation": "Slide 9 defines the obtuse range as 90° < x < 180°."
    },
    {
      "id": "thr07",
      "topic": "angle-adjustment",
      "learningSlide": 10,
      "prompt": "What change is suggested by the folding method when an estimated motor angle is too large or small?",
      "choices": [
        "Multiply by two or divide by two",
        "Add exactly 100 degrees every time",
        "Reverse the motor wires",
        "Leave the initial value unchanged"
      ],
      "correctIndex": 0,
      "hint": "Think of a large first adjustment before fine tuning.",
      "explanation": "Slide 10 explains that the folding method doubles or halves the estimated angle while respecting device limits."
    },
    {
      "id": "thr08",
      "topic": "angle-adjustment",
      "learningSlide": 10,
      "prompt": "What is the approximate size of the final fine-adjustment step in the lesson?",
      "choices": [
        "One full rotation",
        "Exactly 90 degrees",
        "Around plus or minus 5 degrees",
        "Half a complete turn"
      ],
      "correctIndex": 2,
      "hint": "This is a small correction after the larger estimate and folding adjustments.",
      "explanation": "Slide 10 says to fine-tune the mechanical position by about ±5°."
    },
    {
      "id": "thr09",
      "topic": "programming-practice",
      "learningSlide": 14,
      "prompt": "Which group of angles is explicitly suggested for Throwing Robot programming practice?",
      "choices": [
        "30°, 45°, 90°",
        "60°, 120°, 240°",
        "180°, 270°, 360°",
        "15°, 150°, 300°"
      ],
      "correctIndex": 0,
      "hint": "Find the examples given in the programming task.",
      "explanation": "Slide 14 asks students to program and debug common angles such as 30°, 45°, and 90°."
    },
    {
      "id": "thr10",
      "topic": "programming-practice",
      "learningSlide": 14,
      "prompt": "Which combination of methods does the lesson recommend to reach a required motor angle?",
      "choices": [
        "Estimate, fold and fine-tune",
        "Count gear teeth and ignore the angle",
        "Use only the first guess",
        "Randomly change a setting without checking"
      ],
      "correctIndex": 0,
      "hint": "Think about progressing from a rough guess toward a precise result.",
      "explanation": "Slide 14 asks students to use the estimation, folding and fine-tuning methods to reach the needed angle."
    }
  ]
};
