import type { QuizBank } from "../../quizStudio";
export const theTreadmillBank: QuizBank = {
  "projectId": "level-2-the-treadmill",
  "title": "The treadmill",
  "sourcePdfPath": "public/Level 2/Learning/Foundational Robots/The treadmill.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "tt1",
      "topic": "treadmill-background",
      "learningSlide": 2,
      "prompt": "What allows someone to run on a treadmill while remaining indoors?",
      "choices": [
        "A moving running surface",
        "A railway vehicle",
        "A flying platform",
        "A pulley that lifts the runner"
      ],
      "correctIndex": 0,
      "hint": "Think about the ground under the user's feet.",
      "explanation": "Slide 2 describes treadmill exercise without leaving a building."
    },
    {
      "id": "tt2",
      "topic": "treadmill-background",
      "learningSlide": 3,
      "prompt": "What medical use is described for the first exercise treadmills?",
      "choices": [
        "Diagnosing heart and lung conditions",
        "Testing eyesight",
        "Measuring hearing",
        "Calibrating cameras"
      ],
      "correctIndex": 0,
      "hint": "The original device was used in medicine.",
      "explanation": "Slide 3 describes heart and lung diagnosis."
    },
    {
      "id": "tt3",
      "topic": "chain-drive",
      "learningSlide": 5,
      "prompt": "What connects the driving and driven sprockets in a chain drive?",
      "choices": [
        "Chain",
        "Light beam",
        "Antenna",
        "Water hose"
      ],
      "correctIndex": 0,
      "hint": "The links engage the sprocket teeth.",
      "explanation": "Slide 5 defines chain transmission using a chain."
    },
    {
      "id": "tt4",
      "topic": "chain-drive",
      "learningSlide": 5,
      "prompt": "Which property does the lesson give as a benefit of a chain drive?",
      "choices": [
        "Reliable transmission and accurate average ratio",
        "No connected moving parts",
        "No power transmission",
        "A completely flexible speed ratio"
      ],
      "correctIndex": 0,
      "hint": "Consider a chain positively engaging its sprockets.",
      "explanation": "Slide 5 lists reliability and an accurate average ratio."
    },
    {
      "id": "tt5",
      "topic": "mechanical-structure",
      "learningSlide": 6,
      "prompt": "What provides the moving surface on a treadmill?",
      "choices": [
        "Running belt",
        "Display screen",
        "Touch sensor",
        "Handrail"
      ],
      "correctIndex": 0,
      "hint": "This is what the user steps onto.",
      "explanation": "Slide 6 names the running belt."
    },
    {
      "id": "tt6",
      "topic": "mechanical-structure",
      "learningSlide": 6,
      "prompt": "Which two other components are listed?",
      "choices": [
        "Handrails and display screen",
        "Sail and rudder",
        "Hook and boom",
        "Wings and propellers"
      ],
      "correctIndex": 0,
      "hint": "Think about support for the runner and feedback to them.",
      "explanation": "Slide 6 lists handrails and a display screen."
    },
    {
      "id": "tt7",
      "topic": "hardware-ports",
      "learningSlide": 12,
      "prompt": "Which controller port connects to the treadmill motor?",
      "choices": [
        "Port A",
        "Port B",
        "Port 1",
        "Port 2"
      ],
      "correctIndex": 0,
      "hint": "The motor has a lettered port.",
      "explanation": "Slide 12 connects the motor to Port A."
    },
    {
      "id": "tt8",
      "topic": "hardware-ports",
      "learningSlide": 12,
      "prompt": "Which port connects to the treadmill touch sensor?",
      "choices": [
        "Port 2",
        "Port 1",
        "Port A",
        "Port D"
      ],
      "correctIndex": 0,
      "hint": "The sensor uses a numbered port.",
      "explanation": "Slide 12 connects the touch sensor to Port 2."
    },
    {
      "id": "tt9",
      "topic": "touch-control",
      "learningSlide": 13,
      "prompt": "What happens after the treadmill touch sensor is pressed the first time?",
      "choices": [
        "It starts running",
        "The motor is unplugged",
        "The screen permanently shuts off",
        "The RCU resets"
      ],
      "correctIndex": 0,
      "hint": "The button toggles two states.",
      "explanation": "Slide 13 specifies that the first press starts the treadmill."
    },
    {
      "id": "tt10",
      "topic": "touch-control",
      "learningSlide": 15,
      "prompt": "What should the emotion screen show while the treadmill runs?",
      "choices": [
        "1",
        "0",
        "2",
        "9"
      ],
      "correctIndex": 0,
      "hint": "The display uses one of two digits to indicate state.",
      "explanation": "Slide 15 assigns 1 to running and 0 to stopped."
    }
  ]
};
