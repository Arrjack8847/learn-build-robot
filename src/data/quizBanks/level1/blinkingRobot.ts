/** Reconciled Level 1 official Learning-PDF bank. */
import type { QuizBank } from "../../quizStudio";
export const blinkingRobotBank: QuizBank = {
  "projectId": "blinking-robot",
  "title": "Blinking Robot",
  "sourcePdfPath": "public/Level 1/Learning/Illumination & Signals/Blinking robot/Blinking robot_Powerpoint.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "blinking-robot-01",
      "topic": "program",
      "learningSlide": 9,
      "prompt": "What is a program made of according to the lesson?",
      "choices": [
        "Only gears",
        "Instructions or statements",
        "Only motors",
        "Only wheels"
      ],
      "correctIndex": 1,
      "explanation": "Slide 9 describes a program as a collection of instructions.",
      "hint": "Think about how you tell a controller what to do."
    },
    {
      "id": "blinking-robot-02",
      "topic": "program",
      "learningSlide": 6,
      "prompt": "Why are programming languages used instead of writing only machine code?",
      "choices": [
        "They remove the need for any hardware",
        "They turn motors without commands",
        "They cannot express repeated actions",
        "They are easier for people to write and understand"
      ],
      "correctIndex": 3,
      "explanation": "The lecture explains that programming languages make instructions easier for humans.",
      "hint": "Think about instructions that a person can read."
    },
    {
      "id": "blinking-robot-03",
      "topic": "robot",
      "learningSlide": 7,
      "prompt": "What does the Blinking Robot demonstrate on its screen?",
      "choices": [
        "An altitude reading",
        "A moving bicycle",
        "A blinking effect",
        "A radar map"
      ],
      "correctIndex": 2,
      "explanation": "The introductory slide says the robot presents a blinking screen effect.",
      "hint": "Think about what happens to a light that repeatedly turns on and off."
    },
    {
      "id": "blinking-robot-04",
      "topic": "robot",
      "learningSlide": 7,
      "prompt": "Which unit connects the sensors used in the Blinking Robot lesson?",
      "choices": [
        "RCU",
        "Hydraulic valve",
        "GPS antenna",
        "Water pump"
      ],
      "correctIndex": 0,
      "explanation": "The introduction describes a sensor connected through the RCU.",
      "hint": "Recall the lesson's main robot control unit."
    },
    {
      "id": "blinking-robot-05",
      "topic": "software",
      "learningSlide": 10,
      "prompt": "What programming software is named in the lesson?",
      "choices": [
        "Scratch2 for JMD",
        "Python IDLE",
        "Arduino IDE",
        "Microsoft Excel"
      ],
      "correctIndex": 0,
      "explanation": "Slide 10 identifies Scratch2 for JMD as the teaching software.",
      "hint": "Look for the block-based programming environment named in the PDF."
    },
    {
      "id": "blinking-robot-06",
      "topic": "software",
      "learningSlide": 10,
      "prompt": "Which software region contains the blocks used to build commands?",
      "choices": [
        "Title bar",
        "File explorer",
        "Module area",
        "Output speaker"
      ],
      "correctIndex": 2,
      "explanation": "The slide lists a module area among the editor sections.",
      "hint": "Think about where available programming blocks are displayed."
    },
    {
      "id": "blinking-robot-07",
      "topic": "editor",
      "learningSlide": 13,
      "prompt": "Where are blocks arranged to form the program?",
      "choices": [
        "Controller battery",
        "Robot wheels",
        "Camera lens",
        "Programming area"
      ],
      "correctIndex": 3,
      "explanation": "Slide 13 defines the programming area as the place where commands are arranged.",
      "hint": "Compare the palette of blocks with the place you join them."
    },
    {
      "id": "blinking-robot-08",
      "topic": "editor",
      "learningSlide": 11,
      "prompt": "What should students learn to do from the menu bar?",
      "choices": [
        "Change the robot's tire size",
        "Name and save a program",
        "Adjust a bevel gear ratio",
        "Measure ultrasonic distance"
      ],
      "correctIndex": 1,
      "explanation": "The slide emphasizes naming and saving work through the menu bar.",
      "hint": "Think about what you do before keeping a coding project."
    },
    {
      "id": "blinking-robot-09",
      "topic": "practice",
      "learningSlide": 18,
      "prompt": "Which editing action is included in the Blinking Robot homework?",
      "choices": [
        "Changing air pressure",
        "Dragging programming blocks",
        "Measuring altitude",
        "Cutting gears"
      ],
      "correctIndex": 1,
      "explanation": "Homework mentions drag, copy, cut, paste and delete in block editing.",
      "hint": "Think about moving blocks within a graphical editor."
    },
    {
      "id": "blinking-robot-10",
      "topic": "practice",
      "learningSlide": 18,
      "prompt": "What should students do after assembling the example Blink program?",
      "choices": [
        "Download and run it",
        "Remove its start commands",
        "Delete the controller connection",
        "Disconnect all modules"
      ],
      "correctIndex": 0,
      "explanation": "The homework asks students to download and run the program.",
      "hint": "Think about how a program gets from the editor onto the robot."
    }
  ]
};
