import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 26-page Learning PDF. */
export const superScorpionBank: QuizBank = {
  "projectId": "level-6-super-scorpion",
  "title": "Super Scorpion",
  "sourcePdfPath": "public/Level 6/Learning/Biomimicry & Stimulus Response/Super Scorpion/16. Super Scorpion - Slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "scp-01",
      "topic": "linkage",
      "learningSlide": 8,
      "prompt": "What is an advantage of a telescopic linkage mechanism?",
      "choices": [
        "Save space while extending through a longer distance",
        "Guarantee zero motion",
        "Remove the need for motors in every case",
        "Measure atmospheric pressure"
      ],
      "correctIndex": 0,
      "hint": "A folded linkage occupies less space.",
      "explanation": "Slide 8 highlights compact folding and extension."
    },
    {
      "id": "scp-02",
      "topic": "linkage",
      "learningSlide": 9,
      "prompt": "Why can a quadrilateral linkage be useful in a stretchable structure?",
      "choices": [
        "It is always more rigid than a triangle",
        "It can deform and change shape",
        "It never changes its angles",
        "It can only make sounds"
      ],
      "correctIndex": 1,
      "hint": "The mobility comes from a quadrilateral's flexibility.",
      "explanation": "Slide 9 explains quadrilateral linkages can stretch and fold."
    },
    {
      "id": "scp-03",
      "topic": "robot-hardware",
      "learningSlide": 11,
      "prompt": "Which sensor detects an obstacle ahead of the scorpion?",
      "choices": [
        "A card balance reader",
        "A rain gauge",
        "Ultrasonic sensor",
        "A QR payment sensor"
      ],
      "correctIndex": 2,
      "hint": "The robot reacts to nearby objects.",
      "explanation": "Slide 11 includes an ultrasonic sensor."
    },
    {
      "id": "scp-04",
      "topic": "robot-hardware",
      "learningSlide": 11,
      "prompt": "Which mechanism helps the robot extend its moving structure?",
      "choices": [
        "Digital countdown clock",
        "Password-controlled gate",
        "Dot-matrix projector",
        "Parallelogram telescopic linkage"
      ],
      "correctIndex": 3,
      "hint": "The structure uses connected links.",
      "explanation": "Slide 11 labels a telescopic parallelogram linkage."
    },
    {
      "id": "scp-05",
      "topic": "obstacle-response",
      "learningSlide": 12,
      "prompt": "What does the scorpion do when no obstacle is detected?",
      "choices": [
        "Move randomly",
        "Stop forever",
        "Always attack one fixed direction",
        "Turn off its distance sensor"
      ],
      "correctIndex": 0,
      "hint": "It explores while the path is clear.",
      "explanation": "Slide 12 directs random motion with no obstacle."
    },
    {
      "id": "scp-06",
      "topic": "obstacle-response",
      "learningSlide": 12,
      "prompt": "How does the scorpion react to an obstacle?",
      "choices": [
        "Open a QR-code door",
        "Sprint and attack with its tail, then reset",
        "Count down from 99",
        "Sort coloured blocks into bins"
      ],
      "correctIndex": 1,
      "hint": "An obstacle triggers the attack sequence.",
      "explanation": "Slide 12 specifies sprint, tail attack and reset."
    },
    {
      "id": "scp-07",
      "topic": "ai-extension",
      "learningSlide": 17,
      "prompt": "Where must an optional AI vision module be connected?",
      "choices": [
        "M1",
        "M2",
        "P8",
        "A speaker output"
      ],
      "correctIndex": 2,
      "hint": "The vision module uses a dedicated port.",
      "explanation": "Slide 17 specifies controller interface P8."
    },
    {
      "id": "scp-08",
      "topic": "ai-extension",
      "learningSlide": 18,
      "prompt": "What ball does the AI vision module recognize by default in the reading example?",
      "choices": [
        "A green ring",
        "A yellow traffic lamp",
        "A black QR card",
        "A red ball"
      ],
      "correctIndex": 3,
      "hint": "The example's target has a default colour.",
      "explanation": "Slide 18 identifies the red ball as the default."
    },
    {
      "id": "scp-09",
      "topic": "mechanical-optimization",
      "learningSlide": 20,
      "prompt": "What mechanical issue should be checked during scorpion optimization?",
      "choices": [
        "Where the body needs reinforcement",
        "Whether the PDF has the right title",
        "Whether a bank card has a balance",
        "Whether a film runs at 24 fps"
      ],
      "correctIndex": 0,
      "hint": "A moving linkage must be strong enough.",
      "explanation": "Slide 20 asks which structural places require reinforcement."
    },
    {
      "id": "scp-10",
      "topic": "mechanical-optimization",
      "learningSlide": 21,
      "prompt": "What new navigation behaviour is proposed for prey detection?",
      "choices": [
        "Ignore the prey position",
        "Adjust direction after finding prey",
        "Disable the AI module",
        "Make the scorpion stay motionless"
      ],
      "correctIndex": 1,
      "hint": "Recognition should influence the scorpion's orientation.",
      "explanation": "Slide 21 asks students to locate prey and change direction."
    }
  ]
};
