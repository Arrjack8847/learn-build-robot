/**
 * Grounded in the official Little Owl teaching PDF text, with 1-based pages.
 * Requires visual page and educator review before registration for students.
 */
import type { QuizBank } from "../../quizStudio";

export const littleOwlBank: QuizBank = {
  "projectId": "little-owl",
  "title": "Little Owl",
  "sourcePdfPath": "public/Little Owl.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "little-owl-01",
      "topic": "owl-observation",
      "learningSlide": 4,
      "prompt": "When does the owl in the lesson go looking for food?",
      "choices": [
        "At night",
        "Only at midday",
        "When a clock beeps",
        "When a fan turns on"
      ],
      "correctIndex": 0,
      "hint": "Remember the clue about the helpful bird's hunting time.",
      "explanation": "The introductory story describes an owl that hunts at night."
    },
    {
      "id": "little-owl-02",
      "topic": "owl-observation",
      "learningSlide": 4,
      "prompt": "What does the story say the owl usually does in the daytime?",
      "choices": [
        "Sails",
        "Drives a car",
        "Draws a picture",
        "Sleeps"
      ],
      "correctIndex": 3,
      "hint": "Think about the opposite of its nighttime activity.",
      "explanation": "The story contrasts hunting at night with sleeping during the day."
    },
    {
      "id": "little-owl-03",
      "topic": "model-design",
      "learningSlide": 4,
      "prompt": "What moving part should students plan when designing their owl robot?",
      "choices": [
        "A boat sail",
        "A clock hand",
        "A car windshield",
        "Its wings"
      ],
      "correctIndex": 3,
      "hint": "Think about what moves on a bird.",
      "explanation": "The design questions ask how to make the owl's wings swing."
    },
    {
      "id": "little-owl-04",
      "topic": "model-design",
      "learningSlide": 4,
      "prompt": "What should you decide before building the owl?",
      "choices": [
        "How to make a paper boat float",
        "How many pages to print",
        "Which pieces can make its shape",
        "How to program a traffic light"
      ],
      "correctIndex": 2,
      "hint": "Think about choosing building components to match a design.",
      "explanation": "The planning section asks which pieces can be used to build an owl."
    },
    {
      "id": "little-owl-05",
      "topic": "linkage",
      "learningSlide": 3,
      "prompt": "Which mechanical connection is listed as a building challenge for the owl?",
      "choices": [
        "An LCD image file",
        "A thermometer sensor",
        "Linkage connection",
        "A USB charging adapter"
      ],
      "correctIndex": 2,
      "hint": "Look for a connection between moving mechanical parts.",
      "explanation": "The lesson's key points explicitly include connecting a linkage."
    },
    {
      "id": "little-owl-06",
      "topic": "linkage",
      "learningSlide": 5,
      "prompt": "What mechanism does the lesson ask about when explaining moving owl wings?",
      "choices": [
        "Wireless charging",
        "Linkage",
        "Barcode scanning",
        "Water filtration"
      ],
      "correctIndex": 1,
      "hint": "It uses connected moving parts rather than a stationary decoration.",
      "explanation": "The lesson review asks whether the moving owl wings use a linkage."
    },
    {
      "id": "little-owl-07",
      "topic": "gear-driven-motion",
      "learningSlide": 5,
      "prompt": "Which structure is explained in the owl's hands-on lesson?",
      "choices": [
        "A sound recording system",
        "Gearing structure",
        "A light-sensitive curtain",
        "A camera circuit"
      ],
      "correctIndex": 1,
      "hint": "Think about how motion can be transmitted between turning parts.",
      "explanation": "The hands-on notes explicitly ask teachers to explain the gearing structure."
    },
    {
      "id": "little-owl-08",
      "topic": "gear-driven-motion",
      "learningSlide": 3,
      "prompt": "What idea should you understand to explain how the owl's wing motion is driven?",
      "choices": [
        "A mechanical drive principle",
        "The difference between colours",
        "The shape of a computer icon",
        "The time of sunset"
      ],
      "correctIndex": 0,
      "hint": "Look for the word 'driven' in the learning goals.",
      "explanation": "The lesson lists understanding and applying the driven principle as an objective."
    },
    {
      "id": "little-owl-09",
      "topic": "wing-movement",
      "learningSlide": 4,
      "prompt": "Which kind of movement is the owl model meant to demonstrate?",
      "choices": [
        "Wings swinging",
        "A boat sinking",
        "Lights flashing in sequence",
        "A wheel staying still"
      ],
      "correctIndex": 0,
      "hint": "Imagine the movement students want to see in the bird.",
      "explanation": "The design discussion specifically asks how to make the owl's wings swing."
    },
    {
      "id": "little-owl-10",
      "topic": "wing-movement",
      "learningSlide": 5,
      "prompt": "After building the owl, what should you be able to explain?",
      "choices": [
        "How to take a photograph",
        "How to connect a weather station",
        "How to type an email",
        "How its wings are made to swing"
      ],
      "correctIndex": 3,
      "hint": "Recall the question in the presentation section.",
      "explanation": "Students are asked to explain how linkage and the drive make the owl wings swing."
    }
  ]
};
