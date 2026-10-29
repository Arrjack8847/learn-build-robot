/** Level 4 Learning PDF text checked page by page; questions do not depend on unreviewed diagrams. */
import type { QuizBank } from "../../quizStudio";

export const bipedRobotBank: QuizBank = {
  "projectId": "level-4-biped-robot",
  "title": "Biped Robot",
  "sourcePdfPath": "public/Level 4/Mechanisms & Simulators/Biped Robot/20. Biped Robot-Teaching Slides.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "l4-bp-01",
      "topic": "locomotion",
      "learningSlide": 5,
      "prompt": "Why can biped robots be useful on uneven ground?",
      "choices": [
        "Their legs can negotiate obstacles",
        "They never need controllers",
        "They can only travel on tracks",
        "They measure air pressure"
      ],
      "correctIndex": 0,
      "explanation": "Slide 5 describes legged movement as flexible on uneven or obstructed ground.",
      "hint": "Think about walking across a rocky surface."
    },
    {
      "id": "l4-bp-02",
      "topic": "locomotion",
      "learningSlide": 6,
      "prompt": "What must walking algorithms manage during one-foot support?",
      "choices": [
        "The robot's paint color",
        "The speaker's volume",
        "The center of gravity",
        "The screen brightness"
      ],
      "correctIndex": 2,
      "explanation": "Slide 6 explains that the center of gravity must fall over the supporting leg.",
      "hint": "What keeps a person balanced on one foot?"
    },
    {
      "id": "l4-bp-03",
      "topic": "ultrasonic-sensing",
      "learningSlide": 8,
      "prompt": "Which sensor helps the biped respond to different distances?",
      "choices": [
        "Thermometer",
        "Ultrasonic sensor",
        "Color sensor",
        "Compass"
      ],
      "correctIndex": 1,
      "explanation": "Slide 8 names the ultrasonic sensor as the distance receiver.",
      "hint": "Choose the sensor that measures a gap."
    },
    {
      "id": "l4-bp-04",
      "topic": "ultrasonic-sensing",
      "learningSlide": 9,
      "prompt": "How is the obstacle distance calculated in this lesson?",
      "choices": [
        "From reflected brightness",
        "From the motor's rotation count",
        "From sound volume alone",
        "From ultrasound travel time and sound speed"
      ],
      "correctIndex": 3,
      "explanation": "Slide 9 uses travel time and sound speed to measure distance.",
      "hint": "The sensor sends a wave and receives its echo."
    },
    {
      "id": "l4-bp-05",
      "topic": "leg-control",
      "learningSlide": 11,
      "prompt": "Which component supplies power for the robot's leg movement?",
      "choices": [
        "Motor",
        "Display",
        "Color sensor",
        "Buzzer"
      ],
      "correctIndex": 0,
      "explanation": "Slide 11 labels the power for movement in the motor-driven build.",
      "hint": "Which moving part drives the legs?"
    },
    {
      "id": "l4-bp-06",
      "topic": "leg-control",
      "learningSlide": 12,
      "prompt": "Which movement options does the lesson's motor program describe?",
      "choices": [
        "Color-changing only",
        "Clapping and singing only",
        "Forward, backward and stop",
        "Always turning clockwise"
      ],
      "correctIndex": 2,
      "explanation": "Slide 12 describes forward, backward and stop motor behaviors.",
      "hint": "Think about approaching, retreating and remaining still."
    },
    {
      "id": "l4-bp-07",
      "topic": "invalid-reading",
      "learningSlide": 14,
      "prompt": "Which ultrasonic sensor reading is treated as invalid?",
      "choices": [
        "0",
        "888",
        "25",
        "340"
      ],
      "correctIndex": 1,
      "explanation": "Slide 14 identifies 888 as an invalid reading.",
      "hint": "Look for the unusual three-digit value."
    },
    {
      "id": "l4-bp-08",
      "topic": "invalid-reading",
      "learningSlide": 14,
      "prompt": "What value replaces the invalid reading of 888?",
      "choices": [
        "100",
        "888",
        "25",
        "20"
      ],
      "correctIndex": 3,
      "explanation": "Slide 14 sets the distance variable to 20, causing the model to stop.",
      "hint": "The fallback falls inside the stop range."
    },
    {
      "id": "l4-bp-09",
      "topic": "distance-thresholds",
      "learningSlide": 15,
      "prompt": "What does the robot do when the distance is greater than 25?",
      "choices": [
        "Move forward",
        "Move backward",
        "Stop",
        "Turn on a warning light"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 specifies forward motion for values greater than 25.",
      "hint": "Which direction is used when the object is far away?"
    },
    {
      "id": "l4-bp-10",
      "topic": "distance-thresholds",
      "learningSlide": 15,
      "prompt": "What does the robot do when the distance is below 20?",
      "choices": [
        "Move forward",
        "Keep the same speed",
        "Move backward",
        "Ignore all readings"
      ],
      "correctIndex": 2,
      "explanation": "Slide 15 specifies backward motion below 20.",
      "hint": "What motion avoids getting too close?"
    }
  ]
};
