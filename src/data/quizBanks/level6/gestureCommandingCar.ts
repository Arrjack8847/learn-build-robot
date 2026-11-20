/** Question facts and 1-based slide references reviewed against the official 23-page Level 6 Learning PDF text. */
import type { QuizBank } from "../../quizStudio";

export const gestureCommandingCarBank: QuizBank = {
  "projectId": "level-6-gesture-commanding-car",
  "title": "Gesture-commanding Car",
  "sourcePdfPath": "public/Level 6/Learning/Autonomous Navigation & Ranging/Gesture-commanding Car/23. Gesture-commanding Car-Teaching Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "gesture-01",
      "learningSlide": 5,
      "topic": "gesture-instructions",
      "prompt": "What does gesture-based human-computer interaction allow a machine to do?",
      "choices": [
        "Interpret a gesture and execute a matching instruction",
        "Eliminate all mechanical parts",
        "Change the user's hand shape",
        "Run without any program"
      ],
      "correctIndex": 0,
      "hint": "Think about the link between input recognition and an output action.",
      "explanation": "Slide 5 explains that machines can recognize gestures and execute corresponding instructions."
    },
    {
      "id": "gesture-02",
      "learningSlide": 9,
      "topic": "gesture-instructions",
      "prompt": "Why do traffic police use different hand signals, according to the lesson?",
      "choices": [
        "To measure air pressure",
        "To charge the car",
        "To direct vehicles safely in real time",
        "To replace the vehicle's engine"
      ],
      "correctIndex": 2,
      "hint": "Consider the role of gestures when road signals need human intervention.",
      "explanation": "Slide 9 explains traffic gestures are used to direct vehicles and keep road traffic safe and smooth."
    },
    {
      "id": "gesture-03",
      "learningSlide": 14,
      "topic": "reading-and-response",
      "prompt": "Where does the program store data read from the gesture sensor?",
      "choices": [
        "Directly in the motor shaft",
        "In a variable",
        "In the battery cells",
        "Only in a printed report"
      ],
      "correctIndex": 1,
      "hint": "The next programming decisions need access to the sensor's current value.",
      "explanation": "Slide 14 says to read gesture-sensor data and store it in a variable."
    },
    {
      "id": "gesture-04",
      "learningSlide": 16,
      "topic": "reading-and-response",
      "prompt": "What should the car do when no gesture is detected?",
      "choices": [
        "Reverse at maximum speed",
        "Turn left repeatedly",
        "Stop forever",
        "Move forward slowly"
      ],
      "correctIndex": 3,
      "hint": "The lesson specifies a default motion when there is no new command.",
      "explanation": "Slide 16 says the robot moves forward slowly when no gesture is present."
    },
    {
      "id": "gesture-05",
      "learningSlide": 15,
      "topic": "movement-function",
      "prompt": "Which three parameters does the custom movement function accept?",
      "choices": [
        "M1, M2 and Time",
        "Height, Color and Light",
        "Sound, Temperature and Time",
        "Battery, Screen and ID"
      ],
      "correctIndex": 0,
      "hint": "Two motor outputs and a duration together describe a movement command.",
      "explanation": "Slide 15 explicitly names the three parameters M1, M2 and Time."
    },
    {
      "id": "gesture-06",
      "learningSlide": 15,
      "topic": "movement-function",
      "prompt": "What does the Time parameter control in the car's movement function?",
      "choices": [
        "The classroom start time",
        "The gesture-recognition model",
        "How long the commanded motion runs",
        "The timestamp of the Learning PDF"
      ],
      "correctIndex": 2,
      "hint": "The other two inputs are motor speeds.",
      "explanation": "Slide 15 explains that Time specifies the duration of the movement."
    },
    {
      "id": "gesture-07",
      "learningSlide": 17,
      "topic": "gesture-branching",
      "prompt": "When the car detects a gesture, what does its program do next?",
      "choices": [
        "Ignores its type",
        "Checks the gesture type and runs the matching movement",
        "Uses the same movement for every gesture",
        "Disables motor speed control"
      ],
      "correctIndex": 1,
      "hint": "Different recognized hand signs can trigger different behaviors.",
      "explanation": "Slide 17 says gesture types are judged in turn and the corresponding movement program is executed."
    },
    {
      "id": "gesture-08",
      "learningSlide": 17,
      "topic": "gesture-branching",
      "prompt": "If the car turns too far during a recognized gesture, which movement-function settings can be adjusted?",
      "choices": [
        "The school timetable only",
        "The color of the hand",
        "The PDF filename",
        "Motor speed and movement time"
      ],
      "correctIndex": 3,
      "hint": "The lesson allows both how fast and how long the robot moves to be tuned.",
      "explanation": "Slide 17 says both speed and time can be modified according to actual movement."
    },
    {
      "id": "gesture-09",
      "learningSlide": 21,
      "topic": "adding-stop-command",
      "prompt": "What is the lesson's programming optimization challenge?",
      "choices": [
        "Assign any gesture as a stop command",
        "Remove gesture recognition entirely",
        "Replace the robot with a traffic light",
        "Make every gesture speed the car up"
      ],
      "correctIndex": 0,
      "hint": "Consider a useful additional control action beyond steering or driving.",
      "explanation": "Slide 21 asks students to set any gesture as a stop-movement gesture."
    },
    {
      "id": "gesture-10",
      "learningSlide": 13,
      "topic": "adding-stop-command",
      "prompt": "When the car receives its instruction to move forward slowly, what does the lesson say it should do?",
      "choices": [
        "Change the instruction every millisecond",
        "Immediately erase all variables",
        "Maintain that movement command for a period",
        "Switch off the gesture sensor permanently"
      ],
      "correctIndex": 2,
      "hint": "The lesson distinguishes a movement command from an instantaneous impulse.",
      "explanation": "Slide 13 says the car should maintain its current slow-forward command for a period of time."
    }
  ]
};
