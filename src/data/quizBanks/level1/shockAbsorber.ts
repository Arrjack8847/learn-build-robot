/** Reconciled Level 1 official Learning-PDF bank. */
import type { QuizBank } from "../../quizStudio";
export const shockAbsorberBank: QuizBank = {
  "projectId": "shock-absorber",
  "title": "Shock Absorber",
  "sourcePdfPath": "public/Level 1/Learning/Mechanisms & Simulators/Shock absorber/Shock absorber_Powerpoint.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "shock-absorber-01",
      "topic": "vehicle",
      "learningSlide": 9,
      "prompt": "What type of robot does the Shock Absorber lesson describe?",
      "choices": [
        "Off-road vehicle model",
        "Flying airplane",
        "Deep-sea vessel",
        "Stationary lighthouse"
      ],
      "correctIndex": 0,
      "explanation": "The design slide describes a car for off-road use.",
      "hint": "Think about a vehicle travelling over uneven ground."
    },
    {
      "id": "shock-absorber-02",
      "topic": "vehicle",
      "learningSlide": 9,
      "prompt": "Which structure is emphasized on the Shock Absorber robot?",
      "choices": [
        "Air-pressure measurement",
        "Camera recognition",
        "Shock absorption",
        "Musical output"
      ],
      "correctIndex": 2,
      "explanation": "The lesson highlights the shock-absorbing structure.",
      "hint": "Think about protecting a vehicle from bumps."
    },
    {
      "id": "shock-absorber-03",
      "topic": "electronics",
      "learningSlide": 10,
      "prompt": "Which electronics are specified for the model?",
      "choices": [
        "RCU and GPS only",
        "RCU and motor",
        "Barometric sensor and microphone",
        "Camera and ultrasonic sensor"
      ],
      "correctIndex": 1,
      "explanation": "The equipment slide names RCU and motor.",
      "hint": "Think about the controller and what drives the wheels."
    },
    {
      "id": "shock-absorber-04",
      "topic": "electronics",
      "learningSlide": 10,
      "prompt": "What robot part can the relatively large RCU form?",
      "choices": [
        "Shock-absorber spring",
        "Wheel tread",
        "Gear tooth",
        "Vehicle body"
      ],
      "correctIndex": 3,
      "explanation": "The slide suggests the RCU can be the car body.",
      "hint": "Think about a large central box in the design."
    },
    {
      "id": "shock-absorber-05",
      "topic": "build",
      "learningSlide": 12,
      "prompt": "Which assembly property is explicitly required?",
      "choices": [
        "Loose axle mount",
        "Unsupported frame",
        "Unbalanced weight",
        "Stable structure"
      ],
      "correctIndex": 3,
      "explanation": "The building checklist emphasizes structural stability.",
      "hint": "Think about keeping a car model upright."
    },
    {
      "id": "shock-absorber-06",
      "topic": "build",
      "learningSlide": 12,
      "prompt": "Which check relates to the model's planned appearance?",
      "choices": [
        "Motor speed ratio",
        "Shape match",
        "Pressure baseline",
        "Speaker frequency"
      ],
      "correctIndex": 1,
      "explanation": "Slide 12 asks that the finished shape match the intended design.",
      "hint": "Compare the built robot to its sketch."
    },
    {
      "id": "shock-absorber-07",
      "topic": "ratios",
      "learningSlide": 15,
      "prompt": "What speed ratio is given for Motor 1's gearing?",
      "choices": [
        "8:1",
        "1:1",
        "36:20 (1.8:1)",
        "2:5"
      ],
      "correctIndex": 2,
      "explanation": "Slide 15 lists Motor 1's gear-speed ratio as 36:20.",
      "hint": "Look for the numerical relationship connected to Motor 1."
    },
    {
      "id": "shock-absorber-08",
      "topic": "ratios",
      "learningSlide": 15,
      "prompt": "What speed ratio is given for Motor 2's gearing?",
      "choices": [
        "8:1",
        "36:20",
        "1:1",
        "1:8"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 gives the Motor 2 ratio as 8:1.",
      "hint": "Separate the Motor 2 information from the Motor 1 ratio."
    },
    {
      "id": "shock-absorber-09",
      "topic": "debugging",
      "learningSlide": 15,
      "prompt": "Why may the two motors need different program values for equal wheel speed?",
      "choices": [
        "Their gear ratios differ",
        "They have different light colors",
        "The RCU only supports one speed",
        "The vehicle has no frame"
      ],
      "correctIndex": 0,
      "explanation": "Different transmission ratios require different motor settings for the same output.",
      "hint": "Think about the effects of the two gear reductions."
    },
    {
      "id": "shock-absorber-10",
      "topic": "debugging",
      "learningSlide": 15,
      "prompt": "What opposite motor-control sign relationship is mentioned in the lesson?",
      "choices": [
        "Both speed settings always positive",
        "Both speed settings always zero",
        "Both speeds must be identical",
        "One positive and one negative speed"
      ],
      "correctIndex": 3,
      "explanation": "Slide 15 states the two motor directions differ, so one setting is positive and one negative.",
      "hint": "Compare the directions the two motors need to turn."
    }
  ]
};
