/** Based on official Level 2 Learning PDF; 1-based lesson slide references. */
import type { QuizBank } from "../../quizStudio";
export const ferrisWheelBank: QuizBank = {
  "projectId": "level-2-ferris-wheel",
  "title": "Ferris wheel",
  "sourcePdfPath": "public/Level 2/Learning/Manipulators/Ferris wheel.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "fer01",
      "topic": "wheel-form",
      "learningSlide": 4,
      "prompt": "Which shapes are part of the Ferris wheel design?",
      "choices": [
        "A single straight rod only",
        "One square window and no base",
        "A propeller and a sail",
        "A large rotating disc and hanging seats"
      ],
      "correctIndex": 3,
      "explanation": "Slide 4 teaches: a large rotating disc and hanging seats.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "fer02",
      "topic": "wheel-form",
      "learningSlide": 5,
      "prompt": "Which polygon does the lesson suggest for building the wheel?",
      "choices": [
        "An octagon only",
        "A pentagon only",
        "A hexagon",
        "A triangle only"
      ],
      "correctIndex": 2,
      "explanation": "Slide 5 teaches: a hexagon.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "fer03",
      "topic": "motor-control",
      "learningSlide": 6,
      "prompt": "How can learners make the wheel turn slowly?",
      "choices": [
        "Disconnect the controller",
        "Adjust the motor speed in the program",
        "Remove its motor",
        "Use more seats to stop it"
      ],
      "correctIndex": 1,
      "explanation": "Slide 6 teaches: adjust the motor speed in the program.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "fer04",
      "topic": "motor-control",
      "learningSlide": 6,
      "prompt": "What provides the drive to rotate the Ferris wheel model?",
      "choices": [
        "A motor",
        "The display screen alone",
        "A temperature sensor",
        "The passenger's weight only"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 teaches: a motor.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "fer05",
      "topic": "construction",
      "learningSlide": 7,
      "prompt": "Which part supports the rotating Ferris wheel?",
      "choices": [
        "Its cabin windows only",
        "A display cable",
        "The program's clock",
        "Its base and stand"
      ],
      "correctIndex": 3,
      "explanation": "Slide 7 teaches: its base and stand.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "fer06",
      "topic": "construction",
      "learningSlide": 7,
      "prompt": "Which item belongs in the model's component list?",
      "choices": [
        "A hydraulic pump only",
        "An infrared thermometer",
        "A drive system and seats",
        "A camera lens and fan blades"
      ],
      "correctIndex": 2,
      "explanation": "Slide 7 teaches: a drive system and seats.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "fer07",
      "topic": "stop-and-start",
      "learningSlide": 18,
      "prompt": "What should the model do at its highest point in Task 1?",
      "choices": [
        "Stop permanently before starting",
        "Stop briefly and cheer before continuing",
        "Reverse immediately without stopping",
        "Detach its seats"
      ],
      "correctIndex": 1,
      "explanation": "Slide 18 teaches: stop briefly and cheer before continuing.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "fer08",
      "topic": "stop-and-start",
      "learningSlide": 18,
      "prompt": "What is the first coding task's rotation speed supposed to be?",
      "choices": [
        "Constant between scheduled stops",
        "Random at all times",
        "Always zero",
        "Increasing without limit"
      ],
      "correctIndex": 0,
      "explanation": "Slide 18 teaches: constant between scheduled stops.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "fer09",
      "topic": "rotation-direction",
      "learningSlide": 19,
      "prompt": "What does the second task request after a complete turn?",
      "choices": [
        "Increase the number of seats",
        "Remove all cables",
        "Continue forever in the same direction",
        "Reverse and return to the starting position"
      ],
      "correctIndex": 3,
      "explanation": "Slide 19 teaches: reverse and return to the starting position.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "fer10",
      "topic": "rotation-direction",
      "learningSlide": 20,
      "prompt": "Which motor-power sign is associated with clockwise turning in the provided example?",
      "choices": [
        "Zero only",
        "Undefined",
        "Negative",
        "Positive"
      ],
      "correctIndex": 2,
      "explanation": "Slide 20 teaches: negative.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    }
  ]
};
