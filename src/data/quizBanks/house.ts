/** Questions based on House's original Learning PDF. */
import type { QuizBank } from "../quizStudio";
export const houseBank: QuizBank = {
  "projectId": "house",
  "title": "House",
  "sourcePdfPath": "public/Level 1/Learning/Characters & Structures/House/House_Powerpoint.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "hs1",
      "topic": "light-travel",
      "learningSlide": 9,
      "prompt": "How does light travel in a uniform medium such as air, according to the lesson?",
      "choices": [
        "In random loops",
        "Only downward",
        "In straight lines",
        "Only around corners"
      ],
      "correctIndex": 2,
      "explanation": "Slide 9 describes straight-line propagation in a homogeneous medium.",
      "hint": "Think about a beam traveling through uniform air."
    },
    {
      "id": "hs2",
      "topic": "light-travel",
      "learningSlide": 2,
      "prompt": "What subject is a main learning goal in the House lesson?",
      "choices": [
        "Light propagation",
        "Motor coding only",
        "Gear speed ratios",
        "Sound sensing"
      ],
      "correctIndex": 0,
      "explanation": "Slide 2 lists how light travels among the learning goals.",
      "hint": "Recall the main science topic before the model is built."
    },
    {
      "id": "hs3",
      "topic": "reflection",
      "learningSlide": 9,
      "prompt": "What happens in reflection?",
      "choices": [
        "Light stops existing",
        "Light becomes a motor signal",
        "Light always changes color",
        "Light returns into the original medium"
      ],
      "correctIndex": 3,
      "explanation": "The lesson defines reflection as light returning to its original material at an interface.",
      "hint": "Picture a beam bouncing back from a surface."
    },
    {
      "id": "hs4",
      "topic": "reflection",
      "learningSlide": 9,
      "prompt": "Which ray is shown leaving a reflecting surface?",
      "choices": [
        "Incident ray",
        "Reflected ray",
        "Normal line",
        "Motor shaft"
      ],
      "correctIndex": 1,
      "explanation": "The diagram labels the reflected ray leaving the surface.",
      "hint": "Compare the incoming and outgoing light rays."
    },
    {
      "id": "hs5",
      "topic": "refraction",
      "learningSlide": 10,
      "prompt": "What causes refraction when light crosses from one medium into another at an angle?",
      "choices": [
        "A fixed motor speed",
        "A change in direction at the boundary",
        "A stronger sound signal",
        "A change in the object's weight"
      ],
      "correctIndex": 1,
      "explanation": "The slide explains that refraction bends the light's path across different media.",
      "hint": "Think about a light beam crossing a material boundary."
    },
    {
      "id": "hs6",
      "topic": "refraction",
      "learningSlide": 10,
      "prompt": "Which two media could demonstrate refraction?",
      "choices": [
        "Two identical areas of air",
        "Two parts of one mirror",
        "Two equal beams of metal",
        "Air and water"
      ],
      "correctIndex": 3,
      "explanation": "The concept involves light passing between different media.",
      "hint": "Think about moving from one transparent material to another."
    },
    {
      "id": "hs7",
      "topic": "house-design",
      "learningSlide": 7,
      "prompt": "What kind of model does the House lesson ask students to build?",
      "choices": [
        "A house",
        "A race car",
        "A helicopter",
        "A robotic claw"
      ],
      "correctIndex": 0,
      "explanation": "The introduction names a house robot.",
      "hint": "Think about a building where people live."
    },
    {
      "id": "hs8",
      "topic": "house-design",
      "learningSlide": 7,
      "prompt": "According to the lesson, what is a house commonly used for?",
      "choices": [
        "Underwater travel",
        "Flying above clouds",
        "Human living and activities",
        "Storing engine fuel only"
      ],
      "correctIndex": 2,
      "explanation": "Slide 7 defines a house as a building for living or activities.",
      "hint": "Think about ordinary uses of buildings."
    },
    {
      "id": "hs9",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "Which requirement appears in the House lesson's assembly checklist?",
      "choices": [
        "No supporting frame",
        "Loose foundations",
        "Stable structure",
        "A rotating platform"
      ],
      "correctIndex": 2,
      "explanation": "Slide 12 includes stable structure.",
      "hint": "Think about preventing a model house from collapsing."
    },
    {
      "id": "hs10",
      "topic": "assembly",
      "learningSlide": 15,
      "prompt": "What improvement does the homework suggest for the model house?",
      "choices": [
        "Remove every wall",
        "Add household equipment",
        "Convert it into a boat",
        "Make the roof spin"
      ],
      "correctIndex": 1,
      "explanation": "The homework invites students to renovate the house and add equipment.",
      "hint": "Think about furnishing the model after assembly."
    }
  ]
};
