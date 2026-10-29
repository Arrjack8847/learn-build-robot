/** Level 4 quiz: reviewed official 24-page Learning PDF text. */
import type { QuizBank } from "../../quizStudio";
export const elfInTheTreeBank: QuizBank = {
  "projectId": "level-4-elf-in-the-tree",
  "title": "Elf in the Tree",
  "sourcePdfPath": "public/Level 4/Characters & Structures/Elf in the Tree/12. Elf in the Tree - Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "l4-elf-in-the-tree-01",
      "topic": "sloth-biology",
      "learningSlide": 4,
      "prompt": "Which animal inspires the Elf in the Tree robot?",
      "choices": [
        "Sloth",
        "Horse",
        "Penguin",
        "Fish"
      ],
      "correctIndex": 0,
      "explanation": "The lesson introduces a sloth model that hangs and moves slowly.",
      "hint": "Recall how the model imitates a sloth."
    },
    {
      "id": "l4-elf-in-the-tree-02",
      "topic": "sloth-biology",
      "learningSlide": 4,
      "prompt": "Which sloth behavior does the model imitate?",
      "choices": [
        "Diving under water",
        "Hanging from tree branches",
        "Flying through the air",
        "Jumping across a field"
      ],
      "correctIndex": 1,
      "explanation": "Sloths often hang upside down from branches.",
      "hint": "Recall how the model imitates a sloth."
    },
    {
      "id": "l4-elf-in-the-tree-03",
      "topic": "four-bar-linkage",
      "learningSlide": 6,
      "prompt": "What mechanical idea is introduced for moving the model's limbs?",
      "choices": [
        "Belt drive only",
        "Hydraulic pump",
        "Four-bar linkage",
        "Propeller system"
      ],
      "correctIndex": 2,
      "explanation": "Slide 6 introduces the hinged four-bar mechanism.",
      "hint": "Think about linked bars moving together."
    },
    {
      "id": "l4-elf-in-the-tree-04",
      "topic": "four-bar-linkage",
      "learningSlide": 8,
      "prompt": "Which structure drives the robot sloth's limbs?",
      "choices": [
        "Parallel linkage",
        "A screen cable",
        "A paper roller",
        "An ultrasonic echo"
      ],
      "correctIndex": 0,
      "explanation": "The lesson describes a parallel link structure moving the limbs.",
      "hint": "Think about linked bars moving together."
    },
    {
      "id": "l4-elf-in-the-tree-05",
      "topic": "obstacle-avoidance",
      "learningSlide": 9,
      "prompt": "What does the sloth do while there is no obstacle ahead?",
      "choices": [
        "Play a warning sound",
        "Stay stopped",
        "Reverse continuously",
        "Move forward"
      ],
      "correctIndex": 3,
      "explanation": "The basic flowchart says to move forward if the path is clear.",
      "hint": "Follow the forward and stop decisions."
    },
    {
      "id": "l4-elf-in-the-tree-06",
      "topic": "obstacle-avoidance",
      "learningSlide": 9,
      "prompt": "What does the sloth do when an obstacle is detected?",
      "choices": [
        "Stop moving",
        "Speed up",
        "Change screen color only",
        "Drop from the branch"
      ],
      "correctIndex": 0,
      "explanation": "The basic motion program stops when an obstacle is present.",
      "hint": "Follow the forward and stop decisions."
    },
    {
      "id": "l4-elf-in-the-tree-07",
      "topic": "photoelectric-sensor",
      "learningSlide": 14,
      "prompt": "Which device distinguishes different shades or color depth?",
      "choices": [
        "Barometric sensor",
        "Photoelectric sensor",
        "Microphone module",
        "Gyroscope"
      ],
      "correctIndex": 1,
      "explanation": "The exploration introduces a photoelectric/light sensor.",
      "hint": "Consider what a light sensor can distinguish."
    },
    {
      "id": "l4-elf-in-the-tree-08",
      "topic": "photoelectric-sensor",
      "learningSlide": 15,
      "prompt": "What numerical range does the photoelectric sensor block return?",
      "choices": [
        "0 to 10",
        "1 to 100",
        "0 to 4095",
        "100 to 1000"
      ],
      "correctIndex": 2,
      "explanation": "Slide 15 states a data range of 0–4095.",
      "hint": "Consider what a light sensor can distinguish."
    },
    {
      "id": "l4-elf-in-the-tree-09",
      "topic": "model-improvement",
      "learningSlide": 16,
      "prompt": "How can the sensor be set to measure ambient rather than its own reflected light?",
      "choices": [
        "Turn off the sensor's LED",
        "Increase wheel speed",
        "Disconnect the controller",
        "Play a sound"
      ],
      "correctIndex": 0,
      "explanation": "Slide 16 says to turn off the light sensor's LED for ambient light detection.",
      "hint": "Think about making the mechanism more dependable."
    },
    {
      "id": "l4-elf-in-the-tree-10",
      "topic": "model-improvement",
      "learningSlide": 18,
      "prompt": "Which improvement is proposed for the sloth robot?",
      "choices": [
        "Remove all the legs",
        "Replace the model with a car",
        "Disable the obstacle check",
        "Strengthen weak points and add a photoelectric sensor"
      ],
      "correctIndex": 3,
      "explanation": "Slide 18 asks students to reinforce parts and consider a photoelectric sensor.",
      "hint": "Think about making the mechanism more dependable."
    }
  ]
};
