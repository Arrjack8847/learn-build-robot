/** Level 4 — Ranging robot. Questions checked against the 20-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const rangingRobotBank: QuizBank = {
  "projectId": "level-4-ranging-robot",
  "title": "Ranging robot",
  "sourcePdfPath": "public/Level 4/Sensor-Focused Robots/Ranging robot/Ranging robot_Powerpoint.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "l4-rangingrobot-01",
      "topic": "distance-goal",
      "learningSlide": 6,
      "prompt": "Which route is the shortest between two points on a flat sheet?",
      "choices": [
        "A large circle",
        "A zigzag path",
        "A winding curve",
        "A straight line"
      ],
      "correctIndex": 3,
      "explanation": "Slide 6 introduces the straight segment as the shortest path between two points.",
      "hint": "Compare direct and curved paths."
    },
    {
      "id": "l4-rangingrobot-02",
      "topic": "distance-goal",
      "learningSlide": 7,
      "prompt": "What does the Ranging Robot try to measure as it moves?",
      "choices": [
        "Room temperature",
        "Linear travel distance",
        "Air pressure",
        "Light color"
      ],
      "correctIndex": 1,
      "explanation": "Slide 7 says the robot's movement can reflect its linear distance through the RCU.",
      "hint": "Think about how far the robot travels."
    },
    {
      "id": "l4-rangingrobot-03",
      "topic": "encoder-values",
      "learningSlide": 9,
      "prompt": "What can an encoder turn into an electrical signal?",
      "choices": [
        "Air humidity",
        "A paint color",
        "Displacement or rotation",
        "A sound recording"
      ],
      "correctIndex": 2,
      "explanation": "Slide 9 explains that an encoder converts angular or linear displacement into an electrical signal.",
      "hint": "Think about the kind of movement the motor makes."
    },
    {
      "id": "l4-rangingrobot-04",
      "topic": "encoder-values",
      "learningSlide": 9,
      "prompt": "Where can the robot show the measured code value?",
      "choices": [
        "On the RCU screen",
        "On a paper map only",
        "On the floor",
        "On the motor's tire"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 says the RCU processes and displays the code value.",
      "hint": "Remember which part displays measured information."
    },
    {
      "id": "l4-rangingrobot-05",
      "topic": "encoder-types",
      "learningSlide": 10,
      "prompt": "Which two types of encoder are described in the lesson?",
      "choices": [
        "Incremental and absolute",
        "Fast and slow",
        "Cold and hot",
        "Blue and red"
      ],
      "correctIndex": 0,
      "explanation": "Slide 10 names incremental and absolute encoders.",
      "hint": "Think about two ways of reporting position changes."
    },
    {
      "id": "l4-rangingrobot-06",
      "topic": "encoder-types",
      "learningSlide": 10,
      "prompt": "Which encoder type does the Ranging Robot use?",
      "choices": [
        "Photoelectric switch",
        "Absolute encoder",
        "Incremental encoder",
        "Magnetic compass"
      ],
      "correctIndex": 2,
      "explanation": "Slide 10 explicitly says the encoder in use is incremental.",
      "hint": "Remember which encoder counts movement as pulses."
    },
    {
      "id": "l4-rangingrobot-07",
      "topic": "reading-the-program",
      "learningSlide": 15,
      "prompt": "What should the program read before converting movement into laps?",
      "choices": [
        "The classroom clock",
        "The motor's code value",
        "The wallpaper color",
        "The sensor label"
      ],
      "correctIndex": 1,
      "explanation": "Slide 15 shows Read motor code value followed by conversion into laps.",
      "hint": "Follow the order of the displayed programming steps."
    },
    {
      "id": "l4-rangingrobot-08",
      "topic": "reading-the-program",
      "learningSlide": 16,
      "prompt": "What measurement should the Ranging Robot display on the first screen line?",
      "choices": [
        "Paint thickness",
        "Sound frequency",
        "Wind speed",
        "Number of wheel laps"
      ],
      "correctIndex": 3,
      "explanation": "Slide 16 asks for real-time motor laps on the first line of the display.",
      "hint": "Think about what the rotating wheel counts."
    },
    {
      "id": "l4-rangingrobot-09",
      "topic": "wheel-distance",
      "learningSlide": 17,
      "prompt": "About how far does the lesson's tire travel in one full turn?",
      "choices": [
        "6.5 cm",
        "10 cm",
        "20.5 cm",
        "40 cm"
      ],
      "correctIndex": 2,
      "explanation": "Slide 17 gives the tire's circumference as about 20.5 centimeters.",
      "hint": "Distance per turn depends on the distance around the wheel."
    },
    {
      "id": "l4-rangingrobot-10",
      "topic": "wheel-distance",
      "learningSlide": 17,
      "prompt": "The tire travels about 20.5 cm in one turn. About how far does it travel in two turns?",
      "choices": [
        "41 cm",
        "10.25 cm",
        "61.5 cm",
        "20.5 cm"
      ],
      "correctIndex": 0,
      "explanation": "Two turns cover about 2 × 20.5 = 41 centimeters, based on slide 17.",
      "hint": "Think about repeating the same travel distance twice."
    }
  ]
};
