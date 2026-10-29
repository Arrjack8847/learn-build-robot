import type { QuizBank } from "../../quizStudio";
/** Level 4 Vending machine bank verified against its Learning PDF text. */
export const vendingMachineBank: QuizBank = {
  "projectId": "level-4-vending-machine",
  "title": "Vending machine",
  "sourcePdfPath": "public/Level 4/Foundational Robots/Vending machine.pdf",
  "sourcePageCount": 27,
  "questions": [
    {
      "id": "l4-vending-machine-01",
      "topic": "vending-purpose",
      "learningSlide": 4,
      "prompt": "Why can a vending machine sell products without a cashier?",
      "choices": [
        "Its programmed mechanism automates the transaction",
        "It always has a person behind it",
        "It uses only printed signs",
        "It has no physical parts"
      ],
      "correctIndex": 0,
      "explanation": "The introduction explains vending machines can provide items without a salesperson.",
      "hint": "Think about buying an item without a shop worker."
    },
    {
      "id": "l4-vending-machine-02",
      "topic": "vending-purpose",
      "learningSlide": 3,
      "prompt": "Which situation motivates the lesson's vending-machine example?",
      "choices": [
        "A robot needing to ski",
        "A piano requiring new keys",
        "An automatic curtain",
        "Needing a drink without a nearby shop"
      ],
      "correctIndex": 3,
      "explanation": "The lesson describes wanting water while away from a shop.",
      "hint": "Think about buying an item without a shop worker."
    },
    {
      "id": "l4-vending-machine-03",
      "topic": "purchase-sequence",
      "learningSlide": 5,
      "prompt": "What does the customer do first in the lesson's vending process?",
      "choices": [
        "Open a repair panel",
        "Record a video",
        "Insert coins",
        "Remove the controller"
      ],
      "correctIndex": 2,
      "explanation": "The explanation begins with inserting coins.",
      "hint": "Follow the steps a customer takes."
    },
    {
      "id": "l4-vending-machine-04",
      "topic": "purchase-sequence",
      "learningSlide": 5,
      "prompt": "What does a customer do after payment to receive the chosen product?",
      "choices": [
        "Remove the infrared sensor",
        "Choose the desired item",
        "Press the motor encoder",
        "Reset the PDF viewer"
      ],
      "correctIndex": 1,
      "explanation": "The sequence is payment, selection, then delivery.",
      "hint": "Follow the steps a customer takes."
    },
    {
      "id": "l4-vending-machine-05",
      "topic": "coin-sensing",
      "learningSlide": 6,
      "prompt": "Which component senses whether a coin is present?",
      "choices": [
        "Infrared sensor",
        "Barometric sensor",
        "Ultrasonic weather station",
        "GPS receiver"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 suggests infrared sensing for coin presence.",
      "hint": "Consider how the model detects payment."
    },
    {
      "id": "l4-vending-machine-06",
      "topic": "coin-sensing",
      "learningSlide": 6,
      "prompt": "What does the coin sensor report to the controller?",
      "choices": [
        "How tall a customer is",
        "The shop's GPS location",
        "The time of sunset",
        "Whether a coin has been detected"
      ],
      "correctIndex": 3,
      "explanation": "The sensor tells the machine whether it detects an object in the coin area.",
      "hint": "Consider how the model detects payment."
    },
    {
      "id": "l4-vending-machine-07",
      "topic": "product-dispensing",
      "learningSlide": 7,
      "prompt": "What actuates the mechanism to dispense one product?",
      "choices": [
        "A keyboard",
        "A thermometer",
        "Two motors",
        "A screen image only"
      ],
      "correctIndex": 2,
      "explanation": "Slide 7 says two motors are used to control product release.",
      "hint": "Recall how the model physically releases a product."
    },
    {
      "id": "l4-vending-machine-08",
      "topic": "product-dispensing",
      "learningSlide": 7,
      "prompt": "Which design problem does the motor mechanism solve?",
      "choices": [
        "Measuring body height",
        "Delivering an item when requested",
        "Reading a weather forecast",
        "Adjusting the music volume"
      ],
      "correctIndex": 1,
      "explanation": "The motors handle physical product dispensing.",
      "hint": "Recall how the model physically releases a product."
    },
    {
      "id": "l4-vending-machine-09",
      "topic": "screen-and-coding",
      "learningSlide": 24,
      "prompt": "What does the happy screen expression indicate in Task 1?",
      "choices": [
        "The vending machine was activated successfully",
        "The machine ran out of programs",
        "The sensor was discarded",
        "The motors are overheating"
      ],
      "correctIndex": 0,
      "explanation": "The task displays a happy expression on successful activation.",
      "hint": "Think about the success expression and next command."
    },
    {
      "id": "l4-vending-machine-10",
      "topic": "screen-and-coding",
      "learningSlide": 25,
      "prompt": "What additional task follows successful activation?",
      "choices": [
        "Remove the touch sensor",
        "Stop all tests",
        "Draw a QR-code map",
        "Drive the two motors to release the item"
      ],
      "correctIndex": 3,
      "explanation": "Task 2 controls the two dispensing motors after activation.",
      "hint": "Think about the success expression and next command."
    }
  ]
};
