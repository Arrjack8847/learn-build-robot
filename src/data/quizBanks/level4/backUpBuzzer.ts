/** Level 4 quiz: authored from the official 20-page Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const backUpBuzzerBank: QuizBank = {
  "projectId": "level-4-back-up-buzzer",
  "title": "Back-up buzzer",
  "sourcePdfPath": "public/Level 4/Sensors/Back-up buzzer.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "l4-back-up-buzzer-01",
      "topic": "reversing-safety",
      "learningSlide": 3,
      "prompt": "What is the main purpose of a car's back-up buzzer?",
      "choices": [
        "Warn about objects behind the car",
        "Measure the fuel level",
        "Turn on the front headlights",
        "Count wheel rotations"
      ],
      "correctIndex": 0,
      "explanation": "The reversing system detects obstacles behind a vehicle to help avoid collisions.",
      "hint": "Think about what a driver needs to know when reversing."
    },
    {
      "id": "l4-back-up-buzzer-02",
      "topic": "reversing-safety",
      "learningSlide": 3,
      "prompt": "Which situation is the reversing system designed to help with?",
      "choices": [
        "Checking engine temperature",
        "Backing toward a wall",
        "Recording a journey",
        "Charging the battery"
      ],
      "correctIndex": 1,
      "explanation": "The lesson uses reversing near a wall or tree as its example.",
      "hint": "Think about what a driver needs to know when reversing."
    },
    {
      "id": "l4-back-up-buzzer-03",
      "topic": "infrared-detection",
      "learningSlide": 4,
      "prompt": "Where does an infrared sensor send obstacle information?",
      "choices": [
        "The wheels directly",
        "The mirror",
        "The controller",
        "The battery"
      ],
      "correctIndex": 2,
      "explanation": "Slide 4 says the infrared sensor passes obstacle information to the controller.",
      "hint": "Compare how sensors notice nearby objects."
    },
    {
      "id": "l4-back-up-buzzer-04",
      "topic": "infrared-detection",
      "learningSlide": 6,
      "prompt": "What property does this lesson's infrared sensor use to judge an obstacle?",
      "choices": [
        "Sound travel time",
        "Amount of infrared reflection",
        "GPS coordinates",
        "Air pressure"
      ],
      "correctIndex": 1,
      "explanation": "The lesson says infrared reflection provides the sensor's obstacle reading.",
      "hint": "Compare how sensors notice nearby objects."
    },
    {
      "id": "l4-back-up-buzzer-05",
      "topic": "sensor-readings",
      "learningSlide": 6,
      "prompt": "What is the infrared sensor's stated reading range?",
      "choices": [
        "0 to 100",
        "0 to 10",
        "100 to 200",
        "1 to 1000"
      ],
      "correctIndex": 0,
      "explanation": "The lesson specifies a measurement value from 0 to 100.",
      "hint": "Consider how reflection affects a sensor reading."
    },
    {
      "id": "l4-back-up-buzzer-06",
      "topic": "sensor-readings",
      "learningSlide": 6,
      "prompt": "On this infrared sensor, what generally happens to the reading as an object gets farther away?",
      "choices": [
        "It always becomes zero",
        "It becomes a sound",
        "It increases",
        "It stays at ten"
      ],
      "correctIndex": 2,
      "explanation": "A larger value represents a greater separation in this lesson.",
      "hint": "Consider how reflection affects a sensor reading."
    },
    {
      "id": "l4-back-up-buzzer-07",
      "topic": "reversing-program",
      "learningSlide": 17,
      "prompt": "What does the car do while reversing before reaching the stopping threshold?",
      "choices": [
        "Makes a piano sound",
        "Flashes only its headlights",
        "Displays a QR code",
        "Stops both motors immediately"
      ],
      "correctIndex": 0,
      "explanation": "The reversing program makes a piano sound while moving backwards.",
      "hint": "Follow the lesson's driving and stopping sequence."
    },
    {
      "id": "l4-back-up-buzzer-08",
      "topic": "reversing-program",
      "learningSlide": 17,
      "prompt": "What happens when the obstacle reading becomes less than 10?",
      "choices": [
        "The car speeds up",
        "The car changes direction forever",
        "The sensor disconnects",
        "The car stops and makes a braking sound"
      ],
      "correctIndex": 3,
      "explanation": "Slide 17 tells the robot to stop and play a braking sound below the threshold.",
      "hint": "Follow the lesson's driving and stopping sequence."
    },
    {
      "id": "l4-back-up-buzzer-09",
      "topic": "testing-and-controls",
      "learningSlide": 19,
      "prompt": "Why is this infrared sensor not suitable for precise distance measurements?",
      "choices": [
        "It only senses color names",
        "Its value depends on infrared reflection",
        "It requires GPS",
        "It measures only temperature"
      ],
      "correctIndex": 1,
      "explanation": "Its reflection-based output is suited to judging distance changes, not exact distance.",
      "hint": "Recall the controller's job after a program is downloaded."
    },
    {
      "id": "l4-back-up-buzzer-10",
      "topic": "testing-and-controls",
      "learningSlide": 20,
      "prompt": "What must be downloaded to the controller to run the car's intended actions?",
      "choices": [
        "A photograph",
        "A map of the classroom",
        "The programmed instructions",
        "A video file"
      ],
      "correctIndex": 2,
      "explanation": "The project summary explains downloading the program to control motors and sounds.",
      "hint": "Recall the controller's job after a program is downloaded."
    }
  ]
};
