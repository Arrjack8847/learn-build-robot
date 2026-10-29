/** Level 4 — Super Trajectory Robot 2. Questions checked against the 16-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const superTrajectoryRobot2Bank: QuizBank = {
  "projectId": "level-4-super-trajectory-robot-2",
  "title": "Super Trajectory Robot 2",
  "sourcePdfPath": "public/Level 4/Advanced Navigation & Control/Super Trajectory Robot 2/14. Super Trajectory Robot 2-update.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "l4-supertrajectoryrobot2-01",
      "topic": "line-following",
      "learningSlide": 6,
      "prompt": "Which path is the Super Trajectory Robot designed to follow?",
      "choices": [
        "A black line",
        "A wall of bricks",
        "A row of trees",
        "A river"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 describes a robot following a black line.",
      "hint": "Think about the track shown in the lesson introduction."
    },
    {
      "id": "l4-supertrajectoryrobot2-02",
      "topic": "line-following",
      "learningSlide": 7,
      "prompt": "Which two track colors does the robot need to distinguish?",
      "choices": [
        "Red and green",
        "Blue and yellow",
        "Black and white",
        "Orange and purple"
      ],
      "correctIndex": 2,
      "explanation": "Slide 7 describes the robot patrolling black-and-white areas.",
      "hint": "Think about the contrast used by a line-following robot."
    },
    {
      "id": "l4-supertrajectoryrobot2-03",
      "topic": "light-sensors",
      "learningSlide": 7,
      "prompt": "What is another name the lesson gives for a light sensor?",
      "choices": [
        "Sound sensor",
        "Brightness sensor",
        "Pressure sensor",
        "Touch sensor"
      ],
      "correctIndex": 1,
      "explanation": "Slide 7 calls light sensors brightness sensors.",
      "hint": "Think about the measurement made by a light sensor."
    },
    {
      "id": "l4-supertrajectoryrobot2-04",
      "topic": "light-sensors",
      "learningSlide": 9,
      "prompt": "Which sensor guides the robot along its black line?",
      "choices": [
        "Humidity sensor",
        "Photoelectric sensor",
        "Magnetic compass",
        "Temperature sensor"
      ],
      "correctIndex": 1,
      "explanation": "Slide 9 describes the photoelectric sensor as the robot's line-following guide.",
      "hint": "Think about a sensor that reacts to reflected light."
    },
    {
      "id": "l4-supertrajectoryrobot2-05",
      "topic": "using-two-sensors",
      "learningSlide": 9,
      "prompt": "Why does the lesson suggest adding another photoelectric sensor?",
      "choices": [
        "To help improve tracking and stopping",
        "To make the wheels larger",
        "To add music",
        "To measure room temperature"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 proposes another photoelectric sensor to improve tracking and detect the end.",
      "hint": "Think about what an extra reading can tell the controller."
    },
    {
      "id": "l4-supertrajectoryrobot2-06",
      "topic": "using-two-sensors",
      "learningSlide": 13,
      "prompt": "What do the two photoelectric sensors help detect together at the end of the route?",
      "choices": [
        "The room's sound level",
        "The line's end",
        "The battery's color",
        "The size of the roof"
      ],
      "correctIndex": 1,
      "explanation": "Slide 13 describes both photoelectric sensors encountering the black-line end.",
      "hint": "Consider how the robot knows when its journey is complete."
    },
    {
      "id": "l4-supertrajectoryrobot2-07",
      "topic": "assembly-rules",
      "learningSlide": 11,
      "prompt": "Which is an assembly requirement for the Super Trajectory Robot?",
      "choices": [
        "A stable structure",
        "A loose motor",
        "A bent controller",
        "No support for sensors"
      ],
      "correctIndex": 0,
      "explanation": "Slide 11 lists stable structure as an assembly requirement.",
      "hint": "Think about a robot that must move reliably along a track."
    },
    {
      "id": "l4-supertrajectoryrobot2-08",
      "topic": "assembly-rules",
      "learningSlide": 11,
      "prompt": "When checking the finished robot, what should you compare with the design?",
      "choices": [
        "The classroom music",
        "The intended model shape",
        "The wall paint",
        "The computer wallpaper"
      ],
      "correctIndex": 1,
      "explanation": "Slide 11 includes matching the intended shape in the assembly checklist.",
      "hint": "Look back at the model you planned to build."
    },
    {
      "id": "l4-supertrajectoryrobot2-09",
      "topic": "programming-goals",
      "learningSlide": 2,
      "prompt": "How many photoelectric sensor situations does the lesson ask students to analyze?",
      "choices": [
        "Two",
        "Three",
        "Four",
        "Five"
      ],
      "correctIndex": 2,
      "explanation": "Slide 2 explicitly identifies four photoelectric situations for analysis.",
      "hint": "Think about how two sensors can each have more than one reading."
    },
    {
      "id": "l4-supertrajectoryrobot2-10",
      "topic": "programming-goals",
      "learningSlide": 13,
      "prompt": "What should the line-following program accomplish?",
      "choices": [
        "Follow the black line and detect its end",
        "Count queue tickets",
        "Open a curtain",
        "Recognize a QR payment"
      ],
      "correctIndex": 0,
      "explanation": "Slide 13 defines the task of following the black line until both sensors meet its end.",
      "hint": "Think about both traveling and knowing when to stop."
    }
  ]
};
