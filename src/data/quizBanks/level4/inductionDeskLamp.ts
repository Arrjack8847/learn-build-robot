/** Level 4 Learning PDF text checked page by page; no unreviewed diagrams assumed. */
import type { QuizBank } from "../../quizStudio";

export const inductionDeskLampBank: QuizBank = {
  "projectId": "level-4-induction-desk-lamp",
  "title": "Induction Desk Lamp",
  "sourcePdfPath": "public/Level 4/Illumination & Signals/Induction Desk Lamp/13. Induction Desk Lamp-Teaching Slides.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "l4-il-01",
      "topic": "infrared-reflection",
      "learningSlide": 5,
      "prompt": "How does the induction lamp detect that a person or hand is near?",
      "choices": [
        "It weighs the moving hand",
        "It listens for a doorbell",
        "It detects infrared light reflected from an object",
        "It measures the room's air pressure"
      ],
      "correctIndex": 2,
      "explanation": "Slide 5 describes emitted infrared light reflecting back to a receiver.",
      "hint": "The sensor sends light out and detects what returns."
    },
    {
      "id": "l4-il-02",
      "topic": "infrared-reflection",
      "learningSlide": 8,
      "prompt": "What pair of components is built into the infrared ranging sensor?",
      "choices": [
        "An infrared emitting LED and an infrared receiving LED",
        "A compass and speaker",
        "Two electric motors",
        "A battery and a keyboard"
      ],
      "correctIndex": 0,
      "explanation": "Slide 8 explicitly identifies emitting and receiving infrared LEDs.",
      "hint": "One emits light and the other receives reflected light."
    },
    {
      "id": "l4-il-03",
      "topic": "sensor-range",
      "learningSlide": 7,
      "prompt": "What approximate distance span does the lesson say the sensor grades?",
      "choices": [
        "100–200 metres",
        "2–20 centimetres",
        "10–20 metres",
        "1–2 kilometres"
      ],
      "correctIndex": 1,
      "explanation": "Slide 7 describes approximate ranging over 2–20 cm.",
      "hint": "This sensor is intended for nearby objects."
    },
    {
      "id": "l4-il-04",
      "topic": "sensor-range",
      "learningSlide": 9,
      "prompt": "What values does the sensor return to represent detected infrared intensity?",
      "choices": [
        "Degrees Celsius",
        "Kilograms",
        "Metres per second",
        "Numbers from 1 to 10 without a physical unit"
      ],
      "correctIndex": 3,
      "explanation": "Slide 9 gives returned values of 1–10 rather than exact distance units.",
      "hint": "Think of grades rather than a precise centimetre measurement."
    },
    {
      "id": "l4-il-05",
      "topic": "environmental-effects",
      "learningSlide": 7,
      "prompt": "Which condition should students avoid for reliable measurements?",
      "choices": [
        "Direct sunlight on the sensor",
        "A clean desk",
        "A stable lamp base",
        "A nearby hand"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 warns direct sunlight can affect results.",
      "hint": "What external light source interferes with infrared sensing?"
    },
    {
      "id": "l4-il-06",
      "topic": "environmental-effects",
      "learningSlide": 9,
      "prompt": "Why should students repeat measurements under different orientations?",
      "choices": [
        "The lamp always has a dead battery",
        "Every sample is required to be zero",
        "Ambient light and sensor direction can change readings",
        "The sensor detects only music"
      ],
      "correctIndex": 2,
      "explanation": "Slide 9 explains environmental light and directional differences can change data.",
      "hint": "The same spot can produce varying results."
    },
    {
      "id": "l4-il-07",
      "topic": "wave-toggle",
      "learningSlide": 12,
      "prompt": "What does the lamp actually detect when a hand is waved?",
      "choices": [
        "The person's name",
        "Presence of an object within sensor range",
        "The angle of each finger",
        "The speed of the hand in kilometres per hour"
      ],
      "correctIndex": 1,
      "explanation": "Slide 12 states that it detects presence/absence rather than gesture motion itself.",
      "hint": "It senses a nearby object, not the meaning of a gesture."
    },
    {
      "id": "l4-il-08",
      "topic": "wave-toggle",
      "learningSlide": 14,
      "prompt": "What does the sample program do when the reading is below 10 and the lamp is off?",
      "choices": [
        "Keep the lamp permanently off",
        "Rotate a robot wheel",
        "Disable the sensor",
        "Turn on the lamp"
      ],
      "correctIndex": 3,
      "explanation": "Slide 14 treats a value below 10 as a trigger to switch the lamp on.",
      "hint": "The first wave switches lighting on."
    },
    {
      "id": "l4-il-09",
      "topic": "switching-logic",
      "learningSlide": 15,
      "prompt": "What happens when another hand wave is detected while the lamp is already on?",
      "choices": [
        "The lamp turns off",
        "The lamp changes into a motor",
        "The infrared sensor becomes a microphone",
        "The program deletes itself"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 explains the second detection switches the lamp off.",
      "hint": "The second wave should reverse the lamp's state."
    },
    {
      "id": "l4-il-10",
      "topic": "switching-logic",
      "learningSlide": 19,
      "prompt": "What does the lesson ask students to adjust to detect a hand at a longer distance?",
      "choices": [
        "The lamp's paint color",
        "The controller's font only",
        "The threshold or judgement parameters",
        "The number of desk legs"
      ],
      "correctIndex": 2,
      "explanation": "Slide 19 asks for changes to detection judgement parameters for farther waves.",
      "hint": "Change the condition that decides whether a wave is present."
    }
  ]
};
