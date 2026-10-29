/** Level 4 — Obstacle Avoidance Robot 2. Questions checked against the 21-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const obstacleAvoidanceRobot2Bank: QuizBank = {
  "projectId": "level-4-obstacle-avoidance-robot-2",
  "title": "Obstacle Avoidance Robot 2",
  "sourcePdfPath": "public/Level 4/Autonomous Navigation & Ranging/Obstacle Avoidance Robot 2/Obstacle Avoidance Robot 2_Powerpoint.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "l4-obstacleavoidancerobot2-01",
      "topic": "ultrasound-basics",
      "learningSlide": 8,
      "prompt": "What does an ultrasonic sensor send out to measure distance?",
      "choices": [
        "Sound waves",
        "Colored light",
        "A metal pin",
        "Water drops"
      ],
      "correctIndex": 0,
      "explanation": "Slide 8 describes transmitting ultrasonic waves and receiving their reflections.",
      "hint": "Think about the signal that travels to an obstacle and back."
    },
    {
      "id": "l4-obstacleavoidancerobot2-02",
      "topic": "ultrasound-basics",
      "learningSlide": 9,
      "prompt": "Why does the robot measure how far an obstacle is?",
      "choices": [
        "To choose different movement actions",
        "To change its paint color",
        "To count classroom chairs",
        "To play longer songs"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 says the robot performs different actions depending on obstacle distance.",
      "hint": "Think about how knowing a distance can prevent collisions."
    },
    {
      "id": "l4-obstacleavoidancerobot2-03",
      "topic": "distance-ranges",
      "learningSlide": 11,
      "prompt": "Which of these ranges appears in the lesson's distance test?",
      "choices": [
        "5–25 cm",
        "1–2 km",
        "200–500 m",
        "1000–2000 cm"
      ],
      "correctIndex": 0,
      "explanation": "Slide 11 lists 5–25, 25–50, and 50–75 centimeters as test intervals.",
      "hint": "Think about distances close to a small robot."
    },
    {
      "id": "l4-obstacleavoidancerobot2-04",
      "topic": "distance-ranges",
      "learningSlide": 11,
      "prompt": "Which interval comes after 25–50 cm in the lesson?",
      "choices": [
        "0–5 cm",
        "50–75 cm",
        "100–125 cm",
        "200–250 cm"
      ],
      "correctIndex": 1,
      "explanation": "Slide 11 lists 50–75 centimeters after 25–50 centimeters.",
      "hint": "Follow the next range in the sequence."
    },
    {
      "id": "l4-obstacleavoidancerobot2-05",
      "topic": "assembly-rules",
      "learningSlide": 14,
      "prompt": "Which is an assembly requirement for the obstacle-avoiding robot?",
      "choices": [
        "A stable structure",
        "A loose wheel",
        "An unsupported sensor",
        "No controller"
      ],
      "correctIndex": 0,
      "explanation": "Slide 14 lists a stable structure.",
      "hint": "Think about keeping the robot together as it moves."
    },
    {
      "id": "l4-obstacleavoidancerobot2-06",
      "topic": "assembly-rules",
      "learningSlide": 14,
      "prompt": "Before testing movement, what should the robot's shape do?",
      "choices": [
        "Match the planned design",
        "Copy the teacher's desk",
        "Avoid all wheels",
        "Change with the room temperature"
      ],
      "correctIndex": 0,
      "explanation": "Slide 14 includes matching the model shape to the intended design.",
      "hint": "Check the physical model against the plan."
    },
    {
      "id": "l4-obstacleavoidancerobot2-07",
      "topic": "distance-decisions",
      "learningSlide": 17,
      "prompt": "In Task 1, what should the robot do when an obstacle is less than 50 cm away?",
      "choices": [
        "Slow down",
        "Speed up",
        "Switch off forever",
        "Ignore the obstacle"
      ],
      "correctIndex": 0,
      "explanation": "Slide 17 specifies slowing down when the distance is below 50 cm.",
      "hint": "The robot reacts more carefully as it gets closer."
    },
    {
      "id": "l4-obstacleavoidancerobot2-08",
      "topic": "distance-decisions",
      "learningSlide": 17,
      "prompt": "In Task 1, what should the robot do when an obstacle is less than 25 cm away?",
      "choices": [
        "Avoid the obstacle",
        "Drive faster forward",
        "Play a melody only",
        "Change its color"
      ],
      "correctIndex": 0,
      "explanation": "Slide 17 requires obstacle avoidance below 25 centimeters.",
      "hint": "Think about what to do when the obstacle is very near."
    },
    {
      "id": "l4-obstacleavoidancerobot2-09",
      "topic": "warning-and-control",
      "learningSlide": 18,
      "prompt": "In Task 2, when does the robot give a sound warning?",
      "choices": [
        "When an obstacle is less than 75 cm away",
        "Only when it reaches 0 cm",
        "Only after the power is off",
        "When a wheel changes color"
      ],
      "correctIndex": 0,
      "explanation": "Slide 18 adds an alert when obstacle distance is below 75 centimeters.",
      "hint": "A warning can happen before slowing down."
    },
    {
      "id": "l4-obstacleavoidancerobot2-10",
      "topic": "warning-and-control",
      "learningSlide": 16,
      "prompt": "Which programming feature helps the robot select actions for different distances?",
      "choices": [
        "If conditions",
        "Music notes",
        "Image cropping",
        "Text font size"
      ],
      "correctIndex": 0,
      "explanation": "Slide 16 shows branching distance comparisons to choose movement actions.",
      "hint": "Think about a program making a choice based on a sensor reading."
    }
  ]
};
