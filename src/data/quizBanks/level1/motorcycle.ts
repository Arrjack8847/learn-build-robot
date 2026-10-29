/**
 * Level 1 question bank checked against official lesson PDF extracted page text.
 * No diagram-dependent claims without visual QA. Unregistered content draft.
 */
import type { QuizBank } from "../../quizStudio";

export const motorcycleBank: QuizBank = {
  "projectId": "motorcycle",
  "title": "Motorcycle",
  "sourcePdfPath": "public/Level 1/Learning/Vehicles & Complex Movers/Motorcycle/Motorcycle_Powerpoint.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "motorcycle-01",
      "topic": "motorcycle-context",
      "learningSlide": 6,
      "prompt": "What does the motorcycle lesson say wheels help people do?",
      "choices": [
        "Stop all motion",
        "Float without contact",
        "Travel with less effort than walking",
        "Eliminate every force"
      ],
      "correctIndex": 2,
      "hint": "Recall the reason given for using wheels.",
      "explanation": "The introduction says using wheels can save effort compared with walking."
    },
    {
      "id": "motorcycle-02",
      "topic": "motorcycle-context",
      "learningSlide": 6,
      "prompt": "Which motorcycle wheel configurations does the lesson mention?",
      "choices": [
        "Only one-wheel",
        "Only six-wheel",
        "Only eight-wheel",
        "Two-wheeled and three-wheeled"
      ],
      "correctIndex": 3,
      "hint": "Think about the number of wheels described.",
      "explanation": "The source mentions both two- and three-wheeled motorcycles."
    },
    {
      "id": "motorcycle-03",
      "topic": "force-definition",
      "learningSlide": 8,
      "prompt": "How is force defined in the lesson?",
      "choices": [
        "Interaction between objects",
        "A type of colour sensor",
        "A robot's stored program",
        "Only the weight of a battery"
      ],
      "correctIndex": 0,
      "hint": "Consider what happens when one object pushes another.",
      "explanation": "The lesson defines force as interaction between objects."
    },
    {
      "id": "motorcycle-04",
      "topic": "force-definition",
      "learningSlide": 5,
      "prompt": "Which unit is used to measure force magnitude?",
      "choices": [
        "Watt-hour (Wh)",
        "Newton (N)",
        "Second (s)",
        "Metre (m)"
      ],
      "correctIndex": 1,
      "hint": "Recall the scientific unit mentioned after pushing a box.",
      "explanation": "The lesson uses newtons to quantify force."
    },
    {
      "id": "motorcycle-05",
      "topic": "force-effects",
      "learningSlide": 8,
      "prompt": "What may force cause an object to do?",
      "choices": [
        "Always disappear",
        "Always keep its original motion",
        "Accelerate or deform",
        "Only change colour"
      ],
      "correctIndex": 2,
      "hint": "The lesson identifies two possible physical effects.",
      "explanation": "It states force can cause acceleration or deformation."
    },
    {
      "id": "motorcycle-06",
      "topic": "force-effects",
      "learningSlide": 9,
      "prompt": "What is given as a reason a sliding object slows down?",
      "choices": [
        "Light from the controller",
        "A display image",
        "A battery label",
        "Friction"
      ],
      "correctIndex": 3,
      "hint": "Think about contact resisting movement.",
      "explanation": "The lesson says friction can slow a sliding object until it stops."
    },
    {
      "id": "motorcycle-07",
      "topic": "force-elements",
      "learningSlide": 10,
      "prompt": "Which three elements determine the effect of a force?",
      "choices": [
        "Magnitude, direction, point of action",
        "Colour, temperature, sound",
        "Length, width, font",
        "Speed, battery, program"
      ],
      "correctIndex": 0,
      "hint": "Recall the three listed characteristics of an applied force.",
      "explanation": "The slide names magnitude, direction and point of action."
    },
    {
      "id": "motorcycle-08",
      "topic": "force-elements",
      "learningSlide": 10,
      "prompt": "What does the point of action of a force describe?",
      "choices": [
        "The colour of a gear",
        "Where the force acts on the object",
        "How bright the object looks",
        "The robot's stored filename"
      ],
      "correctIndex": 1,
      "hint": "Think about applying the same push at different locations.",
      "explanation": "The point of action specifies the location where the force is applied."
    },
    {
      "id": "motorcycle-09",
      "topic": "force-types-and-construction",
      "learningSlide": 11,
      "prompt": "Which force is listed in the motorcycle lesson?",
      "choices": [
        "Sound output",
        "Screen colour",
        "Gravity",
        "Computer memory"
      ],
      "correctIndex": 2,
      "hint": "The list groups forces by physical nature.",
      "explanation": "The lesson lists gravity, elastic force and friction."
    },
    {
      "id": "motorcycle-10",
      "topic": "force-types-and-construction",
      "learningSlide": 13,
      "prompt": "Which task is part of assembling the motorcycle model?",
      "choices": [
        "Disconnect every part",
        "Ignore the shape completely",
        "Make the beams deliberately loose",
        "Make the structure stable with appropriate balance"
      ],
      "correctIndex": 3,
      "hint": "Recall the building-practice quality checklist.",
      "explanation": "The construction checklist calls for a stable structure, proper gravity and matching shape."
    }
  ]
};
