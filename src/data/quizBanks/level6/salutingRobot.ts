import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 23-page Learning PDF. */
export const salutingRobotBank: QuizBank = {
  "projectId": "level-6-saluting-robot",
  "title": "Saluting Robot",
  "sourcePdfPath": "public/Level 6/Learning/Programming & Precise Control/Saluting Robot/26.Saluting Robot -Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "sal-01",
      "topic": "face-detection",
      "learningSlide": 9,
      "prompt": "What does the AI vision face-detection size mode measure?",
      "choices": [
        "How large a detected face appears in view",
        "The mass of the person's head",
        "The person's exact real-world age",
        "The number of nearby road lanes"
      ],
      "correctIndex": 0,
      "hint": "A closer face appears larger in the image.",
      "explanation": "Slide 9 explains face size changes with distance."
    },
    {
      "id": "sal-02",
      "topic": "face-detection",
      "learningSlide": 10,
      "prompt": "What value is returned when a face is not detected?",
      "choices": [
        "240",
        "0",
        "999",
        "1000"
      ],
      "correctIndex": 1,
      "hint": "Zero indicates no recognizable face.",
      "explanation": "Slide 10 returns zero when no face is recognized."
    },
    {
      "id": "sal-03",
      "topic": "controller-connections",
      "learningSlide": 13,
      "prompt": "Which port is used for the robot's AI vision module?",
      "choices": [
        "M2",
        "M4",
        "P8",
        "A speaker-only output"
      ],
      "correctIndex": 2,
      "hint": "Cameras use the input port.",
      "explanation": "Slide 13 connects AI vision to P8."
    },
    {
      "id": "sal-04",
      "topic": "controller-connections",
      "learningSlide": 13,
      "prompt": "Which motor ports power the model's movement?",
      "choices": [
        "P8 and P9",
        "M1 and M3",
        "Only P8",
        "M2 and M4"
      ],
      "correctIndex": 3,
      "hint": "Two motor outputs are specified.",
      "explanation": "Slide 13 connects the motors to M2 and M4."
    },
    {
      "id": "sal-05",
      "topic": "salute-motion",
      "learningSlide": 16,
      "prompt": "What triggers the robot's salute action?",
      "choices": [
        "A detected face size greater than zero",
        "A detected green road marker",
        "An invalid QR payment code",
        "A timer reaching 99"
      ],
      "correctIndex": 0,
      "hint": "The robot responds to a visible face.",
      "explanation": "Slide 16 salutes when a face is detected."
    },
    {
      "id": "sal-06",
      "topic": "salute-motion",
      "learningSlide": 16,
      "prompt": "Which motor is commanded to rotate to 180 degrees for the salute?",
      "choices": [
        "M4",
        "M2",
        "P8",
        "M8"
      ],
      "correctIndex": 1,
      "hint": "One motor moves the saluting arm.",
      "explanation": "Slide 16 uses M2 for the 180-degree salute."
    },
    {
      "id": "sal-07",
      "topic": "face-following",
      "learningSlide": 17,
      "prompt": "Which face measurement helps the robot turn to follow a person?",
      "choices": [
        "Face colour name",
        "The person's balance",
        "Face X coordinate",
        "The user's height in metres"
      ],
      "correctIndex": 2,
      "hint": "Horizontal position tells the robot which way to turn.",
      "explanation": "Slide 17 calculates turn using the face X coordinate."
    },
    {
      "id": "sal-08",
      "topic": "face-following",
      "learningSlide": 17,
      "prompt": "What controller variable scales the amount of turning?",
      "choices": [
        "Card balance",
        "Frame rate",
        "Colour ID 4",
        "Coefficient"
      ],
      "correctIndex": 3,
      "hint": "The measured coordinate difference is multiplied by a factor.",
      "explanation": "Slide 17 computes turn = (coordinate - 130) × coefficient."
    },
    {
      "id": "sal-09",
      "topic": "return-home",
      "learningSlide": 18,
      "prompt": "What should happen when no human face is detected anymore?",
      "choices": [
        "Lower the arms and stop saluting",
        "Continue holding a salute forever",
        "Open a QR-code gate",
        "Switch to a payment screen"
      ],
      "correctIndex": 0,
      "hint": "The action ends when the person disappears.",
      "explanation": "Slide 18 lowers the arms when no face remains."
    },
    {
      "id": "sal-10",
      "topic": "return-home",
      "learningSlide": 21,
      "prompt": "What does the expansion task add after each salute?",
      "choices": [
        "Remove the camera",
        "Return to the robot's initial position",
        "Change to a traffic light",
        "Forget the controller program"
      ],
      "correctIndex": 1,
      "hint": "The robot should be ready for the next visitor.",
      "explanation": "Slide 21 asks for automatic return to the original pose."
    }
  ]
};
