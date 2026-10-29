import type { QuizBank } from "../../quizStudio";
/** Questions sourced from the original 23-slide Level 6 Learning PDF. */
export const autonomousDrivingBank: QuizBank = {
  "projectId": "level-6-autonomous-driving",
  "title": "Autonomous Driving",
  "sourcePdfPath": "public/Level 6/Learning/Programming & Precise Control/Autonomous Driving/18.Autonomous Driving -Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "ad6-01",
      "topic": "autonomous-navigation",
      "learningSlide": 5,
      "prompt": "How does a self-driving car detect its surroundings?",
      "choices": [
        "With onboard sensors and cameras",
        "Only by counting its wheel colours",
        "Only by reading a printed map",
        "By checking a fixed motor speed"
      ],
      "correctIndex": 0,
      "hint": "Think about real-time sensing and road recognition.",
      "explanation": "Slide 5 describes sensors and cameras supplying driving information."
    },
    {
      "id": "ad6-02",
      "topic": "autonomous-navigation",
      "learningSlide": 7,
      "prompt": "Which pair of abilities is key to autonomous driving?",
      "choices": [
        "Environmental sensing and decision-making control",
        "Painting and speaker volume",
        "Manual wheel turning and decoration",
        "Timing a classroom countdown"
      ],
      "correctIndex": 0,
      "hint": "The system must perceive and then decide.",
      "explanation": "Slide 7 highlights environmental acquisition and intelligent decision-making."
    },
    {
      "id": "ad6-03",
      "topic": "vision-offset",
      "learningSlide": 8,
      "prompt": "What return value represents the road in the middle of the AI vision screen?",
      "choices": [
        "120",
        "0",
        "240",
        "360"
      ],
      "correctIndex": 0,
      "hint": "The module reports positions from 0 to 240.",
      "explanation": "Slide 8 gives 120 for the middle of the road."
    },
    {
      "id": "ad6-04",
      "topic": "vision-offset",
      "learningSlide": 8,
      "prompt": "If the AI vision return value becomes smaller, where is the road?",
      "choices": [
        "Further to the left",
        "Further to the right",
        "Behind the robot",
        "At a higher temperature"
      ],
      "correctIndex": 0,
      "hint": "Compare 0, 120 and 240 on the vision scale.",
      "explanation": "Slide 8 says smaller values indicate the road is further left."
    },
    {
      "id": "ad6-05",
      "topic": "hardware",
      "learningSlide": 13,
      "prompt": "Which controller port is used for the AI vision module?",
      "choices": [
        "P8",
        "M1",
        "M2",
        "A motor output labelled M4"
      ],
      "correctIndex": 0,
      "hint": "Use the sensor connection rather than a motor port.",
      "explanation": "Slide 13 specifies the AI vision module on controller port P8."
    },
    {
      "id": "ad6-06",
      "topic": "hardware",
      "learningSlide": 16,
      "prompt": "Why does the program create a variable named result?",
      "choices": [
        "To store the road-recognition return value",
        "To count the PDF pages",
        "To record motor battery colour",
        "To replace the camera lens"
      ],
      "correctIndex": 0,
      "hint": "The returned recognition value changes while driving.",
      "explanation": "Slide 16 stores road recognition in the result variable."
    },
    {
      "id": "ad6-07",
      "topic": "steering-control",
      "learningSlide": 17,
      "prompt": "What should the robot do when its recognition result is less than 110?",
      "choices": [
        "Turn left",
        "Turn right",
        "Sound a temperature alarm",
        "Always move backward"
      ],
      "correctIndex": 0,
      "hint": "That reading puts the road on one side of the robot.",
      "explanation": "Slide 17 says values below 110 mean the robot should turn left."
    },
    {
      "id": "ad6-08",
      "topic": "steering-control",
      "learningSlide": 19,
      "prompt": "What does a recognition value between 110 and 130 mean for movement?",
      "choices": [
        "The robot is centered and moves forward",
        "The robot must turn right",
        "The road lies far left",
        "The system must stop and restart"
      ],
      "correctIndex": 0,
      "hint": "This band surrounds the center value 120.",
      "explanation": "Slide 19 directs forward motion for readings between 110 and 130."
    },
    {
      "id": "ad6-09",
      "topic": "extension",
      "learningSlide": 21,
      "prompt": "What extra display feature is requested in the expansion task?",
      "choices": [
        "Show arrows matching the car's actions",
        "Display an unrelated random number",
        "Turn off the screen during every turn",
        "Display only the school logo"
      ],
      "correctIndex": 0,
      "hint": "The screen should communicate the car's direction.",
      "explanation": "Slide 21 asks the screen to show directional arrows."
    },
    {
      "id": "ad6-10",
      "topic": "extension",
      "learningSlide": 22,
      "prompt": "Which three major systems are named as parts of an AGV?",
      "choices": [
        "Control, guidance and operation",
        "Colour, sound and decoration",
        "Temperature, humidity and rain",
        "Password, payment and receipt"
      ],
      "correctIndex": 0,
      "hint": "An automated guided vehicle needs navigation and task execution.",
      "explanation": "Slide 22 identifies control, guidance and operation systems."
    }
  ]
};
