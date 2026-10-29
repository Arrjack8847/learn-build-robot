/**
 * Grounded in the official Pullback Bicycle teaching PDF text, with 1-based pages.
 * Requires visual page and educator review before registration for students.
 */
import type { QuizBank } from "../../quizStudio";

export const pullbackBicycleBank: QuizBank = {
  "projectId": "pullback-bicycle",
  "title": "Pullback Bicycle",
  "sourcePdfPath": "public/Pullback Bicycle.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "pullback-bicycle-01",
      "topic": "motion-goal",
      "learningSlide": 4,
      "prompt": "What movement problem does the Pullback Bicycle lesson explore?",
      "choices": [
        "Making a bicycle toy move without pedalling",
        "Making a boat float",
        "Making a clock show time",
        "Making a lamp change colours"
      ],
      "correctIndex": 0,
      "hint": "Think about what happens after a pullback toy is released.",
      "explanation": "The lesson asks how a bicycle can move without a person pedalling it."
    },
    {
      "id": "pullback-bicycle-02",
      "topic": "motion-goal",
      "learningSlide": 4,
      "prompt": "Which familiar toy is used as a clue for this project?",
      "choices": [
        "A pullback toy vehicle",
        "A toy telescope",
        "A toy piano",
        "A puzzle cube"
      ],
      "correctIndex": 0,
      "hint": "Recall the example of toys that move after you pull them back.",
      "explanation": "The topic introduction asks students about pullback toy vehicles."
    },
    {
      "id": "pullback-bicycle-03",
      "topic": "rubber-band-elasticity",
      "learningSlide": 3,
      "prompt": "Which material provides the elastic force studied in this project?",
      "choices": [
        "Rubber band",
        "Glass sheet",
        "Paper label",
        "Metal speaker"
      ],
      "correctIndex": 0,
      "hint": "Think of a material that stretches and springs back.",
      "explanation": "The teaching objectives specifically name the elastic force of a rubber band."
    },
    {
      "id": "pullback-bicycle-04",
      "topic": "rubber-band-elasticity",
      "learningSlide": 5,
      "prompt": "Which physical idea helps explain why the model can move after being pulled back?",
      "choices": [
        "Elastic force",
        "Colour mixing",
        "Sound reflection",
        "Magnetic north"
      ],
      "correctIndex": 0,
      "hint": "Think about what happens to a stretched band when it is released.",
      "explanation": "The lesson explains the bicycle's movement using a rubber band's elastic force."
    },
    {
      "id": "pullback-bicycle-05",
      "topic": "gear-driven-movement",
      "learningSlide": 3,
      "prompt": "Which mechanism works with the rubber band in this model?",
      "choices": [
        "Gear drive",
        "Light sensor",
        "Fan belt from an air conditioner",
        "Digital screen"
      ],
      "correctIndex": 0,
      "hint": "Think about the toothed components that pass motion.",
      "explanation": "The lesson lists gear-driven motion as a teaching objective."
    },
    {
      "id": "pullback-bicycle-06",
      "topic": "gear-driven-movement",
      "learningSlide": 5,
      "prompt": "What two ideas are used together to make the pullback bicycle move?",
      "choices": [
        "Rubber-band elasticity and gear drive",
        "Sunlight and a camera",
        "Air pressure and a microphone",
        "Water flow and an LED"
      ],
      "correctIndex": 0,
      "hint": "One provides elastic force; the other transfers motion.",
      "explanation": "The review explicitly names the rubber band's elastic force together with gear drive."
    },
    {
      "id": "pullback-bicycle-07",
      "topic": "connection-parts",
      "learningSlide": 3,
      "prompt": "What small joining parts are called out in the assembly difficulties?",
      "choices": [
        "Pins",
        "Paper clips for books",
        "Headphones",
        "Camera cards"
      ],
      "correctIndex": 0,
      "hint": "Think about the pieces that connect beams in a model.",
      "explanation": "The lesson stresses the connection of pins during the bicycle's assembly."
    },
    {
      "id": "pullback-bicycle-08",
      "topic": "connection-parts",
      "learningSlide": 3,
      "prompt": "What should you check about the rubber band during assembly?",
      "choices": [
        "That it is securely fixed as intended",
        "That it changes colour",
        "That it can display text",
        "That it makes a loud sound"
      ],
      "correctIndex": 0,
      "hint": "The lesson names a particular attachment challenge.",
      "explanation": "The key points explicitly include fixing the rubber band correctly."
    },
    {
      "id": "pullback-bicycle-09",
      "topic": "design-and-explain",
      "learningSlide": 4,
      "prompt": "What should a student plan before building the Pullback Bicycle?",
      "choices": [
        "Its shape and the needed pieces",
        "A train timetable",
        "The colour of the classroom wall",
        "The next school holiday"
      ],
      "correctIndex": 0,
      "hint": "Think about the drawing and parts-selection questions.",
      "explanation": "The planning section asks students to design the bicycle and choose building pieces."
    },
    {
      "id": "pullback-bicycle-10",
      "topic": "design-and-explain",
      "learningSlide": 5,
      "prompt": "What is the best explanation of how the completed pullback bicycle works?",
      "choices": [
        "The rubber band supplies elastic force and gears transmit motion",
        "The wheels move only because of a camera",
        "A bright light makes it travel",
        "The computer screen pushes it forward"
      ],
      "correctIndex": 0,
      "hint": "Combine the two mechanisms named in the lesson summary.",
      "explanation": "The outcome instructions ask students to explain the rubber band's elastic force and the gear drive together."
    }
  ]
};
