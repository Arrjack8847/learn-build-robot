import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 24-page Learning PDF. */
export const vendingMachineBank: QuizBank = {
  "projectId": "level-6-vending-machine",
  "title": "Vending Machine",
  "sourcePdfPath": "public/Level 6/Learning/Mechanisms & Simulators/Vending Machine/27.Vending Machine-Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "ven-01",
      "topic": "vending-operation",
      "learningSlide": 7,
      "prompt": "What makes a traditional vending machine dispense a selected item?",
      "choices": [
        "Payment followed by choosing an item",
        "Measuring nearby wind speed",
        "Detecting a human face alone",
        "Pressing a motor shaft directly"
      ],
      "correctIndex": 0,
      "hint": "The machine needs purchase input.",
      "explanation": "Slide 7 describes coin insertion and item-button selection."
    },
    {
      "id": "ven-02",
      "topic": "vending-operation",
      "learningSlide": 9,
      "prompt": "What feature can smart vending machines provide to operators?",
      "choices": [
        "Only accept loose coins forever",
        "Monitor stock and alert staff when items run low",
        "Disable inventory checks",
        "Replace every item with a barcode"
      ],
      "correctIndex": 1,
      "hint": "Inventory monitoring supports restocking.",
      "explanation": "Slide 9 describes automatic low-stock notifications."
    },
    {
      "id": "ven-03",
      "topic": "tag-code-hardware",
      "learningSlide": 12,
      "prompt": "Which port connects the AI vision module?",
      "choices": [
        "M1",
        "M4",
        "P8",
        "An audio-only output"
      ],
      "correctIndex": 2,
      "hint": "Tag scanning requires a sensor connection.",
      "explanation": "Slide 12 assigns AI vision to P8."
    },
    {
      "id": "ven-04",
      "topic": "tag-code-hardware",
      "learningSlide": 14,
      "prompt": "Which vision mode reads the vending-machine payment tags?",
      "choices": [
        "Road recognition",
        "Ball tracking",
        "Rainfall sensing",
        "Tag-code recognition"
      ],
      "correctIndex": 3,
      "hint": "The program identifies tags as prices.",
      "explanation": "Slide 14 sets tag-code recognition mode."
    },
    {
      "id": "ven-05",
      "topic": "price-total",
      "learningSlide": 14,
      "prompt": "What is the initial value of Total Price?",
      "choices": [
        "0",
        "5",
        "100",
        "999"
      ],
      "correctIndex": 0,
      "hint": "The total starts empty before adding recognised prices.",
      "explanation": "Slide 14 initializes Total Price to zero."
    },
    {
      "id": "ven-06",
      "topic": "price-total",
      "learningSlide": 16,
      "prompt": "When should Product Price be added to Total Price?",
      "choices": [
        "When Product Price is less than zero",
        "When Product Price is greater than zero",
        "Whenever the camera is disconnected",
        "Only after clearing all prices"
      ],
      "correctIndex": 1,
      "hint": "Only valid positive price codes should contribute.",
      "explanation": "Slide 16 adds a positive Product Price to the total."
    },
    {
      "id": "ven-07",
      "topic": "hatch-release",
      "learningSlide": 17,
      "prompt": "What condition unlocks the left container hatch in the basic lesson?",
      "choices": [
        "Total Price less than 0",
        "Any unrecognized tag",
        "Total Price greater than 5",
        "The camera cannot detect a price"
      ],
      "correctIndex": 2,
      "hint": "A sufficient total triggers left-hatch delivery.",
      "explanation": "Slide 17 checks Total Price > 5 for the left hatch."
    },
    {
      "id": "ven-08",
      "topic": "hatch-release",
      "learningSlide": 19,
      "prompt": "What happens to Total Price after an item is dispensed?",
      "choices": [
        "It is doubled",
        "It becomes a permanent password",
        "It changes into the motor speed",
        "It is reset to zero"
      ],
      "correctIndex": 3,
      "hint": "The next transaction needs a fresh total.",
      "explanation": "Slide 19 clears Total Price after delivery."
    },
    {
      "id": "ven-09",
      "topic": "extension",
      "learningSlide": 22,
      "prompt": "What new pricing rule is required in the vending-machine expansion?",
      "choices": [
        "Set different fixed prices for left and right containers",
        "Make both containers permanently free",
        "Remove all price comparisons",
        "Stop recognizing product tags"
      ],
      "correctIndex": 0,
      "hint": "Each container should have its own cost.",
      "explanation": "Slide 22 calls for fixed prices per container."
    },
    {
      "id": "ven-10",
      "topic": "extension",
      "learningSlide": 22,
      "prompt": "What extra calculation should the expanded vending machine perform?",
      "choices": [
        "Calculate only the screen brightness",
        "Calculate the remaining balance",
        "Count the wings on a robot",
        "Measure the room pressure"
      ],
      "correctIndex": 1,
      "hint": "The customer may pay more than the item's fixed price.",
      "explanation": "Slide 22 asks to calculate balance after selling."
    }
  ]
};
