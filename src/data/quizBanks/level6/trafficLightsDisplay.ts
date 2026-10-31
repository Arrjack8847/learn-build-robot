import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 29-page Learning PDF. */
export const trafficLightsDisplayBank: QuizBank = {
  "projectId": "level-6-traffic-lights-display",
  "title": "Traffic Lights Display",
  "sourcePdfPath": "public/Level 6/Learning/Illumination & Signals/Traffic Lights Display/10. Traffic Lights-Teaching Slides.pdf",
  "sourcePageCount": 29,
  "questions": [
    {
      "id": "tld-01",
      "topic": "traffic-purpose",
      "learningSlide": 14,
      "prompt": "Why does the lesson include a pedestrian push button?",
      "choices": [
        "To request a safe crossing interval",
        "To increase every vehicle's speed",
        "To record a bank-card balance",
        "To make the lights stay off"
      ],
      "correctIndex": 0,
      "hint": "Pedestrians can ask for green when needed.",
      "explanation": "Slide 14 introduces button-controlled pedestrian lights."
    },
    {
      "id": "tld-02",
      "topic": "traffic-purpose",
      "learningSlide": 16,
      "prompt": "What output component displays crossing and no-crossing patterns?",
      "choices": [
        "A rain gauge",
        "A dot matrix screen",
        "An RFID payment reader",
        "A camera lens"
      ],
      "correctIndex": 1,
      "hint": "The signal uses visible patterns.",
      "explanation": "Slide 16 specifies dot-matrix signals."
    },
    {
      "id": "tld-03",
      "topic": "signals-and-patterns",
      "learningSlide": 17,
      "prompt": "What value represents a green light in the program?",
      "choices": [
        "-1",
        "100",
        "1",
        "240"
      ],
      "correctIndex": 2,
      "hint": "Two signed values represent the main light states.",
      "explanation": "Slide 17 uses 1 for green."
    },
    {
      "id": "tld-04",
      "topic": "signals-and-patterns",
      "learningSlide": 17,
      "prompt": "What value represents a red light in the program?",
      "choices": [
        "1",
        "2",
        "10",
        "-1"
      ],
      "correctIndex": 3,
      "hint": "This state is the opposite of green.",
      "explanation": "Slide 17 uses -1 for red."
    },
    {
      "id": "tld-05",
      "topic": "timing-logic",
      "learningSlide": 19,
      "prompt": "When pedestrian lights are red, what colour should vehicle lights be?",
      "choices": [
        "Green",
        "Red",
        "Off at all times",
        "Purple"
      ],
      "correctIndex": 0,
      "hint": "Only one direction should normally have permission.",
      "explanation": "Slide 19 says vehicle green corresponds to pedestrian red."
    },
    {
      "id": "tld-06",
      "topic": "timing-logic",
      "learningSlide": 21,
      "prompt": "When does the normal signal sequence switch to the next state?",
      "choices": [
        "Every time a product list changes",
        "After the specified duration has elapsed",
        "Only after the program ends",
        "Only when the temperature reaches 100"
      ],
      "correctIndex": 1,
      "hint": "Timer variables control the cycle.",
      "explanation": "Slide 21 changes state after the timed interval."
    },
    {
      "id": "tld-07",
      "topic": "pedestrian-button",
      "learningSlide": 22,
      "prompt": "When can pedestrians use the button to request green?",
      "choices": [
        "Only when both lights are already green",
        "Only after unplugging the controller",
        "During the pedestrian red phase",
        "Only when a QR code is scanned"
      ],
      "correctIndex": 2,
      "hint": "The button is a temporary red-to-green request.",
      "explanation": "Slide 22 checks the button while red is on."
    },
    {
      "id": "tld-08",
      "topic": "pedestrian-button",
      "learningSlide": 22,
      "prompt": "What should the program reset after a button-requested change?",
      "choices": [
        "The PDF's page count",
        "The motor encoder permanently",
        "The product balance",
        "The timing reference"
      ],
      "correctIndex": 3,
      "hint": "Restarting the time keeps signal periods correct.",
      "explanation": "Slide 22 resets time after changing lights."
    },
    {
      "id": "tld-09",
      "topic": "reminder-extension",
      "learningSlide": 27,
      "prompt": "What new feature is required for automatic periodic signal changes?",
      "choices": [
        "Turn on the light-change reminder for every transition",
        "Remove the pedestrian crossing patterns",
        "Disable all time tracking",
        "Keep the signal fixed on red"
      ],
      "correctIndex": 0,
      "hint": "A reminder should accompany all changes.",
      "explanation": "Slide 27 requires the reminder for every light change."
    },
    {
      "id": "tld-10",
      "topic": "reminder-extension",
      "learningSlide": 20,
      "prompt": "Why would a reminder be useful when lights are about to change?",
      "choices": [
        "It stores product prices",
        "It warns vehicles and pedestrians of a coming transition",
        "It reads the camera's face position",
        "It makes every traffic light green"
      ],
      "correctIndex": 1,
      "hint": "The reminder communicates an imminent signal change.",
      "explanation": "Slide 20 describes the light-change tip function."
    }
  ]
};
