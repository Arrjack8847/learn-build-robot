/** Questions based on Sled Dog's original Learning PDF. */
import type { QuizBank } from "../quizStudio";
export const sledDogBank: QuizBank = {
  "projectId": "sled-dog",
  "title": "Sled Dog",
  "sourcePdfPath": "public/Level 1/Learning/Biomimicry/Sled dog.pdf",
  "sourcePageCount": 17,
  "questions": [
    {
      "id": "sd1",
      "topic": "context",
      "learningSlide": 3,
      "prompt": "What do sled dogs traditionally help pull?",
      "choices": [
        "Ships",
        "Airplanes",
        "Sleds",
        "Trains"
      ],
      "correctIndex": 2,
      "explanation": "Slide 3 describes dogs pulling sleds.",
      "hint": "Think about travel over snow."
    },
    {
      "id": "sd2",
      "topic": "context",
      "learningSlide": 2,
      "prompt": "Which of these breeds is mentioned in the introduction?",
      "choices": [
        "Husky",
        "Poodle",
        "Beagle",
        "Greyhound"
      ],
      "correctIndex": 0,
      "explanation": "The introduction mentions huskies, Samoyeds and Alaskan dogs.",
      "hint": "Recall one of the named sled-dog breeds."
    },
    {
      "id": "sd3",
      "topic": "mechanism",
      "learningSlide": 5,
      "prompt": "Which mechanism is used to model a dog's walking motion?",
      "choices": [
        "Hydraulic pump",
        "Camera tracker",
        "Belt-only transmission",
        "Crank-rocker mechanism"
      ],
      "correctIndex": 3,
      "explanation": "The lesson teaches a crank-rocker mechanism.",
      "hint": "Think about a linkage converting continuous motor rotation."
    },
    {
      "id": "sd4",
      "topic": "mechanism",
      "learningSlide": 5,
      "prompt": "What conversion does the crank-rocker mechanism perform?",
      "choices": [
        "Sound into color",
        "Rotation into swinging motion",
        "Pressure into temperature",
        "Light into music"
      ],
      "correctIndex": 1,
      "explanation": "The slide explains that rotating power can become swinging power.",
      "hint": "Picture a crank turning while another link rocks."
    },
    {
      "id": "sd5",
      "topic": "motor",
      "learningSlide": 11,
      "prompt": "Which port does the lesson connect the motor to?",
      "choices": [
        "Port B",
        "Port A",
        "Port C",
        "Port D"
      ],
      "correctIndex": 1,
      "explanation": "Slide 11 explicitly connects the motor to port A.",
      "hint": "Look for the letter in the construction instructions."
    },
    {
      "id": "sd6",
      "topic": "motor",
      "learningSlide": 12,
      "prompt": "What is the motor used to make the Sled Dog model do?",
      "choices": [
        "Measure light",
        "Show a video",
        "Record pressure",
        "Move and pull its cart"
      ],
      "correctIndex": 3,
      "explanation": "Slide 12 uses motor instructions to move the dog and pull the cart.",
      "hint": "Think of how motor power moves the sled mechanism."
    },
    {
      "id": "sd7",
      "topic": "control",
      "learningSlide": 14,
      "prompt": "Which two ways of controlling motion are suggested for stopping near a line?",
      "choices": [
        "Time or angle",
        "Color or sound",
        "Temperature or pressure",
        "Camera or microphone"
      ],
      "correctIndex": 0,
      "explanation": "The lesson suggests time or angle control.",
      "hint": "Think about measuring how long the motor runs or how far it turns."
    },
    {
      "id": "sd8",
      "topic": "control",
      "learningSlide": 14,
      "prompt": "What is the goal of the start-line and stop-line challenge?",
      "choices": [
        "Move past the line as far as possible",
        "Stop at the start line",
        "Stop accurately at the end line",
        "Remove the motor"
      ],
      "correctIndex": 2,
      "explanation": "The challenge aims to stop exactly at the end line.",
      "hint": "Focus on accuracy rather than maximum distance."
    },
    {
      "id": "sd9",
      "topic": "presentation",
      "learningSlide": 17,
      "prompt": "What does the final presentation ask students to add to the Sled Dog?",
      "choices": [
        "A pressure sensor",
        "An extra camera",
        "A suitable sound",
        "A new wheel axle"
      ],
      "correctIndex": 2,
      "explanation": "The final slide asks students to add an appropriate sound.",
      "hint": "Think about how a dog might sound in a demonstration."
    },
    {
      "id": "sd10",
      "topic": "presentation",
      "learningSlide": 16,
      "prompt": "What does the evaluation ask about rotation and swinging motion?",
      "choices": [
        "How to convert light into sound",
        "How to convert rotation to a swing",
        "How to measure air pressure",
        "How to display a camera image"
      ],
      "correctIndex": 1,
      "explanation": "The evaluation reviews rotation-to-swing conversion.",
      "hint": "Remember the main mechanism learned earlier."
    }
  ]
};
