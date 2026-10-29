/** Level 4 — Spinning Cups. Questions checked against the 23-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const spinningCupsBank: QuizBank = {
  "projectId": "level-4-spinning-cups",
  "title": "Spinning Cups",
  "sourcePdfPath": "public/Level 4/Mechanisms & Simulators/Spinning Cups/14. Spinning Cups-Teaching Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "l4-spinningcups-01",
      "topic": "two-kinds-of-motion",
      "learningSlide": 5,
      "prompt": "What is it called when an object travels around another object's center?",
      "choices": [
        "Rotation",
        "Revolution",
        "Stopping",
        "Sliding straight"
      ],
      "correctIndex": 1,
      "explanation": "Slide 5 defines revolution as moving around another object.",
      "hint": "Think about the Moon moving around Earth."
    },
    {
      "id": "l4-spinningcups-02",
      "topic": "two-kinds-of-motion",
      "learningSlide": 6,
      "prompt": "What is it called when a cup spins around its own axis?",
      "choices": [
        "Falling",
        "Revolution only",
        "Translation",
        "Rotation"
      ],
      "correctIndex": 3,
      "explanation": "Slide 6 defines rotation as spinning around an axis through the object.",
      "hint": "Think about a cup turning in place."
    },
    {
      "id": "l4-spinningcups-03",
      "topic": "fixed-and-moving-gears",
      "learningSlide": 9,
      "prompt": "Which gear has an axis that stays fixed in place?",
      "choices": [
        "A fixed gear",
        "A free wheel",
        "A disconnected gear",
        "A movable gear"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 distinguishes fixed from movable gears by the motion of their axes.",
      "hint": "Think about whether the gear's center moves around."
    },
    {
      "id": "l4-spinningcups-04",
      "topic": "fixed-and-moving-gears",
      "learningSlide": 9,
      "prompt": "What is the key difference between fixed and movable gears in this lesson?",
      "choices": [
        "Their sound",
        "Their paint color",
        "The motion of their axes",
        "Their material only"
      ],
      "correctIndex": 2,
      "explanation": "Slide 9 says the difference is whether the axis moves.",
      "hint": "Compare what happens to each gear's center."
    },
    {
      "id": "l4-spinningcups-05",
      "topic": "cup-mechanism",
      "learningSlide": 7,
      "prompt": "How do the ride's cups move?",
      "choices": [
        "They never rotate",
        "Only in a straight line",
        "They spin and move around the center",
        "Only up and down"
      ],
      "correctIndex": 2,
      "explanation": "Slide 7 says the cups rotate on their own positions while revolving around the center.",
      "hint": "Think about two kinds of motion happening together."
    },
    {
      "id": "l4-spinningcups-06",
      "topic": "cup-mechanism",
      "learningSlide": 10,
      "prompt": "Where does the lesson put the fixed gear for the spinning cups?",
      "choices": [
        "In the middle",
        "Outside the ride",
        "Under the classroom desk",
        "Inside the controller"
      ],
      "correctIndex": 0,
      "explanation": "Slide 10 says a fixed gear is placed in the middle.",
      "hint": "Think about the central part of the gear system."
    },
    {
      "id": "l4-spinningcups-07",
      "topic": "colors-and-speed",
      "learningSlide": 12,
      "prompt": "Which sensor helps the spinning cups react to different colors?",
      "choices": [
        "Sound sensor",
        "Humidity sensor",
        "Touch sensor",
        "Color sensor"
      ],
      "correctIndex": 3,
      "explanation": "Slide 12 lists a color sensor for controlling cup speeds.",
      "hint": "Think about a sensor that identifies colored blocks."
    },
    {
      "id": "l4-spinningcups-08",
      "topic": "colors-and-speed",
      "learningSlide": 13,
      "prompt": "Which program setting depends on the detected color?",
      "choices": [
        "The robot's name",
        "The speed value",
        "The classroom address",
        "The tire's material"
      ],
      "correctIndex": 1,
      "explanation": "Slide 13 says speed values correspond to color readings.",
      "hint": "Think about what is chosen before the motor starts."
    },
    {
      "id": "l4-spinningcups-09",
      "topic": "buttons-and-direction",
      "learningSlide": 17,
      "prompt": "Which touch port controls clockwise rotation?",
      "choices": [
        "P6",
        "P8",
        "P2",
        "P4"
      ],
      "correctIndex": 0,
      "explanation": "Slide 17 assigns clockwise rotation to touch port P6.",
      "hint": "The lesson assigns separate buttons to each direction."
    },
    {
      "id": "l4-spinningcups-10",
      "topic": "buttons-and-direction",
      "learningSlide": 17,
      "prompt": "Which touch port controls counterclockwise rotation?",
      "choices": [
        "P3",
        "P6",
        "P8",
        "P1"
      ],
      "correctIndex": 2,
      "explanation": "Slide 17 assigns counterclockwise rotation to touch port P8.",
      "hint": "Compare the two direction buttons."
    }
  ]
};
