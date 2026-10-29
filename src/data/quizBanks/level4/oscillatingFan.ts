/** Level 4 quiz: authored from official 22-page Learning PDF text. */
import type { QuizBank } from "../../quizStudio";
export const oscillatingFanBank: QuizBank = {
  "projectId": "level-4-oscillating-fan",
  "title": "Oscillating Fan",
  "sourcePdfPath": "public/Level 4/Mechanisms & Simulators/Oscillating Fan/19.Oscillating Fan -Slides.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "l4-oscillating-fan-01",
      "topic": "gesture-types",
      "learningSlide": 7,
      "prompt": "Which example is a dynamic gesture?",
      "choices": [
        "A still victory sign",
        "A stationary fist",
        "Waving a hand",
        "Keeping a finger still"
      ],
      "correctIndex": 2,
      "explanation": "The lesson distinguishes moving gestures, such as waving, from static poses.",
      "hint": "Think about whether a hand pose changes over time."
    },
    {
      "id": "l4-oscillating-fan-02",
      "topic": "gesture-types",
      "learningSlide": 7,
      "prompt": "Which example is a static gesture?",
      "choices": [
        "Repeatedly waving",
        "A held victory sign",
        "Moving an arm in circles",
        "Clapping repeatedly"
      ],
      "correctIndex": 1,
      "explanation": "A victory sign held without motion is the lesson's static-gesture example.",
      "hint": "Think about whether a hand pose changes over time."
    },
    {
      "id": "l4-oscillating-fan-03",
      "topic": "gesture-recognition",
      "learningSlide": 8,
      "prompt": "Which module recognizes hand gestures for the fan?",
      "choices": [
        "AI vision module",
        "Ultrasonic ranger",
        "Barometric sensor",
        "Touchscreen keyboard"
      ],
      "correctIndex": 0,
      "explanation": "The fan uses an AI vision module with built-in gesture models.",
      "hint": "Recall how a vision module analyzes hand patterns."
    },
    {
      "id": "l4-oscillating-fan-04",
      "topic": "gesture-recognition",
      "learningSlide": 8,
      "prompt": "Which processes are identified as core parts of gesture recognition?",
      "choices": [
        "Audio mixing and playback",
        "GPS routing and mapping",
        "Battery charging and balancing",
        "Segmentation, analysis and recognition"
      ],
      "correctIndex": 3,
      "explanation": "Slide 8 describes gesture segmentation, analysis and recognition.",
      "hint": "Recall how a vision module analyzes hand patterns."
    },
    {
      "id": "l4-oscillating-fan-05",
      "topic": "vision-data",
      "learningSlide": 9,
      "prompt": "What range can the gesture-recognition block return?",
      "choices": [
        "0 to 3",
        "0 to 100",
        "1 to 1000",
        "-100 to 100"
      ],
      "correctIndex": 0,
      "explanation": "The gesture result is a code between 0 and 3.",
      "hint": "Consider how a program represents recognition outcomes."
    },
    {
      "id": "l4-oscillating-fan-06",
      "topic": "vision-data",
      "learningSlide": 14,
      "prompt": "Which detection mode is chosen before reading hand gestures?",
      "choices": [
        "QR scanning",
        "Gesture recognition",
        "Object weighing",
        "Temperature detection"
      ],
      "correctIndex": 1,
      "explanation": "The lesson configures the AI vision module for gesture recognition.",
      "hint": "Consider how a program represents recognition outcomes."
    },
    {
      "id": "l4-oscillating-fan-07",
      "topic": "program-variables",
      "learningSlide": 15,
      "prompt": "What is the name of the variable that stores the recognition result?",
      "choices": [
        "volume",
        "distance",
        "gesture",
        "angle"
      ],
      "correctIndex": 2,
      "explanation": "The program names its recognition-result variable gesture.",
      "hint": "Follow the variable that stores the vision result."
    },
    {
      "id": "l4-oscillating-fan-08",
      "topic": "program-variables",
      "learningSlide": 15,
      "prompt": "Why save the vision result to a variable?",
      "choices": [
        "To test the recognition code in later conditions",
        "To replace every motor",
        "To delete the camera",
        "To move the fan manually"
      ],
      "correctIndex": 0,
      "explanation": "A variable makes the recognition code available to speed-control decisions.",
      "hint": "Follow the variable that stores the vision result."
    },
    {
      "id": "l4-oscillating-fan-09",
      "topic": "fan-speed-control",
      "learningSlide": 16,
      "prompt": "What happens when the gesture variable is 1?",
      "choices": [
        "The fan stops",
        "The fan reverses",
        "The fan runs at maximum speed",
        "The fan runs slowly"
      ],
      "correctIndex": 3,
      "explanation": "The program assigns low-speed operation to code 1.",
      "hint": "Match sensor result numbers to fan behavior."
    },
    {
      "id": "l4-oscillating-fan-10",
      "topic": "fan-speed-control",
      "learningSlide": 18,
      "prompt": "Which gesture code stops the fan?",
      "choices": [
        "0",
        "1",
        "2",
        "3"
      ],
      "correctIndex": 3,
      "explanation": "Slide 18 maps recognition code 3 to motor stop.",
      "hint": "Match sensor result numbers to fan behavior."
    }
  ]
};
