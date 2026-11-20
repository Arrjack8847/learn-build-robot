/** Checked against Following Robot Learning PDF slide text. */
import type { QuizBank } from "../quizStudio";
export const followingRobotBank: QuizBank = {
  "projectId": "level-3-following-robot",
  "title": "Following Robot",
  "sourcePdfPath": "public/Level 3/Learning/Autonomous Navigation & Ranging/Following Robot/Following Robot_Powerpoint.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "fol01",
      "topic": "following",
      "learningSlide": 6,
      "prompt": "What are the two essential steps in following a target?",
      "choices": [
        "Locate the target, then follow it",
        "Read sound, then play music",
        "Measure pressure, then show altitude",
        "Measure brightness, then change color"
      ],
      "correctIndex": 0,
      "explanation": "The introduction identifies finding a target and then following it.",
      "hint": "Think about information needed before moving toward someone."
    },
    {
      "id": "fol02",
      "topic": "following",
      "learningSlide": 6,
      "prompt": "What additional ability helps a following robot avoid hitting things?",
      "choices": [
        "Music playback",
        "Light color selection",
        "Obstacle recognition and avoidance",
        "Temperature display"
      ],
      "correctIndex": 2,
      "explanation": "The lesson adds recognizing and avoiding obstacles.",
      "hint": "Think about what may block the target's path."
    },
    {
      "id": "fol03",
      "topic": "ultrasonic",
      "learningSlide": 7,
      "prompt": "What does the ultrasonic module measure for the follower?",
      "choices": [
        "Air pressure outside",
        "Distance to objects ahead",
        "Brightness of the floor",
        "Motor temperature"
      ],
      "correctIndex": 1,
      "explanation": "Slide 7 uses ultrasonic ranging to measure forward distance.",
      "hint": "Think of the measurement that maintains a safe gap."
    },
    {
      "id": "fol04",
      "topic": "ultrasonic",
      "learningSlide": 9,
      "prompt": "How is distance calculated using reflected ultrasonic sound?",
      "choices": [
        "Color of the surface",
        "Temperature of the RCU",
        "Wheel turns since startup",
        "Time between pulse and echo"
      ],
      "correctIndex": 3,
      "explanation": "The lesson measures the timing difference between transmission and echo.",
      "hint": "Think about how long a reflection takes to return."
    },
    {
      "id": "fol05",
      "topic": "software",
      "learningSlide": 12,
      "prompt": "Which group of comparison operators is shown in the lesson?",
      "choices": [
        "+, −, ×",
        "Play, pause, stop",
        "Open, close, reset",
        "<, >, ="
      ],
      "correctIndex": 3,
      "explanation": "Slide 12 lists <, > and = operators.",
      "hint": "Think about comparing a measurement to a set distance."
    },
    {
      "id": "fol06",
      "topic": "software",
      "learningSlide": 18,
      "prompt": "Where does the lesson display the measured distance on the screen?",
      "choices": [
        "x0, y0",
        "x20, y20",
        "x120, y60",
        "x200, y200"
      ],
      "correctIndex": 1,
      "explanation": "Slide 18 specifies the display coordinates x20 and y20.",
      "hint": "Recall the numbers in the display-position task."
    },
    {
      "id": "fol07",
      "topic": "distance-rule",
      "learningSlide": 19,
      "prompt": "What happens when the distance is greater than 20 cm in this lesson's program?",
      "choices": [
        "Stop",
        "Reverse immediately",
        "Move forward",
        "Disable the sensor"
      ],
      "correctIndex": 2,
      "explanation": "The program advances if the distance exceeds 20 cm.",
      "hint": "Compare a measured distance with the 20 cm threshold."
    },
    {
      "id": "fol08",
      "topic": "distance-rule",
      "learningSlide": 19,
      "prompt": "What does the robot do when an object is 20 cm away or closer?",
      "choices": [
        "Stop",
        "Speed up",
        "Continue forward at full speed",
        "Change to music mode"
      ],
      "correctIndex": 0,
      "explanation": "The slide says to stop when distance is less than or equal to 20 cm.",
      "hint": "Think about which branch includes the boundary value."
    },
    {
      "id": "fol09",
      "topic": "building",
      "learningSlide": 14,
      "prompt": "What is part of the Following Robot's assembly checklist?",
      "choices": [
        "Stable structure",
        "Loose connectors",
        "Open motor casing",
        "Unsupported tower"
      ],
      "correctIndex": 0,
      "explanation": "Stability is one of the lesson's assembly requirements.",
      "hint": "Consider how to keep the frame upright while moving."
    },
    {
      "id": "fol10",
      "topic": "building",
      "learningSlide": 17,
      "prompt": "What reading does the first programming task show on the controller?",
      "choices": [
        "Pressure reading",
        "Camera color value",
        "Battery temperature",
        "Ultrasonic distance"
      ],
      "correctIndex": 3,
      "explanation": "The first task displays the ultrasonic ranging value.",
      "hint": "Recall the sensor used to decide whether to advance."
    }
  ]
};
