import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 33-page Learning PDF. */
export const minesweeperRobotBank: QuizBank = {
  "projectId": "level-6-minesweeper-robot",
  "title": "Minesweeper Robot",
  "sourcePdfPath": "public/Level 6/Learning/Programming & Precise Control/Minesweeper Robot/12.Minesweeper Robot -Slides.pdf",
  "sourcePageCount": 33,
  "questions": [
    {
      "id": "msr-01",
      "topic": "sensor-rules",
      "learningSlide": 6,
      "prompt": "What colour represents a detected mine in the basic program?",
      "choices": [
        "Red",
        "Black",
        "Blue",
        "White"
      ],
      "correctIndex": 0,
      "hint": "The detector treats red as hazardous.",
      "explanation": "Slide 6 stops the robot when red is identified."
    },
    {
      "id": "msr-02",
      "topic": "sensor-rules",
      "learningSlide": 25,
      "prompt": "Which colour is used as a no-mine condition before starting?",
      "choices": [
        "Red",
        "Black",
        "Yellow",
        "Purple"
      ],
      "correctIndex": 1,
      "hint": "The program checks for the safe ground reading.",
      "explanation": "Slide 25 waits for black before a manual start."
    },
    {
      "id": "msr-03",
      "topic": "start-stop",
      "learningSlide": 6,
      "prompt": "Which input can start the minesweeper robot?",
      "choices": [
        "QR-code payment",
        "Weather station reading",
        "Touch sensor or the left button",
        "Only a countdown reaching zero"
      ],
      "correctIndex": 2,
      "hint": "Starting is a manual command.",
      "explanation": "Slide 6 permits start by touch or left button."
    },
    {
      "id": "msr-04",
      "topic": "start-stop",
      "learningSlide": 26,
      "prompt": "Which action should immediately stop the minesweeper?",
      "choices": [
        "Recognition of ordinary black ground",
        "A decrease in ambient sound",
        "A successful temperature reading",
        "Detection of red or a stop button press"
      ],
      "correctIndex": 3,
      "hint": "Both danger detection and manual stop can halt motion.",
      "explanation": "Slide 26 stops on red, touch or right-button input."
    },
    {
      "id": "msr-05",
      "topic": "logic-priority",
      "learningSlide": 24,
      "prompt": "Which logical operator has higher priority: AND or OR?",
      "choices": [
        "AND",
        "OR",
        "They both override brackets",
        "Neither can appear in a condition"
      ],
      "correctIndex": 0,
      "hint": "Review the operator priority order.",
      "explanation": "Slide 24 gives brackets, NOT, AND, OR from highest to lowest."
    },
    {
      "id": "msr-06",
      "topic": "logic-priority",
      "learningSlide": 24,
      "prompt": "What has the highest priority among the lesson's expression operations?",
      "choices": [
        "OR",
        "Brackets",
        "A motor command",
        "A screen label"
      ],
      "correctIndex": 1,
      "hint": "Grouping controls which expression is evaluated first.",
      "explanation": "Slide 24 lists brackets before NOT, AND and OR."
    },
    {
      "id": "msr-07",
      "topic": "alerts",
      "learningSlide": 27,
      "prompt": "What alert is displayed when the sensor detects red?",
      "choices": [
        "Access Allowed",
        "Count down complete",
        "Mines are present",
        "Road centered"
      ],
      "correctIndex": 2,
      "hint": "The robot distinguishes a mine from a manual stop.",
      "explanation": "Slide 27 displays a mine warning and sounds a buzzer."
    },
    {
      "id": "msr-08",
      "topic": "alerts",
      "learningSlide": 27,
      "prompt": "What should the screen say for a manual stop without a mine?",
      "choices": [
        "Mines are present",
        "Payment successful",
        "Colour ID 4",
        "Manual Stop"
      ],
      "correctIndex": 3,
      "hint": "No red hazard was detected.",
      "explanation": "Slide 27 shows Manual Stop otherwise."
    },
    {
      "id": "msr-09",
      "topic": "extended-detection",
      "learningSlide": 28,
      "prompt": "What is the goal of the minesweeper expansion task?",
      "choices": [
        "Recognize more types of mines",
        "Remove every sensor",
        "Open a combination lock",
        "Measure rainfall"
      ],
      "correctIndex": 0,
      "hint": "The robot should identify more than one danger type.",
      "explanation": "Slide 28 asks to increase detectable mine types."
    },
    {
      "id": "msr-10",
      "topic": "extended-detection",
      "learningSlide": 29,
      "prompt": "How does the expanded minesweeper use colours?",
      "choices": [
        "It ignores all non-black blocks",
        "It stops for non-black blocks and displays different messages",
        "It uses colours only to change motor wiring",
        "It can detect only yellow as a safe path"
      ],
      "correctIndex": 1,
      "hint": "Colour recognition selects the stop message.",
      "explanation": "Slide 29 stops on non-black blocks and varies the display by colour."
    }
  ]
};
