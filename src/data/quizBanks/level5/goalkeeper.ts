/** Questions checked against the official 20-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const goalkeeperBank: QuizBank = {
  "projectId": "level-5-goalkeeper",
  "title": "Goalkeeper",
  "sourcePdfPath": "public/Level 5/Learning/Action-Oriented/Goalkeeper/23.Goalkeeper-Slides.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "level-5-goalkeeper-01",
      "topic": "ball-detection",
      "learningSlide": 7,
      "prompt": "What ball color is the AI module set to recognize by default in the goalkeeper lesson?",
      "choices": [
        "Red",
        "Blue",
        "Green",
        "Black"
      ],
      "correctIndex": 0,
      "hint": "The first color setting is stated on the recognition slide.",
      "explanation": "Slide 7 says the AI module recognizes the red ball by default."
    },
    {
      "id": "level-5-goalkeeper-02",
      "topic": "ball-detection",
      "learningSlide": 7,
      "prompt": "What information does the camera determine after identifying the intended ball?",
      "choices": [
        "The ball's X and Y coordinates",
        "The room's relative humidity",
        "The motor's temperature",
        "The ball's country of manufacture"
      ],
      "correctIndex": 0,
      "hint": "The camera finds where the ball appears in its image.",
      "explanation": "Slide 7 says the camera recognizes the red ball and captures its XY coordinates."
    },
    {
      "id": "level-5-goalkeeper-03",
      "topic": "recognition-settings",
      "learningSlide": 8,
      "prompt": "How can the recognized ball color be changed using the AI module described in the lesson?",
      "choices": [
        "Turn its wheel upward to change color",
        "Change the controller's battery",
        "Reverse the drive motor",
        "Place the ball behind the camera"
      ],
      "correctIndex": 0,
      "hint": "The slide gives a physical adjustment for choosing a different color.",
      "explanation": "Slide 8 instructs turning the wheel upward to change the selected ball color."
    },
    {
      "id": "level-5-goalkeeper-04",
      "topic": "recognition-settings",
      "learningSlide": 13,
      "prompt": "Which mode must the program select before the goalkeeper begins sensing the ball?",
      "choices": [
        "Ball recognition mode",
        "Face attendance mode",
        "Traffic sign recognition mode",
        "Barometric reading mode"
      ],
      "correctIndex": 0,
      "hint": "The robot must look specifically for a ball.",
      "explanation": "Slide 13 lists switching the AI module to ball recognition mode as part of initialization."
    },
    {
      "id": "level-5-goalkeeper-05",
      "topic": "hardware-and-calibration",
      "learningSlide": 11,
      "prompt": "Which port is assigned to the AI module in the goalkeeper model?",
      "choices": [
        "P8",
        "M1",
        "M2",
        "P1"
      ],
      "correctIndex": 0,
      "hint": "The camera module uses a P port.",
      "explanation": "Slide 11 instructs connecting the AI module to P8."
    },
    {
      "id": "level-5-goalkeeper-06",
      "topic": "hardware-and-calibration",
      "learningSlide": 11,
      "prompt": "Which Y-coordinate reference does the lesson use for deciding the goalkeeper's left or right movement?",
      "choices": [
        "106",
        "1",
        "2400",
        "0.02"
      ],
      "correctIndex": 0,
      "hint": "The reference comes from measuring the ball near the goal center.",
      "explanation": "Slide 11 selects approximately Y = 106 as the decision value for moving left or right."
    },
    {
      "id": "level-5-goalkeeper-07",
      "topic": "goalkeeper-program",
      "learningSlide": 14,
      "prompt": "What does the new variable Y store in the example program?",
      "choices": [
        "The Y coordinate returned by ball recognition",
        "The motor's electrical power",
        "The robot's battery life",
        "The number of fans running"
      ],
      "correctIndex": 0,
      "hint": "The sensor's vertical-coordinate reading is saved.",
      "explanation": "Slide 14 instructs setting Y from AI ball recognition and displaying it."
    },
    {
      "id": "level-5-goalkeeper-08",
      "topic": "goalkeeper-program",
      "learningSlide": 15,
      "prompt": "With the touch sensor pressed and 0 < Y < 106, what does the lesson command?",
      "choices": [
        "Move the goalkeeper right",
        "Move the goalkeeper left",
        "Disable ball detection",
        "Ring an attendance alarm"
      ],
      "correctIndex": 0,
      "hint": "Check both the touch-sensor state and the Y threshold.",
      "explanation": "Slide 15 describes moving right when the touch sensor is pressed and Y is between 0 and 106."
    },
    {
      "id": "level-5-goalkeeper-09",
      "topic": "movement-limits",
      "learningSlide": 16,
      "prompt": "Which condition in the provided program makes the goalkeeper move left?",
      "choices": [
        "Touch not pressed and Y greater than 106",
        "Touch pressed and Y exactly 0",
        "Humidity above 90%",
        "Detected code equals a saved password"
      ],
      "correctIndex": 0,
      "hint": "The left move uses the opposite touch state and a larger coordinate.",
      "explanation": "Slide 16 states that the goalkeeper moves left when touch is not pressed and Y exceeds 106."
    },
    {
      "id": "level-5-goalkeeper-10",
      "topic": "movement-limits",
      "learningSlide": 18,
      "prompt": "What extra hardware does the goalkeeper extension propose adding?",
      "choices": [
        "A second touch sensor",
        "A barometric pressure sensor",
        "A new color-changing LCD panel",
        "A heat gun"
      ],
      "correctIndex": 0,
      "hint": "The extension adds another contact detector.",
      "explanation": "Slide 18 proposes a second touch sensor to help control motion limits."
    }
  ]
};
