/** Questions based on Funny Cat's original Learning PDF. */
import type { QuizBank } from "../quizStudio";
export const funnyCatBank: QuizBank = {
  "projectId": "funny-cat",
  "title": "Funny Cat",
  "sourcePdfPath": "public/Level 1/Learning/Biomimicry/Funny cat.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "fc1",
      "topic": "cat-anatomy",
      "learningSlide": 4,
      "prompt": "What helps a cat walk quietly?",
      "choices": [
        "A metal frame",
        "Large hard wheels",
        "Thick, cushioning foot pads",
        "A loud motor"
      ],
      "correctIndex": 2,
      "explanation": "The PDF explains that the cat's thick and elastic paw pads cushion its steps.",
      "hint": "Remember which part touches the ground."
    },
    {
      "id": "fc2",
      "topic": "cat-anatomy",
      "learningSlide": 5,
      "prompt": "What parts simulate the cat's paws in the model?",
      "choices": [
        "Tires",
        "Gears",
        "Motors",
        "Sensors"
      ],
      "correctIndex": 0,
      "explanation": "The lesson says tires simulate soft paws.",
      "hint": "Think about a round rubber part."
    },
    {
      "id": "fc3",
      "topic": "leg-mechanism",
      "learningSlide": 5,
      "prompt": "Which mechanism imitates the cat's leg motion?",
      "choices": [
        "Rack-and-pinion",
        "Pulley-only",
        "Screw jack",
        "Crank-rocker"
      ],
      "correctIndex": 3,
      "explanation": "The lesson names the crank-rocker mechanism for the cat's leg structure.",
      "hint": "Think about a rotating crank making another link swing."
    },
    {
      "id": "fc4",
      "topic": "leg-mechanism",
      "learningSlide": 20,
      "prompt": "Which type of motion is associated with the crank-rocker mechanism?",
      "choices": [
        "Light changing color",
        "Rotating and rocking motion",
        "Air pressure sensing",
        "Sound amplification"
      ],
      "correctIndex": 1,
      "explanation": "The crank-rocker mechanism is presented as a mechanical movement system.",
      "hint": "Compare a continuously rotating crank with a swinging link."
    },
    {
      "id": "fc5",
      "topic": "bevel-gears",
      "learningSlide": 6,
      "prompt": "Which gear type is taught in the Funny Cat lesson?",
      "choices": [
        "Worm-only gears",
        "Bevel gears",
        "Straight belt drive",
        "Rack gear only"
      ],
      "correctIndex": 1,
      "explanation": "Slide 6 introduces bevel gear transmission.",
      "hint": "Think about gears used between shafts meeting at an angle."
    },
    {
      "id": "fc6",
      "topic": "bevel-gears",
      "learningSlide": 6,
      "prompt": "What is special about the bevel gears shown in the lesson?",
      "choices": [
        "They must share one straight shaft",
        "They cannot change shaft direction",
        "They operate without touching",
        "They can transmit motion between differently oriented shafts"
      ],
      "correctIndex": 3,
      "explanation": "The slide describes gears transmitting motion even when their axes are differently oriented.",
      "hint": "Consider the relationship between the two shaft directions."
    },
    {
      "id": "fc7",
      "topic": "coding",
      "learningSlide": 17,
      "prompt": "What motion sequence is specified in the first Funny Cat coding task?",
      "choices": [
        "Forward, then backward",
        "Only turn left",
        "Only stop",
        "Spin without moving"
      ],
      "correctIndex": 0,
      "explanation": "Task 1 directs the kitten forward for a few seconds and then backward.",
      "hint": "Read the order of the two actions."
    },
    {
      "id": "fc8",
      "topic": "coding",
      "learningSlide": 18,
      "prompt": "How many times should the forward-and-back movement repeat in Task 2?",
      "choices": [
        "Two times",
        "Three times",
        "Six times",
        "Ten times"
      ],
      "correctIndex": 2,
      "explanation": "Task 2 repeats the first task's sequence six times.",
      "hint": "Look at the repeat count added in the second task."
    },
    {
      "id": "fc9",
      "topic": "extension",
      "learningSlide": 21,
      "prompt": "Which sensor does the final challenge ask students to add?",
      "choices": [
        "Barometric sensor",
        "Temperature sensor",
        "Infrared sensor",
        "Sound sensor"
      ],
      "correctIndex": 2,
      "explanation": "The challenge asks for an infrared sensor.",
      "hint": "Think about a sensor for detecting nearby danger."
    },
    {
      "id": "fc10",
      "topic": "extension",
      "learningSlide": 21,
      "prompt": "What should the cat do when it encounters danger in the final challenge?",
      "choices": [
        "Move faster toward it",
        "Back away",
        "Turn off all motors permanently",
        "Play a song only"
      ],
      "correctIndex": 1,
      "explanation": "The extension asks students to program a retreat when danger is detected.",
      "hint": "Consider the safest direction when an obstacle appears."
    }
  ]
};
