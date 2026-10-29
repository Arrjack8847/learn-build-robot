/** Verified against the registered Level 3 source PDF, pages are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const longLivedTurtleBank: QuizBank = {
  "projectId": "level-3-long-lived-turtle",
  "title": "The Long-lived Turtle",
  "sourcePdfPath": "public/Level 3/Learning/Vehicles & Complex Movers/Long-Lived Turtle/11. The Long-lived Turtle - Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "longlivedturtle-01",
      "topic": "turtle",
      "learningSlide": 2,
      "prompt": "Which living creature does the robot model imitate?",
      "choices": [
        "A turtle",
        "A beetle",
        "A bird",
        "A rabbit"
      ],
      "correctIndex": 0,
      "hint": "Compare the animal models by their body shapes and movement rather than by their names alone.",
      "explanation": "Slide 2 directs students to build a turtle robot."
    },
    {
      "id": "longlivedturtle-02",
      "topic": "turtle",
      "learningSlide": 2,
      "prompt": "What kind of programmed movement should the turtle add after meeting an obstacle?",
      "choices": [
        "A permanently fixed direction only",
        "Randomized movement",
        "No further movement",
        "Continuous speed without checking"
      ],
      "correctIndex": 1,
      "hint": "The robot imitates features of a turtle.",
      "explanation": "Slide 2 lists randomized motion after obstacles as a learning objective."
    },
    {
      "id": "longlivedturtle-03",
      "topic": "linkage",
      "learningSlide": 7,
      "prompt": "How many connecting rods make up the most common planar four-bar linkage?",
      "choices": [
        "Two",
        "Three",
        "Four",
        "Six"
      ],
      "correctIndex": 2,
      "hint": "Think about converting one type of movement into another.",
      "explanation": "Slide 7 describes a planar four-bar mechanism made from four rods."
    },
    {
      "id": "longlivedturtle-04",
      "topic": "linkage",
      "learningSlide": 8,
      "prompt": "What motion can a slider-crank mechanism convert complete rotation into?",
      "choices": [
        "Sound signals",
        "Electrical resistance",
        "Temperature changes",
        "Reciprocating movement"
      ],
      "correctIndex": 3,
      "hint": "Think about converting one type of movement into another.",
      "explanation": "Slide 8 explains the conversion from full rotation into back-and-forth movement."
    },
    {
      "id": "longlivedturtle-05",
      "topic": "detection",
      "learningSlide": 10,
      "prompt": "Which sensor measures distance for the turtle model?",
      "choices": [
        "Ultrasonic sensor",
        "Color lamp",
        "Touch button only",
        "Gyroscope only"
      ],
      "correctIndex": 0,
      "hint": "The model checks its environment before moving.",
      "explanation": "Slide 10 references ultrasonic distance measurement in the build."
    },
    {
      "id": "longlivedturtle-06",
      "topic": "detection",
      "learningSlide": 10,
      "prompt": "Which two kinds of mechanism are named among the turtle build elements?",
      "choices": [
        "Worm and propeller only",
        "Slider and four-bar linkage",
        "Pulley and flywheel only",
        "Magnet and spring only"
      ],
      "correctIndex": 1,
      "hint": "The model checks its environment before moving.",
      "explanation": "Slide 10 identifies slider and four-bar structures."
    },
    {
      "id": "longlivedturtle-07",
      "topic": "navigation",
      "learningSlide": 11,
      "prompt": "What should the turtle robot do when it detects an obstacle?",
      "choices": [
        "Keep driving straight",
        "Turn off its sensors",
        "Turn",
        "Stop the program permanently"
      ],
      "correctIndex": 2,
      "hint": "The program chooses between straight movement and turning.",
      "explanation": "Slide 11 follows an obstacle with a turn."
    },
    {
      "id": "longlivedturtle-08",
      "topic": "navigation",
      "learningSlide": 11,
      "prompt": "What should the robot do if there is no obstacle?",
      "choices": [
        "Always reverse",
        "Rotate on the spot",
        "Play an alarm without moving",
        "Move straight ahead"
      ],
      "correctIndex": 3,
      "hint": "The program chooses between straight movement and turning.",
      "explanation": "Slide 11 goes straight when no obstacle is present."
    },
    {
      "id": "longlivedturtle-09",
      "topic": "random",
      "learningSlide": 16,
      "prompt": "What does the random-number module return?",
      "choices": [
        "A random value within a specified interval",
        "A fixed motor port identifier",
        "The physical weight of the robot",
        "The precise distance to any obstacle"
      ],
      "correctIndex": 0,
      "hint": "A controlled random value can vary the response.",
      "explanation": "Slide 16 describes selecting a value from a defined range."
    },
    {
      "id": "longlivedturtle-10",
      "topic": "random",
      "learningSlide": 16,
      "prompt": "If both interval endpoints are integers, what type of value does the random module return?",
      "choices": [
        "A color name",
        "An integer",
        "A motor port",
        "A text-only string"
      ],
      "correctIndex": 1,
      "hint": "A controlled random value can vary the response.",
      "explanation": "Slide 16 says integer bounds yield integer random values."
    }
  ]
};
