/** Questions sourced from Level 1 SpongeBob Learning PDF. */
import type { QuizBank } from "../quizStudio";
export const spongeBobBank: QuizBank = {
  "projectId": "spongebob",
  "title": "SpongeBob",
  "sourcePdfPath": "public/Level 1/Learning/Characters & Structures/SpongeBob/SpongeBob_Powerpoint.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "s01",
      "topic": "hardware",
      "learningSlide": 9,
      "prompt": "What does hardware mean in the SpongeBob robot lesson?",
      "choices": [
        "Only code instructions",
        "Only project documentation",
        "Physical electronic and mechanical parts",
        "Only saved programs"
      ],
      "correctIndex": 2,
      "explanation": "Hardware consists of physical devices in the robot system.",
      "hint": "Think of parts you can touch."
    },
    {
      "id": "s02",
      "topic": "hardware",
      "learningSlide": 9,
      "prompt": "Which device is given as an example of robot hardware?",
      "choices": [
        "Controller",
        "Source code",
        "Program document",
        "Software algorithm"
      ],
      "correctIndex": 0,
      "explanation": "The slide lists controllers among hardware components.",
      "hint": "Consider the control unit as a physical object."
    },
    {
      "id": "s03",
      "topic": "controller",
      "learningSlide": 10,
      "prompt": "What is the controller's main role?",
      "choices": [
        "Act as a decoration",
        "Store only music",
        "Replace every sensor",
        "Direct other robot parts"
      ],
      "correctIndex": 3,
      "explanation": "The controller coordinates robot operations.",
      "hint": "Think about the robot's control center."
    },
    {
      "id": "s04",
      "topic": "controller",
      "learningSlide": 10,
      "prompt": "What does the controller send to other robot parts after interpreting instructions?",
      "choices": [
        "Only printed paper",
        "Control signals",
        "A mechanical screw",
        "A paint color"
      ],
      "correctIndex": 1,
      "explanation": "The slide says the controller sends control signals.",
      "hint": "Consider how a control unit communicates a command."
    },
    {
      "id": "s05",
      "topic": "memory",
      "learningSlide": 11,
      "prompt": "What can the robot's memory store?",
      "choices": [
        "Only wheels",
        "Programs and data",
        "Only physical beams",
        "Only battery casing"
      ],
      "correctIndex": 1,
      "explanation": "The lesson describes memory storing programs, data and results.",
      "hint": "Think about information needed for the robot's operation."
    },
    {
      "id": "s06",
      "topic": "memory",
      "learningSlide": 11,
      "prompt": "Why does a robot system need memory?",
      "choices": [
        "To lift heavy beams",
        "To turn the motor directly",
        "To create a light source",
        "To store and retrieve information"
      ],
      "correctIndex": 3,
      "explanation": "Memory allows the robot to retain information for operation.",
      "hint": "Think of information kept for later use."
    },
    {
      "id": "s07",
      "topic": "input-output",
      "learningSlide": 12,
      "prompt": "What is the purpose of an input device?",
      "choices": [
        "Send data into the robot",
        "Only display results",
        "Only rotate a wheel",
        "Only hold the battery"
      ],
      "correctIndex": 0,
      "explanation": "The PDF defines an input device as a means of providing data.",
      "hint": "Think about the direction information travels."
    },
    {
      "id": "s08",
      "topic": "input-output",
      "learningSlide": 12,
      "prompt": "Which function can an output device provide?",
      "choices": [
        "Only read new data",
        "Only store source code",
        "Display or play a result",
        "Only measure an obstacle"
      ],
      "correctIndex": 2,
      "explanation": "The lesson includes displays and sound among output forms.",
      "hint": "Think about what the robot communicates back."
    },
    {
      "id": "s09",
      "topic": "software",
      "learningSlide": 13,
      "prompt": "What is software in the robot system?",
      "choices": [
        "Just physical cables",
        "Only the battery",
        "Programs and related documentation",
        "Only the gears"
      ],
      "correctIndex": 2,
      "explanation": "Slide 13 describes software as programs plus documents.",
      "hint": "Think about what tells the hardware how to work."
    },
    {
      "id": "s10",
      "topic": "software",
      "learningSlide": 14,
      "prompt": "How is software different from hardware in physical form?",
      "choices": [
        "Software is always a metal part",
        "Software has no physical form like a device",
        "Software can never be copied",
        "Software works without any hardware"
      ],
      "correctIndex": 1,
      "explanation": "The lesson contrasts intangible software with physical hardware.",
      "hint": "Think about whether you can hold a program in your hand."
    }
  ]
};
