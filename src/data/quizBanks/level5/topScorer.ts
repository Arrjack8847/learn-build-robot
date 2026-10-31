/** Source: SHA-matched official Level 5 Learning PDF (26 pages). */
import type { QuizBank } from "../../quizStudio";

export const topScorerBank: QuizBank = {
  "projectId": "level-5-top-scorer",
  "title": "Top Scorer",
  "sourcePdfPath": "public/Level 5/Learning/Mechanisms & Simulators/Top Scorer/8. Top Scorer -Slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "level-5-top-scorer-01",
      "topic": "basketball-basics",
      "learningSlide": 4,
      "prompt": "Who is identified as the inventor of basketball in the lesson's history?",
      "choices": [
        "James Naismith",
        "Isaac Newton",
        "Tao Chengdao",
        "Nikola Tesla"
      ],
      "correctIndex": 0,
      "hint": "Read the background sports history.",
      "explanation": "Slide 4 names James Naismith in the basketball origin account."
    },
    {
      "id": "level-5-top-scorer-02",
      "topic": "basketball-basics",
      "learningSlide": 6,
      "prompt": "Which skill does the lesson describe as the basis for many one-handed shots?",
      "choices": [
        "Archery with a bow",
        "One-handed shoulder shooting from a stationary position",
        "Tennis serving",
        "Underwater swimming"
      ],
      "correctIndex": 1,
      "hint": "It discusses a basic shoulder-level shooting form.",
      "explanation": "Slide 6 introduces one-handed shoulder shooting as a foundation skill."
    },
    {
      "id": "level-5-top-scorer-03",
      "topic": "shooting-model",
      "learningSlide": 9,
      "prompt": "What does the medium motor drive on the basketball-shooting robot?",
      "choices": [
        "The display font",
        "The motorized cash drawer",
        "The pitching arms",
        "The QR-code reader"
      ],
      "correctIndex": 2,
      "hint": "The build slide labels the medium motor.",
      "explanation": "Slide 9 identifies a medium motor connected to the shooting arms."
    },
    {
      "id": "level-5-top-scorer-04",
      "topic": "shooting-model",
      "learningSlide": 9,
      "prompt": "What does the larger motor move in the robot assembly?",
      "choices": [
        "The ball's color",
        "Only the touchscreen menu",
        "A fixed basketball hoop",
        "The robot's travelling mechanism"
      ],
      "correctIndex": 3,
      "hint": "The two motors divide throwing and movement tasks.",
      "explanation": "Slide 9 labels the large motor as driving the robot's movement."
    },
    {
      "id": "level-5-top-scorer-05",
      "topic": "shooting-sequence",
      "learningSlide": 10,
      "prompt": "Which sequence matches the basketball robot's basic flowchart?",
      "choices": [
        "Move forward, shoot, return to position",
        "Shoot, switch off the camera, stop forever",
        "Move backward, recharge, scan a code",
        "Spin on the spot, print a price, open a drawer"
      ],
      "correctIndex": 0,
      "hint": "Follow the three numbered stages.",
      "explanation": "Slide 10 lists moving, shooting, and returning to position."
    },
    {
      "id": "level-5-top-scorer-06",
      "topic": "shooting-sequence",
      "learningSlide": 11,
      "prompt": "What should the student build from the shooting flowchart?",
      "choices": [
        "An infrared TV remote",
        "A program that performs the robot's shooting actions in order",
        "A random sequence without a shot",
        "A cash-drawer program"
      ],
      "correctIndex": 1,
      "hint": "The next slide asks for implementing the flow.",
      "explanation": "Slide 11 asks students to complete the basic shooting-control program from the flowchart."
    },
    {
      "id": "level-5-top-scorer-07",
      "topic": "ai-recognition",
      "learningSlide": 15,
      "prompt": "Which port connects the AI vision module for this robot?",
      "choices": [
        "M2 only",
        "P2 reserved for a motor",
        "P8",
        "M1 only"
      ],
      "correctIndex": 2,
      "hint": "The slide identifies the vision connector.",
      "explanation": "Slide 15 installs the AI vision module on P8."
    },
    {
      "id": "level-5-top-scorer-08",
      "topic": "ai-recognition",
      "learningSlide": 17,
      "prompt": "What does the image-classification extension ask the vision module to learn?",
      "choices": [
        "Detect a scanned taxi fare",
        "Measure sea depth",
        "Count coins",
        "Recognize basketball hoops"
      ],
      "correctIndex": 3,
      "hint": "The target is the object the robot aims at.",
      "explanation": "Slide 17 suggests training the AI vision module to distinguish hoops."
    },
    {
      "id": "level-5-top-scorer-09",
      "topic": "accuracy-tuning",
      "learningSlide": 20,
      "prompt": "What could the robot do when its AI module recognizes a basketball hoop?",
      "choices": [
        "Stop at an appropriate position",
        "Ignore the recognized hoop",
        "Always spin 360 degrees",
        "Turn off the camera permanently"
      ],
      "correctIndex": 0,
      "hint": "Recognizing the target helps position the shot.",
      "explanation": "Slide 20 proposes stopping the robot upon hoop recognition."
    },
    {
      "id": "level-5-top-scorer-10",
      "topic": "accuracy-tuning",
      "learningSlide": 20,
      "prompt": "Which parameters does the optimization suggest adjusting for accuracy?",
      "choices": [
        "The number of Bluetooth hosts",
        "Shooting speed and launch angle",
        "QR-code length and cash total",
        "Motor name and screen font only"
      ],
      "correctIndex": 1,
      "hint": "Both ball speed and direction affect the shot.",
      "explanation": "Slide 20 asks students to tune speed and angle for more accurate shooting."
    }
  ]
};
