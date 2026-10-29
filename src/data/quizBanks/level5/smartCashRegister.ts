/** Source: SHA-matched official Level 5 Learning PDF (25 pages). */
import type { QuizBank } from "../../quizStudio";

export const smartCashRegisterBank: QuizBank = {
  "projectId": "level-5-smart-cash-register",
  "title": "Smart Cash Register",
  "sourcePdfPath": "public/Level 5/Learning/Automation & Security/Smart Cash Register/02.Smart Cash Register-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "level-5-smart-cash-register-01",
      "topic": "checkout-purpose",
      "learningSlide": 10,
      "prompt": "What does a smart checkout calculate when product codes are scanned?",
      "choices": [
        "The total price of the selected products",
        "The customer's body temperature",
        "The store's air pressure",
        "The weather forecast"
      ],
      "correctIndex": 0,
      "hint": "Think about what the shopper pays.",
      "explanation": "Slide 10 describes calculating a total from scanned product codes."
    },
    {
      "id": "level-5-smart-cash-register-02",
      "topic": "checkout-purpose",
      "learningSlide": 11,
      "prompt": "What functions does the classroom cash-register model demonstrate?",
      "choices": [
        "Only an oil pump speed setting",
        "Unit price, total price and a moving drawer",
        "Only a flashing traffic arrow",
        "Only Bluetooth steering"
      ],
      "correctIndex": 1,
      "hint": "Read the prototype's listed capabilities.",
      "explanation": "Slide 11 specifies unit and total pricing with drawer opening and closing."
    },
    {
      "id": "level-5-smart-cash-register-03",
      "topic": "qr-products",
      "learningSlide": 13,
      "prompt": "Which sensor device is installed on the model to read product codes?",
      "choices": [
        "Thermometer",
        "Gyroscopic wheel",
        "QR-code scanning camera",
        "Motor encoder"
      ],
      "correctIndex": 2,
      "hint": "The model sees a coded label.",
      "explanation": "Slide 13 identifies a scanning camera on the cashier model."
    },
    {
      "id": "level-5-smart-cash-register-04",
      "topic": "qr-products",
      "learningSlide": 17,
      "prompt": "How does the program match a scanned code to an item?",
      "choices": [
        "Use only random colors",
        "Ask the motor to identify a price mechanically",
        "Assume every item is identical",
        "Compare QR values with programmed product entries"
      ],
      "correctIndex": 3,
      "hint": "Each product has a known code.",
      "explanation": "Slide 17 maps different QR-code values to specified items and prices."
    },
    {
      "id": "level-5-smart-cash-register-05",
      "topic": "price-total",
      "learningSlide": 17,
      "prompt": "What happens to the total after another recognized product is scanned?",
      "choices": [
        "Its price is added to the accumulated total",
        "The total always resets to zero",
        "The product is deleted immediately",
        "The drawer must stay open forever"
      ],
      "correctIndex": 0,
      "hint": "The total is a running sum.",
      "explanation": "Slide 17 accumulates the prices of detected goods."
    },
    {
      "id": "level-5-smart-cash-register-06",
      "topic": "price-total",
      "learningSlide": 19,
      "prompt": "What information is displayed in scanning mode after the product is identified?",
      "choices": [
        "A photo of the cash drawer only",
        "The item's price and the cumulative total",
        "Only the motor port number",
        "The Bluetooth host name"
      ],
      "correctIndex": 1,
      "hint": "Both a current value and a running amount matter.",
      "explanation": "Slide 19 displays the scanned product's price and total after judgment."
    },
    {
      "id": "level-5-smart-cash-register-07",
      "topic": "cash-drawer",
      "learningSlide": 14,
      "prompt": "What causes the drawer to pop out during checkout?",
      "choices": [
        "Turning a speed knob to zero",
        "Disconnecting the scanning camera",
        "Pressing the assigned drawer-opening button",
        "Scanning an invalid code"
      ],
      "correctIndex": 2,
      "hint": "The buttons choose drawer movement.",
      "explanation": "Slide 14 uses button commands to open or retract the drawer."
    },
    {
      "id": "level-5-smart-cash-register-08",
      "topic": "cash-drawer",
      "learningSlide": 16,
      "prompt": "How is the model's drawer movement implemented in the program?",
      "choices": [
        "A camera-only operation with no actuator",
        "Only a fixed screen animation",
        "A speaker volume adjustment",
        "A custom function that controls motor speed"
      ],
      "correctIndex": 3,
      "hint": "The drawer needs mechanical power.",
      "explanation": "Slide 16 describes a custom drawer function that controls motor rotation via a speed parameter."
    },
    {
      "id": "level-5-smart-cash-register-09",
      "topic": "customization",
      "learningSlide": 18,
      "prompt": "What does the cash register do when neither drawer button is pressed?",
      "choices": [
        "Remain in code-scanning and price-calculation mode",
        "Always open the drawer",
        "Turn the motor backward continuously",
        "Erase every known product"
      ],
      "correctIndex": 0,
      "hint": "Normal operation checks incoming goods.",
      "explanation": "Slide 18 selects the scanning and calculation state when neither drawer button is active."
    },
    {
      "id": "level-5-smart-cash-register-10",
      "topic": "customization",
      "learningSlide": 23,
      "prompt": "What does the lesson's program optimization suggest?",
      "choices": [
        "Replace the drawer with a walking robot",
        "Add more products to the register",
        "Remove all price calculations",
        "Disable QR scanning permanently"
      ],
      "correctIndex": 1,
      "hint": "The challenge expands the store inventory.",
      "explanation": "Slide 23 asks students to expand the register to recognize more products."
    }
  ]
};
