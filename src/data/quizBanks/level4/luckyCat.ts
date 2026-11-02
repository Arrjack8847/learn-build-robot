/** Level 4 quiz: reviewed official 35-page Learning PDF text. */
import type { QuizBank } from "../../quizStudio";
export const luckyCatBank: QuizBank = {
  "projectId": "level-4-lucky-cat",
  "title": "Lucky Cat",
  "sourcePdfPath": "public/Level 4/Vehicles & Complex Movers/Lucky Cat/13.Lucky Cat-Slides.pdf",
  "sourcePageCount": 35,
  "questions": [
    {
      "id": "l4-lucky-cat-01",
      "topic": "model-purpose",
      "learningSlide": 3,
      "prompt": "Where are traditional lucky-cat decorations commonly displayed?",
      "choices": [
        "On shop counters or near entrances",
        "Inside car engines",
        "Under a swimming pool",
        "On road signs"
      ],
      "correctIndex": 0,
      "explanation": "The lesson describes lucky cats as decorations used at shops.",
      "hint": "Think about the decorative object being modeled."
    },
    {
      "id": "l4-lucky-cat-02",
      "topic": "model-purpose",
      "learningSlide": 4,
      "prompt": "What additional feature may a lucky cat have?",
      "choices": [
        "It must fly",
        "It may work as a piggy bank",
        "It measures rainfall",
        "It delivers mail"
      ],
      "correctIndex": 1,
      "explanation": "Some lucky cats can also function as piggy banks.",
      "hint": "Think about the decorative object being modeled."
    },
    {
      "id": "l4-lucky-cat-03",
      "topic": "sensor-inputs",
      "learningSlide": 6,
      "prompt": "Which sensor is used to detect a nearby visitor?",
      "choices": [
        "Temperature sensor",
        "Touch pen",
        "Ultrasonic sensor",
        "GPS receiver"
      ],
      "correctIndex": 2,
      "explanation": "The project uses an ultrasonic sensor to detect visitors.",
      "hint": "Recall how the cat notices nearby visitors and coins."
    },
    {
      "id": "l4-lucky-cat-04",
      "topic": "sensor-inputs",
      "learningSlide": 29,
      "prompt": "Which sensor detects a coin in the lesson's added function?",
      "choices": [
        "Photoelectric sensor",
        "Sound sensor",
        "Barometric sensor",
        "Gyroscope"
      ],
      "correctIndex": 0,
      "explanation": "The coin detection function reads a photoelectric value.",
      "hint": "Recall how the cat notices nearby visitors and coins."
    },
    {
      "id": "l4-lucky-cat-05",
      "topic": "multitasking",
      "learningSlide": 24,
      "prompt": "What does the E6 controller's multitasking feature allow?",
      "choices": [
        "Only one motion for all time",
        "Multiple program tasks to run at once",
        "Only offline drawings",
        "Replacement of all sensors"
      ],
      "correctIndex": 1,
      "explanation": "The controller can execute multiple RCU tasks simultaneously.",
      "hint": "Consider two actions occurring at once."
    },
    {
      "id": "l4-lucky-cat-06",
      "topic": "multitasking",
      "learningSlide": 25,
      "prompt": "Which paired activities demonstrate multitasking?",
      "choices": [
        "Two motors disconnecting",
        "One display task and one music task",
        "Two batteries recharging",
        "Two printed books"
      ],
      "correctIndex": 1,
      "explanation": "Slide 25 tests display changes and music running as separate tasks.",
      "hint": "Consider two actions occurring at once."
    },
    {
      "id": "l4-lucky-cat-07",
      "topic": "waving-behavior",
      "learningSlide": 26,
      "prompt": "What does Task 1 control in the lucky-cat flowchart?",
      "choices": [
        "Arm movement",
        "Coin sensing",
        "Website login",
        "Temperature"
      ],
      "correctIndex": 0,
      "explanation": "Task 1 resets and repeatedly moves the cat's arm.",
      "hint": "Follow the first robot task's movement sequence."
    },
    {
      "id": "l4-lucky-cat-08",
      "topic": "waving-behavior",
      "learningSlide": 27,
      "prompt": "How is the cat's arm made to wave?",
      "choices": [
        "By changing a photo",
        "By playing only audio",
        "By measuring light",
        "By repeated motor movements"
      ],
      "correctIndex": 3,
      "explanation": "The task repeats programmed arm rotations.",
      "hint": "Follow the first robot task's movement sequence."
    },
    {
      "id": "l4-lucky-cat-09",
      "topic": "welcome-and-coin",
      "learningSlide": 28,
      "prompt": "What triggers the welcome audio in Task 2?",
      "choices": [
        "An ultrasonic reading under 6",
        "A color reading of 500",
        "A GPS location",
        "A motor encoder at zero"
      ],
      "correctIndex": 0,
      "explanation": "Slide 28 plays a welcome sound when someone comes within the stated ultrasonic distance.",
      "hint": "Recall what each input means to the welcome function."
    },
    {
      "id": "l4-lucky-cat-10",
      "topic": "welcome-and-coin",
      "learningSlide": 29,
      "prompt": "What indicates a coin has been inserted in the optional function?",
      "choices": [
        "An ultrasonic reading above 1000",
        "A photoelectric reading above 100",
        "A touch position of 240",
        "A volume reading below zero"
      ],
      "correctIndex": 1,
      "explanation": "The extension treats photoelectric values over 100 as coin detection.",
      "hint": "Recall what each input means to the welcome function."
    }
  ]
};
