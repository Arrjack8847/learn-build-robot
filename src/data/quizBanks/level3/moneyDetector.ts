/** Verified against the registered Level 3 source PDF, pages are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const moneyDetectorBank: QuizBank = {
  "projectId": "level-3-money-detector",
  "title": "Money Detector",
  "sourcePdfPath": "public/Level 3/Learning/Machines & Mechanisms/Money detector.pdf",
  "sourcePageCount": 17,
  "questions": [
    {
      "id": "moneydetector-01",
      "topic": "purpose",
      "learningSlide": 5,
      "prompt": "What are two intended functions of a money detector?",
      "choices": [
        "Measure rainfall and temperature",
        "Count banknotes and distinguish real from fake",
        "Open a garage door and sound a bell",
        "Sort metal gears by size"
      ],
      "correctIndex": 1,
      "hint": "The machine handles paper currency.",
      "explanation": "Slide 5 describes banknote counting and counterfeit detection."
    },
    {
      "id": "moneydetector-02",
      "topic": "purpose",
      "learningSlide": 4,
      "prompt": "Why are banknote-handling machines useful for some transactions?",
      "choices": [
        "Digital payment makes all cash weightless",
        "A banknote cannot be counted by hand",
        "Large amounts of paper currency can be cumbersome to handle",
        "They eliminate the need for any money"
      ],
      "correctIndex": 2,
      "hint": "The machine handles paper currency.",
      "explanation": "Slide 4 notes the inconvenience of using many banknotes."
    },
    {
      "id": "moneydetector-03",
      "topic": "transport",
      "learningSlide": 6,
      "prompt": "Why does the model use a reduction gear transmission?",
      "choices": [
        "To make every note fly through quickly",
        "To eliminate all mechanical contact",
        "To spin the banknotes without feeding them",
        "To move banknotes at a manageable speed"
      ],
      "correctIndex": 3,
      "hint": "Consider slowing the transport mechanism enough for sensing.",
      "explanation": "Slide 6 says the note transport should not run too fast and uses gear reduction."
    },
    {
      "id": "moneydetector-04",
      "topic": "transport",
      "learningSlide": 16,
      "prompt": "What effect does the lesson's gear-reduction structure have?",
      "choices": [
        "It reduces rotational speed",
        "It increases every gear's speed",
        "It stops gear movement completely",
        "It generates electricity from paper"
      ],
      "correctIndex": 0,
      "hint": "Consider slowing the transport mechanism enough for sensing.",
      "explanation": "Slide 16 asks for the role of the gear-reduction structure."
    },
    {
      "id": "moneydetector-05",
      "topic": "count",
      "learningSlide": 6,
      "prompt": "Which sensor is assigned to count passing banknotes?",
      "choices": [
        "Barometric sensor",
        "Infrared sensor",
        "Ultrasonic sound meter",
        "Temperature sensor"
      ],
      "correctIndex": 1,
      "hint": "The model uses a sensor to detect passing banknotes.",
      "explanation": "Slide 6 selects an infrared sensor for counting notes."
    },
    {
      "id": "moneydetector-06",
      "topic": "count",
      "learningSlide": 15,
      "prompt": "What additional feature is requested after the first banknote-identification task?",
      "choices": [
        "Measuring motor temperature",
        "Taking photographs of each banknote",
        "Counting how many banknotes pass",
        "Weighing the entire machine"
      ],
      "correctIndex": 2,
      "hint": "The model uses a sensor to detect passing banknotes.",
      "explanation": "Slide 15 asks for identifying the number of banknotes."
    },
    {
      "id": "moneydetector-07",
      "topic": "classification",
      "learningSlide": 14,
      "prompt": "What color represents a real note in the lesson's simplified exercise?",
      "choices": [
        "Black",
        "Red",
        "Blue",
        "White"
      ],
      "correctIndex": 3,
      "hint": "The example uses two distinct surface colors.",
      "explanation": "Slide 14 treats a white test banknote as real."
    },
    {
      "id": "moneydetector-08",
      "topic": "classification",
      "learningSlide": 14,
      "prompt": "What color represents a counterfeit note in the simulated test?",
      "choices": [
        "Black",
        "White",
        "Yellow",
        "Green"
      ],
      "correctIndex": 0,
      "hint": "The example uses two distinct surface colors.",
      "explanation": "Slide 14 treats a black test banknote as counterfeit in the simulation."
    },
    {
      "id": "moneydetector-09",
      "topic": "alerts",
      "learningSlide": 14,
      "prompt": "What should the money detector do when the simulated fake note is identified?",
      "choices": [
        "Continue feeding faster",
        "Stop and emit a sound",
        "Reverse the display text only",
        "Ignore the detection"
      ],
      "correctIndex": 1,
      "hint": "A suspected counterfeit requires a different response.",
      "explanation": "Slide 14 specifies stopping and sounding an alert for simulated counterfeit money."
    },
    {
      "id": "moneydetector-10",
      "topic": "alerts",
      "learningSlide": 17,
      "prompt": "Which kind of output can the project program produce besides controlling motors?",
      "choices": [
        "Only paper printouts",
        "Chemical reactions",
        "Sound alerts",
        "Actual legal currency verification"
      ],
      "correctIndex": 2,
      "hint": "A suspected counterfeit requires a different response.",
      "explanation": "Slide 17 summarizes motor control and sound prompts."
    }
  ]
};
