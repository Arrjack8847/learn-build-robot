/** Level 4 — Tumbler. Questions checked against the 28-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const tumblerBank: QuizBank = {
  "projectId": "level-4-tumbler",
  "title": "Tumbler",
  "sourcePdfPath": "public/Level 4/Interactive Systems/Tumbler/01. Tumbler - Teaching Slides.pdf",
  "sourcePageCount": 28,
  "questions": [
    {
      "id": "l4-tumbler-01",
      "topic": "tumbler-balance",
      "learningSlide": 4,
      "prompt": "Why does a tumbler toy tend to return upright?",
      "choices": [
        "It uses a QR code",
        "Its color changes",
        "Its center of gravity is low",
        "It has a loud speaker"
      ],
      "correctIndex": 2,
      "explanation": "Slide 4 explains that the toy's low center of gravity creates a stable upright balance.",
      "hint": "Think about where the toy's weight is concentrated."
    },
    {
      "id": "l4-tumbler-02",
      "topic": "tumbler-balance",
      "learningSlide": 5,
      "prompt": "What does the robot need to sense so it can correct its posture?",
      "choices": [
        "When it tilts",
        "When the weather changes",
        "When a ticket prints",
        "When music plays"
      ],
      "correctIndex": 0,
      "explanation": "Slide 5 introduces automatic correction when the robot tilts.",
      "hint": "The robot needs to know if it is upright."
    },
    {
      "id": "l4-tumbler-03",
      "topic": "euler-angles",
      "learningSlide": 7,
      "prompt": "Which three angles does the lesson use to describe orientation?",
      "choices": [
        "North, east, west",
        "Roll, pitch, yaw",
        "Speed, time, weight",
        "Red, blue, green"
      ],
      "correctIndex": 1,
      "explanation": "Slide 7 names roll, pitch, and yaw.",
      "hint": "Think about three different ways an object can turn."
    },
    {
      "id": "l4-tumbler-04",
      "topic": "euler-angles",
      "learningSlide": 9,
      "prompt": "Which angle describes the model tilting forward or backward?",
      "choices": [
        "Yaw",
        "Distance",
        "Roll",
        "Pitch"
      ],
      "correctIndex": 3,
      "explanation": "Slide 9 describes pitch as tilting forward and backward.",
      "hint": "Picture the nose of a plane moving up or down."
    },
    {
      "id": "l4-tumbler-05",
      "topic": "attitude-sensing",
      "learningSlide": 11,
      "prompt": "Which sensor measures the robot's tilt and orientation?",
      "choices": [
        "Ultrasonic sensor",
        "Color sensor",
        "Temperature sensor",
        "Attitude sensor"
      ],
      "correctIndex": 3,
      "explanation": "Slide 11 defines the attitude sensor.",
      "hint": "Think about measuring how the robot is positioned."
    },
    {
      "id": "l4-tumbler-06",
      "topic": "attitude-sensing",
      "learningSlide": 12,
      "prompt": "Which two devices inside the attitude sensor help measure motion?",
      "choices": [
        "Camera and printer",
        "Accelerometer and gyroscope",
        "Speaker and microphone",
        "Color lamp and buzzer"
      ],
      "correctIndex": 1,
      "explanation": "Slide 12 says the sensor uses a three-axis accelerometer and gyroscope.",
      "hint": "Think about sensing movement and turning."
    },
    {
      "id": "l4-tumbler-07",
      "topic": "sensor-readings",
      "learningSlide": 14,
      "prompt": "What should you do to a returned angle reading such as 1508 to get degrees?",
      "choices": [
        "Divide by 10",
        "Multiply by 10",
        "Add 100",
        "Subtract 1000"
      ],
      "correctIndex": 0,
      "explanation": "Slide 14 explains that the displayed angle needs to be divided by 10.",
      "hint": "Look for the scale conversion described in the lesson."
    },
    {
      "id": "l4-tumbler-08",
      "topic": "sensor-readings",
      "learningSlide": 18,
      "prompt": "Where should students show roll, pitch, and yaw readings when testing?",
      "choices": [
        "On the motor shaft",
        "On paper only",
        "On the controller screen",
        "On the robot's wheels"
      ],
      "correctIndex": 2,
      "explanation": "Slide 18 asks students to display all three angles.",
      "hint": "Think about how to see the sensor values."
    },
    {
      "id": "l4-tumbler-09",
      "topic": "self-righting",
      "learningSlide": 22,
      "prompt": "What should the robot do when it detects a fallen posture?",
      "choices": [
        "Only change its color",
        "Rotate its motor to return upright",
        "Print a barcode",
        "Stop sensing forever"
      ],
      "correctIndex": 1,
      "explanation": "Slide 22 programs motor rotation to restore the robot's normal posture.",
      "hint": "The goal is to correct the position."
    },
    {
      "id": "l4-tumbler-10",
      "topic": "self-righting",
      "learningSlide": 22,
      "prompt": "What should happen when the robot is not in a fallen posture?",
      "choices": [
        "It falls on purpose",
        "It turns off the sensor",
        "It opens a gate",
        "The correcting motor does not rotate"
      ],
      "correctIndex": 3,
      "explanation": "Slide 22 says the correction motor stays still when the falling condition is not met.",
      "hint": "No correction is needed when the posture is normal."
    }
  ]
};
