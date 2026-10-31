/** Verified against the Level 3 official Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const bumperCarFoundationalBank: QuizBank = {
  "projectId": "level-3-bumper-car-foundational-robots",
  "title": "Bumper Car — Foundational Robots",
  "sourcePdfPath": "public/Level 3/Learning/Foundational Robots/Bumper car.pdf",
  "sourcePageCount": 12,
  "questions": [
    {
      "id": "bumpercarfou-01",
      "topic": "power-source",
      "learningSlide": 2,
      "prompt": "How did the traditional bumper cars described in the lesson receive electric power?",
      "choices": [
        "Through a ceiling grid and a wire to the car",
        "Through solar panels below the seat",
        "Through a hydraulic pump outside the arena",
        "Through magnetic energy stored in the tires"
      ],
      "correctIndex": 0,
      "hint": "The lesson describes an overhead connection.",
      "explanation": "Slide 2 explains the electrified ceiling grid and wire supply."
    },
    {
      "id": "bumpercarfou-02",
      "topic": "power-source",
      "learningSlide": 3,
      "prompt": "What must be prepared before using a modern battery-powered bumper car?",
      "choices": [
        "Remove its steering control",
        "Charge its built-in battery",
        "Disconnect all power",
        "Install a ceiling power wire every trip"
      ],
      "correctIndex": 1,
      "hint": "The lesson contrasts battery power with ceiling-grid power.",
      "explanation": "Slide 3 explains that newer bumper cars use rechargeable batteries."
    },
    {
      "id": "bumpercarfou-03",
      "topic": "collision-design",
      "learningSlide": 4,
      "prompt": "What is the purpose of inflatable rubber around a bumper car?",
      "choices": [
        "Increase the impact force",
        "Make the car impossible to steer",
        "Absorb and cushion collisions",
        "Measure travel distance"
      ],
      "correctIndex": 2,
      "hint": "Think about how a soft surround changes a bump.",
      "explanation": "Slide 4 attributes impact cushioning to the inflatable rubber surround."
    },
    {
      "id": "bumpercarfou-04",
      "topic": "collision-design",
      "learningSlide": 5,
      "prompt": "Why does the lesson emphasize keeping bumper car speed relatively low?",
      "choices": [
        "Lower speed makes brakes unnecessary",
        "Higher speed always makes a collision harmless",
        "Speed has no relation to impact",
        "Lower speed reduces the damage of a collision"
      ],
      "correctIndex": 3,
      "hint": "Consider how movement speed affects a collision.",
      "explanation": "Slide 5 relates higher speed to greater collision damage."
    },
    {
      "id": "bumpercarfou-05",
      "topic": "sensing-targets",
      "learningSlide": 10,
      "prompt": "What sensor is used to find an object before the model bumper car accelerates toward it?",
      "choices": [
        "Infrared sensor",
        "Temperature probe",
        "Barometric sensor",
        "Wheel encoder only"
      ],
      "correctIndex": 0,
      "hint": "One sensor detects a target without contact.",
      "explanation": "Slide 10 instructs the robot to accelerate when its infrared sensor finds an object."
    },
    {
      "id": "bumpercarfou-06",
      "topic": "sensing-targets",
      "learningSlide": 10,
      "prompt": "Which sensor can tell the model bumper car it has physically hit something?",
      "choices": [
        "Ultrasonic distance display only",
        "Touch sensor",
        "Gyroscope alone",
        "Photoelectric color probe"
      ],
      "correctIndex": 1,
      "hint": "The signal occurs at the moment of physical contact.",
      "explanation": "Slide 10 uses the touch sensor to detect a collision."
    },
    {
      "id": "bumpercarfou-07",
      "topic": "programming-motion",
      "learningSlide": 10,
      "prompt": "What does the robot do while it searches for a target?",
      "choices": [
        "Travel backward continuously",
        "Keep both motors stopped",
        "Rotate in place",
        "Open and close a door"
      ],
      "correctIndex": 2,
      "hint": "The search action changes its facing direction.",
      "explanation": "Slide 10 describes rotating in place to find a target."
    },
    {
      "id": "bumpercarfou-08",
      "topic": "programming-motion",
      "learningSlide": 12,
      "prompt": "Which basic motor capability does the project summary say was programmed?",
      "choices": [
        "Transmit wireless video",
        "Measure pressure without moving",
        "Turn light into electrical power",
        "Control rotation of a single motor"
      ],
      "correctIndex": 3,
      "hint": "The project centers on a simple movement controller.",
      "explanation": "Slide 12 summarizes programming the rotation of a single motor."
    },
    {
      "id": "bumpercarfou-09",
      "topic": "bumper-improvement",
      "learningSlide": 11,
      "prompt": "Which physical improvement is suggested for a stronger bumper car?",
      "choices": [
        "Reinforce its wheels and body",
        "Remove the wheels",
        "Loosen every connector",
        "Remove all body supports"
      ],
      "correctIndex": 0,
      "hint": "Think about keeping the model stable during contact.",
      "explanation": "Slide 11 proposes reinforcing the wheels and body."
    },
    {
      "id": "bumpercarfou-10",
      "topic": "bumper-improvement",
      "learningSlide": 4,
      "prompt": "What would most directly improve cushioning when two bumper cars touch?",
      "choices": [
        "A rigid exposed metal corner",
        "A resilient rubber bumper around the body",
        "A disconnected controller",
        "An uncovered wheel axle"
      ],
      "correctIndex": 1,
      "hint": "The design should soften the force transferred during contact.",
      "explanation": "Slide 4 describes the soft rubber surround as a cushioning layer."
    }
  ]
};
