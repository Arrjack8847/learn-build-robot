/** Level 4 Learning PDF text checked page by page; questions do not depend on unreviewed diagrams. */
import type { QuizBank } from "../../quizStudio";

export const cardReaderBank: QuizBank = {
  "projectId": "level-4-card-reader",
  "title": "Card reader",
  "sourcePdfPath": "public/Level 4/Sensor Automation/Card reader/08.Card reader-update.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "l4-cr-01",
      "topic": "barcode-patterns",
      "learningSlide": 6,
      "prompt": "What pattern forms the barcode described in this lesson?",
      "choices": [
        "Red circles",
        "A solid blue square",
        "Black and white lines",
        "One blinking lamp"
      ],
      "correctIndex": 2,
      "explanation": "Slide 6 says a barcode contains black and white lines.",
      "hint": "Imagine the stripes on a product label."
    },
    {
      "id": "l4-cr-02",
      "topic": "barcode-patterns",
      "learningSlide": 6,
      "prompt": "What helps a barcode scanner distinguish black and white regions?",
      "choices": [
        "Differences in reflected infrared light",
        "The weight of the card",
        "The sound of each stripe",
        "An attached compass"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 explains differences in infrared reflection.",
      "hint": "Dark and light surfaces return different amounts of light."
    },
    {
      "id": "l4-cr-03",
      "topic": "scanner-signals",
      "learningSlide": 6,
      "prompt": "What kind of output changes with the reflected light intensity?",
      "choices": [
        "The paper's weight",
        "The robot's wheelbase",
        "The room temperature",
        "A high or low voltage signal"
      ],
      "correctIndex": 3,
      "explanation": "Slide 6 describes high and low sensor voltage according to reflected light.",
      "hint": "A sensor converts light into an electrical signal."
    },
    {
      "id": "l4-cr-04",
      "topic": "scanner-signals",
      "learningSlide": 6,
      "prompt": "What does the barcode reader generate from logical signals and coding rules?",
      "choices": [
        "A gear ratio",
        "Digital data",
        "Sound waves",
        "A magnetic field"
      ],
      "correctIndex": 1,
      "explanation": "Slide 6 says the logic signals become digital data using coding rules.",
      "hint": "Think about how a scanner sends information to a program."
    },
    {
      "id": "l4-cr-05",
      "topic": "identification-goal",
      "learningSlide": 7,
      "prompt": "What is the main goal of the card-reader robot?",
      "choices": [
        "Distinguish cards and use their information",
        "Measure wind speed",
        "Walk up stairs",
        "Count the robot's wheels"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 introduces distinguishing cards and acting on card information.",
      "hint": "It needs to tell one card from another."
    },
    {
      "id": "l4-cr-06",
      "topic": "identification-goal",
      "learningSlide": 9,
      "prompt": "Which model feature supports identifying a card?",
      "choices": [
        "A propeller",
        "A long crane",
        "A card slot",
        "A water pump"
      ],
      "correctIndex": 2,
      "explanation": "Slide 9 names the identifying card slot.",
      "hint": "Where does a card go when it is read?"
    },
    {
      "id": "l4-cr-07",
      "topic": "reader-hardware",
      "learningSlide": 10,
      "prompt": "Which electronic components are specified for the lesson build?",
      "choices": [
        "Thermometer and compass",
        "RCU and color sensor",
        "Pressure gauge and microphone",
        "Camera and GPS"
      ],
      "correctIndex": 1,
      "explanation": "Slide 10 lists an RCU and a color sensor.",
      "hint": "The controller works with a sensor that detects card color."
    },
    {
      "id": "l4-cr-08",
      "topic": "reader-hardware",
      "learningSlide": 10,
      "prompt": "What physical arrangement needs particular care?",
      "choices": [
        "A tall antenna",
        "A water container",
        "An airplane wing",
        "The match between the card and its slot"
      ],
      "correctIndex": 3,
      "explanation": "Slide 10 calls for coordination between card and slot.",
      "hint": "The card must fit and align correctly."
    },
    {
      "id": "l4-cr-09",
      "topic": "reader-program",
      "learningSlide": 14,
      "prompt": "Which detection operation appears on the program slide?",
      "choices": [
        "Color detection",
        "Air pressure sensing",
        "Satellite positioning",
        "Magnet calibration"
      ],
      "correctIndex": 0,
      "explanation": "Slide 14 labels the program action as color detection.",
      "hint": "It checks the property measured by the listed sensor."
    },
    {
      "id": "l4-cr-10",
      "topic": "reader-program",
      "learningSlide": 15,
      "prompt": "What should students do after assembling the robot and writing the program?",
      "choices": [
        "Avoid any tests",
        "Unplug the color sensor permanently",
        "Debug the program for the robot's characteristics",
        "Only paint the card"
      ],
      "correctIndex": 2,
      "explanation": "Slide 15 instructs students to debug the robot's program.",
      "hint": "Testing helps find mistakes in behavior."
    }
  ]
};
