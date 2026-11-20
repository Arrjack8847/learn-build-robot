/** Derived from the supplied Level 2 Building PDF used as Learning fallback. Source uses a teacher guide plus illustrated construction steps. */
import type { QuizBank } from "../../quizStudio";
export const forkliftBank: QuizBank = {
  "projectId": "level-2-forklift",
  "title": "Forklift",
  "sourcePdfPath": "public/Forklift.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "forklift-01",
      "topic": "warehouse-task",
      "learningSlide": 4,
      "prompt": "Which warehouse problem is used to introduce a forklift?",
      "choices": [
        "Drawing road signs",
        "Sending letters",
        "Measuring river flow",
        "Putting heavy goods on high shelves"
      ],
      "correctIndex": 3,
      "explanation": "The Forklift teaching manual identifies this in its warehouse task lesson (page 4): putting heavy goods on high shelves.",
      "hint": "Think about the role of warehouse task in the model."
    },
    {
      "id": "forklift-02",
      "topic": "warehouse-task",
      "learningSlide": 4,
      "prompt": "Why is a forklift more suitable than lifting the goods by hand?",
      "choices": [
        "It removes all shelving",
        "It raises heavy items to high places",
        "It makes the goods invisible",
        "It weighs each barcode"
      ],
      "correctIndex": 1,
      "explanation": "The Forklift teaching manual identifies this in its warehouse task lesson (page 4): it raises heavy items to high places.",
      "hint": "Think about the role of warehouse task in the model."
    },
    {
      "id": "forklift-03",
      "topic": "lifting-structure",
      "learningSlide": 3,
      "prompt": "What structure must students build correctly?",
      "choices": [
        "A telescope",
        "A swing seat",
        "A rowing oar",
        "The forklift's lifting mechanism"
      ],
      "correctIndex": 3,
      "explanation": "The Forklift teaching manual identifies this in its lifting structure lesson (page 3): the forklift's lifting mechanism.",
      "hint": "Think about the role of lifting structure in the model."
    },
    {
      "id": "forklift-04",
      "topic": "lifting-structure",
      "learningSlide": 3,
      "prompt": "What provides the movement required to lift an item?",
      "choices": [
        "A music player",
        "The forklift's powered lift mechanism",
        "Only a flashing screen",
        "A paper diagram"
      ],
      "correctIndex": 1,
      "explanation": "The Forklift teaching manual identifies this in its lifting structure lesson (page 3): the forklift's powered lift mechanism.",
      "hint": "Think about the role of lifting structure in the model."
    },
    {
      "id": "forklift-05",
      "topic": "rack-and-gear",
      "learningSlide": 3,
      "prompt": "Which two mechanical parts must engage properly?",
      "choices": [
        "Lens and mirror",
        "Lamp and speaker",
        "Battery and camera only",
        "Rack and gear"
      ],
      "correctIndex": 3,
      "explanation": "The Forklift teaching manual identifies this in its rack and gear lesson (page 3): rack and gear.",
      "hint": "Think about the role of rack and gear in the model."
    },
    {
      "id": "forklift-06",
      "topic": "rack-and-gear",
      "learningSlide": 3,
      "prompt": "What principle is the rack-and-gear mechanism used to learn?",
      "choices": [
        "How to detect colors",
        "How gearing can drive a lifting structure",
        "How to focus sunlight",
        "How to transmit sound"
      ],
      "correctIndex": 1,
      "explanation": "The Forklift teaching manual identifies this in its rack and gear lesson (page 3): how gearing can drive a lifting structure.",
      "hint": "Think about the role of rack and gear in the model."
    },
    {
      "id": "forklift-07",
      "topic": "motor-program",
      "learningSlide": 3,
      "prompt": "Which motor concept is explicitly taught?",
      "choices": [
        "A windmill only",
        "A steam whistle",
        "Light refraction",
        "Closed-loop motor control"
      ],
      "correctIndex": 3,
      "explanation": "The Forklift teaching manual identifies this in its motor program lesson (page 3): closed-loop motor control.",
      "hint": "Think about the role of motor program in the model."
    },
    {
      "id": "forklift-08",
      "topic": "motor-program",
      "learningSlide": 3,
      "prompt": "Which type of program structure is part of the lesson?",
      "choices": [
        "A drawing without commands",
        "Sequential instructions",
        "No order at all",
        "A printed sign only"
      ],
      "correctIndex": 1,
      "explanation": "The Forklift teaching manual identifies this in its motor program lesson (page 3): sequential instructions.",
      "hint": "Think about the role of motor program in the model."
    },
    {
      "id": "forklift-09",
      "topic": "adjustments",
      "learningSlide": 5,
      "prompt": "What setting controls how quickly the forklift moves or lifts?",
      "choices": [
        "The classroom clock",
        "The display language",
        "The vehicle's paint",
        "Motor speed value"
      ],
      "correctIndex": 3,
      "explanation": "The Forklift teaching manual identifies this in its adjustments lesson (page 5): motor speed value.",
      "hint": "Think about the role of adjustments in the model."
    },
    {
      "id": "forklift-10",
      "topic": "adjustments",
      "learningSlide": 5,
      "prompt": "What two motions are adjusted in the hands-on activity?",
      "choices": [
        "Only sound level",
        "Lifting speed and travel speed",
        "Screen color and brightness",
        "Only steering-wheel angle"
      ],
      "correctIndex": 1,
      "explanation": "The Forklift teaching manual identifies this in its adjustments lesson (page 5): lifting speed and travel speed.",
      "hint": "Think about the role of adjustments in the model."
    }
  ]
};
