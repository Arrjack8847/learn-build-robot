/**
 * Source-text-grounded Level 1 Learning PDF quiz candidate.
 * Diagram and visual-review approval pending; not registered in Quiz Studio.
 */
import type { QuizBank } from "../../quizStudio";

export const cagedBirdBank: QuizBank = {
  "projectId": "caged-bird",
  "title": "Caged Bird",
  "sourcePdfPath": "public/Caged Bird.pdf",
  "sourcePageCount": 10,
  "questions": [
    {
      "id": "caged-bird-01",
      "topic": "optical-effect",
      "prompt": "What visual effect is the Caged Bird lesson designed to demonstrate?",
      "choices": [
        "Visual persistence",
        "Auditory persistence",
        "Magnetism",
        "Static electricity"
      ],
      "correctIndex": 0,
      "learningSlide": 3,
      "explanation": "The teaching objectives explicitly name visual persistence as the principle explored.",
      "hint": "Think about how pictures can seem to combine when they move quickly."
    },
    {
      "id": "caged-bird-02",
      "topic": "optical-effect",
      "prompt": "Which sense is involved in the Caged Bird effect described in the assessment?",
      "choices": [
        "Taste",
        "Sight",
        "Hearing",
        "Smell"
      ],
      "correctIndex": 1,
      "learningSlide": 6,
      "explanation": "The manual asks students to identify visual, rather than auditory, persistence.",
      "hint": "The assessment contrasts a visual effect with an auditory effect."
    },
    {
      "id": "caged-bird-03",
      "topic": "paper-design",
      "prompt": "Where is the picture of the bird placed in the lesson story?",
      "choices": [
        "On the controller keypad",
        "Under the table",
        "On one side of the paper",
        "Inside a motor"
      ],
      "correctIndex": 2,
      "learningSlide": 4,
      "explanation": "The story places the bird on the paper and the cage on the other side.",
      "hint": "Recall the two drawings the story asks students to combine."
    },
    {
      "id": "caged-bird-04",
      "topic": "paper-design",
      "prompt": "Where does the story place the picture of the cage?",
      "choices": [
        "On the charging cable",
        "On the motor shaft",
        "On a computer monitor",
        "On the back of the paper"
      ],
      "correctIndex": 3,
      "learningSlide": 4,
      "explanation": "The bird and cage are drawn on opposite sides of the paper.",
      "hint": "The story uses both faces of one sheet."
    },
    {
      "id": "caged-bird-05",
      "topic": "motor-and-motion",
      "prompt": "Which two materials or parts are named for creating the rotating visual effect?",
      "choices": [
        "A small motor and paper",
        "A microphone and speaker",
        "A temperature sensor and fan",
        "A camera and mirror"
      ],
      "correctIndex": 0,
      "learningSlide": 3,
      "explanation": "The teaching objectives say to use a small motor and paper for the effect.",
      "hint": "Think about what turns the paper to combine the two drawings."
    },
    {
      "id": "caged-bird-06",
      "topic": "motor-and-motion",
      "prompt": "What setting should students adjust to change the visual effect?",
      "choices": [
        "The computer wallpaper",
        "Motor speed",
        "The colour of the USB cable",
        "The desk height"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "explanation": "The hands-on instructions say to adjust speed values to improve the visual effect.",
      "hint": "The lesson asks students to debug a value controlling rotation."
    },
    {
      "id": "caged-bird-07",
      "topic": "programming",
      "prompt": "Which software style does the teacher introduce for controlling the model?",
      "choices": [
        "Photo retouching",
        "Video calling",
        "Graphical programming",
        "Spreadsheet formatting"
      ],
      "correctIndex": 2,
      "learningSlide": 5,
      "explanation": "The lesson introduces graphical programming software for the Caged Bird model.",
      "hint": "Think about programming with visible instruction blocks."
    },
    {
      "id": "caged-bird-08",
      "topic": "programming",
      "prompt": "What programming structure is identified as a key learning point?",
      "choices": [
        "Random instruction order",
        "Unrelated parallel drawings",
        "Manual-only operation",
        "Sequential structure"
      ],
      "correctIndex": 3,
      "learningSlide": 3,
      "explanation": "The manual names understanding the sequential structure of programming as a key point.",
      "hint": "Recall the way commands should be arranged in an order."
    },
    {
      "id": "caged-bird-09",
      "topic": "testing",
      "prompt": "How does the lesson connect the controller to a computer?",
      "choices": [
        "Using a USB cable",
        "Using a gear axle",
        "Using a rubber band",
        "Using only a paper strip"
      ],
      "correctIndex": 0,
      "learningSlide": 5,
      "explanation": "The source tells students to connect the controller and computer with a USB cable.",
      "hint": "Recall the connection method in the hands-on instructions."
    },
    {
      "id": "caged-bird-10",
      "topic": "testing",
      "prompt": "What should students explain when presenting their finished Caged Bird?",
      "choices": [
        "How to tune a musical instrument",
        "How visual persistence makes the bird appear in the cage",
        "How to measure wind speed",
        "How to build a wheel-driven car"
      ],
      "correctIndex": 1,
      "learningSlide": 6,
      "explanation": "The outcomes section asks students whether visual persistence makes the bird look caged.",
      "hint": "Think about the effect behind the demonstration rather than its appearance."
    }
  ]
};
