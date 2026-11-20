/** Questions grounded in Ball Tracking Learning PDF. */
import type { QuizBank } from "../quizStudio";
export const ballTrackingBank: QuizBank = {
  "projectId": "level-6-ball-tracking",
  "title": "Ball Tracking",
  "sourcePdfPath": "public/Level 6/Learning/Sensor-Focused Robots/Ball Tracking/08.Ball Tracking.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "bt01",
      "topic": "ball-recognition",
      "learningSlide": 6,
      "prompt": "Which ball color does the lesson say the AI module usually recognizes by default?",
      "choices": [
        "Blue",
        "Green",
        "Red",
        "Yellow"
      ],
      "correctIndex": 2,
      "explanation": "The lecture states that the default blob recognition is for red objects.",
      "hint": "Think about the sample ball in the recognition lesson."
    },
    {
      "id": "bt02",
      "topic": "ball-recognition",
      "learningSlide": 6,
      "prompt": "What information is captured when a matching ball is recognized?",
      "choices": [
        "Its X and Y coordinates",
        "Its atmospheric pressure",
        "Its motor current",
        "Its audio frequency"
      ],
      "correctIndex": 0,
      "explanation": "The module returns the ball's horizontal and vertical coordinates.",
      "hint": "Think about the two values used to locate an object in an image."
    },
    {
      "id": "bt03",
      "topic": "coordinates",
      "learningSlide": 7,
      "prompt": "What is the X-coordinate range in the lesson's camera recognition mode?",
      "choices": [
        "0–120",
        "0–240",
        "0–360",
        "0–160"
      ],
      "correctIndex": 3,
      "explanation": "Slide 7 gives an X range from 0 to 160.",
      "hint": "Think about which coordinate runs horizontally."
    },
    {
      "id": "bt04",
      "topic": "coordinates",
      "learningSlide": 7,
      "prompt": "What is the Y-coordinate range in the lesson's camera recognition mode?",
      "choices": [
        "0–160",
        "0–120",
        "0–240",
        "0–360"
      ],
      "correctIndex": 1,
      "explanation": "Slide 7 gives a Y range from 0 to 120.",
      "hint": "Think about which coordinate runs vertically."
    },
    {
      "id": "bt05",
      "topic": "hardware",
      "learningSlide": 10,
      "prompt": "Which controller ports are connected to the two drive motors?",
      "choices": [
        "P7 and P8",
        "M1 and M2",
        "M3 and M4",
        "P1 and P2"
      ],
      "correctIndex": 1,
      "explanation": "The lesson connects motors to M1 and M2.",
      "hint": "Recall which ports are labeled as motor outputs."
    },
    {
      "id": "bt06",
      "topic": "hardware",
      "learningSlide": 10,
      "prompt": "Where should the AI audio-visual module be installed on the ball tracking robot?",
      "choices": [
        "Under the wheels",
        "Inside a sealed motor casing",
        "At the end of a rear axle",
        "On top of the robot"
      ],
      "correctIndex": 3,
      "explanation": "Slide 10 instructs installing the camera module on top.",
      "hint": "Think about which placement gives the camera a clear view."
    },
    {
      "id": "bt07",
      "topic": "ball-program",
      "learningSlide": 12,
      "prompt": "Which recognition mode is selected at the start of programming?",
      "choices": [
        "Ball recognition mode",
        "Road recognition mode",
        "Face detection mode",
        "QR code recognition mode"
      ],
      "correctIndex": 0,
      "explanation": "The programming task selects ball recognition mode.",
      "hint": "Think about the category of object the robot must follow."
    },
    {
      "id": "bt08",
      "topic": "ball-program",
      "learningSlide": 15,
      "prompt": "In the lesson's sample code, what happens when X equals zero?",
      "choices": [
        "M1 and M2 run at full speed",
        "The robot turns right",
        "M1 and M2 stop",
        "The camera switches to face mode"
      ],
      "correctIndex": 2,
      "explanation": "The lesson's program uses X=0 as its no-ball condition and stops both motors.",
      "hint": "Answer using the stated program rule, not the general mathematical meaning of x=0."
    },
    {
      "id": "bt09",
      "topic": "motor-control",
      "learningSlide": 16,
      "prompt": "In the tracking program, which value mainly controls left and right turning?",
      "choices": [
        "Go",
        "K1",
        "turn",
        "K2"
      ],
      "correctIndex": 2,
      "explanation": "The lesson says turn changes with the ball's X-coordinate to steer left or right.",
      "hint": "Think about which variable is based on horizontal position."
    },
    {
      "id": "bt10",
      "topic": "motor-control",
      "learningSlide": 17,
      "prompt": "What motor-speed expressions are used for M1 and M2?",
      "choices": [
        "Go and Go",
        "Go + turn and Go − turn",
        "turn and turn",
        "Go × turn and Go / turn"
      ],
      "correctIndex": 1,
      "explanation": "The two wheel motors use Go + turn and Go − turn to steer toward the ball.",
      "hint": "Think about using different wheel speeds to change direction."
    }
  ]
};
