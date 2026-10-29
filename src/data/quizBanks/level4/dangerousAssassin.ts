/** Level 4 quiz: authored from the official 23-page Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const dangerousAssassinBank: QuizBank = {
  "projectId": "level-4-dangerous-assassin",
  "title": "Dangerous Assassin",
  "sourcePdfPath": "public/Level 4/Vehicles & Complex Movers/Dangerous Assassin/15. Dangerous Assassin.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "l4-dangerous-assassin-01",
      "topic": "snake-model",
      "learningSlide": 2,
      "prompt": "Which animal is modeled in the Dangerous Assassin lesson?",
      "choices": [
        "A bird",
        "A snake",
        "A fish",
        "An insect"
      ],
      "correctIndex": 1,
      "explanation": "The lesson's objective is to build a snake-shaped model.",
      "hint": "Consider the animal the robot imitates."
    },
    {
      "id": "l4-dangerous-assassin-02",
      "topic": "snake-model",
      "learningSlide": 4,
      "prompt": "What body shape is described in the snake background section?",
      "choices": [
        "Round shell",
        "Short wings",
        "Long slender body",
        "Flat square body"
      ],
      "correctIndex": 2,
      "explanation": "The lesson characterizes snakes by their long, slender bodies.",
      "hint": "Consider the animal the robot imitates."
    },
    {
      "id": "l4-dangerous-assassin-03",
      "topic": "sound-sensing",
      "learningSlide": 7,
      "prompt": "Which controller feature reads the surrounding sound level?",
      "choices": [
        "Built-in microphone",
        "GPS module",
        "Infrared camera",
        "Touchscreen brightness"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 introduces the microphone volume module.",
      "hint": "Think about how sound becomes a program value."
    },
    {
      "id": "l4-dangerous-assassin-04",
      "topic": "sound-sensing",
      "learningSlide": 7,
      "prompt": "What range does the microphone volume module return?",
      "choices": [
        "0 to 10",
        "1 to 20",
        "0 to 100",
        "0 to 4095"
      ],
      "correctIndex": 3,
      "explanation": "The listed microphone range is 0–4095.",
      "hint": "Think about how sound becomes a program value."
    },
    {
      "id": "l4-dangerous-assassin-05",
      "topic": "mechanical-movement",
      "learningSlide": 9,
      "prompt": "Which sensor measures whether something is in front of the snake model?",
      "choices": [
        "Photoelectric sensor",
        "Ultrasonic sensor",
        "Barometric sensor",
        "Color touchscreen"
      ],
      "correctIndex": 1,
      "explanation": "The model uses ultrasonic sensing to determine whether an object is ahead.",
      "hint": "Recall the different mechanical parts."
    },
    {
      "id": "l4-dangerous-assassin-06",
      "topic": "mechanical-movement",
      "learningSlide": 9,
      "prompt": "What opens and closes the model's mouth?",
      "choices": [
        "Gears",
        "A QR scanner",
        "A display image",
        "A touch pen"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 explains that gears drive the mouth mechanism.",
      "hint": "Recall the different mechanical parts."
    },
    {
      "id": "l4-dangerous-assassin-07",
      "topic": "reaction-program",
      "learningSlide": 10,
      "prompt": "What state follows detection of a sound in the demonstration program?",
      "choices": [
        "The robot powers off",
        "The model becomes alert",
        "The model prints a receipt",
        "The sensor changes to GPS"
      ],
      "correctIndex": 1,
      "explanation": "The flowchart transitions to an alert state when sound is detected.",
      "hint": "Follow the sound and distance decision sequence."
    },
    {
      "id": "l4-dangerous-assassin-08",
      "topic": "reaction-program",
      "learningSlide": 10,
      "prompt": "What happens if no object is ahead during the alert state?",
      "choices": [
        "The robot remains frozen forever",
        "The display shows a map",
        "The model resets",
        "The controller plays a video"
      ],
      "correctIndex": 2,
      "explanation": "The flowchart resets the model when no target is ahead.",
      "hint": "Follow the sound and distance decision sequence."
    },
    {
      "id": "l4-dangerous-assassin-09",
      "topic": "improve-and-parallel-tasks",
      "learningSlide": 15,
      "prompt": "What is the purpose of an RCU Task module?",
      "choices": [
        "Start a program task",
        "Charge the battery",
        "Measure wheel diameter",
        "Set a screen wallpaper"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 identifies the RCU Task as a program-starting module.",
      "hint": "Consider how independent robot behaviors can be coordinated."
    },
    {
      "id": "l4-dangerous-assassin-10",
      "topic": "improve-and-parallel-tasks",
      "learningSlide": 18,
      "prompt": "Which measurement can students adjust while improving the model's alert behavior?",
      "choices": [
        "GPS latitude",
        "Room humidity",
        "Book page number",
        "Ultrasonic distance threshold"
      ],
      "correctIndex": 3,
      "explanation": "The improvement task asks students to set the sensor distance used for the condition.",
      "hint": "Consider how independent robot behaviors can be coordinated."
    }
  ]
};
