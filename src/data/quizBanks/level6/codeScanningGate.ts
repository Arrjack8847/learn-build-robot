import type { QuizBank } from "../../quizStudio";
/** Questions sourced from the original 26-slide Level 6 Learning PDF. */
export const codeScanningGateBank: QuizBank = {
  "projectId": "level-6-code-scanning-gate",
  "title": "Code Scanning Gate",
  "sourcePdfPath": "public/Level 6/Learning/Automation & Security/Code-scanning Gate/04.Code-scanning Gate-Teaching Slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "csg-01",
      "topic": "electronic-passwords",
      "learningSlide": 9,
      "prompt": "What is the role of the management password in the electronic lock?",
      "choices": [
        "Manage system settings rather than open the door directly",
        "Only open the door and never configure settings",
        "Measure the gate motor speed",
        "Control the QR camera's picture brightness"
      ],
      "correctIndex": 0,
      "hint": "The lesson distinguishes management and opening permissions.",
      "explanation": "Slide 9 says the management password can manage the system but cannot open the door directly."
    },
    {
      "id": "csg-02",
      "topic": "electronic-passwords",
      "learningSlide": 10,
      "prompt": "What is the main principle behind an electronic combination lock?",
      "choices": [
        "Compare input credentials with a preset password",
        "Count how many times the door moves",
        "Turn on every motor regardless of input",
        "Open whenever anyone stands nearby"
      ],
      "correctIndex": 0,
      "hint": "Different unlocking methods reduce to the same comparison.",
      "explanation": "Slide 10 explains comparing input and saved password values."
    },
    {
      "id": "csg-03",
      "topic": "scanning-system",
      "learningSlide": 11,
      "prompt": "What reads the code in the classroom gate model?",
      "choices": [
        "A scanning camera",
        "A rain gauge",
        "A motor encoder",
        "A temperature sensor"
      ],
      "correctIndex": 0,
      "hint": "It needs to recognize QR-code information.",
      "explanation": "Slide 11 says the gate is controlled by a scanning camera."
    },
    {
      "id": "csg-04",
      "topic": "scanning-system",
      "learningSlide": 13,
      "prompt": "Which second function is built alongside QR-code door opening?",
      "choices": [
        "An alarm",
        "Road following",
        "A wind turbine",
        "A dot matrix clown face"
      ],
      "correctIndex": 0,
      "hint": "The model signals an incorrect access attempt.",
      "explanation": "Slide 13 requires an alarm function as well as opening."
    },
    {
      "id": "csg-05",
      "topic": "list-comparison",
      "learningSlide": 14,
      "prompt": "What is stored in List 1 during password checking?",
      "choices": [
        "The preset password",
        "The measured room temperature",
        "The number of motor revolutions",
        "The score in a shooting game"
      ],
      "correctIndex": 0,
      "hint": "List 2 holds the scanned password for comparison.",
      "explanation": "Slide 14 labels List 1 as preset password data."
    },
    {
      "id": "csg-06",
      "topic": "list-comparison",
      "learningSlide": 15,
      "prompt": "When should the lock sound an alarm while comparing the two lists?",
      "choices": [
        "When any corresponding password item differs",
        "Only when all digits match",
        "When both lists are empty",
        "Every time a correct code is scanned"
      ],
      "correctIndex": 0,
      "hint": "A single mismatch is enough to reject the input.",
      "explanation": "Slide 15 triggers an alarm if a compared password item is unequal."
    },
    {
      "id": "csg-07",
      "topic": "gate-control",
      "learningSlide": 18,
      "prompt": "When does the program evaluate the scanned password?",
      "choices": [
        "After the required number of code values have been scanned",
        "Before any code data is collected",
        "After the motor runs continuously for an hour",
        "Only when the camera is unplugged"
      ],
      "correctIndex": 0,
      "hint": "The scan list must contain enough digits first.",
      "explanation": "Slide 18 says to judge the password after enough codes have been scanned."
    },
    {
      "id": "csg-08",
      "topic": "gate-control",
      "learningSlide": 20,
      "prompt": "What happens after the gate motor has opened and closed the door?",
      "choices": [
        "The combination lock is initialized again",
        "The password check is permanently removed",
        "The controller is discarded",
        "The alarm must remain permanently on"
      ],
      "correctIndex": 0,
      "hint": "The lock prepares for the next attempt.",
      "explanation": "Slide 20 resets the lock after motor-controlled door movement."
    },
    {
      "id": "csg-09",
      "topic": "six-digit-upgrade",
      "learningSlide": 24,
      "prompt": "How many digits should the upgraded gate password contain?",
      "choices": [
        "Six",
        "Two",
        "Three",
        "Ten"
      ],
      "correctIndex": 0,
      "hint": "The optimization asks for a longer preset list.",
      "explanation": "Slide 24 requires a six-digit password."
    },
    {
      "id": "csg-10",
      "topic": "six-digit-upgrade",
      "learningSlide": 24,
      "prompt": "What change makes the upgraded door password more complex?",
      "choices": [
        "Add an item to the preset password list",
        "Remove every password comparison",
        "Replace the camera with a speaker",
        "Keep the gate open permanently"
      ],
      "correctIndex": 0,
      "hint": "More saved values must be matched in sequence.",
      "explanation": "Slide 24 asks students to add a preset password item."
    }
  ]
};
