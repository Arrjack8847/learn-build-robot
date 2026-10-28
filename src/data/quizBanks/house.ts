/** Based on the 16-page House Learning PDF text. Illustrations need visual QA. */
import type { QuizBank } from "../quizStudio";
export const houseBank: QuizBank = {
  "projectId": "house",
  "title": "House",
  "sourcePdfPath": "public/Level 1/Learning/Characters & Structures/House/House_Powerpoint.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "house-01",
      "topic": "light-path",
      "learningSlide": 9,
      "prompt": "How does light travel through a uniform medium such as air?",
      "choices": [
        "Always in a circle",
        "Only in a zigzag",
        "In a straight line",
        "Always along a spiral"
      ],
      "correctIndex": 2,
      "explanation": "The slide describes straight-line light propagation in a uniform medium.",
      "hint": "Think about a narrow beam crossing a room."
    },
    {
      "id": "house-02",
      "topic": "light-path",
      "learningSlide": 2,
      "prompt": "Which light concepts are listed among the House lesson's goals?",
      "choices": [
        "Reflection and refraction",
        "Speed and gear ratio",
        "Motor torque and current",
        "Altitude and pressure"
      ],
      "correctIndex": 0,
      "explanation": "The learning targets focus on how light travels, reflects and refracts.",
      "hint": "Recall the two ways light can change direction."
    },
    {
      "id": "house-03",
      "topic": "reflection",
      "learningSlide": 9,
      "prompt": "What is reflection of light?",
      "choices": [
        "Light being converted into sound",
        "A motor reversing its direction",
        "Light passing through every material without change",
        "Light changing direction and returning into its original medium"
      ],
      "correctIndex": 3,
      "explanation": "Slide 9 describes light returning after reaching an interface.",
      "hint": "Think of seeing a light beam bounce from a mirror."
    },
    {
      "id": "house-04",
      "topic": "reflection",
      "learningSlide": 9,
      "prompt": "Which term labels the incoming ray in the reflection diagram?",
      "choices": [
        "Reflected ray",
        "Incident ray",
        "Motor shaft",
        "Refracted medium"
      ],
      "correctIndex": 1,
      "explanation": "The diagram labels the incoming ray as the incident ray.",
      "hint": "Compare the incoming and outgoing rays at a reflecting surface."
    },
    {
      "id": "house-05",
      "topic": "refraction",
      "learningSlide": 10,
      "prompt": "What happens during refraction when light enters a different medium obliquely?",
      "choices": [
        "It becomes an electrical signal",
        "Its direction may change",
        "Its source disappears",
        "It must return to the first medium"
      ],
      "correctIndex": 1,
      "explanation": "The slide describes light bending at the boundary between materials.",
      "hint": "Think of a straw appearing bent in water."
    },
    {
      "id": "house-06",
      "topic": "refraction",
      "learningSlide": 10,
      "prompt": "Where does light change direction in the lesson's refraction explanation?",
      "choices": [
        "Inside a motor controller",
        "Only at the light source",
        "Only after reaching a mirror",
        "At the boundary between media"
      ],
      "correctIndex": 3,
      "explanation": "The refraction slide locates the change at the junction of different media.",
      "hint": "Think about where water and air meet."
    },
    {
      "id": "house-07",
      "topic": "project",
      "learningSlide": 7,
      "prompt": "What kind of model is built in this lesson?",
      "choices": [
        "A house",
        "A bicycle",
        "A traffic signal",
        "A robotic claw"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 introduces the house model as the building project.",
      "hint": "Think about a structure people can live inside."
    },
    {
      "id": "house-08",
      "topic": "project",
      "learningSlide": 15,
      "prompt": "What does the House homework ask students to add?",
      "choices": [
        "Another set of wheels",
        "A ball-tracking camera",
        "Household equipment",
        "A cutting blade"
      ],
      "correctIndex": 2,
      "explanation": "The homework asks students to renovate the house and add household equipment.",
      "hint": "Think about useful items placed inside a home."
    },
    {
      "id": "house-09",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "Which is required when assembling the House model?",
      "choices": [
        "Loose connections",
        "Unbalanced base",
        "Stable structure",
        "Random shape"
      ],
      "correctIndex": 2,
      "explanation": "The assembly checklist includes structural stability.",
      "hint": "Think about a model that can stand without collapsing."
    },
    {
      "id": "house-10",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "What should students check before finishing the House model?",
      "choices": [
        "That it has a racing motor",
        "That the shape matches the intended design",
        "That it plays MP3 files",
        "That it measures sound pressure"
      ],
      "correctIndex": 1,
      "explanation": "The checklist asks that the finished model match the intended shape.",
      "hint": "Compare your model with the planned house."
    }
  ]
};
