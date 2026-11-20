/** Source: SHA-matched official Level 5 Learning PDF (23 pages). */
import type { QuizBank } from "../../quizStudio";

export const smartGuidingCarBank: QuizBank = {
  "projectId": "level-5-smart-guiding-car",
  "title": "Smart Guiding Car",
  "sourcePdfPath": "public/Level 5/Learning/Autonomous Navigation & Ranging/Smart Guiding Car/02. Smart Guiding Car - Teaching Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "level-5-smart-guiding-car-01",
      "topic": "historic-navigation",
      "learningSlide": 6,
      "prompt": "What historic Chinese vehicle inspired the guiding-car lesson?",
      "choices": [
        "Sinan cart or south-pointing carriage",
        "Steam locomotive",
        "Modern electric scooter",
        "Airplane with a compass screen"
      ],
      "correctIndex": 0,
      "hint": "The background mentions a mechanical direction indicator.",
      "explanation": "Slide 6 introduces the Sinan or south-pointing carriage."
    },
    {
      "id": "level-5-smart-guiding-car-02",
      "topic": "historic-navigation",
      "learningSlide": 7,
      "prompt": "How did the historical guiding cart adjust its pointer as it turned?",
      "choices": [
        "By moving a propeller",
        "Through a gear mechanism driven by wheel movement",
        "Through a satellite receiver",
        "Using a touchscreen map"
      ],
      "correctIndex": 1,
      "hint": "The mechanism used the wheels' changing motion.",
      "explanation": "Slide 7 describes wheel movement and gear transmission affecting the pointing figure."
    },
    {
      "id": "level-5-smart-guiding-car-03",
      "topic": "direction-values",
      "learningSlide": 10,
      "prompt": "Which attitude value does the model use as a simple left-right direction reading?",
      "choices": [
        "Motor encoder temperature",
        "Infrared code 100",
        "Z yaw value",
        "Battery percentage"
      ],
      "correctIndex": 2,
      "hint": "Look for the named axis in the lesson.",
      "explanation": "Slide 10 uses the attitude sensor's Z value as a direction indication."
    },
    {
      "id": "level-5-smart-guiding-car-04",
      "topic": "direction-values",
      "learningSlide": 11,
      "prompt": "How does the model know whether it is facing the chosen heading?",
      "choices": [
        "Count the number of speaker beeps",
        "Read only the motor's battery color",
        "Look up the project's filename",
        "Compare current Z yaw with the stored reference value"
      ],
      "correctIndex": 3,
      "hint": "A current measurement is compared with a target.",
      "explanation": "Slide 11 teaches comparing yaw values with a chosen direction."
    },
    {
      "id": "level-5-smart-guiding-car-05",
      "topic": "reference-direction",
      "learningSlide": 11,
      "prompt": "What does 'south' mean in the classroom guiding-car program?",
      "choices": [
        "A direction value defined in advance by the user",
        "Guaranteed geographic south on every run",
        "The motor's reverse port",
        "A QR-code reading"
      ],
      "correctIndex": 0,
      "hint": "The reference is selected rather than measured against true north.",
      "explanation": "Slide 11 says the lesson's south is an artificially assigned heading, not necessarily geographic south."
    },
    {
      "id": "level-5-smart-guiding-car-06",
      "topic": "reference-direction",
      "learningSlide": 15,
      "prompt": "Where does the initialization program place the chosen direction value?",
      "choices": [
        "On a motor's casing",
        "In controller storage",
        "Inside an unrelated PDF page",
        "In a gear's paint color"
      ],
      "correctIndex": 1,
      "hint": "The reference must remain available for later comparisons.",
      "explanation": "Slide 15 sets the direction value and stores it inside the controller."
    },
    {
      "id": "level-5-smart-guiding-car-07",
      "topic": "steering-correction",
      "learningSlide": 14,
      "prompt": "What should the robot do until its yaw matches the set target?",
      "choices": [
        "Switch off the attitude sensor",
        "Wait for a QR-code payment",
        "Turn gradually while moving",
        "Always drive straight regardless of error"
      ],
      "correctIndex": 2,
      "hint": "It corrects heading rather than ignoring drift.",
      "explanation": "Slide 14 turns the robot until Z reaches the assigned angle."
    },
    {
      "id": "level-5-smart-guiding-car-08",
      "topic": "steering-correction",
      "learningSlide": 17,
      "prompt": "What happens when the guiding car is already pointing in the correct direction?",
      "choices": [
        "It rotates without stopping",
        "It sounds an overheat alarm",
        "It reverses indefinitely",
        "It drives forward"
      ],
      "correctIndex": 3,
      "hint": "The correction is no longer needed.",
      "explanation": "Slide 17 commands straight travel once the target heading is reached."
    },
    {
      "id": "level-5-smart-guiding-car-09",
      "topic": "extensions",
      "learningSlide": 17,
      "prompt": "Which color indicator does the lesson use while the car is correcting its direction?",
      "choices": [
        "Green",
        "Blue",
        "Red",
        "No light at all"
      ],
      "correctIndex": 0,
      "hint": "The LED distinguishes turning from travelling straight.",
      "explanation": "Slide 17 labels green during rotating correction and blue during straight motion."
    },
    {
      "id": "level-5-smart-guiding-car-10",
      "topic": "extensions",
      "learningSlide": 21,
      "prompt": "What is the goal of the guiding-car optimization exercise?",
      "choices": [
        "Use QR codes instead of a set angle",
        "Make the robot navigate out of a square using its chosen heading",
        "Remove its heading correction entirely",
        "Replace the sensor with an audio player"
      ],
      "correctIndex": 1,
      "hint": "The challenge applies the same steering control to a new path.",
      "explanation": "Slide 21 asks students to adapt the heading-based movement to leave a square."
    }
  ]
};
