/** Questions grounded in Autonomous Driving Learning PDF. */
import type { QuizBank } from "../quizStudio";
export const autonomousDrivingBank: QuizBank = {
  "projectId": "level-5-autonomous-driving",
  "title": "Autonomous Driving",
  "sourcePdfPath": "public/Level 5/Learning/Autonomous Navigation & Ranging/Autonomous driving/03. Autonomous Driving.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "ad01",
      "topic": "road-perception",
      "learningSlide": 4,
      "prompt": "What information does an autonomous driving car use to control steering and speed?",
      "choices": [
        "Only the color of its battery case",
        "Only the music volume",
        "Road position and obstacle information from sensors",
        "Only the time on its display"
      ],
      "correctIndex": 2,
      "explanation": "The lesson describes sensing roads, vehicle location and obstacles to control movement.",
      "hint": "Think about what the car must notice before steering safely."
    },
    {
      "id": "ad02",
      "topic": "road-perception",
      "learningSlide": 6,
      "prompt": "What does the camera module use to keep the robot following a marked road?",
      "choices": [
        "An offset value for the road marking",
        "Barometric air pressure",
        "Motor temperature",
        "Stored song duration"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 uses the camera's road-marking offset to adjust the two wheels.",
      "hint": "Think about how the robot knows whether it is left or right of the line."
    },
    {
      "id": "ad03",
      "topic": "road-offsets",
      "learningSlide": 7,
      "prompt": "What offset value represents the marked road at the center?",
      "choices": [
        "0",
        "60",
        "240",
        "120"
      ],
      "correctIndex": 3,
      "explanation": "Slide 7 sets the center offset at 120.",
      "hint": "Recall the reference used when the road is centered."
    },
    {
      "id": "ad04",
      "topic": "road-offsets",
      "learningSlide": 7,
      "prompt": "What does an offset less than 120 indicate?",
      "choices": [
        "The road is to the right",
        "The road is to the left",
        "The road has disappeared",
        "The car has stopped"
      ],
      "correctIndex": 1,
      "explanation": "The lesson maps lower values to a road marking on the left.",
      "hint": "Compare the returned value to the 120 midpoint."
    },
    {
      "id": "ad05",
      "topic": "hardware",
      "learningSlide": 11,
      "prompt": "Which ports receive the two drive motors in this project?",
      "choices": [
        "P1 and P2",
        "M1 and M2",
        "P7 and P8",
        "M3 and M4"
      ],
      "correctIndex": 1,
      "explanation": "Slide 11 connects the two motors to M1 and M2.",
      "hint": "Recall which port labels are used for motor outputs."
    },
    {
      "id": "ad06",
      "topic": "hardware",
      "learningSlide": 11,
      "prompt": "Where does the AI audio-visual module connect to the controller?",
      "choices": [
        "M1",
        "M2",
        "P1",
        "P8"
      ],
      "correctIndex": 3,
      "explanation": "The lecture lists port P8 for the AI audio-visual module.",
      "hint": "Think about the port used for the camera input instead of a drive motor."
    },
    {
      "id": "ad07",
      "topic": "steering-decisions",
      "learningSlide": 15,
      "prompt": "In the example program, what does the robot do when the road result is below 110?",
      "choices": [
        "Turns left",
        "Turns right",
        "Moves straight",
        "Stops permanently"
      ],
      "correctIndex": 0,
      "explanation": "The program uses a result less than 110 to turn left.",
      "hint": "Compare the sensor reading with the left threshold."
    },
    {
      "id": "ad08",
      "topic": "steering-decisions",
      "learningSlide": 16,
      "prompt": "What action follows when the road result is above 130?",
      "choices": [
        "Turns left",
        "Moves straight",
        "Turns right",
        "Stops permanently"
      ],
      "correctIndex": 2,
      "explanation": "A result greater than 130 makes the robot turn right.",
      "hint": "Compare the result with the right threshold."
    },
    {
      "id": "ad09",
      "topic": "program-flow",
      "learningSlide": 14,
      "prompt": "What variable stores the road-recognition reading?",
      "choices": [
        "Altitude",
        "Pressure",
        "Result",
        "Sound"
      ],
      "correctIndex": 2,
      "explanation": "Slide 14 creates a variable called Result to hold the reading.",
      "hint": "Look for the variable name the program checks in its conditions."
    },
    {
      "id": "ad10",
      "topic": "program-flow",
      "learningSlide": 18,
      "prompt": "Why does the completed program include a repeat block?",
      "choices": [
        "To run the camera only once",
        "To keep checking and steering continuously",
        "To erase the previous result",
        "To switch the robot to music playback"
      ],
      "correctIndex": 1,
      "explanation": "The repeat block continuously runs the recognition and steering decisions.",
      "hint": "Think about how often a moving car must check the road."
    }
  ]
};
