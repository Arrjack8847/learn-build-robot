/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const sailboatBank: QuizBank = {
  "projectId": "sailboat",
  "title": "Sailboat",
  "sourcePdfPath": "public/Level 1/Learning/Foundational Robots/Sailboat.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "sailboat-01",
      "topic": "boat-background",
      "learningSlide": 2,
      "prompt": "According to the lesson, why have ships mattered throughout history?",
      "choices": [
        "They are only used for sports",
        "They cannot carry goods",
        "They are used only on rivers",
        "They serve transport, trade and military needs"
      ],
      "correctIndex": 3,
      "hint": "Think about the uses mentioned in the introduction.",
      "explanation": "The lesson describes military and commercial roles for boats and ships."
    },
    {
      "id": "sailboat-02",
      "topic": "boat-background",
      "learningSlide": 3,
      "prompt": "What does the lesson say about types of boats and ships?",
      "choices": [
        "There are many different types",
        "Every boat is identical",
        "All boats require sails",
        "Only one design exists"
      ],
      "correctIndex": 0,
      "hint": "Recall the variety emphasized before introducing sailboats.",
      "explanation": "The slide introduces the many types of boats and ships."
    },
    {
      "id": "sailboat-03",
      "topic": "sailing-power",
      "learningSlide": 4,
      "prompt": "What is the main power source for a real sailboat in the lesson?",
      "choices": [
        "Infrared transmitter",
        "Wind",
        "Electric screen",
        "Touch sensor"
      ],
      "correctIndex": 1,
      "hint": "Consider the natural force acting on sails.",
      "explanation": "The source says wind provides the main power for sailboats."
    },
    {
      "id": "sailboat-04",
      "topic": "sailing-power",
      "learningSlide": 4,
      "prompt": "Which other effect is named in the sailboat exploration?",
      "choices": [
        "Photoelectric effect",
        "Hall effect",
        "Bernoulli effect",
        "Doppler effect"
      ],
      "correctIndex": 2,
      "hint": "The lesson gives a named effect in addition to wind.",
      "explanation": "The exploration mentions the Bernoulli effect in connection with sailing."
    },
    {
      "id": "sailboat-05",
      "topic": "motion-mechanism",
      "learningSlide": 5,
      "prompt": "How is movement on the ocean described in the lesson?",
      "choices": [
        "Always perfectly smooth",
        "Completely stationary",
        "Only vertical with no rocking",
        "Bumpy"
      ],
      "correctIndex": 3,
      "hint": "Recall the movement students are asked to reproduce.",
      "explanation": "The exploration describes the ocean ride as very bumpy."
    },
    {
      "id": "sailboat-06",
      "topic": "motion-mechanism",
      "learningSlide": 6,
      "prompt": "Which mechanism helps the model's sails rock up and down?",
      "choices": [
        "Crank-rocker mechanism",
        "Straight rigid gear lock",
        "Touch-only switch",
        "Colour sensor circuit"
      ],
      "correctIndex": 0,
      "hint": "The slide recalls a familiar linkage mechanism.",
      "explanation": "The construction slide asks students to use a crank-rocker mechanism to make rocking movement."
    },
    {
      "id": "sailboat-07",
      "topic": "gearing",
      "learningSlide": 23,
      "prompt": "Which gear drives which in the sailboat's speed-reduction example?",
      "choices": [
        "A gear drives a screen",
        "Small gear drives large gear",
        "Large gear drives small gear",
        "Two equal gears with no difference"
      ],
      "correctIndex": 1,
      "hint": "Think about the arrangement that slows the output.",
      "explanation": "The lesson describes a small gear driving a large gear.",
      "image": {
        "src": "/quiz-visuals/level1/sailboat.svg",
        "alt": "Small toothed gear driving a larger gear next to a sailboat."
      }
    },
    {
      "id": "sailboat-08",
      "topic": "gearing",
      "learningSlide": 23,
      "prompt": "What happens to the large gear in that reduction arrangement?",
      "choices": [
        "It becomes a motor",
        "It stops being a gear",
        "It turns more slowly",
        "It turns infinitely fast"
      ],
      "correctIndex": 2,
      "hint": "Recall why the lesson calls it a reduction gear.",
      "explanation": "The evaluation states that the large driven gear turns slowly.",
      "image": {
        "src": "/quiz-visuals/level1/sailboat.svg",
        "alt": "Small toothed gear driving a larger gear next to a sailboat."
      }
    },
    {
      "id": "sailboat-09",
      "topic": "coding-tasks",
      "learningSlide": 22,
      "prompt": "What display-related task is given for the programmed sailboat?",
      "choices": [
        "Show only one static colour forever",
        "Erase the display permanently",
        "Turn off the controller",
        "Show different symbols and run the program three times"
      ],
      "correctIndex": 3,
      "hint": "Think about the follow-up coding task using symbols.",
      "explanation": "Task 2 asks the boat to display different symbols and repeat the program three times."
    },
    {
      "id": "sailboat-10",
      "topic": "coding-tasks",
      "learningSlide": 24,
      "prompt": "What extra feature is suggested before the boat's motor starts?",
      "choices": [
        "A 3-2-1 countdown",
        "An automatic camera photograph",
        "A temperature alarm",
        "A new battery connector"
      ],
      "correctIndex": 0,
      "hint": "Recall the challenge that precedes motor motion.",
      "explanation": "The challenge suggests programming a '3-2-1' countdown before starting the motor."
    }
  ]
};
