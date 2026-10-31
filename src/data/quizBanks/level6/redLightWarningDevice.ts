import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 33-page Learning PDF. */
export const redLightWarningDeviceBank: QuizBank = {
  "projectId": "level-6-red-light-warning-device",
  "title": "Red Light Warning Device",
  "sourcePdfPath": "public/Level 6/Learning/Illumination & Signals/Red Light Warning Device/12. Red Light Warning Device-Teaching Slides.pdf",
  "sourcePageCount": 33,
  "questions": [
    {
      "id": "rlw-01",
      "topic": "warning-purpose",
      "learningSlide": 11,
      "prompt": "Why is the red-light warning device built?",
      "choices": [
        "To alert people approaching an unsafe red signal",
        "To check a card payment balance",
        "To identify product prices",
        "To sort coloured blocks"
      ],
      "correctIndex": 0,
      "hint": "The project promotes road safety.",
      "explanation": "Slide 11 introduces warning of red-light approaches."
    },
    {
      "id": "rlw-02",
      "topic": "warning-purpose",
      "learningSlide": 13,
      "prompt": "Which component measures distance near the road?",
      "choices": [
        "Bank card reader",
        "Laser ranging sensor",
        "Humidity sensor",
        "Remote projector"
      ],
      "correctIndex": 1,
      "hint": "The device checks how close a person or object is.",
      "explanation": "Slide 13 labels laser ranging as the input."
    },
    {
      "id": "rlw-03",
      "topic": "nonblocking-programming",
      "learningSlide": 15,
      "prompt": "Why does the traffic-light program use controller time instead of waiting?",
      "choices": [
        "To remove the need for a controller",
        "To stop time calculations",
        "To keep ranging checks running while lights change",
        "To store pictures in a list"
      ],
      "correctIndex": 2,
      "hint": "Blocking waits would interrupt live detection.",
      "explanation": "Slide 15 uses controller time for non-blocking monitoring."
    },
    {
      "id": "rlw-04",
      "topic": "nonblocking-programming",
      "learningSlide": 14,
      "prompt": "Which two operations must work without stopping one another?",
      "choices": [
        "Product pricing and password changes",
        "Two separate PDF downloads",
        "A dot-matrix clown and a barcode lookup",
        "Traffic light changes and continuous distance sensing"
      ],
      "correctIndex": 3,
      "hint": "The signal must not interrupt monitoring.",
      "explanation": "Slide 14 says sensor reading continues as the lights change."
    },
    {
      "id": "rlw-05",
      "topic": "light-timing",
      "learningSlide": 23,
      "prompt": "Which cycle values turn the red light on?",
      "choices": [
        "1 through 30",
        "31 through 50",
        "51 through 80",
        "81 through 100"
      ],
      "correctIndex": 0,
      "hint": "Check the start of the 100-step cycle.",
      "explanation": "Slide 23 maps values 1–30 to red."
    },
    {
      "id": "rlw-06",
      "topic": "light-timing",
      "learningSlide": 24,
      "prompt": "Which cycle values turn the green light on?",
      "choices": [
        "1 through 30",
        "51 through 80",
        "31 through 50",
        "81 through 100"
      ],
      "correctIndex": 1,
      "hint": "The green phase comes after the first flashing transition.",
      "explanation": "Slide 24 maps values 51–80 to green."
    },
    {
      "id": "rlw-07",
      "topic": "distance-alert",
      "learningSlide": 16,
      "prompt": "What does light status 1 mean?",
      "choices": [
        "Crossing is always safe",
        "The laser has been disconnected",
        "The road should not be crossed",
        "The traffic controller is off"
      ],
      "correctIndex": 2,
      "hint": "A red or yellow light forbids crossing.",
      "explanation": "Slide 16 defines status 1 as red/yellow, do not cross."
    },
    {
      "id": "rlw-08",
      "topic": "distance-alert",
      "learningSlide": 27,
      "prompt": "When does the device display the warning expression?",
      "choices": [
        "Whenever the light is green regardless of distance",
        "Only after a successful payment",
        "Only when the motor has gear 4",
        "When distance is under 100 and light status is 1"
      ],
      "correctIndex": 3,
      "hint": "The alert combines proximity and unsafe light state.",
      "explanation": "Slide 27 checks distance < 100 and status 1."
    },
    {
      "id": "rlw-09",
      "topic": "sound-extension",
      "learningSlide": 31,
      "prompt": "What new warning is added in the optimization task?",
      "choices": [
        "A sound while the warning pattern is displayed",
        "A bank balance update",
        "A new pinball baffle",
        "A photo projector"
      ],
      "correctIndex": 0,
      "hint": "The alert should be both visible and audible.",
      "explanation": "Slide 31 asks the controller to sound along with the pattern."
    },
    {
      "id": "rlw-10",
      "topic": "sound-extension",
      "learningSlide": 31,
      "prompt": "What must remain uninterrupted when the sound is added?",
      "choices": [
        "Only the buzzer itself",
        "The traffic light sequence",
        "A list of product names",
        "The picture projector"
      ],
      "correctIndex": 1,
      "hint": "Feedback must not block normal signal changes.",
      "explanation": "Slide 31 requires unchanged traffic-light operation."
    }
  ]
};
