/** Level 4 quiz based on official 27-page Learning PDF. */
import type { QuizBank } from "../../quizStudio";
export const reactionTesterBank: QuizBank = {
  "projectId": "level-4-reaction-tester",
  "title": "Reaction Tester",
  "sourcePdfPath": "public/Level 4/Interactive Systems/Reaction Tester/19.Reaction Tester-Slides.pdf",
  "sourcePageCount": 27,
  "questions": [
    {
      "id": "l4-reaction-tester-01",
      "topic": "reaction-time",
      "learningSlide": 3,
      "prompt": "What does reaction time measure?",
      "choices": [
        "How quickly someone responds to a stimulus",
        "The robot's battery capacity",
        "The width of a screen",
        "A motor's gear ratio"
      ],
      "correctIndex": 0,
      "explanation": "The lesson describes reaction speed as how fast a person responds to a signal.",
      "hint": "Think about how a person responds to a stimulus."
    },
    {
      "id": "l4-reaction-tester-02",
      "topic": "reaction-time",
      "learningSlide": 4,
      "prompt": "Which kind of event can be used to test reaction speed?",
      "choices": [
        "Only a GPS signal",
        "A light or sound stimulus",
        "Only a wheel rotation",
        "A paper label"
      ],
      "correctIndex": 1,
      "explanation": "Reaction tests use stimuli such as light, sound and touch.",
      "hint": "Think about how a person responds to a stimulus."
    },
    {
      "id": "l4-reaction-tester-03",
      "topic": "screen-coordinates",
      "learningSlide": 15,
      "prompt": "What is the controller display's coordinate origin used for?",
      "choices": [
        "Measuring air pressure",
        "Playing notes",
        "Locating pixels on the screen",
        "Detecting motion"
      ],
      "correctIndex": 2,
      "explanation": "The display coordinate system specifies where content appears.",
      "hint": "Recall the screen's origin and pixel coordinates."
    },
    {
      "id": "l4-reaction-tester-04",
      "topic": "screen-coordinates",
      "learningSlide": 16,
      "prompt": "Which program block shows a numeric value at a chosen screen location?",
      "choices": [
        "Show digits at specified coordinates",
        "Change motor speed",
        "Read microphone volume",
        "Scan QR code"
      ],
      "correctIndex": 0,
      "explanation": "Slide 16 introduces displaying numbers at screen coordinates.",
      "hint": "Recall the screen's origin and pixel coordinates."
    },
    {
      "id": "l4-reaction-tester-05",
      "topic": "numeric-operators",
      "learningSlide": 17,
      "prompt": "What does the subtraction block return?",
      "choices": [
        "A song",
        "A difference between two numbers",
        "A picture",
        "A motor port"
      ],
      "correctIndex": 1,
      "explanation": "The numeric subtraction operator calculates the difference of its inputs.",
      "hint": "Consider how the program compares two time readings."
    },
    {
      "id": "l4-reaction-tester-06",
      "topic": "numeric-operators",
      "learningSlide": 19,
      "prompt": "Which controller-time value is subtracted to check the reaction window?",
      "choices": [
        "100",
        "500",
        "5000",
        "50000"
      ],
      "correctIndex": 2,
      "explanation": "The challenge checks current time minus 5000.",
      "hint": "Consider how the program compares two time readings."
    },
    {
      "id": "l4-reaction-tester-07",
      "topic": "test-sequence",
      "learningSlide": 18,
      "prompt": "What information appears on the screen during the basic timing program?",
      "choices": [
        "Controller time",
        "A map",
        "A QR code",
        "Battery temperature"
      ],
      "correctIndex": 0,
      "explanation": "Slide 18 repeatedly displays controller time.",
      "hint": "Follow the timer and touch-sensor steps."
    },
    {
      "id": "l4-reaction-tester-08",
      "topic": "test-sequence",
      "learningSlide": 19,
      "prompt": "Which sensor input is used to pause or judge the timed response?",
      "choices": [
        "GPS position",
        "Ambient humidity",
        "Motor angle",
        "Touch sensor press"
      ],
      "correctIndex": 3,
      "explanation": "The program checks the touch sensor during the response challenge.",
      "hint": "Follow the timer and touch-sensor steps."
    },
    {
      "id": "l4-reaction-tester-09",
      "topic": "reset-and-feedback",
      "learningSlide": 20,
      "prompt": "What happens when the left button is pressed?",
      "choices": [
        "Time resets to zero and the light turns white",
        "A new QR code is scanned",
        "The display is removed",
        "A wheel is replaced"
      ],
      "correctIndex": 0,
      "explanation": "Slide 20 resets the timer and sets a white light.",
      "hint": "Recall how a new test begins and how the result is shown."
    },
    {
      "id": "l4-reaction-tester-10",
      "topic": "reset-and-feedback",
      "learningSlide": 23,
      "prompt": "What message is shown after a successful optional challenge?",
      "choices": [
        "Try later",
        "Success",
        "No signal",
        "Error 999"
      ],
      "correctIndex": 1,
      "explanation": "The extension displays Success when the task succeeds.",
      "hint": "Recall how a new test begins and how the result is shown."
    }
  ]
};
