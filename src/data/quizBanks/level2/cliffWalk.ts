/** Based on official Level 2 Learning PDF; 1-based lesson slide references. */
import type { QuizBank } from "../../quizStudio";
export const cliffWalkBank: QuizBank = {
  "projectId": "level-2-cliff-walk",
  "title": "Cliff walk",
  "sourcePdfPath": "public/Level 2/Learning/Manipulators/Cliff walk.pdf",
  "sourcePageCount": 12,
  "questions": [
    {
      "id": "cli01",
      "topic": "driving-safety",
      "learningSlide": 4,
      "prompt": "What should a driver do on a narrow cliff road?",
      "choices": [
        "Drive without checking surroundings",
        "Close both eyes",
        "Ignore the route",
        "Pay careful attention to every road section"
      ],
      "correctIndex": 3,
      "explanation": "Slide 4 teaches: pay careful attention to every road section.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "cli02",
      "topic": "driving-safety",
      "learningSlide": 4,
      "prompt": "Why is accurate control important near a cliff?",
      "choices": [
        "Road edges do not matter",
        "The car cannot turn",
        "A small mistake can be dangerous",
        "There is unlimited road space"
      ],
      "correctIndex": 2,
      "explanation": "Slide 4 teaches: a small mistake can be dangerous.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "cli03",
      "topic": "autonomous-control",
      "learningSlide": 5,
      "prompt": "How does the lesson propose to control the model car's route?",
      "choices": [
        "By removing the controller",
        "With programming",
        "By hand-pushing it only",
        "With a flashlight beam"
      ],
      "correctIndex": 1,
      "explanation": "Slide 5 teaches: with programming.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "cli04",
      "topic": "autonomous-control",
      "learningSlide": 5,
      "prompt": "What ability does the lesson highlight in driverless cars?",
      "choices": [
        "Precise computer-controlled driving",
        "Running without any wheels",
        "Flying above road hazards",
        "Never using sensors"
      ],
      "correctIndex": 0,
      "explanation": "Slide 5 teaches: precise computer-controlled driving.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "cli05",
      "topic": "timing",
      "learningSlide": 9,
      "prompt": "With speed held equal, what happens when the wait-time setting increases?",
      "choices": [
        "The car travels less far in every case",
        "The car turns into a crane",
        "The car's battery becomes larger",
        "The car travels farther"
      ],
      "correctIndex": 3,
      "explanation": "Slide 9 teaches: the car travels farther.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "cli06",
      "topic": "timing",
      "learningSlide": 9,
      "prompt": "Which parameter could be reduced to shorten a straight move in this lesson?",
      "choices": [
        "The sensor label",
        "The wheel color",
        "Motor running or wait time",
        "The text font size"
      ],
      "correctIndex": 2,
      "explanation": "Slide 9 teaches: motor running or wait time.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "cli07",
      "topic": "motor-angle",
      "learningSlide": 10,
      "prompt": "What parameter is adjusted to control steering in the second coding activity?",
      "choices": [
        "The screen language",
        "The motor angle",
        "The sound volume",
        "The room temperature"
      ],
      "correctIndex": 1,
      "explanation": "Slide 10 teaches: the motor angle.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "cli08",
      "topic": "motor-angle",
      "learningSlide": 10,
      "prompt": "Which change is most relevant to turning the car by a planned amount?",
      "choices": [
        "Change the motor's angle command",
        "Change the page background",
        "Remove the front axle",
        "Add a speaker"
      ],
      "correctIndex": 0,
      "explanation": "Slide 10 teaches: change the motor's angle command.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "cli09",
      "topic": "gear-ratio",
      "learningSlide": 11,
      "prompt": "Does a programmed motor rotation angle always equal the car's turning angle?",
      "choices": [
        "Yes, they are always identical",
        "Only if the car is painted red",
        "They cannot be compared",
        "No, the transmission changes the relationship"
      ],
      "correctIndex": 3,
      "explanation": "Slide 11 teaches: no, the transmission changes the relationship.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    },
    {
      "id": "cli10",
      "topic": "gear-ratio",
      "learningSlide": 11,
      "prompt": "Why may motor and steering angles differ greatly?",
      "choices": [
        "The model has a body",
        "The car is on a flat road",
        "Acceleration or reduction through gears",
        "The computer displays the time"
      ],
      "correctIndex": 2,
      "explanation": "Slide 11 teaches: acceleration or reduction through gears.",
      "hint": "Recall the relevant idea or component described on this lesson slide."
    }
  ]
};
