/** Verified against public/Level 2/Learning/Foundational Robots/Lucky turntable.pdf (22 pages); slide numbers are 1-based. */
import type { QuizBank } from "../../quizStudio";
export const luckyTurntableBank: QuizBank = {
  "projectId": "level-2-lucky-turntable",
  "title": "Lucky turntable",
  "sourcePdfPath": "public/Level 2/Learning/Foundational Robots/Lucky turntable.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "lt01",
      "topic": "probability",
      "learningSlide": 3,
      "prompt": "According to the lesson, which Lucky Wheel outcome has the lowest probability?",
      "choices": [
        "Not winning",
        "Getting any prize",
        "The pointer moving",
        "Winning first prize"
      ],
      "correctIndex": 3,
      "explanation": "Slide 3 says first prize is least likely and not winning most likely.",
      "hint": "Think about why big prizes are rare."
    },
    {
      "id": "lt02",
      "topic": "probability",
      "learningSlide": 3,
      "prompt": "Which outcome does the lesson describe as most probable on a prize wheel?",
      "choices": [
        "Not winning",
        "Winning first prize",
        "The pointer breaking",
        "Winning every prize at once"
      ],
      "correctIndex": 0,
      "explanation": "The introduction says the no-prize result is the most likely.",
      "hint": "Look at the contrast with first prize."
    },
    {
      "id": "lt03",
      "topic": "gear-speed",
      "learningSlide": 4,
      "prompt": "Which mechanism can make the pointer rotate faster?",
      "choices": [
        "A microphone",
        "Gear acceleration",
        "A touchless temperature sensor",
        "A light filter"
      ],
      "correctIndex": 1,
      "explanation": "Slide 4 proposes an accelerating gear structure.",
      "hint": "Which transmission changes rotational speed?"
    },
    {
      "id": "lt04",
      "topic": "gear-speed",
      "learningSlide": 4,
      "prompt": "If one acceleration gear stage is too slow, what does the exploration suggest trying?",
      "choices": [
        "Disconnecting the motor",
        "Adding a water tank",
        "A second gear-acceleration stage",
        "Removing the pointer"
      ],
      "correctIndex": 2,
      "explanation": "Slide 4 specifically suggests second-stage gear acceleration.",
      "hint": "Think about adding another transmission stage."
    },
    {
      "id": "lt05",
      "topic": "wheel-design",
      "learningSlide": 5,
      "prompt": "What simple shape does the lesson suggest as a possible turntable disc?",
      "choices": [
        "A spiral spring",
        "A cone",
        "A triangle prism",
        "A square"
      ],
      "correctIndex": 3,
      "explanation": "Slide 5 says even a square can be used for a simple disc.",
      "hint": "The design need not start as a perfect circle."
    },
    {
      "id": "lt06",
      "topic": "wheel-design",
      "learningSlide": 5,
      "prompt": "Why is choosing a buildable disc shape important in this project?",
      "choices": [
        "The pointer needs a physical target area",
        "It determines network password strength",
        "It replaces the motor controller",
        "It is how gears store electricity"
      ],
      "correctIndex": 0,
      "explanation": "The exploration asks students to make a practical disc with available parts.",
      "hint": "Think about where the pointer points."
    },
    {
      "id": "lt07",
      "topic": "motor-testing",
      "learningSlide": 17,
      "prompt": "Which two motor settings does Task 1 ask students to adjust?",
      "choices": [
        "Wheel diameter and mass",
        "Time and speed",
        "Height and color",
        "Humidity and pressure"
      ],
      "correctIndex": 1,
      "explanation": "Slide 17 explicitly calls for different motor timing and speed parameters.",
      "hint": "Check the programming experiment variables."
    },
    {
      "id": "lt08",
      "topic": "motor-testing",
      "learningSlide": 17,
      "prompt": "After adjusting the motor settings, what should students do?",
      "choices": [
        "Remove all gears",
        "Turn the motor off permanently",
        "Observe and record pointer movement",
        "Guess the result without testing"
      ],
      "correctIndex": 2,
      "explanation": "The task asks learners to observe the pointer and record results.",
      "hint": "An experiment needs an observation."
    },
    {
      "id": "lt09",
      "topic": "random-programming",
      "learningSlide": 19,
      "prompt": "Which values are randomized in the second coding task?",
      "choices": [
        "Screen brightness and color",
        "Robot height and battery mass",
        "The pointer's material and weight",
        "Motor speed and run timing"
      ],
      "correctIndex": 3,
      "explanation": "Slide 19 introduces random numbers for motor speed and timing.",
      "hint": "Read the variables in the random-number task."
    },
    {
      "id": "lt10",
      "topic": "random-programming",
      "learningSlide": 19,
      "prompt": "Why would randomized motor timing make outcomes less predictable?",
      "choices": [
        "Run duration changes between turns",
        "The gear teeth vanish",
        "Every run lasts exactly the same time",
        "The motor no longer needs a program"
      ],
      "correctIndex": 0,
      "explanation": "Variable motor times cause the pointer to stop after different durations.",
      "hint": "Think about identical versus changing run times."
    }
  ]
};
