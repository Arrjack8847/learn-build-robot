import type { QuizBank } from "../../quizStudio";
/** Level 4 Warrior With Claws bank verified against its Learning PDF text. */
export const warriorWithClawsBank: QuizBank = {
  "projectId": "level-4-warrior-with-claws",
  "title": "Warrior With Claws",
  "sourcePdfPath": "public/Level 4/Action-Oriented/Warrior With Claws/13. Warrior With Claws - Slides.pdf",
  "sourcePageCount": 27,
  "questions": [
    {
      "id": "l4-warrior-with-claws-01",
      "topic": "crab-biology",
      "learningSlide": 4,
      "prompt": "What animal does the Warrior With Claws model imitate?",
      "choices": [
        "Crab",
        "Lizard",
        "Bird",
        "Sloth"
      ],
      "correctIndex": 0,
      "explanation": "The lesson sets out to build a crab robot.",
      "hint": "Recall which animal the model is based on."
    },
    {
      "id": "l4-warrior-with-claws-02",
      "topic": "crab-biology",
      "learningSlide": 4,
      "prompt": "Which feature protects a crab's body?",
      "choices": [
        "A coat of feathers",
        "A pair of wings",
        "A flexible tire",
        "A hard outer shell"
      ],
      "correctIndex": 3,
      "explanation": "The lesson describes crabs as crustaceans with a protective shell.",
      "hint": "Recall which animal the model is based on."
    },
    {
      "id": "l4-warrior-with-claws-03",
      "topic": "crab-mechanism",
      "learningSlide": 7,
      "prompt": "What mechanical structure is introduced for limb movement?",
      "choices": [
        "Centrifugal fan",
        "Conveyor belt",
        "Parallel four-bar linkage",
        "Hydraulic drill"
      ],
      "correctIndex": 2,
      "explanation": "The introduction revisits the parallel four-bar mechanism.",
      "hint": "Think about linked bars that guide moving limbs."
    },
    {
      "id": "l4-warrior-with-claws-04",
      "topic": "crab-mechanism",
      "learningSlide": 10,
      "prompt": "Where is the main motor connected in the crab-robot build?",
      "choices": [
        "HDMI port",
        "M1/M2 motor port",
        "GPS port",
        "Headphone port"
      ],
      "correctIndex": 1,
      "explanation": "The build step connects its large motor through the M1/M2 port.",
      "hint": "Think about linked bars that guide moving limbs."
    },
    {
      "id": "l4-warrior-with-claws-05",
      "topic": "random-programming",
      "learningSlide": 8,
      "prompt": "What does a random-number coding block produce?",
      "choices": [
        "A value chosen from a specified range",
        "Only the value zero",
        "A photo of the robot",
        "A motor cable"
      ],
      "correctIndex": 0,
      "explanation": "The random number module selects a number within set limits.",
      "hint": "Consider choosing between alternative movements."
    },
    {
      "id": "l4-warrior-with-claws-06",
      "topic": "random-programming",
      "learningSlide": 8,
      "prompt": "Why should the program give the random block an appropriate range?",
      "choices": [
        "To disable the sensor",
        "To change the robot's color",
        "To remove the controller",
        "To keep chosen numbers within the intended actions"
      ],
      "correctIndex": 3,
      "explanation": "The lesson warns to set a reasonable number range.",
      "hint": "Consider choosing between alternative movements."
    },
    {
      "id": "l4-warrior-with-claws-07",
      "topic": "obstacle-trigger",
      "learningSlide": 11,
      "prompt": "Which sensor detects objects to trigger the crab model's motion?",
      "choices": [
        "Touchscreen pen",
        "Sound file",
        "Ultrasonic sensor",
        "Barometric sensor"
      ],
      "correctIndex": 2,
      "explanation": "The flowchart begins with ultrasonic object detection.",
      "hint": "Follow the sensor-triggered movement cycle."
    },
    {
      "id": "l4-warrior-with-claws-08",
      "topic": "obstacle-trigger",
      "learningSlide": 11,
      "prompt": "What kind of movement can the crab select after detection?",
      "choices": [
        "Opening a webpage",
        "A randomly chosen direction or action",
        "A fixed weather measurement",
        "Typing a password"
      ],
      "correctIndex": 1,
      "explanation": "The movement program uses randomness to select a motion.",
      "hint": "Follow the sensor-triggered movement cycle."
    },
    {
      "id": "l4-warrior-with-claws-09",
      "topic": "reusable-blocks",
      "learningSlide": 17,
      "prompt": "What problem do custom programming blocks help solve?",
      "choices": [
        "Repeated code sequences",
        "Damaged physical switches",
        "Incorrect colors in photos",
        "Weak battery voltage only"
      ],
      "correctIndex": 0,
      "explanation": "Custom blocks package code that would otherwise be repeated.",
      "hint": "Recall how programs avoid repeating the same instructions."
    },
    {
      "id": "l4-warrior-with-claws-10",
      "topic": "reusable-blocks",
      "learningSlide": 19,
      "prompt": "Which change is proposed to improve the physical crab model?",
      "choices": [
        "Remove all supporting beams",
        "Disconnect the drive motor",
        "Eliminate every sensor",
        "Reinforce weak parts and improve the claw structure"
      ],
      "correctIndex": 3,
      "explanation": "The optimization activities ask about reinforcement and building claws.",
      "hint": "Recall how programs avoid repeating the same instructions."
    }
  ]
};
