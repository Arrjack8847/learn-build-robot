/** Level 2 Helicopter source-verified Learning quiz. */
import type { QuizBank } from "../../quizStudio";
export const helicopterBank: QuizBank = {
  "projectId": "level-2-helicopter",
  "title": "Helicopter",
  "sourcePdfPath": "public/Level 2/Learning/Vehicles & Complex Movers/Helicopter/Helicopter_Powerpoint.pdf",
  "sourcePageCount": 17,
  "questions": [
    {
      "id": "he1",
      "topic": "real-world-use",
      "learningSlide": 6,
      "prompt": "What is one civilian use of helicopters described in the lesson?",
      "choices": [
        "Emergency ambulance transport",
        "Manufacturing microchips",
        "Printing photographs",
        "Growing indoor vegetables"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 lists ambulance services among helicopter applications.",
      "hint": "Use the lesson's real world use section and compare the possible answers carefully."
    },
    {
      "id": "he2",
      "topic": "real-world-use",
      "learningSlide": 6,
      "prompt": "Why are helicopters called military-civilian dual-use aircraft?",
      "choices": [
        "They support both military and civilian tasks",
        "They must fly upside down",
        "They run on rails and roads",
        "They always have two identical engines"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 says helicopters serve both military and civilian purposes.",
      "hint": "Use the lesson's real world use section and compare the possible answers carefully."
    },
    {
      "id": "he3",
      "topic": "robot-hardware",
      "learningSlide": 7,
      "prompt": "How many large motors under the model move the Helicopter robot?",
      "choices": [
        "One",
        "Two",
        "Three",
        "Four"
      ],
      "correctIndex": 1,
      "explanation": "Slide 7 identifies two large motors beneath the model for motion.",
      "hint": "Use the lesson's robot hardware section and compare the possible answers carefully."
    },
    {
      "id": "he4",
      "topic": "robot-hardware",
      "learningSlide": 7,
      "prompt": "What does the central motor drive in the Helicopter model?",
      "choices": [
        "The simulated main and auxiliary rotors",
        "The classroom projector",
        "An infrared detector",
        "A sliding window"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 assigns the main and auxiliary rotor rotation to the middle motor.",
      "hint": "Use the lesson's robot hardware section and compare the possible answers carefully."
    },
    {
      "id": "he5",
      "topic": "motor-direction",
      "learningSlide": 9,
      "prompt": "Which shaft direction is defined as forward motor rotation in this lesson?",
      "choices": [
        "Clockwise",
        "Counterclockwise",
        "Stationary",
        "Alternating"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 explicitly defines clockwise as forward motor rotation.",
      "hint": "Use the lesson's motor direction section and compare the possible answers carefully."
    },
    {
      "id": "he6",
      "topic": "motor-direction",
      "learningSlide": 9,
      "prompt": "Which motor status means that no power output is being applied?",
      "choices": [
        "Forward",
        "Reverse",
        "Stop",
        "Accelerate"
      ],
      "correctIndex": 2,
      "explanation": "Slide 9 defines stop as a state with no motor power output.",
      "hint": "Use the lesson's motor direction section and compare the possible answers carefully."
    },
    {
      "id": "he7",
      "topic": "motor-speed",
      "learningSlide": 10,
      "prompt": "What does a motor speed setting of zero mean in this lesson?",
      "choices": [
        "Reverse motion",
        "Maximum forward motion",
        "Stop",
        "Minimum forward motion"
      ],
      "correctIndex": 2,
      "explanation": "Slide 10 defines 0 as stop with no power output.",
      "hint": "Use the lesson's motor speed section and compare the possible answers carefully."
    },
    {
      "id": "he8",
      "topic": "motor-speed",
      "learningSlide": 10,
      "prompt": "What does a negative motor speed setting indicate?",
      "choices": [
        "Forward motion",
        "Reverse motion",
        "Unchanged direction",
        "A disconnected motor"
      ],
      "correctIndex": 1,
      "explanation": "Slide 10 uses negative values for reverse rotation.",
      "hint": "Use the lesson's motor speed section and compare the possible answers carefully."
    },
    {
      "id": "he9",
      "topic": "programmed-acceleration",
      "learningSlide": 14,
      "prompt": "To what speed setting should the Helicopter robot accelerate in the coding challenge?",
      "choices": [
        "25",
        "50",
        "75",
        "100"
      ],
      "correctIndex": 3,
      "explanation": "Slide 14 asks students to accelerate to setting 100.",
      "hint": "Use the lesson's programmed acceleration section and compare the possible answers carefully."
    },
    {
      "id": "he10",
      "topic": "programmed-acceleration",
      "learningSlide": 7,
      "prompt": "Why does the model use motors underneath to travel rather than fly?",
      "choices": [
        "It has insufficient power to lift off",
        "It has no rotor components",
        "It uses compressed air instead",
        "It is made entirely from paper"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 states that the model has insufficient power to fly.",
      "hint": "Use the lesson's programmed acceleration section and compare the possible answers carefully."
    }
  ]
};
