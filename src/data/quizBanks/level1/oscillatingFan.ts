/**
 * Level 1 official Building-PDF-as-Learning source-text question candidate.
 * Diagram-dependent claims and pedagogical review remain blocked pending visuals.
 * Unregistered content only; does not change shared quiz functionality.
 */
import type { QuizBank } from "../../quizStudio";

export const oscillatingFanBank: QuizBank = {
  "projectId": "oscillating-fan",
  "title": "Oscillating Fan",
  "sourcePdfPath": "public/Oscillating Fan.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "oscillating-fan-01",
      "topic": "cooling-context",
      "prompt": "Why is a fan that changes direction helpful in a shared room?",
      "choices": [
        "It can face different people",
        "It makes paper heavier",
        "It has no moving parts",
        "It always points at one person"
      ],
      "correctIndex": 0,
      "learningSlide": 4,
      "explanation": "The introduction asks how one fan can cool several people instead of facing only one.",
      "hint": "Think about sharing moving air among people."
    },
    {
      "id": "oscillating-fan-02",
      "topic": "cooling-context",
      "prompt": "What problem is the oscillating fan meant to solve?",
      "choices": [
        "There are no windows",
        "The light is too bright",
        "A fixed fan blows toward only one person",
        "The motor cannot connect by USB"
      ],
      "correctIndex": 2,
      "learningSlide": 4,
      "explanation": "The lesson motivates oscillation as a way to avoid cooling just one family member.",
      "hint": "Picture a fan that never turns to the left or right."
    },
    {
      "id": "oscillating-fan-03",
      "topic": "oscillation",
      "prompt": "What added movement is the oscillating fan designed to make?",
      "choices": [
        "Changing its facing direction",
        "Folding the blades into paper",
        "Sliding along a railroad",
        "Raising a bridge"
      ],
      "correctIndex": 0,
      "learningSlide": 4,
      "explanation": "The project asks students what is needed to make the fan oscillate.",
      "hint": "Compare a fan that faces one direction with one that changes its direction."
    },
    {
      "id": "oscillating-fan-04",
      "topic": "oscillation",
      "prompt": "What design question appears in the lesson's topic analysis?",
      "choices": [
        "How to draw an airplane runway",
        "How to make the fan oscillate",
        "How to build a ship's mast",
        "How to control a traffic light"
      ],
      "correctIndex": 1,
      "learningSlide": 4,
      "explanation": "The design prompts include what is needed to make the fan oscillate.",
      "hint": "Think about the extra motion the model needs beyond simply spinning."
    },
    {
      "id": "oscillating-fan-05",
      "topic": "gears-and-linkages",
      "prompt": "Which linkage type is highlighted as a construction difficulty?",
      "choices": [
        "Optical lens",
        "Phone handset",
        "Eccentric link",
        "Crankless fixed tripod"
      ],
      "correctIndex": 2,
      "learningSlide": 3,
      "explanation": "The key points emphasize correct construction of an eccentric link.",
      "hint": "Remember the offset connection discussed in the lesson's construction objectives."
    },
    {
      "id": "oscillating-fan-06",
      "topic": "gears-and-linkages",
      "prompt": "Which other mechanisms are included with linkage in the objectives?",
      "choices": [
        "Lenses and microscopes",
        "Transistors and antennas",
        "Screens and cameras",
        "Gears and turbines"
      ],
      "correctIndex": 3,
      "learningSlide": 3,
      "explanation": "The objectives specifically list link structures, gears and turbines.",
      "hint": "Recall the two other mechanical components named with the link structure."
    },
    {
      "id": "oscillating-fan-07",
      "topic": "motor-control",
      "prompt": "Which part of the oscillating fan model can have its speed adjusted in the programming activity?",
      "choices": [
        "The classroom door",
        "The motor",
        "The paper worksheet",
        "The PDF viewer"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "explanation": "The hands-on instructions teach motor control and adjusting motor speed values.",
      "hint": "It is the part that drives movement."
    },
    {
      "id": "oscillating-fan-08",
      "topic": "motor-control",
      "prompt": "Which module should the student configure using programming software?",
      "choices": [
        "Spreadsheet module",
        "Motor module",
        "Calendar module",
        "Photo-cropping module"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "explanation": "The source directs students to learn to set the motor module.",
      "hint": "Remember which programmable robot component supplies motion to the model."
    },
    {
      "id": "oscillating-fan-09",
      "topic": "programming",
      "prompt": "What is adjusted to change the fan's speed?",
      "choices": [
        "Number of lesson pages",
        "Blackboard position",
        "Motor speed value",
        "Colour scheme"
      ],
      "correctIndex": 2,
      "learningSlide": 5,
      "explanation": "The programming instructions say to debug the speed value.",
      "hint": "Consider the adjustable number in the motor-control block that affects movement."
    },
    {
      "id": "oscillating-fan-10",
      "topic": "programming",
      "prompt": "How does the lesson describe the connection between controller and computer?",
      "choices": [
        "Via a loose gear",
        "Via a rubber band",
        "Via paper tape",
        "Via USB cable"
      ],
      "correctIndex": 3,
      "learningSlide": 5,
      "explanation": "The lesson names a USB cable to connect the controller to a computer.",
      "hint": "Think about the physical connection used for transferring instructions from a computer."
    }
  ]
};
