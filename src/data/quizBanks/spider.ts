/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const spiderBank: QuizBank = {
  "projectId": "spider",
  "title": "Spider",
  "sourcePdfPath": "public/Level 1/Learning/Characters & Structures/Spider/Spider_PowerPoint- R.pdf",
  "sourcePageCount": 15,
  "questions": [
    {
      "id": "spider-01",
      "topic": "spider-design",
      "learningSlide": 6,
      "prompt": "How many legs does the spider model have on each side?",
      "choices": [
        "Two",
        "Three",
        "Four",
        "Five"
      ],
      "correctIndex": 1,
      "hint": "Count the legs described on one side, not the total.",
      "explanation": "The introduction says the model has three legs on the left and three on the right."
    },
    {
      "id": "spider-02",
      "topic": "spider-design",
      "learningSlide": 6,
      "prompt": "Which design principle is central to the spider robot lesson?",
      "choices": [
        "Left-right symmetry",
        "Random asymmetry",
        "Only circular motion",
        "Water displacement"
      ],
      "correctIndex": 0,
      "hint": "Think about the robot's two sides.",
      "explanation": "The model is introduced as a bilaterally symmetrical spider robot."
    },
    {
      "id": "spider-03",
      "topic": "bilateral-symmetry",
      "learningSlide": 6,
      "prompt": "What does 'bilaterally symmetrical' mean for the spider design?",
      "choices": [
        "The left and right sides correspond",
        "Every beam must be a different colour",
        "The model must have one leg",
        "Only the front can be seen"
      ],
      "correctIndex": 0,
      "hint": "Focus on the relationship between the two halves.",
      "explanation": "The lesson uses matching left and right sides as the spider's design principle."
    },
    {
      "id": "spider-04",
      "topic": "bilateral-symmetry",
      "learningSlide": 13,
      "prompt": "Which graphics principle are students asked to explain for the spider?",
      "choices": [
        "Symmetry",
        "Perspective drawing",
        "Colour blending",
        "Random spacing"
      ],
      "correctIndex": 0,
      "hint": "Recall the evaluation question about the robot's design.",
      "explanation": "The evaluation asks which graphical principle was used; the lesson teaches symmetry."
    },
    {
      "id": "spider-05",
      "topic": "axis-definition",
      "learningSlide": 8,
      "prompt": "What is the line called when folding a symmetrical figure so the halves coincide?",
      "choices": [
        "Axis of symmetry",
        "Gear axle",
        "Diagonal brace",
        "Rotation sensor"
      ],
      "correctIndex": 0,
      "hint": "Think about the fold line in the definition.",
      "explanation": "The teaching slide names that fold line the axis of symmetry."
    },
    {
      "id": "spider-06",
      "topic": "axis-definition",
      "learningSlide": 8,
      "prompt": "When is a plane figure symmetrical about a fold line?",
      "choices": [
        "When its two folded halves coincide",
        "When the halves are different sizes",
        "When it is drawn with many colours",
        "When it contains exactly three circles"
      ],
      "correctIndex": 0,
      "hint": "Recall the test using a fold.",
      "explanation": "The lesson defines symmetry by halves that match when folded on a line."
    },
    {
      "id": "spider-07",
      "topic": "symmetry-examples",
      "learningSlide": 8,
      "prompt": "Which shape is named as an axisymmetric figure?",
      "choices": [
        "Square",
        "Unequal scalene triangle",
        "Irregular scribble",
        "Open spiral"
      ],
      "correctIndex": 0,
      "hint": "The slide lists several familiar regular shapes.",
      "explanation": "A square is one of the examples of axisymmetric graphics."
    },
    {
      "id": "spider-08",
      "topic": "symmetry-examples",
      "learningSlide": 9,
      "prompt": "Which craft is listed as using symmetrical graphics?",
      "choices": [
        "Paper cutting",
        "Motor wiring",
        "Battery charging",
        "Audio recording"
      ],
      "correctIndex": 0,
      "hint": "Recall an everyday creative activity from the slide.",
      "explanation": "Paper cutting is one of the examples of symmetry in life."
    },
    {
      "id": "spider-09",
      "topic": "build-quality",
      "learningSlide": 11,
      "prompt": "Which goal appears in the spider assembly requirements?",
      "choices": [
        "Stable structure",
        "Uneven weight on purpose",
        "Mismatched body shape",
        "Loose legs"
      ],
      "correctIndex": 0,
      "hint": "Read the first part of the assembly checklist.",
      "explanation": "The task asks students to build a stable structure."
    },
    {
      "id": "spider-10",
      "topic": "build-quality",
      "learningSlide": 11,
      "prompt": "What else must the spider model's assembly consider?",
      "choices": [
        "Proper gravity and shape match",
        "Ignoring balance and shape",
        "Changing the project into a boat",
        "Leaving all pegs loose"
      ],
      "correctIndex": 0,
      "hint": "The checklist has three build-quality requirements.",
      "explanation": "It lists proper gravity and matching shape alongside stability."
    }
  ]
};
