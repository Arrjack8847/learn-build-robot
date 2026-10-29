/** Level 4 Learning PDF text checked page by page; no unreviewed diagrams assumed. */
import type { QuizBank } from "../../quizStudio";

export const keepingDistanceBank: QuizBank = {
  "projectId": "level-4-keeping-distance",
  "title": "Keeping Distance",
  "sourcePdfPath": "public/Level 4/Autonomous Navigation & Ranging/Keeping Distance/12. Keeping Distance-Teaching Slides.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "l4-kd-01",
      "topic": "collision-avoidance",
      "learningSlide": 5,
      "prompt": "Why is collision avoidance useful for robots with delicate mechanisms?",
      "choices": [
        "It makes collisions louder",
        "It replaces the robot's battery",
        "It changes all motor directions to reverse",
        "Repeated impacts may damage sophisticated mechanisms"
      ],
      "correctIndex": 3,
      "explanation": "Slide 5 describes how frequent collisions can cause malfunction.",
      "hint": "Think about the cost of repeatedly hitting a wall."
    },
    {
      "id": "l4-kd-02",
      "topic": "collision-avoidance",
      "learningSlide": 6,
      "prompt": "Which two basic actions can prevent a collision according to the lesson?",
      "choices": [
        "Avoid an obstacle or stop before it",
        "Increase weight or add paint",
        "Turn off the controller forever",
        "Play music or flash a display"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 explains that avoiding obstacles or stopping can prevent collisions.",
      "hint": "One action changes direction and another avoids forward movement."
    },
    {
      "id": "l4-kd-03",
      "topic": "sensor-choice",
      "learningSlide": 8,
      "prompt": "Which set contains only sensor types listed for collision avoidance?",
      "choices": [
        "Thermometers and microphones only",
        "Ultrasonic, infrared, laser and vision sensors",
        "Humidity sensors and barometers only",
        "Compass and pressure sensors only"
      ],
      "correctIndex": 1,
      "explanation": "Slide 8 lists ultrasonic, infrared, laser and vision sensors as possible detection devices.",
      "hint": "The sensor must identify obstacles before impact."
    },
    {
      "id": "l4-kd-04",
      "topic": "sensor-choice",
      "learningSlide": 9,
      "prompt": "Which sensor does this particular robot use to measure obstacle distance?",
      "choices": [
        "Color sensor",
        "Magnetic sensor",
        "Laser ranging sensor",
        "Touch keyboard"
      ],
      "correctIndex": 2,
      "explanation": "Slide 9 explicitly chooses a laser ranging sensor for this project.",
      "hint": "Look for the sensor named in the lesson title's practical activity."
    },
    {
      "id": "l4-kd-05",
      "topic": "reading-and-decision",
      "learningSlide": 13,
      "prompt": "What does the example program repeatedly save into a variable?",
      "choices": [
        "Distance data from the laser ranging sensor",
        "A list of background songs",
        "A fixed room temperature",
        "The robot's color"
      ],
      "correctIndex": 0,
      "explanation": "Slide 13 asks for repeated storage of laser distance data.",
      "hint": "A variable holds the value being measured."
    },
    {
      "id": "l4-kd-06",
      "topic": "reading-and-decision",
      "learningSlide": 14,
      "prompt": "When does the program execute its anti-collision routine?",
      "choices": [
        "Only after pressing a screen icon",
        "Every time music plays",
        "Whenever the sensor detects a different color",
        "When the distance is below 100"
      ],
      "correctIndex": 3,
      "explanation": "Slide 14 specifies anti-collision when the distance is less than 100.",
      "hint": "Check the numeric threshold in the decision."
    },
    {
      "id": "l4-kd-07",
      "topic": "custom-strategy",
      "learningSlide": 15,
      "prompt": "Why does the lesson use self-made programming blocks for avoidance?",
      "choices": [
        "To stop all programming",
        "To make different avoidance effects easy to adjust",
        "To increase battery weight",
        "To disable all movement"
      ],
      "correctIndex": 1,
      "explanation": "Slide 15 describes adjustable blocks for rotations and turns.",
      "hint": "Reusable actions make movement changes easier."
    },
    {
      "id": "l4-kd-08",
      "topic": "custom-strategy",
      "learningSlide": 15,
      "prompt": "Which is an avoidance movement named in the lesson?",
      "choices": [
        "Climbing a rope",
        "Producing fog",
        "Rotating in place",
        "Measuring humidity"
      ],
      "correctIndex": 2,
      "explanation": "Slide 15 lists rotation in place, left turn and right turn.",
      "hint": "Choose a direction-changing action."
    },
    {
      "id": "l4-kd-09",
      "topic": "turning-and-return",
      "learningSlide": 16,
      "prompt": "How can a wheeled robot turn according to the lesson?",
      "choices": [
        "By making the wheels run at different speeds",
        "By changing the color of both wheels",
        "By removing the sensors",
        "By sounding a longer alarm"
      ],
      "correctIndex": 0,
      "explanation": "Slide 16 states that a speed difference between wheels enables turning.",
      "hint": "What happens if one wheel travels farther than the other?"
    },
    {
      "id": "l4-kd-10",
      "topic": "turning-and-return",
      "learningSlide": 20,
      "prompt": "What improvement is suggested after the robot avoids an obstacle?",
      "choices": [
        "Increase the brightness of the lamp",
        "Remove the laser sensor",
        "Always reverse forever",
        "Adjust its angle to return to its original route"
      ],
      "correctIndex": 3,
      "explanation": "Slide 20 asks the robot to return to its original path after avoidance.",
      "hint": "The robot should resume the planned route."
    }
  ]
};
