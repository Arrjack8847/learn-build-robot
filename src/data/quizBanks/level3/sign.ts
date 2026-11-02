/** Verified against official Level 3 PDF; references are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const signBank: QuizBank = {
  "projectId": "level-3-sign",
  "title": "Sign",
  "sourcePdfPath": "public/Level 3/Learning/Mechanisms and Concepts/Sign.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "sign-01",
      "topic": "navigation",
      "learningSlide": 2,
      "prompt": "What does GPS provide for navigation according to the introduction?",
      "choices": [
        "Location information",
        "Door lock passwords",
        "Motor angle feedback",
        "Sound frequency settings"
      ],
      "correctIndex": 0,
      "hint": "Signs provide directions even when electronic navigation is available.",
      "explanation": "Slide 2 discusses GPS location services."
    },
    {
      "id": "sign-02",
      "topic": "navigation",
      "learningSlide": 4,
      "prompt": "Why are physical signs useful even with GPS navigation?",
      "choices": [
        "They measure building temperature",
        "They help people find places indoors",
        "They operate vehicle motors",
        "They eliminate the need for doorways"
      ],
      "correctIndex": 1,
      "hint": "Signs provide directions even when electronic navigation is available.",
      "explanation": "Slide 4 explains that signs remain helpful for indoor wayfinding."
    },
    {
      "id": "sign-03",
      "topic": "display",
      "learningSlide": 5,
      "prompt": "Which output device is named when designing the electronic sign?",
      "choices": [
        "Ultrasonic sensor",
        "Motor encoder",
        "Expression Screen",
        "Battery switch"
      ],
      "correctIndex": 2,
      "hint": "The model uses an expression display to show a direction.",
      "explanation": "Slide 5 names an Expression Screen for the sign."
    },
    {
      "id": "sign-04",
      "topic": "display",
      "learningSlide": 17,
      "prompt": "Which direction symbol should be displayed when the door turns right?",
      "choices": [
        "Left-turn symbol",
        "Stop symbol only",
        "Straight-ahead arrow only",
        "Right-turn symbol"
      ],
      "correctIndex": 3,
      "hint": "The model uses an expression display to show a direction.",
      "explanation": "Slide 17 pairs a right turn with a right-turn sign."
    },
    {
      "id": "sign-05",
      "topic": "rotation",
      "learningSlide": 6,
      "prompt": "What two features are combined in this project?",
      "choices": [
        "A revolving door and a directional sign",
        "A music box and a weighing scale",
        "A fan and a touch keyboard",
        "A trolley and a cash counter"
      ],
      "correctIndex": 0,
      "hint": "The robotic design includes a rotating passage.",
      "explanation": "Slide 6 introduces the revolving-door and sign combination."
    },
    {
      "id": "sign-06",
      "topic": "rotation",
      "learningSlide": 17,
      "prompt": "Which movement is implemented first in the sign's coding task?",
      "choices": [
        "Open both curtains",
        "Turn the revolving door to the right",
        "Rotate a wheel only backward",
        "Lower a trash-bin lid"
      ],
      "correctIndex": 1,
      "hint": "The robotic design includes a rotating passage.",
      "explanation": "Slide 17 starts by turning the revolving door to the right."
    },
    {
      "id": "sign-07",
      "topic": "touch",
      "learningSlide": 18,
      "prompt": "How many touch sensors control the two direction choices?",
      "choices": [
        "One",
        "Four",
        "Two",
        "None"
      ],
      "correctIndex": 2,
      "hint": "Two inputs select different movement directions.",
      "explanation": "Slide 18 assigns one sensor to right and one to left."
    },
    {
      "id": "sign-08",
      "topic": "touch",
      "learningSlide": 18,
      "prompt": "What should the second touch sensor trigger in the two-direction task?",
      "choices": [
        "Another right turn without a symbol",
        "An ultrasonic distance alarm",
        "A motor reset only",
        "A left turn with a left-turn symbol"
      ],
      "correctIndex": 3,
      "hint": "Two inputs select different movement directions.",
      "explanation": "Slide 18 maps the second touch to left turn and its symbol."
    },
    {
      "id": "sign-09",
      "topic": "extension",
      "learningSlide": 19,
      "prompt": "What change is invited during the evaluation extension?",
      "choices": [
        "Replace the displayed left/right symbols with other symbols",
        "Replace the controller with a microphone",
        "Remove the turning mechanism",
        "Make all touch inputs identical"
      ],
      "correctIndex": 0,
      "hint": "Display symbols can be changed without replacing the robot.",
      "explanation": "Slide 19 asks learners to try different display symbols."
    },
    {
      "id": "sign-10",
      "topic": "extension",
      "learningSlide": 20,
      "prompt": "Which movement can the finished project program control?",
      "choices": [
        "Room humidity",
        "Motor rotation",
        "Actual GPS satellite positions",
        "Mechanical friction without motors"
      ],
      "correctIndex": 1,
      "hint": "Display symbols can be changed without replacing the robot.",
      "explanation": "Slide 20 summarizes programmable motor rotation."
    }
  ]
};
