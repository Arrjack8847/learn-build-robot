/**
 * Draft based on official Balanced Bird teaching PDF page text.
 * Teacher visual and educational review required before publication.
 */
import type { QuizBank } from "../../quizStudio";

export const balancedBirdBank: QuizBank = {
  "projectId": "balanced-bird",
  "title": "Balanced Bird",
  "sourcePdfPath": "public/Balanced Bird.pdf",
  "sourcePageCount": 12,
  "questions": [
    {
      "id": "balanced-bird-01",
      "topic": "centre-of-gravity",
      "learningSlide": 3,
      "prompt": "Which concept helps explain a balancing bird's weight distribution?",
      "choices": [
        "Computer memory",
        "Centre of gravity",
        "Screen brightness",
        "Sound level"
      ],
      "correctIndex": 1,
      "hint": "Think about where a model's weight is centred.",
      "explanation": "Centre of gravity is explicitly named as a core concept in the Balanced Bird lesson."
    },
    {
      "id": "balanced-bird-02",
      "topic": "centre-of-gravity",
      "learningSlide": 5,
      "prompt": "What idea should you mention when explaining how the bird stays balanced?",
      "choices": [
        "Centre of gravity",
        "Electric current",
        "Light colour",
        "Robot programming"
      ],
      "correctIndex": 0,
      "hint": "Recall the weight-related idea in the lesson presentation.",
      "explanation": "The assessment names centre of gravity when asking students to explain the balanced model."
    },
    {
      "id": "balanced-bird-03",
      "topic": "fulcrum",
      "learningSlide": 3,
      "prompt": "What is the name for a support point in a balancing structure?",
      "choices": [
        "Battery",
        "Motor",
        "Display",
        "Fulcrum"
      ],
      "correctIndex": 3,
      "hint": "It is one of the lesson's three main balance words.",
      "explanation": "Fulcrum is explicitly listed among the principles to understand."
    },
    {
      "id": "balanced-bird-04",
      "topic": "fulcrum",
      "learningSlide": 3,
      "prompt": "Which term from the lesson is most closely connected to where a balanced object rests?",
      "choices": [
        "Thermometer",
        "Speaker",
        "Fulcrum",
        "Keyboard"
      ],
      "correctIndex": 2,
      "hint": "Look for the word that describes a support point.",
      "explanation": "The lesson teaches the fulcrum as part of the balancing structure."
    },
    {
      "id": "balanced-bird-05",
      "topic": "leverage",
      "learningSlide": 3,
      "prompt": "Which simple mechanical principle is highlighted in the bird model?",
      "choices": [
        "Infrared sensing",
        "Leverage",
        "Camera focus",
        "Audio recording"
      ],
      "correctIndex": 1,
      "hint": "Think about a structure balancing around a support.",
      "explanation": "The lesson highlights understanding the principle of leverage."
    },
    {
      "id": "balanced-bird-06",
      "topic": "leverage",
      "learningSlide": 5,
      "prompt": "Which principle does the final lesson review name alongside centre of gravity?",
      "choices": [
        "Leverage",
        "Bluetooth pairing",
        "Static electricity",
        "Laser scanning"
      ],
      "correctIndex": 0,
      "hint": "Recall the two ideas in the final demonstration.",
      "explanation": "The lesson's display-of-outcomes notes ask students to mention leverage and centre of gravity."
    },
    {
      "id": "balanced-bird-07",
      "topic": "design-pieces",
      "learningSlide": 4,
      "prompt": "Before building, what should students design for their Balanced Bird?",
      "choices": [
        "A weather map",
        "A music playlist",
        "A video game",
        "Its shape"
      ],
      "correctIndex": 3,
      "hint": "Think about drawing a planned model first.",
      "explanation": "The design discussion asks students to draw their own Balanced Bird."
    },
    {
      "id": "balanced-bird-08",
      "topic": "design-pieces",
      "learningSlide": 4,
      "prompt": "What should students decide while planning the bird model?",
      "choices": [
        "How fast to type",
        "Which colour a monitor should be",
        "Which structural pieces to use",
        "Which song to sing"
      ],
      "correctIndex": 2,
      "hint": "Think about selecting components before building.",
      "explanation": "The teacher asks what pieces could be used to build the Balanced Bird."
    },
    {
      "id": "balanced-bird-09",
      "topic": "reflect-and-present",
      "learningSlide": 5,
      "prompt": "When showing a finished Balanced Bird, what is the most useful thing to explain?",
      "choices": [
        "What TV show to watch",
        "Why it stays balanced",
        "How many days remain in the year",
        "Where the nearest shop is"
      ],
      "correctIndex": 1,
      "hint": "Think about the science behind the model.",
      "explanation": "The assessment and presentation notes focus on explaining the balancing principle."
    },
    {
      "id": "balanced-bird-10",
      "topic": "reflect-and-present",
      "learningSlide": 5,
      "prompt": "Which pair of concepts best explains what students learned by building the bird?",
      "choices": [
        "Leverage and centre of gravity",
        "Heat and light",
        "Sound and music",
        "Coding and internet"
      ],
      "correctIndex": 0,
      "hint": "Both ideas are named in the hands-on review.",
      "explanation": "The final activity asks students to explain the model using leverage and centre of gravity."
    }
  ]
};
