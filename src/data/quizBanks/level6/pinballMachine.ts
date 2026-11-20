import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 25-page Learning PDF. */
export const pinballMachineBank: QuizBank = {
  "projectId": "level-6-pinball-machine",
  "title": "Pinball Machine",
  "sourcePdfPath": "public/Level 6/Learning/Interactive Mechanisms/Pinball Machine/30. Pinball Machine-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "pbm-01",
      "topic": "game-goals",
      "learningSlide": 10,
      "prompt": "What is the primary goal when playing the lesson's pinball game?",
      "choices": [
        "Prevent the ball from falling into the bottom end area",
        "Keep both baffles permanently lowered",
        "Stop the ball before it can move",
        "Turn off the ball launcher"
      ],
      "correctIndex": 0,
      "hint": "Students try to keep the ball in the scoring area.",
      "explanation": "Slide 10 says not to let the pinball fall to the bottom."
    },
    {
      "id": "pbm-02",
      "topic": "game-goals",
      "learningSlide": 10,
      "prompt": "What is the purpose of the pinball buffer mechanism?",
      "choices": [
        "Scan payment cards",
        "Bounce the ball and change its path",
        "Display digital expressions",
        "Measure air humidity"
      ],
      "correctIndex": 1,
      "hint": "The buffer affects the moving ball's trajectory.",
      "explanation": "Slide 10 says the buffer bounces the pinball."
    },
    {
      "id": "pbm-03",
      "topic": "mechanics",
      "learningSlide": 11,
      "prompt": "Which parts does the player control to keep the ball in play?",
      "choices": [
        "Two road-recognition cameras",
        "A pair of rain gauges",
        "The left and right baffles",
        "A password keypad"
      ],
      "correctIndex": 2,
      "hint": "These parts flip upward to redirect the ball.",
      "explanation": "Slide 11 identifies the left and right baffles."
    },
    {
      "id": "pbm-04",
      "topic": "mechanics",
      "learningSlide": 13,
      "prompt": "What activates the large motor's pinball baffle movement?",
      "choices": [
        "A thermometer",
        "A light meter",
        "A barcode printer",
        "A touch sensor"
      ],
      "correctIndex": 3,
      "hint": "The player presses a control.",
      "explanation": "Slide 13 connects the large motor to a touch sensor."
    },
    {
      "id": "pbm-05",
      "topic": "multitasking",
      "learningSlide": 15,
      "prompt": "How does the controller appear to run two pinball tasks at once?",
      "choices": [
        "By switching between tasks very quickly",
        "By running two completely separate computers",
        "By removing one motor's program",
        "By storing a single score"
      ],
      "correctIndex": 0,
      "hint": "The processor changes tasks faster than people notice.",
      "explanation": "Slide 15 describes rapid switching rather than true parallel execution."
    },
    {
      "id": "pbm-06",
      "topic": "multitasking",
      "learningSlide": 19,
      "prompt": "What does Task 2 operate in the lesson's multitasking program?",
      "choices": [
        "The right baffle",
        "The left baffle",
        "The scoring PDF",
        "The battery charger"
      ],
      "correctIndex": 1,
      "hint": "Task 1 already handles the right baffle.",
      "explanation": "Slide 19 assigns Task 2 to the left baffle."
    },
    {
      "id": "pbm-07",
      "topic": "baffle-control",
      "learningSlide": 17,
      "prompt": "Why does the baffle function check a state variable before moving?",
      "choices": [
        "To raise the price of the pinball",
        "To recognize a QR code",
        "To avoid retriggering while it is already lifting or falling",
        "To reset all scores to zero"
      ],
      "correctIndex": 2,
      "hint": "Repeated triggers during a movement can cause problems.",
      "explanation": "Slide 17 prevents new activation during an existing baffle motion."
    },
    {
      "id": "pbm-08",
      "topic": "baffle-control",
      "learningSlide": 17,
      "prompt": "What motor feedback is used to control the baffle's lifting and falling angles?",
      "choices": [
        "Humidity values",
        "Colour names",
        "GPS coordinates",
        "Encoder values"
      ],
      "correctIndex": 3,
      "hint": "The program needs rotation-angle feedback.",
      "explanation": "Slide 17 uses motor coded values for baffle angles."
    },
    {
      "id": "pbm-09",
      "topic": "optimization",
      "learningSlide": 23,
      "prompt": "What new baffle control is required in the optimization?",
      "choices": [
        "Different lift angles based on how long the button is pressed",
        "One unchangeable angle for every press",
        "No movement after touching the sensor",
        "Only random speed changes"
      ],
      "correctIndex": 0,
      "hint": "Longer and shorter presses can produce different motions.",
      "explanation": "Slide 23 links press duration with adjustable lift range."
    },
    {
      "id": "pbm-10",
      "topic": "optimization",
      "learningSlide": 23,
      "prompt": "What aspect of baffle motion should vary after the change?",
      "choices": [
        "The type of barcode used",
        "Its maximum lifting angle",
        "The screen's picture file name",
        "The ambient air temperature"
      ],
      "correctIndex": 1,
      "hint": "The task focuses on lift range rather than colour.",
      "explanation": "Slide 23 asks for baffles that rise to different angles."
    }
  ]
};
