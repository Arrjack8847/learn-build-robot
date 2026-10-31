/** Level 4 quiz: authored from official 27-page Learning PDF text. */
import type { QuizBank } from "../../quizStudio";
export const obstacleAvoidanceRobotBank: QuizBank = {
  "projectId": "level-4-obstacle-avoidance-robot",
  "title": "Obstacle Avoidance Robot",
  "sourcePdfPath": "public/Level 4/Interactive Systems/Obstacle Avoidance Robot/18.Obstacle Avoidance Robot-Slides.pdf",
  "sourcePageCount": 27,
  "questions": [
    {
      "id": "l4-obstacle-avoidance-robot-01",
      "topic": "obstacle-avoidance-basics",
      "learningSlide": 3,
      "prompt": "What is the purpose of an obstacle-avoidance robot?",
      "choices": [
        "Detect and avoid obstacles",
        "Play music constantly",
        "Print labels",
        "Measure air pressure"
      ],
      "correctIndex": 0,
      "explanation": "An obstacle-avoidance robot responds automatically to obstacles along its route.",
      "hint": "Think about how mobile robots travel safely."
    },
    {
      "id": "l4-obstacle-avoidance-robot-02",
      "topic": "obstacle-avoidance-basics",
      "learningSlide": 4,
      "prompt": "What information does the robot use to decide how to avoid an obstacle?",
      "choices": [
        "A stored photograph only",
        "Sensor input about nearby objects",
        "A weather report",
        "A keyboard layout"
      ],
      "correctIndex": 1,
      "explanation": "Its controller reacts to data from obstacle sensors.",
      "hint": "Think about how mobile robots travel safely."
    },
    {
      "id": "l4-obstacle-avoidance-robot-03",
      "topic": "ultrasonic-navigation",
      "learningSlide": 6,
      "prompt": "Which sensor is specified for the project's obstacle-avoiding model?",
      "choices": [
        "Ultrasonic sensor",
        "Temperature probe",
        "Microphone only",
        "Touchscreen"
      ],
      "correctIndex": 0,
      "explanation": "The project uses an ultrasonic sensor.",
      "hint": "Recall the sensor that notices objects in front."
    },
    {
      "id": "l4-obstacle-avoidance-robot-04",
      "topic": "ultrasonic-navigation",
      "learningSlide": 19,
      "prompt": "What does the robot do if its ultrasonic sensor detects an obstacle ahead?",
      "choices": [
        "Move straight faster",
        "Stop all sensors",
        "Turn left",
        "Only display text"
      ],
      "correctIndex": 2,
      "explanation": "Slide 19 programs the robot to turn left when there is an obstacle.",
      "hint": "Recall the sensor that notices objects in front."
    },
    {
      "id": "l4-obstacle-avoidance-robot-05",
      "topic": "controller-time",
      "learningSlide": 17,
      "prompt": "What unit is used by the controller-time block?",
      "choices": [
        "Hours",
        "Minutes",
        "Seconds",
        "Milliseconds"
      ],
      "correctIndex": 3,
      "explanation": "The lesson states that controller time is measured in milliseconds.",
      "hint": "Remember the timer's unit and reset behavior."
    },
    {
      "id": "l4-obstacle-avoidance-robot-06",
      "topic": "controller-time",
      "learningSlide": 17,
      "prompt": "How many milliseconds equal one second in this lesson?",
      "choices": [
        "10",
        "1000",
        "60",
        "100"
      ],
      "correctIndex": 1,
      "explanation": "Slide 17 gives 1000 milliseconds as one second.",
      "hint": "Remember the timer's unit and reset behavior."
    },
    {
      "id": "l4-obstacle-avoidance-robot-07",
      "topic": "timed-motion",
      "learningSlide": 18,
      "prompt": "What happens when the reset-controller-time block runs?",
      "choices": [
        "Timer begins counting again from zero",
        "Motor speed increases by 100",
        "The ultrasonic sensor is removed",
        "The display rotates"
      ],
      "correctIndex": 0,
      "explanation": "The reset block restores the timer to zero.",
      "hint": "Follow the controller-time comparison."
    },
    {
      "id": "l4-obstacle-avoidance-robot-08",
      "topic": "timed-motion",
      "learningSlide": 20,
      "prompt": "When does the robot stop in the timed-motion program?",
      "choices": [
        "When the motor changes color",
        "When the measured time reaches the preset limit",
        "When a photo is saved",
        "At the moment power is turned on"
      ],
      "correctIndex": 1,
      "explanation": "The program runs while controller time is below the limit, then stops.",
      "hint": "Follow the controller-time comparison."
    },
    {
      "id": "l4-obstacle-avoidance-robot-09",
      "topic": "start-and-reminder",
      "learningSlide": 21,
      "prompt": "Which action restarts the timed robot run?",
      "choices": [
        "Press the left button",
        "Touch the speaker grille",
        "Move a photoelectric target",
        "Remove the battery"
      ],
      "correctIndex": 0,
      "explanation": "Pressing the left button resets the timer and begins the timed work period.",
      "hint": "Think about what starts a timed run and warns at the end."
    },
    {
      "id": "l4-obstacle-avoidance-robot-10",
      "topic": "start-and-reminder",
      "learningSlide": 23,
      "prompt": "What reminder is proposed after the controller has run beyond ten seconds?",
      "choices": [
        "Flash a receipt",
        "Change the wheel diameter",
        "Play music",
        "Erase the PDF"
      ],
      "correctIndex": 2,
      "explanation": "The extension uses music as a reminder after more than ten seconds.",
      "hint": "Think about what starts a timed run and warns at the end."
    }
  ]
};
