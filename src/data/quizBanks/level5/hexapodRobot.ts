/** Verified against the official 21-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const hexapodRobotBank: QuizBank = {
  "projectId": "level-5-hexapod-robot",
  "title": "Hexapod Robot",
  "sourcePdfPath": "public/Level 5/Learning/Vehicles & Complex Movers/Hexapod Robot/21. Hexapod Robot-Teaching Slides.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "level-5-hexapod-robot-01",
      "topic": "biomimicry",
      "learningSlide": 4,
      "prompt": "Which natural animals inspired the design of hexapod robots in the lesson?",
      "choices": [
        "Fish with fins",
        "Six-legged insects",
        "Birds with wings",
        "Snakes with no legs"
      ],
      "correctIndex": 1,
      "hint": "Hexa means six, and the lesson mentions ants.",
      "explanation": "Slide 4 describes insects, including ants and dragonflies, as models for six-legged robots."
    },
    {
      "id": "level-5-hexapod-robot-02",
      "topic": "biomimicry",
      "learningSlide": 5,
      "prompt": "How many pairs of legs do insects have, as described in the lesson?",
      "choices": [
        "One pair",
        "Two pairs",
        "Three pairs",
        "Four pairs"
      ],
      "correctIndex": 2,
      "hint": "The six legs are organized in pairs.",
      "explanation": "Slide 5 identifies the three pairs as front, middle and hind legs."
    },
    {
      "id": "level-5-hexapod-robot-03",
      "topic": "tripod-gait",
      "learningSlide": 5,
      "prompt": "In the insect walking pattern discussed, how many legs form one supporting group?",
      "choices": [
        "Two",
        "Three",
        "Four",
        "Six"
      ],
      "correctIndex": 1,
      "hint": "Half of the six legs support a walking phase.",
      "explanation": "Slide 5 describes one group of three legs supporting movement while the other group advances."
    },
    {
      "id": "level-5-hexapod-robot-04",
      "topic": "tripod-gait",
      "learningSlide": 5,
      "prompt": "Which set can form one of the insect's walking support groups?",
      "choices": [
        "Both front legs and both hind legs",
        "Front and hind leg on one side, plus middle leg on the other",
        "Only the middle legs",
        "All three legs on one side, always"
      ],
      "correctIndex": 1,
      "hint": "The pattern crosses sides to distribute support.",
      "explanation": "Slide 5 describes a support tripod consisting of front and rear legs on one side and the opposite middle leg."
    },
    {
      "id": "level-5-hexapod-robot-05",
      "topic": "linkage-and-mechanism",
      "learningSlide": 8,
      "prompt": "Which linkage does the lesson name as a common way to imitate walking?",
      "choices": [
        "Chebyshev linkage",
        "Rack-and-pinion steering",
        "Camshaft valve train",
        "Hydraulic press"
      ],
      "correctIndex": 0,
      "hint": "It is named after a mathematician.",
      "explanation": "Slide 8 identifies the Chebyshev linkage mechanism as a way to simulate walking motion."
    },
    {
      "id": "level-5-hexapod-robot-06",
      "topic": "linkage-and-mechanism",
      "learningSlide": 10,
      "prompt": "Which hardware components are labeled on the classroom hexapod model?",
      "choices": [
        "GPS and satellite dish",
        "Linkage and ultrasonic sensor",
        "Magnetic lock and camera only",
        "Speaker and laser scanner only"
      ],
      "correctIndex": 1,
      "hint": "One component makes the legs move; the other senses distance.",
      "explanation": "Slide 10 labels the linkage mechanism and the ultrasonic sensor on the model."
    },
    {
      "id": "level-5-hexapod-robot-07",
      "topic": "distance-control",
      "learningSlide": 13,
      "prompt": "What must the controller repeatedly read and display to steer the hexapod using its lesson program?",
      "choices": [
        "Battery's manufacture date",
        "The ultrasonic sensor value",
        "Ambient room color",
        "An employee's attendance ID"
      ],
      "correctIndex": 1,
      "hint": "The program reacts to a measured distance.",
      "explanation": "Slide 13 requires repeatedly reading and displaying data from the ultrasonic sensor."
    },
    {
      "id": "level-5-hexapod-robot-08",
      "topic": "distance-control",
      "learningSlide": 15,
      "prompt": "What does the sample hexapod program do when the measured object distance is too small?",
      "choices": [
        "Stop moving",
        "Always accelerate forward",
        "Fly upward",
        "Play a welcome message"
      ],
      "correctIndex": 0,
      "hint": "The robot should avoid moving too close.",
      "explanation": "Slide 15 assigns the stop action to the 'too close' distance case."
    },
    {
      "id": "level-5-hexapod-robot-09",
      "topic": "motor-and-extension",
      "learningSlide": 12,
      "prompt": "Which motors does the movement function control in the lesson?",
      "choices": [
        "M1 and M2",
        "M3 and M4",
        "P1 and P2",
        "P7 and P8"
      ],
      "correctIndex": 1,
      "hint": "The function names two specific M-labeled connections.",
      "explanation": "Slide 12 assigns its two movement parameters to motors M3 and M4."
    },
    {
      "id": "level-5-hexapod-robot-10",
      "topic": "motor-and-extension",
      "learningSlide": 19,
      "prompt": "What improvement does the extension task request for the hexapod's steering?",
      "choices": [
        "Turn by moving both sides' legs simultaneously",
        "Remove the legs and use only wheels",
        "Replace the distance sensor with a clock",
        "Keep the robot motionless"
      ],
      "correctIndex": 0,
      "hint": "The extension focuses on coordinating leg motion.",
      "explanation": "Slide 19 proposes simultaneously moving the legs on both sides to achieve steering."
    }
  ]
};
