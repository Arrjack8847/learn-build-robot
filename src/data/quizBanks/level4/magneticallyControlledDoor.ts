/** Level 4 — Magnetically Controlled Door. Questions checked against the 24-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const magneticallyControlledDoorBank: QuizBank = {
  "projectId": "level-4-magnetically-controlled-door",
  "title": "Magnetically Controlled Door",
  "sourcePdfPath": "public/Level 4/Autonomous Navigation & Ranging/Magnetically Controlled Door/06. Magnetically controlled door-Teaching Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "l4-magneticallycontrolleddoor-01",
      "topic": "magnetic-field",
      "learningSlide": 4,
      "prompt": "What is the invisible region around a magnet called?",
      "choices": [
        "A magnetic field",
        "A sound wave",
        "A light beam",
        "An electric motor"
      ],
      "correctIndex": 0,
      "explanation": "Slide 4 describes the invisible magnetic field around magnets.",
      "hint": "Think about how magnets can affect things without touching them."
    },
    {
      "id": "l4-magneticallycontrolleddoor-02",
      "topic": "magnetic-field",
      "learningSlide": 4,
      "prompt": "Outside a magnet, which way do magnetic field lines go?",
      "choices": [
        "In no direction",
        "South to north",
        "North to south",
        "Up only"
      ],
      "correctIndex": 2,
      "explanation": "Slide 4 says field lines outside the magnet travel from north to south.",
      "hint": "Remember the two ends of a magnet."
    },
    {
      "id": "l4-magneticallycontrolleddoor-03",
      "topic": "magnetic-sensing",
      "learningSlide": 5,
      "prompt": "Which sensor can measure magnetic field strength?",
      "choices": [
        "Touch sensor",
        "Sound sensor",
        "Temperature sensor",
        "Magnetic sensor"
      ],
      "correctIndex": 3,
      "explanation": "Slide 5 introduces magnetic sensors for detecting magnetic fields.",
      "hint": "Think about what physical property this door detects."
    },
    {
      "id": "l4-magneticallycontrolleddoor-04",
      "topic": "magnetic-sensing",
      "learningSlide": 15,
      "prompt": "Why does the lesson measure the magnet before setting a threshold?",
      "choices": [
        "The door measures sound",
        "Different magnets can give different strengths",
        "All magnets are identical",
        "The motor has no battery"
      ],
      "correctIndex": 1,
      "explanation": "Slide 15 says magnetic field strength differs between magnets and needs testing.",
      "hint": "Think about comparing real sensor readings."
    },
    {
      "id": "l4-magneticallycontrolleddoor-05",
      "topic": "door-hardware",
      "learningSlide": 12,
      "prompt": "Which sensor is shown on the magnetic door model?",
      "choices": [
        "Color sensor",
        "Magnetic sensor",
        "Infrared camera",
        "Ultrasonic sensor"
      ],
      "correctIndex": 1,
      "explanation": "Slide 12 labels the magnetic sensor on the door build.",
      "hint": "The door responds when a magnet approaches."
    },
    {
      "id": "l4-magneticallycontrolleddoor-06",
      "topic": "door-hardware",
      "learningSlide": 12,
      "prompt": "Which parts move the door in the model?",
      "choices": [
        "A paintbrush and ruler",
        "A speaker and screen",
        "A battery alone",
        "Gears and a motor"
      ],
      "correctIndex": 3,
      "explanation": "Slide 12 labels gears and motor as the door-moving mechanism.",
      "hint": "Think about what produces and transfers movement."
    },
    {
      "id": "l4-magneticallycontrolleddoor-07",
      "topic": "threshold-check",
      "learningSlide": 16,
      "prompt": "In the lesson's example, what sensor reading opens the magnetic door?",
      "choices": [
        "Less than 100",
        "Less than 1600",
        "Greater than 1600",
        "Exactly zero"
      ],
      "correctIndex": 2,
      "explanation": "Slide 16 sets the opening condition to magnetic intensity greater than 1600.",
      "hint": "Compare the reading with the set value."
    },
    {
      "id": "l4-magneticallycontrolleddoor-08",
      "topic": "threshold-check",
      "learningSlide": 19,
      "prompt": "What happens when the magnetic sensor reading does not exceed 1600?",
      "choices": [
        "The motor stays still",
        "The motor always speeds up",
        "The door opens every second",
        "The buzzer plays"
      ],
      "correctIndex": 0,
      "explanation": "Slide 19 says the motor does not rotate if the reading does not exceed 1600.",
      "hint": "The opening condition has not been met."
    },
    {
      "id": "l4-magneticallycontrolleddoor-09",
      "topic": "door-program",
      "learningSlide": 18,
      "prompt": "How long does the programmed door stay open after the magnetic threshold is met?",
      "choices": [
        "10 seconds",
        "1 second",
        "2 seconds",
        "3 seconds"
      ],
      "correctIndex": 3,
      "explanation": "Slide 18 opens the door for three seconds before closing it.",
      "hint": "Remember the waiting period before the motor closes the door."
    },
    {
      "id": "l4-magneticallycontrolleddoor-10",
      "topic": "door-program",
      "learningSlide": 18,
      "prompt": "Why does the program wait one second after closing?",
      "choices": [
        "To make a louder sound",
        "To avoid repeatedly opening and closing immediately",
        "To charge the magnet",
        "To change the door color"
      ],
      "correctIndex": 1,
      "explanation": "Slide 18 adds a wait to prevent repeated triggering from a nearby magnet.",
      "hint": "Think about what happens if the same magnet is still there."
    }
  ]
};
