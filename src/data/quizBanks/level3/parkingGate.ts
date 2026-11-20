/** Source-checked Level 3 Learning PDF questions; page references are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const parkingGateBank: QuizBank = {
  "projectId": "level-3-parking-gate",
  "title": "Parking Gate",
  "sourcePdfPath": "public/Level 3/Learning/Machines & Mechanisms/Parking gate.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "gate-01",
      "topic": "access-purpose",
      "learningSlide": 2,
      "prompt": "What is the stated purpose of a parking gate?",
      "choices": [
        "Measuring weather",
        "Washing cars",
        "Managing vehicle access",
        "Changing light colors"
      ],
      "correctIndex": 2,
      "hint": "Think about an entrance that lets vehicles in or out.",
      "explanation": "Slide 2 describes controlling vehicle access."
    },
    {
      "id": "gate-02",
      "topic": "access-purpose",
      "learningSlide": 3,
      "prompt": "Why did intelligent gates become more useful as vehicle numbers increased?",
      "choices": [
        "Cars no longer needed entrances",
        "Parking areas stopped using barriers",
        "Every car required a new road",
        "Manual gates became difficult to manage"
      ],
      "correctIndex": 3,
      "hint": "Compare operating gates by hand with automated operation.",
      "explanation": "Slide 3 says increasing vehicle numbers made manual gates difficult."
    },
    {
      "id": "gate-03",
      "topic": "vehicle-presence",
      "learningSlide": 14,
      "prompt": "What sensor is proposed to detect an approaching vehicle?",
      "choices": [
        "Infrared sensor",
        "Soil sensor",
        "Barometric sensor",
        "Gyroscope"
      ],
      "correctIndex": 0,
      "hint": "The optional coding task mentions a named sensor.",
      "explanation": "Slide 14 proposes infrared sensors to detect approaching vehicles."
    },
    {
      "id": "gate-04",
      "topic": "vehicle-presence",
      "learningSlide": 14,
      "prompt": "What event should start the parking gate in the infrared-sensor task?",
      "choices": [
        "Changing the controller's case color",
        "A vehicle approaching",
        "Turning off room lights",
        "Having no sensor reading"
      ],
      "correctIndex": 1,
      "hint": "Look for the condition that starts gate operation.",
      "explanation": "Slide 14 says the gate begins working when a vehicle approaches."
    },
    {
      "id": "gate-05",
      "topic": "infrared-color",
      "learningSlide": 15,
      "prompt": "What other application of the infrared sensor appears in the evaluation?",
      "choices": [
        "Playing audio",
        "Measuring rain",
        "Recognizing colors",
        "Turning a motor by itself"
      ],
      "correctIndex": 2,
      "hint": "The evaluation asks what color the sensor identifies.",
      "explanation": "Slide 15 describes infrared color recognition."
    },
    {
      "id": "gate-06",
      "topic": "infrared-color",
      "learningSlide": 15,
      "prompt": "What should students observe after entering two numbers in the infrared evaluation?",
      "choices": [
        "Wheel count",
        "Sound decibels",
        "Battery serial number",
        "The recognized color"
      ],
      "correctIndex": 3,
      "hint": "Look at the color-recognition result.",
      "explanation": "Slide 15 asks students to enter two numbers and observe the identified color."
    },
    {
      "id": "gate-07",
      "topic": "motor-operation",
      "learningSlide": 16,
      "prompt": "What rotation can the completed program control?",
      "choices": [
        "Single and double motors",
        "Real cars' engines",
        "Cloud movement",
        "The keyboard layout"
      ],
      "correctIndex": 0,
      "hint": "The project summary names the motors.",
      "explanation": "Slide 16 says students can control single-motor and double-motor rotation."
    },
    {
      "id": "gate-08",
      "topic": "motor-operation",
      "learningSlide": 16,
      "prompt": "What other output can the controller make besides motor movement?",
      "choices": [
        "Rain",
        "Sound",
        "Printed paper",
        "Steam"
      ],
      "correctIndex": 1,
      "hint": "The summary mentions another controller output.",
      "explanation": "Slide 16 states that the controller can produce sound."
    },
    {
      "id": "gate-09",
      "topic": "program-use",
      "learningSlide": 16,
      "prompt": "Where is the finished program downloaded?",
      "choices": [
        "Into a traffic pole",
        "Into a fuel tank",
        "To the controller",
        "Onto a printed worksheet"
      ],
      "correctIndex": 2,
      "hint": "The controller runs the program.",
      "explanation": "Slide 16 says students download their program to the controller."
    },
    {
      "id": "gate-10",
      "topic": "program-use",
      "learningSlide": 16,
      "prompt": "What scene are students asked to simulate after building the gate?",
      "choices": [
        "A robot crossing a river",
        "An elevator moving",
        "A solar panel following the sun",
        "A car passing through a parking gate"
      ],
      "correctIndex": 3,
      "hint": "The final task recreates a real parking entrance.",
      "explanation": "Slide 16 asks students to simulate a car passing through the gate."
    }
  ]
};
