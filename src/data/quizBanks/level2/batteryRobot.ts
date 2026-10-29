/** Source-checked against the official Level 2 Learning PDF, including illustrated pages. */
import type { QuizBank } from "../../quizStudio";

export const batteryRobotBank: QuizBank = {
  "projectId": "level-2-battery-robot",
  "title": "Battery Robot",
  "sourcePdfPath": "public/Level 2/Learning/Programming & Precise Control/Battery robot/Battery robot_Powerpoint.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "br01",
      "topic": "turret-hardware",
      "learningSlide": 7,
      "prompt": "How many large motors does the lesson describe as controlling the turret model?",
      "choices": [
        "One",
        "Two",
        "Three",
        "Four"
      ],
      "correctIndex": 1,
      "hint": "Find the hardware description beside the model photo.",
      "explanation": "Slide 7 says the turret model is controlled by two large motors."
    },
    {
      "id": "br02",
      "topic": "turret-hardware",
      "learningSlide": 7,
      "prompt": "What forms the main body and support structure of the turret model?",
      "choices": [
        "A battery label and a speaker",
        "Only a rubber band",
        "An RCU and building beams",
        "A touchscreen and a camera"
      ],
      "correctIndex": 2,
      "hint": "Think about what holds the motors and turret upright.",
      "explanation": "Slide 7 identifies the RCU and beams as the model's body and support."
    },
    {
      "id": "br03",
      "topic": "turning-precision",
      "learningSlide": 9,
      "prompt": "Why can timing a turn only in small steps of seconds make extremely precise turns difficult?",
      "choices": [
        "The lesson says time steps can introduce route error",
        "Motors cannot run for any amount of time",
        "A stopped motor always moves faster",
        "Gear teeth disappear during a turn"
      ],
      "correctIndex": 0,
      "hint": "Think about the accuracy of a timer with fixed increments.",
      "explanation": "Slide 9 explains that time-based programming uses steps as small as 0.1 second, which can cause errors in high-precision routes."
    },
    {
      "id": "br04",
      "topic": "turning-precision",
      "learningSlide": 9,
      "prompt": "What does this lesson introduce to control turning more accurately?",
      "choices": [
        "Larger wheels only",
        "A new color sensor",
        "Longer time delays in every case",
        "Code or encoder values"
      ],
      "correctIndex": 3,
      "hint": "Look at what the lesson uses instead of relying only on seconds.",
      "explanation": "Slide 9 introduces code values for turning to improve precision compared with time-only control."
    },
    {
      "id": "br05",
      "topic": "speed-difference-turn",
      "learningSlide": 10,
      "prompt": "In a speed-difference turn, how do the two sides' motors move?",
      "choices": [
        "Both motors are stopped",
        "They drive in the same overall direction at different speeds",
        "They always spin in exact opposite directions at equal speed",
        "Only the front wheel is allowed to move"
      ],
      "correctIndex": 1,
      "hint": "Compare the arrows and speeds on each side.",
      "explanation": "Slide 10 describes a speed-difference turn as both sides driving in the same direction but with different speeds."
    },
    {
      "id": "br06",
      "topic": "speed-difference-turn",
      "learningSlide": 10,
      "prompt": "Which feature does the lesson associate with a speed-difference turn?",
      "choices": [
        "A relatively large turning radius and stable movement",
        "The smallest possible turn around the center",
        "One motor must have zero speed",
        "The robot can never move forward"
      ],
      "correctIndex": 0,
      "hint": "Consider whether this turn is wide and gentle or tight and sharp.",
      "explanation": "Slide 10 describes the largest turning radius, comparatively low turning efficiency and relative stability."
    },
    {
      "id": "br07",
      "topic": "pivot-and-spin-turns",
      "learningSlide": 11,
      "prompt": "How does the lesson define a fixed-point turn?",
      "choices": [
        "Both motors always run at maximum speed",
        "One motor stays at zero while the other moves",
        "All motors must be removed",
        "Both wheels turn in exactly the same direction and speed"
      ],
      "correctIndex": 1,
      "hint": "Imagine turning the robot around one stationary side.",
      "explanation": "Slide 11 says a fixed-point turn uses a stopped motor on one side as the turning point while the other side moves."
    },
    {
      "id": "br08",
      "topic": "pivot-and-spin-turns",
      "learningSlide": 12,
      "prompt": "Which motor pattern makes the robot turn in place around its center?",
      "choices": [
        "Both sides move straight forward at equal speed",
        "Both motors remain off",
        "The sides move in opposite directions at equal speed",
        "One motor runs and the other stays at zero"
      ],
      "correctIndex": 2,
      "hint": "Look at the arrows pointing in different directions.",
      "explanation": "Slide 12 states that an in-place turn uses opposite directions at the same speed, producing a tight central rotation."
    },
    {
      "id": "br09",
      "topic": "programming-tests",
      "learningSlide": 16,
      "prompt": "What turn is the first illustrated programming task intended to demonstrate?",
      "choices": [
        "A 90-degree clockwise turn",
        "A 180-degree backward drive",
        "A turn of exactly 12 complete circles",
        "No movement at all"
      ],
      "correctIndex": 0,
      "hint": "Read the target angle and direction beside the program blocks.",
      "explanation": "Slide 16 labels the first task as turning 90 degrees clockwise."
    },
    {
      "id": "br10",
      "topic": "programming-tests",
      "learningSlide": 18,
      "prompt": "What does the third programming challenge ask students to vary on the turret?",
      "choices": [
        "The music tempo",
        "The classroom light level",
        "The robot's paint color",
        "The projectile firing angles"
      ],
      "correctIndex": 3,
      "hint": "Think about what changes where the turret aims.",
      "explanation": "Slide 18 asks students to control the turret's firing at different angles and to check the rubber band arrangement."
    }
  ]
};
