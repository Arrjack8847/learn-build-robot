/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const dynamicScreenBank: QuizBank = {
  "projectId": "dynamic-screen",
  "title": "Dynamic Screen",
  "sourcePdfPath": "public/Level 1/Learning/Manipulators/Dynamic screen.pdf",
  "sourcePageCount": 13,
  "questions": [
    {
      "id": "dynamic-screen-01",
      "topic": "cartoon-history",
      "learningSlide": 3,
      "prompt": "Which cartoon is named in the lesson's introduction?",
      "choices": [
        "Gertie the Dinosaur",
        "The Lion King",
        "Frozen",
        "Finding Nemo"
      ],
      "correctIndex": 0,
      "hint": "Recall the early animated example on the slide.",
      "explanation": "The source names 'Gertie the Dinosaur' as an early cartoon."
    },
    {
      "id": "dynamic-screen-02",
      "topic": "cartoon-history",
      "learningSlide": 3,
      "prompt": "Approximately how many pictures does the lesson associate with that cartoon?",
      "choices": [
        "10,000",
        "24",
        "100",
        "300"
      ],
      "correctIndex": 0,
      "hint": "Look for the picture count on the history slide.",
      "explanation": "The lesson says the cartoon was presented with 10,000 pictures."
    },
    {
      "id": "dynamic-screen-03",
      "topic": "animation-technique",
      "learningSlide": 4,
      "prompt": "What happens when drawings of different actions are flipped quickly?",
      "choices": [
        "They appear to move",
        "They erase one another",
        "Their colours all disappear",
        "They automatically become three-dimensional"
      ],
      "correctIndex": 0,
      "hint": "Imagine a flipbook.",
      "explanation": "The lesson says quickly flipping action drawings makes a character appear to come alive."
    },
    {
      "id": "dynamic-screen-04",
      "topic": "animation-technique",
      "learningSlide": 4,
      "prompt": "Which simple tool is suggested to explore how cartoons appear animated?",
      "choices": [
        "A book of sequential drawings",
        "A metal gearbox",
        "An ultrasonic distance meter",
        "A windmill model"
      ],
      "correctIndex": 0,
      "hint": "Think about the hands-on example in exploration.",
      "explanation": "The lesson demonstrates animation by rapidly flipping drawings in a book."
    },
    {
      "id": "dynamic-screen-05",
      "topic": "vision-effect",
      "learningSlide": 5,
      "prompt": "What name does the lesson give to the visual effect of rapidly shown still pictures?",
      "choices": [
        "Persistence of vision",
        "Gear reduction",
        "Buoyancy",
        "Mechanical resonance"
      ],
      "correctIndex": 0,
      "hint": "Recall the effect named after the flipbook demonstration.",
      "explanation": "The lesson calls the perceived moving picture 'persistence of vision'."
    },
    {
      "id": "dynamic-screen-06",
      "topic": "vision-effect",
      "learningSlide": 6,
      "prompt": "According to the lesson, how long can an image linger in the eye after it disappears?",
      "choices": [
        "About 0.1–0.4 seconds",
        "About 10 minutes",
        "Exactly 30 seconds",
        "More than an hour"
      ],
      "correctIndex": 0,
      "hint": "Recall the short interval cited for the vision effect.",
      "explanation": "The source gives a range of roughly 0.1 to 0.4 seconds."
    },
    {
      "id": "dynamic-screen-07",
      "topic": "frames-and-film",
      "learningSlide": 7,
      "prompt": "How many still photos per second does the lesson use as a typical movie example?",
      "choices": [
        "24",
        "2",
        "1200",
        "1"
      ],
      "correctIndex": 0,
      "hint": "Think about the sample frame rate introduced.",
      "explanation": "The slide says a one-second movie usually has 24 still photos."
    },
    {
      "id": "dynamic-screen-08",
      "topic": "frames-and-film",
      "learningSlide": 7,
      "prompt": "What are movies composed of according to the lesson?",
      "choices": [
        "Many still photos displayed in sequence",
        "Only live moving mechanical parts",
        "A single unchanging picture",
        "Only recorded music"
      ],
      "correctIndex": 0,
      "hint": "Think about the individual images behind motion.",
      "explanation": "The lesson explains that films are built from a sequence of still photos."
    },
    {
      "id": "dynamic-screen-09",
      "topic": "screen-programming",
      "learningSlide": 9,
      "prompt": "Where can students draw a custom pattern for the project?",
      "choices": [
        "Emotion screen customization",
        "Motor gear settings",
        "Charging-menu setup",
        "Ultrasonic measuring mode"
      ],
      "correctIndex": 0,
      "hint": "Recall the software feature used to design a screen image.",
      "explanation": "The coding slide says patterns can be made in emotion screen customization."
    },
    {
      "id": "dynamic-screen-10",
      "topic": "screen-programming",
      "learningSlide": 13,
      "prompt": "What screen effect is suggested as an extension task?",
      "choices": [
        "Move graphics from the screen on port 1 to the screen on port 2",
        "Disconnect both screens",
        "Replace the screens with wheels",
        "Use the screen as a battery"
      ],
      "correctIndex": 0,
      "hint": "The extension describes images passing from one display to another.",
      "explanation": "The show challenge suggests a scrolling effect from the port 1 screen to the port 2 screen."
    }
  ]
};
