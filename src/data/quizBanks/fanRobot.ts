/** Checked against Fan Robot Learning PDF slide text. */
import type { QuizBank } from "../quizStudio";
export const fanRobotBank: QuizBank = {
  "projectId": "level-2-fan-robot",
  "title": "Fan Robot",
  "sourcePdfPath": "public/Level 2/Learning/Action-Oriented/Fan robot/Fan robot_Powerpoint.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "fr01",
      "topic": "design",
      "learningSlide": 7,
      "prompt": "What part is the Fan Robot's design mainly built around?",
      "choices": [
        "Wheel axle",
        "Servo arm",
        "Ultrasonic camera",
        "Gearbox housing"
      ],
      "correctIndex": 1,
      "explanation": "The introductory slide emphasizes the servo arm.",
      "hint": "Think about what supports the waving fan."
    },
    {
      "id": "fr02",
      "topic": "design",
      "learningSlide": 9,
      "prompt": "Which set of parts describes the Fan Robot's shape?",
      "choices": [
        "Claw, wheel and track",
        "Speaker, wheel and sensor",
        "Screen, camera and steering",
        "Frame, arm and fan"
      ],
      "correctIndex": 3,
      "explanation": "The slide lists frame, arm and fan.",
      "hint": "Picture the moving part and its frame."
    },
    {
      "id": "fr03",
      "topic": "equipment",
      "learningSlide": 10,
      "prompt": "Which electronic pair is listed for the Fan Robot?",
      "choices": [
        "RCU and camera",
        "Sound sensor and speaker",
        "RCU and large motor",
        "RCU and temperature sensor"
      ],
      "correctIndex": 2,
      "explanation": "Slide 10 names the RCU and a large motor.",
      "hint": "Think about what controls the arm and makes it move."
    },
    {
      "id": "fr04",
      "topic": "equipment",
      "learningSlide": 10,
      "prompt": "Why can the RCU support the Fan Robot as its base?",
      "choices": [
        "Its relatively large size",
        "Its built-in blades",
        "Its air-pressure sensor",
        "Its ultrasonic emitter"
      ],
      "correctIndex": 0,
      "explanation": "The equipment slide suggests the larger RCU as a base.",
      "hint": "Think about what provides support under a moving arm."
    },
    {
      "id": "fr05",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "What structural requirement does the Fan Robot assembly checklist include?",
      "choices": [
        "Stable structure",
        "Unattached joints",
        "Unsupported long beams",
        "Unbalanced frame"
      ],
      "correctIndex": 0,
      "explanation": "Slide 12 requires a stable assembly.",
      "hint": "Imagine a model moving repeatedly without falling."
    },
    {
      "id": "fr06",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "When checking the built fan against the design, what matters?",
      "choices": [
        "Playing the right sound file",
        "Measuring air pressure",
        "Matching the planned shape",
        "Setting the correct GPS position"
      ],
      "correctIndex": 2,
      "explanation": "Shape matching is listed in the assembly requirements.",
      "hint": "Compare the finished frame and arm with the design."
    },
    {
      "id": "fr07",
      "topic": "motor-range",
      "learningSlide": 15,
      "prompt": "If the fan arm hits the frame during a test, what adjustment does the lesson recommend?",
      "choices": [
        "Increase the angle",
        "Increase the motor voltage",
        "Disable the controller",
        "Reduce the angle"
      ],
      "correctIndex": 3,
      "explanation": "The slide advises reducing the angle if an unexpected collision occurs.",
      "hint": "Consider how to reduce the movement's reach."
    },
    {
      "id": "fr08",
      "topic": "motor-range",
      "learningSlide": 15,
      "prompt": "What swing angle is specified for the first Fan Robot motion test?",
      "choices": [
        "Approximately ±30°",
        "Approximately ±120°",
        "A full 360°",
        "Approximately ±45°"
      ],
      "correctIndex": 1,
      "explanation": "The first test uses a plus-or-minus 120-degree swing.",
      "hint": "Look for the stated arc of the test."
    },
    {
      "id": "fr09",
      "topic": "speed-test",
      "learningSlide": 16,
      "prompt": "Which two speeds are used in the second Fan Robot test?",
      "choices": [
        "50 and -50",
        "100 and -100",
        "20 and -20",
        "0 and 50"
      ],
      "correctIndex": 1,
      "explanation": "The slide tests speeds 100 and -100.",
      "hint": "Look for the positive and negative settings used together."
    },
    {
      "id": "fr10",
      "topic": "speed-test",
      "learningSlide": 16,
      "prompt": "According to the test conclusion, what improves the fan's effect?",
      "choices": [
        "Faster arm movement",
        "Lower display brightness",
        "Less stable support",
        "Lower sound volume"
      ],
      "correctIndex": 0,
      "explanation": "The slide concludes faster movement gives a stronger fan effect.",
      "hint": "Compare the air movement created by fast and slow waving."
    }
  ]
};
