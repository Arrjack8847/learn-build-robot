/** Level 4 quiz: authored from official 33-page Learning PDF text. */
import type { QuizBank } from "../../quizStudio";
export const partsSorterBank: QuizBank = {
  "projectId": "level-4-parts-sorter",
  "title": "Parts Sorter",
  "sourcePdfPath": "public/Level 4/Characters & Structures/Parts Sorter/22.Parts Sorter- Slides.pdf",
  "sourcePageCount": 33,
  "questions": [
    {
      "id": "l4-parts-sorter-01",
      "topic": "sorting-purpose",
      "learningSlide": 3,
      "prompt": "What does a factory sorting process do?",
      "choices": [
        "Classify items by specified rules",
        "Play recorded music",
        "Measure outdoor weather",
        "Draw robot pictures"
      ],
      "correctIndex": 0,
      "explanation": "Sorting groups objects by characteristics or criteria.",
      "hint": "Think about why factories categorize materials."
    },
    {
      "id": "l4-parts-sorter-02",
      "topic": "sorting-purpose",
      "learningSlide": 4,
      "prompt": "Why might a factory automate its sorting process?",
      "choices": [
        "To add more random errors",
        "To improve efficiency and reduce mistakes",
        "To replace every sensor with paper",
        "To disable production"
      ],
      "correctIndex": 1,
      "explanation": "The lesson highlights faster, more accurate automatic sorting.",
      "hint": "Think about why factories categorize materials."
    },
    {
      "id": "l4-parts-sorter-03",
      "topic": "color-control",
      "learningSlide": 6,
      "prompt": "Which sensor identifies the colors of parts?",
      "choices": [
        "Sound sensor",
        "GPS module",
        "Color sensor",
        "Temperature probe"
      ],
      "correctIndex": 2,
      "explanation": "The project uses a color sensor to recognize blocks.",
      "hint": "Recall the sensor that distinguishes block colors."
    },
    {
      "id": "l4-parts-sorter-04",
      "topic": "color-control",
      "learningSlide": 6,
      "prompt": "What two part colors are specifically assigned separate sorting paths?",
      "choices": [
        "Red and yellow",
        "Blue and black",
        "White and purple",
        "Pink and green"
      ],
      "correctIndex": 0,
      "explanation": "The project identifies red and yellow building blocks.",
      "hint": "Recall the sensor that distinguishes block colors."
    },
    {
      "id": "l4-parts-sorter-05",
      "topic": "blocking-programs",
      "learningSlide": 19,
      "prompt": "What does blocking mean in a program?",
      "choices": [
        "The program runs the next command immediately",
        "Later execution pauses until a task or condition completes",
        "The robot loses power",
        "All sensors return zero"
      ],
      "correctIndex": 1,
      "explanation": "A blocking instruction waits before subsequent instructions execute.",
      "hint": "Consider whether the next command waits for motion to finish."
    },
    {
      "id": "l4-parts-sorter-06",
      "topic": "blocking-programs",
      "learningSlide": 20,
      "prompt": "Which word is commonly used in the lesson's blocking module names?",
      "choices": [
        "Run",
        "Save",
        "Wait",
        "Draw"
      ],
      "correctIndex": 2,
      "explanation": "Slide 20 notes that blocking modules usually contain wait.",
      "hint": "Consider whether the next command waits for motion to finish."
    },
    {
      "id": "l4-parts-sorter-07",
      "topic": "encoder-calibration",
      "learningSlide": 21,
      "prompt": "When is the text displayed in the motor-wait example?",
      "choices": [
        "After the programmed motor movement",
        "Before any motor starts",
        "Only after unplugging the controller",
        "While downloading a PDF"
      ],
      "correctIndex": 0,
      "explanation": "The example displays text after the motor finishes its action.",
      "hint": "Think about the sorting fork's center and outer limits."
    },
    {
      "id": "l4-parts-sorter-08",
      "topic": "encoder-calibration",
      "learningSlide": 22,
      "prompt": "Which built-in test helps find sorting-fork positions?",
      "choices": [
        "Sound test",
        "Wi-Fi test",
        "Camera test",
        "Encoder test"
      ],
      "correctIndex": 3,
      "explanation": "The activity uses the controller's Test–Encoder interface.",
      "hint": "Think about the sorting fork's center and outer limits."
    },
    {
      "id": "l4-parts-sorter-09",
      "topic": "direction-and-return",
      "learningSlide": 24,
      "prompt": "Where does a red part go?",
      "choices": [
        "To the left",
        "To the right",
        "To the back",
        "Nowhere"
      ],
      "correctIndex": 0,
      "explanation": "For a red item, the fork turns clockwise to sort it left.",
      "hint": "Follow where each block goes after it is recognized."
    },
    {
      "id": "l4-parts-sorter-10",
      "topic": "direction-and-return",
      "learningSlide": 25,
      "prompt": "What does the sorting fork do after directing a yellow part right?",
      "choices": [
        "Stay fully right",
        "Return to the center",
        "Remove its sensor",
        "Start a timer only"
      ],
      "correctIndex": 1,
      "explanation": "The yellow-part flow returns the fork to its middle position.",
      "hint": "Follow where each block goes after it is recognized."
    }
  ]
};
