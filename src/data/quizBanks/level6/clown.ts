import type { QuizBank } from "../../quizStudio";
/** Questions sourced from the original 26-slide Level 6 Learning PDF. */
export const clownBank: QuizBank = {
  "projectId": "level-6-clown",
  "title": "Clown",
  "sourcePdfPath": "public/Level 6/Learning/Characters & Structures/Clown/05.Clown-Teaching slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "cl-01",
      "topic": "expressions",
      "learningSlide": 4,
      "prompt": "Which of these is one of the lesson's three ways people express emotions?",
      "choices": [
        "Facial expression",
        "Battery voltage",
        "Motor rotation count",
        "Road offset reading"
      ],
      "correctIndex": 0,
      "hint": "Think about how people communicate feelings.",
      "explanation": "Slide 4 names facial expression, tone and body posture."
    },
    {
      "id": "cl-02",
      "topic": "expressions",
      "learningSlide": 7,
      "prompt": "Which parts of the face are described as especially expressive?",
      "choices": [
        "Eyes and mouth",
        "Ears and hair",
        "Eyebrows and elbows",
        "Forehead and shoes"
      ],
      "correctIndex": 0,
      "hint": "These features change noticeably with many emotions.",
      "explanation": "Slide 7 emphasizes muscles around the eyes and mouth."
    },
    {
      "id": "cl-03",
      "topic": "matrix-display",
      "learningSlide": 11,
      "prompt": "How many dots wide and high is the clown's matrix screen?",
      "choices": [
        "16 by 16",
        "8 by 8",
        "2 by 2",
        "240 by 240"
      ],
      "correctIndex": 0,
      "hint": "Read the display size given in the lesson.",
      "explanation": "Slide 11 introduces a 16 × 16 dot matrix display."
    },
    {
      "id": "cl-04",
      "topic": "matrix-display",
      "learningSlide": 11,
      "prompt": "What can the dot matrix screen display?",
      "choices": [
        "Letters, numbers and expressions",
        "Only motor rotations",
        "Only temperatures",
        "Only QR passwords"
      ],
      "correctIndex": 0,
      "hint": "Each dot can help form a visible pattern.",
      "explanation": "Slide 11 lists characters, numbers and expression patterns."
    },
    {
      "id": "cl-05",
      "topic": "touch-input",
      "learningSlide": 14,
      "prompt": "Which part of the clown is used as a touch sensor?",
      "choices": [
        "Its red nose",
        "Its shoe",
        "Its hat brim",
        "Its back wheel"
      ],
      "correctIndex": 0,
      "hint": "The student presses part of the clown's face.",
      "explanation": "Slide 14 labels the red nose as the touch sensor."
    },
    {
      "id": "cl-06",
      "topic": "touch-input",
      "learningSlide": 17,
      "prompt": "When does the expression-switching variable increase?",
      "choices": [
        "After a complete press and release",
        "Every time the screen turns off",
        "Only when the power cable is removed",
        "Whenever the robot is carried"
      ],
      "correctIndex": 0,
      "hint": "The lesson detects a full button action.",
      "explanation": "Slide 17 increments the variable after a press followed by release."
    },
    {
      "id": "cl-07",
      "topic": "cycling-patterns",
      "learningSlide": 15,
      "prompt": "Why is a remainder operation used to switch expressions?",
      "choices": [
        "To cycle through a limited number of patterns",
        "To make every pattern brighter each time",
        "To calculate the robot's travel distance",
        "To disable all patterns"
      ],
      "correctIndex": 0,
      "hint": "The counter keeps growing but the pattern list is finite.",
      "explanation": "Slide 15 explains using remainder to wrap expression selection."
    },
    {
      "id": "cl-08",
      "topic": "cycling-patterns",
      "learningSlide": 20,
      "prompt": "What set of results can the lesson's three-pattern remainder calculation produce?",
      "choices": [
        "0, 1 and 2",
        "1, 5 and 9",
        "10, 20 and 30",
        "Only 0"
      ],
      "correctIndex": 0,
      "hint": "Remainders repeat before reaching the divisor.",
      "explanation": "Slide 20 shows remainder values 0, 1 and 2."
    },
    {
      "id": "cl-09",
      "topic": "optimization",
      "learningSlide": 24,
      "prompt": "How many expression patterns should the optimized clown cycle through?",
      "choices": [
        "Five",
        "One",
        "Two",
        "Ten"
      ],
      "correctIndex": 0,
      "hint": "The expansion asks students to increase the number of expressions.",
      "explanation": "Slide 24 specifies five expression patterns."
    },
    {
      "id": "cl-10",
      "topic": "optimization",
      "learningSlide": 24,
      "prompt": "What should students change to support more expression patterns?",
      "choices": [
        "The remainder operation and display pattern logic",
        "The classroom lighting",
        "Only the colour of the red nose",
        "The robot's speaker volume"
      ],
      "correctIndex": 0,
      "hint": "The program must wrap through a longer set.",
      "explanation": "Slide 24 directs modifying the remainder operation for five patterns."
    }
  ]
};
