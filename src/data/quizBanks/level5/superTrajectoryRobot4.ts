/** Verified against the official 15-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const superTrajectoryRobot4Bank: QuizBank = {
  "projectId": "level-5-super-trajectory-robot-4",
  "title": "Super Trajectory Robot 4",
  "sourcePdfPath": "public/Level 5/Learning/Advanced Navigation & Control/Super Trajectory Robot 4/16. Super Trajectory Robot 4.pdf",
  "sourcePageCount": 15,
  "questions": [
    {
      "id": "level-5-super-trajectory-robot-4-01",
      "topic": "photoelectric-line-tracking",
      "learningSlide": 3,
      "prompt": "Which type of sensing is identified as the main focus of the robot's patrol-line lesson?",
      "choices": [
        "Photoelectric line detection",
        "Laser moon ranging",
        "Magnetic pole identification",
        "Facial attendance matching"
      ],
      "correctIndex": 0,
      "hint": "The sensor detects the contrast between a dark line and a light surface.",
      "explanation": "Slide 3 identifies photoelectric patrol-line sensing as the learning focus."
    },
    {
      "id": "level-5-super-trajectory-robot-4-02",
      "topic": "photoelectric-line-tracking",
      "learningSlide": 7,
      "prompt": "Which two surface regions is the lesson's patrol robot designed to distinguish?",
      "choices": [
        "Purple and red",
        "Black and white",
        "Green and blue",
        "Yellow and orange"
      ],
      "correctIndex": 1,
      "hint": "The car traces a dark line on a light background.",
      "explanation": "Slide 7 describes the robot following black-and-white track regions."
    },
    {
      "id": "level-5-super-trajectory-robot-4-03",
      "topic": "sensor-and-motor-setup",
      "learningSlide": 6,
      "prompt": "Which pair of drive motors is named in the initial control setup?",
      "choices": [
        "P5 and P6",
        "Motor X only",
        "A and B",
        "M7 and M8"
      ],
      "correctIndex": 2,
      "hint": "The lesson calls them by letters.",
      "explanation": "Slide 6 lists A and B motors among the required program components."
    },
    {
      "id": "level-5-super-trajectory-robot-4-04",
      "topic": "sensor-and-motor-setup",
      "learningSlide": 6,
      "prompt": "Which additional inputs does the program require besides its two motors?",
      "choices": [
        "A humidity sensor and magnetic lock",
        "Only a loudspeaker",
        "A facial-recognition database and QR code",
        "A touch sensor and a photoelectric sensor"
      ],
      "correctIndex": 3,
      "hint": "One input controls the calibration sequence and the other measures light.",
      "explanation": "Slide 6 says the program uses A and B motors, a touch sensor and a photoelectric sensor."
    },
    {
      "id": "level-5-super-trajectory-robot-4-05",
      "topic": "white-black-calibration",
      "learningSlide": 6,
      "prompt": "Which surface's light-sensitivity value is collected first during program initialization?",
      "choices": [
        "White area",
        "Blue button",
        "Red LED",
        "Black line"
      ],
      "correctIndex": 0,
      "hint": "The program starts by measuring the lighter background.",
      "explanation": "Slide 6 says the program initially collects the white-light light-sensitivity value."
    },
    {
      "id": "level-5-super-trajectory-robot-4-06",
      "topic": "white-black-calibration",
      "learningSlide": 6,
      "prompt": "When does the program collect the light-sensitivity value of the black line?",
      "choices": [
        "Immediately before collecting white",
        "After the touch sensor is released",
        "Only after the car is powered off",
        "When the motor reaches a fixed distance"
      ],
      "correctIndex": 1,
      "hint": "The touch input separates the two calibration readings.",
      "explanation": "Slide 6 says the black-line light value is collected after the touch sensor is released."
    },
    {
      "id": "level-5-super-trajectory-robot-4-07",
      "topic": "calibration-threshold",
      "learningSlide": 6,
      "prompt": "How is the photoelectric decision boundary determined from the two calibration readings?",
      "choices": [
        "Multiply the brighter value by 100",
        "Ignore one of the readings and pick a random value",
        "Use their average",
        "Always use exactly zero"
      ],
      "correctIndex": 2,
      "hint": "The boundary sits between the light and dark readings.",
      "explanation": "Slide 6 instructs calculating the average of the white and black readings for the photoelectric branching threshold."
    },
    {
      "id": "level-5-super-trajectory-robot-4-08",
      "topic": "calibration-threshold",
      "learningSlide": 6,
      "prompt": "If the white reading is 80 and the black reading is 20, what average decision threshold follows the lesson's rule?",
      "choices": [
        "100",
        "20",
        "40",
        "50"
      ],
      "correctIndex": 3,
      "hint": "Add the two readings, then divide by two.",
      "explanation": "The slide 6 threshold rule averages the two readings: (80 + 20) ÷ 2 = 50."
    },
    {
      "id": "level-5-super-trajectory-robot-4-09",
      "topic": "conditional-control",
      "learningSlide": 6,
      "prompt": "After calibration, what kind of test selects which movement branch to follow?",
      "choices": [
        "A comparison between the live photoelectric reading and the calculated boundary",
        "A comparison between the car's name and a QR code",
        "A comparison of room temperature and gravity",
        "A coin toss unrelated to the sensor"
      ],
      "correctIndex": 0,
      "hint": "A decision requires checking the current light value.",
      "explanation": "Slide 6 describes selecting a photoelectric branch by comparing the current sensor value to the average boundary."
    },
    {
      "id": "level-5-super-trajectory-robot-4-10",
      "topic": "conditional-control",
      "learningSlide": 6,
      "prompt": "Why does the sample program return to the photoelectric decision branch in a loop?",
      "choices": [
        "To run the route exactly once and ignore the line",
        "To keep rechecking the track while the car moves",
        "To stop taking any new sensor measurements",
        "To clear the original motor program"
      ],
      "correctIndex": 1,
      "hint": "Following the line requires continuous feedback.",
      "explanation": "Slide 6 explicitly describes looping back to the photoelectric branch to repeat sensing and movement decisions."
    }
  ]
};
