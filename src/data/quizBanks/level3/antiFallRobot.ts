/** Verified against the Level 3 official Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const antiFallRobotBank: QuizBank = {
  "projectId": "level-3-anti-fall-robot",
  "title": "Anti-fall Robot",
  "sourcePdfPath": "public/Level 3/Learning/Interactive Systems/Anti-fall Robot/11.Anti-fall Robot-Slides.pdf",
  "sourcePageCount": 33,
  "questions": [
    {
      "id": "antifallrobo-01",
      "topic": "drop-prevention",
      "learningSlide": 3,
      "prompt": "Why should a mobile service robot detect the edge of a high step?",
      "choices": [
        "To avoid falling and damage",
        "To speed up its motors",
        "To estimate battery capacity",
        "To increase wheel rotation"
      ],
      "correctIndex": 0,
      "hint": "Think about what happens if the floor suddenly ends.",
      "explanation": "Slide 3 explains that wheeled robots stop or bypass high steps to prevent falling."
    },
    {
      "id": "antifallrobo-02",
      "topic": "drop-prevention",
      "learningSlide": 4,
      "prompt": "Where is the anti-drop distance sensor installed on the robot?",
      "choices": [
        "Inside the speaker facing upward",
        "At the bottom facing the ground",
        "On the battery casing facing inward",
        "Above the controller pointing backward"
      ],
      "correctIndex": 1,
      "hint": "The sensor needs to observe the surface the wheels travel over.",
      "explanation": "Slide 4 locates the distance-sensing device at the bottom of the robot."
    },
    {
      "id": "antifallrobo-03",
      "topic": "photoelectric-values",
      "learningSlide": 7,
      "prompt": "Which light-sensor reading indicates the darker target surface in the lesson?",
      "choices": [
        "A larger sensor value",
        "The maximum value 4095 always",
        "A smaller sensor value",
        "An unchanged fixed value"
      ],
      "correctIndex": 2,
      "hint": "Compare how much light a dark and a pale surface reflect.",
      "explanation": "Slide 7 says darker objects return smaller photoelectric values in the 0–4095 range."
    },
    {
      "id": "antifallrobo-04",
      "topic": "photoelectric-values",
      "learningSlide": 8,
      "prompt": "Why does a dark object usually return less light to a photoelectric receiver?",
      "choices": [
        "It generates additional reflected light",
        "It always emits its own light",
        "It reflects every incoming ray",
        "It absorbs more of the emitted light"
      ],
      "correctIndex": 3,
      "hint": "Consider what happens to emitted light after it strikes a dark surface.",
      "explanation": "Slide 8 explains that dark objects absorb more light and reflect less to the receiver."
    },
    {
      "id": "antifallrobo-05",
      "topic": "sensor-setup",
      "learningSlide": 9,
      "prompt": "Which controller ports can accept the photoelectric sensor?",
      "choices": [
        "Composite ports P1–P8",
        "Motor outputs M1–M4 only",
        "The speaker connector only",
        "The power switch terminals only"
      ],
      "correctIndex": 0,
      "hint": "The lesson names the controller's composite input ports.",
      "explanation": "Slide 9 shows connection through composite controller ports P1–P8."
    },
    {
      "id": "antifallrobo-06",
      "topic": "sensor-setup",
      "learningSlide": 10,
      "prompt": "Which built-in test interface checks the photoelectric sensor?",
      "choices": [
        "Ultrasonic",
        "Gray",
        "Motor",
        "Sound output"
      ],
      "correctIndex": 1,
      "hint": "The interface is named after sensing light/dark values.",
      "explanation": "Slide 10 instructs opening the built-in Gray photoelectric sensor test."
    },
    {
      "id": "antifallrobo-07",
      "topic": "control-logic",
      "learningSlide": 6,
      "prompt": "What should the anti-fall robot do after it reaches a step edge in the project task?",
      "choices": [
        "Accelerate straight forward",
        "Disable all sensor checks",
        "Retreat and then turn on the spot",
        "Move only the display screen"
      ],
      "correctIndex": 2,
      "hint": "The task specifies a sequence to recover from a risky edge.",
      "explanation": "Slide 6 calls for retreating and turning after reaching a step edge."
    },
    {
      "id": "antifallrobo-08",
      "topic": "control-logic",
      "learningSlide": 21,
      "prompt": "What does the get-light-sensor programming block return?",
      "choices": [
        "A motor's stored program name",
        "The number of robot wheels",
        "A wireless network address",
        "A measured color-depth value"
      ],
      "correctIndex": 3,
      "hint": "The block is connected to the photoelectric probe.",
      "explanation": "Slide 21 describes reading the photoelectric sensor's color-depth value from 0–4095."
    },
    {
      "id": "antifallrobo-09",
      "topic": "testing",
      "learningSlide": 4,
      "prompt": "What should a robot do when its downward distance reading becomes unexpectedly large?",
      "choices": [
        "Brake before going over the edge",
        "Increase speed toward the edge",
        "Ignore the sensor until it falls",
        "Continue straight without checking"
      ],
      "correctIndex": 0,
      "hint": "An unusually large gap below the robot is a warning.",
      "explanation": "Slide 4 says a large measured distance triggers braking to prevent falling."
    },
    {
      "id": "antifallrobo-10",
      "topic": "testing",
      "learningSlide": 22,
      "prompt": "Which operator can compare a measured light value with a threshold?",
      "choices": [
        "Repeat indefinitely",
        "Less than (<)",
        "Play melody",
        "Rotate left"
      ],
      "correctIndex": 1,
      "hint": "The sensor reading must be compared numerically.",
      "explanation": "Slide 22 introduces the less-than comparison block for numeric conditions."
    }
  ]
};
