/** Level 2 question bank drafted from the original teaching slides (15 pages). */
import type { QuizBank } from "../../quizStudio";
export const roundTripTransportationBank: QuizBank = {
  "projectId": "level-2-round-trip-transportation",
  "title": "Round-trip transportation",
  "sourcePdfPath": "public/Level 2/Learning/Manipulators/Round-trip transportation.pdf",
  "sourcePageCount": 15,
  "questions": [
    {
      "id": "rou01",
      "topic": "transport",
      "learningSlide": 3,
      "prompt": "What does the round-trip vehicle carry in the lesson?",
      "choices": [
        "Building materials",
        "Passengers on an airplane",
        "Only sound waves",
        "Sunlight"
      ],
      "correctIndex": 0,
      "explanation": "The lesson on slide 3 explains building materials.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "rou02",
      "topic": "transport",
      "learningSlide": 3,
      "prompt": "Why should the vehicle travel back and forth?",
      "choices": [
        "To draw a circle on a screen",
        "To change gear color",
        "To measure wind direction",
        "To transport materials repeatedly"
      ],
      "correctIndex": 3,
      "explanation": "The lesson on slide 3 explains to transport materials repeatedly.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "rou03",
      "topic": "motor",
      "learningSlide": 4,
      "prompt": "Which component moves the transport car?",
      "choices": [
        "A speaker",
        "A magnifying glass",
        "A motor",
        "A lens"
      ],
      "correctIndex": 2,
      "explanation": "The lesson on slide 4 explains a motor.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "rou04",
      "topic": "motor",
      "learningSlide": 4,
      "prompt": "What must the model use to travel between two ends without manual pushing?",
      "choices": [
        "A passive reflector",
        "Powered movement",
        "A fixed paper label",
        "A stationary support"
      ],
      "correctIndex": 1,
      "explanation": "The lesson on slide 4 explains powered movement.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "rou05",
      "topic": "touch-sensors",
      "learningSlide": 5,
      "prompt": "Where are the two touch sensors installed?",
      "choices": [
        "At the front and back",
        "Both on the ceiling",
        "Only on the display",
        "Under the battery cover"
      ],
      "correctIndex": 0,
      "explanation": "The lesson on slide 5 explains at the front and back.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "rou06",
      "topic": "touch-sensors",
      "learningSlide": 5,
      "prompt": "What should a car do after either end's touch sensor meets a wall?",
      "choices": [
        "Continue into the wall",
        "Disable all sensors forever",
        "Remove the motor",
        "Reverse its travel direction"
      ],
      "correctIndex": 3,
      "explanation": "The lesson on slide 5 explains reverse its travel direction.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "rou07",
      "topic": "program-inputs",
      "learningSlide": 13,
      "prompt": "Which controller inputs receive the two touch sensors?",
      "choices": [
        "Ports 8 and 9",
        "A video-output jack",
        "Ports 1 and 2",
        "Ports A and B"
      ],
      "correctIndex": 2,
      "explanation": "The lesson on slide 13 explains ports 1 and 2.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "rou08",
      "topic": "program-inputs",
      "learningSlide": 13,
      "prompt": "What happens to motor motion when the programmed touch sensor triggers?",
      "choices": [
        "Sound is converted into light",
        "Direction changes",
        "The motor is deleted",
        "Wheel material changes"
      ],
      "correctIndex": 1,
      "explanation": "The lesson on slide 13 explains direction changes.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "rou09",
      "topic": "timed-logic",
      "learningSlide": 14,
      "prompt": "What does adding a motor-running time cause the car to do?",
      "choices": [
        "Continue moving until the time is reached",
        "Check the touch sensor every millisecond",
        "Never move",
        "Stop immediately at any wall"
      ],
      "correctIndex": 0,
      "explanation": "The lesson on slide 14 explains continue moving until the time is reached.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    },
    {
      "id": "rou10",
      "topic": "timed-logic",
      "learningSlide": 14,
      "prompt": "Why might the timed program miss a touch-sensor press before the timer ends?",
      "choices": [
        "The sensor always has no power",
        "The wheel is too wide",
        "The car has no motor",
        "It does not check the sensor during that interval"
      ],
      "correctIndex": 3,
      "explanation": "The lesson on slide 14 explains it does not check the sensor during that interval.",
      "hint": "Think about the mechanism, component or experiment shown on the referenced slide."
    }
  ]
};
