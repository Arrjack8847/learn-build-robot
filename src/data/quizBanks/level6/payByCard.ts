import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 27-page Learning PDF. */
export const payByCardBank: QuizBank = {
  "projectId": "level-6-pay-by-card",
  "title": "Pay By Card",
  "sourcePdfPath": "public/Level 6/Learning/Mechanisms & Simulators/Pay by card/16.Pay by card -Slides.pdf",
  "sourcePageCount": 27,
  "questions": [
    {
      "id": "pbc-01",
      "topic": "pos-model",
      "learningSlide": 6,
      "prompt": "What do red and green blocks represent in the POS model?",
      "choices": [
        "Cards with different bank balances",
        "A pair of traffic lights",
        "Road-centering markers",
        "Different motor speeds"
      ],
      "correctIndex": 0,
      "hint": "The card is simulated by an object colour.",
      "explanation": "Slide 6 assigns red and green blocks to card balances."
    },
    {
      "id": "pbc-02",
      "topic": "pos-model",
      "learningSlide": 6,
      "prompt": "What does the screen show before a payment is attempted?",
      "choices": [
        "Only an obstacle distance",
        "The product price",
        "Only the controller's serial number",
        "A random QR password"
      ],
      "correctIndex": 1,
      "hint": "The customer needs to know the amount being charged.",
      "explanation": "Slide 6 requires the screen to display the product price."
    },
    {
      "id": "pbc-03",
      "topic": "list-balances",
      "learningSlide": 19,
      "prompt": "Where does the program save the two cards' balances?",
      "choices": [
        "Only in motor encoder values",
        "In a colour brightness setting",
        "In a list",
        "In a sound-wave recording"
      ],
      "correctIndex": 2,
      "hint": "The data structure stores values for both cards.",
      "explanation": "Slide 19 initializes a list of bank card balances."
    },
    {
      "id": "pbc-04",
      "topic": "list-balances",
      "learningSlide": 17,
      "prompt": "Which operation can a list perform on a specified item?",
      "choices": [
        "Physically repaint the bank card",
        "Measure a room's temperature",
        "Change the hardware connector",
        "Replace its stored data"
      ],
      "correctIndex": 3,
      "hint": "The program must update individual records.",
      "explanation": "Slide 17 explains replacement of an item in a list."
    },
    {
      "id": "pbc-05",
      "topic": "price-controls",
      "learningSlide": 6,
      "prompt": "How does the left button change the product price?",
      "choices": [
        "Increase it by one",
        "Decrease it by ten",
        "Set it to zero immediately",
        "Double it"
      ],
      "correctIndex": 0,
      "hint": "The buttons move the price in opposite directions.",
      "explanation": "Slide 6 uses the left button to raise price by one."
    },
    {
      "id": "pbc-06",
      "topic": "price-controls",
      "learningSlide": 20,
      "prompt": "Which colour sensor reading identifies a red card?",
      "choices": [
        "2",
        "1",
        "6",
        "240"
      ],
      "correctIndex": 1,
      "hint": "The program maps colours to numeric IDs.",
      "explanation": "Slide 20 assigns red to sensor value 1."
    },
    {
      "id": "pbc-07",
      "topic": "payment-logic",
      "learningSlide": 21,
      "prompt": "What message is shown when the price exceeds the card's balance?",
      "choices": [
        "Payment successful",
        "Road not found",
        "Insufficient balance",
        "Colour learning complete"
      ],
      "correctIndex": 2,
      "hint": "The card cannot cover the cost.",
      "explanation": "Slide 21 rejects payments higher than the balance."
    },
    {
      "id": "pbc-08",
      "topic": "payment-logic",
      "learningSlide": 21,
      "prompt": "What happens after a successful card payment?",
      "choices": [
        "Increase the card balance by the price",
        "Delete all cards from the list",
        "Ignore the transaction",
        "Deduct the price and update the stored balance"
      ],
      "correctIndex": 3,
      "hint": "The system keeps track of money left.",
      "explanation": "Slide 21 subtracts price and updates that card's balance."
    },
    {
      "id": "pbc-09",
      "topic": "extension",
      "learningSlide": 22,
      "prompt": "What is the goal of the POS expansion task?",
      "choices": [
        "Add more cards with different balances",
        "Remove price selection",
        "Make every purchase free",
        "Replace the screen with a road sensor"
      ],
      "correctIndex": 0,
      "hint": "The system supports more card accounts.",
      "explanation": "Slide 22 adds bank cards with different amounts."
    },
    {
      "id": "pbc-10",
      "topic": "extension",
      "learningSlide": 23,
      "prompt": "What additional setting must change when new card colours are added?",
      "choices": [
        "The page count of the source PDF",
        "The valid card-colour value range",
        "The classroom clock",
        "The sensor's physical shape"
      ],
      "correctIndex": 1,
      "hint": "The scanner must accept new card colour IDs.",
      "explanation": "Slide 23 requests adjusting valid card colour ranges."
    }
  ]
};
