/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const corridorLampBank: QuizBank = {
  "projectId": "corridor-lamp",
  "title": "Corridor Lamp",
  "sourcePdfPath": "public/Level 1/Learning/Illumination & Signals/Corridor lamp/Corridor lamp_Powerpoint.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "corridor-lamp-01",
      "topic": "led-definition",
      "learningSlide": 7,
      "prompt": "What do the letters LED stand for?",
      "choices": [
        "Low Energy Detector",
        "Light Emitting Diode",
        "Light Energy Driver",
        "Linear Electronic Display"
      ],
      "correctIndex": 1,
      "hint": "Recall the expanded term in the course introduction.",
      "explanation": "The slide spells out LED as Light Emitting Diode."
    },
    {
      "id": "corridor-lamp-02",
      "topic": "led-definition",
      "learningSlide": 7,
      "prompt": "What type of electronic component is an LED described as?",
      "choices": [
        "Hydraulic piston",
        "Wooden peg",
        "Semiconductor component",
        "Mechanical lever"
      ],
      "correctIndex": 2,
      "hint": "Think about the material class in the LED definition.",
      "explanation": "The course introduces LED as a semiconductor component."
    },
    {
      "id": "corridor-lamp-03",
      "topic": "led-uses",
      "learningSlide": 7,
      "prompt": "Which early LED use is mentioned in the lesson?",
      "choices": [
        "Powering wheels directly",
        "Replacing all gears",
        "Storing programs",
        "Indicator lights"
      ],
      "correctIndex": 3,
      "hint": "Consider a small light showing device status.",
      "explanation": "The lesson describes LEDs as indicators and display components."
    },
    {
      "id": "corridor-lamp-04",
      "topic": "led-uses",
      "learningSlide": 10,
      "prompt": "Which application of LED light appears in the teaching section?",
      "choices": [
        "LED light bars",
        "Steam pistons",
        "Sailboat rudders",
        "Pressure switches"
      ],
      "correctIndex": 0,
      "hint": "The lesson lists household lighting products.",
      "explanation": "The source mentions LED light bars and LED lighting."
    },
    {
      "id": "corridor-lamp-05",
      "topic": "colours-and-design",
      "learningSlide": 7,
      "prompt": "What is the robot built in this lesson called?",
      "choices": [
        "Mechanical arm",
        "Corridor lamp",
        "Drummer robot",
        "REX robot"
      ],
      "correctIndex": 1,
      "hint": "Recall the model named after the LED explanation.",
      "explanation": "The introduction calls the project the corridor light robot."
    },
    {
      "id": "corridor-lamp-06",
      "topic": "colours-and-design",
      "learningSlide": 7,
      "prompt": "How many different light colours does the lesson say the model can show?",
      "choices": [
        "Fourteen",
        "One",
        "Seven",
        "Two"
      ],
      "correctIndex": 2,
      "hint": "Recall the number associated with the colour-light function.",
      "explanation": "The source describes a corridor lamp capable of seven light colours."
    },
    {
      "id": "corridor-lamp-07",
      "topic": "assembly-standard",
      "learningSlide": 12,
      "prompt": "Which is one required condition for the lamp's construction?",
      "choices": [
        "Unmatched shape",
        "Loose mounting",
        "No attention to balance",
        "Stable structure"
      ],
      "correctIndex": 3,
      "hint": "Think about the assembly quality checklist.",
      "explanation": "The practical task requires stable structure."
    },
    {
      "id": "corridor-lamp-08",
      "topic": "assembly-standard",
      "learningSlide": 12,
      "prompt": "What should students consider alongside stability and shape matching?",
      "choices": [
        "Proper gravity/balance",
        "Adding unrelated wheels",
        "Avoiding all connectors",
        "Making the structure deliberately uneven"
      ],
      "correctIndex": 0,
      "hint": "Recall the three stated assembly goals.",
      "explanation": "The checklist mentions proper gravity or balance."
    },
    {
      "id": "corridor-lamp-09",
      "topic": "timing-activities",
      "learningSlide": 15,
      "prompt": "Which on-then-off timing is assigned as the first homework task?",
      "choices": [
        "On for one millisecond only",
        "On for five seconds, then off",
        "On for one minute, then on again",
        "Off for five seconds, then always on"
      ],
      "correctIndex": 1,
      "hint": "Look for the first timed light activity.",
      "explanation": "The homework first asks to turn the light on for five seconds and then off."
    },
    {
      "id": "corridor-lamp-10",
      "topic": "timing-activities",
      "learningSlide": 15,
      "prompt": "Which repeated blink pattern is suggested in the second homework task?",
      "choices": [
        "Always on with no change",
        "Ten seconds off and no on time",
        "One second on and one second off",
        "Five seconds on and five minutes off"
      ],
      "correctIndex": 2,
      "hint": "Recall the shorter alternating timing challenge.",
      "explanation": "The second homework uses one second on and one second off."
    }
  ]
};
