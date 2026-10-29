/** Level 4 — Smart curtain. Questions checked against the 18-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const smartCurtainBank: QuizBank = {
  "projectId": "level-4-smart-curtain",
  "title": "Smart curtain",
  "sourcePdfPath": "public/Level 4/Automation & Security/Smart curtain/Smart curtain_Powerpoint.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "l4-smartcurtain-01",
      "topic": "curtain-functions",
      "learningSlide": 6,
      "prompt": "Why do people close curtains in a room?",
      "choices": [
        "To speed up a computer",
        "To charge a battery",
        "To increase road traffic",
        "To provide privacy"
      ],
      "correctIndex": 3,
      "explanation": "Slide 6 describes privacy as an important purpose of curtains.",
      "hint": "Think about what people outside can see."
    },
    {
      "id": "l4-smartcurtain-02",
      "topic": "curtain-functions",
      "learningSlide": 6,
      "prompt": "How can curtains change the light in a room?",
      "choices": [
        "By producing electricity",
        "By shading the room",
        "By moving the walls",
        "By making sunlight stronger"
      ],
      "correctIndex": 1,
      "explanation": "Slide 6 explains that curtains reduce light and provide shade.",
      "hint": "Imagine using curtains on a bright afternoon."
    },
    {
      "id": "l4-smartcurtain-03",
      "topic": "pulley-structure",
      "learningSlide": 9,
      "prompt": "Which structure does the Smart Curtain lesson use?",
      "choices": [
        "Gearbox only",
        "Spring launcher",
        "Pulley structure",
        "Walking legs"
      ],
      "correctIndex": 2,
      "explanation": "Slide 9 identifies a pulley structure.",
      "hint": "Think about a mechanism that guides movement along a curtain track."
    },
    {
      "id": "l4-smartcurtain-04",
      "topic": "pulley-structure",
      "learningSlide": 10,
      "prompt": "Which part of the Smart Curtain design needs careful planning?",
      "choices": [
        "Its pulley structure",
        "Its speaker position",
        "Its camera lens",
        "Its wheel-racing track"
      ],
      "correctIndex": 0,
      "explanation": "Slide 10 specifically says to pay attention to the pulley structure.",
      "hint": "Remember which mechanism opens and closes the curtain."
    },
    {
      "id": "l4-smartcurtain-05",
      "topic": "electronic-components",
      "learningSlide": 10,
      "prompt": "Which pair of electronic components does the lesson list?",
      "choices": [
        "RCU and motor",
        "Camera and microphone",
        "Speaker and GPS",
        "Solar panel and compass"
      ],
      "correctIndex": 0,
      "explanation": "Slide 10 lists the RCU and motor.",
      "hint": "One part controls the action and another produces movement."
    },
    {
      "id": "l4-smartcurtain-06",
      "topic": "electronic-components",
      "learningSlide": 10,
      "prompt": "Why can the RCU be useful as the Smart Curtain's base?",
      "choices": [
        "It creates sunlight",
        "It plays music",
        "It is larger in size",
        "It detects colors"
      ],
      "correctIndex": 2,
      "explanation": "Slide 10 notes that the larger RCU can be used as a base.",
      "hint": "Think about how the size of a part affects where it can sit."
    },
    {
      "id": "l4-smartcurtain-07",
      "topic": "assembly-requirements",
      "learningSlide": 12,
      "prompt": "What should you check before running the Smart Curtain model?",
      "choices": [
        "That the phone is charging",
        "That the structure is stable",
        "That the room is very dark",
        "That the music is loud"
      ],
      "correctIndex": 1,
      "explanation": "Slide 12 identifies a stable structure as an assembly requirement.",
      "hint": "A model needs to hold together before testing."
    },
    {
      "id": "l4-smartcurtain-08",
      "topic": "assembly-requirements",
      "learningSlide": 12,
      "prompt": "If your model looks unlike the planned curtain, which assembly requirement should you revisit?",
      "choices": [
        "Increasing the sound level",
        "Removing the base",
        "Changing all motor speeds",
        "Matching the intended shape"
      ],
      "correctIndex": 3,
      "explanation": "Slide 12 requires that the finished model's shape match the design.",
      "hint": "Compare the built model with its intended appearance."
    },
    {
      "id": "l4-smartcurtain-09",
      "topic": "sensing-and-control",
      "learningSlide": 2,
      "prompt": "Which sensor does the Smart Curtain lesson emphasize learning to use?",
      "choices": [
        "Color sensor",
        "Sound sensor",
        "Ultrasonic sensor",
        "Magnetic sensor"
      ],
      "correctIndex": 2,
      "explanation": "Slide 2 explicitly says students should master basic ultrasonic sensor use.",
      "hint": "Think about which sensor is named in the lesson's learning target."
    },
    {
      "id": "l4-smartcurtain-10",
      "topic": "sensing-and-control",
      "learningSlide": 14,
      "prompt": "What curtain action appears after the program's induction trigger?",
      "choices": [
        "Open the curtain",
        "Play a piano",
        "Drive down a road",
        "Read a barcode"
      ],
      "correctIndex": 0,
      "explanation": "Slide 14 shows induction followed by the Open the curtain action.",
      "hint": "Think about the movement the smart curtain is built to perform."
    }
  ]
};
