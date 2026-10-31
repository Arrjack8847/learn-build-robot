import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 31-page Learning PDF. */
export const gorillaBank: QuizBank = {
  "projectId": "level-6-gorilla",
  "title": "Gorilla",
  "sourcePdfPath": "public/Level 6/Learning/Action-Oriented/Gorilla/04.Gorilla - Slides.pdf",
  "sourcePageCount": 31,
  "questions": [
    {
      "id": "gor-01",
      "topic": "sensors",
      "learningSlide": 6,
      "prompt": "Which sensor detects that someone has walked past the gorilla?",
      "choices": [
        "Ultrasonic sensor",
        "Rain sensor",
        "Compass",
        "Thermometer"
      ],
      "correctIndex": 0,
      "hint": "The robot detects a nearby visitor.",
      "explanation": "Slide 6 uses ultrasonic detection to start an action."
    },
    {
      "id": "gor-02",
      "topic": "sensors",
      "learningSlide": 6,
      "prompt": "Which sensor tells the gorilla that somebody has shaken its hand?",
      "choices": [
        "Humidity sensor",
        "Touch sensor",
        "Road-following camera",
        "Light meter"
      ],
      "correctIndex": 1,
      "hint": "Physical contact is needed for a handshake.",
      "explanation": "Slide 6 uses a touch sensor in the handshake mode."
    },
    {
      "id": "gor-03",
      "topic": "mode-selection",
      "learningSlide": 23,
      "prompt": "What random value range selects the gorilla's two original modes?",
      "choices": [
        "0 to 240",
        "10 to 100",
        "1 to 2",
        "4 to 8"
      ],
      "correctIndex": 2,
      "hint": "There are two possible actions.",
      "explanation": "Slide 23 selects a random action mode from 1 or 2."
    },
    {
      "id": "gor-04",
      "topic": "mode-selection",
      "learningSlide": 22,
      "prompt": "When does the robot randomly choose an action mode?",
      "choices": [
        "As soon as any PDF is opened",
        "Only when a battery expires",
        "Only when the motor is removed",
        "After detecting a person passing by"
      ],
      "correctIndex": 3,
      "hint": "The mode selection follows the proximity check.",
      "explanation": "Slide 22 chooses a mode when someone passes by."
    },
    {
      "id": "gor-05",
      "topic": "handshake",
      "learningSlide": 24,
      "prompt": "What does action mode 1 tell the gorilla to do?",
      "choices": [
        "Raise its left hand and wait for touch",
        "Show a six-digit access code",
        "Follow a black road",
        "Measure room humidity"
      ],
      "correctIndex": 0,
      "hint": "Mode 1 simulates a handshake.",
      "explanation": "Slide 24 raises the left hand and waits for a touch."
    },
    {
      "id": "gor-06",
      "topic": "handshake",
      "learningSlide": 24,
      "prompt": "Why is a non-blocking motor module used when lowering the left hand?",
      "choices": [
        "To delete the motor program",
        "To avoid the movement being blocked by the foot",
        "To make the sensor detect blue",
        "To record a transaction"
      ],
      "correctIndex": 1,
      "hint": "The motor must allow another movement to continue.",
      "explanation": "Slide 24 says non-blocking motor control prevents the foot from blocking the motion."
    },
    {
      "id": "gor-07",
      "topic": "banana-response",
      "learningSlide": 25,
      "prompt": "Which colour completes the banana-request action?",
      "choices": [
        "Red",
        "Blue",
        "Yellow",
        "White"
      ],
      "correctIndex": 2,
      "hint": "The gorilla is waiting for a banana.",
      "explanation": "Slide 25 uses colour-sensor detection of yellow."
    },
    {
      "id": "gor-08",
      "topic": "banana-response",
      "learningSlide": 25,
      "prompt": "What should happen after an action mode finishes?",
      "choices": [
        "Keep the same action permanently active",
        "Erase all sensor readings",
        "Disconnect the controller",
        "Reset action mode to zero"
      ],
      "correctIndex": 3,
      "hint": "The robot must be ready for the next visitor.",
      "explanation": "Slide 25 resets action mode after the action."
    },
    {
      "id": "gor-09",
      "topic": "extensions",
      "learningSlide": 27,
      "prompt": "How many modes does the expanded gorilla program select from?",
      "choices": [
        "Three",
        "One",
        "Two",
        "Eight"
      ],
      "correctIndex": 0,
      "hint": "A new hand-waving mode is added.",
      "explanation": "Slide 27 expands random mode selection to 1 through 3."
    },
    {
      "id": "gor-10",
      "topic": "extensions",
      "learningSlide": 27,
      "prompt": "What does the third action mode do?",
      "choices": [
        "Open a QR-code gate",
        "Swing both hands up and down twice",
        "Read traffic lights",
        "Print an invoice"
      ],
      "correctIndex": 1,
      "hint": "It adds a dancing hand movement.",
      "explanation": "Slide 27 repeats left-and-right arm swinging two times."
    }
  ]
};
