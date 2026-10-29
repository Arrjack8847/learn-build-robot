/** Verified against the registered Level 3 source PDF, pages are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const safeBank: QuizBank = {
  "projectId": "level-3-safe",
  "title": "Safe",
  "sourcePdfPath": "public/Level 3/Learning/Characters & Structures/Safe/15.Safe -Slides.pdf",
  "sourcePageCount": 33,
  "questions": [
    {
      "id": "safe-01",
      "topic": "protection",
      "learningSlide": 3,
      "prompt": "What is the main purpose of a safe?",
      "choices": [
        "Protect valuable belongings",
        "Measure altitude",
        "Transport goods automatically",
        "Drive robot wheels"
      ],
      "correctIndex": 0,
      "hint": "A safe uses physical and programmed access control.",
      "explanation": "Slide 3 describes safes as secure containers for valuables."
    },
    {
      "id": "safe-02",
      "topic": "protection",
      "learningSlide": 6,
      "prompt": "Which color is used as the safe model's basic unlock password?",
      "choices": [
        "Red",
        "Green",
        "Blue",
        "Black"
      ],
      "correctIndex": 1,
      "hint": "A safe uses physical and programmed access control.",
      "explanation": "Slide 6 specifies green as the required color to unlock."
    },
    {
      "id": "safe-03",
      "topic": "colors",
      "learningSlide": 7,
      "prompt": "How many fixed colors can the sensor recognize in the lesson?",
      "choices": [
        "Three",
        "Ten",
        "Six",
        "Twelve"
      ],
      "correctIndex": 2,
      "hint": "The sensor recognizes a small fixed set of surface colors.",
      "explanation": "Slide 7 lists six fixed colors."
    },
    {
      "id": "safe-04",
      "topic": "colors",
      "learningSlide": 7,
      "prompt": "Which sensor property distinguishes a color sensor from a simple photoelectric brightness sensor?",
      "choices": [
        "Measuring motor rotation angle",
        "Detecting ultrasonic echo delay",
        "Weighing objects on a lever",
        "Identifying specific reflected colors"
      ],
      "correctIndex": 3,
      "hint": "The sensor recognizes a small fixed set of surface colors.",
      "explanation": "Slide 7 discusses identifying particular colors from reflected light."
    },
    {
      "id": "safe-05",
      "topic": "setup",
      "learningSlide": 8,
      "prompt": "Which controller connections accept the color sensor?",
      "choices": [
        "P1–P8 composite ports",
        "Motor ports M1–M4 only",
        "Battery switch pins",
        "Speaker output only"
      ],
      "correctIndex": 0,
      "hint": "The controller's built-in tests confirm input readings.",
      "explanation": "Slide 8 identifies composite sensor ports for connecting the color sensor."
    },
    {
      "id": "safe-06",
      "topic": "setup",
      "learningSlide": 9,
      "prompt": "Which built-in test checks the color-sensor readings?",
      "choices": [
        "Motor",
        "Color",
        "Ultrasonic",
        "Touch"
      ],
      "correctIndex": 1,
      "hint": "The controller's built-in tests confirm input readings.",
      "explanation": "Slide 9 opens the Color test and places colored blocks near the sensor."
    },
    {
      "id": "safe-07",
      "topic": "locking",
      "learningSlide": 25,
      "prompt": "What must be true before the safe's locking motor should rotate?",
      "choices": [
        "The door is open and no button is pressed",
        "The color sensor recognizes red only",
        "The door is closed and the left button is pressed",
        "The ultrasonic range increases"
      ],
      "correctIndex": 2,
      "hint": "Several conditions may be required for locking and unlocking.",
      "explanation": "Slide 25 checks touch and left-button conditions before locking."
    },
    {
      "id": "safe-08",
      "topic": "locking",
      "learningSlide": 26,
      "prompt": "What action follows recognition of the correct green color?",
      "choices": [
        "Sound the buzzer without unlocking",
        "Close the door permanently",
        "Stop all sensors",
        "Turn the motor to unlock"
      ],
      "correctIndex": 3,
      "hint": "Several conditions may be required for locking and unlocking.",
      "explanation": "Slide 26 turns the motor to unlock on green recognition."
    },
    {
      "id": "safe-09",
      "topic": "sequence",
      "learningSlide": 28,
      "prompt": "What extra security rule is proposed in the expansion task?",
      "choices": [
        "Require two colors to be recognized in sequence",
        "Unlock on every color",
        "Disable the color sensor",
        "Open after any random motor motion"
      ],
      "correctIndex": 0,
      "hint": "The extension checks a pair of colors in order.",
      "explanation": "Slide 28 adds a two-color sequence for unlocking."
    },
    {
      "id": "safe-10",
      "topic": "sequence",
      "learningSlide": 29,
      "prompt": "What color sequence is used in the expanded example?",
      "choices": [
        "Blue, then green",
        "Green, then blue",
        "Red, then white",
        "Yellow, then black"
      ],
      "correctIndex": 1,
      "hint": "The extension checks a pair of colors in order.",
      "explanation": "Slide 29 checks green and then blue after a wait."
    }
  ]
};
