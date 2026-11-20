import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 24-page Learning PDF. */
export const rockPaperScissorsRobotBank: QuizBank = {
  "projectId": "level-6-rock-paper-scissors-robot",
  "title": "Rock Paper Scissors Robot",
  "sourcePdfPath": "public/Level 6/Learning/Sensor-Focused Robots/Rock-paper-scissors Robot/30.Rock-paper-scissors Robot-Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "rps-01",
      "topic": "gesture-sensing",
      "learningSlide": 13,
      "prompt": "Which AI vision mode is used to read a player's move?",
      "choices": [
        "Gesture recognition",
        "Road recognition",
        "Tag-code scanning",
        "Rainfall detection"
      ],
      "correctIndex": 0,
      "hint": "The player shows a hand sign.",
      "explanation": "Slide 13 switches AI vision to gesture recognition mode."
    },
    {
      "id": "rps-02",
      "topic": "gesture-sensing",
      "learningSlide": 10,
      "prompt": "Which controller port connects to the AI vision module?",
      "choices": [
        "M1",
        "P8",
        "M2",
        "M4"
      ],
      "correctIndex": 1,
      "hint": "The camera uses a sensor port, not a motor port.",
      "explanation": "Slide 10 connects the vision module to P8."
    },
    {
      "id": "rps-03",
      "topic": "random-choice",
      "learningSlide": 14,
      "prompt": "What range of random numbers chooses the robot's move?",
      "choices": [
        "1 to 100",
        "0 to 240",
        "1 to 3",
        "10 to 20"
      ],
      "correctIndex": 2,
      "hint": "There are three possible hand gestures.",
      "explanation": "Slide 14 sets X to a random number from 1 through 3."
    },
    {
      "id": "rps-04",
      "topic": "random-choice",
      "learningSlide": 15,
      "prompt": "When does the robot choose and display its own move?",
      "choices": [
        "Before any person is in front of the sensor",
        "Only when the PDF is closed",
        "Only after the motor is unplugged",
        "When a nonzero player gesture ID is detected"
      ],
      "correctIndex": 3,
      "hint": "A player's recognized move triggers the round.",
      "explanation": "Slide 15 checks for ID not equal to zero."
    },
    {
      "id": "rps-05",
      "topic": "result-calculation",
      "learningSlide": 14,
      "prompt": "How is the program variable Result calculated?",
      "choices": [
        "Detected gesture ID minus random number X",
        "Random number plus motor speed",
        "Frame count multiplied by 25",
        "Product price minus card balance"
      ],
      "correctIndex": 0,
      "hint": "The difference is used to decide the outcome.",
      "explanation": "Slide 14 defines Result = ID - X."
    },
    {
      "id": "rps-06",
      "topic": "result-calculation",
      "learningSlide": 12,
      "prompt": "What does Result equal to zero indicate?",
      "choices": [
        "A win",
        "A draw",
        "A loss",
        "An invalid camera connection"
      ],
      "correctIndex": 1,
      "hint": "Both moves produced an equal encoded value.",
      "explanation": "Slide 12 describes zero as a draw."
    },
    {
      "id": "rps-07",
      "topic": "display-and-reset",
      "learningSlide": 17,
      "prompt": "Where is the game outcome displayed?",
      "choices": [
        "Inside the motor only",
        "On a printed payment receipt",
        "The third line of the screen",
        "In the weather dashboard"
      ],
      "correctIndex": 2,
      "hint": "The program shows a visible result to the player.",
      "explanation": "Slide 17 displays the outcome on line three."
    },
    {
      "id": "rps-08",
      "topic": "display-and-reset",
      "learningSlide": 18,
      "prompt": "When is the game reset ready for another round?",
      "choices": [
        "As soon as an unrelated colour is seen",
        "Only after the device power is removed",
        "Before the player shows any gesture",
        "After the gesture recognition ID returns to zero"
      ],
      "correctIndex": 3,
      "hint": "The player needs to withdraw their hand.",
      "explanation": "Slide 18 waits for gesture ID 0 and clears the screen."
    },
    {
      "id": "rps-09",
      "topic": "lamp-upgrade",
      "learningSlide": 22,
      "prompt": "What new component is added in the expansion task?",
      "choices": [
        "A colour lamp",
        "A barcode scanner",
        "A laser rangefinder",
        "A rain gauge"
      ],
      "correctIndex": 0,
      "hint": "The upgrade provides a coloured indicator.",
      "explanation": "Slide 22 requests a colour lamp."
    },
    {
      "id": "rps-10",
      "topic": "lamp-upgrade",
      "learningSlide": 22,
      "prompt": "What should determine the colour lamp's output?",
      "choices": [
        "Only the PDF page number",
        "The calculated game result",
        "A fixed unrelated colour",
        "The current air humidity"
      ],
      "correctIndex": 1,
      "hint": "Different outcomes get different visual feedback.",
      "explanation": "Slide 22 links lamp colours to calculation results."
    }
  ]
};
