/** Level 4 — Obstacle Avoidance In Snow. Questions checked against the 26-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const obstacleAvoidanceInSnowBank: QuizBank = {
  "projectId": "level-4-obstacle-avoidance-in-snow",
  "title": "Obstacle Avoidance In Snow",
  "sourcePdfPath": "public/Level 4/Autonomous Navigation & Ranging/Obstacle Avoidance In Snow/4. Obstacle Avoidance In Snow - Slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "l4-obstacleavoidanceinsnow-01",
      "topic": "ski-model",
      "learningSlide": 4,
      "prompt": "What equipment is attached to an athlete's boots for skiing?",
      "choices": [
        "Skis",
        "Wheels",
        "Boat paddles",
        "Springs"
      ],
      "correctIndex": 0,
      "explanation": "Slide 4 introduces skis attached to boots.",
      "hint": "Think about equipment that slides over snow."
    },
    {
      "id": "l4-obstacleavoidanceinsnow-02",
      "topic": "ski-model",
      "learningSlide": 9,
      "prompt": "What does the robot's model simulate?",
      "choices": [
        "A snowboard or ski structure",
        "An airplane wing",
        "A submarine",
        "A traffic signal"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 labels the simulated snowboard part of the ski robot.",
      "hint": "The model imitates a winter sport."
    },
    {
      "id": "l4-obstacleavoidanceinsnow-03",
      "topic": "crank-mechanism",
      "learningSlide": 6,
      "prompt": "What kind of motion can a slider-crank mechanism convert from rotation?",
      "choices": [
        "Reciprocating movement",
        "Only light pulses",
        "Sound volume",
        "Paint color"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 explains that a slider-crank can convert rotation to back-and-forth movement.",
      "hint": "Think about turning a handle to push and pull a part."
    },
    {
      "id": "l4-obstacleavoidanceinsnow-04",
      "topic": "crank-mechanism",
      "learningSlide": 7,
      "prompt": "What related mechanism does the lesson introduce after the slider-crank?",
      "choices": [
        "Crank-rocker mechanism",
        "Pulley lift only",
        "Magnetic lock",
        "Digital clock"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 introduces the crank-rocker mechanism.",
      "hint": "Remember the changed linkage discussed next."
    },
    {
      "id": "l4-obstacleavoidanceinsnow-05",
      "topic": "ultrasonic-distance",
      "learningSlide": 14,
      "prompt": "Which sensor can help the ski robot avoid an obstacle?",
      "choices": [
        "Ultrasonic sensor",
        "Color light",
        "Touchscreen only",
        "Music speaker"
      ],
      "correctIndex": 0,
      "explanation": "Slide 14 uses ultrasound echoes to measure obstacle distance.",
      "hint": "Think about detecting something in front of the robot."
    },
    {
      "id": "l4-obstacleavoidanceinsnow-06",
      "topic": "ultrasonic-distance",
      "learningSlide": 15,
      "prompt": "What unit does the ultrasonic sensor use for its distance reading?",
      "choices": [
        "Meters per second",
        "Degrees",
        "Centimeters",
        "Kilograms"
      ],
      "correctIndex": 2,
      "explanation": "Slide 15 says the reading is in centimeters.",
      "hint": "Think about a short distance in front of a small robot."
    },
    {
      "id": "l4-obstacleavoidanceinsnow-07",
      "topic": "testing-sensors",
      "learningSlide": 15,
      "prompt": "Which distance range does the lesson give as effective for its sensor?",
      "choices": [
        "7–180 cm",
        "1–5 mm",
        "20–40 km",
        "300–500 m"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 specifies a 7 to 180 centimeter effective range.",
      "hint": "Think about a nearby obstacle, not a faraway mountain."
    },
    {
      "id": "l4-obstacleavoidanceinsnow-08",
      "topic": "testing-sensors",
      "learningSlide": 16,
      "prompt": "Where should students display the ultrasonic sensor reading while testing?",
      "choices": [
        "On the controller screen",
        "On a wall clock",
        "In a paper book only",
        "On the motor tire"
      ],
      "correctIndex": 0,
      "explanation": "Slide 16 asks students to display the measured value on the controller screen.",
      "hint": "A reading should be visible during a test."
    },
    {
      "id": "l4-obstacleavoidanceinsnow-09",
      "topic": "movement-improvement",
      "learningSlide": 10,
      "prompt": "How many motors does the first ski robot movement task start together?",
      "choices": [
        "One",
        "Two",
        "Three",
        "Four"
      ],
      "correctIndex": 1,
      "explanation": "Slide 10 asks students to start two motors at the same time.",
      "hint": "Remember how the model begins moving."
    },
    {
      "id": "l4-obstacleavoidanceinsnow-10",
      "topic": "movement-improvement",
      "learningSlide": 19,
      "prompt": "What should the ski robot use to decide when to turn away from an obstacle?",
      "choices": [
        "Distance from the ultrasonic sensor",
        "The color of its skis",
        "The classroom temperature",
        "The time of day"
      ],
      "correctIndex": 0,
      "explanation": "Slide 19 asks students to use ultrasonic sensing to locate obstacles and improve turning.",
      "hint": "A useful turn decision depends on how near an obstacle is."
    }
  ]
};
