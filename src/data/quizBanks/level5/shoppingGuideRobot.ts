/** Source: SHA-matched official Level 5 Learning PDF (28 pages). */
import type { QuizBank } from "../../quizStudio";

export const shoppingGuideRobotBank: QuizBank = {
  "projectId": "level-5-shopping-guide-robot",
  "title": "Shopping Guide Robot",
  "sourcePdfPath": "public/Level 5/Learning/Vehicles & Complex Movers/Shopping Guide Robot/14.Shopping Guide Robot-Slides.pdf",
  "sourcePageCount": 28,
  "questions": [
    {
      "id": "level-5-shopping-guide-robot-01",
      "topic": "guide-purpose",
      "learningSlide": 3,
      "prompt": "What is the main purpose of a shopping guide robot?",
      "choices": [
        "Help shoppers find and choose products",
        "Test whether a bridge can carry weight",
        "Adjust an oil pump's motion",
        "Monitor the weather at a station"
      ],
      "correctIndex": 0,
      "hint": "Think about assisting customers.",
      "explanation": "Slide 3 introduces robots that recommend products and guide shoppers."
    },
    {
      "id": "level-5-shopping-guide-robot-02",
      "topic": "guide-purpose",
      "learningSlide": 4,
      "prompt": "How can a mobile guide help when a shopper cannot locate an item?",
      "choices": [
        "Switch off the store's lighting",
        "Provide its location and potentially lead the shopper there",
        "Delete the store inventory",
        "Keep its location secret"
      ],
      "correctIndex": 1,
      "hint": "Some robots physically escort customers.",
      "explanation": "Slide 4 describes location guidance and robot-led navigation to products."
    },
    {
      "id": "level-5-shopping-guide-robot-03",
      "topic": "customer-detection",
      "learningSlide": 6,
      "prompt": "Which two product categories initially appear on the robot's touchscreen?",
      "choices": [
        "Books and pets",
        "Only one unidentified category",
        "Electrical appliances and food",
        "Cars and motorbikes"
      ],
      "correctIndex": 2,
      "hint": "Read the category names in the requirements.",
      "explanation": "Slide 6 specifies electrical appliances and food as the first two category buttons."
    },
    {
      "id": "level-5-shopping-guide-robot-04",
      "topic": "customer-detection",
      "learningSlide": 20,
      "prompt": "Which sensor triggers the display when a shopper approaches?",
      "choices": [
        "Motor encoder only",
        "Barometric pressure sensor",
        "A compass alone",
        "Ultrasonic sensor"
      ],
      "correctIndex": 3,
      "hint": "The robot first measures the presence of someone nearby.",
      "explanation": "Slide 20 waits for an ultrasonic sensor to detect an approaching customer."
    },
    {
      "id": "level-5-shopping-guide-robot-05",
      "topic": "text-variables",
      "learningSlide": 17,
      "prompt": "What can a variable store in addition to numeric values?",
      "choices": [
        "Characters such as letters and symbols",
        "Only a physical motor",
        "Only a non-changing electrical current",
        "Only photographs taken by a camera"
      ],
      "correctIndex": 0,
      "hint": "Programming values can represent words.",
      "explanation": "Slide 17 explicitly allows variables to store character data."
    },
    {
      "id": "level-5-shopping-guide-robot-06",
      "topic": "text-variables",
      "learningSlide": 18,
      "prompt": "How does the lesson show the stored product name to the shopper?",
      "choices": [
        "Move without using the screen",
        "Display the character-valued variable on the screen",
        "Print a hidden barcode on the floor",
        "Play only a motor noise"
      ],
      "correctIndex": 1,
      "hint": "The variable holds text that can be rendered.",
      "explanation": "Slide 18 demonstrates displaying character data held in a variable."
    },
    {
      "id": "level-5-shopping-guide-robot-07",
      "topic": "screen-selection",
      "learningSlide": 19,
      "prompt": "When does the robot decide which category was selected?",
      "choices": [
        "Only when Bluetooth disconnects",
        "When the battery level drops",
        "After the touchscreen is touched",
        "Before any category buttons are displayed"
      ],
      "correctIndex": 2,
      "hint": "The program waits for a user selection.",
      "explanation": "Slide 19 waits for a touchscreen action before deciding between the displayed categories."
    },
    {
      "id": "level-5-shopping-guide-robot-08",
      "topic": "screen-selection",
      "learningSlide": 21,
      "prompt": "What aspect of a screen touch is checked to identify a chosen category?",
      "choices": [
        "How loudly the screen vibrates",
        "The color of the controller housing",
        "How many wheels are turning",
        "Its position within a category's screen area"
      ],
      "correctIndex": 3,
      "hint": "Each virtual button occupies coordinates on screen.",
      "explanation": "Slide 21 compares the touch position with the appliances and food regions."
    },
    {
      "id": "level-5-shopping-guide-robot-09",
      "topic": "navigation",
      "learningSlide": 22,
      "prompt": "What is the robot instructed to do before driving to the selected product area?",
      "choices": [
        "Turn about 90 degrees to the right",
        "Stop permanently",
        "Reverse five times",
        "Rotate its touchscreen only"
      ],
      "correctIndex": 0,
      "hint": "The navigation starts with a turn.",
      "explanation": "Slide 22 turns the model approximately 90 degrees before forward movement."
    },
    {
      "id": "level-5-shopping-guide-robot-10",
      "topic": "navigation",
      "learningSlide": 24,
      "prompt": "Which additional categories are proposed for the expansion program?",
      "choices": [
        "Only another identical food category",
        "Daily necessities and stationery",
        "Oil and traffic lights",
        "Weather and sound"
      ],
      "correctIndex": 1,
      "hint": "Read the two new categories in the challenge.",
      "explanation": "Slide 24 introduces daily necessities and stationery and asks for updated touch-coordinate ranges."
    }
  ]
};
