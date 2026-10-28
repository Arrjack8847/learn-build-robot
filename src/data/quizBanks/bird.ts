/** Questions based on Bird's original Learning PDF. */
import type { QuizBank } from "../quizStudio";
export const birdBank: QuizBank = {
  "projectId": "bird",
  "title": "Bird",
  "sourcePdfPath": "public/Level 1/Learning/Characters & Structures/Bird/Bird_PowerPoint-R.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "br1",
      "topic": "symmetry",
      "learningSlide": 6,
      "prompt": "What design principle helps balance the Bird Robot's two sides?",
      "choices": [
        "Different weights on each side",
        "One unsupported wing",
        "Left-right symmetry",
        "A spinning motor"
      ],
      "correctIndex": 2,
      "explanation": "The PDF says the model uses symmetry to balance both sides.",
      "hint": "Think about matching opposite sides."
    },
    {
      "id": "br2",
      "topic": "symmetry",
      "learningSlide": 6,
      "prompt": "What should students try to keep balanced when building the Bird Robot?",
      "choices": [
        "Both sides of the bird",
        "Only the left wing",
        "Only the tail",
        "Only the beak"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 emphasizes balancing both sides of the robot.",
      "hint": "Picture two sides around a middle support."
    },
    {
      "id": "br3",
      "topic": "gravity",
      "learningSlide": 8,
      "prompt": "For an object to remain balanced, where should its center of gravity fall?",
      "choices": [
        "Outside its base",
        "Above every possible support",
        "At the tip of one wing",
        "Within its support area or fulcrum"
      ],
      "correctIndex": 3,
      "explanation": "The slide states that the center of gravity must be supported by the base or fulcrum.",
      "hint": "Consider where an object's weight acts relative to its support."
    },
    {
      "id": "br4",
      "topic": "gravity",
      "learningSlide": 8,
      "prompt": "According to the lesson, what happens when the center of gravity is lower?",
      "choices": [
        "The object automatically flies",
        "Balance is more stable",
        "Weight disappears",
        "The support point vanishes"
      ],
      "correctIndex": 1,
      "explanation": "The lesson says a lower center of gravity increases stability.",
      "hint": "Imagine comparing a tall model with one whose weight is lower."
    },
    {
      "id": "br5",
      "topic": "balance-toy",
      "learningSlide": 5,
      "prompt": "Which part of the balancing bird toy can rest on a finger?",
      "choices": [
        "Its tail",
        "Its beak",
        "Its wingtip",
        "Its foot"
      ],
      "correctIndex": 1,
      "explanation": "The introduction describes the toy balancing on its mouth or beak.",
      "hint": "Think about its small point of contact."
    },
    {
      "id": "br6",
      "topic": "balance-toy",
      "learningSlide": 5,
      "prompt": "What property makes the balancing bird toy interesting?",
      "choices": [
        "It flies using batteries",
        "It changes colors automatically",
        "It rolls on wheels",
        "It stays balanced on a small support"
      ],
      "correctIndex": 3,
      "explanation": "The toy can balance on a fingertip.",
      "hint": "Picture a large object resting on a small point."
    },
    {
      "id": "br7",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "Which assembly requirement is listed for the Bird Robot?",
      "choices": [
        "Stable structure",
        "Maximum motor speed",
        "Extra gear teeth",
        "Sound recognition"
      ],
      "correctIndex": 0,
      "explanation": "Slide 12 includes stability in its requirements.",
      "hint": "Think about preventing the model from tipping."
    },
    {
      "id": "br8",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "What should be positioned properly during assembly?",
      "choices": [
        "A camera's GPS signal",
        "An MP3 recording",
        "The center of gravity",
        "A temperature value"
      ],
      "correctIndex": 2,
      "explanation": "The assembly checklist asks for proper gravity positioning.",
      "hint": "Think about where the model's weight is concentrated."
    },
    {
      "id": "br9",
      "topic": "real-world",
      "learningSlide": 10,
      "prompt": "Which activity is shown as an example of balance?",
      "choices": [
        "Reading a pressure gauge",
        "Taking a camera photo",
        "Walking on a wire",
        "Playing a song"
      ],
      "correctIndex": 2,
      "explanation": "Slide 10 names walking a wire as an example.",
      "hint": "Think about maintaining balance on a narrow support."
    },
    {
      "id": "br10",
      "topic": "real-world",
      "learningSlide": 15,
      "prompt": "What does the homework ask students to observe?",
      "choices": [
        "Only motor speed",
        "Center of gravity and balance in everyday life",
        "Only sound levels",
        "Only computer memory"
      ],
      "correctIndex": 1,
      "explanation": "The homework asks for real-life examples of balance and center of gravity.",
      "hint": "Think about objects around you that remain upright."
    }
  ]
};
