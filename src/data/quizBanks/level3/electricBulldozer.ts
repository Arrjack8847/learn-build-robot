/** Verified against original Level 3 Learning PDF, with 1-based source slides. */
import type { QuizBank } from "../../quizStudio";

export const electricBulldozerBank: QuizBank = {
  "projectId": "level-3-electric-bulldozer",
  "title": "Electric Bulldozer",
  "sourcePdfPath": "public/Level 3/Learning/Characters & Structures/Electric Bulldozer/23.Electric Bulldozer -Slides.pdf",
  "sourcePageCount": 34,
  "questions": [
    {
      "id": "electricbulld-01",
      "topic": "purpose",
      "learningSlide": 3,
      "prompt": "Which task is a bulldozer designed to perform?",
      "choices": [
        "Measure ultrasound echoes in a hospital",
        "Level uneven ground and earth",
        "Lift people between floors",
        "Sort objects by sound"
      ],
      "correctIndex": 1,
      "hint": "Think about the work a bulldozer performs on the ground.",
      "explanation": "Slide 3 describes leveling mounds and potholes."
    },
    {
      "id": "electricbulld-02",
      "topic": "purpose",
      "learningSlide": 4,
      "prompt": "Which alternative to gasoline or diesel power is discussed for bulldozers?",
      "choices": [
        "Compressed paper springs only",
        "Human pedaling only",
        "Electric batteries",
        "Sunlight reflected by mirrors"
      ],
      "correctIndex": 2,
      "hint": "Think about the work a bulldozer performs on the ground.",
      "explanation": "Slide 4 discusses bulldozers powered by electricity or batteries."
    },
    {
      "id": "electricbulld-03",
      "topic": "sensing",
      "learningSlide": 6,
      "prompt": "Which sensor combination controls the model's speeds and detects obstacles?",
      "choices": [
        "Two sound sensors only",
        "A barometer and microphone",
        "One infrared color sensor only",
        "Touch sensors and an ultrasonic sensor"
      ],
      "correctIndex": 3,
      "hint": "Different sensors provide button control and obstacle detection.",
      "explanation": "Slide 6 assigns speed control to touch sensors and obstacle detection to ultrasound."
    },
    {
      "id": "electricbulld-04",
      "topic": "sensing",
      "learningSlide": 26,
      "prompt": "What do the left and right touch sensors change in the program?",
      "choices": [
        "Maximum power settings for the motors",
        "The color of the wheels",
        "The number of robot parts",
        "The maximum ultrasonic range"
      ],
      "correctIndex": 0,
      "hint": "Different sensors provide button control and obstacle detection.",
      "explanation": "Slide 26 uses the two touch buttons to select different motor power limits."
    },
    {
      "id": "electricbulld-05",
      "topic": "power",
      "learningSlide": 22,
      "prompt": "If motor output is set to half the maximum power, what is the percentage?",
      "choices": [
        "25%",
        "50%",
        "75%",
        "100%"
      ],
      "correctIndex": 1,
      "hint": "Motor power affects how quickly the machine moves.",
      "explanation": "Slide 22 illustrates half maximum power as 50%."
    },
    {
      "id": "electricbulld-06",
      "topic": "power",
      "learningSlide": 23,
      "prompt": "What is the role of the motor-power programming block?",
      "choices": [
        "Measure blood pressure",
        "Count ultrasonic echoes only",
        "Set the motors' maximum power limits",
        "Delete all motor ports"
      ],
      "correctIndex": 2,
      "hint": "Motor power affects how quickly the machine moves.",
      "explanation": "Slide 23 identifies the block as setting each motor's maximum power."
    },
    {
      "id": "electricbulld-07",
      "topic": "stops",
      "learningSlide": 27,
      "prompt": "What maximum motor power is specified when the bulldozer detects an obstacle?",
      "choices": [
        "25",
        "75",
        "100",
        "0"
      ],
      "correctIndex": 3,
      "hint": "Consider how to prevent a collision during work.",
      "explanation": "Slide 27 sets maximum power to zero to stop movement."
    },
    {
      "id": "electricbulld-08",
      "topic": "stops",
      "learningSlide": 6,
      "prompt": "Which device detects a tall obstacle in front of the model?",
      "choices": [
        "Ultrasonic sensor",
        "Left controller button only",
        "Speaker",
        "Battery compartment"
      ],
      "correctIndex": 0,
      "hint": "Consider how to prevent a collision during work.",
      "explanation": "Slide 6 uses the ultrasonic sensor to detect an obstacle and stop the bulldozer."
    },
    {
      "id": "electricbulld-09",
      "topic": "feedback",
      "learningSlide": 6,
      "prompt": "What text should appear while the bulldozer moves slowly?",
      "choices": [
        "obstacle",
        "low power",
        "high power",
        "complete"
      ],
      "correctIndex": 1,
      "hint": "The user needs to understand low, high and stopped states.",
      "explanation": "Slide 6 calls for 'low power' in slow movement."
    },
    {
      "id": "electricbulld-10",
      "topic": "feedback",
      "learningSlide": 6,
      "prompt": "What should the controller display while moving quickly?",
      "choices": [
        "low power",
        "reset",
        "high power",
        "loading"
      ],
      "correctIndex": 2,
      "hint": "The user needs to understand low, high and stopped states.",
      "explanation": "Slide 6 calls for 'high power' in the fast state."
    }
  ]
};
