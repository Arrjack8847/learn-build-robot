/** Source-checked Learning PDF questions for Clip Robot. */
import type { QuizBank } from "../quizStudio";

export const clipRobotBank: QuizBank = {
  "projectId": "level-3-clip-robot",
  "title": "Clip Robot",
  "sourcePdfPath": "public/Level 3/Learning/Action-Oriented/Clip robot/Clip robot_Powerpoint.pdf",
  "sourcePageCount": 17,
  "questions": [
    {
      "id": "clip-01",
      "topic": "robot-structure",
      "prompt": "What is the Clip Robot designed to do?",
      "choices": [
        "Grip an object",
        "Measure room temperature",
        "Project a video",
        "Draw with a pen"
      ],
      "correctIndex": 0,
      "learningSlide": 7,
      "explanation": "The lesson describes a robot arm with a clip-like structure for gripping objects.",
      "hint": "Think about a robotic hand closing around something."
    },
    {
      "id": "clip-02",
      "topic": "robot-structure",
      "prompt": "Which motor controls the clip mechanism in the lesson?",
      "choices": [
        "A medium-sized motor",
        "A large jet engine",
        "A wind turbine",
        "A water pump"
      ],
      "correctIndex": 0,
      "learningSlide": 7,
      "explanation": "Slide 7 states that a medium-sized motor controls the clip.",
      "hint": "Look for the motor connected to the gripper rather than the base."
    },
    {
      "id": "clip-03",
      "topic": "encoder-zeroing",
      "prompt": "What does encoder zeroing let you do?",
      "choices": [
        "Treat a chosen code value as the new zero point",
        "Remove the robot's power supply",
        "Make the arm weightless",
        "Delete every program"
      ],
      "correctIndex": 0,
      "learningSlide": 9,
      "explanation": "Encoder zeroing redefines a chosen motor encoder reading as zero.",
      "hint": "Think about how you choose a reference position for a motor."
    },
    {
      "id": "clip-04",
      "topic": "encoder-zeroing",
      "prompt": "Which programming module is named for setting the encoder zero point?",
      "choices": [
        "Motor Encoder — Encoder Zeroing",
        "Set LED Color",
        "Play Sound",
        "Read Ultrasonic Sensor"
      ],
      "correctIndex": 0,
      "learningSlide": 9,
      "explanation": "The lesson names the Motor Encoder–Encoder Zeroing module.",
      "hint": "Recall the word used for the motor's position reading."
    },
    {
      "id": "clip-05",
      "topic": "power",
      "prompt": "What does power describe in this lesson?",
      "choices": [
        "How quickly work is done",
        "How heavy the robot looks",
        "How bright the robot's color is",
        "How many parts the box contains"
      ],
      "correctIndex": 0,
      "learningSlide": 10,
      "explanation": "The PDF defines power as work done per unit of time.",
      "hint": "Compare doing the same task quickly or slowly."
    },
    {
      "id": "clip-06",
      "topic": "power",
      "prompt": "If two motors do the same amount of work, which one has greater power?",
      "choices": [
        "The one that finishes in less time",
        "The one with the larger label",
        "The one that starts later",
        "They always have identical power"
      ],
      "correctIndex": 0,
      "learningSlide": 10,
      "explanation": "For equal work, a shorter completion time means greater power.",
      "hint": "Keep the amount of work unchanged and compare the time."
    },
    {
      "id": "clip-07",
      "topic": "motor-settings",
      "prompt": "Which module does the Clip Robot lesson use to choose motor power?",
      "choices": [
        "Set Motor Power",
        "Set Camera Focus",
        "Read Distance",
        "Play Music"
      ],
      "correctIndex": 0,
      "learningSlide": 10,
      "explanation": "Slide 10 names the Set Motor Power module for selecting power and port.",
      "hint": "Look for the control block that changes the motor's output."
    },
    {
      "id": "clip-08",
      "topic": "motor-settings",
      "prompt": "Besides the power value, what else must be selected in the motor power module?",
      "choices": [
        "The motor port",
        "The classroom number",
        "The robot's paint color",
        "The title slide"
      ],
      "correctIndex": 0,
      "learningSlide": 10,
      "explanation": "The lesson explicitly says the Set Motor Power module chooses a power value and port.",
      "hint": "Think about how the code knows which connected motor to control."
    },
    {
      "id": "clip-09",
      "topic": "programming",
      "prompt": "In the lesson's example, what power setting is used to close the clip?",
      "choices": [
        "50",
        "0",
        "-50",
        "100"
      ],
      "correctIndex": 0,
      "learningSlide": 14,
      "explanation": "The example closes the clamp for two seconds with motor power set to 50.",
      "hint": "Compare the example's settings for closing and opening."
    },
    {
      "id": "clip-10",
      "topic": "programming",
      "prompt": "In the lesson's example, which setting opens the clip again?",
      "choices": [
        "Motor power -50",
        "Motor power 50",
        "Motor power 0",
        "Encoder zeroing only"
      ],
      "correctIndex": 0,
      "learningSlide": 14,
      "explanation": "The lesson uses -50 to open the clip back toward its original position.",
      "hint": "Think about how the example reverses the movement."
    }
  ]
};
