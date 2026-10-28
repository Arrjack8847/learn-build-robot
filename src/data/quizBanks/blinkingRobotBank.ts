/** Questions sourced from Level 1 Blinking Robot Learning PDF. */
import type { QuizBank } from "../quizStudio";
export const blinkingRobotBank: QuizBank = {
  "projectId": "blinking-robot",
  "title": "Blinking Robot",
  "sourcePdfPath": "public/Level 1/Learning/Illumination & Signals/Blinking robot/Blinking robot_Powerpoint.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "bl01",
      "topic": "program-basics",
      "learningSlide": 9,
      "prompt": "What is a program made up of?",
      "choices": [
        "Only physical screws",
        "Instructions and statements",
        "Only a sensor casing",
        "Only a robot's wheels"
      ],
      "correctIndex": 1,
      "explanation": "The lesson defines programs as statements that express instructions.",
      "hint": "Think about what a machine follows."
    },
    {
      "id": "bl02",
      "topic": "program-basics",
      "learningSlide": 6,
      "prompt": "Why do people use programming languages instead of only machine codes?",
      "choices": [
        "They replace every motor",
        "They remove the need for hardware",
        "They stop robots using memory",
        "They make instructions easier to express"
      ],
      "correctIndex": 3,
      "explanation": "The introduction says machine language is inconvenient for humans.",
      "hint": "Think about writing commands people can understand."
    },
    {
      "id": "bl03",
      "topic": "program-flow",
      "learningSlide": 9,
      "prompt": "Which of these is named as a program control instruction?",
      "choices": [
        "Gear tooth",
        "Wheel diameter",
        "Loop",
        "Battery case"
      ],
      "correctIndex": 2,
      "explanation": "The lecture names loops among the ways programs control execution.",
      "hint": "Think about repeating instructions."
    },
    {
      "id": "bl04",
      "topic": "program-flow",
      "learningSlide": 9,
      "prompt": "What is a statement in the lesson's description?",
      "choices": [
        "An instruction in a program",
        "A motor bearing",
        "A sensor port cover",
        "A support beam"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 calls a statement an instruction.",
      "hint": "Think about a single command."
    },
    {
      "id": "bl05",
      "topic": "software-interface",
      "learningSlide": 10,
      "prompt": "Which programming environment does the lesson use?",
      "choices": [
        "Scratch2 for JMD",
        "A spreadsheet only",
        "A word processor",
        "A photo editor"
      ],
      "correctIndex": 0,
      "explanation": "Slide 10 names Scratch2 for JMD.",
      "hint": "Think of block-based programming software."
    },
    {
      "id": "bl06",
      "topic": "software-interface",
      "learningSlide": 13,
      "prompt": "Where are the program blocks arranged?",
      "choices": [
        "Motor casing",
        "Battery holder",
        "Programming area",
        "Drawing surface"
      ],
      "correctIndex": 2,
      "explanation": "The programming area is where blocks are organized.",
      "hint": "Think about where the instructions are built."
    },
    {
      "id": "bl07",
      "topic": "menu",
      "learningSlide": 11,
      "prompt": "Which action is learned in the menu bar?",
      "choices": [
        "Changing battery type",
        "Assembling a wheel axle",
        "Measuring pressure",
        "Naming and saving a program"
      ],
      "correctIndex": 3,
      "explanation": "Slide 11 teaches naming and saving.",
      "hint": "Think about file-management actions."
    },
    {
      "id": "bl08",
      "topic": "menu",
      "learningSlide": 18,
      "prompt": "Which editing operation is part of the practice task?",
      "choices": [
        "Only changing motor gears",
        "Dragging and copying blocks",
        "Only measuring temperature",
        "Only changing camera lenses"
      ],
      "correctIndex": 1,
      "explanation": "The homework includes drag, copy, cut, paste and delete.",
      "hint": "Think of manipulating blocks in the editor."
    },
    {
      "id": "bl09",
      "topic": "robot-action",
      "learningSlide": 7,
      "prompt": "What visible effect is the Blinking Robot lesson meant to produce?",
      "choices": [
        "An airplane taking off",
        "Blinking on a screen",
        "A car following a line",
        "An arm lifting a box"
      ],
      "correctIndex": 1,
      "explanation": "The introduction describes a blinking effect on screen.",
      "hint": "Think about repeated flashing."
    },
    {
      "id": "bl10",
      "topic": "robot-action",
      "learningSlide": 18,
      "prompt": "After opening the example Blink program, what should the student do?",
      "choices": [
        "Download and run it",
        "Remove the controller",
        "Replace all sensors",
        "Delete the program without testing"
      ],
      "correctIndex": 0,
      "explanation": "The homework asks students to download and run the routine.",
      "hint": "Think about checking that the program works on the robot."
    }
  ]
};
