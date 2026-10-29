/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const basicProgrammingBank: QuizBank = {
  "projectId": "basic-programming",
  "title": "Basic Programming",
  "sourcePdfPath": "public/Level 1/Learning/Foundational Robots/Basic programming.pdf",
  "sourcePageCount": 34,
  "questions": [
    {
      "id": "basic-programming-01",
      "topic": "robot-function",
      "learningSlide": 6,
      "prompt": "Which three information-handling abilities are used to explain how robots work?",
      "choices": [
        "Sense, process, output",
        "Eat, sleep, run",
        "Paint, cut, glue",
        "Charge, fold, swim"
      ],
      "correctIndex": 0,
      "hint": "Think about receiving information, deciding and acting.",
      "explanation": "The lesson describes sensing, processing and outputting information."
    },
    {
      "id": "basic-programming-02",
      "topic": "robot-function",
      "learningSlide": 3,
      "prompt": "What characterizes the automatic machinery described in the introduction?",
      "choices": [
        "It repeatedly operates according to instructions",
        "It always needs manual motion at every instant",
        "It cannot follow instructions",
        "It can only operate in water"
      ],
      "correctIndex": 0,
      "hint": "Recall the definition comparing machines and robots.",
      "explanation": "Automatic machinery performs repeated operations according to instructions."
    },
    {
      "id": "basic-programming-03",
      "topic": "sensor-controller-actuator",
      "learningSlide": 6,
      "prompt": "Which component senses information from the robot's surroundings?",
      "choices": [
        "Sensor",
        "Motor axle",
        "Decoration panel",
        "Support beam"
      ],
      "correctIndex": 0,
      "hint": "Which part is analogous to human senses?",
      "explanation": "The exploration compares sensors with human senses that perceive the world."
    },
    {
      "id": "basic-programming-04",
      "topic": "sensor-controller-actuator",
      "learningSlide": 6,
      "prompt": "What is the controller's role in the robot?",
      "choices": [
        "Processing decisions",
        "Only holding a wheel",
        "Only colouring the model",
        "Providing the robot's outer shell"
      ],
      "correctIndex": 0,
      "hint": "Think about the part compared to the brain.",
      "explanation": "The controller is identified as the robot's decision-making brain."
    },
    {
      "id": "basic-programming-05",
      "topic": "programming-tools",
      "learningSlide": 8,
      "prompt": "What does programming tell a robot controller?",
      "choices": [
        "What to do and how to do it",
        "Only its model's colour",
        "Only where to store the box",
        "Only the width of its beams"
      ],
      "correctIndex": 0,
      "hint": "Recall why we write instructions in a language the controller understands.",
      "explanation": "The lesson defines programming as communicating actions and methods to the controller."
    },
    {
      "id": "basic-programming-06",
      "topic": "programming-tools",
      "learningSlide": 9,
      "prompt": "Why should students save their programs regularly?",
      "choices": [
        "To avoid losing work and starting again",
        "To stop the robot from sensing obstacles",
        "To make motor cables shorter",
        "To replace the controller screen"
      ],
      "correctIndex": 0,
      "hint": "Think about recovering after data loss.",
      "explanation": "The lesson recommends saving programs often in different files to prevent loss."
    },
    {
      "id": "basic-programming-07",
      "topic": "motor-wiring",
      "learningSlide": 25,
      "prompt": "Which motor connects to controller port A in this project?",
      "choices": [
        "Head motor",
        "Arm motor",
        "Wheel motor",
        "Drum motor"
      ],
      "correctIndex": 0,
      "hint": "Look at the two named actuators on the wiring slide.",
      "explanation": "The construction slide labels port A for the head motor."
    },
    {
      "id": "basic-programming-08",
      "topic": "motor-wiring",
      "learningSlide": 25,
      "prompt": "Which motor connects to port B?",
      "choices": [
        "Arm motor",
        "Head motor",
        "Windmill motor",
        "Water pump"
      ],
      "correctIndex": 0,
      "hint": "Remember the remaining motor in the two-port setup.",
      "explanation": "Port B is assigned to the arm motor."
    },
    {
      "id": "basic-programming-09",
      "topic": "sequential-commands",
      "learningSlide": 27,
      "prompt": "In a sequential program, in which order do commands run?",
      "choices": [
        "From top to bottom",
        "Only from bottom to top",
        "All steps randomly",
        "Only every other command"
      ],
      "correctIndex": 0,
      "hint": "Consider the order the blocks are placed.",
      "explanation": "The coding slide explains that sequential commands execute from top to bottom."
    },
    {
      "id": "basic-programming-10",
      "topic": "sequential-commands",
      "learningSlide": 27,
      "prompt": "What is the requested action order for the simple robot?",
      "choices": [
        "Turn head, laugh, wave arms",
        "Laugh, sleep, swim",
        "Wave arms, turn head, power off",
        "Flash lights, drive wheels, beep"
      ],
      "correctIndex": 0,
      "hint": "Recall the three actions named in the exercise.",
      "explanation": "The lesson's sequence is turn the head for one second, then laugh, then wave the arms."
    }
  ]
};
