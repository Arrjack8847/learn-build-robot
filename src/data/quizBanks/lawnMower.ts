/** Based on the 19-page The Lawn Mower Learning PDF text. Illustrations need visual QA. */
import type { QuizBank } from "../quizStudio";
export const lawnMowerBank: QuizBank = {
  "projectId": "the-lawn-mower",
  "title": "The Lawn Mower",
  "sourcePdfPath": "public/Level 1/Learning/Foundational Robots/The lawn mower.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "the-lawn-mower-01",
      "topic": "motors",
      "learningSlide": 5,
      "prompt": "How many motors does the Lawn Mower lesson say are needed for its model?",
      "choices": [
        "One",
        "Three",
        "Two",
        "Five"
      ],
      "correctIndex": 1,
      "explanation": "Slide 5 specifies at least three motors for the powered mower.",
      "hint": "Think about the motors used for driving and for the blade."
    },
    {
      "id": "the-lawn-mower-02",
      "topic": "motors",
      "learningSlide": 18,
      "prompt": "What are the two rear-mounted motors used for?",
      "choices": [
        "Playing music",
        "Reading a sensor",
        "Turning on a lighthouse",
        "Driving the rear wheels"
      ],
      "correctIndex": 3,
      "explanation": "The evaluation says two motors drive the rear wheels.",
      "hint": "Recall which components make the mower move forward."
    },
    {
      "id": "the-lawn-mower-03",
      "topic": "gear",
      "learningSlide": 5,
      "prompt": "Which gear type helps change the direction of motor power?",
      "choices": [
        "Rack gear",
        "Internal ring gear",
        "Bevel gear",
        "Worm-only gearbox"
      ],
      "correctIndex": 2,
      "explanation": "The slide recommends bevel gears to redirect motor power.",
      "hint": "Think of gears that change the direction between intersecting shafts."
    },
    {
      "id": "the-lawn-mower-04",
      "topic": "gear",
      "learningSlide": 5,
      "prompt": "Why does the lesson suggest bevel gears in this mower model?",
      "choices": [
        "To help reduce the machine's size while redirecting drive",
        "To remove the need for motors",
        "To generate power without a controller",
        "To keep all shafts parallel"
      ],
      "correctIndex": 0,
      "explanation": "The lesson connects bevel gears with a compact arrangement and a change in power direction.",
      "hint": "Consider how a compact model transfers rotation to another direction."
    },
    {
      "id": "the-lawn-mower-05",
      "topic": "ports",
      "learningSlide": 13,
      "prompt": "Which motor ports control the mover's two driving motors?",
      "choices": [
        "A and B",
        "B and C",
        "A and D",
        "C and D"
      ],
      "correctIndex": 0,
      "explanation": "Slide 13 connects the two driving motors to ports A and B.",
      "hint": "Think about which two motors are connected to the wheels."
    },
    {
      "id": "the-lawn-mower-06",
      "topic": "ports",
      "learningSlide": 13,
      "prompt": "Which port does the cutting-blade motor use?",
      "choices": [
        "A",
        "B",
        "C",
        "D"
      ],
      "correctIndex": 2,
      "explanation": "The construction instructions put the grass-cutting motor on port C.",
      "hint": "Separate the cutting motor from the driving pair."
    },
    {
      "id": "the-lawn-mower-07",
      "topic": "program",
      "learningSlide": 14,
      "prompt": "What should the mower do in the first coding task?",
      "choices": [
        "Only turn on a lantern",
        "Stay in place with the blade off",
        "Play an audio file and stop",
        "Cut grass while moving"
      ],
      "correctIndex": 3,
      "explanation": "The coding slide asks the mower to cut while it moves.",
      "hint": "Think about combining the wheel and blade motors."
    },
    {
      "id": "the-lawn-mower-08",
      "topic": "program",
      "learningSlide": 16,
      "prompt": "How long should the mower travel forward in the revised program?",
      "choices": [
        "One second",
        "Two seconds",
        "Four seconds",
        "Six seconds"
      ],
      "correctIndex": 1,
      "explanation": "The program instructions specify forward movement for two seconds.",
      "hint": "Read the time for the first movement segment."
    },
    {
      "id": "the-lawn-mower-09",
      "topic": "blade",
      "learningSlide": 18,
      "prompt": "What is the third motor's function in the Lawn Mower?",
      "choices": [
        "Driving a third rear wheel",
        "Rotating the blade",
        "Measuring road speed",
        "Changing the lamp color"
      ],
      "correctIndex": 1,
      "explanation": "The evaluation assigns the remaining motor to blade rotation.",
      "hint": "Compare the third motor with the two wheel motors."
    },
    {
      "id": "the-lawn-mower-10",
      "topic": "blade",
      "learningSlide": 16,
      "prompt": "How long should the mower move backward in the revised coding task?",
      "choices": [
        "One second",
        "Two seconds",
        "Three seconds",
        "Five seconds"
      ],
      "correctIndex": 0,
      "explanation": "The revised program specifies backward movement for one second.",
      "hint": "Compare the forward and reverse time intervals."
    }
  ]
};
